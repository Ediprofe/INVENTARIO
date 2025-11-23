# Plan de Implementación - Peticiones

**Fecha**: 23 de noviembre, 2025  
**Prioridad**: Alta  
**Enfoque**: Incremental y verificable

---

## 📋 Análisis de Peticiones

### Petición 1: Incidencia - Botón Eliminar ⚠️
**Prioridad**: CRÍTICA (Bloquea funcionalidad)  
**Error**: 500 al intentar eliminar ítem  
**Tiempo estimado**: 30 minutos

### Petición 2: Filtros en Tabla General 🔍
**Prioridad**: ALTA (Mejora UX significativa)  
**Complejidad**: Media-Alta  
**Tiempo estimado**: 3-4 horas

### Petición 3: Dashboard con Vistas 📊
**Prioridad**: ALTA (Feature principal)  
**Complejidad**: Alta  
**Tiempo estimado**: 6-8 horas

---

## 🎯 Estrategia de Implementación

### Fase 1: Corrección Crítica (30 min)
**Objetivo**: Resolver error 500 en eliminación

### Fase 2: Mejora de Filtros (3-4 horas)
**Objetivo**: Implementar todos los filtros solicitados

### Fase 3: Dashboard Completo (6-8 horas)
**Objetivo**: Implementar 3 vistas adicionales

---

## 📝 FASE 1: Corrección del Botón Eliminar

### Análisis del Error
```
Request failed with status code 500
await apiClient.delete(`/inventario/items/${id}/`);
```

**Posibles causas**:
1. Backend no tiene endpoint DELETE implementado correctamente
2. Permisos insuficientes
3. Restricciones de integridad referencial (FK constraints)
4. Error en el backend sin manejo adecuado

### Plan de Acción
1. ✅ Verificar endpoint en backend
2. ✅ Revisar permisos
3. ✅ Implementar eliminación lógica (soft delete) si no existe
4. ✅ Manejar restricciones de FK
5. ✅ Mejorar mensajes de error

### Archivos a Revisar/Modificar
- `backend/apps/inventario/views/item.py` (ViewSet)
- `backend/apps/inventario/models/item.py` (Modelo)
- `frontend/lib/api/items.ts` (Cliente API)
- `frontend/components/items/ItemsTable.tsx` (UI)

---

## 📝 FASE 2: Mejora de Filtros en Tabla General

### Requerimientos Específicos

#### 1. Paginación Mejorada
**Actual**: "Página X de Y" + "Z ítems en total"  
**Nuevo**: "Mostrando 1-50 de 150 ítems" + "Página 1 de 3"

#### 2. Filtros Individuales (con selectores)
- ✅ Artículo (selector con opciones)
- ✅ Ubicación (selector con opciones)
- ➕ Código de ubicación (NUEVO - selector)
- ✅ Sede (selector - ya existe)
- ➕ Responsable (selector - implementar)
- ✅ Estado Físico (selector - ya existe)
- ✅ Disponibilidad (selector - ya existe)

#### 3. Búsqueda Dinámica Refinada
**Actual**: Busca en código, artículo, ubicación  
**Nuevo**: Busca SOLO en placa, artículo y serial

#### 4. Filtros Específicos Adicionales
- ➕ Buscar por Placa (campo específico)
- ➕ Buscar por Serial (campo específico)

#### 5. Contador de Coincidencias
"X coincidencias encontradas" que se actualice con cada filtro

#### 6. Nuevo Campo en Tabla
- ➕ Mostrar "Código de Ubicación" en tabla
- ➕ Agregar a plantilla de importación
- ✅ Ya está en exportación

### Propuesta de Diseño UI

```
┌─────────────────────────────────────────────────────────────┐
│ Ítems de Inventario                                         │
│ 145 coincidencias encontradas                               │
├─────────────────────────────────────────────────────────────┤
│ Filtros:                                                     │
│ [Buscar...placa/artículo/serial]  [Placa] [Serial]         │
│ [Sede▼] [Ubicación▼] [Cód.Ubic▼] [Responsable▼]           │
│ [Artículo▼] [Estado▼] [Disponibilidad▼]                    │
├─────────────────────────────────────────────────────────────┤
│ Tabla de ítems...                                           │
├─────────────────────────────────────────────────────────────┤
│ Mostrando 1-50 de 145 ítems | Página 1 de 3                │
│ [< Anterior] [Siguiente >]                                  │
└─────────────────────────────────────────────────────────────┘
```

