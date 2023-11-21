"""
Django settings for social_app project.

Generated by 'django-admin startproject' using Django 3.2.20.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""
import os
import dj_database_url
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = 'DEV' in os.environ

ALLOWED_HOSTS = [os.environ.get("ALLOWED_HOST"),
                 '127.0.0.1', 'localhost',]

# REST Framework settings

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [(
        # 'rest_framework.authentication.SessionAuthentication'
        # if 'DEV' in os.environ
        # else
        # This is from the dj-rest-auth docs, it didn't work here!
        # https://dj-rest-auth.readthedocs.io/en/latest/installation.html
        # 'dj_rest_auth.jwt_auth.JWTCookieAuthentication'
        # This one is from the djangorestframework-simplejwt docs
        # https://django-rest-framework-simplejwt.readthedocs.io/en/latest/getting_started.html
        'rest_framework_simplejwt.authentication.JWTAuthentication'
    )],
    'DEFAULT_PAGINATION_CLASS':
        'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DATETIME_FORMAT': '%d %b %Y',
}

if 'DEV' not in os.environ:
    REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = [
        'rest_framework.renderers.JSONRenderer',
    ]

REST_AUTH = {
    'USE_JWT': True,
    # 'JWT_AUTH_SECURE': True,  # from the video, not from the docs
    'JWT_AUTH_COOKIE': 'access-token',
    'JWT_AUTH_REFRESH_COOKIE': 'refresh-token',
}

REST_AUTH = {
    'USER_DETAILS_SERIALIZER': 'social_app.serializers.CurrentUserSerializer',
}


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'cloudinary_storage',
    'django.contrib.staticfiles',
    'cloudinary',

    'rest_framework',
    'rest_framework.authtoken',
    'dj_rest_auth',

    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'dj_rest_auth.registration',
    'corsheaders',

    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',

    'django_filters',

    'profiles',
    'posts',
    'comments',
    'likes',
    'follows',
]

SITE_ID = 1

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    os.environ.get('CLIENT_ORIGIN')
]


CORS_ALLOW_CREDENTIALS = True

# Set up JSON Web Token use with cookies

JWT_AUTH_COOKIE = 'my-app-auth'
JWT_AUTH_REFRESH_COOKIE = 'my-refresh-token'
JWT_AUTH_SAMESITE = 'None'

ROOT_URLCONF = 'social_app.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'social_app.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

if 'DEV' in os.environ:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    DATABASES = {
        'default': dj_database_url.parse(
            os.environ.get("DATABASE_URL"),
            conn_max_age=600,
            conn_health_checks=True,
        )
    }


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
 {'NAME':
  'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
  },
 {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
  },
 {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
  },
 {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
  },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# FOR image storage
CLOUDINARY_STORAGE = {
    # 'CLOUD_NAME': os.getenv("CLOUD_NAME"),
    # 'API_KEY': os.getenv("API_KEY"),
    # 'API_SECRET': os.getenv("API_SECRET"),
    'CLOUDINARY_URL': os.getenv("CLOUDINARY_URL"),
}
MEDIA_URL = '/media/'
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# To colour unittest output in the terminal - also install redgreenunittest
TEST_RUNNER = "redgreenunittest.django.runner.RedGreenDiscoverRunner"
