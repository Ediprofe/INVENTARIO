"""
URLs de inventario.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SedeViewSet,
    UbicacionViewSet,
    ResponsableViewSet,
    ArticuloViewSet,
    ItemInventarioViewSet
)

app_name = 'inventario'

router = DefaultRouter()
router.register(r'sedes', SedeViewSet, basename='sedes')
router.register(r'ubicaciones', UbicacionViewSet, basename='ubicaciones')
router.register(r'responsables', ResponsableViewSet, basename='responsables')
router.register(r'articulos', ArticuloViewSet, basename='articulos')
router.register(r'items', ItemInventarioViewSet, basename='items')

urlpatterns = [
    path('', include(router.urls)),
]
