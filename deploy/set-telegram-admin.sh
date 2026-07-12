#!/bin/bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/ecoverde}"
CHAT_ID="${1:-}"
NAME="${2:-Администратор}"

if [ -z "$CHAT_ID" ]; then
  echo "Usage: sudo bash deploy/set-telegram-admin.sh <CHAT_ID> [name]"
  echo ""
  echo "Рекомендуется добавлять админов через Django Admin:"
  echo "  https://ecoverde.kz/admin/ → Администраторы Telegram"
  echo ""
  echo "Этот скрипт — быстрый fallback: пишет chat_id в .env и создаёт запись в БД."
  echo "Chat ID: @userinfobot после /start у @eco_verde_bot"
  exit 1
fi

cd "$APP_DIR"
sed -i "s|^TELEGRAM_ADMIN_CHAT_ID=.*|TELEGRAM_ADMIN_CHAT_ID=${CHAT_ID}|" .env

cd "$APP_DIR/backend"
.venv/bin/python manage.py shell -c "
from feedback.models import TelegramAdmin
TelegramAdmin.objects.update_or_create(
    chat_id=${CHAT_ID},
    defaults={'name': '${NAME}', 'is_active': True},
)
print('TelegramAdmin saved:', ${CHAT_ID})
"

sudo systemctl restart ecoverde-backend ecoverde-telegram
sudo systemctl status ecoverde-telegram --no-pager -l | head -8
