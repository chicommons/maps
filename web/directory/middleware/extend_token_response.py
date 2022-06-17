from rest_framework.authentication import get_authorization_header
from rest_framework.authtoken.models import Token
from directory.authentication import is_token_expired
from directory.settings import LOGOUT_PATH

class ExtendTokenResponse:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        response = self.get_response(request)
        if request.path != '/' + LOGOUT_PATH: 
            # Code to be executed for each request before
            # the view (and later middleware) are called.
            is_expired = True
            try:
                token = request.auth
                print("req path: %s" % request.path)
                is_expired = is_token_expired(token) if token else True
            except Exception as err:
                print(err)
            if not is_expired:
                token.delete()
                new_token = Token.objects.create(user = token.user)

                # Code to be executed for each request/response after
                # the view is called.
                response['Refresh-Token'] = new_token
        return response


