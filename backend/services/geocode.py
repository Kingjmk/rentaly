from django.conf import settings
import requests

COUNTRY_CODES = ['ps']
API_KEY = settings.GEOCODE_API_KEY
API_URL = 'https://locationiq.com/v1/search.php'


def locate(address):
    return requests.get(
        API_URL,
        params={
            'key': API_KEY,
            'q': address,
            'format': 'json',
            'countrycodes': ','.join(COUNTRY_CODES),
        }
    )