### Componentes a Modificar
- `ItemsTable.tsx` - Agregar nuevos filtros
- `types/index.ts` - Actualizar IItemFilters
- `backend/filters.py` - Agregar campos al filtro

### Mejoras de UX Propuestas
1. **Agrupación visual** de filtros por tipo
2. **Clear filters** button
3. **Indicadores visuales** de filtros activos
4. **Autocomplete** en selectores con muchas opciones
5. **Debounce** en búsqueda dinámica (300ms)

---

## 📝 FASE 3: Dashboard con Vistas

### Estructura Propuesta

```
/dashboard
├── /general          (Tabla general actual)
├── /ubicaciones      (Inventario por ubicaciones)
├── /responsables     (Inventario por responsables)
└── /articulos        (Inventario por artículos)
```

### Vista 1: General (Ya existe) ✅
- Tabla actual de ítems
- Todos los filtros
- Acciones en lote

### Vista 2: Inventario por Ubicaciones

**Layout**:
```
┌─────────────────────────────────────────────┐
│ Inventario por Ubicaciones                  │
├─────────────────────────────────────────────┤
│ Filtros:                                     │
│ [Sede▼] [Ubicación▼]                        │
├─────────────────────────────────────────────┤
│ RESUMEN DE INVENTARIO                        │
│ Ubicación: A302 - Sala Media                │
│ Sede: Sede Central                           │
│ Responsable: Juan Pérez                      │
│                                               │
│ ┌─────────────────┬───────┐                 │
│ │ Artículo        │ Total │                 │
│ ├─────────────────┼───────┤                 │
│ │ Portátil        │  10   │                 │
│ │ Silla amarilla  │  40   │                 │
│ └─────────────────┴───────┘                 │
├─────────────────────────────────────────────┤
│ INVENTARIO DETALLADO                         │
│ [Búsqueda] [Filtros (sin ubicación)]       │
│ [Tabla completa de ítems de esa ubicación] │
│ [Editar Rápido] si hay selección            │
└─────────────────────────────────────────────┘
```

### Vista 3: Inventario por Responsables

**Layout**:
```
┌─────────────────────────────────────────────┐
│ Inventario por Responsables                 │
├─────────────────────────────────────────────┤
│ Filtros:                                     │
│ [Responsable▼]                               │
├─────────────────────────────────────────────┤
│ RESUMEN DE INVENTARIO                        │
│ Responsable: Edi Suárez                      │
│                                               │
│ ┌──────────┬───────────┬──────┬───────┐     │
│ │ Artículo │ Ubicación │ Cód. │ Total │     │
│ ├──────────┼───────────┼──────┼───────┤     │
│ │ Portátil │ Sala media│ A302 │   2   │     │
│ │ Silla    │ Sala media│ A302 │   1   │     │
│ │ Portátil │ Biblioteca│ B402 │   3   │     │
│ └──────────┴───────────┴──────┴───────┘     │
├─────────────────────────────────────────────┤
│ INVENTARIO DETALLADO                         │
│ [Búsqueda] [Filtros (sin responsable)]     │
│ [Tabla completa con ubicaciones visibles]   │
│ [Editar Rápido] si hay selección            │
└─────────────────────────────────────────────┘
```

### Vista 4: Inventario por Artículos

**Layout**:
```
┌─────────────────────────────────────────────┐
│ Inventario por Artículos                    │
├─────────────────────────────────────────────┤
│ RESUMEN GENERAL POR SEDE                     │
│                                               │
│ ┌─────────────────┬────────┬────────┐       │
│ │ Artículo        │ Sede 1 │ Sede 2 │       │
│ ├─────────────────┼────────┼────────┤       │
│ │ Portátil        │  100   │   50   │       │
│ │ Silla amarilla  │ 1000   │  400   │       │
│ │ Televisor       │   20   │   10   │       │
│ └─────────────────┴────────┴────────┘       │
│                                               │
│ Total general: 1580 ítems                    │
└─────────────────────────────────────────────┘
```

