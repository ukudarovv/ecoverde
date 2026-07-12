import logging
from html import escape

import httpx
from django.conf import settings

from feedback.models import FeedbackSubmission, TelegramAdmin, TelegramSubscriber

logger = logging.getLogger(__name__)

TELEGRAM_API_BASE = "https://api.telegram.org/bot{token}"
PAGE_SIZE = 10


def _telegram_api_url(method: str) -> str:
    return f"{TELEGRAM_API_BASE.format(token=settings.TELEGRAM_BOT_TOKEN)}/{method}"


def send_telegram_message(
    chat_id: str | int,
    text: str,
    reply_markup: dict | None = None,
) -> bool:
    if not settings.TELEGRAM_BOT_TOKEN or not chat_id:
        logger.warning("Telegram message skipped: missing token or chat_id")
        return False

    payload: dict = {"chat_id": chat_id, "text": text, "parse_mode": "HTML"}
    if reply_markup:
        payload["reply_markup"] = reply_markup

    try:
        response = httpx.post(
            _telegram_api_url("sendMessage"),
            json=payload,
            timeout=10.0,
        )
        response.raise_for_status()
        data = response.json()
        if not data.get("ok"):
            logger.error("Telegram API error: %s", data)
            return False
        return True
    except httpx.HTTPError as exc:
        logger.exception("Failed to send Telegram message: %s", exc)
        return False


def get_active_admin_chat_ids() -> list[int]:
    ids = list(TelegramAdmin.objects.filter(is_active=True).values_list("chat_id", flat=True))
    if not ids and settings.TELEGRAM_ADMIN_CHAT_ID:
        try:
            ids = [int(settings.TELEGRAM_ADMIN_CHAT_ID)]
        except ValueError:
            logger.warning("Invalid TELEGRAM_ADMIN_CHAT_ID: %s", settings.TELEGRAM_ADMIN_CHAT_ID)
    return ids


def is_telegram_admin(chat_id: int) -> bool:
    if TelegramAdmin.objects.filter(chat_id=chat_id, is_active=True).exists():
        return True
    if settings.TELEGRAM_ADMIN_CHAT_ID:
        try:
            return chat_id == int(settings.TELEGRAM_ADMIN_CHAT_ID)
        except ValueError:
            return False
    return False


def update_admin_username(chat_id: int, username: str | None) -> None:
    normalized = TelegramSubscriber.normalize_username(username)
    if not normalized:
        return
    TelegramAdmin.objects.filter(chat_id=chat_id).update(username=normalized)


def format_admin_message(submission: FeedbackSubmission) -> str:
    telegram_line = (
        f"Telegram: @{escape(submission.telegram_username)}"
        if submission.telegram_username
        else "Telegram: —"
    )
    phone_line = submission.phone or "—"
    company_line = submission.company or "—"

    return (
        f"<b>Новая заявка EcoVerde #{submission.pk}</b>\n"
        f"Имя: {escape(submission.name)}\n"
        f"Email: {escape(submission.email)}\n"
        f"Телефон: {escape(phone_line)}\n"
        f"Компания: {escape(company_line)}\n"
        f"{telegram_line}\n"
        f"Язык: {escape(submission.lang)}\n"
        f"Сообщение: {escape(submission.message)}"
    )


def format_submission_detail(submission: FeedbackSubmission) -> str:
    telegram_line = (
        f"@{escape(submission.telegram_username)}"
        if submission.telegram_username
        else "—"
    )
    return (
        f"<b>Заявка #{submission.pk}</b>\n"
        f"Дата: {submission.created_at:%d.%m.%Y %H:%M}\n"
        f"Имя: {escape(submission.name)}\n"
        f"Email: {escape(submission.email)}\n"
        f"Телефон: {escape(submission.phone or '—')}\n"
        f"Компания: {escape(submission.company or '—')}\n"
        f"Telegram: {telegram_line}\n"
        f"Язык: {escape(submission.lang)}\n"
        f"Сообщение:\n{escape(submission.message)}"
    )


def format_submissions_list(page: int = 1) -> str:
    offset = (page - 1) * PAGE_SIZE
    submissions = list(
        FeedbackSubmission.objects.order_by("-created_at")[offset : offset + PAGE_SIZE]
    )
    total = FeedbackSubmission.objects.count()

    if not submissions:
        return "Заявок пока нет."

    lines = [f"<b>Заявки EcoVerde</b> (стр. {page})\n"]
    for sub in submissions:
        lines.append(
            f"#{sub.pk} | {escape(sub.name)} | {escape(sub.email)} | {sub.created_at:%d.%m.%Y %H:%M}"
        )

    if total > page * PAGE_SIZE:
        lines.append(f"\nСледующая страница: /list {page + 1}")
    if page > 1:
        lines.append(f"Предыдущая страница: /list {page - 1}")

    return "\n".join(lines)


def format_user_confirmation(submission: FeedbackSubmission) -> str:
    messages = {
        "RU": (
            f"Спасибо, {submission.name}! Ваша заявка #{submission.pk} принята.\n"
            "Мы свяжемся с вами в ближайшее время."
        ),
        "EN": (
            f"Thank you, {submission.name}! Your request #{submission.pk} has been received.\n"
            "We will contact you shortly."
        ),
        "KZ": (
            f"Рахмет, {submission.name}! Сіздің #{submission.pk} өтінішіңіз қабылданды.\n"
            "Жақын арада сізбен байланысамыз."
        ),
    }
    return messages.get(submission.lang, messages["RU"])


def find_subscriber_by_username(username: str) -> TelegramSubscriber | None:
    normalized = TelegramSubscriber.normalize_username(username)
    if not normalized:
        return None
    return TelegramSubscriber.objects.filter(username__iexact=normalized).first()


def process_feedback_notifications(submission: FeedbackSubmission) -> str:
    confirmation_status = "not_requested"
    admin_chat_ids = get_active_admin_chat_ids()
    admin_sent = False

    if admin_chat_ids:
        reply_markup = {
            "inline_keyboard": [
                [{"text": f"Подробнее #{submission.pk}", "callback_data": f"view:{submission.pk}"}]
            ]
        }
        for chat_id in admin_chat_ids:
            if send_telegram_message(
                chat_id,
                format_admin_message(submission),
                reply_markup=reply_markup,
            ):
                admin_sent = True
    else:
        logger.warning("No active Telegram admins configured")

    submission.telegram_sent_to_admin = admin_sent

    if submission.normalized_telegram_username:
        subscriber = find_subscriber_by_username(submission.telegram_username)
        if subscriber:
            user_sent = send_telegram_message(
                subscriber.chat_id,
                format_user_confirmation(submission),
            )
            submission.telegram_sent_to_user = user_sent
            confirmation_status = "sent" if user_sent else "pending_start_bot"
        else:
            confirmation_status = "pending_start_bot"
    else:
        confirmation_status = "not_requested"

    submission.save(update_fields=["telegram_sent_to_admin", "telegram_sent_to_user"])
    return confirmation_status
