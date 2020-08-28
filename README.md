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

- MySql 8.0
- Python 3.8
- Node 12 or above

Then you must add the following environment variables.  On Mac, you will want to open your ~/.profile file and add

```
export DB_NAME=directory_data
export DB_USER=chicommons
export DB_PASS=password
export DB_SERVICE=localhost
export DB_PORT=3306
```

to the end of your file.  Adjust the above settings to your liking.  After exiting, run

```
source ~/.profile
```

to set the environment variables in your current shell.  You can then run

```
cd web/scripts
./install_local.sh
```

to install the application and create and seed the database.  The script will prompt you for your root MySql password so that it can create the database.


## Contributing

Want to contribute?  Please check out [CONTRIBUTING.md](/CONTRIBUTING.md) 

