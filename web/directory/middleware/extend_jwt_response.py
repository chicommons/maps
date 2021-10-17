from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer
from rest_framework.authentication import get_authorization_header

class ExtendJWTResponse:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        response = self.get_response(request)
        jwt_token = self.get_token_from_request(request)
        if self.check_jwt_is_valid(jwt_token):
            #payload = get_jwt_payload(jwt_token)
            new_jwt_token = "abcdef" #JWT_ENCODE_HANDLER(payload)

            # Code to be executed for each request/response after
            # the view is called.

            response['Refresh-Token'] = new_jwt_token

        return response

    def get_token_from_request(self, request):
        return get_authorization_header(request).decode('utf-8').replace("JWT ", "")
            
    def check_jwt_is_valid(self, jwt):
        if jwt:
            data = {'token': jwt}
            valid_data = VerifyJSONWebTokenSerializer().validate(data)
            print("valid data: %s" % valid_data)
            return valid_data != None
        return False