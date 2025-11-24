"""
Filtros para API de inventario.
"""
import django_filters
from apps.inventario.models import ItemInventario, Sede, Ubicacion, Responsable, Articulo


class ItemInventarioFilter(django_filters.FilterSet):
    """
    Filtros avanzados para ítems del inventario - según CLAUDE.md.
    """

    # Filtros exactos por relaciones
    sede = django_filters.NumberFilter(field_name='sede__id')
    ubicacion = django_filters.NumberFilter(field_name='ubicacion__id')
    responsable = django_filters.NumberFilter(field_name='responsable__id')
    articulo = django_filters.NumberFilter(field_name='articulo__id')

    # Filtros por estado físico y disponibilidad (CLAUDE.md - flexibles)
    estado = django_filters.CharFilter(lookup_expr='icontains')
    disponibilidad = django_filters.CharFilter(lookup_expr='icontains')

    # Filtros de búsqueda por texto (CLAUDE.md campos placa, marca, serial, descripcion, observaciones)
    placa = django_filters.CharFilter(lookup_expr='icontains')
    marca = django_filters.CharFilter(lookup_expr='icontains')
    serial = django_filters.CharFilter(lookup_expr='icontains')
    descripcion = django_filters.CharFilter(lookup_expr='icontains')
    observaciones = django_filters.CharFilter(lookup_expr='icontains')

    # Filtros por fecha de creación
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = ItemInventario
        fields = [
            'sede', 'ubicacion', 'responsable', 'articulo', 
            'estado', 'disponibilidad', 
            'placa', 'marca', 'serial', 'descripcion', 'observaciones'
        ]


class SedeFilter(django_filters.FilterSet):
    """Filtros para Sede."""

    activo = django_filters.BooleanFilter()

    class Meta:
        model = Sede
        fields = ['activo']


class UbicacionFilter(django_filters.FilterSet):
    """Filtros para Ubicacion."""

    activo = django_filters.BooleanFilter()
    sede = django_filters.NumberFilter(field_name='sede__id')
    tipo = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Ubicacion
        fields = ['activo', 'sede', 'tipo']


class ResponsableFilter(django_filters.FilterSet):
    """Filtros para Responsable."""

    activo = django_filters.BooleanFilter()
    sede = django_filters.NumberFilter(field_name='sede__id')

    class Meta:
        model = Responsable
        fields = ['activo', 'sede']


class ArticuloFilter(django_filters.FilterSet):
    """Filtros para Articulo."""

    activo = django_filters.BooleanFilter()
    categoria = django_filters.ChoiceFilter(choices=Articulo._meta.get_field('categoria').choices)

    class Meta:
        model = Articulo
        fields = ['activo', 'categoria']
