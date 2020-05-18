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

read -p "What is the root MySql password? "  ROOT_MYSQL_PASSWORD

create_db_command='create database if not exists $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'
#create_user_command="CREATE USER '$DB_USER'@'$DB_SERVICE' IDENTIFIED BY '$DB_PASS';"
#grant_privs_command="grant all privileges on $DB_NAME.* to '$DB_USER'@'$DB_SERVICE';"  
grant_privs_command="GRANT ALL ON $DB_NAME.* TO '$DB_USER'@'$DB_SERVICE' IDENTIFIED BY '$DB_PASS';"

mysql -u root --password=$ROOT_MYSQL_PASSWORD -h $DB_SERVICE --port=$DB_PORT -e "$create_db_command"
#mysql -u root --password=$ROOT_MYSQL_PASSWORD -h $DB_SERVICE --port=$DB_PORT -e "$create_user_command"
mysql -u root --password=$ROOT_MYSQL_PASSWORD -h $DB_SERVICE --port=$DB_PORT -e "$grant_privs_command"

# Create Django environment, run migrations, and seed data
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $SCRIPT_DIR
cd ../
if [ ! -d ".venv" ]; then
  python -m venv venv
fi
# Activate virtual environment
source ./venv/bin/activate
python -m pip install -r requirements.txt

# Run migrations and seed the database
python manage.py migrate directory
python manage.py docker_init_db_data
 
 
