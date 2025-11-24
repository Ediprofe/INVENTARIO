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
    reset_import_excel,
    download_reset_template,
    export_full_database,
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
    # Excel reset & import (reseteo completo + importación masiva)
    path('excel/reset-import/', reset_import_excel, name='items-reset-import'),
    path('excel/reset-template/', download_reset_template, name='items-reset-template'),
    path('excel/export-full/', export_full_database, name='items-export-full'),
    # Router de ViewSets
    path('', include(router.urls)),
]
