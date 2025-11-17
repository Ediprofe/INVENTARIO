"""
Importa settings según DJANGO_ENV.
Por defecto usa development.
"""
import os

environment = os.getenv('DJANGO_ENV', 'development')

if environment == 'production':
    from .production import *
else:
    from .development import *
