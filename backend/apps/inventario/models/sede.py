"""
Modelo Sede - Campus o sede física de la institución.
Optimizado con índices para búsquedas rápidas.
"""

from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from apps.core.models import TimeStampedModel


class Sede(TimeStampedModel):
    """
    Representa un campus o sede física de la institución educativa.

    Reglas de negocio:
    - nombre debe ser único
    - codigo debe ser único y alfanumérico
    - Puede tener ubicaciones/ítems asociados

    Optimizaciones:
    - Índices en nombre y codigo para búsquedas O(log n)
    """

    nombre = models.CharField(
        max_length=200,
        unique=True,
        db_index=True,
        verbose_name="Nombre de la Sede",
        help_text="Nombre identificativo de la sede"
    )

    codigo = models.CharField(
        max_length=20,
        unique=True,
        db_index=True,
        validators=[
            RegexValidator(
                regex=r'^[A-Z0-9\-]+$',
                message='Código debe contener solo mayúsculas, números y guiones'
            )
        ],
        verbose_name="Código de Sede",
        help_text="Código alfanumérico único (ej: SN-001, CENTRAL)"
    )

    direccion = models.CharField(
        max_length=300,
        blank=True,
        verbose_name="Dirección",
        help_text="Dirección física de la sede"
    )

    telefono = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Teléfono"
    )

    email = models.EmailField(
        blank=True,
        verbose_name="Email"
    )

    activo = models.BooleanField(
        default=True,
        db_index=True,
        verbose_name="Activo",
        help_text="Indica si la sede está operativa"
    )

    class Meta:
        db_table = 'inventario_sede'
        verbose_name = 'Sede'
        verbose_name_plural = 'Sedes'
        ordering = ['codigo']
        indexes = [
            models.Index(fields=['nombre'], name='idx_sede_nombre'),
            models.Index(fields=['codigo'], name='idx_sede_codigo'),
            models.Index(fields=['activo'], name='idx_sede_activo'),
        ]

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"

    def clean(self):
        """Validaciones adicionales."""
        super().clean()

        # Normalizar código a mayúsculas
        if self.codigo:
            self.codigo = self.codigo.upper().strip()

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def total_ubicaciones(self):
        """Cantidad de ubicaciones en esta sede."""
        return self.ubicaciones.count()

    @property
    def total_items(self):
        """Cantidad de ítems activos en esta sede."""
        from .choices import EstadoItem
        return self.items_inventario.exclude(
            estado=EstadoItem.DADO_BAJA
        ).count()
