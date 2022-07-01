#!/bin/bash

cd /app

#$ install everything
npm install

# Run it
echo "node env ..."
echo $NODE_ENV
REACT_APP_PROXY=http://localhost:9090/api npm start
