from django.utils.translation import gettext_lazy as _
from rest_framework import pagination
from rest_framework import serializers
import json


EMPTY_VALUES = (None, '', [], (), {})


class Paginator(pagination.PageNumberPagination):
    page_size_query_param = 'page_limit'
    max_page_size = 100

    def get_next_link(self):
        if not self.page.has_next():
            return None
        return self.page.next_page_number()

    def get_previous_link(self):
        if not self.page.has_previous():
            return None
        return self.page.previous_page_number()


class PointField(serializers.Field):
    """
    A field for handling Location Point fields as a json format.
    Expected input format:
        {
           "latitude": 49.8782482189424,
           "longitude": 24.452545489
        }
    """

    default_error_messages = {
        'invalid': _('Enter a valid location.'),
    }

    def to_internal_value(self, value):
        """
        Parse json data and return a point object
        """
        if value in EMPTY_VALUES and not self.required:
            return None

        if isinstance(value, str):
            try:
                value = value.replace("'", '"')
                value = json.loads(value)
            except ValueError:
                self.fail('invalid')

        if value and isinstance(value, dict):
            try:
                latitude = value['latitude']
                longitude = value['longitude']

                if not (90 >= float(latitude) >= -90):
                    raise ValueError('Longitude must be between 90 and -90')

                if not (180 >= float(longitude) >= -180):
                    raise ValueError('Longitude must be between 180 and -180')

                return {
                    'latitude': latitude,
                    'longitude': longitude,
                }

            except (ValueError, KeyError):
                self.fail('invalid')

        self.fail('invalid')

    def to_representation(self, value):
        if value is None:
            return value
        return value
