# CONTEXTO PARA CLAUDE

## 🎯 PROYECTO
Sistema de Inventario Escolar - Django 5.2 + Next.js 16 + PostgreSQL 16  
Gestión de +7,000 ítems físicos con importación Excel y edición masiva.

---

## 📍 ESTADO ACTUAL
- **Fase:** 0 - Setup (0%)
- **Próximo:** Crear estructura backend/frontend
- Ver: `PROYECTO.md` para detalles completos

---

## 📁 LEER PRIMERO (en orden)
1. `PROYECTO.md` - Estado actual y guía de archivos
2. `README.md` - Setup e intro técnica
3. `docs/vision/README.md` - Visión del proyecto
4. `.claude/CONTEXTO.md` - Este archivo

---

## 💡 DECISIONES CLAVE

### Stack (NO NEGOCIABLE)
Ver versiones exactas en: `docs/vision/stack.md` ⭐ **Fuente única de verdad**

Backend:  Django 5.2 + DRF + PostgreSQL 16.6
Frontend: Next.js 16 + React 19 + TypeScript 5.7
UI:       Tailwind CSS + shadcn/ui
Estado:   Zustand 5.0.3

### Metodología
- Claude/Cursor generan código
- Edilberto valida y ejecuta
- Validación en cada tarea
- Actualizar `PROYECTO.md` siempre

### Features Prioritarias
1. ⭐ Edición Masiva (Modal tipo Excel)
2. 🔴 Importación Excel (auto-crear artículos)
3. 🔴 CRUD Ítems (validación doble)
4. 🔴 Autenticación JWT

---

## ⚠️ REGLAS CRÍTICAS
1. NO cambiar stack
2. Máx 300 líneas/archivo
3. Coverage mín 85%
4. Validación doble (cliente + servidor)
5. Historial automático (signals)
6. Transacciones atómicas (batch/import)
7. get_or_create en importación
8. shadcn/ui desde MVP

---

## 🚀 PROMPT PARA RETOMAR Claude, lee en orden:

PROYECTO.md
.claude/CONTEXTO.md
docs/specs/00-VISION-PROYECTO.md
[Describir tarea específica]

---

## 📚 DOCUMENTACIÓN TÉCNICA (Estructura Modular)

### Por Tema
- **Visión:** `docs/vision/` - Objetivos, alcance, stack
  - `stack.md` ⭐ Fuente única para versiones
  - `objetivos.md` - Qué y por qué construimos
  - `alcance.md` - Qué incluye el MVP

- **Modelo:** `docs/modelo/README.md` → `docs/specs/01-MODELO-DATOS.md`

- **Features:** `docs/features/`
  - `batch-edit.md` ⭐ **Prioridad alta** - Edición masiva
  - Ver `docs/features/README.md` para lista completa

- **Estándares:** `docs/standards/README.md` → `docs/specs/03-ESTANDARES.md`

- **Fases:** `docs/fases/README.md`
  - Fase 0: `docs/specs/04-FASE-0-SETUP.md`
  - Fases 1-7: `docs/specs/05-FASES-1-7.md`

- **Permisos:** `docs/specs/06-PERMISOS.md` (Implementar en Fase 2)

---