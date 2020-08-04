from rest_framework import serializers
from directory.models import Coop, CoopType, ContactMethod, Person
from address.models import Address, AddressField, Locality, State, Country 
from geopy.geocoders import Nominatim
import re


class AddressTypeField(serializers.PrimaryKeyRelatedField):

    queryset = Address.objects

    def to_internal_value(self, data):
        if type(data) == dict:
            locality = data['locality']
            state = None if not re.match(r"[0-9]+", str(locality['state'])) else State.objects.get(pk=locality['state']) 
            if not state:
                raise serializers.ValidationError({'state': 'This field is required.'})
            locality['state'] = state
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


class ContactMethodField(serializers.PrimaryKeyRelatedField):

    queryset = ContactMethod.objects

    def to_internal_value(self, data):
        if type(data) == dict:
            contact_method = ContactMethod.objects.create(**data)
            data = contact_method.pk
        return super().to_internal_value(data)


class ContactMethodSerializer(serializers.ModelSerializer):

    class Meta:
        model = ContactMethod
        fields = ['type', 'phone', 'email']

    def create(self, validated_data):
        contact_method = ContactMethod.objects.create(**validated_data)
        return contact_method

    def to_internal_value(self, data):
        if type(data) == dict:
            contactmethod = ContactMethod.objects.create(**data)
            # Replace the dict with the ID of the newly obtained object
            data = contactmethod.pk
        return super().to_internal_value(data)


class CoopTypeSerializer(serializers.ModelSerializer):
    default_error_messages = {'name_exists': 'The name already exists'}

    class Meta:
        model = CoopType
        fields = ['id', 'name']

    def validate(self, attrs):
        validated_attrs = super().validate(attrs)
        errors = {}

        # check if the new `name` doesn't exist for other db record, this is only for updates
        if (
            self.instance  # the instance to be updated
            and 'name' in validated_attrs  # if name is in the attributes
            and self.instance.name != validated_attrs['name']  # if the name is updated
        ):
            if (
                CoopType.objects.filter(name=validated_attrs['name'])
                .exclude(id=self.instance.id)
                .exists()
            ):
                errors['name'] = self.error_messages['name_exists']

        if errors:
            raise ValidationError(errors)

        return validated_attrs

    def create(self, validated_data):
        # get_or_create returns a tuple with (instance, boolean). The boolean is True if a new instance was created and False otherwise
        return CoopType.objects.get_or_create(**validated_data)[0]


class ContactMethodPhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMethod
        fields = ['type', 'phone']
        read_only_fields = ['type']
        extra_kwargs = {'type': {'default': 'PHONE'}}


class ContactMethodEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMethod
        fields = ['type', 'email']
        read_only_fields = ['type']
        extra_kwargs = {'type': {'default': 'EMAIL'}}


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'code']
        extra_kwargs = {
            'name': {
                'validators': []
            }
        }

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        return rep


class StateSerializer(serializers.ModelSerializer):
    country = CountrySerializer()
    class Meta:
        model = State
        fields = ['id', 'code', 'country']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['country'] = CountrySerializer(instance.country).data
        return rep


