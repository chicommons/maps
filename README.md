# maps
   
## Getting up and running via Docker 
 
To get the application running locally, verify docker and docker-compose are installed, and then run ...

```
git clone https://github.com/chicommons/maps.git
cd maps
docker-compose up
```

Visit http://localhost:3001/ to see the application.
 
## Local setup (without Docker)

If you want to get things running locally without using Docker, you must install

- PostGres 10.0
- Python 3.8
- Node 12 or above

### PostGres

After installing PostGres, we may need to make some configurations.  Specifically, we need to enable login to happen without having a user with the same name defined on your system.  To do this, look for the "pg_hba.conf" file (on Mac, this is usually found at /usr/local/var/postgresql@10.0/pg_hba.conf).  Near the bottom of the file, you will want to add these lines ...
 
```
# Login for chicommons application
local   all             chicommons                              md5
```

Then restart PostGres.

### Environment variables

You must add the following environment variables.  On Mac or Linux, you will want to open your ~/.profile file and add

```
export DB_NAME=directory_data
export DB_USER=chicommons
export DB_PASS=password
export DB_SERVICE=localhost
# This should be the port where your PostGres DB is running
export DB_PORT=5432
```

to the end of your file.  Adjust the above settings if you have different settings.  After exiting, run

```
source ~/.profile
```

to set the environment variables in your current shell.  You can then run

```
cd web/scripts
./install_local.sh
```

to install the application and create and seed the database.  The script will prompt you for your root Postgres password so that it can create the database.




