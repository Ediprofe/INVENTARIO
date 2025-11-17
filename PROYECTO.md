# 📊 ESTADO DEL PROYECTO Y GUÍA DE ARCHIVOS

**Última actualización:** 2025-11-17  
**Fase actual:** 0 - Preparación

---

## 📍 DÓNDE ESTAMOS AHORA

### Fase Actual: Fase 0 - Setup del Entorno
**Progreso:** 0% ⏳

**Estado:**
- ✅ Repositorio Git inicializado
- ✅ Documentación reorganizada y consolidada
- ✅ Estructura de archivos optimizada
- ⏳ **PRÓXIMO:** Crear estructura de carpetas backend/frontend

---

## ⏳ EN PROGRESO

**Ninguna tarea actualmente en progreso.**

---

## 📋 PRÓXIMAS TAREAS

### Inmediato (Esta Sesión)
1. **Fase 0.1:** Crear estructura de directorios backend
2. **Fase 0.2:** Configurar entorno virtual Python + instalar dependencias
3. **Fase 0.3:** Configurar PostgreSQL local
4. **Fase 0.4:** Crear estructura de directorios frontend
5. **Fase 0.5:** Instalar Next.js + dependencias

**Ver detalles:** `docs/specs/04-FASE-0-SETUP.md`

### Corto Plazo (Próximas 2 Semanas)
- **Fase 1:** Modelos Django + Autenticación JWT (3-4 días)
- **Fase 2:** API REST + Serializers (3-4 días)
- **Fase 3:** Frontend MVP (5-6 días)

---

## 📊 PROGRESO POR FASES

| Fase | Nombre | Duración | Estado | % |
|------|--------|----------|--------|---|
| 0 | Setup Entorno | 1-2 días | 🔄 Iniciando | 0% |
| 1 | Modelos + Auth | 3-4 días | ⏸️ Pendiente | 0% |
| 2 | API + Serializers | 3-4 días | ⏸️ Pendiente | 0% |
| 3 | Frontend MVP | 5-6 días | ⏸️ Pendiente | 0% |
| 4 | Import/Export Excel | 3-4 días | ⏸️ Pendiente | 0% |
| 5 | Edición Masiva ⭐ | 3-4 días | ⏸️ Pendiente | 0% |
| 6 | Testing + Polish | 2-3 días | ⏸️ Pendiente | 0% |
| 7 | Docker + Deploy | 2-3 días | ⏸️ Pendiente | 0% |

**Total estimado:** 22-30 días de trabajo efectivo

---

---

## 📁 ARCHIVOS CLAVE

### Para Contexto Rápido
1. `README.md` - Setup e introducción
2. `PROYECTO.md` - Este archivo (estado actual y guía de archivos)

### Para Especificaciones Técnicas
4. `docs/specs/00-VISION-PROYECTO.md` - Visión general
5. `docs/specs/01-MODELO-DATOS.md` - Base de datos
6. `docs/specs/02-FEATURES.md` - Funcionalidades (RF-001 a RF-008)
7. `docs/specs/03-ESTANDARES.md` - Convenciones de código
8. `docs/specs/04-FASE-0-SETUP.md` - Guía de setup
9. `docs/specs/05-FASES-1-7.md` - Plan de implementación
10. `docs/specs/06-PERMISOS.md` - Sistema de permisos

### Para IA (Claude/Cursor)
11. `.claude/CONTEXTO.md` - Instrucciones para Claude
12. `.ai/agent-config.yaml` - Configuración Windsurf/Cursor

## 💡 DECISIONES IMPORTANTES

### #1: Stack Tecnológico (NO NEGOCIABLE)Backend:  Django 5.2 + DRF 3.16.1 + PostgreSQL 16.6
Frontend: Next.js 16 + React 19 + TypeScript 5.7
UI:       Tailwind CSS 3.4.17 + shadcn/ui
Estado:   Zustand 5.0.3
Testing:  pytest + Jest + React Testing Library

### #2: Metodología Simplificada
- Claude/Cursor generan código
- Edilberto valida y ejecuta
- Validación en cada tarea antes de avanzar
- Documentación se actualiza automáticamente

### #3: Features Prioritarias
1. ⭐ **Edición Masiva (Batch Edit)** - Modal tipo Excel
2. 🔴 **Importación Excel** - Con auto-creación de artículos
3. 🔴 **CRUD Ítems** - Con validaciones dobles
4. 🔴 **Autenticación JWT** - Para trazabilidad


---

## 🚀 PARA COMNICARSE CON CLAUDE O LA IA QUE ESTÉ SUPERVISANDO CONTIGO COMO LÍDER TÉNICO Y/O ASESOR:

Hola, para conocer el estado actual del proyecto visita, PROYECTO.md 

### Para obtener contexto general del proyecto, lee:

README.md (introducción)
PROYECTO.md (dónde estamos y guía de archivos)
.claude/CONTEXTO.md (contexto general)
docs/specs/00-VISION-PROYECTO.md (visión del proyecto)
Necesito [describir tarea específica].

### Para especificaciones técnicas específicas según la fase, lee:
.docs/sepcs

---

## ⚠️ NOTAS CRÍTICAS

1. **NO cambiar stack** - Decisión definitiva
2. **Límite 300 líneas** - Dividir archivos si se excede
3. **Tests obligatorios** - Coverage mínimo 85%
4. **Validación doble** - Cliente + servidor siempre
5. **Historial automático** - En cada modificación
6. **Transacciones atómicas** - En batch edit e import
7. **Auto-creación artículos** - get_or_create en importación
8. **shadcn/ui desde MVP** - NO cambiar después

---