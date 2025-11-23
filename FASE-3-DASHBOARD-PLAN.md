# FASE 3: Vista de Dashboard - Plan de Implementación

**Fecha**: 23 de noviembre de 2025  
**Estado**: 🔄 EN PROGRESO

---

## 📋 Resumen Ejecutivo

Implementar un dashboard completo con navegación entre vistas, que incluya:
1. Tabla general (ya existente)
2. Inventario por ubicaciones
3. Inventario por responsables
4. Inventario por artículos

---

## 🎯 Requerimientos por Vista

### 1. Tabla General
✅ **Ya implementada** - Solo necesita integración en el dashboard

### 2. Inventario por Ubicaciones

#### Interfaz Superior: Selector
- Dropdown de sede
- Dropdown de ubicación (muestra: código + nombre)
- Al seleccionar, mostrar:

#### Tabla Resumen (Totalizado)
```
Resumen de inventario - Código de ubicación - Ubicación - Sede - Responsable de ubicación

| Artículo        | Total |
|-----------------|-------|
| Portátil        | 10    |
| Silla amarilla  | 40    |
```

#### Tabla Detallada
```
| Artículo | Placa    | Estado  | Descripción | Observación | Marca | Serial      | Disponibilidad | Responsable |
|----------|----------|---------|-------------|-------------|-------|-------------|----------------|-------------|
| Portátil | 1-038983 | Bueno   | Desc 1      | Obs 1       | HP    | L238U823UM  | En uso         | Edi Suárez  |
| Portátil | 1-083739 | Regular | Desc 2      | Obs 2       | DELL  |             | En uso         | Edi Suárez  |
```

**Funcionalidades**:
- ✅ Filtros de búsqueda (excepto ubicación/código ubicación)
- ✅ Botón "Editar Rápido" para selección múltiple
- ✅ Paginación

### 3. Inventario por Responsable

#### Interfaz Superior: Selector
- Dropdown de responsable (muestra: nombre completo)
- Al seleccionar, mostrar:

#### Tabla Resumen (Totalizado)
```
Resumen de inventario - Nombre del responsable

| Artículo        | Ubicación   | Código ubicación | Total |
|-----------------|-------------|------------------|-------|
| Portátil        | Sala media  | A302             | 2     |
| Silla amarilla  | Sala media  | A302             | 1     |
| Portátil        | Biblioteca  | B402             | 3     |
| Televisor       | Biblioteca  | B402             | 1     |
```

#### Tabla Detallada
```
| Artículo | Placa    | Ubicación | Código ubicación | Sede | Estado  | Descripción | Observación | Marca | Serial      | Disponibilidad |
|----------|----------|-----------|------------------|------|---------|-------------|-------------|-------|-------------|----------------|
| Portátil | 1-038983 |           |                  |      | Bueno   | Desc 1      | Obs 1       | HP    | L238U823UM  | En uso         |
| Portátil | 1-083739 |           |                  |      | Regular | Desc 2      | Obs 2       | DELL  |             | En uso         |
```

**Funcionalidades**:
- ✅ Filtros de búsqueda (excepto responsable)
- ✅ Botón "Editar Rápido" para selección múltiple
- ✅ Paginación

### 4. Inventario por Artículo

#### Solo Tabla Resumen (Totalizado por Sede)
```
| Artículo        | Sede 1 | Sede 2 | ... | Total |
|-----------------|--------|--------|-----|-------|
| Portátil        | 100    | 50     | ... | 150   |
| Silla amarilla  | 1000   | 400    | ... | 1400  |
```

**Funcionalidades**:
- ✅ Filtro de búsqueda por artículo
- ✅ Sin edición (solo visualización)

---

## 🏗️ Arquitectura de Implementación

### Estructura de Rutas (Next.js App Router)

