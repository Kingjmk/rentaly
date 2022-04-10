from django_filters import rest_framework as filters
from rest_framework import generics
from . import serializers
import core.models


class ApartmentListView(generics.ListAPIView):
    permission_classes = []
    authentication_classes = []
    queryset = core.models.Apartment.objects.all()
    serializer_class = serializers.ListDetailApartmentSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['area_size', 'price_per_month', 'number_of_rooms']
