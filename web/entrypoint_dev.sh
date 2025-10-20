#!/bin/bash
set -e

cd /code/MapsApi/

uv run manage.py collectstatic --no-input

if [ ! -f "/data/db.sqlite3" ]; then
    uv run manage.py migrate
    uv run manage.py createsuperuser --no-input --first_name=Admin --last_name=User --email=chicommons@chicommons.com --password=password
    uv run manage.py loaddata 'apps/directory/fixtures/seed_data.yaml'
fi

case $1 in
	bash | sh | /usr/bin/bash | /usr/bin/sh | shell)
		/usr/bin/bash
		;;
	*)
		uv run manage.py runserver 0.0.0.0:8000
		;;
esac
