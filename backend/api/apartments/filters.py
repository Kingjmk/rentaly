from django_filters import rest_framework as filters
import core.models


class SearchListFilter(filters.FilterSet):
    min_lat = filters.NumberFilter(field_name='latitude', lookup_expr='gte')
    max_lat = filters.NumberFilter(field_name='latitude', lookup_expr='lte')
    min_lng = filters.NumberFilter(field_name='longitude', lookup_expr='gte')
    max_lng = filters.NumberFilter(field_name='longitude', lookup_expr='lte')

    class Meta:
        model = core.models.Apartment
        fields = ['area_size', 'price_per_month', 'number_of_rooms', 'min_lat', 'max_lat', 'min_lng', 'max_lng']
