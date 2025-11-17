# 📄 ARCHIVO 3 DE 5: `03-ESTANDARES.md`

Copia este contenido completo en `docs/specs/03-ESTANDARES.md`:

```markdown
# ESTÁNDARES DE CÓDIGO - Sistema de Inventario Escolar
**Versión:** 2.0  
**Fecha:** Noviembre 16, 2025  
**Propósito:** Guía definitiva de convenciones, límites y buenas prácticas

---

## 📋 ÍNDICE

1. [Principios Generales](#principios-generales)
2. [Límites Obligatorios](#límites-obligatorios)
3. [Nomenclatura](#nomenclatura)
4. [Estructura de Archivos](#estructura-de-archivos)
5. [Python / Django](#python--django)
6. [TypeScript / React / Next.js](#typescript--react--nextjs)
7. [Git y Commits](#git-y-commits)
8. [Testing](#testing)
9. [Documentación](#documentación)
10. [Checklist de Calidad](#checklist-de-calidad)

---

## 🎯 PRINCIPIOS GENERALES

### 1. Código Limpio
- **Legibilidad > Brevedad**: Código que se explica a sí mismo
- **DRY (Don't Repeat Yourself)**: Evitar duplicación
- **KISS (Keep It Simple, Stupid)**: Soluciones simples primero
- **YAGNI (You Aren't Gonna Need It)**: No sobre-ingeniería

### 2. Progresividad
- **Un cambio a la vez**: Commits atómicos
- **Validación continua**: Probar antes de avanzar
- **Refactorización incremental**: Mejorar sin romper

### 3. Mantenibilidad
- **Separación de responsabilidades**: Cada módulo una tarea
- **Bajo acoplamiento**: Componentes independientes
- **Alta cohesión**: Funcionalidad relacionada junta

---

## 📏 LÍMITES OBLIGATORIOS

### Longitud de Archivos

| Tipo de Archivo | Máximo | Acción si se Excede |
|-----------------|--------|---------------------|
| **Modelo Django** | 300 líneas | Dividir en múltiples archivos en `models/` |
| **Serializer** | 250 líneas | Crear serializers específicos (List, Detail, Create) |
| **ViewSet** | 300 líneas | Separar lógica en mixins o servicios |
| **Componente React** | 250 líneas | Dividir en subcomponentes |
| **Hook personalizado** | 150 líneas | Simplificar o dividir responsabilidades |
| **Utilidad/Helper** | 200 líneas | Dividir por tema en múltiples archivos |

### Longitud de Funciones/Métodos

| Tipo | Máximo | Ideal |
|------|--------|-------|
| **Función Python** | 50 líneas | 20-30 líneas |
| **Método de clase** | 40 líneas | 15-25 líneas |
| **Función TypeScript** | 50 líneas | 20-30 líneas |
| **Componente funcional React** | 100 líneas | 50-70 líneas |

### Líneas de Código

| Elemento | Máximo |
|----------|--------|
| **Línea de código** | 100 caracteres |
| **Docstring** | 80 caracteres por línea |
| **Comentario** | 80 caracteres |

### Complejidad Ciclomática

| Nivel | McCabe | Acción |
|-------|--------|--------|
| **Bajo** | 1-5 | ✅ Óptimo |
| **Medio** | 6-10 | ⚠️ Revisar |
| **Alto** | 11+ | 🔴 Refactorizar obligatorio |

---

## 🏷️ NOMENCLATURA

### Python

#### Variables y Funciones
```python
# ✅ CORRECTO: snake_case
total_items = 100
def calcular_valor_total(items):
    pass

# ❌ INCORRECTO
totalItems = 100  # camelCase
def CalcularValorTotal(items):  # PascalCase
    pass
```

#### Clases
```python
# ✅ CORRECTO: PascalCase
class ItemInventario(models.Model):
    pass

class ItemSerializer(serializers.ModelSerializer):
    pass

# ❌ INCORRECTO
class item_inventario(models.Model):  # snake_case
    pass
```

#### Constantes
```python
# ✅ CORRECTO: UPPER_SNAKE_CASE
MAX_PAGE_SIZE = 100
DEFAULT_ITEM_STATE = 'activo'
API_VERSION = 'v1'

# ❌ INCORRECTO
max_page_size = 100  # snake_case
MaxPageSize = 100     # PascalCase
```

#### Nombres Privados
```python
# ✅ CORRECTO: Prefijo con _
class MyClass:
    def __init__(self):
        self._internal_value = 10  # Privado por convención
    
    def _helper_method(self):      # Método privado
        pass

