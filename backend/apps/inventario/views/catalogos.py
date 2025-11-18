"""
ViewSets para catálogos.
"""
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from apps.inventario.models import Sede, Ubicacion, Responsable, Articulo
from apps.inventario.serializers import (
    SedeSerializer,
    UbicacionSerializer,
    ResponsableSerializer,
    ArticuloSerializer
)
from apps.inventario.filters import SedeFilter, UbicacionFilter, ResponsableFilter, ArticuloFilter


class SedeViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de Sedes."""

    permission_classes = [IsAuthenticated]
    serializer_class = SedeSerializer
    queryset = Sede.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = SedeFilter
    search_fields = ['codigo', 'nombre']
    ordering_fields = ['codigo', 'nombre', 'created_at']
    ordering = ['codigo']


class UbicacionViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de Ubicaciones."""

    permission_classes = [IsAuthenticated]
    serializer_class = UbicacionSerializer
    queryset = Ubicacion.objects.select_related('sede')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = UbicacionFilter
    search_fields = ['nombre', 'codigo', 'sede__nombre']
    ordering_fields = ['nombre', 'created_at']
    ordering = ['sede__codigo', 'nombre']


class ResponsableViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de Responsables."""

    permission_classes = [IsAuthenticated]
    serializer_class = ResponsableSerializer
    queryset = Responsable.objects.select_related('sede')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ResponsableFilter
    search_fields = ['nombre', 'apellido', 'documento']
    ordering_fields = ['apellido', 'created_at']
    ordering = ['apellido', 'nombre']


class ArticuloViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de Artículos."""

    permission_classes = [IsAuthenticated]
    serializer_class = ArticuloSerializer
    queryset = Articulo.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ArticuloFilter
    search_fields = ['nombre', 'codigo', 'descripcion']
    ordering_fields = ['nombre', 'codigo', 'created_at']
    ordering = ['categoria', 'nombre']
