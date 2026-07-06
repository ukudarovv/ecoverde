#!/bin/bash
set -euo pipefail

DOMAIN="${DOMAIN:-ecoverde.kz}"
EMAIL="${EMAIL:-ecoverdekz@gmail.com}"
APP_DIR="${APP_DIR:-/opt/ecoverde}"

cd "$APP_DIR"

echo "==> Stopping nginx for certificate issuance..."
sudo systemctl stop nginx

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
sudo cp "$APP_DIR/deploy/nginx.ssl.conf" /etc/nginx/sites-available/ecoverde
sudo nginx -t
sudo systemctl start nginx

echo "==> Done. Check https://${DOMAIN}"
