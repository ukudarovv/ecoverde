from django.db import models


class FeedbackSubmission(models.Model):
    class Language(models.TextChoices):
        RU = "RU", "Русский"
        EN = "EN", "English"
        KZ = "KZ", "Қазақша"

    name = models.CharField("Имя", max_length=150)
    email = models.EmailField("Email")
    phone = models.CharField("Телефон", max_length=30, blank=True)
    company = models.CharField("Компания", max_length=150, blank=True)
    telegram_username = models.CharField("Telegram username", max_length=64, blank=True)
    message = models.TextField("Сообщение")
    lang = models.CharField("Язык", max_length=2, choices=Language.choices, default=Language.RU)
    created_at = models.DateTimeField("Создано", auto_now_add=True)
    telegram_sent_to_admin = models.BooleanField("Отправлено админу", default=False)
    telegram_sent_to_user = models.BooleanField("Отправлено пользователю", default=False)

    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"
        ordering = ["-created_at"]

    def __str__(self):
        return f"#{self.pk} {self.name} ({self.email})"

    @property
    def normalized_telegram_username(self):
        username = self.telegram_username.strip().lstrip("@")
        return username.lower() if username else ""


class TelegramSubscriber(models.Model):
    chat_id = models.BigIntegerField("Chat ID", unique=True)
    username = models.CharField("Username", max_length=64, blank=True, null=True, db_index=True)
    first_name = models.CharField("Имя", max_length=150, blank=True)
    created_at = models.DateTimeField("Подписан", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлён", auto_now=True)

    class Meta:
        verbose_name = "Подписчик Telegram"
        verbose_name_plural = "Подписчики Telegram"
        ordering = ["-created_at"]

    def __str__(self):
        label = self.username or self.first_name or str(self.chat_id)
        return f"@{label}" if self.username else label

    @classmethod
    def normalize_username(cls, username):
        if not username:
            return None
        normalized = username.strip().lstrip("@")
        return normalized.lower() if normalized else None
