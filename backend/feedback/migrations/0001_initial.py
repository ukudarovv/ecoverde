from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="FeedbackSubmission",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=150, verbose_name="Имя")),
                ("email", models.EmailField(max_length=254, verbose_name="Email")),
                ("phone", models.CharField(blank=True, max_length=30, verbose_name="Телефон")),
                ("company", models.CharField(blank=True, max_length=150, verbose_name="Компания")),
                ("telegram_username", models.CharField(blank=True, max_length=64, verbose_name="Telegram username")),
                ("message", models.TextField(verbose_name="Сообщение")),
                (
                    "lang",
                    models.CharField(
                        choices=[("RU", "Русский"), ("EN", "English"), ("KZ", "Қазақша")],
                        default="RU",
                        max_length=2,
                        verbose_name="Язык",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="Создано")),
                ("telegram_sent_to_admin", models.BooleanField(default=False, verbose_name="Отправлено админу")),
                ("telegram_sent_to_user", models.BooleanField(default=False, verbose_name="Отправлено пользователю")),
            ],
            options={
                "verbose_name": "Заявка",
                "verbose_name_plural": "Заявки",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="TelegramSubscriber",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("chat_id", models.BigIntegerField(unique=True, verbose_name="Chat ID")),
                ("username", models.CharField(blank=True, db_index=True, max_length=64, null=True, verbose_name="Username")),
                ("first_name", models.CharField(blank=True, max_length=150, verbose_name="Имя")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="Подписан")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="Обновлён")),
            ],
            options={
                "verbose_name": "Подписчик Telegram",
                "verbose_name_plural": "Подписчики Telegram",
                "ordering": ["-created_at"],
            },
        ),
    ]
