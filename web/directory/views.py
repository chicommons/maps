from directory.models import Coop, CoopType
from address.models import State, Country, Locality
from directory.serializers import * 
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

class CoopList(APIView):
    """
    List all coops, or create a new coop.
    """
    def get(self, request, format=None):
        contains = request.GET.get("contains", "")
        if contains:
            coops = Coop.objects.find_by_name(contains)
        else:
            coops = Coop.objects.all()
        serializer = CoopSearchSerializer(coops, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = CoopSerializer(data=request.data)
        if serializer.is_valid():
            print(" \n\n\n**** saving *****\n\n\n")
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


