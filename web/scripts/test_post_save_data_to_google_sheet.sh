#!/bin/bash

read -d '' req << EOF
{
    "coop_name": "test coop",
    "street": "my test rd.",
    "address_public": "true",
    "city": "chicago",
    "state": "IL",
    "zip": "60605",
    "county": "cook",
    "country": "usa",
    "websites": "http://wwww.chicommons.coop",
    "contact_name": "test contact",
    "contact_name_public": "true",
    "organization_email": "example@example.com",
    "organization_email_public": "true",
    "organization_phone": "312-222-1234",
    "organization_phone_public": "true",
    "scope": "test-scope",
    "tags": "union",
    "desc_english": "hello",
    "desc_other": "req",
    "req_reason": "reason"
}
EOF

echo $req

curl --header "Content-type: application/json" --data "$req" --request POST "http://localhost:8000/save_to_sheet_from_form/"  
 
