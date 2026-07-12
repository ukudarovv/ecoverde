import logging

from asgiref.sync import sync_to_async
from django.conf import settings
from telegram import Update
from telegram.ext import ContextTypes

from feedback.models import FeedbackSubmission, TelegramSubscriber
from feedback.services.telegram import (
    format_submission_detail,
    format_submissions_list,
    is_telegram_admin,
    update_admin_username,
)

logger = logging.getLogger(__name__)

ACCESS_DENIED = "Доступ запрещён."


@sync_to_async
def register_subscriber(chat_id: int, username: str | None, first_name: str) -> TelegramSubscriber:
    subscriber, _created = TelegramSubscriber.objects.update_or_create(
        chat_id=chat_id,
        defaults={
            "username": username,
            "first_name": first_name,
        },
    )
    return subscriber


@sync_to_async
def get_submission(submission_id: int) -> FeedbackSubmission | None:
    return FeedbackSubmission.objects.filter(pk=submission_id).first()


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user
    chat = update.effective_chat
    if not user or not chat or not update.message:
        return

    normalized_username = TelegramSubscriber.normalize_username(user.username)
    subscriber = await register_subscriber(
        chat.id,
        normalized_username,
        user.first_name or "",
    )

    bot_username = settings.TELEGRAM_BOT_USERNAME
    username_hint = normalized_username or "username"

    if await sync_to_async(is_telegram_admin)(chat.id):
        await sync_to_async(update_admin_username)(chat.id, user.username)
        await update.message.reply_text(
            "Вы администратор EcoVerde.\n\n"
            "Команды:\n"
            "/list — последние заявки\n"
            "/view <id> — подробности заявки\n"
            "/help — справка\n\n"
            f"Бот: @{bot_username}"
        )
        logger.info("Admin started bot chat_id=%s", chat.id)
        return

    await update.message.reply_text(
        "Вы подписаны на уведомления EcoVerde.\n"
        f"Укажите в форме на сайте ваш Telegram username (@{username_hint}), "
        "чтобы получить подтверждение заявки.\n"
        f"Бот: @{bot_username}"
    )
    logger.info("Registered Telegram subscriber chat_id=%s username=%s", subscriber.chat_id, subscriber.username)


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message or not update.effective_chat:
        return

    bot_username = settings.TELEGRAM_BOT_USERNAME
    chat_id = update.effective_chat.id

    if await sync_to_async(is_telegram_admin)(chat_id):
        await update.message.reply_text(
            "EcoVerde — бот для администраторов.\n\n"
            "/list — список последних заявок\n"
            "/list 2 — следующая страница\n"
            "/view <id> — полная заявка, например /view 5\n\n"
            f"Бот: @{bot_username}"
        )
        return

    await update.message.reply_text(
        "EcoVerde — бот уведомлений.\n\n"
        "1. Нажмите /start, чтобы зарегистрироваться.\n"
        "2. Отправьте форму на сайте и укажите ваш Telegram username.\n"
        "3. После отправки вы получите подтверждение в этом чате.\n\n"
        f"Бот: @{bot_username}"
    )


async def list_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message or not update.effective_chat:
        return

    chat_id = update.effective_chat.id
    if not await sync_to_async(is_telegram_admin)(chat_id):
        await update.message.reply_text(ACCESS_DENIED)
        return

    page = 1
    if context.args:
        try:
            page = max(1, int(context.args[0]))
        except ValueError:
            await update.message.reply_text("Использование: /list или /list 2")
            return

    text = await sync_to_async(format_submissions_list)(page)
    await update.message.reply_text(text, parse_mode="HTML")


async def view_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message or not update.effective_chat:
        return

    chat_id = update.effective_chat.id
    if not await sync_to_async(is_telegram_admin)(chat_id):
        await update.message.reply_text(ACCESS_DENIED)
        return

    if not context.args:
        await update.message.reply_text("Использование: /view <id>, например /view 5")
        return

    try:
        submission_id = int(context.args[0])
    except ValueError:
        await update.message.reply_text("ID заявки должен быть числом.")
        return

    submission = await get_submission(submission_id)
    if not submission:
        await update.message.reply_text(f"Заявка #{submission_id} не найдена.")
        return

    text = await sync_to_async(format_submission_detail)(submission)
    await update.message.reply_text(text, parse_mode="HTML")


async def view_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    if not query or not query.data or not query.from_user:
        return

    chat_id = query.from_user.id
    if not await sync_to_async(is_telegram_admin)(chat_id):
        await query.answer("Доступ запрещён.", show_alert=True)
        return

    if not query.data.startswith("view:"):
        return

    try:
        submission_id = int(query.data.split(":", 1)[1])
    except (IndexError, ValueError):
        await query.answer("Некорректный ID.", show_alert=True)
        return

    submission = await get_submission(submission_id)
    if not submission:
        await query.answer(f"Заявка #{submission_id} не найдена.", show_alert=True)
        return

    text = await sync_to_async(format_submission_detail)(submission)
    await query.answer()
    await query.message.reply_text(text, parse_mode="HTML")