# ❌ INCORRECTO
class MyClass:
    def __init__(self):
        self.internalValue = 10    # Sin indicador de privacidad
```

---

### TypeScript / React

#### Variables y Funciones
```typescript
// ✅ CORRECTO: camelCase
const totalItems = 100;
function calculateTotalValue(items: Item[]) {
  // ...
}

// ❌ INCORRECTO
const TotalItems = 100;            // PascalCase
const total_items = 100;           // snake_case
function CalculateTotalValue() {}  // PascalCase
```

#### Componentes React
```typescript
// ✅ CORRECTO: PascalCase
export function ItemsTable() {
  return <div>...</div>;
}

export function BatchEditModal() {
  return <div>...</div>;
}

// ❌ INCORRECTO
export function itemsTable() {}    // camelCase
export function items_table() {}   // snake_case
```

#### Interfaces y Types
```typescript
// ✅ CORRECTO: PascalCase con prefijo I para interfaces
interface IItem {
  id: number;
  codigo: string;
}

type ItemStatus = 'activo' | 'inactivo' | 'dado_baja';

interface IApiResponse<T> {
  data: T;
  error?: string;
}

// ❌ INCORRECTO
interface item {              // minúscula
  id: number;
}

interface Item {              // Sin prefijo I
  id: number;
}
```

#### Constantes
```typescript
// ✅ CORRECTO: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8000';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const DEFAULT_PAGE_SIZE = 50;

// ❌ INCORRECTO
const apiBaseUrl = 'http://localhost:8000';  // camelCase
const MaxFileSize = 5242880;                 // PascalCase
```

#### Enums
```typescript
// ✅ CORRECTO: PascalCase para enum, UPPER_SNAKE_CASE para valores
enum ItemStatus {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  MANTENIMIENTO = 'mantenimiento',
  DADO_BAJA = 'dado_baja',
}

// ❌ INCORRECTO
enum itemStatus {             // minúscula
  activo = 'activo',          // minúscula
}
```

#### Hooks Personalizados
```typescript
// ✅ CORRECTO: Prefijo use + camelCase
function useItemsQuery(filters: IItemFilters) {
  // ...
}

function useAuth() {
  // ...
}

// ❌ INCORRECTO
function itemsQuery() {}      // Sin prefijo use
function UseAuth() {}         // PascalCase
```

---

### Archivos y Directorios

#### Backend (Python/Django)

```bash
# ✅ CORRECTO: snake_case
apps/inventario/models/item_inventario.py
apps/inventario/serializers/item_serializer.py
apps/inventario/views/item_viewset.py
apps/inventario/tests/test_item_crud.py
apps/core/utils/validators.py

# ❌ INCORRECTO
apps/inventario/models/ItemInventario.py   # PascalCase
apps/inventario/serializers/item-serializer.py  # kebab-case
```

#### Frontend (TypeScript/React)

```bash
# ✅ CORRECTO: PascalCase para componentes, camelCase para utils
components/items/ItemsTable.tsx
components/items/BatchEditModal.tsx
lib/api/itemsApi.ts
lib/hooks/useItemsQuery.ts
lib/utils/formatters.ts
types/item.ts

