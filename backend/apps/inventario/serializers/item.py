"""
Serializers para ItemInventario.
"""
from rest_framework import serializers
from apps.inventario.models import ItemInventario, Articulo, Ubicacion, Responsable
from .catalogos import ArticuloSerializer, SedeSerializer, UbicacionSerializer, ResponsableSerializer
from .historial import HistorialMovimientoSerializer


class ItemInventarioListSerializer(serializers.ModelSerializer):
    """
    Serializer para lista de ítems (optimizado).
    Solo incluye campos esenciales para listados.
    """

    articulo_nombre = serializers.CharField(source='articulo.nombre', read_only=True)
    ubicacion_nombre = serializers.CharField(source='ubicacion.nombre', read_only=True)
    responsable_nombre = serializers.CharField(source='responsable.nombre_completo', read_only=True)

    class Meta:
        model = ItemInventario
        fields = [
            'id', 'codigo', 'articulo_nombre', 'ubicacion_nombre',
            'responsable_nombre', 'cantidad', 'valor_unitario',
            'valor_total', 'estado', 'created_at'
        ]


class ItemInventarioSerializer(serializers.ModelSerializer):
    """
    Serializer completo para ItemInventario.
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
            'id', 'codigo', 'articulo', 'articulo_id', 'sede',
            'ubicacion', 'ubicacion_id', 'responsable', 'responsable_id',
            'cantidad', 'valor_unitario', 'valor_total', 'estado',
            'descripcion', 'observaciones', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'sede', 'valor_total', 'created_at', 'updated_at']

    def validate_cantidad(self, value):
        """Validar que cantidad esté en rango."""
        if not (1 <= value <= 9999):
            raise serializers.ValidationError(
                "La cantidad debe estar entre 1 y 9999"
            )
        return value

    def validate_valor_unitario(self, value):
        """Validar que valor sea positivo."""
        if value < 0:
            raise serializers.ValidationError(
                "El valor unitario debe ser mayor o igual a 0"
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
