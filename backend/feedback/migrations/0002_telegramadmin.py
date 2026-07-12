from django.db import migrations, models


def import_admin_from_env(apps, schema_editor):
    import os

    chat_id = os.getenv("TELEGRAM_ADMIN_CHAT_ID", "").strip()
    if not chat_id:
        return

    try:
        chat_id_int = int(chat_id)
    except ValueError:
        return

    TelegramAdmin = apps.get_model("feedback", "TelegramAdmin")
    TelegramAdmin.objects.get_or_create(
        chat_id=chat_id_int,
        defaults={"name": "Из .env", "is_active": True},
    )


class Migration(migrations.Migration):
    dependencies = [
        ("feedback", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="TelegramAdmin",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("chat_id", models.BigIntegerField(unique=True, verbose_name="Chat ID")),
                ("name", models.CharField(blank=True, max_length=150, verbose_name="Имя / подпись")),
                ("username", models.CharField(blank=True, max_length=64, verbose_name="Username")),
                ("is_active", models.BooleanField(default=True, verbose_name="Активен")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="Добавлен")),
            ],
            options={
                "verbose_name": "Администратор Telegram",
                "verbose_name_plural": "Администраторы Telegram",
                "ordering": ["-created_at"],
            },
        ),
        migrations.RunPython(import_admin_from_env, migrations.RunPython.noop),
    ]
