"""
Modelo de usuario personalizado.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    """
    Usuario personalizado del sistema.

    Extiende AbstractUser de Django para agregar campos adicionales.
    """

    email = models.EmailField(
        unique=True,
        verbose_name="Email",
        help_text="Email institucional del usuario"
    )

    telefono = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Teléfono"
    )

    cargo = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Cargo"
    )

    class Meta:
        db_table = 'authentication_user'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['username']

    def __str__(self):
        return f"{self.get_full_name()} ({self.username})"

    def get_full_name(self):
        """Retorna nombre completo o username."""
        full_name = super().get_full_name()
        return full_name if full_name else self.username
