from django.db import models
from django.contrib.auth.models import User


class Follow(models.Model):
    """
    Follow model, related to 'owner' and 'post.
    """

    owner = models.ForeignKey(User, on_delete=models.CASCADE,
                              related_name='following')
    followed_user = models.ForeignKey(User, on_delete=models.CASCADE,
                                      related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['owner', 'followed_user']

    def __str__(self):
        return f'{self.owner} follows {self.followed_user}'
