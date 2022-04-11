from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, re_path, include
from revproxy.views import ProxyView

debug_urls = []
if settings.DEBUG:
    debug_urls = static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = debug_urls + [
    path('admin/', admin.site.urls),
    path('api/v1/', include('api.urls')),
    re_path(r'(?P<path>.*)', ProxyView.as_view(upstream=settings.FRONTEND_HOST_URL)),
]
