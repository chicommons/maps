#!/bin/bash
set -e

cd /app
python manage.py migrate
python manage.py migrate directory
python manage.py insert_seed_data

DJANGO_SUPERUSER_PASSWORD=password python manage.py createsuperuser --no-input --username=chicommons --email=chicommons@chicommons.com || true 

exec "$@"

