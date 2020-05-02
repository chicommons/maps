import factory
from maps.models import CoopType, Coop


class CoopTypeFactory(factory.DjangoModelFactory):
    """
        Define Coop Type Factory
    """
    class Meta:
        model = CoopType


class CoopFactory(factory.DjangoModelFactory):
    """
        Define Coop Factory
    """
    class Meta:
        model = Coop

    coop_type = factory.SubFactory(CoopTypeFactory)


