"""
Signals para crear historial automático de cambios en ítems.
"""

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import ItemInventario, HistorialMovimiento


@receiver(post_save, sender=ItemInventario)
def crear_historial_creacion(sender, instance, created, **kwargs):
    """
    Crear registro de historial al crear un ítem.
    """
    if created:
        HistorialMovimiento.objects.create(
            item=instance,
            tipo_movimiento='creacion',
            datos_nuevos={
                'codigo': instance.codigo,
                'articulo': instance.articulo.nombre,
                'ubicacion': instance.ubicacion.nombre,
                'responsable': instance.responsable.nombre_completo if instance.responsable else None,
                'cantidad': instance.cantidad,
                'valor_unitario': str(instance.valor_unitario),
                'estado': instance.estado,
            },
            observaciones='Creación inicial del ítem'
        )


@receiver(pre_save, sender=ItemInventario)
def detectar_cambios_item(sender, instance, **kwargs):
    """
    Detectar cambios en el ítem y crear historial.
    """
    if instance.pk:  # Solo si ya existe
        try:
            old_instance = ItemInventario.objects.get(pk=instance.pk)

            # Detectar cambio de ubicación
            if old_instance.ubicacion != instance.ubicacion:
                HistorialMovimiento.objects.create(
                    item=instance,
                    tipo_movimiento='cambio_ubicacion',
                    datos_anteriores={'ubicacion': old_instance.ubicacion.nombre},
                    datos_nuevos={'ubicacion': instance.ubicacion.nombre},
                    observaciones=f'Movido de {old_instance.ubicacion.nombre} a {instance.ubicacion.nombre}'
                )

            # Detectar cambio de responsable
            if old_instance.responsable != instance.responsable:
                HistorialMovimiento.objects.create(
                    item=instance,
                    tipo_movimiento='cambio_responsable',
                    datos_anteriores={
                        'responsable': old_instance.responsable.nombre_completo if old_instance.responsable else None
                    },
                    datos_nuevos={
                        'responsable': instance.responsable.nombre_completo if instance.responsable else None
                    },
                    observaciones=f'Reasignado de {old_instance.responsable.nombre_completo if old_instance.responsable else "Sin asignar"} a {instance.responsable.nombre_completo if instance.responsable else "Sin asignar"}'
                )

            # Detectar cambio de estado
            if old_instance.estado != instance.estado:
                HistorialMovimiento.objects.create(
                    item=instance,
                    tipo_movimiento='cambio_estado',
                    datos_anteriores={'estado': old_instance.estado},
                    datos_nuevos={'estado': instance.estado},
                    observaciones=f'Estado cambiado de {old_instance.estado} a {instance.estado}'
                )

        except ItemInventario.DoesNotExist:
            pass
