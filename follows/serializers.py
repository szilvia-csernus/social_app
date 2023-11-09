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
            'followed_name'
        ]
        read_only_fields = ['owner', 'followed_name']

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError('You already followed this person')
