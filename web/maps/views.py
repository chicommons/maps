from maps.models import Coop
from address.models import State, Country, Locality
from maps.serializers import CoopSerializer, CountrySerializer, StateSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import csv
from django.http import HttpResponse
from django.db.models.functions import Lower


def data(request):
    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="data.csv"'

    writer = csv.writer(response)
    writer.writerow(['name','address','city','postal code','type','website','lon','lat'])
    type = request.GET.get("type", "")
    contains = request.GET.get("contains", "")
    if type:
        coops = Coop.objects.get_by_type(type)
    elif contains:
        coops = Coop.objects.contains_type(contains.split(","))

    for coop in coops.order_by(Lower('name')):
        postal_code = coop.address.locality.postal_code
        city = coop.address.locality.name + ", " + coop.address.locality.state.code + " " + postal_code 
        coop_types = ', '.join([type.name for type in coop.types.all()]) 
        writer.writerow([coop.name, coop.address.formatted, city, postal_code, coop_types, coop.web_site, coop.address.latitude, coop.address.longitude])

    return response


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
        serializer = CoopSerializer(coops, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = CoopSerializer(data=request.data)
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

    def delete(self, request, pk, format=None):
        coop = self.get_object(pk)
        coop.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
    def get_object(self, pk):
        try:
            return State.objects.filter(country=pk)
        except Coop.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        states = State.objects.filter(country=pk)
        serializer = StateSerializer(states, many=True)
        return Response(serializer.data)


