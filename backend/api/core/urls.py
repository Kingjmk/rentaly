from django.urls import path
from . import views


urlpatterns = [
    path('apartments/search', views.SearchListView.as_view()),
    path('apartments/list', views.ApartmentListView.as_view()),
    path('apartments/create', views.ApartmentCreateView.as_view()),
    path('apartments/<int:pk>', views.ApartmentDetailView.as_view()),
    path('apartments/<int:pk>/update', views.ApartmentUpdateView.as_view()),

    path('apartments/images/create', views.ApartmentImageCreateView.as_view()),
    path('apartments/images/<int:pk>/delete', views.ApartmentImageDeleteView.as_view()),
]
