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
3. `docs/specs/00-VISION-PROYECTO.md` - Contexto general
4. `.claude/CONTEXTO.md` - Este archivo

---

## 💡 DECISIONES CLAVE

### Stack (NO NEGOCIABLE)Backend:  Django 5.2 + DRF + PostgreSQL 16.6
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

## 📚 SPECS TÉCNICAS

Según necesidad:
- `01-MODELO-DATOS.md` - Base de datos
- `02-FEATURES.md` - RF-001 a RF-008
- `03-ESTANDARES.md` - Convenciones
- `04-FASE-0-SETUP.md` - Setup paso a paso
- `05-FASES-1-7.md` - Plan implementación
- `06-PERMISOS.md` - Sistema permisos

---