from rest_framework import serializers
import core.models
from api.utils import PointField


class SearchSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField('get_image_url')

    def get_image_url(self, obj):
        if not obj.images.all():
            return None

        return obj.images.all()[0].image.url

    class Meta:
        model = core.models.Apartment
        fields = [
            'id', 'name', 'floor', 'area_size', 'price_per_month', 'number_of_rooms',
            'latitude', 'longitude', 'image_url',
        ]


class ApartmentImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField('get_image_url')

    def get_image_url(self, obj):
        return obj.image.url

    class Meta:
        model = core.models.ApartmentImage
        fields = ['id', 'apartment_id', 'image_url']


class ListDetailApartmentSerializer(serializers.ModelSerializer):
    images = ApartmentImageSerializer(many=True, default=[])

    class Meta:
        model = core.models.Apartment
        fields = [
            'id', 'name', 'description', 'floor', 'area_size', 'price_per_month', 'number_of_rooms',
            'latitude', 'longitude', 'images',
        ]


class EditApartmentSerializer(serializers.ModelSerializer):
    location = PointField(required=True, write_only=True)

    class Meta:
        model = core.models.Apartment
        fields = [
            'id', 'name', 'description', 'floor', 'area_size', 'price_per_month', 'number_of_rooms', 'location',
        ]

    def validate(self, attrs):
        location = attrs.pop('location')

        if location:
            attrs['latitude'] = location['latitude']
            attrs['longitude'] = location['longitude']

        return attrs
