curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"code":"print(123)"}' \
  http://127.0.0.1:8000/snippets/ 

