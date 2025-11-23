"""
Creador de ítems para importación de Excel.

Este módulo maneja la creación de ítems de inventario y el registro
de sus movimientos durante la importación.
"""
from typing import Any

import pandas as pd

from apps.inventario.models import (
    ItemInventario, Articulo, Ubicacion, Responsable, Sede,
    HistorialMovimiento
)


class ItemCreator:
    """
    Creador de ítems de inventario desde datos de Excel.
    
    Implementa las Fases 4 y 5 del proceso de importación según INICIAL.md
    (líneas 1188-1227).
    """
    
    def create_item_from_row(
        self,
        row: pd.Series,
        row_num: int,
        sede: Sede,
        ubicacion: Ubicacion,
        responsable: Responsable,
        articulo: Articulo
    ) -> dict[str, Any]:
        """
        Crea un ítem a partir de una fila del Excel.
        
        Args:
            row: Fila con datos del ítem
            row_num: Número de fila en el Excel
            sede: Sede del ítem
            ubicacion: Ubicación del ítem
            responsable: Responsable del ítem
            articulo: Artículo del ítem
            
        Returns:
            Diccionario con datos del ítem creado
        """
        # Crear ítem
        item = self._create_item(
            row, sede, ubicacion, responsable, articulo
        )
        
        # Registrar movimiento
        self._register_movement(item, row_num)
        
        return {
            'row': row_num,
            'codigo': item.codigo,
            'id': item.id,
            'articulo': articulo.nombre,
            'placa': item.placa or '-'
        }
    
    def _create_item(
        self,
        row: pd.Series,
        sede: Sede,
        ubicacion: Ubicacion,
        responsable: Responsable,
        articulo: Articulo
    ) -> ItemInventario:
        """
        Crea un ítem de inventario.
        
        Args:
            row: Fila con datos del ítem
            sede: Sede del ítem
            ubicacion: Ubicación del ítem
            responsable: Responsable del ítem
            articulo: Artículo del ítem
            
        Returns:
            Instancia de ItemInventario creada
        """
        # Preparar datos opcionales
        placa = self._get_optional_field(row, 'Placa')
        marca = self._get_optional_field(row, 'Marca')
        serial = self._get_optional_field(row, 'Serial')
        descripcion = self._get_optional_field(row, 'Descripcion', default='')
        observaciones = self._get_optional_field(
            row, 'Observaciones', default=''
        )
        
        # Preparar estado y disponibilidad
        estado = str(row['Estado']).strip().lower()
        disponibilidad = str(row['Disponibilidad']).strip().lower()
        disponibilidad = disponibilidad.replace(' ', '_')
        
        # Crear ítem
        return ItemInventario.objects.create(
            articulo=articulo,
            ubicacion=ubicacion,
            sede=sede,
            responsable=responsable,
            estado=estado,
            disponibilidad=disponibilidad,
            placa=placa,
            marca=marca,
            serial=serial,
            descripcion=descripcion,
            observaciones=observaciones
        )
    
    def _get_optional_field(
        self, 
        row: pd.Series, 
        field: str, 
        default: str | None = None
    ) -> str | None:
        """
        Obtiene un campo opcional de la fila.
        
        Args:
            row: Fila del DataFrame
            field: Nombre del campo
            default: Valor por defecto si el campo está vacío
            
        Returns:
            Valor del campo o None/default
        """
        value = row.get(field)
        if pd.notna(value):
            stripped = str(value).strip()
            return stripped if stripped else default
        return default
    
    def _register_movement(
        self, 
        item: ItemInventario, 
        row_num: int
    ) -> None:
        """
        Registra un movimiento de alta para el ítem.
        
        Args:
            item: Ítem creado
            row_num: Número de fila en el Excel
        """
        HistorialMovimiento.objects.create(
            item=item,
            tipo_movimiento='importacion',
            observaciones=f'Importación Excel - Fila {row_num}'
        )

