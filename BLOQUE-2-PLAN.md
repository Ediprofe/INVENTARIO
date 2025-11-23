# BLOQUE 2: Ajuste de UI - Botones y Tabla Principal

**Fecha**: 23 de noviembre, 2025  
**Objetivo**: Simplificar UI siguiendo requerimientos específicos de CLAUDE.md

---

## 📋 Análisis de Requerimientos

### Según CLAUDE.md (líneas 39-59):

**1. "Editar en hoja"**
> Solo se activa cuando se hace una selección múltiple de varios ítems [...] Sin embargo, lo he pensando, y realmente ya no quiero que aparezca este botón.

**Acción**: ❌ Eliminar completamente el botón "Editar en hoja"

**2. "Editar rápido"**
> Me gustaría solo conservar las funciones "Modo atómico", "Actualizar ubicación", "Actualizar responsable", "Actualizar Estado Físico", "Actualizar Disponibilidad"

**Acción**: ✂️ Simplificar BatchEditDialog
- ✅ Mantener: Modo atómico, Ubicación, Responsable, Estado Físico, Disponibilidad
- ❌ Quitar: Placa, Marca, Serial, Descripción, Observaciones

**3. Bug en "Actualizar responsable"**
> Ten en cuenta que la función "Actualizar responsable" lanza el error: Cannot read properties of null (reading 'codigo')

**Acción**: 🐛 Corregir error en línea 246 de BatchEditDialog.tsx

**4. Tabla con shadcn**
> Me gustaría que la aplicación quede hecha enteramente con shadcn, incluida la tabla principal

**Acción**: ✅ Verificar y asegurar uso completo de shadcn

---

## 🎯 Tareas Específicas

### Tarea 1: Eliminar Botón "Editar en hoja"

**Archivos a modificar**:
1. `frontend/app/page.tsx`
   - Eliminar estado `batchEditSpreadsheetDialogOpen`
   - Eliminar handler `handleBatchEditSpreadsheetClick`
   - Eliminar handler `handleBatchEditSpreadsheetDialogClose`
   - Eliminar import de `BatchEditSpreadsheetDialog`
   - Eliminar renderizado del componente

2. `frontend/components/items/ItemsTable.tsx`
   - Eliminar prop `onBatchEditSpreadsheetClick`
   - Eliminar handler `handleBatchEditSpreadsheet`
   - Eliminar botón "📊 Editar en Hoja"

3. `frontend/components/items/index.ts`
   - Eliminar export de `BatchEditSpreadsheetDialog`

**Verificación**: ✅ Botón no aparece en UI

---

### Tarea 2: Simplificar "Editar Rápido"

**Archivo**: `frontend/components/items/BatchEditDialog.tsx`

**Campos a eliminar**:
```typescript
// QUITAR del estado updateFields:
- placa
- marca
- serial
- descripcion
- observaciones

// QUITAR del estado formData:
- placa
- marca
- serial
- descripcion
- observaciones

// QUITAR de la UI:
- Sección "Placa field" (líneas 318-335)
- Sección "Marca field" (líneas 337-355)
- Sección "Serial field" (líneas 357-375)
- Sección "Descripcion field" (líneas 377-395)
- Sección "Observaciones field" (líneas 397-415)

// QUITAR de handleSubmit:
- Condicionales if para estos campos
```

**Campos a mantener**:
- ✅ Modo atómico (checkbox)
- ✅ Actualizar Ubicación
- ✅ Actualizar Responsable
- ✅ Actualizar Estado Físico
- ✅ Actualizar Disponibilidad

**Verificación**: ✅ Solo 5 opciones visibles en el diálogo

---

### Tarea 3: Corregir Bug en BatchEditDialog

**Problema actual** (líneas 244-247):
```typescript
{responsablesData?.results.map((responsable) => {
  const sedeInfo = typeof responsable.sede === 'object' 
    ? responsable.sede.codigo  // ❌ Error si sede es null
    : '';
```

**Solución**:
```typescript
{responsablesData?.results.map((responsable) => {
  const sedeInfo = typeof responsable.sede === 'object' && responsable.sede
    ? responsable.sede.codigo  // ✅ Validación defensiva
    : '';
```

**También aplica a** (líneas 210-213):
```typescript
const sedeInfo = typeof ubicacion.sede === 'object' 
  ? ubicacion.sede.codigo 
  : '';
```

**Verificación**: ✅ No hay errores al abrir selector de responsables

