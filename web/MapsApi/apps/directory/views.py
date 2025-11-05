from django.db.models import Q, Prefetch
from django.db.models.functions import Lower
from django.http import Http404
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiParameter

from apps.directory.models import ContactMethod, CoopType, CoopAddressTags, Coop, CoopProposal, Person
from apps.directory.serializers import CoopProposalCreateSerializer, CoopProposalListSerializer, CoopProposalRetrieveSerializer, CoopProposalReviewSerializer, CoopSerializer, CoopTypeSerializer
from apps.directory.renderers import CSVRenderer
from apps.directory.pagination import StandardResultsSetPagination

@extend_schema_view(
    get=extend_schema(
        parameters=[
            OpenApiParameter(name='types', description="comma separated list of coop types", type=str)
        ]
    )
)
class CoopCSVView(APIView):
    permission_classes = [AllowAny]
    renderer_classes = [CSVRenderer]

    def get(self, request, *args, **kwargs):
        queryset = Coop.objects.filter(status=Coop.Status.ACTIVE)

        types_query = self.request.query_params.get('types', None)

        if types_query:
            types_arr = [j.strip() for j in types_query.split(",")]
            filter = Q(
                *[('types__name__icontains', type) for type in types_arr],
                _connector=Q.OR
            )
            queryset = queryset.filter(filter)
        else:
            return Response(None)

        # Flatten the structure: one row per Coop-Address combination
        data = []
        for coop in queryset:
            coop_type_names = ', '.join(coop.types.all().values_list('name', flat=True))
            for address_tag in coop.addresses.all():
                if address_tag.is_public:
                    address = address_tag.address
                    data.append({
                        'name': coop.name,
                        'address': address.street_address,
                        'city': address.city,
                        'postal code': address.postal_code,
                        'type': coop_type_names,
                        'website': coop.web_site,
                        'lon': address.longitude,
                        'lat': address.latitude
                    })

        return Response(data)

@extend_schema_view(
    get=extend_schema(
        parameters=[
            OpenApiParameter(name='name', type=str),
            OpenApiParameter(name='street', type=str),
            OpenApiParameter(name='city', type=str),
            OpenApiParameter(name='zip', type=str),
            OpenApiParameter(name='types', description="comma separated list of coop types", type=str),
        ]
    )
)
class CoopList(generics.ListAPIView):
    serializer_class = CoopSerializer

    def perform_create(self, serializer):
        serializer.save(rec_updated_by=self.request.user)

    def get_queryset(self):
        queryset = Coop.objects.filter(status=Coop.Status.ACTIVE)

        name = self.request.query_params.get('name', None)
        street = self.request.query_params.get('street', None)
        city = self.request.query_params.get('city', None)
        zip = self.request.query_params.get('zip', None)
        types_data = self.request.query_params.get('types', None)

        if name:
            queryset = queryset.filter(name__icontains=name)
        if street:
            queryset = queryset.filter(addresses__address__street_address__icontains=street).distinct()
        if city:
            queryset = queryset.filter(addresses__address__city__icontains=city).distinct()
        if zip:
            queryset = queryset.filter(addresses__address__postal_code__icontains=zip).distinct()
        if types_data:
            types = types_data.split(",")
            filter = Q(
                *[('types__name', type) for type in types],
                _connector=Q.OR
            )
            queryset = queryset.filter(filter)
        
        public_addresses = CoopAddressTags.objects.filter(is_public=True)
        public_contactmethods = ContactMethod.objects.filter(is_public=True)
        public_people = Person.objects.filter(is_public=True)

        people_with_public_contact_methods = Prefetch('contact_methods', queryset=public_contactmethods)
        public_people = Person.objects.prefetch_related(people_with_public_contact_methods).filter(is_public=True)

        queryset = queryset.prefetch_related(
            Prefetch('addresses', queryset=public_addresses),
            Prefetch('contact_methods', queryset=public_contactmethods),
            Prefetch('people', queryset=public_people),
        )

        return queryset
    
    def get_permissions(self):
        if self.request.method == 'GET': #LIST
            self.permission_classes = [AllowAny]
        elif self.request.method == 'POST': #CREATE
            self.permission_classes = [IsAuthenticated]
        return [permission() for permission in self.permission_classes]
    
