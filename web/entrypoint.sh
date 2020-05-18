#!/bin/bash
set -e

python manage.py migrate directory
python manage.py docker_init_db_data

exec "$@"

