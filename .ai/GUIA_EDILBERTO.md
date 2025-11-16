# INICIO DE PROYECTO: Sistema de Inventario Escolar

Hola, voy a iniciar el desarrollo del Sistema de Inventario Escolar.

## Configuración del proyecto

Por favor lee estos archivos en orden:

1. `.ai/agent-config.yaml` - Configuración general del proyecto
2. `docs/ESTADO.md` - Estado actual del proyecto
3. `docs/GUIA-RAPIDA.md` - Referencia técnica rápida
4. `docs/specs/04-FASE-0-SETUP.md` - Especificación de la Fase 0

## Mi objetivo para esta sesión

Quiero completar la **Tarea 0.1: Crear estructura de directorios del backend**

## Confirmación

Antes de empezar, por favor confírmame:
1. ¿Entiendes cuál es la tarea?
2. ¿Qué archivos vas a crear?
3. ¿Cuál será tu primer paso?

Esperaré tu confirmación antes de que procedas.


# TAREA COMPLETADA: [Nombre de la tarea]

Acabas de completar la implementación de [describe brevemente].

## Validación

Por favor ejecuta los comandos de validación:

**Backend:**
```bash
cd backend
python manage.py check
pytest
```

**Frontend:**
```bash
cd frontend
npm run lint
```

## Actualización de documentación

Ahora debes actualizar:

1. **docs/ESTADO.md:**
   - Sección "AHORA MISMO": actualizar tarea actual a la próxima
   - Sección "✅ FUNCIONA": agregar lo que acabas de completar
   - Sección "PROXIMA TAREA": indicar cuál sigue

2. **docs/CHANGELOG.md:**
   - Agregar entrada con fecha de hoy
   - Listar archivos creados/modificados
   - Describir brevemente qué se hizo

3. **Generar commit:**
   - Usar el formato de `.ai/agent-config.yaml`
   - Tipo: `feat` (si es nueva funcionalidad) o `chore` (si es setup)
   - Alcance: nombre de la fase/tarea
   - Mensaje descriptivo

## Ejemplo de commit esperado
```bash
git add .
git commit -m "feat(fase-0): implementar estructura de directorios backend

- Creada carpeta backend/ con apps/
- Apps: core, authentication, inventario
- Configuración inicial de settings

Fase: 0
Tarea: 0.1"
```

Por favor procede con estas actualizaciones.


📝 ARCHIVOS QUE EL AGENTE ACTUALIZA AL FINAL
1. docs/ESTADO.md
Secciones que se actualizan:
markdown## 📍 AHORA MISMO

**Fase:** 0 - Setup del Proyecto  
**Tarea actual:** 0.2 - Configurar Django settings  ← ESTO CAMBIA
**Último commit:** abc1234 - feat(fase-0): estructura backend  ← ESTO CAMBIA

---

## ✅ FUNCIONA

- ✅ Repositorio Git inicializado
- ✅ Estructura de documentación creada
- ✅ Estructura backend creada  ← ESTO SE AGREGA
- ✅ Apps Django inicializadas  ← ESTO SE AGREGA

---

## 📋 PROXIMA TAREA

**Tarea 0.2:** Configurar Django settings (base, dev, prod)  ← ESTO CAMBIA
**Detalles:** Ver `docs/specs/04-FASE-0-SETUP.md` - Tarea 0.2

2. docs/CHANGELOG.md
Se agrega una nueva entrada al principio:
markdown## 2025-11-16 (Sesión #2)  ← Nueva fecha

### ✅ Completado

**Tarea 0.1: Estructura de directorios backend**
- Creadas carpetas: backend/apps/{core,authentication,inventario}
- Archivos de configuración inicial
- Commit: abc1234

### 📝 Decisiones

- Estructura modular confirmada
- Apps separadas por dominio

### 📊 Métricas

- Commits: 2
- Archivos creados: 15

---

