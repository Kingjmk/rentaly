from django.urls import path, include

app_name = 'api'
urlpatterns = [
    path('auth/', include('api.auth.urls')),
    path('apartments/', include('api.apartments.urls')),
    path('users/', include('api.users.urls')),
    path('misc/', include('api.misc.urls')),
]
