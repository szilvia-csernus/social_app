from django.contrib.auth.models import User
from .models import Post
from rest_framework import status
from rest_framework.test import APITestCase


class PostListViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='szilvi', password='test_password')
        self.client.login(username='szilvi', password='test_password')

    def test_can_list_posts(self):
        szilvi = User.objects.get(username='szilvi')
        Post.objects.create(
            owner=szilvi, title='Test post', content='Test content')
        response = self.client.get('/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
