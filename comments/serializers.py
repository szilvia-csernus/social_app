from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    # post = serializers.ReadOnlyField(source='post.id')
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')

    def get_is_owner(self, obj):
        request = self.context['request']
        return obj.owner == request.user

    class Meta:
        model = Comment
        fields = [
            'id',
            'owner',
            'created_at',
            'updated_at',
            'content',
            'post',
            'profile_id',
            'profile_image',
            'is_owner'
        ]
        read_only_fields = ['owner', 'profile_id', 'profile_image']


class CommentDetailSerializer(CommentSerializer):
    post = serializers.ReadOnlyField(source='post.id')
