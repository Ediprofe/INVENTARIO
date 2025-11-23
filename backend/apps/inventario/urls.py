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
    ItemInventarioViewSet,
    InventarioStatsViewSet,
    import_items_excel,
    export_items_excel,
    download_template,
)

app_name = 'inventario'

router = DefaultRouter()
router.register(r'sedes', SedeViewSet, basename='sedes')
router.register(r'ubicaciones', UbicacionViewSet, basename='ubicaciones')
router.register(r'responsables', ResponsableViewSet, basename='responsables')
router.register(r'articulos', ArticuloViewSet, basename='articulos')
router.register(r'items', ItemInventarioViewSet, basename='items')
router.register(r'stats', InventarioStatsViewSet, basename='stats')

urlpatterns = [
    # Excel import/export (antes del router para evitar conflictos)
    path('excel/import/', import_items_excel, name='items-import'),
    path('excel/export/', export_items_excel, name='items-export'),
    path('excel/template/', download_template, name='items-template'),
    # Router de ViewSets
    path('', include(router.urls)),
]
