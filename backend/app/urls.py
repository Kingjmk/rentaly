from django.conf import settings
from django.contrib import admin
from django.urls import path, re_path, include
from revproxy.views import ProxyView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('api.urls')),
    re_path(r'(?P<path>.*)', ProxyView.as_view(upstream=settings.FRONTEND_HOST_URL)),
]
