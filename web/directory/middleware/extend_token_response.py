from rest_framework.authentication import get_authorization_header
from rest_framework.authtoken.models import Token
from directory.authentication import is_token_expired

class ExtendTokenResponse:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        response = self.get_response(request)
        token = request.auth
        is_expired = is_token_expired(token) if token else True
        if not is_expired:
            token.delete()
            new_token = Token.objects.create(user = token.user)

            # Code to be executed for each request/response after
            # the view is called.
            response['Refresh-Token'] = new_token

        return response


