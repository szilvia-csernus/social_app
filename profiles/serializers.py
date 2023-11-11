from rest_framework import serializers
from .models import Profile
from follows.models import Follow


class ProfileSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    follow_id = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        request = self.context['request']
        return obj.owner == request.user

    def get_follow_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            follow = Follow.objects.filter(
                owner=user, followed_user=obj.owner).first()
            print(follow)
            return follow.id if follow else None
        return None

    class Meta:
        model = Profile
        fields = [
            'id',
            'owner',
            'created_at',
            'updated_at',
            'name',
            'content',
            'image',
            'is_owner',
            'follow_id',
        ]
        read_only_fields = ['owner', 'is_owner', 'follow_id']
