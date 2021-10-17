#!/bin/bash

#curl -i --header "Content-type: application/json" "http://localhost:8000/user_info"
curl -i --header "Content-type: application/json" --header "Authorization: Token 7cbe1708b26de2d9f27b38699c83e8c1a7789e3d" "http://localhost:8000/user_info"

