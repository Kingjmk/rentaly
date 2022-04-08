from django.urls import path
from . import views


urlpatterns = [
    path('login', views.LoginView.as_view()),
    path('logout', views.LogoutView.as_view()),
    path('status', views.StatusView.as_view()),
]
