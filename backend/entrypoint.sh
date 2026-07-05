#!/bin/sh
set -e

python manage.py migrate --noinput

if [ "$1" = "gunicorn" ] || [ -z "$1" ]; then
  python manage.py collectstatic --noinput
  exec gunicorn ecoverde.wsgi:application --bind 0.0.0.0:8000 --workers 2
fi

exec "$@"
