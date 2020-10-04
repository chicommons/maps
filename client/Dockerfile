FROM node:10-alpine AS alpine

RUN apk update && apk add bash

RUN apk add dos2unix

# A directory within the virtualized Docker environment
# Becomes more relevant when using Docker Compose later
WORKDIR /my-app/

# Copies package.json and package-lock.json to Docker environment
COPY install_and_run.sh ./

# Installs all node packages
RUN npm install --force -g yarn

RUN dos2unix /my-app/install_and_run.sh


