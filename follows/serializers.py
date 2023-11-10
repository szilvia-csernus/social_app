from django.db import IntegrityError
from rest_framework import serializers
from .models import Follow


class FollowSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Follow
        fields = [
            'id',
            'owner',
            'followed_user',
        ]
        read_only_fields = ['owner']

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError(
                'You already followed this person')


class FollowDetailSerializer(FollowSerializer):
    followed_user = serializers.ReadOnlyField(source='followed_user.username')
