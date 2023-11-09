from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProfileList.as_view()),
    path('<int:pk>/', views.ProfileDetail.as_view()),
]
