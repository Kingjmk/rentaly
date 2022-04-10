from django.urls import path
from . import views


urlpatterns = [
    path('apartments', views.ApartmentListView.as_view()),
]
