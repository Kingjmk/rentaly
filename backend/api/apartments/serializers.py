from django.core.validators import validate_image_file_extension
from rest_framework import serializers
from api.utils import PointField
import core.models


class SearchSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField('get_image_url')

    def get_image_url(self, obj):
        if not obj.images.all():
            return None
        image_url = obj.images.all()[0].image.url
        request = self.context.get('request')
        return request.build_absolute_uri(image_url)

    class Meta:
        model = core.models.Apartment
        fields = [
            'id', 'name', 'floor', 'area_size', 'price_per_month', 'number_of_rooms',
            'latitude', 'longitude', 'image_url', 'state',
        ]


class ApartmentImageSerializer(serializers.ModelSerializer):
    serializers.ImageField()
    url = serializers.SerializerMethodField('get_url')
    name = serializers.SerializerMethodField('get_name')

    def get_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url)

    def get_name(self, obj):
        return obj.image.name

    class Meta:
        model = core.models.ApartmentImage
        fields = ['id', 'apartment_id', 'url', 'name']


class ListDetailApartmentSerializer(serializers.ModelSerializer):
    images = ApartmentImageSerializer(many=True, default=[])

    class Meta:
        model = core.models.Apartment
        fields = [
            'id', 'name', 'description', 'floor', 'area_size', 'price_per_month', 'number_of_rooms',
            'latitude', 'longitude', 'images', 'created_on', 'state',
        ]


class EditApartmentSerializer(serializers.ModelSerializer):
    location = PointField(required=True, write_only=True)

    class Meta:
        model = core.models.Apartment
        fields = [
            'id', 'name', 'description', 'floor', 'area_size', 'price_per_month', 'number_of_rooms', 'location', 'state',
        ]

    def validate(self, attrs):
        location = attrs.pop('location')

        if location:
            attrs['latitude'] = location['latitude']
            attrs['longitude'] = location['longitude']

        return attrs


class CreateApartmentImageSerializer(serializers.ModelSerializer):
    apartment = serializers.SlugRelatedField(
        slug_field='id',
        queryset=core.models.Apartment.objects.all(),
        required=True
    )

    image = serializers.ImageField(allow_empty_file=False, validators=[validate_image_file_extension], required=True)

    class Meta:
        model = core.models.ApartmentImage
        fields = ['id', 'image', 'apartment']
