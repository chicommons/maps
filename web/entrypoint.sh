#!/bin/bash
set -e

python manage.py migrate maps
python manage.py docker_init_db_data
#python manage.py loaddata maps/fixtures/country_data.yaml
#python manage.py loaddata maps/fixtures/seed_data.yaml

exec "$@"