# ❌ INCORRECTO
components/items/itemsTable.tsx    # camelCase para componente
components/items/items-table.tsx   # kebab-case
lib/api/ItemsApi.ts                # PascalCase para no-componente
```

---

## 📁 ESTRUCTURA DE ARCHIVOS

### Backend

```
backend/
├── config/
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py              # Settings comunes
│   │   ├── development.py       # Local
│   │   └── production.py        # Producción
│   ├── urls.py                  # URLs raíz
│   └── wsgi.py
│
├── apps/
│   ├── core/                    # Utilidades compartidas
│   │   ├── __init__.py
│   │   ├── models.py            # TimeStampedModel
│   │   ├── pagination.py
│   │   └── utils/
│   │       ├── validators.py
│   │       └── formatters.py
│   │
│   ├── authentication/
│   │   ├── __init__.py
│   │   ├── models.py            # CustomUser
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests/
│   │       ├── __init__.py
│   │       └── test_auth.py
│   │
│   └── inventario/
│       ├── __init__.py
│       ├── models/              # ⚠️ Dividido por modelo
│       │   ├── __init__.py      # Imports para exponer modelos
│       │   ├── choices.py       # Enums
│       │   ├── sede.py
│       │   ├── ubicacion.py
│       │   ├── responsable.py
│       │   ├── articulo.py
│       │   ├── item.py
│       │   └── historial.py
│       ├── serializers/         # ⚠️ Dividido por entidad
│       │   ├── __init__.py
│       │   ├── catalogos.py     # Sede, Ubicacion, etc.
│       │   ├── item.py
│       │   └── historial.py
│       ├── views/               # ⚠️ Dividido por funcionalidad
│       │   ├── __init__.py
│       │   ├── item_viewset.py
│       │   ├── catalogos.py
│       │   └── import_export.py
│       ├── filters.py           # Filtros de django-filter
│       ├── validators.py        # Validaciones custom
│       ├── urls.py
│       ├── admin.py
│       └── tests/
│           ├── __init__.py
│           ├── conftest.py      # Fixtures pytest
│           ├── test_models.py
│           ├── test_serializers.py
│           ├── test_views.py
│           └── test_import.py
│
├── requirements/
│   ├── base.txt                 # Común
│   ├── development.txt          # Dev
│   └── production.txt           # Prod
│
├── static/
├── media/
├── manage.py
└── pytest.ini
```

---

### Frontend

```
frontend/
├── app/
│   ├── layout.tsx               # Layout raíz
│   ├── page.tsx                 # Página principal
│   ├── (auth)/                  # ⚠️ Route group
│   │   └── login/
│   │       └── page.tsx
│   └── (dashboard)/             # ⚠️ Route group protegido
│       ├── layout.tsx           # Layout con navbar
│       ├── page.tsx             # Dashboard
│       ├── items/
│       │   ├── page.tsx         # Lista
│       │   ├── [id]/
│       │   │   └── page.tsx     # Detalle
│       │   └── new/
│       │       └── page.tsx     # Crear
│       └── catalogos/
│           └── page.tsx
│
├── components/
│   ├── ui/                      # ⚠️ shadcn/ui (no modificar)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── layout/                  # Componentes de layout
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── items/                   # ⚠️ Específicos de items
│   │   ├── ItemsTable.tsx
│   │   ├── ItemForm.tsx
│   │   ├── BatchEditModal.tsx
│   │   └── ItemCard.tsx
│   ├── catalogos/
│   │   └── CatalogoForm.tsx
│   ├── auth/
│   │   └── LoginForm.tsx
│   └── common/                  # Compartidos
│       ├── LoadingSpinner.tsx
│       ├── ErrorAlert.tsx
│       └── Pagination.tsx
│
├── lib/
│   ├── api/                     # ⚠️ Clientes API
│   │   ├── client.ts            # Axios configurado
│   │   ├── items.ts
│   │   ├── catalogos.ts
│   │   └── auth.ts
│   ├── stores/                  # ⚠️ Zustand stores
│   │   ├── authStore.ts
│   │   └── itemsStore.ts
│   ├── hooks/                   # ⚠️ Custom hooks
│   │   ├── useItemsQuery.ts
│   │   ├── useAuth.ts
│   │   └── useDebounce.ts
│   ├── schemas/                 # ⚠️ Zod schemas
│   │   ├── itemSchema.ts
│   │   └── catalogoSchema.ts
│   └── utils/
│       ├── formatters.ts
│       └── validators.ts
│
├── types/                       # ⚠️ TypeScript types
│   ├── item.ts
│   ├── catalogo.ts
│   └── api.ts
│
├── styles/
│   └── globals.css
│
├── public/
│   └── images/
│
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🐍 PYTHON / DJANGO

### Imports

**Orden estándar:**
```python
# 1. Librería estándar
import os
from datetime import datetime

# 2. Librerías de terceros
from django.db import models
from rest_framework import serializers

# 3. Importaciones locales
from apps.core.models import TimeStampedModel
from .choices import EstadoItem
```

**Organización con isort:**
```bash
# .isort.cfg
[settings]
profile = black
line_length = 100
known_django = django
known_drf = rest_framework
sections = FUTURE,STDLIB,DJANGO,DRF,THIRDPARTY,FIRSTPARTY,LOCALFOLDER
```

---

### Docstrings

**Formato Google Style:**

```python
def calcular_valor_total(items: list[ItemInventario]) -> Decimal:
    """
    Calcula el valor total de una lista de ítems.
    
    Args:
        items: Lista de ítems del inventario
    
    Returns:
        Suma total del valor de todos los ítems
    
    Raises:
        ValueError: Si la lista está vacía
    
    Example:
        >>> items = [item1, item2]
        >>> calcular_valor_total(items)
        Decimal('3000000.00')
    """
    if not items:
        raise ValueError("La lista de ítems no puede estar vacía")
    
    return sum(item.valor_total for item in items)
```

