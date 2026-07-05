import logging
from html import escape

import httpx
from django.conf import settings

from feedback.models import FeedbackSubmission, TelegramSubscriber

logger = logging.getLogger(__name__)

TELEGRAM_API_BASE = "https://api.telegram.org/bot{token}"


def _telegram_api_url(method: str) -> str:
    return f"{TELEGRAM_API_BASE.format(token=settings.TELEGRAM_BOT_TOKEN)}/{method}"


def send_telegram_message(chat_id: str | int, text: str) -> bool:
    if not settings.TELEGRAM_BOT_TOKEN or not chat_id:
        logger.warning("Telegram message skipped: missing token or chat_id")
        return False

    try:
        response = httpx.post(
            _telegram_api_url("sendMessage"),
            json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"},
            timeout=10.0,
        )
        response.raise_for_status()
        payload = response.json()
        if not payload.get("ok"):
            logger.error("Telegram API error: %s", payload)
            return False
        return True
    except httpx.HTTPError as exc:
        logger.exception("Failed to send Telegram message: %s", exc)
        return False


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

    if settings.TELEGRAM_ADMIN_CHAT_ID:
        admin_sent = send_telegram_message(
            settings.TELEGRAM_ADMIN_CHAT_ID,
            format_admin_message(submission),
        )
        submission.telegram_sent_to_admin = admin_sent
    else:
        logger.warning("TELEGRAM_ADMIN_CHAT_ID is not configured")

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

    submission.save(
        update_fields=["telegram_sent_to_admin", "telegram_sent_to_user"]
    )
    return confirmation_status
