# Generated by Django 4.2.7 on 2023-11-10 07:32

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('follows', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='follow',
            old_name='followed',
            new_name='followed_user',
        ),
        migrations.AlterUniqueTogether(
            name='follow',
            unique_together={('owner', 'followed_user')},
        ),
    ]
