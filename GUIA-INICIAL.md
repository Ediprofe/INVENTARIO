# 🎯 GUÍA INICIAL - Sistema de Inventario Escolar

**Para entender este proyecto en 5 minutos**

---

## 📌 ¿Qué es?

Sistema web para gestionar **7,000+ ítems físicos** de una institución educativa con múltiples sedes.

**Stack:** Django 5.2 + Next.js 16 + PostgreSQL 16

---

## 🎯 ¿Por qué existe?

**Problema:** Inventario manual en Excel, propenso a errores, sin trazabilidad.

**Solución:** Sistema centralizado con:
- ✅ Importación masiva desde Excel
- ✅ Edición masiva (prioridad alta)
- ✅ Trazabilidad completa
- ✅ Multi-sede

---

## 🗂️ ¿Cómo está organizado?

### Documentación en 2 Niveles

**1. Raíz del Proyecto (Documentación Viva)**
```
├── README.md           # Quick start e instalación
├── ESTADO.md           # Progreso actual (actualiza cada fase)
├── GUIA-INICIAL.md     # Este archivo
└── .claude/context.md  # Contexto para IA
```

**2. docs/ (Especificaciones Técnicas)**
```
docs/
├── NAVIGATION.md       # 📍 Mapa de todas las specs
├── vision/             # Estrategia (stack, objetivos, alcance)
├── modelo/             # Base de datos
├── features/           # Funcionalidades
├── standards/          # Convenciones de código
├── fases/              # Plan de implementación
└── permisos.md         # Sistema de permisos
```

---

## 🚀 ¿Por dónde empiezo?

### Como Usuario/Desarrollador

1. **Instalar:** [`README.md`](README.md)
2. **Ver progreso:** [`ESTADO.md`](ESTADO.md)
3. **Entender arquitectura:** [`docs/vision/`](docs/vision/)
4. **Implementar:** [`docs/fases/fase-0-setup.md`](docs/fases/fase-0-setup.md)

### Como IA (Claude/Cursor)

1. **Contexto rápido:** [`.claude/context.md`](.claude/context.md)
2. **Estado actual:** [`ESTADO.md`](ESTADO.md)
3. **Mapa de specs:** [`docs/NAVIGATION.md`](docs/NAVIGATION.md)
4. **Spec específica:** Según tarea en `docs/`

---

## 📚 Archivos Clave

| Necesito... | Archivo |
|-------------|---------|
| **Versiones del stack** | [`docs/vision/stack.md`](docs/vision/stack.md) ⭐ |
| **Modelo de datos** | [`docs/modelo/entidades.md`](docs/modelo/entidades.md) |
| **Feature prioritaria** | [`docs/features/batch-edit.md`](docs/features/batch-edit.md) ⭐ |
| **Estándares de código** | [`docs/standards/`](docs/standards/) |
| **Plan completo** | [`docs/fases/fases-1-7.md`](docs/fases/fases-1-7.md) |
| **Progreso actual** | [`ESTADO.md`](ESTADO.md) |

---

## 🎨 Features Principales

### MVP (Versión 1.0)

1. **RF-001: Autenticación JWT** → [`docs/features/autenticacion.md`](docs/features/)
2. **RF-002: Tabla de Ítems** → Búsqueda, filtros, paginación
3. **RF-003: CRUD de Ítems** → Crear, editar, eliminar
4. **RF-004: Importar Excel** → Auto-crear artículos
5. **RF-005: Exportar Excel** → Con filtros
6. **RF-006: Edición Masiva** ⭐ → [`docs/features/batch-edit.md`](docs/features/batch-edit.md)

---

## 🏗️ Arquitectura Simplificada

```
Frontend (Next.js 16)
    ↓ HTTP/REST
Backend (Django 5.2 + DRF)
    ↓ SQL
Database (PostgreSQL 16)
```

**Ver detalles:** [`docs/vision/`](docs/vision/)

---

## 📈 Plan de Implementación

**Total:** 22-30 días (7 fases)

