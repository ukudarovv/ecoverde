from django.core.management.base import BaseCommand
from telegram import Update
from telegram.ext import Application, CallbackQueryHandler, CommandHandler

from feedback.services.bot_handlers import (
    help_command,
    list_command,
    start_command,
    view_callback,
    view_command,
)


class Command(BaseCommand):
    help = "Run EcoVerde Telegram bot with polling"

    def handle(self, *args, **options):
        from django.conf import settings

        token = settings.TELEGRAM_BOT_TOKEN
        if not token:
            self.stderr.write(self.style.ERROR("TELEGRAM_BOT_TOKEN is not configured"))
            return

        application = Application.builder().token(token).build()
        application.add_handler(CommandHandler("start", start_command))
        application.add_handler(CommandHandler("help", help_command))
        application.add_handler(CommandHandler("list", list_command))
        application.add_handler(CommandHandler("view", view_command))
        application.add_handler(CallbackQueryHandler(view_callback, pattern=r"^view:\d+$"))

        self.stdout.write(self.style.SUCCESS("Starting Telegram bot polling..."))
        application.run_polling(allowed_updates=Update.ALL_TYPES)