```
app/
├── page.tsx                          # Tabla General (ya existe)
├── inventario/
│   ├── ubicaciones/
│   │   └── page.tsx                  # Vista Ubicaciones
│   ├── responsables/
│   │   └── page.tsx                  # Vista Responsables
│   └── articulos/
│       └── page.tsx                  # Vista Artículos
└── layout.tsx                        # Layout global con navegación
```

### Componentes a Crear

```
components/
├── dashboard/
│   ├── DashboardLayout.tsx           # Layout del dashboard
│   ├── DashboardNav.tsx              # Navegación entre vistas
│   └── StatsCards.tsx                # Tarjetas de estadísticas (opcional)
├── ubicaciones/
│   ├── UbicacionSelector.tsx         # Selector de sede y ubicación
│   ├── UbicacionResumen.tsx          # Tabla resumen por artículo
│   └── UbicacionDetalle.tsx          # Tabla detallada de ítems
├── responsables/
│   ├── ResponsableSelector.tsx       # Selector de responsable
│   ├── ResponsableResumen.tsx        # Tabla resumen por artículo/ubicación
│   └── ResponsableDetalle.tsx        # Tabla detallada de ítems
└── articulos/
    └── ArticulosResumen.tsx          # Tabla resumen por sede
```

### Hooks y APIs a Crear

```
lib/
├── hooks/
│   ├── useUbicacionStats.ts          # Estadísticas por ubicación
│   ├── useResponsableStats.ts        # Estadísticas por responsable
│   └── useArticuloStats.ts           # Estadísticas por artículo
└── api/
    └── stats.ts                       # Endpoints de estadísticas
```

### Backend: Nuevos Endpoints

```python
# apps/inventario/views/stats.py (nuevo archivo)

class InventarioStatsViewSet:
    """
    ViewSet para estadísticas e informes del inventario.
    """
    
    @action(detail=False, methods=['get'], url_path='por-ubicacion/(?P<ubicacion_id>[^/.]+)')
    def por_ubicacion(self, request, ubicacion_id):
        """
        GET /inventario/stats/por-ubicacion/{ubicacion_id}/
        
        Retorna:
        - Resumen: Totalizado por artículo
        - Detalle: Lista de ítems con paginación
        """
        pass
    
    @action(detail=False, methods=['get'], url_path='por-responsable/(?P<responsable_id>[^/.]+)')
    def por_responsable(self, request, responsable_id):
        """
        GET /inventario/stats/por-responsable/{responsable_id}/
        
        Retorna:
        - Resumen: Totalizado por artículo/ubicación
        - Detalle: Lista de ítems con paginación
        """
        pass
    
    @action(detail=False, methods=['get'], url_path='por-articulo')
    def por_articulo(self, request):
        """
        GET /inventario/stats/por-articulo/
        
        Retorna:
        - Resumen: Matriz artículo x sede con totales
        """
        pass
```

---

## 📐 Diseño de UI (shadcn/ui)

### Navegación del Dashboard

```tsx
// DashboardNav.tsx
<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">Tabla General</TabsTrigger>
    <TabsTrigger value="ubicaciones">Por Ubicaciones</TabsTrigger>
    <TabsTrigger value="responsables">Por Responsables</TabsTrigger>
    <TabsTrigger value="articulos">Por Artículos</TabsTrigger>
  </TabsList>
</Tabs>
```

### Selector de Ubicación

```tsx
// UbicacionSelector.tsx
<Card>
  <CardHeader>
    <CardTitle>Filtrar por Ubicación</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid gap-4 md:grid-cols-2">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona una sede" />
        </SelectTrigger>
        {/* opciones */}
      </Select>
      
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona una ubicación" />
        </SelectTrigger>
        {/* opciones: código + nombre */}
      </Select>
    </div>
  </CardContent>
</Card>
```

---

## 🔄 Flujo de Implementación

