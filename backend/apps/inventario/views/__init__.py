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

__all__ = [
    'SedeViewSet',
    'UbicacionViewSet',
    'ResponsableViewSet',
    'ArticuloViewSet',
    'ItemInventarioViewSet',
]
