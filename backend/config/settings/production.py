"""
Settings para entorno de producción.
"""
from .base import *

import dj_database_url

DEBUG = False

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL', default=''),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Static files storage
# http://whitenoise.evans.io/en/stable/django.html#gzip-static-files
STORAGES = {
    "default": {
        "ENGINE": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "ENGINE": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# CORS
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
