"""
Modelos de autenticación.
Se implementarán en Fase 1.
"""
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    """
    Usuario personalizado.
    Por ahora hereda todo de AbstractUser.
    Se extenderá en Fase 1.
    """
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
