#!/bin/bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/ecoverde}"
CHAT_ID="${1:-}"

if [ -z "$CHAT_ID" ]; then
  echo "Usage: sudo bash deploy/set-telegram-admin.sh <TELEGRAM_ADMIN_CHAT_ID>"
  echo "Get chat_id from @userinfobot after you press /start in @eco_verde_bot"
  exit 1
fi

cd "$APP_DIR"
sed -i "s|^TELEGRAM_ADMIN_CHAT_ID=.*|TELEGRAM_ADMIN_CHAT_ID=${CHAT_ID}|" .env
docker compose up -d telegram-bot backend
docker compose ps telegram-bot backend
