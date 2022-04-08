"""
ASGI and WSGI config for backend project.

It exposes the ASGI and WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

wsgi_application = get_wsgi_application()
asgi_application = get_asgi_application()
