# 🎯 GUÍA PERSONAL DE COMUNICACIÓN CON IA - OPTIMIZADA

**Sistema de Inventario Escolar**  
**Versión:** 3.0 Mejorada  
**Uso:** Guía de referencia rápida para Edilberto

---

## 🚀 INICIO RÁPIDO (LO MÁS IMPORTANTE)

### ✅ Checklist previo (verificar UNA SOLA VEZ al inicio del proyecto)

- [ ] `.ai/agent-config.yaml` existe en raíz
- [ ] `.coderabbit.yaml` existe en raíz
- [ ] `docs/specs/06-PERMISOS.md` existe
- [ ] Proyecto subido a GitHub
- [ ] Rabbit instalado en el repo

---

## 📝 PROMPTS LISTOS PARA COPIAR/PEGAR

### 1️⃣ PROMPT: Iniciar nueva sesión

```markdown
# INICIO DE SESIÓN: Sistema de Inventario Escolar

Hola, voy a trabajar en el Sistema de Inventario Escolar.

## Lee primero (en orden):

1. `.ai/agent-config.yaml` - Configuración del proyecto
2. `docs/ESTADO.md` - ¿Dónde estamos?
3. `docs/GUIA-RAPIDA.md` - Referencia técnica
4. `docs/specs/04-FASE-0-SETUP.md` - Fase 0 (o el archivo de la fase actual)

## Confirmación antes de empezar

Dime:
1. ¿Qué dice ESTADO.md sobre la tarea actual?
2. ¿Qué archivos dice que ya funcionan?
3. ¿Cuál es la próxima tarea a implementar?

Esperaré tu resumen antes de continuar.
```

**💡 Cuándo usar:** Al abrir Cursor/Windsurf por primera vez en el día

---

### 2️⃣ PROMPT: Implementar una tarea específica

```markdown
# IMPLEMENTAR TAREA [X.Y]

Lee y ejecuta según `docs/specs/[ARCHIVO-FASE].md` - Tarea [X.Y]

## PASO 1: Confirmar entendimiento

Antes de codificar, confírmame:
1. ¿Qué archivos vas a crear/modificar?
2. ¿Qué validaciones ejecutarás después?
3. ¿Entiendes que debes actualizar docs/ESTADO.md y docs/CHANGELOG.md?

## PASO 2: Implementar

[El agente implementa después de tu confirmación]

## PASO 3: Validar automáticamente

Ejecuta según `.ai/agent-config.yaml`:
- Backend: `python manage.py check` + `pytest`
- Frontend: `npm run lint` + `tsc --noEmit`

## PASO 4: Actualizar documentación (AUTOMÁTICO)

**docs/ESTADO.md:**
- Cambiar "Tarea actual" de [X.Y] a [X.Y+1]
- Agregar en "✅ FUNCIONA" lo completado
- Actualizar "Último commit" con hash real

**docs/CHANGELOG.md:**
- Nueva entrada con fecha de HOY
- Listar archivos creados/modificados
- Breve descripción de cambios

## PASO 5: Generar commit (UN SOLO COMMIT CON TODO)

Formato según `.ai/agent-config.yaml`:

```bash
feat(fase-[X]): [descripción corta máx 50 chars]

- Cambio específico 1
- Cambio específico 2  
- docs: ESTADO.md y CHANGELOG.md actualizados

Fase: [X]
Tarea: [X.Y]
```

## PASO 6: Notificarme

Dime:
- ✅ "Tarea [X.Y] completada"
- Hash del commit
- Próxima tarea es: [X.Y+1]
```

**💡 Cuándo usar:** Para CADA tarea que implementes

**⚠️ IMPORTANTE:** El agente debe hacer TODO (código + docs + commit) en una sola ejecución.

---

### 3️⃣ PROMPT: Crear Pull Request (después de commit local)

