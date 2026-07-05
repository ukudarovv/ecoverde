#!/bin/bash
set -euo pipefail

DOMAIN="${DOMAIN:-ecoverde.kz}"
EMAIL="${EMAIL:-ecoverdekz@gmail.com}"
APP_DIR="${APP_DIR:-/opt/ecoverde}"

cd "$APP_DIR"

echo "==> Stopping frontend for certificate issuance..."
sudo docker compose stop frontend

echo "==> Installing certbot if needed..."
if ! command -v certbot >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y certbot
fi

echo "==> Requesting certificate..."
sudo certbot certonly --standalone \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --non-interactive

echo "==> Enabling SSL nginx config..."
cp frontend/nginx.ssl.conf frontend/nginx.conf

echo "==> Starting frontend with HTTPS..."
sudo docker compose up -d --build frontend

echo "==> Done. Check https://${DOMAIN}"
