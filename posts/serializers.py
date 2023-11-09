from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')
    is_owner = serializers.SerializerMethodField()

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
            'is_owner'
        ]
        read_only_fields = ['owner', 'profile_id', 'profile_image']
