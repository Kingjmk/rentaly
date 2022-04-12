from django.urls import path
from . import views


urlpatterns = [
    path('geocode/locate', views.GeocodeLocateView.as_view()),
]
