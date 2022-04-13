from rest_framework import generics, response
from rest_framework.status import HTTP_201_CREATED, HTTP_200_OK
from .. import permissions
from ..utils import Paginator
from . import serializers
import accounts.models


# User APIs
class UserListView(generics.ListAPIView):
    permission_classes = [permissions.AdminPermission]
    queryset = accounts.models.User.objects.order_by('id')
    serializer_class = serializers.ListDetailUserSerializer
    pagination_class = Paginator


class UserDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.AdminPermission]
    queryset = accounts.models.User.objects.order_by('id')
    serializer_class = serializers.ListDetailUserSerializer


class UserCreateView(generics.CreateAPIView):
    permission_classes = [permissions.AdminPermission]
    serializer_class = serializers.CreateUserSerializer
    detail_serializer_class = serializers.ListDetailUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return response.Response(self.detail_serializer_class(instance).data, status=HTTP_201_CREATED)


class UserUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.AdminPermission]
    queryset = accounts.models.User.objects.order_by('id')
    serializer_class = serializers.EditUserSerializer
    detail_serializer_class = serializers.ListDetailUserSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return response.Response(self.detail_serializer_class(instance).data, status=HTTP_200_OK)
