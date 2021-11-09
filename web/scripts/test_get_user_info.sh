#!/bin/bash

#curl -i --header "Content-type: application/json" "http://localhost:8000/user_info"
curl -i --header "Content-type: application/json" --header "Authorization: Token dfd2d0e468373c8c14208b2795847cb723a5e6cf" "http://localhost:8000/user_info"

