#!/bin/bash -l

set -e

if [[ -z "${DB_NAME}" ]]; then
  echo "The environment variable DB_NAME is not defined."
  exit 1
fi
if [[ -z "${DB_USER}" ]]; then
  echo "The environment variable DB_USER is not defined."
  exit 1
fi
if [[ -z "${DB_PASS}" ]]; then
  echo "The environment variable DB_PASS is not defined."
  exit 1
fi
if [[ -z "${DB_SERVICE}" ]]; then
  echo "The environment variable DB_SERVICE is not defined."
  exit 1
fi
if [[ -z "${DB_PORT}" ]]; then
  echo "The environment variable DB_PORT is not defined."
  exit 1
fi

read -p "What is the root Postgres username [postgres]: " PG_USER
PG_USER=${PG_USER:-postgres}
read -s -p "What is the root Postgres (user=$PG_USER) password? "  ROOT_PASSWORD

create_db_command="SELECT 'CREATE DATABASE $DB_NAME' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec"
drop_owned_by_command="SELECT 'DROP OWNED BY $DB_USER;' WHERE EXISTS (SELECT rolname FROM pg_roles WHERE rolname = '$DB_USER')\gexec"
drop_role_command="DROP ROLE IF EXISTS $DB_USER;"
create_user_command="create user $DB_USER with encrypted password '$DB_PASS';"
grant_privs_command="grant all privileges on database $DB_NAME to $DB_USER;"

PGPASSWORD=$ROOT_PASSWORD 
# This command creates the db if it doesn't already exist
echo $create_db_command | psql -U$PG_USER
echo $drop_owned_by_command | psql -U$PG_USER $DB_NAME 
psql -U$PG_USER -c "$drop_role_command" 
psql -U$PG_USER -c "$create_user_command" 
psql -U$PG_USER -c "$grant_privs_command" 

# Create Django environment, run migrations, and seed data
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $SCRIPT_DIR
cd ../
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
# Activate virtual environment
source ./venv/bin/activate

# Make sure pip is installed
python3 -m ensurepip
python3 -m pip install --upgrade pip

python3 -m pip install -r requirements.txt

# Run migrations and seed the database
python3 manage.py migrate 
python3 manage.py insert_seed_data
 
# Create a chicommons super user
DJANGO_SUPERUSER_PASSWORD=password python manage.py createsuperuser --no-input --username=chicommons --email=chicommons@chicommons.com
 
