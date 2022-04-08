from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST, HTTP_200_OK
from utils import generate_error_response
from . import serializers
import accounts.models


class LoginView(generics.GenericAPIView):
    serializer_class = serializers.LoginSerializer
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            request=self.request,
            username=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )

        if not user:
            return Response(generate_error_response('Invalid credentials'), status=HTTP_400_BAD_REQUEST)

        if not user.is_active:
            return Response(generate_error_response('Invalid user'), status=HTTP_400_BAD_REQUEST)

        token, _ = Token.objects.get_or_create(user=user)

        data = {
            'token': token.key,
            'user': serializers.UserSerializer(user).data
        }

        return Response(data, status=HTTP_200_OK)


class LogoutView(generics.GenericAPIView):
    permission_classes = []

    def post(self, request):
        Token.objects.filter(user_id=self.request.user.pk).delete()
        return Response(status=HTTP_204_NO_CONTENT)


class StatusView(generics.RetrieveAPIView):
    permission_classes = []
    serializer_class = serializers.UserSerializer

    def get_object(self):
        return accounts.models.User.objects.get(pk=self.request.user.pk)
