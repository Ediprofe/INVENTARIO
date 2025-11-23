"""
Gestor de catálogos para importación de Excel.

Este módulo maneja la creación automática de catálogos
(Sedes, Ubicaciones, Responsables, Artículos) durante la importación.
"""
from apps.inventario.models import Sede, Ubicacion, Responsable, Articulo


class CatalogManager:
    """
    Gestor de catálogos para importación de inventario.
    
    Implementa la Fase 3 del proceso de importación según INICIAL.md
    (líneas 1110-1186).
    """
    
    def __init__(self):
        """Inicializa el gestor de catálogos."""
        self.created_sedes = 0
        self.created_ubicaciones = 0
        self.created_responsables = 0
        self.created_articulos = 0
    
    def get_or_create_sede(self, nombre: str) -> Sede:
        """
        Obtiene o crea una sede por nombre.
        
        Args:
            nombre: Nombre de la sede
            
        Returns:
            Instancia de Sede
        """
        nombre = str(nombre).strip()
        sede, created = Sede.objects.get_or_create(
            nombre__iexact=nombre,
            defaults={
                'nombre': nombre,
                'codigo': nombre[:10].upper()
            }
        )
        if created:
            self.created_sedes += 1
        return sede
    
    def get_or_create_ubicacion(
        self, 
        codigo: str, 
        sede: Sede
    ) -> Ubicacion:
        """
        Obtiene o crea una ubicación.
        
        Args:
            codigo: Código de la ubicación
            sede: Sede a la que pertenece
            
        Returns:
            Instancia de Ubicacion
        """
        codigo = str(codigo).strip()
        ubicacion, created = Ubicacion.objects.get_or_create(
            codigo__iexact=codigo,
            sede=sede,
            defaults={
                'codigo': codigo,
                'nombre': codigo,
                'tipo': 'otro'
            }
        )
        if created:
            self.created_ubicaciones += 1
        return ubicacion
    
    def get_or_create_responsable(
        self, 
        nombre_completo: str, 
        sede: Sede
    ) -> Responsable:
        """
        Obtiene o crea un responsable.
        
        Args:
            nombre_completo: Nombre completo del responsable
            sede: Sede a la que pertenece
            
        Returns:
            Instancia de Responsable
        """
        nombre_completo = str(nombre_completo).strip()
        responsable, created = Responsable.get_or_create_by_fullname(
            nombre_completo=nombre_completo,
            sede=sede
        )
        if created:
            self.created_responsables += 1
        return responsable
    
    def get_or_create_articulo(self, nombre: str) -> Articulo:
        """
        Obtiene o crea un artículo.
        
        Args:
            nombre: Nombre del artículo
            
        Returns:
            Instancia de Articulo
        """
        nombre = str(nombre).strip()
        articulo, created = Articulo.get_or_create_by_name(
            nombre=nombre,
            categoria='otros'
        )
        if created:
            self.created_articulos += 1
        return articulo
    
    def get_summary(self) -> dict[str, int]:
        """
        Obtiene un resumen de los catálogos creados.
        
        Returns:
            Diccionario con contadores de catálogos creados
        """
        return {
            'sedes_creadas': self.created_sedes,
            'ubicaciones_creadas': self.created_ubicaciones,
            'responsables_creados': self.created_responsables,
            'articulos_creados': self.created_articulos,
        }

