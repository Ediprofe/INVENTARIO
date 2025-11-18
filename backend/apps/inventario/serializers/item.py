"""
Serializers para ItemInventario.
"""
from rest_framework import serializers
from apps.inventario.models import ItemInventario, Articulo, Ubicacion, Responsable
from .catalogos import ArticuloSerializer, SedeSerializer, UbicacionSerializer, ResponsableSerializer
from .historial import HistorialMovimientoSerializer


class ItemInventarioListSerializer(serializers.ModelSerializer):
    """
    Serializer para lista de ítems (optimizado) - según CLAUDE.md.
    Solo incluye campos esenciales para listados.
    """

    articulo_nombre = serializers.CharField(source='articulo.nombre', read_only=True)
    ubicacion_nombre = serializers.CharField(source='ubicacion.nombre', read_only=True)
    ubicacion_descripcion = serializers.CharField(source='ubicacion.descripcion', read_only=True)
    sede_nombre = serializers.CharField(source='sede.nombre', read_only=True)
    responsable_nombre = serializers.CharField(source='responsable.nombre_completo', read_only=True)

    class Meta:
        model = ItemInventario
        fields = [
            'id', 'codigo', 'placa', 'articulo_nombre', 'ubicacion_nombre',
            'ubicacion_descripcion', 'sede_nombre', 'responsable_nombre',
            'marca', 'serial', 'estado', 'disponibilidad',
            'descripcion', 'observaciones', 'created_at'
        ]


class ItemInventarioSerializer(serializers.ModelSerializer):
    """
    Serializer completo para ItemInventario - según CLAUDE.md.
    Incluye nested serializers para lectura e IDs para escritura.
    """

    # Nested para lectura
    articulo = ArticuloSerializer(read_only=True)
    sede = SedeSerializer(read_only=True)
    ubicacion = UbicacionSerializer(read_only=True)
    responsable = ResponsableSerializer(read_only=True)

    # IDs para escritura
    articulo_id = serializers.PrimaryKeyRelatedField(
        queryset=Articulo.objects.filter(activo=True),
        source='articulo',
        write_only=True
    )
    ubicacion_id = serializers.PrimaryKeyRelatedField(
        queryset=Ubicacion.objects.filter(activo=True),
        source='ubicacion',
        write_only=True
    )
    responsable_id = serializers.PrimaryKeyRelatedField(
        queryset=Responsable.objects.filter(activo=True),
        source='responsable',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = ItemInventario
        fields = [
            'id', 'codigo', 'placa', 'articulo', 'articulo_id', 'sede',
            'ubicacion', 'ubicacion_id', 'responsable', 'responsable_id',
            'marca', 'serial', 'estado', 'disponibilidad',
            'descripcion', 'observaciones', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'sede', 'created_at', 'updated_at']

    def validate_placa(self, value):
        """Validar placa única (CLAUDE.md línea 194-196)."""
        if value:
            value = value.strip()
            # Check uniqueness
            queryset = ItemInventario.objects.filter(placa=value)
            if self.instance:
                queryset = queryset.exclude(pk=self.instance.pk)
            if queryset.exists():
                raise serializers.ValidationError(
                    f"La placa '{value}' ya existe en otro ítem"
                )
        return value

    def validate_serial(self, value):
        """Validar serial único por artículo (CLAUDE.md línea 199-201)."""
        if value and 'articulo' in self.initial_data:
            value = value.strip()
            articulo_id = self.initial_data.get('articulo_id')
            queryset = ItemInventario.objects.filter(
                articulo_id=articulo_id,
                serial=value
            )
            if self.instance:
                queryset = queryset.exclude(pk=self.instance.pk)
            if queryset.exists():
                raise serializers.ValidationError(
                    f"El serial '{value}' ya existe para este artículo"
                )
        return value

    def validate(self, attrs):
        """Validaciones cruzadas."""
        ubicacion = attrs.get('ubicacion')
        responsable = attrs.get('responsable')

        if ubicacion and responsable:
            if responsable.sede and responsable.sede != ubicacion.sede:
                raise serializers.ValidationError({
                    'responsable_id': f'El responsable debe pertenecer a {ubicacion.sede.codigo}'
                })

        return attrs


class ItemInventarioDetailSerializer(ItemInventarioSerializer):
    """
    Serializer extendido con historial.
    Usado para el endpoint de detalle GET /items/{id}/
    """

    historial = HistorialMovimientoSerializer(many=True, read_only=True)

    class Meta(ItemInventarioSerializer.Meta):
        fields = ItemInventarioSerializer.Meta.fields + ['historial']
