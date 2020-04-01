import os
import logging
from time import time, sleep
import MySQLdb

check_timeout = os.getenv("DB_CHECK_TIMEOUT", 30)
check_interval = os.getenv("DB_CHECK_INTERVAL", 1)
interval_unit = "second" if check_interval == 1 else "seconds"
config = {
    "dbname": os.getenv("MYSQL_DATABASE", "maps_data"),
    "user": os.getenv("MYSQL_USER", "chicommons"),
    "password": os.getenv("MYSQL_PASSWORD", "password"),
    "host": os.getenv("DATABASE_URL", "mysql")
}

start_time = time()
logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())


def db_isready(host, user, password, dbname):
    while time() - start_time < check_timeout:
        try:
            conn = MySQLdb.connect(**vars())
            logger.info("Database is ready! ✨")
            conn.close()
            return True
        except Exception:
            logger.info(f"Database isn't ready. Waiting for {check_interval} {interval_unit}...")
            sleep(check_interval)

    logger.error(f"We could not connect to the database within {check_timeout} seconds.")
    return False


db_isready(**config)

