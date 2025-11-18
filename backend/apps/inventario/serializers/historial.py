"""
Serializer para HistorialMovimiento.
"""
from rest_framework import serializers
from apps.inventario.models import HistorialMovimiento


class HistorialMovimientoSerializer(serializers.ModelSerializer):
    """Serializer para HistorialMovimiento."""

    usuario_nombre = serializers.SerializerMethodField()

    class Meta:
        model = HistorialMovimiento
        fields = [
            'id', 'item', 'tipo_movimiento', 'usuario', 'usuario_nombre',
            'datos_anteriores', 'datos_nuevos', 'observaciones', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_usuario_nombre(self, obj):
        """Nombre del usuario que realizó el movimiento."""
        if obj.usuario:
            return obj.usuario.get_full_name() or obj.usuario.username
        return None
