from django.contrib.auth.models import User
from .models import Post
from rest_framework import status
from rest_framework.test import APITestCase


class PostListViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='szilvi', password='test_password')

    def test_can_list_posts(self):
        szilvi = User.objects.get(username='szilvi')
        Post.objects.create(
            owner=szilvi, title='Test post', content='Test content')
        response = self.client.get('/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_user_can_create_post(self):
        self.client.login(username='szilvi', password='test_password')
        response = self.client.post(
            '/posts/', {'title': 'Test post', 'content': 'Test content'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        count = Post.objects.count()
        self.assertEqual(count, 1)

    def test_not_logged_in_user_cannot_create_post(self):
        response = self.client.post(
            '/posts/', {'title': 'Test post', 'content': 'Test content'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        count = Post.objects.count()
        self.assertEqual(count, 0)


class PostDetailViewTests(APITestCase):
    def setUp(self):
        szilvi = User.objects.create_user(
            username='szilvi', password='test_password')
        User.objects.create_user(
            username='another_user', password='test_password')
        Post.objects.create(
            owner=szilvi, title='Test post', content='Test content')

    def test_can_retrieve_post(self):
        response = self.client.get('/posts/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_not_existing_post_returns_404(self):
        response = self.client.get('/posts/999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_authenticated_user_can_update_post(self):
        self.client.login(username='szilvi', password='test_password')
        response = self.client.put(
            '/posts/1/', {'title': 'Updated post',
                          'content': 'Updated content'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        post = Post.objects.get(pk=1)
        self.assertEqual(post.title, 'Updated post')

    def test_not_authenticated_user_cannot_update_post(self):
        self.client.login(username='another_user', password='test_password')
        response = self.client.put(
            '/posts/1/', {'title': 'Updated post',
                          'content': 'Updated content'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authenticated_user_can_delete_post(self):
        self.client.login(username='szilvi', password='test_password')
        response = self.client.delete('/posts/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        count = Post.objects.count()
        self.assertEqual(count, 0)

    def test_not_authenticated_user_cannot_delete_post(self):
        self.client.login(username='another_user', password='test_password')
        response = self.client.delete('/posts/1/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        count = Post.objects.count()
        self.assertEqual(count, 1)