class CoopDetail(generics.RetrieveAPIView):
    queryset = Coop.objects.filter(status=Coop.Status.ACTIVE)
    serializer_class = CoopSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        coop_public_id = self.kwargs.get('coop_public_id')

        public_contact_methods = ContactMethod.objects.filter(is_public=True)
        people_with_public_contact_methods = Prefetch('contact_methods', queryset=public_contact_methods)
        public_people = Person.objects.prefetch_related(people_with_public_contact_methods).filter(is_public=True)

        queryset = self.queryset.prefetch_related(
            Prefetch('addresses', queryset=CoopAddressTags.objects.filter(is_public=True)),
            Prefetch('contact_methods', queryset=ContactMethod.objects.filter(is_public=True)),
            Prefetch('people', queryset=public_people),
        ).filter(coop_public_id=coop_public_id)

        try:
            obj = queryset.get()
        except Coop.DoesNotExist:
            raise Http404("No Coop matches the given query.")

        self.check_object_permissions(self.request, obj)
        return obj
        
class CoopsNoCoords(generics.ListAPIView):
    queryset = Coop.objects.filter(status=Coop.Status.ACTIVE).exclude(addresses__isnull=True).filter(
            Q(addresses__address__latitude__isnull=True) | Q(addresses__address__longitude__isnull=True)
        )
    serializer_class = CoopSerializer
    permission_classes = [IsAdminUser]

class CoopsUnapproved(generics.ListAPIView):
    queryset = CoopProposal.objects.filter(proposal_status=CoopProposal.ProposalStatusEnum.PENDING)
    serializer_class = CoopProposalListSerializer
    permission_classes = [IsAdminUser]
    
class CoopTypeList(generics.ListAPIView):
    queryset = CoopType.objects.all().order_by(Lower('name'))
    serializer_class = CoopTypeSerializer
    permission_classes = [AllowAny]

class CoopTypeDetail(generics.RetrieveAPIView):
    queryset = CoopType.objects.all()
    serializer_class = CoopTypeSerializer
    permission_classes = [AllowAny]

class CountryList(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):   
        countries_data = [
            {
                'code': 'US',
                'name': 'United States'
            }
        ]
        return Response(countries_data, status.HTTP_200_OK)
    
