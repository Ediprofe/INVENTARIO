"""
Serializers para modelos de catálogos.
"""
from rest_framework import serializers
from apps.inventario.models import Sede, Ubicacion, Responsable, Articulo


class SedeSerializer(serializers.ModelSerializer):
    """Serializer para Sede."""

    total_ubicaciones = serializers.IntegerField(read_only=True, source='ubicaciones.count')
    total_items = serializers.SerializerMethodField()
    coordinador_nombre = serializers.CharField(source='coordinador.nombre_completo', read_only=True)

    class Meta:
        model = Sede
        fields = [
            'id', 'codigo', 'nombre', 'direccion', 'telefono',
            'email', 'coordinador', 'coordinador_nombre', 'activo', 
            'total_ubicaciones', 'total_items',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_total_items(self, obj):
        """Total de ítems activos en la sede."""
        return obj.items_inventario.exclude(estado='dado_baja').count()


class UbicacionSerializer(serializers.ModelSerializer):
    """Serializer para Ubicacion."""

    sede_nombre = serializers.CharField(source='sede.nombre', read_only=True)
    responsable_nombre = serializers.CharField(source='responsable.nombre_completo', read_only=True)
    total_items = serializers.IntegerField(read_only=True, source='items.count')

    class Meta:
        model = Ubicacion
        fields = [
            'id', 'codigo', 'nombre', 'tipo', 'sede', 'sede_nombre',
            'responsable', 'responsable_nombre',
            'piso', 'capacidad', 'observaciones', 'activo',
            'total_items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ResponsableSerializer(serializers.ModelSerializer):
    """Serializer para Responsable."""

    nombre_completo = serializers.CharField(read_only=True)
    sede_nombre = serializers.CharField(source='sede.nombre', read_only=True)
    total_items = serializers.IntegerField(read_only=True, source='items_asignados.count')

    class Meta:
        model = Responsable
        fields = [
            'id', 'nombre', 'apellido', 'nombre_completo',
            'tipo_documento', 'documento', 'cargo', 'email',
            'telefono', 'sede', 'sede_nombre', 'activo',
            'total_items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'nombre_completo', 'created_at', 'updated_at']


class ArticuloSerializer(serializers.ModelSerializer):
    """Serializer para Articulo."""

    total_items = serializers.IntegerField(read_only=True, source='items_inventario.count')

    class Meta:
        model = Articulo
        fields = [
            'id', 'nombre', 'codigo', 'categoria', 'descripcion',
            'foto', 'activo', 'total_items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'codigo', 'created_at', 'updated_at']
