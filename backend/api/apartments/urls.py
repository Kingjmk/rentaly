from django.urls import path
from . import views


urlpatterns = [
    path('search', views.SearchListView.as_view()),
    path('list', views.ApartmentListView.as_view()),
    path('create', views.ApartmentCreateView.as_view()),
    path('images/create', views.ApartmentImageCreateView.as_view()),
    path('images/<int:pk>/delete', views.ApartmentImageDeleteView.as_view()),

    path('<int:pk>', views.ApartmentDetailView.as_view()),
    path('<int:pk>/update', views.ApartmentUpdateView.as_view()),
]
