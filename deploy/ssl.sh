#!/bin/bash
set -euo pipefail

DOMAIN="${DOMAIN:-ecoverde.kz}"
EMAIL="${EMAIL:-ecoverdekz@gmail.com}"

echo "==> Installing certbot..."
sudo apt-get update
sudo apt-get install -y certbot

echo "==> Obtaining certificate for ${DOMAIN} and www.${DOMAIN}..."
sudo certbot certonly --standalone \
  --preferred-challenges http \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --non-interactive

echo "==> Certificate installed."
echo "Next step: configure HTTPS reverse proxy (see deploy/nginx-ssl.conf)."
