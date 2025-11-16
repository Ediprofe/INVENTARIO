# CONTEXTO PARA NUEVA SESION CLAUDE

---

## 🎯 PROYECTO

**Nombre:** Sistema de Inventario Escolar  
**Stack:** Django 5.2 + Next.js 16 + PostgreSQL 16  
**Propósito:** Gestión de inventario físico escolar

---

## 📍 DONDE ESTAMOS

**Última actualización:** 2025-11-16  
**Fase actual:** 0 - Preparación de Documentación  
**Sesiones completadas:** 1

**Estado:**
- ✅ Documentación completa y organizada
- ✅ Metodología de trabajo definida
- ✅ Listo para comenzar desarrollo

---

## ✅ QUE FUNCIONA

- Repositorio Git inicializado
- Estructura de documentación completa
- Guía rápida consolidada (docs/GUIA-RAPIDA.md)
- Archivos de contexto preparados

---

## 💡 DECISIONES IMPORTANTES

**#1: Stack definitivo (no negociable)**
- Backend: Django 5.2 + DRF 3.16.1 + PostgreSQL 16.6
- Frontend: Next.js 16 + React 19 + TypeScript 5.7
- UI: Tailwind CSS 3.4.17 + shadcn/ui
- Estado: Zustand 5.0.3

**#2: Metodología simplificada**
- Claude actualiza documentación
- Edilberto copia/pega lo que Claude genere
- Validación en cada tarea

**#3: Estructura de documentación**
- `docs/specs/` → Documentación detallada (inmutable)
- `docs/GUIA-RAPIDA.md` → Referencia rápida (~650 líneas)
- `docs/ESTADO.md` → Estado actual (actualizado cada tarea)
- `docs/CHANGELOG.md` → Histórico (actualizado cada sesión)
- `.claude/CONTEXTO.md` → Para nuevas sesiones (este archivo)

---

## 📁 ARCHIVOS CRITICOS

**Para lectura rápida:**
1. `docs/ESTADO.md` (estado actual del proyecto)
2. `.claude/CONTEXTO.md` (este archivo)
3. `docs/GUIA-RAPIDA.md` (referencia esencial)

**Para detalles técnicos:**
- `docs/specs/0. Requerimientos-DETALLADOS.md` (modelo de datos, features)
- `docs/specs/Metodologia.md` (Fase 0 paso a paso)
- `docs/specs/1. Estandares-codigo.md` (convenciones)
- `docs/specs/2. Fases.md` (plan completo)

---

## 🚀 COMO CONTINUAR

**Prompt para nueva sesión:**
```
"Claude, continuamos con el Sistema de Inventario Escolar.

Por favor lee:
1. docs/ESTADO.md
2. .claude/CONTEXTO.md
3. docs/GUIA-RAPIDA.md

[Luego indica qué necesitas hacer]"
```

**Ejemplo:**
```
"Claude, lee los archivos de contexto.
Necesito continuar con la Fase 0: crear estructura backend."
```

---

## 📊 ESTADO DE FASES

| Fase | Estado | % |
|------|--------|---|
| Fase 0: Preparación | 🔄 En progreso | 10% |
| Fase 1: Modelos + Auth | ⏸️ Pendiente | 0% |
| Fase 2: API | ⏸️ Pendiente | 0% |
| Fase 3: Frontend MVP | ⏸️ Pendiente | 0% |
| Fase 4: Import/Export | ⏸️ Pendiente | 0% |
| Fase 5: Batch Edit | ⏸️ Pendiente | 0% |
| Fase 6: Polish | ⏸️ Pendiente | 0% |
| Fase 7: Docker | ⏸️ Pendiente | 0% |

---

## ⏭️ PROXIMA TAREA

**Fase 0.1:** Crear estructura de carpetas backend  
**Ver:** `docs/specs/Metodologia.md` - Tarea 0.1

---

## 📝 NOTAS PARA CLAUDE

**Al retomar:**
1. Leer siempre estos 3 archivos primero
2. Verificar última tarea completada en ESTADO.md
3. Continuar desde donde se quedó
4. Actualizar ESTADO.md después de cada tarea

**Al finalizar sesión:**
1. Generar resumen de la sesión
2. Actualizar CHANGELOG.md
3. Actualizar este archivo (CONTEXTO.md)
4. Actualizar ESTADO.md

---

**Documento creado:** 2025-11-16  
**Última actualización:** 2025-11-16  
**Sesión:** #1