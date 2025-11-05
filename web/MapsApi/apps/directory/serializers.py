from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers, exceptions
from apps.directory.models import CoopType, ContactMethod, CoopAddressTags, Address, CoopProposal, CoopPublic, Coop, Person
from django.utils.timezone import now
from apps.directory.services.location_service import LocationService
import json

User = get_user_model()

class CoopTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoopType
        fields = ['name']

class ContactMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMethod
        fields = ['id', 'type', 'is_public', 'phone', 'email']
    
    def validate(self, data):
        if not data.get('email') and not data.get('phone'):
            raise serializers.ValidationError("Either an email or a phone number must be provided.")
        elif data.get('email') and data.get('phone'):
            raise serializers.ValidationError("Either an email or a phone number must be provided.")
        return data
    
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'street_address', 'city', 'county', 'state', 'postal_code', 'country', 'latitude', 'longitude']
    
    def create(self, validated_data):
        instance = Address.objects.create(**validated_data)
        if not instance.latitude or not instance.longitude or not instance.county:
            loc_svc = LocationService(instance)
            if not instance.latitude or not instance.longitude:
                loc_svc.save_coords()
            if not instance.county:
                loc_svc.save_county()
        return instance

    def update(self, instance, validated_data):
        address_change = any(
            getattr(instance, field) != validated_data[field] 
            for field in ['street_address', 'city', 'state', 'postal_code', 'country']
        )

        override_county = validated_data.get('county')
        if override_county:
            instance.county = validated_data.get('county')

        override_coords = validated_data.get('latitude') and validated_data.get('longitude')
        if override_coords:
            instance.latitude = validated_data.get('latitude')
            instance.longitude = validated_data.get('longitude')
        
        update_geocode = address_change and not ( override_county and override_coords )

        instance.street_address = validated_data.get('street_address', instance.street_address)
        instance.city = validated_data.get('city', instance.city)
        instance.state = validated_data.get('state', instance.state)
        instance.postal_code = validated_data.get('postal_code', instance.postal_code)
        instance.country = validated_data.get('country', instance.country)
        instance.save()

        if update_geocode:
            loc_svc = LocationService(instance)
            if not override_county:
                loc_svc.save_county()
            if not override_coords:
                loc_svc.save_coords()

        return instance

class CoopPublicListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoopPublic
        fields = ['id', 'status', 'created_by', 'created_datetime', 'last_modified_by', 'last_modified_datetime']



class PersonSerializer(serializers.ModelSerializer):
    contact_methods = ContactMethodSerializer(many=True)
    
    class Meta:
        model = Person
        fields = ['id', 'first_name', 'last_name', 'contact_methods', 'is_public']
      
    def create(self, validated_data):
        contact_methods_data = validated_data.pop('contact_methods', [])

        instance = Person.objects.create(**validated_data)

        for item in contact_methods_data:
            contact_method, _ = ContactMethod.objects.get_or_create(**item)
            instance.contact_methods.add(contact_method)

        return instance

    def update(self, instance, validated_data):
        contact_methods_data = validated_data.pop('contact_methods', [])

        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.is_public = validated_data.get('is_public', instance.is_public)

        instance.save()

        if contact_methods_data:
            instance.contact_methods.clear()
            for item in contact_methods_data:
                contact_method_serializer = ContactMethodSerializer(data=item)
                if contact_method_serializer.is_valid():
                    contact_method = contact_method_serializer.save()
                    instance.contact_methods.add(contact_method)
        
        return instance

class CoopAddressTagsSerializer(serializers.ModelSerializer):
    address = AddressSerializer(read_only=False)

    class Meta:
        model = CoopAddressTags
        fields = ['id', 'address', 'is_public']
    
    def create(self, validated_data):
        address_data = validated_data.pop('address', [])

        instance = CoopAddressTags.objects.create(**validated_data)

        address_serializer = AddressSerializer(data=address_data)
        if address_serializer.is_valid(raise_exception=True):
            address = address_serializer.save()
            instance.address = address
            
        instance.save()
        return instance
    
    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', [])

        instance.is_public = validated_data.get('is_public', instance.is_public)

        if address_data:
            instance.address.delete()
            address_serializer = AddressSerializer(data=address_data)
            if address_serializer.is_valid(raise_exception=True):
                address = address_serializer.save()
                instance.address = address
                
        instance.save()
        return instance
        
