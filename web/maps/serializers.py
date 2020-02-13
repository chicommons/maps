from rest_framework import serializers
from maps.models import Coop, CoopType


class CoopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coop
        fields = ['id', 'name', 'type', 'address', 'enabled', 'phone', 'email', 'web_site']

    def create(self, validated_data):
        """
        Create and return a new `Snippet` instance, given the validated data.
        """
        return Coop.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Snippet` instance, given the validated data.
        """
        instance.name = validated_data.get('name', instance.name)
        instance.type = validated_data.get('type', instance.type)
        instance.address = validated_data.get('address', instance.address)
        instance.enabled = validated_data.get('enabled', instance.enabled)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.email = validated_data.get('email', instance.email)
        instance.web_site = validated_data.get('web_site', instance.web_site)
        instance.save()
        return instance


