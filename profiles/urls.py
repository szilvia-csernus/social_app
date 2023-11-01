from django.urls import path
from . import views

urlpatterns = [
    path('profiles/', views.ProfileList.as_view()),
]
