"""
Servicio de importación de ítems desde archivos Excel.

Este módulo orquesta el proceso completo de importación según INICIAL.md Parte 3,
delegando responsabilidades específicas a módulos especializados.
"""
from typing import Any

import pandas as pd
from django.db import transaction

from .excel_validators import ExcelValidator
from .catalog_manager import CatalogManager
from .item_creator import ItemCreator


class ImportValidationError(Exception):
    """Excepción personalizada para errores de validación durante importación."""
    
    def __init__(self, errors: list[dict[str, Any]]):
        """
        Inicializa la excepción con la lista de errores.
        
        Args:
            errors: Lista de errores encontrados
        """
        self.errors = errors
        super().__init__(f"Se encontraron {len(errors)} errores de validación")


class ExcelImportService:
    """
    Servicio orquestador para importación de ítems desde Excel.
    
    Coordina el proceso de 6 fases delegando a servicios especializados:
    1-2. Lectura, normalización y validación (ExcelValidator)
    3. Creación de catálogos (CatalogManager)
    4-5. Creación de ítems y movimientos (ItemCreator)
    6. Generación de resumen
    
    Example:
        >>> service = ExcelImportService()
        >>> result = service.import_from_file(excel_file)
        >>> print(f"Creados: {result['created']}")
    """
    
    def __init__(self):
        """Inicializa el servicio con sus componentes."""
        self.validator = ExcelValidator()
        self.catalog_manager = CatalogManager()
        self.item_creator = ItemCreator()
    
    def import_from_file(self, excel_file) -> dict[str, Any]:
        """
        Importa ítems desde un archivo Excel con transaccionalidad completa.
        
        Args:
            excel_file: Archivo Excel cargado
            
        Returns:
            Diccionario con resultados de la importación
            
        Raises:
            ImportValidationError: Si hay errores de validación
            ValueError: Si el formato del archivo es inválido
            
        Note:
            Si hay cualquier error de validación, no se importa ningún ítem.
            Esto garantiza transaccionalidad completa (todo o nada).
        """
        # Fase 1: Lectura y normalización
        df = self._read_and_normalize(excel_file)
        
        # Fase 2: Validaciones completas (antes de transaction)
        errors = self.validator.validate_all_rows(df)
        
        if errors:
            raise ImportValidationError(errors)
        
        # Fases 3-6: Procesamiento en transacción atómica
        return self._process_import(df)
    
    def _read_and_normalize(self, excel_file) -> pd.DataFrame:
        """
        Lee y normaliza el archivo Excel (Fase 1).
        
        Args:
            excel_file: Archivo Excel a procesar
            
        Returns:
            DataFrame normalizado y validado
            
        Raises:
            ValueError: Si faltan columnas requeridas
        """
        df = pd.read_excel(excel_file)
        
        # Normalizar nombres de columnas
        df.columns = [col.strip() for col in df.columns]
        
        # Validar columnas obligatorias
        self.validator.validate_columns(df)
        
        # Descartar filas completamente vacías
        df = df.dropna(how='all')
        
        return df
    
    @transaction.atomic
    def _process_import(self, df: pd.DataFrame) -> dict[str, Any]:
        """
        Procesa la importación dentro de una transacción atómica (Fases 3-5).
        
        Args:
            df: DataFrame validado
            
        Returns:
            Diccionario con resultados de la importación
            
        Note:
            Si ocurre cualquier error durante el procesamiento,
            toda la transacción se revierte automáticamente.
        """
        created_items = []
        
        for index, row in df.iterrows():
            row_num = index + 2
            item_data = self._process_row(row, row_num)
            created_items.append(item_data)
        
        # Fase 6: Construir respuesta con resumen
        return self._build_response(created_items)
    
    def _process_row(self, row: pd.Series, row_num: int) -> dict[str, Any]:
        """
        Procesa una fila individual del Excel.
        
        Args:
            row: Fila con datos del ítem
            row_num: Número de fila en el Excel
            
        Returns:
            Diccionario con datos del ítem creado
        """
        # Fase 3: Obtener o crear catálogos
        sede = self.catalog_manager.get_or_create_sede(row['Sede'])
        ubicacion = self.catalog_manager.get_or_create_ubicacion(
            row['Ubicacion'], sede
        )
        responsable = self.catalog_manager.get_or_create_responsable(
            row['Responsable'], sede
        )
        articulo = self.catalog_manager.get_or_create_articulo(row['Articulo'])
        
        # Fases 4-5: Crear ítem y registrar movimiento
        return self.item_creator.create_item_from_row(
            row, row_num, sede, ubicacion, responsable, articulo
        )
    
    def _build_response(
        self, 
        created_items: list[dict[str, Any]]
    ) -> dict[str, Any]:
        """
        Construye la respuesta de la importación (Fase 6).
        
        Args:
            created_items: Lista de ítems creados
            
        Returns:
            Diccionario con resultados completos de la importación
        """
        return {
            'message': 'Importación completada exitosamente',
            'created': len(created_items),
            'errors': 0,
            'created_items': [
                {
                    'row': item['row'],
                    'codigo': item['codigo'],
                    'id': item['id']
                }
                for item in created_items
            ],
            'error_details': [],
            'summary': self.catalog_manager.get_summary()
        }
