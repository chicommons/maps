from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework import serializers
from directory.models import Coop, CoopType, ContactMethod, Person, CoopAddressTags
from address.models import Address, Locality, State, Country
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


class CoopAddressTagsSerializer(serializers.ModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = CoopAddressTags
        fields = ['id', 'address', 'is_public']

    def to_representation(self, instance):
        print("type of instance: %s" % type(instance))
        rep = super().to_representation(instance)
        rep['address'] = AddressSerializer(instance.address).data
        return rep

    def update(self, instance, validated_data):
        """
        Update and return an existing `AddresssField` instance, given the validated data.
        """
        instance.is_public = validated_data.get('is_public', instance.is_public)
        address = validated_data.get('address')
        instance.address = serializer.create_obj(validated_data=address)
        instance.save()
        return instance

    def create_obj(self, validated_data):
        address_data = validated_data.pop('address', {})
        serializer = AddressSerializer()
        addr = serializer.create_obj(validated_data=address_data)
        validated_data['address'] = addr
        coop_object = Coop.objects.get(id=validated_data['coop_id'])
        return CoopAddressTags.objects.create(coop=coop_object, **validated_data)


class CoopSerializer(serializers.ModelSerializer):
    types = CoopTypeSerializer(many=True, allow_empty=False)
    coopaddresstags_set = CoopAddressTagsSerializer(many=True)
    phone = ContactMethodPhoneSerializer()
    email = ContactMethodEmailSerializer()

    class Meta:
        model = Coop
        fields = ['name', 'description', 'types', 'phone', 'email', 'web_site', 'coopaddresstags_set', 'proposed_changes', 'approved', 'reject_reason']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['types'] = CoopTypeSerializer(instance.types.all(), many=True).data
        rep['coopaddresstags_set'] = CoopAddressTagsSerializer(instance.coopaddresstags_set.all(), many=True).data
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
        addresses = validated_data.pop('coopaddresstags_set', {})
        phone = validated_data.pop('phone', {})
        email = validated_data.pop('email', {})
        if not instance:
            instance = super().create(validated_data)
        for item in coop_types:
            coop_type, _ = CoopType.objects.get_or_create(name=item['name'])
            instance.types.add(coop_type)
        instance.phone = ContactMethod.objects.create(type=ContactMethod.ContactTypes.PHONE, **phone)
        instance.email = ContactMethod.objects.create(type=ContactMethod.ContactTypes.EMAIL, **email)
        
        instance.name = validated_data.pop('name', None)
        instance.web_site = validated_data.pop('web_site', None)
        instance.approved = validated_data.pop('approved', None)
        instance.reject_reason = validated_data.pop('reject_reason', None)
        instance.save()
        for address in addresses:
            serializer = CoopAddressTagsSerializer()
            address['coop_id'] = instance.id
            addr_tag = serializer.create_obj(validated_data=address)
            result = addr_tag.save()
            instance.coopaddresstags_set.add(addr_tag)
        return instance

    # Set address coordinate data
    @staticmethod
    def update_coords(address):
        svc = LocationService()
        svc.save_coords(address)


class CoopProposedChangeSerializer(serializers.ModelSerializer):
    """
    This Coop serializer handles proposed changes to a coop.
    """
    class Meta:
        model = Coop
        fields = ['id', 'proposed_changes']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        #rep['types'] = CoopTypeSerializer(instance.types.all(), many=True).data
        #rep['coopaddresstags_set'] = CoopAddressTagsSerializer(instance.coopaddresstags_set.all(), many=True).data
        return rep

    #def to_representation(self, instance):
    #    rep = super().to_representation(instance)
    #    rep['addresses'] = AddressSerializer(instance.addresses.all(), many=True).data
    #    return rep


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
        fields = 'id', 'name', 'approved', 'coopaddresstags_set', 'phone', 'email', 'web_site'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['coopaddresstags_set'] = CoopAddressTagsSerializer(instance.coopaddresstags_set.all(), many=True).data
        return rep

class ValidateNewCoopSerializer(serializers.Serializer):
    # Set all fields as not required and allow_blank=true, so we can combine all validation into one step
    id=serializers.CharField(required=False, allow_blank=True)
    coop_name=serializers.CharField(required=False, allow_blank=True)
    street=serializers.CharField(required=False, allow_blank=True)
    address_public=serializers.CharField(required=False, allow_blank=True)
    city=serializers.CharField(required=False, allow_blank=True)
    state=serializers.CharField(required=False, allow_blank=True)
    zip=serializers.CharField(required=False, allow_blank=True)
    county=serializers.CharField(required=False, allow_blank=True)
    country=serializers.CharField(required=False, allow_blank=True)
    websites=serializers.CharField(required=False, allow_blank=True)
    contact_name=serializers.CharField(required=False, allow_blank=True)
    contact_name_public=serializers.CharField(required=False, allow_blank=True)
    contact_email=serializers.CharField(required=False, allow_blank=True)
    contact_email_public=serializers.CharField(required=False, allow_blank=True)
    contact_phone=serializers.CharField(required=False, allow_blank=True)
    contact_phone_public=serializers.CharField(required=False, allow_blank=True)
    entity_types=serializers.CharField(required=False, allow_blank=True)
    scope=serializers.CharField(required=False, allow_blank=True)
    tags=serializers.CharField(required=False, allow_blank=True)
    desc_english=serializers.CharField(required=False, allow_blank=True)
    desc_other=serializers.CharField(required=False, allow_blank=True)
    req_reason=serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        """
        Validation of start and end date.
        """
        errors = {}

        # required fields
        required_fields = ['coop_name', 'websites', 'contact_name', 'contact_name_public', 'entity_types', 'req_reason']
        for field in required_fields:
            if not data[field]:
                errors[field] = 'This field is required.'

        # contact info
        contact_email = data['contact_email'] if 'contact_email' in data else None
        contact_phone = data['contact_phone'] if 'contact_phone' in data else None
        if not contact_email and not contact_phone:
            errors['contact'] = 'Either contact phone or contact email is required.'

        if errors:
            raise serializers.ValidationError(errors)

        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'id', 'first_name', 'last_name')
    
    def validate(self, data):
        errors = {}

        # required fields
        required_fields = ['username', 'password', 'email']
        for field in required_fields:
            if not data.get(field):
                errors[field] = 'This field is required.'

        if errors:
            raise serializers.ValidationError(errors)

        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data.get('username'),
            password=validated_data.get('password'),
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            email=validated_data.get('email')
        )

        return user


