#!/bin/bash
set -euo pipefail
cd /opt/ecoverde
git pull --ff-only
sudo docker compose up -d --build frontend
sudo docker compose ps frontend
