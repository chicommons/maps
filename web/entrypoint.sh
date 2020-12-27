#!/bin/bash
set -e

cd /app
python manage.py migrate
python manage.py migrate directory
python manage.py insert_seed_data

exec "$@"

