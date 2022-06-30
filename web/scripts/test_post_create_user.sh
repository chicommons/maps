#!/bin/bash

read -d '' req << EOF
{
        "first_name": "Test 9999",
        "last_name": "Dave",
        "email": "test4@dgf.com",
        "username": "test3@abf.com",
        "password": "password1"
}
EOF

echo $req

curl -v --header "Content-type: application/json" --header "Authorization: Token f2c20566f26b75d091bbb187e170d2cb78a29b1a" --data "$req" --request POST "http://localhost:8000/users/"  
 
