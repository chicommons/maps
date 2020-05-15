#!/bin/bash

read -d '' req << EOF
{
        "name": "Test 8899",
        "types": [
            {"name": "Library"}
        ],
        "address": {
            "formatted": "222 W. Merchandise Mart Plaza, Suite 1212",
            "locality": {
                "name": "Chicago",
                "postal_code": "60654",
                "state": 19313
            }
        },
        "enabled": true,
        "phone": "7739441426",
        "email": "myemail",
        "web_site": "http://www.1871.com/"
}
EOF

echo $req

curl --header "Content-type: application/json" --data "$req" --request POST "http://localhost:8000/coops/"  
 
