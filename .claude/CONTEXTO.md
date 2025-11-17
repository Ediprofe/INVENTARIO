# CONTEXTO PARA NUEVA SESIÓN CLAUDE

---

## 🎯 PROYECTO

**Nombre:** Sistema de Inventario Escolar  
**Stack:** Django 5.2 + Next.js 16 + PostgreSQL 16  
**Propósito:** Gestión de inventario físico escolar con más de 7,000 ítems existentes

---

## 📍 DONDE ESTAMOS

**Última actualización:** 2025-11-17  
**Fase actual:** 0 - Preparación completada  
**Sesiones completadas:** 2+

**Estado:**
- ✅ Documentación completa y reorganizada
- ✅ Metodología de trabajo definida
- ✅ Estructura de archivos optimizada
- ⏳ Listo para comenzar implementación (Fase 0)

---

## ✅ QUE FUNCIONA

- Repositorio Git inicializado
- Documentación técnica reorganizada en 6 archivos coherentes
- Guía rápida consolidada (docs/GUIA-RAPIDA.md)
- Archivos de contexto actualizados
- Estructura de carpetas definida

---

## 💡 DECISIONES IMPORTANTES

**#1: Stack definitivo (NO NEGOCIABLE)**
- Backend: Django 5.2 + DRF 3.16.1 + PostgreSQL 16.6
- Frontend: Next.js 16 + React 19 + TypeScript 5.7
- UI: Tailwind CSS 3.4.17 + shadcn/ui (desde MVP)
- Estado: Zustand 5.0.3
- Testing: pytest + Jest + React Testing Library

**#2: Metodología simplificada**
- Claude actualiza documentación automáticamente
- Edilberto copia/pega y valida
- Validación en cada tarea antes de avanzar

**#3: Estructura de documentación definitiva**
- `docs/specs/` → Documentación técnica detallada (6 archivos)
- `docs/GUIA-RAPIDA.md` → Referencia rápida (~650 líneas)
- `docs/ESTADO.md` → Estado actual (actualizado cada tarea)
- `docs/CHANGELOG.md` → Histórico de cambios (actualizado cada sesión)
- `.claude/CONTEXTO.md` → Para nuevas sesiones (este archivo)

---

## 📁 ARCHIVOS CRÍTICOS PARA LEER

**Para contexto general del proyecto (SIEMPRE LEER PRIMERO):**
1. `docs/specs/00-VISION-PROYECTO.md` ⭐ **NUEVO** - Explicación en lenguaje natural
2. `docs/ESTADO.md` - Estado actual y próxima tarea
3. `.claude/CONTEXTO.md` - Este archivo

**Para referencia rápida:**
4. `docs/GUIA-RAPIDA.md` - Esenciales del proyecto en ~650 líneas

**Para detalles técnicos (leer según necesidad):**
- `docs/specs/01-MODELO-DATOS.md` - Base de datos completa con validaciones
- `docs/specs/02-FEATURES.md` - Especificación funcional (RF-001 a RF-008)
- `docs/specs/03-ESTANDARES.md` - Convenciones de código y límites
- `docs/specs/04-FASE-0-SETUP.md` - Setup inicial paso a paso
- `docs/specs/05-FASES-1-7.md` - Plan de implementación completo

---

## 🚀 COMO CONTINUAR EN NUEVA SESIÓN

**Prompt estándar para retomar:**"Claude, continuamos con el Sistema de Inventario Escolar.Por favor lee en este orden:

docs/specs/00-VISION-PROYECTO.md (contexto general)
docs/ESTADO.md (dónde estamos ahora)
.claude/CONTEXTO.md (este archivo)
[Luego indica qué necesitas hacer]"

**Ejemplo concreto:**"Claude, lee los archivos de contexto (00-VISION, ESTADO, CONTEXTO).Necesito implementar la Tarea 0.1: crear estructura de carpetas del backend.
Ver detalles en docs/specs/04-FASE-0-SETUP.md"

---

## 📊 ESTADO DE FASES

