from rest_framework import serializers
from directory.models import Coop, CoopType, ContactMethod, Person
from address.models import Address, AddressField, Locality, State, Country 
from .services.location_service import LocationService
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
    name = serializers.CharField()

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
    id = serializers.ReadOnlyField()

    class Meta:
        model = State
        fields = ['id', 'code', 'name', 'country']

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
        print("start create locality method.")
        country_id = validated_data['state']['country']
        validated_data['state'] = validated_data['state'].id
        print("\n\n\n\n****####\n\n", validated_data, "\n\n\n\n")
        return Locality.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Locality` instance, given the validated data.
        """
        print("\n\n\n\nupdating address entity \n\n\n\n") 
        instance.name = validated_data.get('name', instance.name)
        instance.postal_code = validated_data.get('postal_code', instance.name)
        state = validated_data.get('state', instance.name)
        instance.state_id = state.id 
        instance.save()
        return instance


class AddressSerializer(serializers.ModelSerializer):
    locality = LocalitySerializer()

    class Meta:
        model = Address
        fields = ['id', 'street_number', 'route', 'raw', 'formatted', 'latitude', 'longitude', 'locality']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['locality'] = LocalitySerializer(instance.locality).data
        return rep

    def create(self, validated_data):
        """
        Create and return a new `Address` instance, given the validated data.
        """
        print("arg type:",type(validated_data))
        return self.create_obj(validated_data)

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

    def create_obj(self, validated_data):
        locality_data = validated_data.pop('locality', {})
        state_data = locality_data['state']
        country = Country.objects.get(name=state_data['country']['name'])
        state = State.objects.get(code=state_data['code'], country=country.id)
        locality_data['state'] = state

        locality = Locality.objects.get_or_create(**locality_data)
        validated_data['locality'] = Locality.objects.get(name=locality_data['name'], state=state, postal_code=locality_data['postal_code']) 
        address = Address.objects.create(**validated_data)
        return address


class CoopSerializer(serializers.ModelSerializer):
    types = CoopTypeSerializer(many=True, allow_empty=False)
    addresses = AddressSerializer(many=True)
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
        return self.save_obj(validated_data=validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Coop` instance, given the validated data.
        """
        return self.save_obj(instance=instance, validated_data=validated_data)

    def save_obj(self, validated_data, instance=None):
        coop_types = validated_data.pop('types', {})
        addresses = validated_data.pop('addresses', {})
        phone = validated_data.pop('phone', {})
        email = validated_data.pop('email', {})
        if not instance:
            instance = super().create(validated_data)
        for item in coop_types:
            coop_type, _ = CoopType.objects.get_or_create(name=item['name']) 
            instance.types.add(coop_type)
        instance.phone = ContactMethod.objects.create(type=ContactMethod.ContactTypes.PHONE, **phone)
        instance.email = ContactMethod.objects.create(type=ContactMethod.ContactTypes.EMAIL, **email)
        for address in addresses:
            serializer = AddressSerializer()
            addr = serializer.create_obj(validated_data=address)
            instance.addresses.add(addr) 
            self.update_coords(addr)
        instance.name = validated_data.pop('name', None)
        instance.web_site = validated_data.pop('web_site', None)
        instance.save()
        return instance

    # Set address coordinate data 
    @staticmethod
    def update_coords(address):
        svc = LocationService()
        svc.save_coords(address)

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
        instance = super().create(validated_data)
        return instance

    def update(self, instance, validated_data):
        """
        Update and return an existing `Coop` instance, given the validated data.
        """
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        coops = validated_data.pop('coops', {})
        for coop in coops:
            #coop_obj = Coop.objects.get(pk=coop) 
            instance.coops.add(coop)
        contact_methods = validated_data.pop('contact_methods', {})
        instance.contact_methods.clear()
        for contact_method in contact_methods:
            print("contact method:",contact_method)
            print("email:",contact_method.email)
            #contact_method_obj = ContactMethod.objects.create(**contact_method)
            instance.contact_methods.add(contact_method)
        instance.save() 
        return instance

class CoopSearchSerializer(serializers.ModelSerializer):
    """
    This Coop serializer contains a scaled down version of the model to streamline
    bandwidth used and processing.
    """

    class Meta:
        model = Coop
        fields = 'id', 'name'

class ValidateNewCoopSerializer(serializers.Serializer):
    coop_name=serializers.CharField()
    street=serializers.CharField()
    address_public=serializers.CharField()
    city=serializers.CharField()
    state=serializers.CharField()
    zip=serializers.CharField()
    county=serializers.CharField()
    country=serializers.CharField()
    websites=serializers.CharField()
    contact_name=serializers.CharField()
    contact_name_public=serializers.CharField()
    organization_email=serializers.CharField()
    organization_email_public=serializers.CharField()
    organization_phone=serializers.CharField()
    organization_phone_public=serializers.CharField()
    scope=serializers.CharField()
    tags=serializers.CharField()
    desc_english=serializers.CharField()
    desc_other=serializers.CharField()
    req_reason=serializers.CharField()

