"""
Modelo ItemInventario - Ítem físico individual del inventario.
CRÍTICO: Optimizado para 7,000+ registros con operaciones async.
"""

from django.db import models
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from decimal import Decimal
from apps.core.models import TimeStampedModel
from .choices import EstadoItem


class ItemInventario(TimeStampedModel):
    """
    Ítem físico individual del inventario.

    REGLAS DE NEGOCIO CRÍTICAS:
    1. Cada registro = 1 unidad física
    2. codigo: único globalmente
    3. ubicacion: determina la sede automáticamente
    4. responsable: debe pertenecer a la misma sede
    5. Historial automático vía signals

    OPTIMIZACIONES PARA 7,000+ REGISTROS:
    - 8 índices estratégicos para búsquedas O(log n)
    - Índices compuestos para filtros frecuentes
    - Foreign keys indexados para joins rápidos
    - Constraint checks a nivel BD
    """

    # === RELACIONES (Foreign Keys) ===

    articulo = models.ForeignKey(
        'Articulo',
        on_delete=models.PROTECT,
        related_name='items_inventario',
        db_index=True,
        verbose_name="Artículo"
    )

    ubicacion = models.ForeignKey(
        'Ubicacion',
        on_delete=models.PROTECT,
        related_name='items',
        db_index=True,
        verbose_name="Ubicación"
    )

    sede = models.ForeignKey(
        'Sede',
        on_delete=models.PROTECT,
        related_name='items_inventario',
        db_index=True,
        verbose_name="Sede",
        help_text="Derivada de ubicación (redundante por rendimiento)"
    )

    responsable = models.ForeignKey(
        'Responsable',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='items_asignados',
        db_index=True,
        verbose_name="Responsable Asignado"
    )

    # === IDENTIFICADORES ===

    codigo = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        validators=[
            RegexValidator(
                regex=r'^[A-Z0-9\-]+$',
                message='Código debe contener solo mayúsculas, números y guiones'
            )
        ],
        verbose_name="Código",
        help_text="Código único del ítem (placa institucional)"
    )

    # === CARACTERÍSTICAS ===

    cantidad = models.IntegerField(
        default=1,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(9999)
        ],
        verbose_name="Cantidad",
        help_text="Cantidad de unidades (1-9999)"
    )

    valor_unitario = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name="Valor Unitario",
        help_text="Valor en pesos colombianos"
    )

    # === ESTADO ===

    estado = models.CharField(
        max_length=20,
        choices=EstadoItem.choices,
        default=EstadoItem.ACTIVO,
        db_index=True,
        verbose_name="Estado"
    )

    descripcion = models.TextField(
        blank=True,
        verbose_name="Descripción"
    )

    observaciones = models.TextField(
        blank=True,
        max_length=500,
        verbose_name="Observaciones"
    )

    class Meta:
        db_table = 'inventario_item'
        verbose_name = 'Ítem de Inventario'
        verbose_name_plural = 'Ítems de Inventario'
        ordering = ['-created_at']

        # === ÍNDICES OPTIMIZADOS ===
        indexes = [
            # Índice principal: búsqueda por código
            models.Index(fields=['codigo'], name='idx_item_codigo'),

            # Índices para filtros frecuentes
            models.Index(fields=['estado'], name='idx_item_estado'),
            models.Index(fields=['articulo'], name='idx_item_articulo'),
            models.Index(fields=['ubicacion'], name='idx_item_ubicacion'),
            models.Index(fields=['sede'], name='idx_item_sede'),
            models.Index(fields=['responsable'], name='idx_item_responsable'),

            # Índices compuestos para filtros combinados
            models.Index(
                fields=['sede', 'estado'],
                name='idx_item_sede_estado'
            ),
            models.Index(
                fields=['ubicacion', 'estado'],
                name='idx_item_ubic_estado'
            ),
            models.Index(
                fields=['articulo', 'estado'],
                name='idx_item_art_estado'
            ),
        ]

        # === CONSTRAINTS A NIVEL BD ===
        constraints = [
            # Cantidad mínima
            models.CheckConstraint(
                check=models.Q(cantidad__gte=1),
                name='check_cantidad_minima'
            ),

            # Valor no negativo
            models.CheckConstraint(
                check=models.Q(valor_unitario__gte=0),
                name='check_valor_positivo'
            ),
        ]

    def __str__(self):
        return f"{self.codigo} - {self.articulo.nombre}"

    @property
    def valor_total(self):
        """Valor total = cantidad × valor_unitario."""
        return self.cantidad * self.valor_unitario

    def clean(self):
        """Validaciones de negocio."""
        super().clean()

        # Normalizar código
        if self.codigo:
            self.codigo = self.codigo.upper().strip()

        # Validar sede coherente con ubicación
        if self.ubicacion:
            if not self.sede_id:
                self.sede = self.ubicacion.sede
            elif self.sede != self.ubicacion.sede:
                raise ValidationError({
                    'sede': f'Debe ser {self.ubicacion.sede.codigo} (sede de la ubicación)'
                })

        # Validar responsable de la misma sede
        if self.responsable and self.responsable.sede:
            if self.responsable.sede != self.sede:
                raise ValidationError({
                    'responsable': f'Debe pertenecer a {self.sede.codigo}'
                })

        # Validar ubicación activa
        if self.ubicacion and not self.ubicacion.activo:
            raise ValidationError({
                'ubicacion': 'La ubicación no está activa'
            })

    def save(self, *args, **kwargs):
        # Auto-asignar sede desde ubicación
        if self.ubicacion and not self.sede_id:
            self.sede = self.ubicacion.sede

        self.full_clean()
        super().save(*args, **kwargs)
