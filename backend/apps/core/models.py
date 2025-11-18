"""
Modelo base abstracto para timestamps.
Todos los modelos del sistema heredan de este.
"""

from django.db import models


class TimeStampedModel(models.Model):
    """
    Modelo abstracto que agrega campos de auditoría temporal.

    Attributes:
        created_at: Fecha y hora de creación (auto)
        updated_at: Fecha y hora de última modificación (auto)
    """

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de creación",
        help_text="Timestamp de creación del registro",
        db_index=True  # Índice para ordenamientos
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Fecha de actualización",
        help_text="Timestamp de última modificación",
        db_index=True  # Índice para filtros de cambios recientes
    )

    class Meta:
        abstract = True
        ordering = ['-created_at']  # Más recientes primero por defecto
