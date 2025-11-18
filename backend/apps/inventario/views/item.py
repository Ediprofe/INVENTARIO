"""
ViewSet para ItemInventario.
"""
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from apps.inventario.models import ItemInventario
from apps.inventario.serializers import (
    ItemInventarioListSerializer,
    ItemInventarioSerializer,
    ItemInventarioDetailSerializer
)
from apps.inventario.filters import ItemInventarioFilter


class ItemInventarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para CRUD de ítems del inventario.

    Endpoints:
        - GET /items/ - Listar (paginado)
        - POST /items/ - Crear
        - GET /items/{id}/ - Detalle
        - PUT /items/{id}/ - Actualizar
        - PATCH /items/{id}/ - Actualizar parcial
        - DELETE /items/{id}/ - Eliminar (soft delete)
    """

    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ItemInventarioFilter
    search_fields = ['codigo', 'articulo__nombre', 'ubicacion__nombre', 'descripcion']
    ordering_fields = ['codigo', 'created_at', 'valor_unitario', 'estado']
    ordering = ['-created_at']

    def get_queryset(self):
        """Optimizar queries con select_related y prefetch_related."""
        return ItemInventario.objects.select_related(
            'articulo',
            'sede',
            'ubicacion',
            'ubicacion__sede',
            'responsable',
            'responsable__sede'
        ).prefetch_related('historial')

    def get_serializer_class(self):
        """Serializer según acción."""
        if self.action == 'list':
            return ItemInventarioListSerializer
        elif self.action == 'retrieve':
            return ItemInventarioDetailSerializer
        return ItemInventarioSerializer

    def perform_create(self, serializer):
        """Auto-asignar sede desde ubicación."""
        ubicacion = serializer.validated_data['ubicacion']
        serializer.save(sede=ubicacion.sede)

    def perform_update(self, serializer):
        """Auto-actualizar sede si cambia ubicación."""
        ubicacion = serializer.validated_data.get('ubicacion')
        if ubicacion:
            serializer.save(sede=ubicacion.sede)
        else:
            serializer.save()

    def perform_destroy(self, instance):
        """Soft delete: cambiar estado a dado_baja."""
        instance.estado = 'dado_baja'
        instance.save()
