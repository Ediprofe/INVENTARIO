# 🎨 Features del Sistema

Documentación detallada de cada funcionalidad del MVP.

---

## 📑 Índice de Features

### RF-001: Autenticación y Sesión
**Archivo:** `autenticacion.md` (por crear)
- Login con JWT
- Logout con invalidación
- Refresh token automático
- **Fase:** 1

### RF-002: Tabla de Ítems con Filtros
**Archivo:** `tabla-items.md` (por crear)
- Listado paginado
- Búsqueda en tiempo real
- Filtros múltiples
- Ordenamiento
- **Fase:** 3

### RF-003: CRUD de Ítems
**Archivo:** `crud-items.md` (por crear)
- Crear ítem
- Editar ítem
- Eliminar ítem (soft delete)
- Validaciones
- **Fase:** 3

### RF-004: Importar desde Excel
**Archivo:** `import-excel.md` (por crear)
- Upload de archivo
- Validación de estructura
- Auto-creación de artículos
- Reporte de errores
- **Fase:** 4

### RF-005: Exportar a Excel
**Archivo:** `export-excel.md` (por crear)
- Exportar con filtros aplicados
- Formato institucional
- Descarga automática
- **Fase:** 4

### RF-006: Edición Masiva (Batch Edit) ⭐
**Archivo:** [batch-edit.md](./batch-edit.md) ✅ **COMPLETO**
- Selección múltiple
- Grilla editable estilo Excel
- Validación en tiempo real
- Actualización transaccional
- **Fase:** 5 - PRIORIDAD ALTA

---

## 🚀 Estado Actual

| Feature | Archivo | Estado | Prioridad |
|---------|---------|--------|-----------|
| RF-001: Autenticación | `autenticacion.md` | 📝 Por documentar | Media |
| RF-002: Tabla Ítems | `tabla-items.md` | 📝 Por documentar | Alta |
| RF-003: CRUD Ítems | `crud-items.md` | 📝 Por documentar | Alta |
| RF-004: Import Excel | `import-excel.md` | 📝 Por documentar | Media |
| RF-005: Export Excel | `export-excel.md` | 📝 Por documentar | Media |
| RF-006: Batch Edit | `batch-edit.md` | ✅ Completo | ⭐ Muy Alta |

---

## 📖 Cómo Usar Esta Documentación

### Para Developers
1. Lee el archivo específico de la feature que vas a implementar
2. Revisa los criterios de aceptación
3. Sigue la implementación técnica propuesta
4. Ejecuta los tests sugeridos

### Para Product Owners
1. Revisa los criterios de aceptación
2. Valida que el alcance esté correcto
3. Prioriza features según valor de negocio

### Para QA
1. Usa criterios de aceptación como test cases
2. Verifica edge cases mencionados
3. Reporta bugs con referencia al RF específico

---

## 🔄 Flujo de Documentación

Cuando implementes una feature:
1. ✅ Lee la especificación completa
2. ✅ Implementa según lo documentado
3. ✅ Actualiza el archivo si encontraste mejoras
4. ✅ Marca como ✅ Implementada
5. ✅ Documenta cualquier desviación del plan original

---

## ⚠️ Nota Sobre Migración

**Estado:** En proceso de migración desde `docs/specs/02-FEATURES.md`

Actualmente solo `batch-edit.md` está completamente migrado y detallado.
Los demás archivos se crearán a medida que se requieran o se puede hacer migración masiva.

---

**Última actualización:** 2025-11-17
