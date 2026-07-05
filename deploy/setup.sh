#!/bin/bash
set -euo pipefail

DOMAIN="${DOMAIN:-ecoverde.kz}"
APP_DIR="${APP_DIR:-/opt/ecoverde}"
REPO_URL="${REPO_URL:-https://github.com/ukudarovv/ecoverde.git}"

echo "==> Installing Docker if needed..."
if ! command -v docker >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y ca-certificates curl git
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker "$USER" || true
fi

echo "==> Preparing app directory..."
sudo mkdir -p "$APP_DIR"
sudo chown -R "$USER:$USER" "$APP_DIR"

if [ ! -d "$APP_DIR/.git" ]; then
  git clone "$REPO_URL" "$APP_DIR"
else
  cd "$APP_DIR"
  git pull --ff-only
fi

cd "$APP_DIR"

if [ ! -f .env ]; then
  cp .env.example .env
  SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(50))')
  sed -i "s|^SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|" .env
  sed -i "s|^DEBUG=.*|DEBUG=False|" .env
  sed -i "s|^ALLOWED_HOSTS=.*|ALLOWED_HOSTS=${DOMAIN},www.${DOMAIN},213.155.21.70,backend,localhost|" .env
  sed -i "s|^CORS_ALLOWED_ORIGINS=.*|CORS_ALLOWED_ORIGINS=https://${DOMAIN},https://www.${DOMAIN},http://${DOMAIN},http://www.${DOMAIN}|" .env
  echo "Created .env from .env.example. Fill TELEGRAM_* values and rerun deploy."
fi

echo "==> Building and starting containers..."
docker compose pull || true
docker compose up -d --build

echo "==> Done. Site should be available on port 80."
docker compose ps
