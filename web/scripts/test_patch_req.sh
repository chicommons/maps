#!/bin/bash

id=856
read -d '' req << EOF
{
        "id": "$id",
        "proposed_changes": {"id":"856","name":"Dave test","types":[{"name":"Association Office"}],"coopaddresstags_set":[{"is_public":true,"address":{"raw":"12 bg blvd","formatted":"12 bg blvd","locality":{"name":"chicago","postal_code":"60614","state":{"name":"IL","code":"IL","country":{"name":"United States"}}}}}],"phone":{"phone":"+13037369542"},"email":{"email":"obj@object.com"},"web_site":"http://www.yahoo.com","description":""},
        "reject_reason": "bad coop"
}
EOF

echo $req

curl --header "Content-type: application/json" --data "$req" --request PATCH "http://localhost:8000/coops/$id/"  
 
