"""
Validadores para importación de Excel.

Este módulo contiene todas las validaciones necesarias para verificar
la integridad de los datos antes de la importación.
"""
from typing import Any

import pandas as pd


class ExcelValidator:
    """
    Validador de datos de Excel para importación de inventario.
    
    Implementa validaciones según INICIAL.md Parte 3 (líneas 1075-1108).
    """
    
    # Constantes de validación
    REQUIRED_COLUMNS = [
        'Sede', 'Ubicacion', 'Articulo', 'Estado', 
        'Disponibilidad', 'Responsable'
    ]
    VALID_ESTADOS = ['bueno', 'regular', 'malo']
    VALID_DISPONIBILIDADES = ['en uso', 'en reparación', 'extraviado', 'de baja']
    
    def validate_columns(self, df: pd.DataFrame) -> None:
        """
        Valida que el DataFrame tenga las columnas requeridas.
        
        Args:
            df: DataFrame a validar
            
        Raises:
            ValueError: Si faltan columnas requeridas
        """
        missing_columns = [
            col for col in self.REQUIRED_COLUMNS 
            if col not in df.columns
        ]
        
        if missing_columns:
            raise ValueError(
                f'Faltan columnas obligatorias: {", ".join(missing_columns)}'
            )
    
    def validate_all_rows(self, df: pd.DataFrame) -> list[dict[str, Any]]:
        """
        Valida todas las filas del DataFrame.
        
        Args:
            df: DataFrame a validar
            
        Returns:
            Lista de errores encontrados (vacía si todo está bien)
        """
        errors = []
        
        for index, row in df.iterrows():
            row_num = index + 2  # Excel empieza en 1, header es 1
            row_errors = self.validate_row(row, row_num)
            errors.extend(row_errors)
        
        return errors
    
    def validate_row(
        self, 
        row: pd.Series, 
        row_num: int
    ) -> list[dict[str, Any]]:
        """
        Valida una fila individual.
        
        Args:
            row: Fila a validar
            row_num: Número de fila en el Excel
            
        Returns:
            Lista de errores encontrados en esta fila
        """
        errors = []
        
        # Validar campos obligatorios
        errors.extend(self._validate_required_fields(row, row_num))
        
        # Validar estado
        errors.extend(self._validate_estado(row, row_num))
        
        # Validar disponibilidad
        errors.extend(self._validate_disponibilidad(row, row_num))
        
        return errors
    
    def _validate_required_fields(
        self, 
        row: pd.Series, 
        row_num: int
    ) -> list[dict[str, Any]]:
        """
        Valida que los campos obligatorios no estén vacíos.
        
        Args:
            row: Fila a validar
            row_num: Número de fila
            
        Returns:
            Lista de errores encontrados
        """
        errors = []
        required_fields = ['Sede', 'Ubicacion', 'Articulo', 'Responsable']
        
        for field in required_fields:
            if pd.isna(row.get(field)) or str(row[field]).strip() == '':
                errors.append({
                    'row': row_num,
                    'error': f'{field} no puede estar vacío'
                })
        
        return errors
    
    def _validate_estado(
        self, 
        row: pd.Series, 
        row_num: int
    ) -> list[dict[str, Any]]:
        """
        Valida que el estado sea válido.
        
        Args:
            row: Fila a validar
            row_num: Número de fila
            
        Returns:
            Lista de errores encontrados
        """
        estado = str(row.get('Estado', '')).strip().lower()
        
        if estado not in self.VALID_ESTADOS:
            return [{
                'row': row_num,
                'error': (
                    f'Estado "{row.get("Estado")}" inválido. '
                    f'Debe ser: Bueno, Regular o Malo'
                )
            }]
        
        return []
    
    def _validate_disponibilidad(
        self, 
        row: pd.Series, 
        row_num: int
    ) -> list[dict[str, Any]]:
        """
        Valida que la disponibilidad sea válida.
        
        Args:
            row: Fila a validar
            row_num: Número de fila
            
        Returns:
            Lista de errores encontrados
        """
        disponibilidad = str(row.get('Disponibilidad', '')).strip().lower()
        
        if disponibilidad not in self.VALID_DISPONIBILIDADES:
            return [{
                'row': row_num,
                'error': (
                    f'Disponibilidad "{row.get("Disponibilidad")}" inválida. '
                    f'Debe ser: En uso, En reparación, Extraviado o De baja'
                )
            }]
        
        return []

