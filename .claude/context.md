# CONTEXTO PARA CLAUDE

**Sistema de Inventario Escolar**

---

## 🎯 PROYECTO

Django 5.2 + Next.js 16 + PostgreSQL 16
Gestión de 7,000+ ítems con importación Excel y edición masiva.

---

## 📍 ESTADO ACTUAL

**Fase 0 - Setup (0%)**

Ver: [`../ESTADO.md`](../ESTADO.md)

---

## 📚 DOCUMENTACIÓN

**Mapa único:** [`../docs/NAVIGATION.md`](../docs/NAVIGATION.md) 📍

### Archivos Clave (Fuente Única)
- **Stack:** [`docs/vision/stack.md`](../docs/vision/stack.md) ⭐
- **Modelo:** [`docs/modelo/entidades.md`](../docs/modelo/entidades.md)
- **Batch Edit:** [`docs/features/batch-edit.md`](../docs/features/batch-edit.md) ⭐
- **Setup:** [`docs/fases/fase-0-setup.md`](../docs/fases/fase-0-setup.md)
- **Estándares:** [`docs/standards/codigo.md`](../docs/standards/codigo.md)

---

## ⚠️ REGLAS CRÍTICAS

### Stack (NO NEGOCIABLE)
- Backend: Django 5.2 + DRF + PostgreSQL 16.6
- Frontend: Next.js 16 + React 19 + TypeScript 5.7
- UI: Tailwind CSS + shadcn/ui

Ver versiones exactas: [`docs/vision/stack.md`](../docs/vision/stack.md)

### Límites
- Máx 300 líneas/archivo
- Coverage mín 85%
- Validación doble (cliente + servidor)

### Features Prioritarias
1. ⭐ Edición Masiva (batch edit)
2. Importación Excel (auto-crear artículos)
3. CRUD Ítems

---

## 🚀 PROMPT PARA RETOMAR

```
Claude, lee:
1. ESTADO.md - Progreso actual
2. docs/NAVIGATION.md - Mapa de docs
3. [Archivo específico según tarea]

Tarea: [describir]
```

---

## 📝 PRINCIPIO

**Fuente Única de Verdad**

Cada información existe en UN solo lugar:
- Versiones → `docs/vision/stack.md`
- Modelo → `docs/modelo/entidades.md`
- Feature X → `docs/features/X.md`

**No duplicar. Hacer links.**

---

**Actualizado:** 2025-11-17
