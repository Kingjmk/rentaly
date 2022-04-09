from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
import accounts.models


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=True, max_length=254)
    password = serializers.CharField(required=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = accounts.models.User
        fields = ['id', 'email', 'first_name', 'last_name', 'role']


class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=accounts.models.Roles.allowed_types(), required=True)
    new_password = serializers.CharField(required=True)
    new_password_confirm = serializers.CharField(required=True)

    class Meta:
        model = accounts.models.User
        fields = ['email', 'first_name', 'last_name', 'role', 'new_password', 'new_password_confirm']

    def validate_new_password(self, new_password):
        try:
            validate_password(password=new_password)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return new_password

    def validate(self, data):
        data = super().validate(data)

        if not data['new_password'] == data['new_password_confirm']:
            raise serializers.ValidationError('Passwords Don\'t match!')

        return data

    def create(self, validated_data):
        instance = super().create({
            'email': validated_data['email'],
            'first_name': validated_data['first_name'],
            'last_name': validated_data['last_name'],
            'role': validated_data['role']
        })
        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance
