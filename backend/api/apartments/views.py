from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, response
from rest_framework.status import HTTP_201_CREATED
from . import serializers, filters
from ..utils import Paginator
from .. import permissions
import core.models


class SearchListView(generics.ListAPIView):
    permission_classes = []
    serializer_class = serializers.SearchSerializer
    filterset_class = filters.SearchListFilter
    filter_backends = [DjangoFilterBackend]
    pagination_class = Paginator

    def get_queryset(self):
        return core.models.Apartment.objects.prefetch_related('images').filter(
            longitude__isnull=False, latitude__isnull=False,
        ).allowed_for(self.request.user)


class ApartmentListView(generics.ListAPIView):
    permission_classes = [permissions.AdminPermission | permissions.RealtorPermission]
    queryset = core.models.Apartment.objects.prefetch_related('images').order_by('id')
    serializer_class = serializers.ListDetailApartmentSerializer
    pagination_class = Paginator


class ApartmentDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.AdminPermission | permissions.RealtorPermission | permissions.ClientPermission]
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


class ApartmentImageCreateView(generics.CreateAPIView):
    permission_classes = [permissions.AdminPermission | permissions.RealtorPermission]
    serializer_class = serializers.CreateApartmentImageSerializer
    detail_serializer_class = serializers.ApartmentImageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        detail_serializer = self.detail_serializer_class(instance, context=self.get_serializer_context())
        return response.Response(detail_serializer.data, status=HTTP_201_CREATED)


class ApartmentImageDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.AdminPermission | permissions.RealtorPermission]
    queryset = core.models.ApartmentImage.objects.all()
