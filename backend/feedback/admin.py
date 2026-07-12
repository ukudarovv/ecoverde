from django.contrib import admin

from .models import FeedbackSubmission, TelegramAdmin, TelegramSubscriber


@admin.register(FeedbackSubmission)
class FeedbackSubmissionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "email",
        "phone",
        "company",
        "telegram_username",
        "lang",
        "created_at",
        "telegram_sent_to_admin",
        "telegram_sent_to_user",
    )
    list_filter = ("lang", "telegram_sent_to_admin", "telegram_sent_to_user", "created_at")
    search_fields = ("name", "email", "phone", "company", "telegram_username", "message")
    readonly_fields = ("created_at", "telegram_sent_to_admin", "telegram_sent_to_user")


@admin.register(TelegramSubscriber)
class TelegramSubscriberAdmin(admin.ModelAdmin):
    list_display = ("chat_id", "username", "first_name", "created_at", "updated_at")
    search_fields = ("chat_id", "username", "first_name")
    readonly_fields = ("created_at", "updated_at")


@admin.register(TelegramAdmin)
class TelegramAdminAdmin(admin.ModelAdmin):
    list_display = ("chat_id", "name", "username", "is_active", "created_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("chat_id", "name", "username")
    readonly_fields = ("created_at",)
    fieldsets = (
        (
            None,
            {
                "fields": ("chat_id", "name", "username", "is_active"),
                "description": (
                    "Укажите Telegram Chat ID администратора. "
                    "Админ должен нажать /start у бота, иначе Telegram не доставит сообщения. "
                    "Chat ID можно узнать через @userinfobot."
                ),
            },
        ),
        ("Служебное", {"fields": ("created_at",)}),
    )
