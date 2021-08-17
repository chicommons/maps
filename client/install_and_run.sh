#!/bin/bash

cd /app

#$ install everything
npm install

# Run it
REACT_APP_PROXY=http://localhost:9090 npm start
