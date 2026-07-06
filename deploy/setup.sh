#!/bin/bash
set -euo pipefail

DOMAIN="${DOMAIN:-ecoverde.kz}"
APP_DIR="${APP_DIR:-/opt/ecoverde}"
REPO_URL="${REPO_URL:-https://github.com/ukudarovv/ecoverde.git}"

echo "==> Stopping Docker containers (if any)..."
if [ -f "$APP_DIR/docker-compose.yml" ]; then
  cd "$APP_DIR"
  sudo docker compose down 2>/dev/null || true
fi

echo "==> Installing system packages..."
sudo apt-get update
sudo apt-get install -y \
  python3 python3-venv python3-pip \
  nginx git curl ca-certificates

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

if ! command -v pnpm >/dev/null 2>&1; then
  sudo npm install -g pnpm
fi

echo "==> Preparing app directory..."
sudo mkdir -p "$APP_DIR"
sudo chown -R "$USER:$USER" "$APP_DIR"

if [ ! -d "$APP_DIR/.git" ]; then
  git clone "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"
git pull --ff-only

if [ ! -f .env ]; then
  cp .env.example .env
  SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(50))')
  sed -i "s|^SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|" .env
  sed -i "s|^DEBUG=.*|DEBUG=False|" .env
  sed -i "s|^ALLOWED_HOSTS=.*|ALLOWED_HOSTS=${DOMAIN},www.${DOMAIN},213.155.21.70,127.0.0.1,localhost|" .env
  sed -i "s|^CORS_ALLOWED_ORIGINS=.*|CORS_ALLOWED_ORIGINS=https://${DOMAIN},https://www.${DOMAIN},http://${DOMAIN},http://www.${DOMAIN}|" .env
  echo "Created .env — fill TELEGRAM_* values if needed."
fi

echo "==> Setting up Python backend..."
mkdir -p "$APP_DIR/backend/data"
VOLUME_PATH=$(sudo docker volume inspect ecoverde_sqlite_data -f '{{.Mountpoint}}' 2>/dev/null || true)
if [ -n "$VOLUME_PATH" ] && [ -f "$VOLUME_PATH/db.sqlite3" ]; then
  echo "==> Migrating SQLite from Docker volume..."
  cp "$VOLUME_PATH/db.sqlite3" "$APP_DIR/backend/data/db.sqlite3"
fi
cd "$APP_DIR/backend"
python3 -m venv .venv
.venv/bin/pip install --upgrade pip
.venv/bin/pip install -r requirements.txt
.venv/bin/python manage.py migrate --noinput
.venv/bin/python manage.py collectstatic --noinput

echo "==> Building frontend..."
cd "$APP_DIR/frontend"
pnpm install --frozen-lockfile 2>/dev/null || pnpm install
set -a
source "$APP_DIR/.env"
set +a
VITE_API_URL=/api VITE_TELEGRAM_BOT_USERNAME="${TELEGRAM_BOT_USERNAME:-eco_verde_bot}" pnpm build

echo "==> Configuring nginx..."
if [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
  sudo cp "$APP_DIR/deploy/nginx.ssl.conf" /etc/nginx/sites-available/ecoverde
else
  sudo cp "$APP_DIR/deploy/nginx.http.conf" /etc/nginx/sites-available/ecoverde
fi
sudo ln -sf /etc/nginx/sites-available/ecoverde /etc/nginx/sites-enabled/ecoverde
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

echo "==> Installing systemd services..."
sudo cp "$APP_DIR/deploy/ecoverde-backend.service" /etc/systemd/system/
sudo cp "$APP_DIR/deploy/ecoverde-telegram.service" /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable ecoverde-backend ecoverde-telegram
sudo systemctl restart ecoverde-backend
sudo systemctl restart ecoverde-telegram || echo "Telegram bot skipped (check TELEGRAM_BOT_TOKEN in .env)"

echo "==> Done."
sudo systemctl status ecoverde-backend --no-pager -l | head -5
echo "Site: https://${DOMAIN} (or http if SSL not configured)"
