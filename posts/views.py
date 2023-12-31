from django.db.models import Count
from rest_framework import permissions, generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post
from .serializers import PostSerializer
from social_app.permissions import IsOwnerOrReadOnly


# class PostList(APIView):
#     serializer_class = PostSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]

#     def get(self, request):
#         posts = Post.objects.all()
#         serializer = PostSerializer(posts, many=True,
#                                     context={'request': request})
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = PostSerializer(data=request.data,
#                                     context={'request': request})

#         if serializer.is_valid():
#             serializer.save(owner=request.user)
#             return Response(serializer.data,
#                             status=status.HTTP_201_CREATED)
#         return Response(serializer.errors,
#                         status=status.HTTP_400_BAD_REQUEST)


# class PostDetail(APIView):
#     serializer_class = PostSerializer
#     permission_classes = [IsOwnerOrReadOnly]

#     def get_object(self, pk):
#         post = get_object_or_404(Post, pk=pk)
#         self.check_object_permissions(self.request, post)
#         return post

#     def get(self, request, pk):
#         post = self.get_object(pk)
#         serializer = PostSerializer(post, context={'request': request})
#         return Response(serializer.data)

#     def put(self, request, pk):
#         post = self.get_object(pk)
#         serializer = PostSerializer(post,
#                                     data=request.data,
#                                     context={'request': request})
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors,
#                         status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):
#         post = self.get_object(pk)
#         post.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


class PostList(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Post.objects.annotate(
        comments_count=Count('comments', distinct=True),
        likes_count=Count('likes', distinct=True),
    ).order_by('-created_at')

    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    ordering_fields = [
        'comments_count',
        'likes_count',
        'likes__created_at',
    ]
    search_fields = [
        'owner__username',
        'title',
    ]
    filterset_fields = [
        # filter the posts by the post owners' followers
        'owner__followers__owner__profile',
        # filter the posts by users who liked them
        'likes__owner__profile',
        # filter the posts by creators
        'owner__profile',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = PostSerializer
    queryset = Post.objects.annotate(
        comments_count=Count('comments', distinct=True),
        likes_count=Count('likes', distinct=True),
    ).order_by('-created_at')
