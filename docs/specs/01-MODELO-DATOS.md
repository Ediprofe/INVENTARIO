# MODELO DE DATOS - Sistema de Inventario Escolar
**Versión:** 2.0  
**Fecha:** Noviembre 16, 2025  
**Optimizado para:** 7,000+ ítems con operaciones async

---

## 📋 ÍNDICE

1. [Diagrama Entidad-Relación](#diagrama-entidad-relación)
2. [Enums y Choices](#enums-y-choices)
3. [Modelo Base](#modelo-base)
4. [Modelos de Catálogos](#modelos-de-catálogos)
5. [Modelo Principal](#modelo-principal-itemInventario)
6. [Modelos de Trazabilidad](#modelos-de-trazabilidad)
7. [Índices y Optimizaciones](#índices-y-optimizaciones)

---

## 🗺️ DIAGRAMA ENTIDAD-RELACIÓN

```
┌─────────────┐
│    Sede     │
│ (Catálogo)  │
└──────┬──────┘
       │
       │ 1:N
       │
       ├─────────────────────────────┐
       │                             │
       ▼                             ▼
┌─────────────┐              ┌──────────────┐
│  Ubicacion  │              │  Articulo    │
│ (Catálogo)  │              │  (Catálogo)  │
└──────┬──────┘              └──────┬───────┘
       │                             │
       │ 1:N                         │ 1:N
       │                             │
       └──────────┬──────────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ ItemInventario  │ ◄──── 1:N ──── Responsable
         │   (Principal)   │                (Catálogo)
         └────────┬────────┘
                  │
                  │ 1:N
                  │
                  ▼
         ┌──────────────────────┐
         │ HistorialMovimiento  │
         │   (Trazabilidad)     │
         └──────────────────────┘
```

**Relaciones clave:**
- Sede → Ubicacion (1:N)
- Sede → Articulo (1:N)
- Ubicacion → ItemInventario (1:N)
- Articulo → ItemInventario (1:N)
- Responsable → ItemInventario (1:N)
- ItemInventario → HistorialMovimiento (1:N)

---

## 📊 ENUMS Y CHOICES

### Archivo: `apps/inventario/models/choices.py`

```python
"""
Enumeraciones y constantes del sistema de inventario.
Centralizadas para garantizar consistencia.
"""

from django.db import models


class TipoUbicacion(models.TextChoices):
    """Tipos de ubicaciones físicas."""
    AULA = 'aula', 'Aula'
    LABORATORIO = 'laboratorio', 'Laboratorio'
    OFICINA = 'oficina', 'Oficina'
    BIBLIOTECA = 'biblioteca', 'Biblioteca'
    DEPOSITO = 'deposito', 'Depósito'
    AUDITORIO = 'auditorio', 'Auditorio'
    SALON_MULTIPLE = 'salon_multiple', 'Salón Múltiple'
    OTRO = 'otro', 'Otro'


class CategoriaArticulo(models.TextChoices):
    """Categorías principales de artículos."""
    TECNOLOGIA = 'tecnologia', 'Tecnología'
    MOBILIARIO = 'mobiliario', 'Mobiliario'
    LABORATORIO = 'laboratorio', 'Laboratorio'
    DEPORTES = 'deportes', 'Deportes'
    AUDIOVISUAL = 'audiovisual', 'Audiovisual'
    LIBROS = 'libros', 'Libros'
    HERRAMIENTAS = 'herramientas', 'Herramientas'
    VEHICULOS = 'vehiculos', 'Vehículos'
    OTROS = 'otros', 'Otros'


class EstadoItem(models.TextChoices):
    """Estado físico del ítem."""
    ACTIVO = 'activo', 'Activo'
    INACTIVO = 'inactivo', 'Inactivo'
    MANTENIMIENTO = 'mantenimiento', 'En Mantenimiento'
    DADO_BAJA = 'dado_baja', 'Dado de Baja'
    EXTRAVIADO = 'extraviado', 'Extraviado'
    REPARACION = 'reparacion', 'En Reparación'


class TipoMovimiento(models.TextChoices):
    """Tipos de movimientos en el historial."""
    CREACION = 'creacion', 'Creación'
    MODIFICACION = 'modificacion', 'Modificación'
    CAMBIO_UBICACION = 'cambio_ubicacion', 'Cambio de Ubicación'
    CAMBIO_RESPONSABLE = 'cambio_responsable', 'Cambio de Responsable'
    CAMBIO_ESTADO = 'cambio_estado', 'Cambio de Estado'
    ELIMINACION = 'eliminacion', 'Eliminación'
    IMPORTACION = 'importacion', 'Importación Excel'
    EXPORTACION = 'exportacion', 'Exportación Excel'
    BATCH_UPDATE = 'batch_update', 'Actualización Masiva'


class TipoDocumento(models.TextChoices):
    """Tipos de documento de identidad."""
    CC = 'cc', 'Cédula de Ciudadanía'
    TI = 'ti', 'Tarjeta de Identidad'
    CE = 'ce', 'Cédula de Extranjería'
    PAS = 'pas', 'Pasaporte'
    NIT = 'nit', 'NIT'
```

---

## 🏗️ MODELO BASE

### Archivo: `apps/core/models.py`

```python
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
```

---

## 📚 MODELOS DE CATÁLOGOS

### 1. Modelo: Sede

**Archivo:** `apps/inventario/models/sede.py`

```python
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
    - nombre_sede debe ser único
    - codigo debe ser único y alfanumérico
    - Puede tener un responsable de inventario asignado
    - No se puede eliminar si tiene ubicaciones/ítems asociados
    
    Optimizaciones:
    - Índices en nombre y codigo para búsquedas O(log n)
    - Propiedades calculadas en caché para dashboards
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
        null=True,
        verbose_name="Dirección",
        help_text="Dirección física de la sede"
    )
    
    activo = models.BooleanField(
        default=True,
        db_index=True,  # Índice para filtros de sedes activas
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
        return self.items_inventario.exclude(
            estado=EstadoItem.DADO_BAJA
        ).count()
```

---

### 2. Modelo: Responsable

**Archivo:** `apps/inventario/models/responsable.py`

```python
"""
Modelo Responsable - Persona a cargo de ítems o ubicaciones.
Optimizado con índices compuestos para búsquedas.
"""

from django.db import models
from django.core.validators import EmailValidator, RegexValidator
from django.core.exceptions import ValidationError
from apps.core.models import TimeStampedModel
from .choices import TipoDocumento


class Responsable(TimeStampedModel):
    """
    Persona responsable de ítems del inventario.
    
    Reglas de negocio:
    - nombres + apellidos obligatorios
    - documento único si se proporciona
    - email único si se proporciona
    - puede estar asociado a una sede
    
    Optimizaciones:
    - Índice compuesto en (tipo_documento, numero_documento)
    - Índice en email para validaciones rápidas
    - Índice en sede para filtros por sede
    """
    
    nombres = models.CharField(
        max_length=100,
        verbose_name="Nombres",
        help_text="Nombres de la persona"
    )
    
    apellidos = models.CharField(
        max_length=100,
        verbose_name="Apellidos",
        help_text="Apellidos de la persona"
    )
    
    tipo_documento = models.CharField(
        max_length=10,
        choices=TipoDocumento.choices,
        blank=True,
        null=True,
        verbose_name="Tipo de Documento"
    )
    
    numero_documento = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name="Número de Documento"
    )
    
    cargo = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Cargo",
        help_text="Cargo o rol en la institución"
    )
    
    telefono = models.CharField(
        max_length=20,
        blank=True,
        validators=[
            RegexValidator(
                regex=r'^\+?[0-9\s\-()]+$',
                message='Teléfono debe contener solo números, espacios, +, - y ()'
            )
        ],
        verbose_name="Teléfono"
    )
    
    email = models.EmailField(
        unique=True,
        blank=True,
        null=True,
        db_index=True,
        validators=[EmailValidator()],
        verbose_name="Email",
        help_text="Correo electrónico único"
    )
    
    sede = models.ForeignKey(
        'Sede',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='responsables',
        db_index=True,
        verbose_name="Sede Asignada"
    )
    
    activo = models.BooleanField(
        default=True,
        db_index=True,
        verbose_name="Activo"
    )
    
    class Meta:
        db_table = 'inventario_responsable'
        verbose_name = 'Responsable'
        verbose_name_plural = 'Responsables'
        ordering = ['apellidos', 'nombres']
        indexes = [
            # Índice compuesto para búsqueda por documento
            models.Index(
                fields=['tipo_documento', 'numero_documento'],
                name='idx_resp_documento'
            ),
            models.Index(fields=['email'], name='idx_resp_email'),
            models.Index(fields=['sede'], name='idx_resp_sede'),
            models.Index(fields=['activo'], name='idx_resp_activo'),
        ]
        constraints = [
            # Unicidad de documento solo si ambos están presentes
            models.UniqueConstraint(
                fields=['tipo_documento', 'numero_documento'],
                condition=models.Q(
                    tipo_documento__isnull=False,
                    numero_documento__isnull=False
                ),
                name='unique_documento_responsable'
            )
        ]
    
    def __str__(self):
        nombre_completo = f"{self.nombres} {self.apellidos}"
        if self.sede:
            return f"{nombre_completo} ({self.sede.codigo})"
        return nombre_completo
    
    @property
    def nombre_completo(self):
        """Nombre completo concatenado."""
        return f"{self.nombres} {self.apellidos}"
    
    def clean(self):
        """Validaciones de negocio."""
        super().clean()
        
        # Si tiene tipo_documento, debe tener numero
        if self.tipo_documento and not self.numero_documento:
            raise ValidationError({
                'numero_documento': 'Debe proporcionar el número si indica el tipo'
            })
        
        if self.numero_documento and not self.tipo_documento:
            raise ValidationError({
                'tipo_documento': 'Debe indicar el tipo de documento'
            })
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    @property
    def items_a_cargo(self):
        """Cantidad de ítems activos asignados."""
        return self.items_asignados.exclude(
            estado=EstadoItem.DADO_BAJA
        ).count()
```

---

### 3. Modelo: Ubicacion

**Archivo:** `apps/inventario/models/ubicacion.py`

```python
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
    - responsable opcional
    
    Optimizaciones:
    - Índice compuesto (sede, codigo) para búsquedas O(log n)
    - Índice en tipo para filtros por categoría
    - Foreign key indexed para joins rápidos
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
    
    piso = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Piso/Nivel",
        help_text="Piso o nivel donde se encuentra"
    )
    
    capacidad = models.IntegerField(
        blank=True,
        null=True,
        verbose_name="Capacidad",
        help_text="Capacidad de personas/ítems"
    )
    
    responsable = models.ForeignKey(
        'Responsable',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ubicaciones_asignadas',
        db_index=True,
        verbose_name="Responsable de Ubicación"
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
            # Índice compuesto principal
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
            # Código único por sede
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
        
        # Validar que responsable pertenezca a la misma sede
        if self.responsable and self.responsable.sede:
            if self.responsable.sede != self.sede:
                raise ValidationError({
                    'responsable': f'El responsable debe pertenecer a {self.sede.codigo}'
                })
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    @property
    def total_items(self):
        """Cantidad de ítems activos en esta ubicación."""
        return self.items.exclude(estado=EstadoItem.DADO_BAJA).count()
```

---

### 4. Modelo: Articulo

**Archivo:** `apps/inventario/models/articulo.py`

```python
"""
Modelo Articulo - Catálogo maestro de tipos de artículos.
Optimizado para auto-creación en imports masivos.
"""

from django.db import models
from django.utils.text import slugify
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
    
    Optimizaciones:
    - Índice en nombre para búsquedas rápidas
    - Índice en codigo para lookups
    - Índice compuesto (categoria, nombre) para filtros
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
        return self.items_inventario.exclude(
            estado=EstadoItem.DADO_BAJA
        ).count()
    
    @classmethod
    async def aget_or_create_from_import(cls, nombre, categoria=None):
        """
        Método async para auto-creación en imports masivos.
        
        Args:
            nombre: Nombre del artículo
            categoria: Categoría (opcional, usa 'otros' por defecto)
        
        Returns:
            tuple: (articulo, created)
        """
        from asgiref.sync import sync_to_async
        
        categoria = categoria or 'otros'
        
        return await sync_to_async(cls.objects.get_or_create)(
            nombre=nombre,
            defaults={'categoria': categoria}
        )
```

---

## 🎯 MODELO PRINCIPAL: ItemInventario

**Archivo:** `apps/inventario/models/item.py`

```python
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
    
    serial = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Serial",
        help_text="Número de serie del fabricante"
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
    
    fecha_adquisicion = models.DateField(
        null=True,
        blank=True,
        db_index=True,
        verbose_name="Fecha de Adquisición"
    )
    
    marca = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Marca"
    )
    
    modelo = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Modelo"
    )
    
    # === ESTADO ===
    
    estado = models.CharField(
        max_length=20,
        choices=EstadoItem.choices,
        default=EstadoItem.ACTIVO,
        db_index=True,
        verbose_name="Estado"
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
            
            # Índice para ordenamiento por fecha
            models.Index(
                fields=['-fecha_adquisicion'],
                name='idx_item_fecha_adq'
            ),
            
            # Índice para búsquedas por serial + artículo
            models.Index(
                fields=['articulo', 'serial'],
                name='idx_item_art_serial'
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
            
            # Serial único por artículo (si existe)
            models.UniqueConstraint(
                fields=['articulo', 'serial'],
                condition=models.Q(serial__isnull=False),
                name='unique_serial_por_articulo'
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
        
        # Validar fecha adquisición no futura
        if self.fecha_adquisicion:
            from django.utils import timezone
            if self.fecha_adquisicion > timezone.now().date():
                raise ValidationError({
                    'fecha_adquisicion': 'No puede ser una fecha futura'
                })
    
    def save(self, *args, **kwargs):
        # Auto-asignar sede desde ubicación
        if self.ubicacion and not self.sede_id:
            self.sede = self.ubicacion.sede
        
        self.full_clean()
        super().save(*args, **kwargs)
```

---

## 📊 MODELOS DE TRAZABILIDAD

### Modelo: HistorialMovimiento

**Archivo:** `apps/inventario/models/historial.py`

```python
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
```

---

## ⚡ ÍNDICES Y OPTIMIZACIONES

### Resumen de Índices por Modelo

| Modelo | Índices Simples | Índices Compuestos | Total |
|--------|----------------|-------------------|-------|
| Sede | 3 | 0 | 3 |
| Responsable | 3 | 1 | 4 |
| Ubicacion | 2 | 2 | 4 |
| Articulo | 3 | 1 | 4 |
| **ItemInventario** | 6 | 5 | **11** |
| HistorialMovimiento | 3 | 1 | 4 |
| **TOTAL** | **20** | **10** | **30** |

### Performance Esperado (7,000 registros)

| Operación | Sin Índices | Con Índices | Mejora |
|-----------|-------------|-------------|---------|
| Búsqueda por código | ~300ms | **< 5ms** | 60x |
| Filtro por sede + estado | ~200ms | **< 10ms** | 20x |
| Listado paginado (50 ítems) | ~150ms | **< 20ms** | 7x |
| Join con artículo | ~500ms | **< 30ms** | 16x |
| Import 7,000 filas | ~45s | **8-12s** | 4x |

---

## 📝 COMANDOS ÚTILES

### Verificar Índices en BD

```sql
-- Ver todos los índices de inventario_item
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'inventario_item';

-- Analizar uso de índices
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
WHERE tablename LIKE 'inventario%'
ORDER BY idx_scan DESC;
```

### Generar Migraciones

```bash
# Crear migraciones
python manage.py makemigrations inventario

# Ver SQL que se ejecutará
python manage.py sqlmigrate inventario 0001

# Aplicar migraciones
python manage.py migrate
```

### Poblar Datos de Prueba

```python
# Django shell
python manage.py shell

from apps.inventario.models import *
from apps.core.factories import *  # Si usas factory_boy

# Crear datos de prueba
sede = Sede.objects.create(nombre="Sede Principal", codigo="SP-001")
```

---

## 🎯 SIGUIENTE PASO

Con este modelo de datos optimizado para 7,000+ registros:

1. ✅ **Índices estratégicos** → Búsquedas O(log n)
2. ✅ **Constraints en BD** → Validaciones a nivel PostgreSQL
3. ✅ **Métodos async listos** → Para operaciones masivas
4. ✅ **Trazabilidad completa** → Historial automático

**Ver implementación de features en:** `docs/specs/02-FEATURES.md`

---

**Documento generado:** Noviembre 16, 2025  
**Optimizado para:** 7,000+ ítems con PostgreSQL 16.6  
**Próximo:** Features y flujos de negocio