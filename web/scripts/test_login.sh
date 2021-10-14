#!/bin/bash

read -d '' req << EOF
{
	"username":"dave",
	"password":"Password123$"
}
EOF

echo $req

curl --header "Content-type: application/json" --data "$req" --request POST "http://localhost:8000/login/"  
 
