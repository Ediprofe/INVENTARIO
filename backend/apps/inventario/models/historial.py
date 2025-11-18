"""
Modelo HistorialMovimiento - Trazabilidad completa de cambios.
Optimizado para writes masivos en imports/batch operations.
"""

from django.db import models
from django.conf import settings
from apps.core.models import TimeStampedModel
from .choices import TipoMovimiento


class HistorialMovimiento(TimeStampedModel):
    """
    Registro de cada movimiento o cambio en el inventario.

    Reglas:
    - Se crea automáticamente vía signals
    - Inmutable (no se edita/elimina)
    - Almacena datos anteriores y nuevos

    Optimizaciones:
    - Índices para consultas de historial
    - JSONB para datos flexibles
    - Bulk create en operaciones masivas
    """

    item = models.ForeignKey(
        'ItemInventario',
        on_delete=models.CASCADE,
        related_name='historial',
        db_index=True,
        verbose_name="Ítem"
    )

    tipo_movimiento = models.CharField(
        max_length=50,
        choices=TipoMovimiento.choices,
        db_index=True,
        verbose_name="Tipo de Movimiento"
    )

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='movimientos_realizados',
        verbose_name="Usuario"
    )

    # Datos del cambio (almacenamiento flexible)
    datos_anteriores = models.JSONField(
        null=True,
        blank=True,
        verbose_name="Datos Anteriores",
        help_text="Estado antes del cambio"
    )

    datos_nuevos = models.JSONField(
        null=True,
        blank=True,
        verbose_name="Datos Nuevos",
        help_text="Estado después del cambio"
    )

    observaciones = models.TextField(
        blank=True,
        verbose_name="Observaciones"
    )

    class Meta:
        db_table = 'inventario_historial'
        verbose_name = 'Historial de Movimiento'
        verbose_name_plural = 'Historial de Movimientos'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['item'], name='idx_hist_item'),
            models.Index(
                fields=['tipo_movimiento'],
                name='idx_hist_tipo'
            ),
            models.Index(
                fields=['item', '-created_at'],
                name='idx_hist_item_fecha'
            ),
            models.Index(fields=['usuario'], name='idx_hist_usuario'),
        ]

    def __str__(self):
        return f"{self.tipo_movimiento} - {self.item.codigo} ({self.created_at})"
