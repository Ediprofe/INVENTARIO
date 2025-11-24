# Propuesta: Sistema de Reseteo e Importación Masiva de Inventario

**Fecha:** 2024-11-23  
**Líder Técnico:** IA Assistant  
**Propósito:** Implementar funcionalidad completa para resetear e importar el inventario desde Excel de manera segura, validada y eficiente.

---

## 📋 Índice

1. [Análisis del Sistema Actual](#análisis-del-sistema-actual)
2. [Propuesta de Arquitectura](#propuesta-de-arquitectura)
3. [Diseño de Plantilla Excel](#diseño-de-plantilla-excel)
4. [Flujo de Trabajo del Usuario](#flujo-de-trabajo-del-usuario)
5. [Implementación Técnica](#implementación-técnica)
6. [Estrategia de Validación](#estrategia-de-validación)
7. [Plan de Despliegue](#plan-de-despliegue)

---

## 🔍 Análisis del Sistema Actual

### Modelos Existentes (Orden de Dependencia)

```
1. Sede (independiente)
   ├─ codigo, nombre, dirección, teléfono, email
   
2. Articulo (depende de Sede)
   ├─ codigo, nombre, categoría, descripción
   
3. Responsable (depende de Sede)
   ├─ nombre, apellido, documento, cargo, email, teléfono
   
4. Ubicacion (depende de Sede)
   ├─ codigo, nombre, tipo, piso, capacidad
   └─ responsable (opcional)
   
5. ItemInventario (depende de todos)
   ├─ articulo, sede, ubicacion, responsable
   └─ placa, marca, serial, estado, disponibilidad
```

### Funcionalidades Existentes

- ✅ Importación individual de ítems (Excel simple)
- ✅ Exportación de ítems filtrados
- ✅ Gestión de catálogos vía Admin de Django
- ❌ **FALTA:** Importación masiva de catálogos
- ❌ **FALTA:** Reseteo seguro del inventario
- ❌ **FALTA:** Plantilla multi-hoja con relaciones

---

## 🏗️ Propuesta de Arquitectura

### Opción 1: **Híbrido (Excel + Admin Django)** ✅ RECOMENDADO

**Rationale:** Combina la potencia del Admin de Django para catálogos con la practicidad de Excel para datos masivos.

#### Flujo Propuesto:

```
1. RESETEO (vía Admin Django - Command Management)
   └─ Comando: python manage.py reset_inventario --confirm

2. CONFIGURACIÓN INICIAL (Admin Django)
   ├─ Sedes (4-5 registros típicamente)
   ├─ Responsables (10-20 registros)
   └─ Artículos (50-100 registros)
   
3. IMPORTACIÓN MASIVA (Excel Multi-Hoja)
   ├─ Hoja 1: "Ubicaciones" (depende de Sedes)
   ├─ Hoja 2: "Items_Inventario" (depende de todo)
   └─ Validación cruzada automática
```

**Ventajas:**
- ✅ Catálogos pequeños se manejan mejor en Admin (interfaz visual, validación inmediata)
- ✅ Datos masivos (items, ubicaciones) en Excel (copiado/pegado rápido)
- ✅ Separación clara de responsabilidades
- ✅ Menos errores de referencia (IDs se manejan automáticamente)

### Opción 2: Excel 100% Completo ⚠️ NO RECOMENDADO

**Problema:** El usuario tendría que llenar manualmente FK_IDs (ej: `sede_id`, `articulo_id`), lo cual es propenso a errores.

---

## 📊 Diseño de Plantilla Excel

### Plantilla: `plantilla_importacion_completa.xlsx`

#### **Hoja 1: "UBICACIONES"**

| Columna | Tipo | Obligatorio | Ejemplo | Validación |
|---------|------|-------------|---------|------------|
| Sede | Texto | ✅ | Sede Central | Debe existir en BD |
| Código | Texto | ✅ | A-101 | Único por sede |
| Nombre | Texto | ✅ | Laboratorio de Física | - |
| Tipo | Choice | ✅ | Laboratorio | Ver `TipoUbicacion` |
| Piso | Número | ❌ | 2 | Entero positivo |
| Capacidad | Número | ❌ | 30 | Entero positivo |
| Responsable | Texto | ❌ | Juan Pérez | Debe existir en BD |
| Observaciones | Texto | ❌ | - | Max 500 caracteres |

**Ejemplo (10 registros de prueba):**
```
Sede Central    | A-101 | Laboratorio de Física      | Laboratorio  | 2 | 30 | Juan Pérez    | Equipado con nuevos computadores
Sede Central    | A-102 | Sala de Profesores         | Oficina      | 1 | 10 | María López   | Requiere mantenimiento
Sede Norte      | N-201 | Aula de Informática        | Aula         | 2 | 35 | Carlos Ruiz   | 
...
```

#### **Hoja 2: "ITEMS_INVENTARIO"**

| Columna | Tipo | Obligatorio | Ejemplo | Validación |
|---------|------|-------------|---------|------------|
| Sede | Texto | ✅ | Sede Central | Debe existir |
| Ubicación | Texto | ✅ | Laboratorio de Física | Debe existir |
| Artículo | Texto | ✅ | Portátil Lenovo ThinkPad | Debe existir |
| Responsable | Texto | ✅ | Juan Pérez | Debe existir |
| Placa | Texto | ❌ | PLA-001 | Único si se proporciona |
| Marca | Texto | ❌ | Lenovo | - |
| Serial | Texto | ❌ | SN123456789 | Único si se proporciona |
| Estado | Choice | ✅ | Bueno | bueno/regular/malo |
| Disponibilidad | Choice | ✅ | En uso | Ver `Disponibilidad` |
| Descripción | Texto | ❌ | - | Max 500 caracteres |
| Observaciones | Texto | ❌ | - | Max 500 caracteres |

**Ejemplo (10 registros de prueba incluidos en la plantilla):**
```
Sede Central | Laboratorio de Física | Portátil Lenovo ThinkPad | Juan Pérez | PLA-001 | Lenovo | SN12345 | Bueno | En uso | Core i5, 8GB RAM | Comprado 2023
Sede Central | Sala de Profesores    | Proyector Epson X41      | María López| PLA-002 | Epson  | EP88990 | Bueno | En uso | 3500 lúmenes      | 
...
```

#### **Hoja 3: "GUÍA_DE_USO"** (Informativa)

Contiene instrucciones paso a paso:
1. Configurar catálogos en Admin Django
2. Llenar ubicaciones en Hoja 1
3. Llenar items en Hoja 2
4. Validaciones automáticas
5. Qué hacer si hay errores

---

## 🔄 Flujo de Trabajo del Usuario

### Fase 1: Preparación (Admin Django)

```bash
# 1. Resetear base de datos (comando personalizado)
python manage.py reset_inventario --confirm

# 2. Acceder al Admin Django
http://localhost:8000/admin/

# 3. Crear catálogos base:
   - Sedes (ej: Sede Central, Sede Norte, Sede Sur)
   - Responsables (nombre, apellido, documento, cargo, email)
   - Artículos (nombre, categoría, código automático)
```

### Fase 2: Preparar Excel

```bash
# 1. Descargar plantilla desde el sistema
GET /api/inventario/excel/plantilla-completa/

# 2. Copiar sus datos existentes a las hojas correspondientes:
   - Hoja "UBICACIONES": Copiar ubicaciones desde su Excel actual
   - Hoja "ITEMS_INVENTARIO": Copiar items desde su Excel actual
   
# 3. Validar que las referencias (Sede, Responsable, etc.) coincidan
```

### Fase 3: Importación

```bash
# Subir archivo desde el frontend
POST /api/inventario/excel/importar-completo/
- file: plantilla_completada.xlsx

# El sistema:
1. Valida estructura del Excel (hojas, columnas)
2. Valida referencias cruzadas (FK exists)
3. Valida unicidad (placas, seriales, códigos)
4. Si TODO es válido → Importa en transacción
5. Si HAY errores → Retorna lista detallada sin importar nada
```

---

## 💻 Implementación Técnica

### 1. Comando de Reseteo

**Archivo:** `backend/apps/inventario/management/commands/reset_inventario.py`

```python
"""
Comando para resetear el inventario completo.
USO: python manage.py reset_inventario --confirm
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from apps.inventario.models import (
    ItemInventario, Ubicacion, Responsable, 
    Articulo, Sede, HistorialMovimiento
)


class Command(BaseCommand):
    help = 'Resetea completamente el inventario (PELIGROSO)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirmar que desea eliminar TODOS los datos',
        )

    def handle(self, *args, **options):
        if not options['confirm']:
            self.stdout.write(
                self.style.ERROR(
                    'ADVERTENCIA: Este comando eliminará TODOS los datos.\\n'
                    'Use --confirm para confirmar.'
                )
            )
            return

        self.stdout.write('Iniciando reseteo...')
        
        with transaction.atomic():
            # Orden inverso de dependencias
            HistorialMovimiento.objects.all().delete()
            ItemInventario.objects.all().delete()
            Ubicacion.objects.all().delete()
            Responsable.objects.all().delete()
            Articulo.objects.all().delete()
            Sede.objects.all().delete()

        self.stdout.write(
            self.style.SUCCESS('✅ Inventario reseteado exitosamente')
        )
```

### 2. Servicio de Importación Completa

**Archivo:** `backend/apps/inventario/services/full_import_service.py`

```python
"""
Servicio para importación completa multi-hoja.
Implementa validación robusta y transaccionalidad.
"""

import openpyxl
from django.db import transaction
from apps.inventario.models import (
    Ubicacion, ItemInventario, Sede, Articulo, Responsable
)


class FullImportService:
    """
    Importa ubicaciones e items desde Excel multi-hoja.
    
    Validaciones:
    - Estructura de hojas y columnas
    - Referencias FK existentes
    - Unicidad de códigos y placas
    - Consistencia de datos
    """
    
    REQUIRED_SHEETS = ['UBICACIONES', 'ITEMS_INVENTARIO']
    
    UBICACIONES_COLUMNS = [
        'Sede', 'Código', 'Nombre', 'Tipo', 'Piso', 
        'Capacidad', 'Responsable', 'Observaciones'
    ]
    
    ITEMS_COLUMNS = [
        'Sede', 'Ubicación', 'Artículo', 'Responsable', 'Placa',
        'Marca', 'Serial', 'Estado', 'Disponibilidad', 
        'Descripción', 'Observaciones'
    ]
    
    def __init__(self):
        self.errors = []
        self.created_ubicaciones = 0
        self.created_items = 0
    
    def import_from_file(self, excel_file):
        """
        Importa datos desde archivo Excel multi-hoja.
        
        Returns:
            dict: Resultado con contadores y errores
            
        Raises:
            ValidationError: Si hay errores de validación
        """
        wb = openpyxl.load_workbook(excel_file, data_only=True)
        
        # Validar estructura
        self._validate_structure(wb)
        if self.errors:
            return self._error_response()
        
        # Validar datos
        ubicaciones_data = self._validate_ubicaciones(wb['UBICACIONES'])
        items_data = self._validate_items(wb['ITEMS_INVENTARIO'])
        
        if self.errors:
            return self._error_response()
        
        # Importar en transacción
        with transaction.atomic():
            self._import_ubicaciones(ubicaciones_data)
            self._import_items(items_data)
        
        return {
            'success': True,
            'message': 'Importación completada exitosamente',
            'created_ubicaciones': self.created_ubicaciones,
            'created_items': self.created_items,
            'errors': []
        }
    
    def _validate_structure(self, wb):
        """Valida que existan las hojas requeridas."""
        for sheet_name in self.REQUIRED_SHEETS:
            if sheet_name not in wb.sheetnames:
                self.errors.append({
                    'sheet': 'General',
                    'error': f'Hoja "{sheet_name}" no encontrada'
                })
    
    def _validate_ubicaciones(self, ws):
        """
        Valida datos de la hoja UBICACIONES.
        
        Validaciones:
        - Columnas requeridas presentes
        - Referencias a Sede existen
        - Códigos únicos por sede
        - Tipos válidos
        """
        # Implementación detallada...
        pass
    
    def _validate_items(self, ws):
        """
        Valida datos de la hoja ITEMS_INVENTARIO.
        
        Validaciones:
        - Referencias existen (Sede, Ubicación, Artículo, Responsable)
        - Placas y seriales únicos
        - Estados y disponibilidad válidos
        """
        # Implementación detallada...
        pass
    
    # ... métodos de importación
```

### 3. Endpoint API

**Archivo:** `backend/apps/inventario/views/excel_views.py` (agregar)

```python
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def import_full_inventario(request):
    """
    Importa inventario completo desde Excel multi-hoja.
    
    Request:
        file: archivo Excel con hojas UBICACIONES e ITEMS_INVENTARIO
    
    Response:
        {
            "success": true,
            "created_ubicaciones": 50,
            "created_items": 1000,
            "errors": []
        }
    """
    if 'file' not in request.FILES:
        return Response(
            {'error': 'No se proporcionó archivo'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    excel_file = request.FILES['file']
    
    try:
        service = FullImportService()
        result = service.import_from_file(excel_file)
        
        if result['success']:
            return Response(result, status=status.HTTP_201_CREATED)
        else:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_full_template(request):
    """
    Descarga plantilla completa con múltiples hojas y datos de ejemplo.
    
    Response:
        Excel file: plantilla_importacion_completa.xlsx
    """
    # Crear workbook con múltiples hojas
    wb = openpyxl.Workbook()
    
    # Hoja 1: Ubicaciones
    ws_ubicaciones = wb.active
    ws_ubicaciones.title = "UBICACIONES"
    # ... crear encabezados y 10 filas de ejemplo
    
    # Hoja 2: Items
    ws_items = wb.create_sheet("ITEMS_INVENTARIO")
    # ... crear encabezados y 10 filas de ejemplo
    
    # Hoja 3: Guía
    ws_guia = wb.create_sheet("GUÍA_DE_USO")
    # ... agregar instrucciones
    
    # Preparar respuesta
    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = (
        'attachment; filename="plantilla_importacion_completa.xlsx"'
    )
    
    wb.save(response)
    return response
```

### 4. Frontend

**Archivo:** `frontend/components/items/FullImportDialog.tsx`

```tsx
/**
 * Diálogo para importación completa de inventario.
 * 
 * Permite:
 * - Descargar plantilla multi-hoja
 * - Subir archivo completado
 * - Ver progreso y errores
 */
export function FullImportDialog({ open, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleDownloadTemplate = async () => {
    const blob = await ExcelAPI.downloadFullTemplate();
    saveAs(blob, 'plantilla_importacion_completa.xlsx');
  };

  const handleImport = async () => {
    if (!file) return;
    
    setImporting(true);
    try {
      const result = await ExcelAPI.importFullInventario(file);
      setResult(result);
      
      if (result.success) {
        toast.success(`Importados: ${result.created_items} items, ${result.created_ubicaciones} ubicaciones`);
      }
    } catch (error) {
      toast.error('Error en la importación');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* UI con drag-drop, progreso, y lista de errores */}
    </Dialog>
  );
}
```

---

## ✅ Estrategia de Validación

### Validaciones por Capa

| Validación | Ubicación | Momento |
|------------|-----------|---------|
| **Estructura del archivo** | Backend | Al subir |
| **Columnas requeridas** | Backend | Al subir |
| **Tipos de datos** | Backend | Al procesar |
| **Referencias FK** | Backend | Al procesar |
| **Unicidad** | Backend | Al procesar |
| **Reglas de negocio** | Backend | Al procesar |

### Manejo de Errores

Errores se reportan con detalle:
```json
{
  "success": false,
  "errors": [
    {
      "sheet": "UBICACIONES",
      "row": 5,
      "column": "Sede",
      "error": "Sede 'Sede Inexistente' no existe en la base de datos"
    },
    {
      "sheet": "ITEMS_INVENTARIO",
      "row": 12,
      "column": "Placa",
      "error": "Placa 'PLA-001' ya existe"
    }
  ]
}
```

---

## 🚀 Plan de Despliegue

### Fase 1: Desarrollo (1-2 días)
- ✅ Comando de reseteo
- ✅ Servicio de importación completa
- ✅ Endpoint API
- ✅ Generador de plantilla con ejemplos

### Fase 2: Testing (1 día)
- ✅ Probar con dataset pequeño
- ✅ Probar con dataset del usuario
- ✅ Verificar validaciones

### Fase 3: Frontend (1 día)
- ✅ Diálogo de importación
- ✅ Descarga de plantilla
- ✅ Manejo de errores

### Fase 4: Documentación (medio día)
- ✅ Guía de uso
- ✅ Video tutorial (opcional)

---

## 📌 Conclusión

### Ventajas de esta Propuesta

1. **Separación de Responsabilidades:**
   - Catálogos pequeños → Admin Django (interfaz visual)
   - Datos masivos → Excel (copiado rápido)

2. **Robustez:**
   - Validaciones exhaustivas
   - Importación transaccional (todo o nada)
   - Mensajes de error detallados

3. **Experiencia de Usuario:**
   - Plantilla con ejemplos integrados
   - Guía de uso incluida
   - Proceso guiado paso a paso

4. **Mantenibilidad:**
   - Código modular y testeabl
   - Cumple estándares del proyecto
   - Fácil de extender

### Próximo Paso

**Aprobación del usuario para proceder con la implementación.**

¿Desea que proceda con el desarrollo de esta propuesta?

