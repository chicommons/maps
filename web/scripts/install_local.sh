#!/bin/bash -l

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

read -s -p "What is the root Postgres (user=postgres) password? "  ROOT_PASSWORD

create_db_command="SELECT 'CREATE DATABASE $DB_NAME' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec"
create_user_command="create user $DB_USER with encrypted password '$DB_PASS';"
grant_privs_command="grant all privileges on database $DB_NAME to $DB_USER;"

PGPASSWORD=$ROOT_PASSWORD 
# This command creates the db if it doesn't already exist
echo "SELECT 'CREATE DATABASE $DB_NAME' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec" | psql -Upostgres
PGPASSWORD=$ROOT_PASSWORD psql -Upostgres -c "$create_user_command" 
PGPASSWORD=$ROOT_PASSWORD psql -Upostgres -c "$grant_privs_command" 

# Create Django environment, run migrations, and seed data
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $SCRIPT_DIR
cd ../
if [ ! -d ".venv" ]; then
  python3 -m venv venv
fi
# Activate virtual environment
source ./venv/bin/activate
python3 -m pip install -r requirements.txt

# Run migrations and seed the database
python3 manage.py migrate 
python3 manage.py insert_seed_data
 
 
