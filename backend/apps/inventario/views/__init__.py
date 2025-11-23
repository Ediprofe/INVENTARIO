"""
Views del sistema de inventario.
"""

from .catalogos import (
    SedeViewSet,
    UbicacionViewSet,
    ResponsableViewSet,
    ArticuloViewSet,
)
from .item import ItemInventarioViewSet
from .excel_views import (
    import_items_excel,
    export_items_excel,
    download_template,
)
from .stats import InventarioStatsViewSet

__all__ = [
    'SedeViewSet',
    'UbicacionViewSet',
    'ResponsableViewSet',
    'ArticuloViewSet',
    'ItemInventarioViewSet',
    'import_items_excel',
    'export_items_excel',
    'download_template',
    'InventarioStatsViewSet',
]
