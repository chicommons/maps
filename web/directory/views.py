from directory.models import Coop, CoopType
from address.models import State, Country, Locality
from directory.serializers import *
from directory.settings import SECRET_KEY
from directory.services.google_sheet_service import GoogleSheetService
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
import csv
from django.http import HttpResponse
from django.db.models.functions import Lower
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
)
from django.contrib.auth.models import User
from rest_framework.authentication import TokenAuthentication

from .serializers import UserSigninSerializer
from .authentication import token_expire_handler, expires_in, ExpiringTokenAuthentication

@api_view(["POST"])
@permission_classes((AllowAny,))  # here we specify permission by default we set IsAuthenticated
def signin(request):
    signin_serializer = UserSigninSerializer(data = request.data)
    if not signin_serializer.is_valid():
        return Response(signin_serializer.errors, status = HTTP_400_BAD_REQUEST)

    user = authenticate(
            username = signin_serializer.data['username'],
            password = signin_serializer.data['password'] 
        )
    
    if not user:
        return Response({'detail': 'Invalid Credentials or activate account'}, status=HTTP_404_NOT_FOUND)
        
    #TOKEN STUFF
    token, _ = Token.objects.get_or_create(user = user)
    
    #token_expire_handler will check, if the token is expired it will generate new one
    is_expired, token = token_expire_handler(token)     # The implementation will be described further
    user_serialized = UserSerializer(user)

    return Response({
        'user': user_serialized.data, 
        'expires_in': expires_in(token),
        'token': token.key
    }, status=HTTP_200_OK)

@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def signout(request):
    user = request.user
    print("user: %s" % user)
    Token.objects.filter(user=user).delete() 
    # Remove header
    return Response({}, status=HTTP_200_OK)


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def user_info(request):
    return Response({
        'user': request.user.username,
        'expires_in': expires_in(request.auth)
    }, status=HTTP_200_OK)


def data(request):
    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="data.csv"'

    writer = csv.writer(response, quoting=csv.QUOTE_ALL)
    writer.writerow(['name','address','city','postal code','type','website','lon','lat'])
    type = request.GET.get("type", "")
    contains = request.GET.get("contains", "")
    if type:
        coops = Coop.objects.get_by_type(type)
    elif contains:
        coops = Coop.objects.contains_type(contains.split(","))

    for coop in coops.order_by(Lower('name')):
        for address in coop.addresses.all():
            postal_code = address.locality.postal_code
            city = address.locality.name + ", " + address.locality.state.code + " " + postal_code
            coop_types = ', '.join([type.name for type in coop.types.all()])
            if address.longitude and address.latitude:
                writer.writerow([coop.name, address.formatted, city, postal_code, coop_types, coop.web_site, address.longitude, address.latitude])

    return response

@api_view(('GET',))
def coops_wo_coordinates(request):
    """
    Returns all the coops that currently have no coordiantes (or at least
    are missing either latitude or longitude)
    """
    coops = Coop.objects.find_wo_coords()
    serializer = CoopSearchSerializer(coops, many=True)
    return Response(serializer.data)

@api_view(('GET',))
def unapproved_coops(request):
    """
    Returns those coops that are unapproved
    """
    coops = Coop.objects.find_unapproved()
    serializer = CoopSearchSerializer(coops, many=True)
    return Response(serializer.data)


class CreateUserView(CreateAPIView):

    model = User
    permission_classes = [
        IsAuthenticated
    ]
    serializer_class = UserSerializer

class CoopList(APIView):
    """
    List all coops, or create a new coop.
    """
    def get(self, request, format=None):
        contains = request.GET.get("contains", "")
        if contains:
            coops = Coop.objects.find(
                partial_name=contains,
                enabled=True
            )
        else:
            partial_name = request.GET.get("name", "")
            enabled_req_param = request.GET.get("enabled", None)
            enabled = enabled_req_param.lower() == "true" if enabled_req_param else None
            city = request.GET.get("city", None)
            zip = request.GET.get("zip", None)
            street = request.GET.get("street", None)
            state = request.GET.get("state", None)
            coop_types = request.GET.get("coop_type", None)
            types_arr = coop_types.split(",") if coop_types else None

            coops = Coop.objects.find(
                partial_name=partial_name,
                enabled=enabled,
                street=street,
                city=city,
                zip=zip,
                state_abbrev=state,
                types_arr=types_arr
            )
        serializer = CoopSearchSerializer(coops, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = CoopSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CoopListAll(APIView):
    """
    List all coops, or create a new coop. Includes details omitted in CoopList
    """
    def get(self, request, format=None):
        contains = request.GET.get("contains", "")
        if contains:
            coops = Coop.objects.find(
                partial_name=contains,
                enabled=True
            )
        else:
            partial_name = request.GET.get("name", "")
            enabled_req_param = request.GET.get("enabled", None)
            enabled = enabled_req_param.lower() == "true" if enabled_req_param else None
            city = request.GET.get("city", None)
            zip = request.GET.get("zip", None)
            street = request.GET.get("street", None)
            state = request.GET.get("state", None)
            coop_types = request.GET.get("coop_type", None)
            types_arr = coop_types.split(",") if coop_types else None

            coops = Coop.objects.find(
                partial_name=partial_name,
                enabled=enabled,
                street=street,
                city=city,
                zip=zip,
                state_abbrev=state,
                types_arr=types_arr
            )
        serializer = CoopSpreadsheetSerializer(coops, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = CoopSpreadsheetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CoopDetail(APIView):
    """
    Retrieve, update or delete a coop instance.
    """
    def get_object(self, pk):
        try:
            return Coop.objects.get(pk=pk)
        except Coop.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        coop = self.get_object(pk)
        serializer = CoopSerializer(coop)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        coop = self.get_object(pk)
        serializer = CoopSerializer(coop, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, format=None):
        coop = self.get_object(pk)
        serializer = CoopProposedChangeSerializer(coop, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        coop = self.get_object(pk)
        coop.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PersonList(APIView):
    """
    List all people, or create a new person.
    """
    def get(self, request, format=None):
        coop = request.GET.get("coop", "")
        if coop:
            people = Person.objects.filter(coops__in=[coop])
        else:
            people = People.objects.all()
        serializer = PersonSerializer(people, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = PersonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PersonDetail(APIView):
    """
    Retrieve, update or delete a person instance.
    """
    def get_object(self, pk):
        try:
            return Person.objects.get(pk=pk)
        except Coop.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        person = self.get_object(pk)
        serializer = PersonSerializer(person)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        person = self.get_object(pk)
        serializer = PersonSerializer(person, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        person = self.get_object(pk)
        person.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CoopTypeList(APIView):
    """
    List all coop types
    """
    def get(self, request, format=None):
        coop_types = CoopType.objects.all().order_by(Lower('name'))
        serializer = CoopTypeSerializer(coop_types, many=True)
        return Response(serializer.data)


class CountryList(APIView):
    """
    List all countries
    """
    def get(self, request, format=None):
        countries = Country.objects.all()
        serializer = CountrySerializer(countries, many=True)
        return Response(serializer.data)


class StateList(APIView):
    """
    List all states based on country
    """
    def get_object(self, country_code):
        try:
            return State.objects.first(country__code=country_code)
        except Coop.DoesNotExist:
            raise Http404

    def get(self, request, country_code, format=None):
        states = State.objects.filter(country__code=country_code)
        serializer = StateSerializer(states, many=True)
        return Response(serializer.data)