### Navegación del Dashboard

**Opción A: Tabs (shadcn/ui)**
```
[General] [Por Ubicaciones] [Por Responsables] [Por Artículos]
```

**Opción B: Sidebar (shadcn/ui)**
```
┌─────────────┬──────────────────────┐
│ Dashboard   │                      │
│ ───────────│                      │
│ • General   │   Contenido aquí     │
│ • Ubicación │                      │
│ • Responsab.│                      │
│ • Artículos │                      │
└─────────────┴──────────────────────┘
```

**Recomendación**: Tabs (más simple, menos código)

### Componentes Nuevos a Crear

```
frontend/
├── app/
│   └── dashboard/
│       ├── layout.tsx              (Layout con tabs)
│       ├── page.tsx                (Redirect a /general)
│       ├── general/
│       │   └── page.tsx            (ItemsTable actual)
│       ├── ubicaciones/
│       │   └── page.tsx            (Nueva vista)
│       ├── responsables/
│       │   └── page.tsx            (Nueva vista)
│       └── articulos/
│           └── page.tsx            (Nueva vista)
│
└── components/
    └── dashboard/
        ├── UbicacionesView.tsx     (Resumen + Detalle)
        ├── ResponsablesView.tsx    (Resumen + Detalle)
        └── ArticulosView.tsx       (Solo resumen)
```

### Endpoints Backend Necesarios

```python
# Nuevos endpoints para vistas de dashboard

GET /inventario/dashboard/ubicaciones/{ubicacion_id}/resumen/
→ Resumen de ítems por artículo en esa ubicación

GET /inventario/dashboard/responsables/{responsable_id}/resumen/
→ Resumen de ítems por artículo y ubicación para ese responsable

GET /inventario/dashboard/articulos/resumen/
→ Resumen de ítems por artículo y sede (matriz)
```

---

## 📊 Cronograma Estimado

| Fase | Tarea | Tiempo | Prioridad |
|------|-------|--------|-----------|
| **1** | Corregir botón eliminar | 30 min | CRÍTICA |
| **2** | Mejora de filtros | 3-4 hrs | ALTA |
| **3** | Dashboard - Layout | 1 hr | ALTA |
| **3** | Dashboard - Vista Ubicaciones | 2 hrs | ALTA |
| **3** | Dashboard - Vista Responsables | 2 hrs | ALTA |
| **3** | Dashboard - Vista Artículos | 1 hr | ALTA |
| **3** | Dashboard - Endpoints backend | 2 hrs | ALTA |
| - | Testing y ajustes | 2 hrs | - |
| **TOTAL** | | **13-14 hrs** | |

---

## ✅ Checklist de Implementación

### Fase 1: Corrección Crítica
- [ ] Investigar error 500 en backend
- [ ] Implementar manejo de errores
- [ ] Probar eliminación exitosa
- [ ] Documentar solución

### Fase 2: Filtros
- [ ] Agregar filtro por Placa
- [ ] Agregar filtro por Serial
- [ ] Agregar filtro por Responsable (selector)
- [ ] Agregar filtro por Artículo (selector)
- [ ] Agregar filtro por Código de Ubicación
- [ ] Refinar búsqueda dinámica (solo placa/artículo/serial)
- [ ] Implementar contador de coincidencias
- [ ] Mejorar paginación
- [ ] Agregar columna Código de Ubicación a tabla
- [ ] Actualizar plantilla de importación
- [ ] Probar todos los filtros

### Fase 3: Dashboard
- [ ] Crear estructura de rutas
- [ ] Implementar layout con tabs
- [ ] Crear endpoints backend para resúmenes
- [ ] Implementar vista Ubicaciones
- [ ] Implementar vista Responsables
- [ ] Implementar vista Artículos
- [ ] Integrar con backend
- [ ] Probar navegación
- [ ] Probar funcionalidad completa

---

**Próximo paso**: Comenzar con Fase 1 (Corrección crítica del botón eliminar)

