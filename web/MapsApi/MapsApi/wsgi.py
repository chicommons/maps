"""
WSGI config for MapsApi project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import time
import traceback
import signal
import sys
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MapsApi.settings.prod')

try:
    application = get_wsgi_application()
    print("loaded application! %s" % application) 
except Exception as e:
    print(e)
    print("\n\n\nERROR !!!!!\n\n\n")
    # Error loading applications
    if 'mod_wsgi' in sys.modules:
        traceback.print_exc()
        os.kill(os.getpid(), signal.SIGINT)
        time.sleep(2.5)