### Subtarea 1: Backend - Endpoints de Estadísticas
1. Crear `apps/inventario/views/stats.py`
2. Implementar endpoint `por-ubicacion`
3. Implementar endpoint `por-responsable`
4. Implementar endpoint `por-articulo`
5. Agregar serializers específicos para respuestas
6. Registrar rutas en `urls.py`

### Subtarea 2: Frontend - Navegación y Layout
1. Actualizar `app/layout.tsx` con navegación del dashboard
2. Crear componente `DashboardNav.tsx`
3. Configurar rutas en App Router

### Subtarea 3: Vista Inventario por Ubicaciones
1. Crear página `app/inventario/ubicaciones/page.tsx`
2. Crear componente `UbicacionSelector.tsx`
3. Crear componente `UbicacionResumen.tsx`
4. Crear componente `UbicacionDetalle.tsx`
5. Implementar hooks `useUbicacionStats.ts`
6. Integrar búsqueda y "Editar Rápido"

### Subtarea 4: Vista Inventario por Responsables
1. Crear página `app/inventario/responsables/page.tsx`
2. Crear componente `ResponsableSelector.tsx`
3. Crear componente `ResponsableResumen.tsx`
4. Crear componente `ResponsableDetalle.tsx`
5. Implementar hooks `useResponsableStats.ts`
6. Integrar búsqueda y "Editar Rápido"

### Subtarea 5: Vista Inventario por Artículos
1. Crear página `app/inventario/articulos/page.tsx`
2. Crear componente `ArticulosResumen.tsx`
3. Implementar hooks `useArticuloStats.ts`
4. Implementar matriz dinámica de sedes

---

## 📊 Métricas de Calidad

### Adherencia a Estándares
- ✅ Límite de líneas por archivo (< 300 para vistas, < 200 para componentes)
- ✅ TypeScript completo y seguro
- ✅ Componentes shadcn/ui exclusivamente
- ✅ Docstrings en backend (español)
- ✅ Comentarios en frontend (cuando añaden valor)

### Performance
- ✅ Paginación en tablas detalladas
- ✅ Lazy loading de componentes pesados
- ✅ Caching con React Query
- ✅ Optimización de queries en backend

### UX
- ✅ Feedback inmediato en selecciones
- ✅ Loading states
- ✅ Error boundaries
- ✅ Accesibilidad (ARIA labels)

---

## 🧪 Testing

### Casos de Prueba

#### Vista Ubicaciones
1. Seleccionar sede → Ver ubicaciones filtradas
2. Seleccionar ubicación → Ver resumen y detalle
3. Buscar en tabla detallada → Filtrado correcto
4. Selección múltiple → Botón "Editar Rápido" activo
5. Paginación → Navegar entre páginas

#### Vista Responsables
1. Seleccionar responsable → Ver resumen y detalle
2. Resumen muestra ítems agrupados por ubicación
3. Buscar en tabla detallada → Filtrado correcto
4. Selección múltiple → Botón "Editar Rápido" activo

#### Vista Artículos
1. Tabla resumen carga correctamente
2. Matriz muestra todas las sedes
3. Totales por fila y columna correctos
4. Filtro por artículo funciona

---

## 📅 Estimación de Tiempo

- **Subtarea 1 (Backend)**: 2-3 horas
- **Subtarea 2 (Navegación)**: 1 hora
- **Subtarea 3 (Ubicaciones)**: 3-4 horas
- **Subtarea 4 (Responsables)**: 3-4 horas
- **Subtarea 5 (Artículos)**: 2-3 horas

**Total estimado**: 11-15 horas de implementación pura

---

## 🚀 Siguientes Pasos Inmediatos

1. ✅ Crear este plan de implementación
2. ⏳ Iniciar Subtarea 1: Backend - Endpoints de Estadísticas
3. ⏳ Continuar con Subtareas 2-5 secuencialmente

---

**Documentación generada**: 23 de noviembre de 2025  
**Versión**: 1.0  
**Autor**: Claude AI Assistant