class CoopSerializer(serializers.ModelSerializer):
    types = CoopTypeSerializer(many=True, read_only=False, required=False, allow_null=True)
    contact_methods = ContactMethodSerializer(many=True, read_only=False, required=False, allow_null=True)
    people = PersonSerializer(many=True, read_only=False, required=False, allow_null=False)
    addresses = CoopAddressTagsSerializer(many=True, read_only=False, required=False, allow_null=True)

    class Meta:
        model = Coop
        fields = "__all__"

    @transaction.atomic
    def create(self, validated_data):
        types_data = validated_data.pop('types', [])
        contact_methods_data = validated_data.pop('contact_methods', [])
        people_data = validated_data.pop('people', [])
        addresses_data = validated_data.pop('addresses',[])

        instance = Coop.objects.create(**validated_data)

        for item in types_data:
            coop_type, _ = CoopType.objects.get_or_create(**item)
            instance.types.add(coop_type)
        
        for item in contact_methods_data:
            contact_method, _ = ContactMethod.objects.get_or_create(**item)
            instance.contact_methods.add(contact_method)

        for item in people_data:
            person_serializer = PersonSerializer(data=item)
            if person_serializer.is_valid(raise_exception=True):
                person = person_serializer.save()
                instance.people.add(person)
        
        for item in addresses_data:
            coop_address_tag_serializer = CoopAddressTagsSerializer(data=item)
            if coop_address_tag_serializer.is_valid(raise_exception=True):
                address = coop_address_tag_serializer.save()
                instance.addresses.add(address)

        return instance
    
    def update(self, instance, validated_data):
        types_data = validated_data.pop('types', None)
        contact_methods_data = validated_data.pop('contact_methods', None)
        people_data = validated_data.pop('people', None)
        addresses_data = validated_data.pop('addresses', None)

        for field, value in validated_data.items():
            setattr(instance, field, value)

        if types_data is not None:
            instance.types.clear()
            for item in types_data:
                coop_type, _ = CoopType.objects.get_or_create(**item)
                instance.types.add(coop_type)
        
        if contact_methods_data is not None:
            instance.contact_methods.clear()#all().delete()
            for item in contact_methods_data:
                contact_method_serializer = ContactMethodSerializer(data=item)
                if contact_method_serializer.is_valid():
                    contact_method = contact_method_serializer.save()
                    instance.contact_methods.add(contact_method)

        if people_data is not None:
            instance.people.clear()
            for person_data in people_data:
                person_serializer = PersonSerializer(data=person_data)
                if person_serializer.is_valid(raise_exception=True):
                    person = person_serializer.save()
                    instance.people.add(person)

        if addresses_data is not None:
            instance.addresses.clear()
            for item in addresses_data:
                coop_address_tag_serializer = CoopAddressTagsSerializer(data=item)
                if coop_address_tag_serializer.is_valid(raise_exception=True):
                    address = coop_address_tag_serializer.save()
                    instance.addresses.add(address)
        instance.save()
        return instance
        
