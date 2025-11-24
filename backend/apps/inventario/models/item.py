"""
Modelo ItemInventario - Ítem físico individual del inventario.
CRÍTICO: Optimizado para 7,000+ registros con operaciones async.
"""

from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from apps.core.models import TimeStampedModel
from .choices import EstadoFisico, Disponibilidad


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
        verbose_name="Código Interno",
        help_text="Código único autogenerado del ítem"
    )

    placa = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        unique=True,
        db_index=True,
        verbose_name="Placa",
        help_text="Placa física del artículo (única si está presente) - CLAUDE.md línea 166"
    )

    # === CARACTERÍSTICAS ===

    marca = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Marca",
        help_text="Marca del artículo (lista editable) - CLAUDE.md línea 175"
    )

    serial = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Serial",
        help_text="Número de serie"
    )

    # === ESTADO Y DISPONIBILIDAD ===
    # Separados según CLAUDE.md líneas 172-174

    estado = models.CharField(
        max_length=20,
        # choices=EstadoFisico.choices,  # Permitir valores libres (CLAUDE.md)
        default=EstadoFisico.BUENO,
        db_index=True,
        verbose_name="Estado Físico",
        help_text="Condición física: Bueno/Regular/Malo"
    )

    disponibilidad = models.CharField(
        max_length=20,
        # choices=Disponibilidad.choices,  # Permitir valores libres (CLAUDE.md)
        default=Disponibilidad.EN_USO,
        db_index=True,
        verbose_name="Disponibilidad",
        help_text="Estado operativo: En uso/En reparación/Extraviado/De baja"
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
            # Índice principal: búsqueda por código y placa
            models.Index(fields=['codigo'], name='idx_item_codigo'),
            models.Index(fields=['placa'], name='idx_item_placa'),

            # Índices para filtros frecuentes
            models.Index(fields=['estado'], name='idx_item_estado'),
            models.Index(fields=['disponibilidad'], name='idx_item_disponib'),
            models.Index(fields=['articulo'], name='idx_item_articulo'),
            models.Index(fields=['ubicacion'], name='idx_item_ubicacion'),
            models.Index(fields=['sede'], name='idx_item_sede'),
            models.Index(fields=['responsable'], name='idx_item_responsable'),
            models.Index(fields=['marca'], name='idx_item_marca'),

            # Índices compuestos para filtros combinados
            models.Index(
                fields=['sede', 'disponibilidad'],
                name='idx_item_sede_disp'
            ),
            models.Index(
                fields=['ubicacion', 'disponibilidad'],
                name='idx_item_ubic_disp'
            ),
            models.Index(
                fields=['articulo', 'disponibilidad'],
                name='idx_item_art_disp'
            ),
            models.Index(
                fields=['articulo', 'serial'],
                name='idx_item_art_serial'
            ),
        ]

        # === CONSTRAINTS A NIVEL BD ===
        constraints = []

    def __str__(self):
        return f"{self.codigo} - {self.articulo.nombre}"

    def clean(self):
        """Validaciones de negocio según CLAUDE.md."""
        super().clean()

        # Normalizar código y placa
        if self.codigo:
            self.codigo = self.codigo.upper().strip()

        if self.placa:
            self.placa = self.placa.strip()
            # Validar placa única (CLAUDE.md línea 194-196)
            if self.placa:
                duplicates = ItemInventario.objects.filter(placa=self.placa).exclude(pk=self.pk)
                if duplicates.exists():
                    raise ValidationError({
                        'placa': f'La placa "{self.placa}" ya existe en otro ítem'
                    })

        # Normalizar serial
        if self.serial:
            self.serial = self.serial.strip()

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
        # Auto-generar código si no existe (CLAUDE.md - código autogenerado)
        if not self.codigo:
            # Obtener el último ítem para generar código secuencial
            ultimo = ItemInventario.objects.order_by('-id').first()
            siguiente_num = (ultimo.id + 1) if ultimo else 1
            self.codigo = f'INV-{siguiente_num:06d}'

        # Auto-asignar sede desde ubicación
        if self.ubicacion and not self.sede_id:
            self.sede = self.ubicacion.sede

        self.full_clean()
        super().save(*args, **kwargs)
