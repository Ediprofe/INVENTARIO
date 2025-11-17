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
| [`batch-edit.md`](features/batch-edit.md) | ✅ Especificado | ⭐⭐⭐ Muy Alta |

**Nota:** Otras features (autenticación, CRUD, import/export) se especificarán según se necesiten.

**Regla:** Cada feature en su propio archivo. Si cambias batch-edit → Solo editar `batch-edit.md`

---

### 📏 Estándares de Código
→ [`standards/`](standards/)

| Documento | Contenido |
|-----------|-----------|
| [`codigo.md`](standards/codigo.md) | ⭐ **Todos los estándares** - Python, TypeScript, Git, Testing |

**Regla:** Si cambias un estándar de código → Solo editar `codigo.md`

---

### 🚀 Plan de Implementación
→ [`fases/`](fases/)

| Documento | Contenido |
|-----------|-----------|
| [`fase-0-setup.md`](fases/fase-0-setup.md) | Setup inicial detallado paso a paso |
| [`fases-1-7.md`](fases/fases-1-7.md) | Fases 1-7 completas (22-30 días) |

**Regla:** Si cambias el plan de una fase → Solo editar archivos en `fases/`

---

## 📦 Carpetas Legacy (Backup)

### `specs/` - Documentación Original
→ [`specs/`](specs/)

**NO EDITAR.** Solo como backup y referencia histórica.

| Archivo | Migrado a... | Estado |
|---------|--------------|--------|
| `00-VISION-PROYECTO.md` | [`vision/`](vision/) | ✅ Completo |
| `01-MODELO-DATOS.md` | [`modelo/entidades.md`](modelo/entidades.md) | ✅ Completo |
| `02-FEATURES.md` | [`features/batch-edit.md`](features/batch-edit.md) | ✅ Completo |
| `03-ESTANDARES.md` | [`standards/codigo.md`](standards/codigo.md) | ✅ Completo |
| `04-FASE-0-SETUP.md` | [`fases/fase-0-setup.md`](fases/fase-0-setup.md) | ✅ Completo |
| `05-FASES-1-7.md` | [`fases/fases-1-7.md`](fases/fases-1-7.md) | ✅ Completo |
| `06-PERMISOS.md` | [`permisos.md`](permisos.md) | ✅ Completo |

---

## 🔍 Búsquedas Comunes

### "¿Qué versión de Django usar?"
→ [`vision/stack.md`](vision/stack.md) - Django 5.2

### "¿Cómo implementar batch edit?"
→ [`features/batch-edit.md`](features/batch-edit.md)

### "¿Cuál es el alcance del MVP?"
→ [`vision/alcance.md`](vision/alcance.md)

### "¿Dónde están los estándares de código?"
→ [`standards/codigo.md`](standards/codigo.md)

### "¿Cómo hago el setup inicial?"
→ [`fases/fase-0-setup.md`](fases/fase-0-setup.md)

### "¿Cuál es el progreso actual?"
→ [`../ESTADO.md`](../ESTADO.md)

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
│   ├── README.md          # Índice
│   ├── stack.md           # ⭐ FUENTE ÚNICA de versiones
│   ├── objetivos.md       # Qué construimos y por qué
│   └── alcance.md         # Qué incluye el MVP
│
├── modelo/                 # 🗄️ Base de datos
│   ├── README.md          # Índice
│   └── entidades.md       # Modelos Django completos
│
├── features/               # 🎨 Funcionalidades
│   ├── README.md          # Índice de features
│   └── batch-edit.md      # ⭐ Edición masiva (completo)
│
├── standards/              # 📏 Convenciones
│   ├── README.md          # Índice + referencia rápida
│   └── codigo.md          # ⭐ Todos los estándares
│
├── fases/                  # 🚀 Plan de implementación
│   ├── README.md          # Índice
│   ├── fase-0-setup.md    # Setup inicial paso a paso
│   └── fases-1-7.md       # Fases 1-7 completas
│
├── permisos.md             # Sistema de permisos (Fase 2)
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
**Estado:** ✅ Migración completa de specs/ a estructura de 2 niveles