**Docstring de clase:**
```python
class ItemInventario(TimeStampedModel):
    """
    Ítem físico individual del inventario.
    
    Representa una unidad física de un artículo en el inventario escolar.
    Cada registro corresponde a una única unidad física con código único.
    
    Attributes:
        codigo: Código único del ítem (ej: INV-00001)
        articulo: Tipo de artículo (FK a Articulo)
        ubicacion: Ubicación física actual (FK a Ubicacion)
        responsable: Persona a cargo (FK a Responsable)
        cantidad: Cantidad de unidades (siempre 1 en MVP)
        valor_unitario: Precio unitario en COP
        estado: Estado físico (activo, inactivo, etc.)
    
    Meta:
        ordering: ['-created_at']
        indexes: Optimizado para búsquedas por código y sede
    
    Example:
        >>> item = ItemInventario.objects.create(
        ...     codigo='INV-00001',
        ...     articulo=articulo,
        ...     ubicacion=ubicacion,
        ...     responsable=responsable,
        ...     cantidad=1,
        ...     valor_unitario=Decimal('1500000.00')
        ... )
    """
```

---

### Type Hints

**Obligatorio en todas las funciones:**
```python
# ✅ CORRECTO
def filtrar_items_por_sede(sede_id: int) -> QuerySet[ItemInventario]:
    return ItemInventario.objects.filter(sede_id=sede_id)

def serializar_item(item: ItemInventario) -> dict[str, Any]:
    return {
        'id': item.id,
        'codigo': item.codigo,
    }

# ❌ INCORRECTO
def filtrar_items_por_sede(sede_id):  # Sin type hints
    return ItemInventario.objects.filter(sede_id=sede_id)
```

**Tipos complejos:**
```python
from typing import Optional, Union, List, Dict, Any
from django.db.models import QuerySet

def procesar_importacion(
    file_path: str,
    user: 'CustomUser',
    validate_only: bool = False
) -> tuple[list[ItemInventario], list[dict[str, Any]]]:
    """
    Procesa importación de ítems desde Excel.
    
    Args:
        file_path: Ruta al archivo Excel
        user: Usuario que realiza la importación
        validate_only: Si True, solo valida sin insertar
    
    Returns:
        Tupla con (items_creados, errores_encontrados)
    """
    pass
```

---

### Modelos Django

**Estructura estándar:**
```python
class ItemInventario(TimeStampedModel):
    """Docstring completo aquí."""
    
    # 1. Campos principales
    codigo = models.CharField(...)
    articulo = models.ForeignKey(...)
    
    # 2. Meta
    class Meta:
        db_table = 'inventario_item'
        verbose_name = 'Ítem de Inventario'
        verbose_name_plural = 'Ítems de Inventario'
        ordering = ['-created_at']
        indexes = [...]
        constraints = [...]
    
    # 3. Métodos especiales
    def __str__(self) -> str:
        return f"[{self.codigo}] {self.articulo.nombre}"
    
    # 4. Métodos de validación
    def clean(self) -> None:
        super().clean()
        # Validaciones custom
    
    # 5. Métodos de instancia
    def calcular_valor_total(self) -> Decimal:
        pass
    
    # 6. Propiedades
    @property
    def valor_total(self) -> Decimal:
        return self.cantidad * self.valor_unitario
    
    # 7. Métodos de clase
    @classmethod
    def items_activos(cls) -> QuerySet['ItemInventario']:
        return cls.objects.filter(estado='activo')
```

---

### Serializers

**Estructura estándar:**
```python
class ItemSerializer(serializers.ModelSerializer):
    """
    Serializer para ItemInventario con validaciones custom.
    """
    
    # 1. Campos nested para lectura
    articulo = ArticuloSerializer(read_only=True)
    
    # 2. Campos de escritura
    articulo_id = serializers.PrimaryKeyRelatedField(
        queryset=Articulo.objects.all(),
        source='articulo',
        write_only=True
    )
    
    # 3. Meta
    class Meta:
        model = ItemInventario
        fields = ['id', 'codigo', 'articulo', 'articulo_id', ...]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    # 4. Validaciones de campo
    def validate_cantidad(self, value: int) -> int:
        if not (1 <= value <= 9999):
            raise serializers.ValidationError(
                "La cantidad debe estar entre 1 y 9999"
            )
        return value
    
    # 5. Validaciones cruzadas
    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        ubicacion = attrs.get('ubicacion')
        responsable = attrs.get('responsable')
        
        if ubicacion and responsable:
            if responsable.sede != ubicacion.sede:
                raise serializers.ValidationError({
                    'responsable_id': 'Debe pertenecer a la misma sede'
                })
        
        return attrs
    
    # 6. Métodos create/update
    def create(self, validated_data: dict[str, Any]) -> ItemInventario:
        # Lógica custom si es necesaria
        return super().create(validated_data)
```

