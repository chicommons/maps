#!/bin/bash
set -e

cd /app
python manage.py migrate
python manage.py migrate directory
python manage.py docker_init_db_data

exec "$@"

