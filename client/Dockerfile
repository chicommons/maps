FROM node:10-alpine AS alpine

RUN apk update && apk add bash

RUN apk add dos2unix

# A directory within the virtualized Docker environment
# Becomes more relevant when using Docker Compose later
WORKDIR /app/

# Copies package.json and package-lock.json to Docker environment
COPY package*.json ./
COPY install_and_run.sh ./

# Installs all node packages
RUN npm install --force -g yarn

RUN dos2unix /app/install_and_run.sh

# Copies everything over to Docker environment
#COPY . .

RUN echo "finished with Dockerfile."
# Finally runs the application
#CMD [ "npm", "start" ]
