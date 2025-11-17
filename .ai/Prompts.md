# 📝 Prompts para Edilberto - Sistema de Inventario Escolar

**Versión:** 2.0  
**Última actualización:** 2025-11-17

---

## 🎯 USO

Estos son prompts **listos para copiar/pegar** en Cursor, Windsurf o Claude.

**Simplemente:**
1. Copia el prompt que necesites
2. Pégalo en el agente
3. Espera confirmación antes de que empiece

---

## 🚀 PROMPT 1: Iniciar Nueva Sesión
```markdownINICIO DE SESIÓN: Sistema de Inventario EscolarHola, voy a trabajar en el Sistema de Inventario Escolar.Lee primero (en orden):
.ai/agent-config.yaml - Configuración del proyecto
docs/ESTADO.md - ¿Dónde estamos?
docs/GUIA-RAPIDA.md - Referencia técnica
Confirmación antes de empezarDime:

¿Qué dice ESTADO.md sobre la tarea actual?
¿Qué archivos dice que ya funcionan?
¿Cuál es la próxima tarea a implementar?
Esperaré tu resumen antes de continuar.

**💡 Cuándo usar:** Primera vez que abres Cursor/Windsurf en el día

---

## 💻 PROMPT 2: Implementar Tarea
```markdownIMPLEMENTAR TAREA [X.Y]Lee y ejecuta según docs/specs/[ARCHIVO-FASE].md - Tarea [X.Y]PASO 1: ConfirmarAntes de codificar, confírmame:

¿Qué archivos vas a crear/modificar?
¿Qué validaciones ejecutarás?
¿Entiendes que debes actualizar docs/ESTADO.md y docs/CHANGELOG.md?
PASO 2: Implementar[El agente trabaja]PASO 3: ValidarEjecuta según .ai/agent-config.yaml:

Backend: python manage.py check + pytest
Frontend: npm run lint + tsc --noEmit
PASO 4: Actualizar docsdocs/ESTADO.md:

Cambiar "Tarea actual" a [X.Y+1]
Agregar en "✅ FUNCIONA" lo completado
docs/CHANGELOG.md:

Nueva entrada con fecha de HOY
PASO 5: CommitFormato según .ai/agent-config.yaml:
bashfeat(fase-X): descripción corta

- Cambio 1
- Cambio 2
- docs: actualizados

Fase: X
Tarea: X.YPASO 6: NotificarmeDime:

✅ "Tarea X.Y completada"
Hash del commit
Próxima tarea: X.Y+1


**💡 Cuándo usar:** Para CADA tarea que implementes

---

## 🔀 PROMPT 3: Crear Pull Request
```markdownPR PARA TAREA [X.Y]Tarea [X.Y] completada localmente.Pasos:

git checkout -b feature/tarea-[X.Y]
git push origin feature/tarea-[X.Y]
Ahora debo:

Ir a GitHub
Crear PR desde feature/tarea-[X.Y] → main
Esperar revisión de Rabbit
Aplicar sugerencias si hay
Mergear cuando esté aprobado


**💡 Cuándo usar:** Después de implementar, antes de GitHub

---

## 🔄 PROMPT 4: Reiniciar Contexto
```markdownREINICIO DE CONTEXTOEl contexto se perdió.Por favor:

Lee docs/ESTADO.md completo
Lee .ai/agent-config.yaml
Dime:

¿En qué fase estamos?
¿Cuál es la tarea actual?
¿Qué ya funciona?
¿Cuál es la próxima tarea?


NO hagas nada hasta que yo confirme.

**💡 Cuándo usar:** Cuando el agente está confundido

---

