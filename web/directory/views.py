from directory.models import Coop, CoopType
from address.models import State, Country, Locality
from directory.serializers import * 
from directory.services.google_sheet_service import GoogleSheetService
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
import csv
from django.http import HttpResponse
from django.db.models.functions import Lower


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
        print("containns:",contains)
        coops = Coop.objects.contains_type(contains.split(","))

    for coop in coops.order_by(Lower('name')):
        for address in coop.addresses.all():
            postal_code = address.locality.postal_code
            city = address.locality.name + ", " + address.locality.state.code + " " + postal_code 
            coop_types = ', '.join([type.name for type in coop.types.all()]) 
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

@api_view(('POST',))
def save_to_sheet_from_form(request):
    """
    This is supposed to write to a Google sheet given a form coming from
    the client.
    """
    valid_ser = ValidateNewCoopSerializer(data=request.data)
    if valid_ser.is_valid():
        post_data = valid_ser.validated_data
        values = [
            'ID',
            post_data['coop_name'],
            post_data['street'],
            post_data['address_public'],
            post_data['zip'],
            post_data['city'],
            post_data['county'],
            post_data['state'],
            post_data['country'],
            post_data['websites'],
            post_data['contact_name'], # cnct
            post_data['contact_name_public'], #cnct-pub
            post_data['organization_email'],
            post_data['organization_email_public'], # email pub
            post_data['organization_phone'],
            post_data['organization_phone_public'],
            post_data['scope'],
            post_data['tags'],
            post_data['desc_english'],
            post_data['desc_other'],
            post_data['req_reason'],
        ]
        svc = GoogleSheetService()
        svc.append_to_sheet('ChiCommons_Directory', 4, values)
        return Response(post_data, status=status.HTTP_201_CREATED)
    else:
        return Response(valid_ser.errors, status=status.HTTP_400_BAD_REQUEST)
    

    print("request data ...")
    print(request.data)
    

    coops = Coop.objects.find_wo_coords()
    serializer = CoopSearchSerializer(coops, many=True)
    return Response(serializer.data)

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
            coops = Coop.objects.find(
                partial_name=partial_name,
                enabled=enabled
            )
        serializer = CoopSearchSerializer(coops, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = CoopSerializer(data=request.data)
        if serializer.is_valid():
            print("request data ...")
            print(request.data)
            values = [
                'ID',
                request.data['name'],
                request.data['addresses'][0]['raw'],
                '',
                request.data['addresses'][0]['locality']['postal_code'],
                request.data['addresses'][0]['locality']['name'],
                request.data['addresses'][0]['locality']['state']['country']['name'],
                request.data['web_site'],
                '', # cnct
                '', #cnct-pub
                request.data['email']['email'],
                '', # email pub
                request.data['phone']['phone'],
                '', # phone pub
                request.data['types'][0]['name']
            ]
            svc = GoogleSheetService()
            svc.append_to_sheet('ChiCommons_Directory', 4, values)
            #
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


class PredefinedTypeList(APIView):
    """
    List coop types that should appear in the form where 
    potential coops submit themselves for consideration to be 
    included in the directory 
    """
    def get(self, request, format=None):
        return Response([
            {"id": "Community Garden", "name": "Community Garden"},
            {"id": "Social Workshop", "name": "Social Workshop"},
            {"id": "Credit Union", "name": "Credit Union"}
        ])


class CoopTypeList(APIView):
    """
    List all coop types 
    """
    def get(self, request, format=None):
        coop_types = CoopType.objects.all()
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
            #return State.objects.filter(country=pk)
        except Coop.DoesNotExist:
            raise Http404

    def get(self, request, country_code, format=None):
        states = State.objects.filter(country__code=country_code)
        serializer = StateSerializer(states, many=True)
        return Response(serializer.data)


