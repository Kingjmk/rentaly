from rest_framework import serializers
import core.models


class ListDetailApartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = core.models.Apartment
        fields = [
            'id', 'name', 'description', 'floor', 'area_size', 'price_per_month', 'number_of_rooms',
            'latitude', 'longitude',
        ]