---

### ViewSets

**Estructura estándar:**
```python
class ItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet para CRUD de ítems del inventario.
    
    Endpoints:
        - GET /items/ - Listar
        - POST /items/ - Crear
        - GET /items/{id}/ - Detalle
        - PUT /items/{id}/ - Actualizar
        - DELETE /items/{id}/ - Eliminar
    """
    
    # 1. Configuración
    permission_classes = [IsAuthenticated]
    serializer_class = ItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ItemFilter
    search_fields = ['codigo', 'articulo__nombre']
    
    # 2. QuerySet
    def get_queryset(self) -> QuerySet[ItemInventario]:
        return ItemInventario.objects.select_related(
            'articulo', 'ubicacion', 'responsable'
        )
    
    # 3. Métodos de acción
    @action(detail=False, methods=['post'])
    def import_excel(self, request):
        """Importar ítems desde Excel."""
        pass
    
    # 4. Hooks de ciclo de vida
    def perform_create(self, serializer):
        serializer.save(sede=self.request.user.sede)
```

---

## ⚛️ TYPESCRIPT / REACT / NEXT.JS

### Imports

**Orden estándar:**
```typescript
// 1. React y Next.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Librerías de terceros
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. Componentes UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// 4. Componentes locales
import { ItemsTable } from '@/components/items/ItemsTable';

// 5. Hooks y stores
import { useAuth } from '@/lib/hooks/useAuth';
import { useItemsStore } from '@/lib/stores/itemsStore';

// 6. Utils y types
import { formatCurrency } from '@/lib/utils/formatters';
import type { IItem } from '@/types/item';
```

---

### Componentes React

**Estructura estándar:**
```typescript
'use client';

import { useState } from 'react';
import type { IItem } from '@/types/item';

interface ItemsTableProps {
  /**
   * Filtro inicial de sede.
   */
  initialSedeId?: number;
  
  /**
   * Callback al seleccionar un ítem.
   */
  onItemSelect?: (item: IItem) => void;
  
  /**
   * Mostrar acciones de edición.
   * @default true
   */
  showActions?: boolean;
}

/**
 * Tabla de ítems del inventario con filtros y paginación.
 * 
 * @example
 * ```tsx
 * <ItemsTable
 *   initialSedeId={1}
 *   onItemSelect={(item) => console.log(item)}
 *   showActions={true}
 * />
 * ```
 */
export function ItemsTable({
  initialSedeId,
  onItemSelect,
  showActions = true,
}: ItemsTableProps) {
  // 1. State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  // 2. Hooks
  const router = useRouter();
  const { data, isLoading } = useQuery({...});
  
  // 3. Handlers
  const handleItemClick = (item: IItem) => {
    onItemSelect?.(item);
  };
  
  // 4. Effects
  useEffect(() => {
    // Logic here
  }, [search]);
  
  // 5. Early returns
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!data) {
    return <ErrorAlert message="No se pudieron cargar los ítems" />;
  }
  
  // 6. Render
  return (
    <div className="space-y-4">
      {/* Component content */}
    </div>
  );
}
```

---

### Hooks Personalizados

**Estructura estándar:**
```typescript
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ItemsAPI } from '@/lib/api/items';
import type { IItem, IItemFilters } from '@/types/item';

interface UseItemsQueryResult {
  items: IItem[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook para consultar ítems del inventario con filtros.
 * 
 * @param filters - Filtros de búsqueda
 * @returns Datos de ítems, loading state y función de refetch
 * 
 * @example
 * ```tsx
 * const { items, isLoading, refetch } = useItemsQuery({
 *   sede: 1,
 *   estado: 'activo'
 * });
 * ```
 */
export function useItemsQuery(filters: IItemFilters): UseItemsQueryResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['items', filters],
    queryFn: () => ItemsAPI.list(filters),
  });
  
  return {
    items: data?.results || [],
    total: data?.count || 0,
    isLoading,
    error,
    refetch,
  };
}
```

---

### Zod Schemas

