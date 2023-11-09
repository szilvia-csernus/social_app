from rest_framework import generics, permissions
from social_app.permissions import IsOwnerOrReadOnly
from .models import Comment
from .serializers import CommentSerializer, CommentDetailSerializer

# Generic views are classes that help us to build API views more quickly
# and with less code. ListCreateAPIView is a generic view that provides the
# following actions: GET and POST views. Additionally, we no longer need to
# include "request" in the context argument of the serializer as the generic
# view automatically includes it.


class CommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = CommentDetailSerializer
    queryset = Comment.objects.all()
