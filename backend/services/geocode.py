from django.conf import settings
import requests


API_KEY = settings.GEOCODE_API_KEY
API_URL = 'http://api.positionstack.com/v1/forward'


def locate(address):
    return requests.get(
        API_URL,
        params={
            'access_key': API_KEY,
            'query': address
        }
    )