**Estructura estándar:**
```typescript
import { z } from 'zod';

/**
 * Schema de validación para crear/editar un ítem.
 */
export const itemSchema = z.object({
  codigo: z
    .string()
    .min(1, 'El código es requerido')
    .max(50, 'El código no puede exceder 50 caracteres')
    .regex(/^[A-Z0-9-]+$/, 'Solo mayúsculas, números y guiones'),
  
  articulo_id: z
    .number()
    .int()
    .positive('Debe seleccionar un artículo'),
  
  ubicacion_id: z
    .number()
    .int()
    .positive('Debe seleccionar una ubicación'),
  
  responsable_id: z
    .number()
    .int()
    .positive('Debe seleccionar un responsable'),
  
  cantidad: z
    .number()
    .int()
    .min(1, 'La cantidad mínima es 1')
    .max(9999, 'La cantidad máxima es 9999'),
  
  valor_unitario: z
    .number()
    .min(0, 'El valor debe ser mayor o igual a 0'),
  
  estado: z.enum(['activo', 'inactivo', 'mantenimiento', 'dado_baja']),
  
  descripcion: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  
  observaciones: z
    .string()
    .max(1000, 'Las observaciones no pueden exceder 1000 caracteres')
    .optional(),
});

/**
 * Type inferido del schema.
 */
export type ItemFormData = z.infer<typeof itemSchema>;
```

---

## 📝 GIT Y COMMITS

### Mensajes de Commit

**Formato Conventional Commits:**

```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[footer opcional]
```

**Tipos permitidos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato de código (sin cambio funcional)
- `refactor`: Refactorización (sin cambio funcional)
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento (deps, config, etc.)

**Ejemplos:**

```bash
# ✅ CORRECTO
feat(items): agregar modal de edición masiva
fix(import): validar códigos duplicados antes de insertar
docs(readme): actualizar instrucciones de setup
refactor(api): separar lógica de validación en utils
test(items): agregar tests para CRUD completo
chore(deps): actualizar Django a 5.2.1

# ❌ INCORRECTO
agregado modal                    # Sin tipo ni alcance
Fix bug                           # Tipo en mayúscula
feat: nueva feature muy larga que excede los 72 caracteres recomendados para la primera línea
```

**Commit con cuerpo:**
```bash
git commit -m "feat(import): implementar auto-creación de artículos

- Usar get_or_create() en importación Excel
- Validar categoría antes de crear artículo
- Agregar tests para creación automática
- Actualizar documentación de importación

Closes #23"
```

---

### Ramas

**Estrategia de branching:**

```bash
main                    # Producción (protegida)
├── develop             # Desarrollo (protegida)
    ├── feature/items-crud
    ├── feature/batch-edit
    ├── fix/import-validation
    └── refactor/api-structure
```

**Nombres de rama:**
```bash
# ✅ CORRECTO
feature/items-crud
feature/batch-edit-modal
fix/import-excel-validation
refactor/split-models-directory
docs/update-readme

# ❌ INCORRECTO
nueva-feature             # Sin prefijo
feature_items_crud        # Usar guiones, no underscores
FEATURE/items-crud        # Minúsculas
```

---

## 🧪 TESTING

### Cobertura Mínima

| Componente | Coverage Mínimo | Ideal |
|------------|-----------------|-------|
| **Modelos** | 85% | 95% |
| **Serializers** | 85% | 90% |
| **Views** | 80% | 90% |
| **Utils** | 90% | 100% |
| **Componentes React** | 70% | 85% |

---

### Pytest (Backend)

**Estructura de test:**
```python
import pytest
from django.urls import reverse
from rest_framework import status

@pytest.mark.django_db
class TestItemCRUD:
    """
    Tests para CRUD de ítems del inventario.
    """
    
    def test_crear_item_exitoso(self, api_client, authenticated_user, sede, ubicacion):
        """
        Crear ítem con datos válidos retorna 201.
        """
        # Arrange
        url = reverse('inventario:items-list')
        data = {
            'codigo': 'INV-TEST-001',
            'articulo_id': 1,
            'ubicacion_id': ubicacion.id,
            'responsable_id': 1,
            'cantidad': 1,
            'valor_unitario': '100000.00',
        }
        
        # Act
        response = api_client.post(url, data)
        
        # Assert
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['codigo'] == 'INV-TEST-001'
        assert ItemInventario.objects.filter(codigo='INV-TEST-001').exists()
    
    def test_crear_item_codigo_duplicado(self, api_client, item_existente):
        """
        Crear ítem con código duplicado retorna 400.
        """
        # Arrange
        url = reverse('inventario:items-list')
        data = {'codigo': item_existente.codigo, ...}
        
        # Act
        response = api_client.post(url, data)
        
        # Assert
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'codigo' in response.data
```

