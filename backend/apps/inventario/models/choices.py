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


class EstadoFisico(models.TextChoices):
    """Estado físico/condición del ítem (CLAUDE.md líneas 172, 213-216)."""
    BUENO = 'bueno', 'Bueno'
    REGULAR = 'regular', 'Regular'
    MALO = 'malo', 'Malo'


class Disponibilidad(models.TextChoices):
    """Disponibilidad/estado operativo del ítem (CLAUDE.md líneas 174, 207-211)."""
    EN_USO = 'en_uso', 'En uso'
    EN_REPARACION = 'en_reparacion', 'En reparación'
    EXTRAVIADO = 'extraviado', 'Extraviado'
    DE_BAJA = 'de_baja', 'De baja'


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
