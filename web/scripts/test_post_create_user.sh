#!/bin/bash

read -d '' req << EOF
{
        "first_name": "Test 9999",
        "last_name": "Dave",
        "username": "test3@abc.com",
        "email": "test3@abc.com",
        "password": "password1"
}
EOF

echo $req

curl --header "Content-type: application/json" --header "Authorization: Token 747e027b33793e68d75ec62ac25933ee11b54c30" --data "$req" --request POST "http://localhost:8000/users/"  
 
