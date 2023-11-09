from django.urls import path
from . import views

urlpatterns = [
    path('', views.LikeList.as_view()),
    path('<int:pk>/', views.LikeDetail.as_view()),
]
