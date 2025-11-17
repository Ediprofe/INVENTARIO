# 📍 MAPA DE NAVEGACIÓN - Sistema de Inventario Escolar

**Guía única de dónde está cada cosa en la documentación.**

---

## 🎯 Inicio Rápido

| Necesito... | Ir a... |
|-------------|---------|
| Setup inicial del proyecto | [`fases/fase-0-setup.md`](fases/fase-0-setup.md) |
| Ver progreso actual | [`../ESTADO.md`](../ESTADO.md) |
| Quick start (README) | [`../README.md`](../README.md) |
| Versiones del stack | [`vision/stack.md`](vision/stack.md) ⭐ |

---

## 📚 Por Categoría

### 🎯 Visión y Estrategia
→ [`vision/`](vision/)

| Documento | Contenido |
|-----------|-----------|
| [`stack.md`](vision/stack.md) | ⭐ **FUENTE ÚNICA** - Versiones de todas las tecnologías |
| [`objetivos.md`](vision/objetivos.md) | Qué construimos y por qué |
| [`alcance.md`](vision/alcance.md) | Qué incluye el MVP y qué no |

**Regla:** Si actualizas versión de Django, Next.js, etc. → Solo editar `stack.md`

---

### 🗄️ Modelo de Datos
→ [`modelo/`](modelo/)

| Documento | Contenido |
|-----------|-----------|
| [`entidades.md`](modelo/entidades.md) | Modelos Django completos con validaciones |

**Regla:** Si cambias estructura de BD → Solo editar archivos en `modelo/`

---

### 🎨 Features del Sistema
→ [`features/`](features/)

| Documento | Estado | Prioridad |
|-----------|--------|-----------|
| [`batch-edit.md`](features/batch-edit.md) | ✅ Completo | ⭐⭐⭐ Muy Alta |
| [`autenticacion.md`](features/autenticacion.md) | Por migrar | Alta |
| [`crud-items.md`](features/crud-items.md) | Por migrar | Alta |
| [`import-excel.md`](features/import-excel.md) | Por migrar | Media |
| [`export-excel.md`](features/export-excel.md) | Por migrar | Media |

**Regla:** Cada feature en su propio archivo. Si cambias batch-edit → Solo editar `batch-edit.md`

---

### 📏 Estándares de Código
→ [`standards/`](standards/)

| Documento | Contenido |
|-----------|-----------|
| [`python.md`](standards/python.md) | Convenciones Python/Django (por migrar) |
| [`typescript.md`](standards/typescript.md) | Convenciones TypeScript/React (por migrar) |

**Estado actual:** Ver [`../docs/specs/03-ESTANDARES.md`](specs/03-ESTANDARES.md) (legacy)

---

### 🚀 Plan de Implementación
→ [`fases/`](fases/)

| Documento | Contenido |
|-----------|-----------|
| [`fase-0-setup.md`](fases/fase-0-setup.md) | Setup inicial detallado (por migrar) |
| [`fases-1-7.md`](fases/fases-1-7.md) | Fases 1-7 completas (por migrar) |

**Estado actual:** Ver [`specs/04-FASE-0-SETUP.md`](specs/04-FASE-0-SETUP.md) y [`specs/05-FASES-1-7.md`](specs/05-FASES-1-7.md) (legacy)

---

## 📦 Carpetas Legacy (Backup)

### `specs/` - Documentación Original
→ [`specs/`](specs/)

**NO EDITAR.** Solo como backup y referencia histórica.

| Archivo | Migrado a... |
|---------|-------------|
| `00-VISION-PROYECTO.md` | [`vision/`](vision/) |
| `01-MODELO-DATOS.md` | [`modelo/entidades.md`](modelo/entidades.md) (por migrar) |
| `02-FEATURES.md` | [`features/`](features/) (parcial) |
| `03-ESTANDARES.md` | [`standards/`](standards/) (por migrar) |
| `04-FASE-0-SETUP.md` | [`fases/fase-0-setup.md`](fases/fase-0-setup.md) (por migrar) |
| `05-FASES-1-7.md` | [`fases/fases-1-7.md`](fases/fases-1-7.md) (por migrar) |
| `06-PERMISOS.md` | Quedará aquí (implementar Fase 2) |