```markdown
# CREAR PULL REQUEST PARA TAREA [X.Y]

Acabo de completar la Tarea [X.Y] localmente.

## Pasos a seguir:

1. Crear rama: `git checkout -b feature/tarea-[X.Y]`
2. Los cambios ya están commiteados (del paso anterior)
3. Push: `git push origin feature/tarea-[X.Y]`

Confírmame que entiendes que ahora debo:
- Ir a GitHub
- Crear Pull Request desde la rama feature/tarea-[X.Y] hacia main
- Esperar revisión de Rabbit
- Aplicar sugerencias si hay
- Mergear cuando esté aprobado
```

**💡 Cuándo usar:** Después de implementar una tarea, antes de ir a GitHub

**🎯 Resultado:** Tú vas a GitHub manualmente, creas el PR, y Rabbit lo revisa automáticamente

---

### 4️⃣ PROMPT: Si el agente se perdió/confundió

```markdown
# REINICIO DE CONTEXTO

El contexto se perdió. Por favor:

1. Lee `docs/ESTADO.md` completo
2. Lee `.ai/agent-config.yaml`
3. Dime:
   - ¿En qué fase estamos?
   - ¿Cuál es la tarea actual?
   - ¿Qué archivos ya existen y funcionan?
   - ¿Cuál es la próxima tarea?

NO hagas nada más hasta que yo confirme que entendiste bien.
```

**💡 Cuándo usar:** Cuando el agente parece confundido o hace cosas raras

---

### 5️⃣ PROMPT: Aplicar sugerencias de Rabbit

```markdown
# APLICAR SUGERENCIAS DE RABBIT

Rabbit revisó el PR y dejó comentarios.

## Sugerencias a aplicar:

[Copia/pega los comentarios específicos de Rabbit]

## Instrucciones:

1. Lee cada sugerencia
2. Aplica SOLO las que tienen sentido
3. Explícame brevemente por qué aplicaste o ignoraste cada una
4. Actualiza el código
5. Genera commit con mensaje: `fix: aplicar sugerencias de Rabbit`
6. NO actualices docs/ (ya se hizo en el commit anterior)

¿Procedo?
```

**💡 Cuándo usar:** Cuando Rabbit dejó comentarios en tu PR

---

## 🔄 FLUJO VISUAL COMPLETO (Tu día a día)

```
┌─────────────────────────────────────────────┐
│ LUNES 9:00 AM - Abres Cursor               │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │ Usas PROMPT 1       │  (Inicio de sesión)
         │ Agente lee contexto │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │ Usas PROMPT 2       │  (Implementar Tarea 0.1)
         │ Agente codifica     │
         │ Agente valida       │
         │ Agente actualiza    │
         │ docs/ESTADO.md      │
         │ Agente hace commit  │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │ TÚ: git push        │  (10 segundos)
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │ TÚ: Vas a GitHub    │  (1 minuto)
         │ Creas PR manual     │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │ RABBIT revisa       │  (Automático, 30s)
         │ Deja comentarios    │
         └──────────┬──────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
         ▼                     ▼
    ┌─────────┐          ┌─────────┐
    │ Todo OK │          │ Hay     │
    │         │          │ cambios │
    └────┬────┘          └────┬────┘
         │                    │
         │                    ▼
         │          ┌──────────────────┐
         │          │ Usas PROMPT 5    │
         │          │ Aplicas cambios  │
         │          │ Commit: fix      │
         │          │ Push             │
         │          │ Rabbit revisa    │
         │          │ de nuevo         │
         │          └────┬─────────────┘
         │               │
         └───────┬───────┘
                 │
                 ▼
         ┌─────────────────────┐
         │ TÚ: Merge PR        │  (1 click)
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │ TÚ: Prueba feature  │  (Manual)
         └──────────┬──────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
         ▼                     ▼
    ┌─────────┐          ┌─────────┐
    │ ✅ OK   │          │ ❌ Bug  │
    └────┬────┘          └────┬────┘
         │                    │
         │                    ▼
         │          ┌──────────────────┐
         │          │ Creas issue      │
         │          │ "Bug en X"       │
         │          │ Vuelves a        │
         │          │ PROMPT 2         │
         │          └──────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Siguiente tarea: Usas PROMPT 2│
│ con Tarea 0.2                  │
└────────────────────────────────┘
```

