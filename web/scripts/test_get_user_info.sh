#!/bin/bash

#curl -i --header "Content-type: application/json" "http://localhost:8000/user_info"
curl -i --header "Content-type: application/json" --header "Authorization: Token 1647eb098fbde9f19752eaa93c4f3700d8674151" "http://localhost:8000/user_info"

