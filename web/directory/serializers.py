from rest_framework import serializers
from directory.models import Coop, CoopType
from address.models import Address, AddressField, Locality, State, Country 
from geopy.geocoders import Nominatim


class CoopTypeField(serializers.PrimaryKeyRelatedField):

    queryset = CoopType.objects

    def to_internal_value(self, data):
        if type(data) == dict:
            cooptype, created = CoopType.objects.get_or_create(**data)
            # Replace the dict with the ID of the newly obtained object
            data = cooptype.pk
        return super().to_internal_value(data)


class AddressTypeField(serializers.PrimaryKeyRelatedField):

    queryset = Address.objects

    def to_internal_value(self, data):
        if type(data) == dict:
            locality = data['locality']
            locality, created = Locality.objects.get_or_create(**locality)
            data['locality'] = locality
            address = Address.objects.create(**data)
            # Replace the dict with the ID of the newly obtained object
            data = address.pk
        return super().to_internal_value(data)


class LocalityTypeField(serializers.PrimaryKeyRelatedField):

    queryset = Locality.objects

    def to_internal_value(self, data):
        if type(data) == dict:
            locality, created = Locality.objects.get_or_create(**data)
            # Replace the dict with the ID of the newly obtained object
            data = locality.pk
        return super().to_internal_value(data)


class CoopTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoopType
        fields = ['id', 'name']

    def create(self, validated_data):
        """
        Create and return a new `CoopType` instance, given the validated data.
        """
        return CoopType.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `CoopType` instance, given the validated data.
        """
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance


class CoopSerializer(serializers.ModelSerializer):
    types = CoopTypeSerializer(many=True)
    address = AddressTypeField()

    class Meta:
        model = Coop
        fields = ['id', 'name', 'types', 'address', 'phone', 'enabled', 'email', 'web_site']
        extra_kwargs = {
            'phone': {
                'required': False, 
                'allow_blank': True
            }
        }

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['types'] = CoopTypeSerializer(instance.types.all(), many=True).data
        rep['address'] = AddressSerializer(instance.address).data
        return rep

    def create(self, validated_data):
        #"""
        #Create and return a new `Snippet` instance, given the validated data.
        #"""

        coop_types = validated_data.pop('types', {})
        instance = super().create(validated_data)
        for item in coop_types:
            coop_type, _ = CoopType.objects.get_or_create(name=item['name'])  #**item)
            instance.types.add(coop_type)

        return instance

    def update(self, instance, validated_data):
        """
        Update and return an existing `Coop` instance, given the validated data.
        """
        instance.name = validated_data.get('name', instance.name)
        #instance.type = validated_data.get('type', instance.type)
        try:
            coop_types = validated_data['types']
            instance.types.clear()  # Disassociates all  CoopTypes from instance.
            for item in coop_types:
                coop_type, _ = CoopType.objects.get_or_create(**item)
                instance.types.add(coop_type)
        except KeyError:
            pass
        instance.address = validated_data.get('address', instance.address)
        instance.enabled = validated_data.get('enabled', instance.enabled)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.email = validated_data.get('email', instance.email)
        instance.web_site = validated_data.get('web_site', instance.web_site)
        instance.web_site = validated_data.get('web_site', instance.web_site)
        instance.save()
        CoopSerializer.update_coords(validated_data)
        return instance

    # Set address coordinate data 
    @staticmethod
    def update_coords(data):
        locator = Nominatim(user_agent="myGeocoder")
        if locator:
            print(data)
            print(data['address'])
            address = data['address']
            state = address.locality.state
            country = state.country
            # This is an example of a formatted address string that will return lat and lon:
            #     "1600 Pennsylvania Avenue NW, Washington, DC 20500 United States"
            address_str = address.formatted + ", " + address.locality.name + ", " + state.code + " " + address.locality.postal_code + " " + country.name
            location = locator.geocode(address_str)
            if location:
                address.latitude = location.latitude
                address.longitude = location.longitude
                address.save(update_fields=["latitude", "longitude"])

class AddressSerializer(serializers.ModelSerializer):
    locality = LocalityTypeField()

    class Meta:
        model = Address
        fields = ['id', 'street_number', 'route', 'raw', 'formatted', 'latitude', 'longitude', 'locality']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['locality'] = LocalitySerializer(instance.locality).data
        return rep

    def create(self, validated_data):
        """
        Create and return a new `AddressField` instance, given the validated data.
        """
        print("validated data: #{validated_data}\n")
        address = AddressTypeField.objects.create(**validated_data)
        return address

    def update(self, instance, validated_data):
        """
        Update and return an existing `AddresssField` instance, given the validated data.
        """
        instance.street_number = validated_data.get('street_number', instance.name)
        instance.route = validated_data.get('route', instance.name)
        instance.raw = validated_data.get('raw', instance.name)
        instance.formatted = validated_data.get('formatted', instance.name)
        instance.latitude = validated_data.get('latitude', instance.name)
        instance.longitude = validated_data.get('longitude', instance.name)
        instance.locality = validated_data.get('locality', instance.name)
        instance.save()
        return instance


class LocalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Locality 
        fields = ['id', 'name', 'postal_code', 'state']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        return rep

    def create(self, validated_data):
        """
        Create and return a new `Locality` instance, given the validated data.
        """
        return Locality.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Locality` instance, given the validated data.
        """
        instance.name = validated_data.get('name', instance.name)
        instance.postal_code = validated_data.get('postal_code', instance.name)
        instance.state = validated_data.get('state', instance.name)
        instance.save()
        return instance


class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ['id', 'name', 'code', 'country']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['country'] = CountrySerializer(instance.country).data
        return rep


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'code']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        return rep


