from rest_framework import serializers
from maps.models import Coop, CoopType
from address.models import Address, AddressField, Locality, State, Country 


class CoopTypeField(serializers.PrimaryKeyRelatedField):

    def to_internal_value(self, data):
        if type(data) == dict:
            cooptype, created = CoopType.objects.get_or_create(**data)
            # Replace the dict with the ID of the newly obtained object
            data = cooptype.pk
        return super().to_internal_value(data)


class AddressTypeField(serializers.PrimaryKeyRelatedField):

    def to_internal_value(self, data):
        if type(data) == dict:
            address, created = CoopType.objects.get_or_create(**data)
            # Replace the dict with the ID of the newly obtained object
            data = cooptype.pk
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
    type = CoopTypeSerializer()  # Change 1

    class Meta:
        model = Coop
        fields = ['id', 'name', 'type', 'address', 'enabled', 'phone', 'email', 'web_site']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        # Change 4

        # rep['type'] = CoopTypeSerializer(instance.type).data # comment this line.
        # since we defined a `CoopTypeSerializer` as "nested serializer" in in this class
        # we don't need this here

        rep['address'] = AddressSerializer(instance.address).data
        return rep

    def get_coop_type_instance_from_validated_data(self, validated_date):
        """
        Retrieving CoopType instance from the validated_data
        """
        coop_type = validated_data.pop('type')
        return CoopType.objects.get(name=coop_type['name'])

    def create(self, validated_data):
        coop_type_instance = self.get_coop_type_instance_from_validated_data(validated_data)  # Change 2
        return Coop.objects.create(type=coop_type_instance, **validated_data)  # Change 2

    def update(self, instance, validated_data):
        # Change 3 [starts]
        try:
            instance.type = self.get_coop_type_instance_from_validated_data(validated_data)
        except KeyError:
            pass
        # Change 3 [ends]

        instance.name = validated_data.get('name', instance.name)
        instance.address = validated_data.get('address', instance.address)
        instance.enabled = validated_data.get('enabled', instance.enabled)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.email = validated_data.get('email', instance.email)
        instance.web_site = validated_data.get('web_site', instance.web_site)
        instance.web_site = validated_data.get('web_site', instance.web_site)
        instance.save()


class AddressSerializer(serializers.ModelSerializer):
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
        return AddressField.objects.create(**validated_data)

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
        rep['state'] = StateSerializer(instance.state).data
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


