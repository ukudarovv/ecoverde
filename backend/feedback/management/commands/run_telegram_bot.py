import logging

from asgiref.sync import sync_to_async
from django.conf import settings
from django.core.management.base import BaseCommand
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

from feedback.models import TelegramSubscriber

logger = logging.getLogger(__name__)


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
    await update.message.reply_text(
        "Вы подписаны на уведомления EcoVerde.\n"
        f"Укажите в форме на сайте ваш Telegram username (@{username_hint}), "
        "чтобы получить подтверждение заявки.\n"
        f"Бот: @{bot_username}"
    )
    logger.info("Registered Telegram subscriber chat_id=%s username=%s", subscriber.chat_id, subscriber.username)


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message:
        return
    bot_username = settings.TELEGRAM_BOT_USERNAME
    await update.message.reply_text(
        "EcoVerde — бот уведомлений.\n\n"
        "1. Нажмите /start, чтобы зарегистрироваться.\n"
        "2. Отправьте форму на сайте и укажите ваш Telegram username.\n"
        "3. После отправки вы получите подтверждение в этом чате.\n\n"
        f"Бот: @{bot_username}"
    )


class Command(BaseCommand):
    help = "Run EcoVerde Telegram bot with polling"

    def handle(self, *args, **options):
        token = settings.TELEGRAM_BOT_TOKEN
        if not token:
            self.stderr.write(self.style.ERROR("TELEGRAM_BOT_TOKEN is not configured"))
            return

        application = (
            Application.builder()
            .token(token)
            .build()
        )
        application.add_handler(CommandHandler("start", start_command))
        application.add_handler(CommandHandler("help", help_command))

        self.stdout.write(self.style.SUCCESS("Starting Telegram bot polling..."))
        application.run_polling(allowed_updates=Update.ALL_TYPES)
