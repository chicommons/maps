#!/bin/bash

read -d '' req << EOF
{
        "first_name": "Test 9999",
        "last_name": "Dave",
        "username": "test3@abc.com",
        "password": "password1"
}
EOF

echo $req

curl --header "Content-type: application/json" --header "Authorization: Token d0fadf766b0a00ad34327d9fbe8abe54d519bf05" --data "$req" --request POST "http://localhost:8000/users/"  
 
