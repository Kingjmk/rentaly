from django.urls import path, include

app_name = 'api'
urlpatterns = [
    path('auth/', include('api.auth.urls')),
    path('core/', include('api.core.urls')),
    path('misc/', include('api.misc.urls')),
]
