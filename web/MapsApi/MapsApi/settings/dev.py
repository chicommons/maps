from .base import *
import os
from datetime import timedelta

DEBUG=True

SECRET_KEY = 'unsafe-default-key'

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

FRONTEND_ROOT_URL = "http://localhost:3000" #No trailing slash needed.
BACKEND_ROOT_URL = "http://localhost:8000" #No trailing slash needed.

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(REPO_ROOT_DIR, 'data/db.sqlite3'),
    }
}

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

## Used by 'corsheaders' app
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000', 
    'http://127.0.0.1:3000', 
]

CORS_EXPOSE_HEADERS = [
    'Refresh-Token', 
    'Content-Type', 
    'Authorization', 
    'X-CSRFToken'
]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    'http://localhost',
    'http://127.0.0.1',
    'http://0.0.0.0'
]

LOGGING = {
    'version': 1,
    'filters': {
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        }
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
        }
    },
    'loggers': {
        'django.db.backends': {
            'level': 'INFO',
            'handlers': ['console'],
        }
    }
}

SIMPLE_JWT  = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(hours=24),
}