class LocalitySerializer(serializers.ModelSerializer):
    state = StateSerializer()
    class Meta:
        model = Locality 
        fields = ['id', 'name', 'postal_code', 'state']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['state'] = StateSerializer(instance.state).data
        return rep

    def create(self, validated_data):
        """
        Create and return a new `Locality` instance, given the validated data.
        """
        validated_data['state'] = validated_data['state'].id
        print("\n\n\n\n****####\n\n", validated_data, "\n\n\n\n")
        return "{bogus}"
        #return Locality.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Locality` instance, given the validated data.
        """
        print("\n\n\n\nupdating entity \n\n\n\n") 
        instance.name = validated_data.get('name', instance.name)
        instance.postal_code = validated_data.get('postal_code', instance.name)
        state = validated_data.get('state', instance.name)
        instance.state_id = state.id 
        instance.save()
        return instance


class AddressSerializer(serializers.ModelSerializer):
    locality = LocalitySerializer()   #LocalityTypeField()

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


class CoopSerializer(serializers.ModelSerializer):
    types = CoopTypeSerializer(many=True, allow_empty=False)
    addresses = AddressSerializer(many=True)   # AddressTypeField(many=True)
    phone = ContactMethodPhoneSerializer()
    email = ContactMethodEmailSerializer()

    class Meta:
        model = Coop
        fields = '__all__'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['types'] = CoopTypeSerializer(instance.types.all(), many=True).data
        rep['addresses'] = AddressSerializer(instance.addresses.all(), many=True).data
        return rep

    def create(self, validated_data):
        """
        Create and return a new `Snippet` instance, given the validated data.
        """

        coop_types = validated_data.pop('types', {})
        phone = validated_data.pop('phone', {})
        email = validated_data.pop('email', {})
        instance = super().create(validated_data)
        for item in coop_types:
            coop_type, _ = CoopType.objects.get_or_create(name=item['name']) 
            instance.types.add(coop_type)
        instance.phone = ContactMethod.objects.create(type=ContactMethod.ContactTypes.PHONE, **phone)
        instance.email = ContactMethod.objects.create(type=ContactMethod.ContactTypes.EMAIL, **email)
        print("\n\n\n\n-------------instance phone: ", instance.phone)
        print("instnace.phone", instance.phone)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        """
        Update and return an existing `Coop` instance, given the validated data.
        """
        instance.name = validated_data.get('name', instance.name)
        try:
            coop_types = validated_data['types']
            instance.types.clear()  # Disassociates all  CoopTypes from instance.
            for item in coop_types:
                coop_type, _ = CoopType.objects.get_or_create(**item)
                instance.types.add(coop_type)
        except KeyError:
            pass
        instance.addresses = validated_data.get('addresses', instance.addresses)
        instance.enabled = validated_data.get('enabled', instance.enabled)
        phone = validated_data.pop('phone', {})
        email = validated_data.pop('email', {})
        instance.phone = ContactMethod.objects.create(type=ContactMethod.ContactTypes.PHONE, **phone)
        instance.email = ContactMethod.objects.create(type=ContactMethod.ContactTypes.EMAIL, **email)
        instance.web_site = validated_data.get('web_site', instance.web_site)
        instance.web_site = validated_data.get('web_site', instance.web_site)
        instance.save()
        #CoopSerializer.update_coords(validated_data)
        return instance

    # Set address coordinate data 
    @staticmethod
    def update_coords(data):
        locator = Nominatim(user_agent="myGeocoder")
        if locator:
            print(data)
            print(data['addresses'])
            addresses = data['addresses']
            for address in addresses:
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


class PersonSerializer(serializers.ModelSerializer):
    #coops = CoopSerializer(many=True)
    contact_methods = ContactMethodField(many=True)

    class Meta:
        model = Person
        fields = ['id', 'first_name', 'last_name', 'coops', 'contact_methods']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['coops'] = CoopSerializer(instance.coops.all(), many=True).data
        rep['contact_methods'] = ContactMethodSerializer(instance.contact_methods.all(), many=True).data
        return rep

    def create(self, validated_data):
        #"""
        #Create and return a new `Snippet` instance, given the validated data.
        #"""
        #contact_methods = validated_data.pop('contact_methods', {})
        instance = super().create(validated_data)
        #for item in contact_methods:
        #    contact_method, _ = ContactMethod.objects.create(**item)
        #    instance.contact_methods.add(contact_method)
        return instance

    def update(self, instance, validated_data):
        """
        Update and return an existing `Coop` instance, given the validated data.
        """
        instance.coops = validated_data.get('coops', instance.coops)
        instance.contact_methods = validated_data.get('contact_methods', instance.contact_methods)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        return instance



