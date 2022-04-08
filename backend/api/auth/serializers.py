from rest_framework import serializers
import accounts.models


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=True, max_length=254)
    password = serializers.CharField(required=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = accounts.models.User
        fields = ['id', 'email', 'first_name', 'last_name', 'role']