class StateList(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        input_country_code = self.kwargs['country_code']
        states_data = {'US': [{'name': 'Alaska', 'code': 'AK', 'country': 'US'}, {'name': 'Alabama', 'code': 'AL', 'country': 'US'}, {'name': 'Arkansas', 'code': 'AR', 'country': 'US'}, {'name': 'American Samoa', 'code': 'AS', 'country': 'US'}, {'name': 'Arizona', 'code': 'AZ', 'country': 'US'}, {'name': 'California', 'code': 'CA', 'country': 'US'}, {'name': 'Colorado', 'code': 'CO', 'country': 'US'}, {'name': 'Connecticut', 'code': 'CT', 'country': 'US'}, {'name': 'District of Columbia', 'code': 'DC', 'country': 'US'}, {'name': 'Delaware', 'code': 'DE', 'country': 'US'}, {'name': 'Florida', 'code': 'FL', 'country': 'US'}, {'name': 'Georgia', 'code': 'GA', 'country': 'US'}, {'name': 'Guam', 'code': 'GU', 'country': 'US'}, {'name': 'Hawaii', 'code': 'HI', 'country': 'US'}, {'name': 'Iowa', 'code': 'IA', 'country': 'US'}, {'name': 'Idaho', 'code': 'ID', 'country': 'US'}, {'name': 'Illinois', 'code': 'IL', 'country': 'US'}, {'name': 'Indiana', 'code': 'IN', 'country': 'US'}, {'name': 'Kansas', 'code': 'KS', 'country': 'US'}, {'name': 'Kentucky', 'code': 'KY', 'country': 'US'}, {'name': 'Louisiana', 'code': 'LA', 'country': 'US'}, {'name': 'Massachusetts', 'code': 'MA', 'country': 'US'}, {'name': 'Maryland', 'code': 'MD', 'country': 'US'}, {'name': 'Maine', 'code': 'ME', 'country': 'US'}, {'name': 'Michigan', 'code': 'MI', 'country': 'US'}, {'name': 'Minnesota', 'code': 'MN', 'country': 'US'}, {'name': 'Missouri', 'code': 'MO', 'country': 'US'}, {'name': 'Northern Mariana Islands', 'code': 'MP', 'country': 'US'}, {'name': 'Mississippi', 'code': 'MS', 'country': 'US'}, {'name': 'Montana', 'code': 'MT', 'country': 'US'}, {'name': 'North Carolina', 'code': 'NC', 'country': 'US'}, {'name': 'North Dakota', 'code': 'ND', 'country': 'US'}, {'name': 'Nebraska', 'code': 'NE', 'country': 'US'}, {'name': 'New Hampshire', 'code': 'NH', 'country': 'US'}, {'name': 'New Jersey', 'code': 'NJ', 'country': 'US'}, {'name': 'New Mexico', 'code': 'NM', 'country': 'US'}, {'name': 'Nevada', 'code': 'NV', 'country': 'US'}, {'name': 'New York', 'code': 'NY', 'country': 'US'}, {'name': 'Ohio', 'code': 'OH', 'country': 'US'}, {'name': 'Oklahoma', 'code': 'OK', 'country': 'US'}, {'name': 'Oregon', 'code': 'OR', 'country': 'US'}, {'name': 'Pennsylvania', 'code': 'PA', 'country': 'US'}, {'name': 'Puerto Rico', 'code': 'PR', 'country': 'US'}, {'name': 'Rhode Island', 'code': 'RI', 'country': 'US'}, {'name': 'South Carolina', 'code': 'SC', 'country': 'US'}, {'name': 'South Dakota', 'code': 'SD', 'country': 'US'}, {'name': 'Tennessee', 'code': 'TN', 'country': 'US'}, {'name': 'Texas', 'code': 'TX', 'country': 'US'}, {'name': 'United States Minor Outlying Islands', 'code': 'UM', 'country': 'US'}, {'name': 'Utah', 'code': 'UT', 'country': 'US'}, {'name': 'Virginia', 'code': 'VA', 'country': 'US'}, {'name': 'Virgin Islands', 'code': 'VI', 'country': 'US'}, {'name': 'Vermont', 'code': 'VT', 'country': 'US'}, {'name': 'Washington', 'code': 'WA', 'country': 'US'}, {'name': 'Wisconsin', 'code': 'WI', 'country': 'US'}, {'name': 'West Virginia', 'code': 'WV', 'country': 'US'}, {'name': 'Wyoming', 'code': 'WY', 'country': 'US'}]}
        if input_country_code in states_data:
            return Response(states_data[input_country_code], status.HTTP_200_OK)
        else:
            return Response("Country not found.", status.HTTP_404_NOT_FOUND)

@extend_schema_view(
    get=extend_schema(
        parameters=[
            OpenApiParameter(name='coop_public_id', type=int),
            OpenApiParameter(name='proposal_status', type=str, enum=CoopProposal.ProposalStatusEnum),
            OpenApiParameter(name='operation', type=str, enum=CoopProposal.OperationTypes),
        ]
    )
)
class CoopProposalList(generics.ListAPIView):
    serializer_class = CoopProposalListSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = CoopProposal.objects.all()

        coop_public_id = self.request.GET.get("coop_public_id", None)
        proposal_status_query = self.request.GET.get("proposal_status", None)
        operation_query = self.request.GET.get("operation", None)

        if coop_public_id:
            queryset = queryset.filter(coop_public__id=coop_public_id)
        if proposal_status_query:
            try:
                proposal_status = CoopProposal.ProposalStatusEnum(proposal_status_query).value
                queryset = queryset.filter(proposal_status=proposal_status)
            except Exception:
                pass
        if operation_query:
            try:
                operation = CoopProposal.OperationTypes(operation_query).value
                queryset = queryset.filter(operation=operation)
            except Exception:
                pass

        queryset = queryset.select_related('coop')
        return queryset
    
    pagination_class = StandardResultsSetPagination

class CoopProposalRetrieve(generics.RetrieveAPIView):
    queryset = CoopProposal.objects.all()
    serializer_class = CoopProposalRetrieveSerializer
    permission_classes = [IsAdminUser]
    
class CoopProposalCreate(generics.CreateAPIView):
    serializer_class = CoopProposalCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(requested_by=self.request.user)

class CoopProposalReview(generics.UpdateAPIView):
    queryset = CoopProposal.objects.all()
    serializer_class = CoopProposalReviewSerializer
    permission_classes = [IsAdminUser]

    def perform_update(self, serializer):
        serializer.save(reviewed_by=self.request.user)
