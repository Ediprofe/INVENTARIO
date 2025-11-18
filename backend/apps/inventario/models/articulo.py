"""
Modelo Articulo - Catálogo maestro de tipos de artículos.
Optimizado para auto-creación en imports masivos.
"""

from django.db import models
from django.core.exceptions import ValidationError
from apps.core.models import TimeStampedModel
from .choices import CategoriaArticulo


class Articulo(TimeStampedModel):
    """
    Catálogo maestro de tipos de artículos (no ítems individuales).

    Reglas de negocio:
    - nombre único
    - codigo generado automáticamente si no se proporciona
    - se crea automáticamente en importación Excel
    - categoría obligatoria
    """

    nombre = models.CharField(
        max_length=300,
        unique=True,
        db_index=True,
        verbose_name="Nombre del Artículo",
        help_text="Nombre común del artículo"
    )

    codigo = models.CharField(
        max_length=50,
        unique=True,
        blank=True,
        db_index=True,
        verbose_name="Código",
        help_text="SKU o código interno (auto-generado)"
    )

    categoria = models.CharField(
        max_length=100,
        choices=CategoriaArticulo.choices,
        db_index=True,
        verbose_name="Categoría"
    )

    descripcion = models.TextField(
        blank=True,
        verbose_name="Descripción"
    )

    foto = models.ImageField(
        upload_to='articulos/fotos/',
        blank=True,
        null=True,
        verbose_name="Foto"
    )

    activo = models.BooleanField(
        default=True,
        db_index=True,
        verbose_name="Activo"
    )

    class Meta:
        db_table = 'inventario_articulo'
        verbose_name = 'Artículo'
        verbose_name_plural = 'Artículos'
        ordering = ['categoria', 'nombre']
        indexes = [
            models.Index(fields=['nombre'], name='idx_art_nombre'),
            models.Index(fields=['codigo'], name='idx_art_codigo'),
            models.Index(fields=['categoria'], name='idx_art_categoria'),
            models.Index(
                fields=['categoria', 'nombre'],
                name='idx_art_cat_nombre'
            ),
            models.Index(fields=['activo'], name='idx_art_activo'),
        ]

    def __str__(self):
        return f"[{self.codigo}] {self.nombre}"

    def save(self, *args, **kwargs):
        # Auto-generar código si no existe
        if not self.codigo:
            self.codigo = self._generate_codigo()

        self.full_clean()
        super().save(*args, **kwargs)

    def _generate_codigo(self):
        """
        Genera código automático basado en categoría + secuencia.
        Formato: CAT-NNNNN
        """
        # Prefijo basado en categoría
        prefijo_map = {
            'tecnologia': 'TEC',
            'mobiliario': 'MOB',
            'laboratorio': 'LAB',
            'deportes': 'DEP',
            'audiovisual': 'AUD',
            'libros': 'LIB',
            'herramientas': 'HER',
            'vehiculos': 'VEH',
            'otros': 'OTR',
        }
        prefijo = prefijo_map.get(self.categoria, 'ART')

        # Obtener último número de esta categoría
        ultimo = Articulo.objects.filter(
            codigo__startswith=prefijo
        ).order_by('-codigo').first()

        if ultimo:
            try:
                ultimo_num = int(ultimo.codigo.split('-')[-1])
                nuevo_num = ultimo_num + 1
            except (ValueError, IndexError):
                nuevo_num = 1
        else:
            nuevo_num = 1

        return f"{prefijo}-{nuevo_num:05d}"

    @property
    def total_items(self):
        """Cantidad total de ítems físicos de este artículo."""
        from .choices import EstadoItem
        return self.items_inventario.exclude(
            estado=EstadoItem.DADO_BAJA
        ).count()