---

## 🔍 Búsquedas Comunes

### "¿Qué versión de Django usar?"
→ [`vision/stack.md`](vision/stack.md) - Django 5.2

### "¿Cómo implementar batch edit?"
→ [`features/batch-edit.md`](features/batch-edit.md)

### "¿Cuál es el alcance del MVP?"
→ [`vision/alcance.md`](vision/alcance.md)

### "¿Dónde están los estándares de código?"
→ Temporalmente: [`specs/03-ESTANDARES.md`](specs/03-ESTANDARES.md)
→ Futuro: [`standards/`](standards/)

### "¿Cómo hago el setup inicial?"
→ Temporalmente: [`specs/04-FASE-0-SETUP.md`](specs/04-FASE-0-SETUP.md)
→ Futuro: [`fases/fase-0-setup.md`](fases/fase-0-setup.md)

### "¿Cuál es el progreso actual?"
→ [`../ESTADO.md`](../ESTADO.md) (antes PROYECTO.md)

---

## 🎯 Principio de Fuente Única

**Regla de oro:** Cada información debe existir en UN SOLO LUGAR.

| Información | Ubicación Única |
|-------------|-----------------|
| **Versiones de tecnologías** | [`vision/stack.md`](vision/stack.md) |
| **Objetivos del proyecto** | [`vision/objetivos.md`](vision/objetivos.md) |
| **Alcance del MVP** | [`vision/alcance.md`](vision/alcance.md) |
| **Modelos de BD** | [`modelo/entidades.md`](modelo/entidades.md) |
| **Feature X** | [`features/X.md`](features/) |
| **Progreso actual** | [`../ESTADO.md`](../ESTADO.md) |

**Si necesitas duplicar algo:** Mejor hacer un link al archivo original.

---

## 📝 Mantenimiento

### Actualizar Versión de Dependencia
```bash
# ✅ Correcto
vim docs/vision/stack.md
# Cambiar Django==5.2 → Django==5.3
# ¡Listo! Es la fuente única

# ❌ Incorrecto
# Buscar "Django 5.2" en todos los archivos
```

### Agregar Nueva Feature
```bash
# ✅ Correcto
vim docs/features/nueva-feature.md
# Copiar estructura de batch-edit.md
# Actualizar features/README.md

# ❌ Incorrecto
# Editar un archivo monolítico con todas las features
```

### Cambiar Estructura de BD
```bash
# ✅ Correcto
vim docs/modelo/entidades.md
# Actualizar modelo específico

# ❌ Incorrecto
# Buscar el modelo en múltiples archivos
```

---

## 🗂️ Estructura Completa

```
docs/
├── NAVIGATION.md           # 📍 Este archivo - Mapa único
│
├── vision/                 # 🎯 Qué y por qué
│   ├── stack.md           # ⭐ FUENTE ÚNICA de versiones
│   ├── objetivos.md
│   └── alcance.md
│
├── modelo/                 # 🗄️ Base de datos
│   └── entidades.md       # Modelos Django
│
├── features/               # 🎨 Funcionalidades
│   ├── batch-edit.md      # ⭐ Edición masiva (completo)
│   ├── autenticacion.md
│   ├── crud-items.md
│   ├── import-excel.md
│   └── export-excel.md
│
├── standards/              # 📏 Convenciones
│   ├── python.md
│   └── typescript.md
│
├── fases/                  # 🚀 Plan de implementación
│   ├── fase-0-setup.md
│   └── fases-1-7.md
│
└── specs/                  # 📦 Legacy (backup, no editar)
    ├── 00-VISION-PROYECTO.md
    ├── 01-MODELO-DATOS.md
    ├── 02-FEATURES.md
    ├── 03-ESTANDARES.md
    ├── 04-FASE-0-SETUP.md
    ├── 05-FASES-1-7.md
    └── 06-PERMISOS.md
```

---

**Última actualización:** 2025-11-17
**Mantenido por:** Edilberto
**Siguiente revisión:** Al completar migración completa de specs/
