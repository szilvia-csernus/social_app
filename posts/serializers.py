from rest_framework import serializers
from .models import Post
from likes.models import Like


class PostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')
    is_owner = serializers.SerializerMethodField()
    like_id = serializers.SerializerMethodField()

    def validate_image(self, value):
        if value.size > 2 * 1024 * 1024:  # 2MB
            raise serializers.ValidationError('Image size too large')
        if value.image.width > 4096 or value.image.height > 4096:
            raise serializers.ValidationError(
                'Image width or height too large')
        return value

    def get_is_owner(self, obj):
        request = self.context['request']
        return obj.owner == request.user

    def get_like_id(self, obj):
        """
        Return the like id for this post if the user is authenticated.
        This runs a query for each post in the list, so it's not very
        efficient. We'll learn how to optimize this in a later chapter.
        """
        user = self.context['request'].user
        if user.is_authenticated:
            like = Like.objects.filter(owner=user, post=obj).first()
            return like.id if like else None
        return None

    class Meta:
        model = Post
        fields = [
            'id',
            'owner',
            'created_at',
            'updated_at',
            'title',
            'content',
            'image',
            'profile_id',
            'profile_image',
            'is_owner',
            'like_id',
        ]
        read_only_fields = ['owner', 'profile_id', 'profile_image']
