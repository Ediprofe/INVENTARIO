# 🚀 START HERE - Punto de Entrada para Agentes AI

**Sistema de Inventario Escolar**  
**Última actualización:** 2025-11-17

---

## 👋 BIENVENIDO, AGENTE

Este es el **punto de entrada único** para cualquier agente de IA (Cursor, Windsurf, Claude, etc.) que trabaje en este proyecto.

**Tu misión:** Implementar tareas del Sistema de Inventario Escolar siguiendo estándares estrictos y actualizando documentación automáticamente.

---

## 📖 PASO 1: LEE ESTOS ARCHIVOS (EN ORDEN)

### ⭐ OBLIGATORIO - Lee SIEMPRE antes de comenzar:
docs/ESTADO.md
└─ ¿En qué fase estamos? ¿Cuál es la próxima tarea?

.ai/agent-config.yaml
└─ Configuración del proyecto (stack, estándares, comandos)

docs/GUIA-RAPIDA.md
└─ Referencia técnica rápida (~650 líneas)


### 📚 OPCIONAL - Lee según necesidad:
docs/specs/00-VISION-PROYECTO.md
└─ Solo si necesitas entender el contexto general

docs/specs/04-FASE-0-SETUP.md (si estás en Fase 0)
└─ O el archivo de la fase actual (01, 02, 03, etc.)

docs/specs/01-MODELO-DATOS.md
└─ Solo si necesitas detalles del modelo de base de datos

docs/specs/02-FEATURES.md
└─ Solo si necesitas especificación funcional detallada

docs/specs/03-ESTANDARES.md
└─ Solo si tienes dudas sobre convenciones de código


---

## ⚙️ PASO 2: CONFIRMA QUE ENTENDISTE

**Antes de escribir código, confirma con Edilberto:**
```markdownHe leído la documentación. Voy a implementar:📋 Tarea: [X.Y] - [Nombre de la tarea]
📂 Archivos a crear/modificar:

archivo1.py
archivo2.tsx
✅ Validaciones que ejecutaré:

python manage.py check
pytest
📝 Archivos que actualizaré al terminar:

docs/ESTADO.md
docs/CHANGELOG.md
¿Procedo?

**Espera confirmación de Edilberto antes de continuar.**

---

## 💻 PASO 3: IMPLEMENTA LA TAREA

### Reglas NO NEGOCIABLES:

#### 🚫 PROHIBIDO:
- ❌ Archivos > 300 líneas
- ❌ Funciones > 50 líneas
- ❌ Cambiar el stack tecnológico
- ❌ Usar localStorage en artifacts React
- ❌ Commitear sin actualizar docs/

#### ✅ OBLIGATORIO:
- ✅ Docstrings en Python (todas las clases y funciones)
- ✅ Type hints en Python
- ✅ TypeScript strict mode
- ✅ Validación doble (cliente + servidor)
- ✅ Tests con coverage > 85%
- ✅ Conventional Commits

---

## ✔️ PASO 4: VALIDA TU CÓDIGO

Ejecuta **TODOS** estos comandos antes de commitear:

### Backend:
```bashcd backend
python manage.py check           # Debe pasar sin errores
pytest --cov=apps                # Coverage > 85%
black --check .                  # Formato correcto
flake8 apps/                     # Sin errores de linting

### Frontend:
```bashcd frontend
npm run lint                     # Debe pasar
tsc --noEmit                     # Sin errores de tipos
npm run test -- --passWithNoTests # Tests pasan

**Si algo falla, corrige ANTES de continuar.**

---

## 📝 PASO 5: ACTUALIZA DOCUMENTACIÓN (AUTOMÁTICO)

**CRÍTICO:** Debes actualizar estos 2 archivos en el **MISMO commit** del código:

### 5.1 Actualizar `docs/ESTADO.md`

Busca la sección **"## 📍 AHORA MISMO"** y actualiza:
```markdownTarea actual: [X.Y+1] - [Nombre de la SIGUIENTE tarea]
Último commit: [hash del commit que acabas de hacer]

