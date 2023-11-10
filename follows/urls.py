from django.urls import path
from . import views

urlpatterns = [
    path('', views.FollowList.as_view()),
    path('<int:pk>/', views.FollowDetail.as_view()),
]