---

### Tarea 4: Verificar Uso Completo de shadcn

**Componentes actuales en ItemsTable.tsx**:
- ✅ Button (shadcn)
- ✅ Input (shadcn)
- ✅ Label (shadcn)
- ✅ Select, SelectContent, SelectItem, SelectTrigger, SelectValue (shadcn)
- ✅ Checkbox (shadcn)
- ✅ Table, TableBody, TableCell, TableHead, TableHeader, TableRow (shadcn)
- ✅ Card, CardContent, CardDescription, CardHeader, CardTitle (shadcn)

**Estado**: ✅ Ya usa shadcn completamente

**Verificación**: ✅ Todos los componentes son de shadcn

---

## 📊 Métricas de Código

### Antes de refactorización:
```
ItemsTable.tsx:        432 líneas  ⚠️ (límite 250)
BatchEditDialog.tsx:   473 líneas  ❌ (límite 250)
page.tsx:              110 líneas  ✅
```

### Después de refactorización:
```
ItemsTable.tsx:        ~400 líneas  ⚠️ (reducir en futuro)
BatchEditDialog.tsx:   ~320 líneas  ✅ (eliminar 5 campos)
page.tsx:              ~90 líneas   ✅ (eliminar 1 diálogo)
```

**Nota**: ItemsTable.tsx sigue siendo grande, pero el enfoque del Bloque 2 es ajustar funcionalidad, no refactorizar tamaño. Esto se puede hacer en iteración futura.

---

## 🧪 Plan de Pruebas

### Caso 1: Verificar Eliminación de "Editar en hoja"
1. Abrir aplicación
2. Seleccionar múltiples ítems
3. **Verificar**: NO aparece botón "📊 Editar en Hoja"
4. **Verificar**: SÍ aparece botón "Editar Rápido"

### Caso 2: Verificar "Editar Rápido" Simplificado
1. Seleccionar múltiples ítems
2. Clic en "Editar Rápido"
3. **Verificar**: Se muestran solo 5 opciones:
   - Modo atómico
   - Actualizar Ubicación
   - Actualizar Responsable
   - Actualizar Estado Físico
   - Actualizar Disponibilidad
4. **Verificar**: NO aparecen: Placa, Marca, Serial, Descripción, Observaciones

### Caso 3: Verificar Corrección de Bug
1. Seleccionar múltiples ítems
2. Clic en "Editar Rápido"
3. Activar checkbox "Actualizar Responsable"
4. Abrir dropdown de responsables
5. **Verificar**: NO hay error "Cannot read properties of null"
6. **Verificar**: Se muestran responsables correctamente

### Caso 4: Verificar Funcionalidad de Edición
1. Seleccionar 3 ítems
2. Clic en "Editar Rápido"
3. Activar "Actualizar Estado Físico"
4. Seleccionar "Regular"
5. Clic en "Actualizar"
6. **Verificar**: Los 3 ítems cambiaron a estado "Regular"

### Caso 5: Verificar Modo Atómico
1. Seleccionar 3 ítems (1 con ubicación inválida)
2. Activar "Modo atómico"
3. Intentar actualizar ubicación a una no válida
4. **Verificar**: NINGÚN ítem se actualizó (todo o nada)

---

## 📦 Entregables

1. ✅ `page.tsx` - Sin referencia a BatchEditSpreadsheetDialog
2. ✅ `ItemsTable.tsx` - Sin botón "Editar en hoja"
3. ✅ `BatchEditDialog.tsx` - Simplificado a 5 campos
4. ✅ Bug corregido en selectores de ubicación/responsable
5. ✅ `BLOQUE-2-IMPLEMENTACION.md` - Documentación de cambios

---

## ⏱️ Estimación de Tiempo

- Tarea 1 (Eliminar botón): **15 minutos**
- Tarea 2 (Simplificar diálogo): **30 minutos**
- Tarea 3 (Corregir bug): **10 minutos**
- Tarea 4 (Verificar shadcn): **5 minutos**
- Documentación: **10 minutos**

**Total**: ~70 minutos (1.2 horas)

---

## ✅ Checklist Pre-Implementación

- [x] Análisis de requerimientos completado
- [x] Archivos a modificar identificados
- [x] Plan de pruebas definido
- [x] Entregables listados
- [ ] Implementación iniciada

---

**Próximo paso**: Ejecutar implementación siguiendo este plan

