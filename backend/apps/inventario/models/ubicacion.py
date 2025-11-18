"""
Modelo Ubicacion - Lugar físico dentro de una sede.
Optimizado con índices compuestos para filtros frecuentes.
"""

from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from apps.core.models import TimeStampedModel
from .choices import TipoUbicacion


class Ubicacion(TimeStampedModel):
    """
    Lugar físico específico dentro de una sede.

    Reglas de negocio:
    - codigo único por sede (no globalmente)
    - debe pertenecer a una sede
    - tipo de ubicación categorizado
    """

    sede = models.ForeignKey(
        'Sede',
        on_delete=models.PROTECT,
        related_name='ubicaciones',
        db_index=True,
        verbose_name="Sede"
    )

    codigo = models.CharField(
        max_length=50,
        validators=[
            RegexValidator(
                regex=r'^[A-Z0-9\-]+$',
                message='Código debe contener solo mayúsculas, números y guiones'
            )
        ],
        verbose_name="Código de Ubicación",
        help_text="Código alfanumérico (ej: LAB-101, AULA-2A)"
    )

    nombre = models.CharField(
        max_length=200,
        verbose_name="Nombre",
        help_text="Nombre descriptivo de la ubicación"
    )

    tipo = models.CharField(
        max_length=50,
        choices=TipoUbicacion.choices,
        db_index=True,
        verbose_name="Tipo de Ubicación"
    )

    responsable = models.ForeignKey(
        'Responsable',
        on_delete=models.SET_NULL,
        related_name='ubicaciones_responsable',
        blank=True,
        null=True,
        verbose_name="Responsable por defecto",
        help_text="Responsable por defecto para ítems nuevos en esta ubicación"
    )

    piso = models.IntegerField(
        blank=True,
        null=True,
        verbose_name="Piso/Nivel",
        help_text="Piso o nivel donde se encuentra"
    )

    capacidad = models.IntegerField(
        blank=True,
        null=True,
        verbose_name="Capacidad",
        help_text="Capacidad de personas/ítems"
    )

    observaciones = models.TextField(
        blank=True,
        verbose_name="Observaciones"
    )

    activo = models.BooleanField(
        default=True,
        db_index=True,
        verbose_name="Activo"
    )

    class Meta:
        db_table = 'inventario_ubicacion'
        verbose_name = 'Ubicación'
        verbose_name_plural = 'Ubicaciones'
        ordering = ['sede', 'codigo']
        indexes = [
            models.Index(
                fields=['sede', 'codigo'],
                name='idx_ubic_sede_codigo'
            ),
            models.Index(fields=['tipo'], name='idx_ubic_tipo'),
            models.Index(fields=['activo'], name='idx_ubic_activo'),
            models.Index(
                fields=['sede', 'tipo'],
                name='idx_ubic_sede_tipo'
            ),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['sede', 'codigo'],
                name='unique_codigo_por_sede'
            )
        ]

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"

    def clean(self):
        """Validaciones de negocio."""
        super().clean()

        # Normalizar código
        if self.codigo:
            self.codigo = self.codigo.upper().strip()

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def total_items(self):
        """Cantidad de ítems activos en esta ubicación."""
        from .choices import EstadoItem
        return self.items.exclude(estado=EstadoItem.DADO_BAJA).count()
