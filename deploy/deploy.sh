#!/bin/bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/ecoverde}"
cd "$APP_DIR"

echo "==> Pulling latest code..."
git pull --ff-only

echo "==> Updating backend..."
cd "$APP_DIR/backend"
.venv/bin/pip install -r requirements.txt -q
.venv/bin/python manage.py migrate --noinput
.venv/bin/python manage.py collectstatic --noinput

echo "==> Building frontend..."
cd "$APP_DIR/frontend"
pnpm install --frozen-lockfile 2>/dev/null || pnpm install
set -a
source "$APP_DIR/.env"
set +a
VITE_API_URL=/api VITE_TELEGRAM_BOT_USERNAME="${TELEGRAM_BOT_USERNAME:-eco_verde_bot}" pnpm build

echo "==> Restarting services..."
sudo systemctl restart ecoverde-backend
sudo systemctl restart ecoverde-telegram || true
sudo nginx -t && sudo systemctl reload nginx

echo "==> Deploy complete."
sudo systemctl is-active ecoverde-backend nginx