**Fixtures en conftest.py:**
```python
# apps/inventario/tests/conftest.py

import pytest
from rest_framework.test import APIClient
from apps.authentication.models import CustomUser
from apps.inventario.models import Sede, Ubicacion, ItemInventario

@pytest.fixture
def api_client():
    """Cliente API de DRF."""
    return APIClient()

@pytest.fixture
def authenticated_user(api_client):
    """Usuario autenticado con tokens."""
    user = CustomUser.objects.create_user(
        username='testuser',
        password='testpass123',
        email='test@escuela.edu.co'
    )
    
    # Obtener tokens
    from rest_framework_simplejwt.tokens import RefreshToken
    refresh = RefreshToken.for_user(user)
    
    tokens = {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }
    
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {tokens["access"]}')
    
    return user, tokens

@pytest.fixture
def sede():
    """Sede de prueba."""
    return Sede.objects.create(
        codigo='TEST-001',
        nombre='Sede de Prueba'
    )

@pytest.fixture
def ubicacion(sede):
    """Ubicación de prueba."""
    return Ubicacion.objects.create(
        nombre='Sala de Prueba',
        tipo='laboratorio',
        sede=sede
    )
```

---

## 📖 DOCUMENTACIÓN

### README.md

**Estructura obligatoria:**

```markdown
# Sistema de Inventario Escolar

Descripción breve del proyecto.

## 🚀 Quick Start

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements/development.txt
python manage.py migrate
python manage.py runserver

# Frontend
cd frontend
npm install
npm run dev
```

## 📋 Requisitos

- Python 3.13+
- Node.js 22+
- PostgreSQL 16.6+

## 🏗️ Stack Tecnológico

**Backend:**
- Django 5.2
- Django REST Framework 3.16.1
- PostgreSQL 16.6

**Frontend:**
- Next.js 16
- React 19
- TypeScript 5.7
- Tailwind CSS + shadcn/ui

## 📁 Estructura del Proyecto

[Diagrama de estructura]

## 🧪 Tests

```bash
# Backend
pytest --cov=apps --cov-report=html

# Frontend
npm run test
```

## 📝 Documentación

- [Requerimientos Detallados](docs/specs/0.%20Requerimientos-DETALLADOS.md)
- [Estándares de Código](docs/specs/1.%20Estandares-codigo.md)
- [Plan de Fases](docs/specs/2.%20Fases.md)

## 👥 Contribuir

[Guía de contribución]

## 📄 Licencia

[Información de licencia]
```

---

### Docstrings en Código

**Python - Todos los módulos:**
```python
"""
Módulo de modelos del sistema de inventario.

Este módulo contiene todos los modelos relacionados con la gestión
de ítems físicos del inventario escolar.

Classes:
    ItemInventario: Ítem físico individual
    Articulo: Catálogo de tipos de artículos
    Ubicacion: Lugares físicos dentro de las sedes
"""
```

**TypeScript - Archivos importantes:**
```typescript
/**
 * @module ItemsAPI
 * 
 * Cliente API para gestión de ítems del inventario.
 * 
 * Provee métodos para CRUD completo de ítems con tipado fuerte.
 * 
 * @example
 * ```typescript
 * import { ItemsAPI } from '@/lib/api/items';
 * 
 * const items = await ItemsAPI.list({ sede: 1 });
 * const item = await ItemsAPI.get(123);
 * ```
 */
```

---

## ✅ CHECKLIST DE CALIDAD

### Antes de Cada Commit

```markdown
## Checklist Pre-Commit

### Código
- [ ] Límite de 300 líneas por archivo respetado
- [ ] Funciones < 50 líneas
- [ ] Líneas < 100 caracteres
- [ ] Nomenclatura correcta (snake_case / camelCase)

### Python
- [ ] Docstrings completos en clases y funciones
- [ ] Type hints presentes
- [ ] Validaciones robustas
- [ ] Imports organizados (isort)

### TypeScript
- [ ] Componentes con PropTypes documentados
- [ ] Hooks con JSDoc
- [ ] Zod schemas para validaciones
- [ ] Types/Interfaces bien definidos

### Tests
- [ ] Tests escritos para nueva funcionalidad
- [ ] Coverage > 85%
- [ ] Tests pasan: `pytest` / `npm test`

### Git
- [ ] Mensaje de commit sigue Conventional Commits
- [ ] Alcance especificado
- [ ] Descripción clara < 72 chars

