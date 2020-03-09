#!/bin/bash
set -e

python manage.py migrate maps
python manage.py docker_init_db_data

exec "$@"