[entradas anteriores...]
```

---

## 🔄 FLUJO COMPLETO DE UNA TAREA (VISUAL)
```
┌─────────────────────────────────────────────────────────┐
│ 1. TÚ INICIAS (Edilberto)                              │
├─────────────────────────────────────────────────────────┤
│ Prompt:                                                 │
│ "Quiero completar Tarea 0.1: crear estructura backend" │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 2. AGENTE LEE                                           │
├─────────────────────────────────────────────────────────┤
│ ✅ .ai/agent-config.yaml                               │
│ ✅ docs/ESTADO.md                                       │
│ ✅ docs/specs/04-FASE-0-SETUP.md                        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 3. AGENTE CONFIRMA                                      │
├─────────────────────────────────────────────────────────┤
│ "Voy a crear estas carpetas:                            │
│  - backend/apps/core/                                   │
│  - backend/apps/authentication/                         │
│  - backend/apps/inventario/                             │
│ ¿Procedo?"                                              │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 4. TÚ APRUEBAS (Edilberto)                             │
├─────────────────────────────────────────────────────────┤
│ "Sí, procede"                                           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 5. AGENTE IMPLEMENTA                                    │
├─────────────────────────────────────────────────────────┤
│ [Crea archivos y carpetas]                              │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 6. AGENTE VALIDA                                        │
├─────────────────────────────────────────────────────────┤
│ $ python manage.py check                                │
│ ✅ OK                                                   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 7. AGENTE ACTUALIZA DOCS                                │
├─────────────────────────────────────────────────────────┤
│ ✅ docs/ESTADO.md → Tarea 0.1 completada               │
│ ✅ docs/CHANGELOG.md → Nueva entrada                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 8. AGENTE GENERA COMMIT                                 │
├─────────────────────────────────────────────────────────┤
│ git commit -m "feat(fase-0): estructura backend         │
│                                                          │
│ - Apps creadas                                          │
│ Fase: 0, Tarea: 0.1"                                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 9. AGENTE NOTIFICA                                      │
├─────────────────────────────────────────────────────────┤
│ "Tarea 0.1 completada.                                  │
│  Commit: abc1234                                        │
│  Próxima tarea: 0.2 - Configurar settings"              │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 10. TÚ PRUEBAS (Edilberto)                             │
├─────────────────────────────────────────────────────────┤
│ [Revisas manualmente que todo esté bien]                │
│ ✅ Apruebas o ❌ Pides correcciones                     │
└─────────────────────────────────────────────────────────┘

❓ PREGUNTAS FRECUENTES
¿Cuándo actualizo .ai/agent-config.yaml?
SOLO cuando cambies decisiones arquitectónicas:

Cambias de fase (ej: de Fase 0 a Fase 1) → Actualizar phase_current
Cambias el stack (RARO) → Actualizar stack
Cambias estándares de código → Actualizar code_standards

NO se actualiza en cada tarea.

¿Qué archivos se actualizan en CADA tarea?
Solo 2:

docs/ESTADO.md → Estado actual
docs/CHANGELOG.md → Histórico


¿Cómo sé que el agente terminó correctamente?
El agente debe:

✅ Ejecutar validaciones (pytest, linters)
✅ Actualizar ESTADO.md
✅ Actualizar CHANGELOG.md
✅ Generar commit
✅ Notificarte que terminó

Si falta alguno, pídele que lo complete.

¿Qué hago si el agente se "pierde"?
Envíale este prompt:
markdown# REINICIO DE CONTEXTO

Por favor:

1. Lee `docs/ESTADO.md` completo
2. Dime qué tarea dice que estamos haciendo
3. Dime qué archivos dice que ya existen
4. Dime qué es lo próximo que deberíamos hacer

Esperaré tu resumen antes de continuar.

✅ CHECKLIST FINAL ANTES DE EMPEZAR

 Creaste .ai/agent-config.yaml en la raíz del proyecto
 Creaste docs/specs/06-PERMISOS.md
 Leíste la sección "CÓMO INICIAR UNA CONVERSACIÓN CON EL AGENTE"
 Entiendes que el agente actualiza ESTADO.md y CHANGELOG.md al final
 Entiendes que .ai/agent-config.yaml NO se actualiza automáticamente
 Tienes listo el "PROMPT INICIAL" para copiar y pegar


🎯 RESUMEN ULTRA-CORTO

Creas 2 archivos: .ai/agent-config.yaml y docs/specs/06-PERMISOS.md
Inicias con prompt: "Quiero completar Tarea X.Y, lee agent-config.yaml y ESTADO.md"
Agente hace: Código → Validaciones → Actualiza ESTADO.md → Actualiza CHANGELOG.md → Commit
Tú pruebas: Verificas que funcione
Repites para siguiente tarea

El .ai/agent-config.yaml NUNCA se actualiza automáticamente. Solo tú lo modificas manualmente cuando cambias de fase o decisiones arquitectónicas.