### General
- [ ] Sin console.log / print() olvidados
- [ ] Sin código comentado sin razón
- [ ] Sin TODOs sin issue asociado
- [ ] Variables de entorno en .env.example
```

---

### Antes de Pull Request

```markdown
## Checklist Pre-PR

### Funcionalidad
- [ ] Feature completa y funcional
- [ ] Probada manualmente
- [ ] Edge cases considerados
- [ ] Validaciones en cliente y servidor

### Código
- [ ] Linters pasan sin errores
  - Backend: `ruff check .`
  - Frontend: `npm run lint`
- [ ] Formatters aplicados
  - Backend: `black .`
  - Frontend: `npm run format`
- [ ] Type checkers pasan
  - Backend: `mypy .`
  - Frontend: `npm run type-check`

### Tests
- [ ] Coverage global > 85%
- [ ] Tests unitarios pasan
- [ ] Tests de integración pasan
- [ ] No hay tests skipped sin razón

### Documentación
- [ ] README actualizado si es necesario
- [ ] Docstrings completos
- [ ] CHANGELOG actualizado
- [ ] Ejemplos de uso agregados

### Git
- [ ] Branch actualizado con develop
- [ ] Commits squashed si es necesario
- [ ] Sin conflictos

### Revisión
- [ ] Auto-revisión completa
- [ ] Screenshots si hay cambios UI
- [ ] Performance considerado
- [ ] Seguridad revisada
```

---

## 🎯 HERRAMIENTAS DE CALIDAD

### Backend

**Linting:**
```bash
# Ruff (linter rápido)
ruff check .
ruff check . --fix  # Auto-fix

# Flake8 (alternativa)
flake8 apps/
```

**Formatting:**
```bash
# Black (formatter)
black .
black --check .  # Solo verificar

# isort (ordenar imports)
isort .
isort --check .
```

**Type Checking:**
```bash
# mypy
mypy apps/
```

**Configuración en `pyproject.toml`:**
```toml
[tool.black]
line-length = 100
target-version = ['py313']
include = '\.pyi?$'

[tool.isort]
profile = "black"
line_length = 100

[tool.ruff]
line-length = 100
select = ["E", "F", "I"]
ignore = ["E501"]

[tool.mypy]
python_version = "3.13"
warn_return_any = true
warn_unused_configs = true
```

---

### Frontend

**Linting:**
```bash
# ESLint
npm run lint
npm run lint:fix
```

**Formatting:**
```bash
# Prettier
npm run format
npm run format:check
```

**Type Checking:**
```bash
# TypeScript
npm run type-check
```

**Configuración `.eslintrc.json`:**
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

**Configuración `.prettierrc`:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

---

## 📊 MÉTRICAS DE CÓDIGO

### Límites de Complejidad

**Backend (radon):**
```bash
# Instalar
pip install radon

# Analizar complejidad ciclomática
radon cc apps/ -a -nb

# Métricas de mantenibilidad
radon mi apps/
```

**Interpretación:**
- **A (0-5)**: ✅ Excelente
- **B (6-10)**: ✅ Bueno
- **C (11-20)**: ⚠️ Revisar
- **D (21-40)**: 🔴 Refactorizar
- **F (41+)**: 🔴 Crítico - refactorizar obligatorio

---

### SonarQube (Opcional para CI/CD)

**Umbrales de calidad:**
- Coverage: ≥ 85%
- Duplicación: ≤ 3%
- Bugs: 0
- Vulnerabilidades: 0
- Code Smells: ≤ 10 minor

---

## 🎓 RECURSOS DE APRENDIZAJE

### Python / Django
- [PEP 8 – Style Guide](https://peps.python.org/pep-0008/)
- [Django Best Practices](https://django-best-practices.readthedocs.io/)
- [DRF Best Practices](https://www.django-rest-framework.org/topics/best-practices/)

### TypeScript / React
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Best Practices](https://react.dev/learn)
- [Next.js Docs](https://nextjs.org/docs)

### Testing
- [Pytest Documentation](https://docs.pytest.org/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## ✅ RESUMEN

**Reglas de oro:**
1. ✅ Archivos < 300 líneas
2. ✅ Funciones < 50 líneas
3. ✅ Docstrings en todo
4. ✅ Type hints obligatorios
5. ✅ Tests coverage > 85%
6. ✅ Commits siguiendo Conventional Commits
7. ✅ Linters sin errores
8. ✅ Sin código comentado
9. ✅ Variables en .env
10. ✅ Revisión antes de PR

---

**Documento generado:** Noviembre 16, 2025  
**Versión:** 2.0  
**Próximo:** Fase 0 - Setup detallado
```

---