class CoopProposalCreateSerializer(serializers.ModelSerializer):
    requested_by = serializers.ReadOnlyField(source='requested_by.username')
    proposal_status = serializers.CharField(read_only=True)
    change_summary = serializers.JSONField(read_only=True)
    requested_datetime = serializers.DateTimeField(read_only=True)
    coop_public_id = serializers.IntegerField(write_only=True, required=False)
    operation = serializers.CharField(write_only=True, required=True)
    coop = CoopSerializer(many=False, read_only=False, required=False)

    class Meta:
        model = CoopProposal
        fields = '__all__'
    
    def create(self, validated_data):
        operation = validated_data.pop('operation', "")

        if operation not in CoopProposal.OperationTypes:
            raise exceptions.ValidationError("Incorrect operation type.")

        if operation == CoopProposal.OperationTypes.CREATE:
            return self.process_create_operation(validated_data)
        elif operation == CoopProposal.OperationTypes.UPDATE:
            return self.process_update_operation(validated_data)
        elif operation == CoopProposal.OperationTypes.DELETE:
            return self.process_delete_operation(validated_data)
            
    def process_create_operation(self, validated_data):
        # Prepare Data to Create Coop
        coop_data = validated_data.pop('coop', {})
        coop_data["status"] = "PROPOSAL"

        # Prepare Data to Create Coop Proposal
        validated_data["proposal_status"] = "PENDING"
        validated_data["operation"] = "CREATE"
        validated_data["requested_datetime"] = now()
        validated_data["change_summary"] = json.dumps(coop_data, default=str)
        # Create CoopProposal object
        coop_proposal = CoopProposal.objects.create(**validated_data)

        # Create Coop object
        coop_serializer = CoopSerializer(data=coop_data)
        if coop_serializer.is_valid():
            coop_instance = coop_serializer.save()
            coop_proposal.coop = coop_instance
            coop_proposal.save()
        return coop_proposal
    
    def process_update_operation(self, validated_data):
        # Prepare Data to Create Coop
        coop_data = validated_data.pop('coop', {})
        coop_data["status"] = "PROPOSAL"

        # Prepare Data to Create CoopProposal
        validated_data["proposal_status"] = "PENDING"
        validated_data["operation"] = "UPDATE"
        validated_data["requested_datetime"] = now()
        validated_data["change_summary"] = json.dumps(coop_data, default=str)
        validated_data["coop_public"] = CoopPublic.objects.get(id=validated_data["coop_public_id"])
        # Create CoopProposal object
        coop_proposal = CoopProposal.objects.create(**validated_data)

        # Copy active Coop object. Save as new object.
        try:
            copied_coop = Coop.objects.get(status="ACTIVE", coop_public_id=validated_data["coop_public_id"])
        except Coop.MultipleObjectsReturned:
            raise Coop.MultipleObjectsReturned()
        except Coop.DoesNotExist:
            raise Coop.DoesNotExist()
        copied_coop.pk = None # Setting 'pk' to None creates a new instance when saved
        copied_coop.status = coop_data["status"]
        copied_coop.save()

        original_coop = Coop.objects.get(status="ACTIVE", coop_public_id=validated_data["coop_public_id"])

        for type in original_coop.types.all():
            copied_coop.types.add(type)
        for contact_method in original_coop.contact_methods.all():
            copied_coop.contact_methods.add(contact_method)
        for person in original_coop.people.all():
            copied_coop.people.add(person)
        for address in original_coop.addresses.all():
            copied_coop.addresses.add(address)
        copied_coop.save()

        # Modify copied coop object with user supplied changes.
        coop_serializer = CoopSerializer(copied_coop, data=coop_data)
        if coop_serializer.is_valid():
            coop_instance = coop_serializer.save()
            coop_proposal.coop = coop_instance
            coop_proposal.save()

        return coop_proposal

    def process_delete_operation(self, validated_data):
        coop_public_id = validated_data.pop('coop_public_id', {})

        validated_data["proposal_status"] = "PENDING"
        validated_data["operation"] = "DELETE"
        validated_data["requested_datetime"] = now()
        validated_data["change_summary"] = json.dumps(validated_data, default=str)

        coop_proposal = CoopProposal.objects.create(**validated_data)

        coop_proposal.coop_public = CoopPublic.objects.get(status="ACTIVE", id=coop_public_id)
        coop_proposal.save()
        return coop_proposal