## 🐰 PROMPT 5: Aplicar Sugerencias de Rabbit
```markdownAPLICAR SUGERENCIAS DE RABBITRabbit revisó el PR y dejó comentarios.Sugerencias:[Copia/pega comentarios de Rabbit aquí]Instrucciones:
Lee cada sugerencia
Aplica SOLO las que tienen sentido
Explícame por qué aplicaste o ignoraste cada una
Actualiza código
Commit: fix: aplicar sugerencias de Rabbit
NO actualices docs/ (ya se hizo antes)
¿Procedo?

**💡 Cuándo usar:** Cuando Rabbit deja comentarios en tu PR

---

## 🔄 WORKFLOW VISUAL┌──────────────────┐
│ DÍA TÍPICO       │
├──────────────────┤
│                  │
│ 1. PROMPT 1      │ → Abres Cursor (30s)
│    ↓             │
│ 2. PROMPT 2      │ → Implementas tarea (20 min)
│    ↓             │
│ 3. git push      │ → (10s)
│    ↓             │
│ 4. Crear PR      │ → GitHub manual (1 min)
│    ↓             │
│ 5. Esperar       │ → Rabbit revisa (1 min)
│    │             │
│    ├─ Todo OK ───┼──> 7. Merge (10s)
│    │             │      ↓
│    └─ Cambios ───┼──> 6. PROMPT 5 (10 min)
│                  │      ↓
│                  │    7. Merge (10s)
│                  │      ↓
│ 8. Probar        │ → Manual (5-10 min)
│    ↓             │
│ 9. Siguiente     │ → PROMPT 2 de nuevo
│    tarea         │
│                  │
└──────────────────┘⏱️ Tu tiempo activo: ~8 min por tarea
⏱️ Tiempo total: 20-30 min por tarea

---

## ❓ FAQ (Preguntas Frecuentes)

### ¿Cuándo actualizo `.ai/agent-config.yaml`?

**Solo cuando cambias de fase:**
```yamlphase_current: 0  # Cambiar a 1 cuando empieces Fase 1

**NUNCA en cada tarea.**

---

### ¿Qué actualiza el agente automáticamente?

Solo 2 archivos (en el mismo commit del código):
1. `docs/ESTADO.md`
2. `docs/CHANGELOG.md`

---

### ¿Cómo sé que terminó bien?

El agente debe decir:✅ Tarea X.Y completada
📂 Archivos: [lista]
✅ Validaciones: Pasaron
📝 Docs: Actualizados
📌 Commit: abc1234
⏭️ Siguiente: X.Y+1

Si falta algo → Usar **PROMPT 4**

---

### ¿Una rama por tarea?

**SÍ. UNA rama = UNA tarea**
```bashTarea 0.1
git checkout -b feature/tarea-0.1
[trabajo...]
git pushPR → Merge → BorrarTarea 0.2 (NUEVA rama desde main)
git checkout main
git pull
git checkout -b feature/tarea-0.2

**Siempre desde main actualizado.**

---

### ¿Qué hago si Rabbit pide muchos cambios?

**Opción A:** Aplicarlos (con PROMPT 5)  
**Opción B:** Ignorar algunos (comentar por qué)  
**Opción C:** Cerrar PR y empezar de nuevo

---

### ¿El agente NO actualiza docs?

Dile:
```markdownALTO. No actualizaste docs/ESTADO.md ni CHANGELOG.md.Hazlo ahora:

Actualiza docs/ESTADO.md
Actualiza docs/CHANGELOG.md
git add docs/
git commit --amend --no-edit


---

## 🎓 TIPS PRO

### 💡 Tip 1: Commits descriptivos

❌ Malo:feat(fase-0): cambios

✅ Bueno:feat(fase-0): estructura backend con apps core, auth, inventario
backend/apps/core/ creado
backend/apps/authentication/ creado
backend/apps/inventario/ creado
Fase: 0
Tarea: 0.1

---

### 💡 Tip 2: Guarda estos prompts

Copia este archivo `.ai/prompts.md` a un lugar accesible.

Cuando necesites un prompt: copia/pega directo.

---

### 💡 Tip 3: Antes de retomar (días después)

**SIEMPRE** usa PROMPT 1 para refrescar contexto.

---

### 💡 Tip 4: No mergees tarde

Mergea cuando tengas energía para probar.

Si algo falla, puedes arreglarlo fresh.

---

### 💡 Tip 5: Rabbit aprende

Si ignoras una sugerencia, comenta por qué.

Rabbit mejora para el próximo PR.

---

## ✅ CHECKLIST ANTES DE CERRAR

Antes de cerrar Cursor cada día:

- [ ] Último commit = código + docs
- [ ] `git push` hecho
- [ ] PR creado/mergeado (o dejado con razón)
- [ ] `docs/ESTADO.md` refleja dónde quedé
- [ ] `git status` limpio

---

## 🔧 COMANDOS GIT ÚTILES
```bashEstado
git status
git branchActualizar main
git checkout main
git pull origin mainNueva rama
git checkout -b feature/tarea-X.YVer cambios
git diffLog
git log --oneline -5Borrar rama local
git branch -d feature/tarea-X.YLimpiar remotas
git fetch --prune

---

**Mantenido por:** Edilberto  
**Para:** Uso personal con agentes AI