Busca la sección **"## ✅ FUNCIONA"** y agrega:
```markdown
✅ [Tarea X.Y]: [Descripción breve de lo completado]


### 5.2 Actualizar `docs/CHANGELOG.md`

Agrega una nueva entrada:
```markdown2025-11-17 (Sesión #X)✅ CompletadoTarea X.Y: [Nombre]

Archivo creado: ruta/archivo1.py
Archivo creado: ruta/archivo2.tsx
Validaciones: Todas pasaron ✅
Tests: Coverage 87% ✅
📊 Métricas
Commits: 1
Tests: +12 tests
Coverage: 87%


---

## 🔀 PASO 6: GENERA COMMIT

Usa **EXACTAMENTE** este formato (Conventional Commits):
```bashgit add .
git commit -m "feat(fase-X): descripción corta máximo 50 caracteres
Cambio específico 1
Cambio específico 2
Cambio específico 3
docs: ESTADO.md y CHANGELOG.md actualizados
Fase: X
Tarea: X.Y"

**Tipos de commit permitidos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Solo documentación
- `refactor`: Refactorización (sin cambio funcional)
- `test`: Agregar tests
- `chore`: Mantenimiento (deps, config)

---

## 🎯 PASO 7: NOTIFICA COMPLETADO

Informa a Edilberto:
```markdown✅ Tarea X.Y completada📂 Archivos creados/modificados:

ruta/archivo1.py (150 líneas)
ruta/archivo2.tsx (89 líneas)
✅ Validaciones:

python manage.py check → ✅ Pasó
pytest --cov=apps → ✅ 87% coverage
npm run lint → ✅ Pasó
tsc --noEmit → ✅ Sin errores
📝 Documentación:

docs/ESTADO.md → ✅ Actualizado
docs/CHANGELOG.md → ✅ Actualizado
📌 Commit: abc1234⏭️ Próxima tarea: X.Y+1 - [Nombre de la siguiente tarea]

---

## 🔄 WORKFLOW VISUAL┌─────────────────────────────────────────┐
│ 1. Leer docs/ESTADO.md                  │
│ 2. Leer .ai/agent-config.yaml           │
│ 3. Leer docs/GUIA-RAPIDA.md             │
└──────────────────┬──────────────────────┘
│
▼
┌─────────────────────────────────────────┐
│ 4. Confirmar tarea con Edilberto        │
│    (esperar "OK, adelante")             │
└──────────────────┬──────────────────────┘
│
▼
┌─────────────────────────────────────────┐
│ 5. Implementar código                   │
│    (respetando límites y estándares)    │
└──────────────────┬──────────────────────┘
│
▼
┌─────────────────────────────────────────┐
│ 6. Ejecutar validaciones                │
│    (python manage.py check, pytest, etc)│
└──────────────────┬──────────────────────┘
│
┌────────┴────────┐
│                 │
▼                 ▼
┌─────────┐       ┌─────────┐
│ ✅ Pasa │       │ ❌ Falla│
└────┬────┘       └────┬────┘
│                 │
│                 ▼
│      ┌──────────────────┐
│      │ Corregir errores │
│      └────┬─────────────┘
│           │
└───────────┘
│
▼
┌─────────────────────────────────────────┐
│ 7. Actualizar docs/ESTADO.md            │
│ 8. Actualizar docs/CHANGELOG.md         │
└──────────────────┬──────────────────────┘
│
▼
┌─────────────────────────────────────────┐
│ 9. Commit (código + docs juntos)        │
└──────────────────┬──────────────────────┘
│
▼
┌─────────────────────────────────────────┐
│ 10. Notificar a Edilberto               │
└─────────────────────────────────────────┘

---

## 🆘 SI ALGO SALE MAL

### Problema: No entiendo la tarea
**Solución:** Lee `docs/specs/04-FASE-0-SETUP.md` (o el archivo de tu fase actual)

### Problema: Validaciones fallan
**Solución:** NO commitees. Corrige los errores primero.

### Problema: No sé qué actualizar en ESTADO.md
**Solución:** Lee el archivo `docs/ESTADO.md`, busca la sección "AHORA MISMO" y actualiza la tarea actual.

### Problema: Archivo excede 300 líneas
**Solución:** Divide en múltiples archivos. Ver `docs/specs/03-ESTANDARES.md`

### Problema: Test coverage < 85%
**Solución:** Agrega más tests antes de commitear.

---

## 📚 REFERENCIA RÁPIDA

### Stack Tecnológico (NO CAMBIAR):
- **Backend:** Django 5.2 + PostgreSQL 16.6 + DRF 3.16.1
- **Frontend:** Next.js 16 + React 19 + TypeScript 5.7
- **UI:** Tailwind CSS 3.4.17 + shadcn/ui
- **Estado:** Zustand 5.0.3

### Comandos Frecuentes:
```bashBackend
cd backend
source venv/bin/activate
python manage.py check
python manage.py migrate
pytestFrontend
cd frontend
npm run dev
npm run lint
npm run type-checkGit
git status
git add .
git commit -m "tipo(alcance): descripción"

---

## 🎓 RECURSOS ADICIONALES

- **Para Edilberto:** Lee `.ai/GUIA_EDILBERTO.md`
- **Para Claude:** Lee `.claude/CONTEXTO.md`
- **Para entender el proyecto:** Lee `docs/specs/00-VISION-PROYECTO.md`
- **Para detalles técnicos:** Lee `docs/specs/01-MODELO-DATOS.md` a `05-FASES-1-7.md`

---

## ✅ CHECKLIST ANTES DE CADA TAREA
```markdown
 Leí docs/ESTADO.md
 Leí .ai/agent-config.yaml
 Leí docs/GUIA-RAPIDA.md
 Confirmé la tarea con Edilberto
 Entiendo qué archivos crear/modificar
 Entiendo qué validaciones ejecutar
 Entiendo qué actualizar en docs/


---

## 🚨 RECORDATORIO FINAL

**TÚ NO ERES SOLO UN GENERADOR DE CÓDIGO.**

Eres responsable de:
1. ✅ Código de calidad (< 300 líneas/archivo)
2. ✅ Tests (> 85% coverage)
3. ✅ Documentación actualizada
4. ✅ Validaciones ejecutadas
5. ✅ Commit bien formateado

**Si falta algo de esto, la tarea NO está completa.**

---

**Documento creado:** 2025-11-17  
**Versión:** 1.0  
**Mantenido por:** Edilberto + Claude

---

🎯 **¿Listo para comenzar? Lee `docs/ESTADO.md` y empieza tu primera tarea.**