| Fase | Estado | % |
|------|--------|---|
| Fase 0: Setup Entorno | 🔄 Por iniciar | 0% |
| Fase 1: Modelos + Auth | ⏸️ Pendiente | 0% |
| Fase 2: API + Serializers | ⏸️ Pendiente | 0% |
| Fase 3: Frontend MVP | ⏸️ Pendiente | 0% |
| Fase 4: Import/Export Excel | ⏸️ Pendiente | 0% |
| Fase 5: Edición Masiva ⭐ | ⏸️ Pendiente | 0% |
| Fase 6: Testing + Polish | ⏸️ Pendiente | 0% |
| Fase 7: Docker + Deploy | ⏸️ Pendiente | 0% |

---

## ⏭️ PRÓXIMA TAREA

**Fase 0 - Tarea 0.1:** Crear estructura de directorios backend  
**Ver detalles en:** `docs/specs/04-FASE-0-SETUP.md` - Sección "Tarea 0.1"

---

## 📝 NOTAS IMPORTANTES PARA CLAUDE

**Al retomar trabajo:**
1. ✅ **SIEMPRE** leer primero: 00-VISION-PROYECTO.md, ESTADO.md, CONTEXTO.md
2. ✅ Verificar última tarea completada en ESTADO.md
3. ✅ Continuar desde donde Edilberto se quedó
4. ✅ Actualizar ESTADO.md después de CADA tarea
5. ✅ Actualizar CHANGELOG.md al finalizar CADA sesión

**Al finalizar cualquier sesión:**
1. Generar resumen ejecutivo de la sesión
2. Actualizar ESTADO.md con progreso real
3. Agregar entrada en CHANGELOG.md con fecha
4. Confirmar con Edilberto antes de terminar

**Reglas de oro:**
- 🚫 NO cambiar el stack tecnológico (es definitivo)
- 🚫 NO exceder 300 líneas por archivo de código
- 🚫 NO commitear sin actualizar docs/ESTADO.md
- ✅ SIEMPRE validar con comandos antes de declarar "completado"
- ✅ SIEMPRE seguir los estándares de docs/specs/03-ESTANDARES.md

---

## 🎯 FEATURES CRÍTICAS DEL PROYECTO

**Prioridad MÁXIMA:**
1. ⭐ **Edición Masiva (Batch Edit)** - Modal tipo Excel para editar múltiples ítems
2. 🔴 **Importación Excel** - Con auto-creación de artículos
3. 🔴 **CRUD de Ítems** - Con validaciones dobles (cliente + servidor)
4. 🔴 **Autenticación JWT** - Para trazabilidad

**Características distintivas:**
- Auto-creación de artículos durante importación (get_or_create)
- Historial automático de todos los movimientos (vía signals)
- Validación doble (frontend + backend)
- Transacciones atómicas en operaciones batch
- Optimización para +7,000 ítems existentes

---

## ⚠️ ADVERTENCIAS CRÍTICAS

**Rabbit Code Reviewer:**
- ✅ Configurado en `.coderabbit.yaml` (raíz del proyecto)
- ✅ Revisa automáticamente cada Pull Request
- ✅ Sigue las reglas del proyecto (300 líneas máx, etc.)
- 🚫 NO necesita archivo en `.ai/` ni `.claude/`

**shadcn/ui:**
- ✅ Se instala desde Fase 0
- 🚫 NO cambiar después (componentes ya instalados)
- ✅ Usar solo componentes de `components/ui/`

**PostgreSQL:**
- ✅ Desde desarrollo (NO SQLite)
- ✅ Configurado en Fase 0
- ⚠️ Índices importantes para performance con +7,000 items

---

## 📚 REFERENCIAS RÁPIDAS

**Comandos Git frecuentes:**
```bashgit status
git add .
git commit -m "feat(fase-X): descripción breve"
git push origin main

**Comandos backend frecuentes:**
```bashcd backend
source venv/bin/activate  # macOS/Linux
python manage.py check
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
pytest

**Comandos frontend frecuentes:**
```bashcd frontend
npm run dev
npm run build
npm run lint
npm run type-check

---

**Última actualización:** 2025-11-17  
**Mantenido por:** Edilberto + Claude  
**Versión:** 2.0