class UserSigninSerializer(serializers.Serializer):
    username = serializers.CharField(required = True)
    password = serializers.CharField(required = True)


class CoopSpreadsheetSerializer(serializers.ModelSerializer):
    types = CoopTypeSerializer(many=True, allow_empty=False)
    coopaddresstags_set = CoopAddressTagsSerializer(many=True)
    phone = ContactMethodPhoneSerializer()
    email = ContactMethodEmailSerializer()

    class Meta:
        model = Coop
        fields = ['id', 'name', 'description', 'types', 'phone', 'email', 'web_site', 'coopaddresstags_set', 'approved']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['types'] = CoopTypeSerializer(instance.types.all(), many=True).data
        rep['coopaddresstags_set'] = CoopAddressTagsSerializer(instance.coopaddresstags_set.all(), many=True).data
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
        addresses = validated_data.pop('coopaddresstags_set', {})
        phone = validated_data.pop('phone', {})
        email = validated_data.pop('email', {})
        if not instance:
            instance = super().create(validated_data)
        for item in coop_types:
            coop_type, _ = CoopType.objects.get_or_create(name=item['name'])
            instance.types.add(coop_type)
        instance.phone = ContactMethod.objects.create(type=ContactMethod.ContactTypes.PHONE, **phone)
        instance.email = ContactMethod.objects.create(type=ContactMethod.ContactTypes.EMAIL, **email)
        
        instance.name = validated_data.pop('name', None)
        instance.web_site = validated_data.pop('web_site', None)
        instance.save()
        for address in addresses:
            serializer = CoopAddressTagsSerializer()
            address['coop_id'] = instance.id
            addr_tag = serializer.create_obj(validated_data=address)
            result = addr_tag.save()
            instance.coopaddresstags_set.add(addr_tag)
        return instance

    # Set address coordinate data
    @staticmethod
    def update_coords(address):
        svc = LocationService()
        svc.save_coords(address)
