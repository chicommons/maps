#!/bin/bash

read -d '' req << EOF
{
	"username":"chicommons",
	"password":"password"
}
EOF

echo $req

curl --header "Content-type: application/json" --data "$req" --request POST "http://localhost:8000/login"  

#curl -X POST -d "username=dave&password=Password123$" http://localhost:8000/api-token-auth/  
