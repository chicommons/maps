from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils import timezone

from rest_framework import status, generics
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from drf_spectacular.utils import extend_schema, extend_schema_view, inline_serializer

from apps.users.models import User
from apps.users.serializers import serializers, EmailTokenObtainPairSerializer, UserSerializer
from django.conf import settings

import uuid

@extend_schema_view(
    get=extend_schema(
        description="Lists all users. Only admin users can access."
    )
)
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

@extend_schema_view(
    get=extend_schema(
        description="Retrieves a user by ID. Only admin users can access."
    )
)
class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

@extend_schema_view(
    get=extend_schema(
        description="Retrieves the user profile details of the currently authenticated user."
    ),
    put=extend_schema(
        description="Updates the user profile details of the currently authenticated user."
    ),
    patch=extend_schema(
        description="Partially updates the user profile details of the currently authenticated user."
    )
)
class CurrentUserDetail(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.queryset.get(pk=self.request.user.pk)

@extend_schema_view(
    post=extend_schema(
        description="Login with an email and password and obtain an access and refresh JSON Web Tokens (JWT)."
    )
)
class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

@extend_schema_view(
    post=extend_schema(
        description="Register a new user. An email is sent to the provided email address with a link to verify the account.",
    )
)
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(email=request.data["email"])
        verification_url = "%s/register-verify/%s/" % (settings.FRONTEND_ROOT_URL, user.activation_token)
        send_mail(
            'Verify your account',
            f'Please verify your account by clicking the following link: {verification_url}',
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )
        return response

@extend_schema_view(
    get=extend_schema(
        description="Verify a user account by providing the token sent to the user's email address from /register/.",
    )
)
class VerifyEmailView(APIView):
    def get(self, request, token):
        try:
            uuid.UUID(token)
        except ValueError:
            return Response({'non_field_errors': ['Invalid token.']}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            user = User.objects.get(activation_token=token)
            if timezone.now() > user.activation_token_expires:
                return Response({'non_field_errors': ['This verification link has expired.']}, status=status.HTTP_410_GONE)
            user.is_verified = True
            user.save()
            return Response({}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'non_field_errors': ['Invalid token or token expired.']}, status=status.HTTP_404_NOT_FOUND)

@extend_schema_view(
    post=extend_schema(
        description="Request a password reset by providing your email. An email is sent to the provided email address with a link to reset the password.",
        request=inline_serializer(
            name='PasswordResetRequestSerializer',
            fields={
                'email': serializers.EmailField(required=True)
            }
        ),
    )
)
class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()
        if user:
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = "%s/reset-verify/%s/%s/" % (settings.FRONTEND_ROOT_URL, uid, token)
            send_mail(
                "Password Reset Request",
                f'Please go to the following link to reset your password: {reset_url}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
        return Response({}, status=status.HTTP_200_OK)

@extend_schema_view(
    post=extend_schema(
        description="Verify a password reset by providing the uid and token supplied in the email from /password-reset/ and the user's new password in the body.",
        request=inline_serializer(
            name='PasswordResetVerifyRequestSerializer',
            fields={
                'password': serializers.CharField(required=True)
            }
        ),
    )
)
class PasswordResetVerifyView(APIView):
    def post(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except Exception:
            user = None
        token_generator = PasswordResetTokenGenerator()
        print(user)
        if user is not None and token_generator.check_token(user, token):
            user_data = {'password': request.data.get("password")}

            serializer = UserSerializer(user, data=user_data, partial=True)
            if serializer.is_valid():
                user = serializer.save()
                return Response({}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"non_field_errors": ["Invalid token or user ID."]}, status=status.HTTP_400_BAD_REQUEST)