class CoopProposalReviewSerializer(serializers.ModelSerializer):
    proposal_status = serializers.ChoiceField(choices=[('APPROVED','Approved'), ('REJECTED', 'Rejected')])
    reviewed_by = serializers.ReadOnlyField(source='reviewed_by.username')
    coop_public_id = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = CoopProposal
        fields = ['id', 'proposal_status', 'review_notes', 'coop_public_id', 'reviewed_by']
    
    def validate(self, attrs):
        if self.instance and (self.instance.proposal_status != CoopProposal.ProposalStatusEnum.PENDING):
            raise exceptions.ValidationError("Only proposals with a 'PENDING' proposal_status can be reviewed and applied.")
        return super().validate(attrs)
    
    def update(self, coop_proposal:CoopProposal, validated_data):
        self._update_coop_proposal(coop_proposal, validated_data)

        if coop_proposal.proposal_status == "REJECTED":
            coop_proposal.save()
            return coop_proposal
        
        coop_public = self._fetch_coop_public(coop_proposal)
        self._update_coop_public(coop_proposal, coop_public)
        if coop_proposal.operation == "CREATE":
            coop_proposal.coop_public = coop_public
            
        self._update_coop(coop_proposal, coop_public)

        coop_proposal.save()
        return coop_proposal

    def _update_coop_proposal(self, coop_proposal, validated_data):
        coop_proposal.proposal_status = validated_data.get('proposal_status')
        coop_proposal.review_notes = validated_data.get('review_notes', "")
        coop_proposal.reviewed_by = validated_data.get('reviewed_by')
        coop_proposal.reviewed_datetime = now()

    def _fetch_coop_public(self, coop_proposal):
        if coop_proposal.operation == "CREATE":
            return CoopPublic()
        elif coop_proposal.operation == "UPDATE":
            return self._get_or_raise_coop_public(coop_proposal)
        elif coop_proposal.operation == "DELETE":
            return self._get_or_raise_coop_public(coop_proposal)

    def _get_or_raise_coop_public(self, coop_proposal):
        try:
            return CoopPublic.objects.get(id=coop_proposal.coop_public.id)
        except CoopPublic.DoesNotExist:
            raise

    def _update_coop_public(self, coop_proposal, coop_public):
        coop_public.last_modified_by = coop_proposal.requested_by
        coop_public.last_modified_datetime = coop_proposal.reviewed_datetime
        if coop_proposal.operation == "CREATE":
            #coop_public.coop = coop_proposal.coop
            coop_public.status = "ACTIVE"
            coop_public.created_by = coop_proposal.requested_by
            coop_public.created_datetime = coop_proposal.reviewed_datetime
        elif coop_proposal.operation == "UPDATE":
            #coop_public.coop = coop_proposal.coop
            pass
        elif coop_proposal.operation == "DELETE":
            #coop_public.coop = None
            coop_public.status = "REMOVED"
        coop_public.save()

    def _update_coop(self, coop_proposal, coop_public):
        coop = coop_proposal.coop
        if coop_proposal.operation == "CREATE":
            coop.status = "ACTIVE"
            coop.coop_public = coop_public
        elif coop_proposal.operation == "UPDATE":
            self._archive_active_coop(coop_proposal)
            coop.status = "ACTIVE"
        elif coop_proposal.operation == "DELETE":
            self._archive_active_coop(coop_proposal)    
            return
        coop.save()

    def _archive_active_coop(self, coop_proposal):
        active_coop = self._get_active_coop(coop_proposal)
        active_coop.status = "ARCHIVED"
        active_coop.save()   

    def _get_active_coop(self, coop_proposal):
        try:
            active_coop = Coop.objects.get(status="ACTIVE", coop_public_id=coop_proposal.coop_public.id)
        except Coop.MultipleObjectsReturned:
            raise Coop.MultipleObjectsReturned
        return active_coop
    
    def to_representation(self, instance):
        # We want to return to the user the id of the approved coop without requiring them to navigate the coop_public object.
        # Meta.Fields determines which fields get returned. However, the coop_public_id field is not part of CoopProposal model which this serializer manipulates.
        # Below, after the serializer finishes its validation of CoopProposal we add a new field to the APIs response to the user.
        ret = super(CoopProposalReviewSerializer, self).to_representation(instance)
        ret['coop_public_id'] = instance.coop_public.id #if instance.coop_public else None
        return ret
    
class CoopProposalListSerializer(serializers.ModelSerializer):
    coop = CoopSerializer()
    
    class Meta:
        model = CoopProposal
        fields = ['id', 'proposal_status', 'operation', 'change_summary', 'review_notes', 'coop_public', 'requested_by', 'requested_datetime', 'reviewed_by', 'reviewed_datetime', 'coop']

class CoopProposalRetrieveSerializer(serializers.ModelSerializer):
    coop = CoopSerializer()
    
    class Meta:
        model = CoopProposal
        fields = ['id', 'proposal_status', 'operation', 'change_summary', 'review_notes', 'coop_public', 'requested_by', 'requested_datetime', 'reviewed_by', 'reviewed_datetime', 'coop']