#!/bin/bash

# PREPARE HELP MESSAGE
show_help() {
    echo
    echo $0 - shows how to login to backend and review a coop create or update proposal.
    echo 
    echo "Usage: $0 -u USERNAME -p PASSWORD -i ID"
    echo
    echo "Options:"
    echo "  -u    Specify the username"
    echo "  -p    Specify the password"
    echo "  -i    Specify the Coop Proposed ID to review"
    echo "  -s    Specify the review status. Either 'APPROVED' or 'REJECTED'. (Optional. Default 'APPROVED')"
    echo "  -h    Display this help message and exit"
}

# VALIDATE USER INPUTS
username_provided=0
password_provided=0
coop_approved_id_provided=0
review_status_provided=0
while getopts ":u:p:i:s:h:" option; do
   case $option in
        u) # Input username
            username=$OPTARG
            username_provided=1;;
        p) # Input password
            password=$OPTARG
            password_provided=1;;
        i) # Input id in coop_approved to modify
            coop_proposed_id=$OPTARG
            coop_proposed_id_provided=1;;
        s)
            review_status=$OPTARG
            review_status_provided=1;;
        h) # Show Help
            show_help
            exit 0;;
        \?) # Invalid option
            echo "Error: Invalid option"
            show_help
            exit 1;;
   esac
done
if [ $username_provided -eq 0 ]; then
    echo "Error: Username (-u) is required."
    show_help
    exit 1
fi

if [ $password_provided -eq 0 ]; then
    echo "Error: Password (-p) is required."
    show_help
    exit 1
fi

if [ $coop_proposed_id_provided -eq 0 ]; then
    echo "Error: Coop Proposed ID (-i) is required."
    show_help
    exit 1
fi

if [ $review_status_provided -eq 0 ]; then
    review_status="APPROVED"
fi

#=============================================================================
# API CALL 1: LOGIN
login_req_json=$(cat << EOF
{
  "email": "$username",
  "password": "$password"
}
EOF
)
url="http://localhost:8000/api/v1/auth/token/"

login_response=$( curl -s -X POST "$url" -H "Content-type: application/json" -d "$login_req_json" )
access_token=$( echo "$login_response" | jq -r '.access' )  # Extract "access" value from response json.

# API CALL 2: SEND REVIEW TO PROPOSAL
review_coop_req_json=$(cat << EOF
{
  "proposal_status": "$review_status",
  "review_notes": "lgtm"
}
EOF
)
url="http://localhost:8000/api/v1/coops/proposal/review/$coop_proposed_id/"
access_header="Authorization: Bearer "$access_token""
review_coop_response=$( curl -s -X PATCH "$url" -H "$access_header" -H "Content-type: application/json" -d "$review_coop_req_json" )
echo $review_coop_response
