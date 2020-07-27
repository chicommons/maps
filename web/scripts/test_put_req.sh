#!/bin/bash

id=971
read -d '' req << EOF
{
        "id": "$id",
        "name": "Test 9999",
        "types": [
            {"name": "Library"}
        ],
        "addresses": [
          {
            "formatted": "222 W. Merchandise Mart Plaza, Suite 1212",
            "locality": {
                "name": "Chicago",
                "postal_code": "60654",
                "state": "19313" 
            }
          }
        ],
        "enabled": "true",
        "phone": {
          "phone": "+17739441426"
        },
        "email": {
          "email" : "myemail@example.com"
        },
        "web_site": "http://www.1871.com/"
}
EOF

echo $req

curl --header "Content-type: application/json" --data "$req" --request PUT "http://localhost:8000/coops/$id/"  
 