---

## 📊 LO QUE SE ACTUALIZA EN CADA PASO

### ❌ NUNCA se actualiza automáticamente:
- `.ai/agent-config.yaml` (solo tú manualmente al cambiar fase)
- `.coderabbit.yaml` (solo si cambias reglas de revisión)

### ✅ SIEMPRE se actualiza en cada tarea:
- `docs/ESTADO.md` (el agente lo hace automático)
- `docs/CHANGELOG.md` (el agente lo hace automático)

### 🔄 Se actualiza solo al cambiar de fase:
- `.ai/agent-config.yaml` → campo `phase_current: 0` cambias a `1`

---

## ⏱️ TIEMPOS ESTIMADOS POR TAREA

| Actividad | Tiempo | Quién |
|-----------|--------|-------|
| Prompt inicial (sesión nueva) | 30s | Tú |
| Agente lee contexto | 10s | Agente |
| Prompt implementar tarea | 20s | Tú |
| Agente codifica + valida | 5-15 min | Agente |
| Agente actualiza docs | Incluido | Agente |
| Agente genera commit | Incluido | Agente |
| Tú haces git push | 10s | Tú |
| Tú creas PR en GitHub | 1 min | Tú |
| Rabbit revisa | 30-60s | Rabbit |
| Aplicar sugerencias (si hay) | 5-10 min | Agente |
| Tú mergeas PR | 10s | Tú |
| Tú pruebas feature | 5-10 min | Tú |

**⏱️ TOTAL POR TAREA:** 15-30 minutos (tu tiempo activo: ~8 minutos)

---

## ❓ PREGUNTAS FRECUENTES (FAQ)

### ¿Cuándo actualizo `.ai/agent-config.yaml`?

**SOLO cuando:**
- ✅ Cambias de fase (ej: Fase 0 → Fase 1): Actualizar `phase_current: 1`
- ✅ Cambias tecnología del stack (RARO)
- ✅ Cambias estándares de código (ej: límite de 300 → 500 líneas)

**NUNCA en cada tarea.**

---

### ¿Qué archivos actualiza el agente automáticamente?

Solo 2:
1. `docs/ESTADO.md`
2. `docs/CHANGELOG.md`

**Importante:** El agente los actualiza en el MISMO commit del código.

---

### ¿Cómo sé que el agente terminó correctamente?

El agente debe decirte:

```
✅ Tarea [X.Y] completada

Resumen:
- Archivos creados: [lista]
- Validaciones: Todas pasaron ✅
- docs/ESTADO.md: Actualizado ✅
- docs/CHANGELOG.md: Actualizado ✅
- Commit: abc1234

Próxima tarea: [X.Y+1] - [Nombre]
```

Si falta algo de esto, usa **PROMPT 4** (reiniciar contexto).

---

### ¿Cuándo creo una rama nueva?

**UNA rama = UNA tarea**

```bash
# Tarea 0.1
git checkout -b feature/tarea-0.1
[...trabajo...]
git push origin feature/tarea-0.1

# PR → Merge → Borrar rama

# Tarea 0.2 (NUEVA rama)
git checkout main
git pull
git checkout -b feature/tarea-0.2
[...trabajo...]
```

**Regla de oro:** Siempre desde `main` actualizado.

---

### ¿Qué hago si Rabbit pide muchos cambios?

**Opción A:** Aplicarlos (si tienen sentido)
- Usa **PROMPT 5**
- El agente los aplica
- Commit: `fix: aplicar sugerencias Rabbit`
- Push
- Rabbit revisa de nuevo

**Opción B:** Ignorar algunos
- Comenta en el PR por qué ignoras esa sugerencia
- Mergea de todos modos

