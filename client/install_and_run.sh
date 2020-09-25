#!/bin/bash

cd /app

# install everythiing
yarn

# Run it
REACT_APP_PROXY=http://localhost:9090 npm start
