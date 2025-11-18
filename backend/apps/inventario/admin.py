"""
Configuración del admin de Django para modelos de inventario.
"""

from django.contrib import admin
from .models import (
    Sede,
    Responsable,
    Ubicacion,
    Articulo,
    ItemInventario,
    HistorialMovimiento
)


@admin.register(Sede)
class SedeAdmin(admin.ModelAdmin):
    """Admin para Sede."""

    list_display = ['codigo', 'nombre', 'direccion', 'activo', 'created_at']
    list_filter = ['activo', 'created_at']
    search_fields = ['codigo', 'nombre']
    ordering = ['codigo']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Responsable)
class ResponsableAdmin(admin.ModelAdmin):
    """Admin para Responsable."""

    list_display = ['nombre_completo', 'documento', 'cargo', 'sede', 'activo']
    list_filter = ['activo', 'sede', 'created_at']
    search_fields = ['nombre', 'apellido', 'documento', 'email']
    ordering = ['apellido', 'nombre']
    readonly_fields = ['created_at', 'updated_at']

    def nombre_completo(self, obj):
        return obj.nombre_completo
    nombre_completo.short_description = 'Nombre Completo'


@admin.register(Ubicacion)
class UbicacionAdmin(admin.ModelAdmin):
    """Admin para Ubicacion."""

    list_display = ['codigo', 'nombre', 'tipo', 'sede', 'activo']
    list_filter = ['activo', 'tipo', 'sede', 'created_at']
    search_fields = ['codigo', 'nombre']
    ordering = ['sede', 'codigo']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Articulo)
class ArticuloAdmin(admin.ModelAdmin):
    """Admin para Articulo."""

    list_display = ['codigo', 'nombre', 'categoria', 'activo', 'created_at']
    list_filter = ['activo', 'categoria', 'created_at']
    search_fields = ['codigo', 'nombre', 'descripcion']
    ordering = ['categoria', 'nombre']
    readonly_fields = ['codigo', 'created_at', 'updated_at']


@admin.register(ItemInventario)
class ItemInventarioAdmin(admin.ModelAdmin):
    """Admin para ItemInventario."""

    list_display = ['codigo', 'articulo', 'ubicacion', 'responsable', 'estado', 'valor_total']
    list_filter = ['estado', 'sede', 'created_at']
    search_fields = ['codigo', 'articulo__nombre', 'ubicacion__nombre']
    ordering = ['-created_at']
    readonly_fields = ['sede', 'valor_total', 'created_at', 'updated_at']

    fieldsets = (
        ('Información Básica', {
            'fields': ('codigo', 'articulo', 'cantidad', 'valor_unitario')
        }),
        ('Ubicación y Responsable', {
            'fields': ('ubicacion', 'sede', 'responsable')
        }),
        ('Estado', {
            'fields': ('estado', 'descripcion', 'observaciones')
        }),
        ('Auditoría', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(HistorialMovimiento)
class HistorialMovimientoAdmin(admin.ModelAdmin):
    """Admin para HistorialMovimiento."""

    list_display = ['item', 'tipo_movimiento', 'usuario', 'created_at']
    list_filter = ['tipo_movimiento', 'created_at']
    search_fields = ['item__codigo', 'observaciones']
    ordering = ['-created_at']
    readonly_fields = ['item', 'tipo_movimiento', 'usuario', 'datos_anteriores', 'datos_nuevos', 'observaciones', 'created_at']

    def has_add_permission(self, request):
        """No permitir crear historial manualmente."""
        return False

    def has_delete_permission(self, request, obj=None):
        """No permitir eliminar historial."""
        return False