**Opción C:** Todo está mal
- Cierra el PR
- Borra la rama
- Empieza de nuevo con mejor prompt

---

### ¿Y si el agente NO actualiza los docs?

Dile esto:

```markdown
ALTO. No actualizaste docs/ESTADO.md ni docs/CHANGELOG.md.

Por favor:
1. Actualiza docs/ESTADO.md ahora
2. Actualiza docs/CHANGELOG.md ahora
3. Haz `git add docs/`
4. Haz `git commit --amend --no-edit`

Así queda todo en UN solo commit.
```

---

## 🎯 RESUMEN ULTRA-COMPACTO

```
┌─────────────────────────────────────────┐
│ TU TRABAJO DIARIO:                      │
├─────────────────────────────────────────┤
│ 1. Abres Cursor → PROMPT 1              │
│ 2. Por cada tarea → PROMPT 2            │
│ 3. git push (10s)                       │
│ 4. GitHub: crear PR (1 min)             │
│ 5. Rabbit revisa (esperas 1 min)        │
│ 6. Si hay cambios → PROMPT 5            │
│ 7. Mergeas PR (10s)                     │
│ 8. Pruebas feature (5-10 min)           │
│ 9. Si OK → siguiente tarea              │
│                                          │
│ REPETIR hasta terminar fase             │
└─────────────────────────────────────────┘
```

**⏱️ Tu tiempo activo por tarea: ~8 minutos**  
**⏱️ Tiempo total (con esperas): ~20-30 minutos**

---

## 🔧 COMANDOS GIT ÚTILES

```bash
# Ver estado
git status

# Ver qué rama estás
git branch

# Cambiar a main
git checkout main

# Actualizar main
git pull origin main

# Crear rama nueva
git checkout -b feature/tarea-X.Y

# Ver cambios antes de commit
git diff

# Ver log de commits
git log --oneline -5

# Borrar rama local (después de merge)
git branch -d feature/tarea-X.Y

# Forzar borrado (si no mergeaste)
git branch -D feature/tarea-X.Y

# Ver ramas remotas
git branch -r

# Limpiar ramas remotas borradas
git fetch --prune
```

---

## 🎓 TIPS PRO

### 💡 Tip 1: Guarda los prompts en un archivo

Crea `.ai/prompts-rapidos.md` con los 5 prompts listos.

Cuando necesites uno: copia/pega directo.

---

### 💡 Tip 2: Si vas a estar varios días sin trabajar

Antes de retomar, usa **PROMPT 1** SIEMPRE.

El agente necesita refrescar contexto.

---

### 💡 Tip 3: Commits descriptivos ayudan

Malo:
```
feat(fase-0): cambios
```

Bueno:
```
feat(fase-0): estructura backend con apps core, auth, inventario

- backend/apps/core/ creado
- backend/apps/authentication/ creado
- backend/apps/inventario/ creado
- __init__.py en cada app
- docs actualizados

Fase: 0
Tarea: 0.1
```

---

### 💡 Tip 4: No mergees PRs a las 11 PM

Mergea cuando tengas tiempo de probar la feature.

Si rompe algo, tendrás energía para arreglarlo.

---

### 💡 Tip 5: Rabbit aprende de tus decisiones

Si ignoras una sugerencia y comentas por qué, Rabbit lo recordará para el próximo PR.

---

## ✅ CHECKLIST ANTES DE CERRAR CURSOR

Antes de cerrar Cursor cada día, verifica:

- [ ] Último commit tiene código + docs actualizados
- [ ] Has hecho `git push`
- [ ] Si creaste PR, ya lo mergeaste (o lo dejaste para mañana con razón)
- [ ] `docs/ESTADO.md` refleja correctamente dónde quedaste
- [ ] No hay cambios sin commitear (`git status` limpio)

---

**🎉 ¡Listo! Con esta guía tienes todo lo que necesitas.**

**Guárdala como `.ai/GUIA-PERSONAL.md` y consúltala cuando tengas dudas.**