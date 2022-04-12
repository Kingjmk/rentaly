from django_filters import rest_framework as filters
from rest_framework import generics
from . import serializers
from ..utils import Paginator
from .. import permissions
import core.models


class SearchListView(generics.ListAPIView):
    permission_classes = []
    authentication_classes = []
    queryset = core.models.Apartment.objects.prefetch_related('images')
    serializer_class = serializers.SearchSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['area_size', 'price_per_month', 'number_of_rooms']
    pagination_class = Paginator


class ApartmentListView(generics.ListAPIView):
    permission_classes = [permissions.AdminPermission | permissions.RealtorPermission]
    queryset = core.models.Apartment.objects.prefetch_related('images').order_by('id')
    serializer_class = serializers.ListDetailApartmentSerializer
    pagination_class = Paginator


class ApartmentDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.AdminPermission | permissions.RealtorPermission]
    queryset = core.models.Apartment.objects.prefetch_related('images').order_by('id')
    serializer_class = serializers.ListDetailApartmentSerializer


class ApartmentCreateView(generics.CreateAPIView):
    permission_classes = [permissions.AdminPermission | permissions.RealtorPermission]
    serializer_class = serializers.EditApartmentSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ApartmentUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.AdminPermission | permissions.RealtorPermission]
    queryset = core.models.Apartment.objects.prefetch_related('images').order_by('id')
    serializer_class = serializers.EditApartmentSerializer