| Fase | Duración | Descripción |
|------|----------|-------------|
| **0** | 1-2 días | Setup inicial |
| **1** | 3-4 días | Modelos + Autenticación |
| **2** | 3-4 días | API REST |
| **3** | 5-6 días | Frontend MVP |
| **4** | 3-4 días | Import/Export Excel |
| **5** | 3-4 días | Edición Masiva ⭐ |
| **6** | 2-3 días | Testing + Polish |
| **7** | 2-3 días | Docker + Deploy |

**Ver detalle:** [`docs/fases/fases-1-7.md`](docs/fases/fases-1-7.md)

---

## 🎯 Decisiones Clave (NO NEGOCIABLES)

### Stack Tecnológico
- Backend: Django 5.2
- Frontend: Next.js 16
- Base de datos: PostgreSQL 16.6
- UI: Tailwind CSS + shadcn/ui

**Ver versiones exactas:** [`docs/vision/stack.md`](docs/vision/stack.md) ⭐

### Principios
1. **Fuente única de verdad** - Cada info en UN solo lugar
2. **Validación doble** - Cliente y servidor
3. **Máx 300 líneas/archivo** - Modularidad
4. **Coverage mín 85%** - Testing riguroso

**Ver todos:** [`docs/standards/`](docs/standards/)

---

## 🔍 Búsquedas Comunes

### "¿Qué versión de Django usar?"
→ [`docs/vision/stack.md`](docs/vision/stack.md) - Django 5.2

### "¿Cómo es el modelo de datos?"
→ [`docs/modelo/entidades.md`](docs/modelo/entidades.md)

### "¿Cómo implementar batch edit?"
→ [`docs/features/batch-edit.md`](docs/features/batch-edit.md)

### "¿Dónde estamos en el proyecto?"
→ [`ESTADO.md`](ESTADO.md)

### "¿Cómo empiezo el setup?"
→ [`docs/fases/fase-0-setup.md`](docs/fases/fase-0-setup.md)

---

## 📝 Convenciones de Documentación

### Archivos en Raíz (Documentación Viva)
- **Se actualizan frecuentemente**
- Reflejan el estado actual
- Hacen **referencia** a docs/

### Archivos en docs/ (Especificaciones)
- **Relativamente estáticos**
- Son la fuente de verdad técnica
- Se actualizan solo si cambia la especificación

### Principio de DRY
❌ **Incorrecto:** Copiar información entre archivos
✅ **Correcto:** Hacer link al archivo fuente

---

## 🚀 Próximos Pasos

### Si estás empezando:
1. Lee [`README.md`](README.md)
2. Instala pre-requisitos (Python 3.13, Node 22, PostgreSQL 16)
3. Sigue [`docs/fases/fase-0-setup.md`](docs/fases/fase-0-setup.md)

### Si estás desarrollando:
1. Revisa [`ESTADO.md`](ESTADO.md)
2. Lee la spec de la feature en [`docs/features/`](docs/features/)
3. Implementa según [`docs/standards/`](docs/standards/)
4. Actualiza [`ESTADO.md`](ESTADO.md) al terminar

### Si eres IA:
1. Lee [`.claude/context.md`](.claude/context.md)
2. Lee [`ESTADO.md`](ESTADO.md)
3. Consulta [`docs/NAVIGATION.md`](docs/NAVIGATION.md)
4. Ve a la spec específica según la tarea

---

## 💡 Filosofía del Proyecto

### Simplicidad
> "Código que se explica a sí mismo"

### Progresividad
> "Feature por feature, validando antes de avanzar"

### Mantenibilidad
> "El código debe ser fácil de entender para el siguiente desarrollador (que podrías ser tú en 6 meses)"

### Fuente Única
> "Cada información existe en UN solo lugar"

---

## 📞 ¿Dudas?

- **Documentación técnica:** [`docs/NAVIGATION.md`](docs/NAVIGATION.md)
- **Estado actual:** [`ESTADO.md`](ESTADO.md)
- **Issues/Bugs:** GitHub Issues

---

**Última actualización:** 2025-11-17
**Mantenido por:** Edilberto
