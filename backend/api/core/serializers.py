from rest_framework import serializers
import core.models


class ApartmentImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField('get_image_url')

    def get_image_url(self, obj):
        return obj.image.url

    class Meta:
        model = core.models.ApartmentImage
        fields = ['id', 'apartment_id', 'image_url']


class ListDetailApartmentSerializer(serializers.ModelSerializer):
    images = ApartmentImageSerializer(many=True)

    class Meta:
        model = core.models.Apartment
        fields = [
            'id', 'name', 'description', 'floor', 'area_size', 'price_per_month', 'number_of_rooms',
            'latitude', 'longitude', 'images',
        ]
