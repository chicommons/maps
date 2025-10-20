#!/bin/sh
set -e

mkdir -p /config/uwsgi/socket/
chown -R www-data:www-data /config/uwsgi/socket/

cd /code/MapsApi/

uv python manage.py collectstatic --no-input --settings=MapsApi.settings.prod
uwsgi --ini /code/MapsApi/uwsgi.ini
