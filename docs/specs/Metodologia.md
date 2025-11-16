# METODOLOGÍA DE TRABAJO Y FASE 0
## Sistema de Inventario Escolar - Guía de Ejecución

**Fecha:** Noviembre 15, 2025  
**Para:** Cursor, Windsurf o VS Code con asistencia IA  
**Supervisor:** Humano

---

## 📋 METODOLOGÍA DE TRABAJO 100% EFECTIVA

### Principios Fundamentales

1. **Una tarea a la vez** - No avanzar hasta validar completamente
2. **Código limpio siempre** - Rechazar código que no cumpla estándares
3. **Supervisión en cada entrega** - Humano revisa y aprueba
4. **Documentación inline** - Código auto-explicativo
5. **Testing obligatorio** - Cobertura mínima en cada módulo

### Flujo de Trabajo Estándar

```
┌─────────────────────────────────────────────────────────┐
│ 1. PLANIFICACIÓN                                        │
│    - Leer tarea en documento de requerimientos          │
│    - Identificar archivos a crear/modificar             │
│    - Listar dependencias                                 │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 2. EJECUCIÓN (IA)                                       │
│    - Generar código siguiendo estándares                │
│    - Incluir docstrings/comentarios                     │
│    - Agregar validaciones                                │
│    - Incluir manejo de errores                           │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 3. AUTO-EVALUACIÓN (IA)                                 │
│    - Verificar límites de líneas                        │
│    - Verificar docstrings completos                     │
│    - Verificar nomenclatura                              │
│    - Verificar validaciones                              │
│    - Verificar type hints                                │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 4. GENERACIÓN DE TESTS (IA)                            │
│    - Tests de casos normales                             │
│    - Tests de edge cases                                 │
│    - Tests de validaciones                               │
│    - Tests de manejo de errores                          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 5. REVISIÓN (HUMANO)                                    │
│    - Verificar checklist de calidad                     │
│    - Probar funcionalmente                               │
│    - Aprobar o solicitar correcciones                   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 6. VALIDACIÓN TÉCNICA                                   │
│    - Ejecutar linters                                    │
│    - Ejecutar type checker                               │
│    - Ejecutar tests                                      │
│    - Verificar coverage                                  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 7. COMMIT                                                │
│    - Mensaje descriptivo en español                     │
│    - Incluir número de fase y tarea                     │
│    - Push a repositorio                                  │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 PLANTILLA DE PROMPT PARA CADA TAREA

```markdown
# TAREA [NÚMERO]

## Contexto
- **Proyecto:** Sistema de Inventario Escolar
- **Fase:** [número y nombre]
- **Tarea:** [número y descripción breve]
- **Dependencias completadas:** [lista de tareas previas]

## Objetivo
[Descripción clara y específica del objetivo]

## Especificaciones Técnicas

### Archivo(s)
- **Ruta:** [path completo desde raíz del proyecto]
- **Tipo:** [modelo/view/serializer/component/etc]
- **Acción:** [crear nuevo / modificar existente]

### Requerimientos Funcionales
1. [Requerimiento específico 1]
2. [Requerimiento específico 2]
3. ...

### Requerimientos No Funcionales
- **Límite de líneas:** [número] líneas máximo
- **Docstrings:** Completos en todas las funciones/clases
- **Type Hints:** Obligatorio (Python/TypeScript)
- **Validaciones:** Todas las validaciones necesarias
- **Manejo de errores:** Excepciones específicas con mensajes claros

### Dependencias / Imports Esperados
```[language]
[Lista de imports esperados]
```

### Validaciones Requeridas
1. [Validación 1]
2. [Validación 2]
...

### Casos de Uso

#### Caso Exitoso
```
Input: [ejemplo]
Output: [ejemplo]
```

#### Caso de Error
```
Input: [ejemplo]
Output: Error: [mensaje esperado]
```

## Entregables

1. ✅ **Código fuente** en archivo especificado
2. ✅ **Tests** con coverage > [X]%
3. ✅ **Documentación** inline completa
4. ✅ **Auto-evaluación** de cumplimiento

## Auto-Evaluación

Antes de entregar, verifica:
- [ ] Límite de líneas cumplido
- [ ] Docstrings completos
- [ ] Type hints presentes
- [ ] Validaciones implementadas
- [ ] Manejo de errores robusto
- [ ] Tests cubren casos críticos
- [ ] Nomenclatura correcta
- [ ] Imports organizados

## ¿Estás listo para generar el código?
```

---

## 🔄 CAMBIO DE CONTEXTO ENTRE HERRAMIENTAS

### Antes de Cambiar de Herramienta

**1. Commit Estado Actual**
```bash
git add .
git commit -m "wip: estado actual antes de cambiar a [nueva herramienta]"
```

**2. Documentar Estado**
```bash
cat > .estado-desarrollo.md << EOF
# ESTADO ACTUAL DEL DESARROLLO

**Fecha:** $(date)
**Herramienta anterior:** [nombre]
**Próxima herramienta:** [nombre]

## Fase Actual
Fase [número]: [nombre]

## Última Tarea Completada
Tarea [número]: [descripción]

## Próxima Tarea
Tarea [número]: [descripción]

## Tareas Pendientes en Esta Fase
- [ ] Tarea X
- [ ] Tarea Y
- [ ] Tarea Z

## Notas Importantes
[Cualquier nota relevante]

## Archivos Modificados Recientemente
$(git diff --name-only HEAD~5..HEAD)

## Último Commit
$(git log -1 --oneline)
EOF

git add .estado-desarrollo.md
git commit -m "docs: estado de desarrollo"
```

### Al Abrir Nueva Herramienta

**Prompt de Continuación:**
```markdown
Hola, estoy continuando el desarrollo del **Sistema de Inventario Escolar**.

## CONTEXTO DEL PROYECTO

[Adjuntar documento REQUERIMIENTOS-SISTEMA-INVENTARIO-v3.0.md]

## ESTADO ACTUAL DEL DESARROLLO

[Copiar contenido completo de .estado-desarrollo.md]

## ÚLTIMA MODIFICACIÓN

```bash
# Último commit
[Ejecutar: git log -1 --stat]
```

## ARCHIVOS RECIENTES

```bash
# Últimos archivos modificados
[Ejecutar: git diff --name-only HEAD~10..HEAD]
```

## CONFIRMACIÓN

¿Puedes confirmar que entiendes:
1. El estado actual del proyecto
2. La fase en la que estamos
3. La siguiente tarea a ejecutar

¿Estás listo para continuar con Tarea [número]?
```

---

## 🛠️ USO ESPECÍFICO POR HERRAMIENTA

### Cursor

**Mejor para:**
- ✅ Generación rápida de boilerplate
- ✅ CRUD básico de modelos Django
- ✅ Serializers simples
- ✅ Componentes React repetitivos
- ✅ Tests unitarios

**Configuración recomendada:**
```json
// .cursor/settings.json
{
  "cursor.ai.model": "claude-sonnet-4",
  "cursor.ai.temperature": 0.2,
  "cursor.ai.streaming": true
}
```

**Ejemplo de uso:**
```
Prompt: "Crea el modelo Sede según las especificaciones en 
el documento de requerimientos. Debe incluir validaciones,
docstrings y constraints de BD."

[Cursor genera código]

Prompt: "Ahora genera los tests para este modelo con 
coverage > 90%"
```

### Windsurf

**Mejor para:**
- ✅ Features complejas multi-archivo
- ✅ Importación Excel (lógica compleja)
- ✅ Edición masiva (modal + backend)
- ✅ Debugging profundo
- ✅ Refactoring masivo

**Modo recomendado:**
- Usar modo "Agentic" para tareas complejas
- Cargar todo el documento de requerimientos en contexto

**Ejemplo de uso:**
```
Prompt: "Necesito implementar la funcionalidad completa de 
importación Excel con validación exhaustiva y auto-creación 
de artículos. Es una tarea compleja que involucra múltiples 
archivos:
- Serializer de validación
- View de importación
- Tests exhaustivos
- Componente React de upload

Por favor, planifica la implementación y luego genera todos 
los archivos necesarios."
```

### VS Code + Copilot

**Mejor para:**
- ✅ Debugging paso a paso con breakpoints
- ✅ Exploración de código existente
- ✅ Ajustes finos y refinamiento
- ✅ Desarrollo manual con sugerencias inteligentes

**Extensiones recomendadas:**
- Python
- Django
- ESLint
- Prettier
- GitHub Copilot
- GitLens

**Ejemplo de uso:**
```
Desarrollo tradicional con asistencia:
1. Abrir archivo a modificar
2. Escribir comentario descriptivo
3. Copilot sugiere código
4. Aceptar o refinar sugerencia
5. Agregar breakpoint y debuggear
```

---

## ✅ CHECKLIST DE REVISIÓN DE CÓDIGO

### Backend (Python/Django)

```markdown
ARCHIVO: [nombre del archivo]
TIPO: [modelo/view/serializer/etc]

## Estructura
- [ ] Imports organizados (stdlib, third-party, local)
- [ ] Máximo [X] líneas (actual: [Y])
- [ ] Una clase/función por propósito

## Documentación
- [ ] Docstring en clase/función con descripción
- [ ] Docstring incluye Args si aplica
- [ ] Docstring incluye Returns si aplica
- [ ] Docstring incluye Raises si aplica
- [ ] Comentarios en lógica compleja

## Nomenclatura
- [ ] Variables/funciones en snake_case
- [ ] Clases en PascalCase
- [ ] Constantes en UPPER_SNAKE_CASE
- [ ] Nombres descriptivos (no x, y, tmp)

## Type Hints
- [ ] Parámetros de función tienen type hints
- [ ] Return type especificado
- [ ] Variables complejas tienen hints

## Validaciones
- [ ] Todas las validaciones requeridas implementadas
- [ ] Mensajes de error descriptivos
- [ ] Validaciones usan Django validators cuando posible

## Manejo de Errores
- [ ] Try-except en operaciones riesgosas
- [ ] Excepciones específicas (no genérico Exception)
- [ ] Logging de errores apropiado

## Tests
- [ ] Archivo test_[módulo].py existe
- [ ] Tests de caso normal
- [ ] Tests de edge cases
- [ ] Tests de validaciones
- [ ] Tests de manejo de errores
- [ ] Coverage > [X]%

## Django Específico (si aplica)
- [ ] Modelos tienen Meta class
- [ ] Modelos tienen __str__ method
- [ ] Serializers validan correctamente
- [ ] Views usan permisos apropiados
- [ ] URLs bien nombradas
```

### Frontend (TypeScript/React)

```markdown
ARCHIVO: [nombre del archivo]
TIPO: [component/hook/util/etc]

## Estructura
- [ ] Imports organizados (React, external, internal)
- [ ] Máximo [X] líneas (actual: [Y])
- [ ] Un componente por archivo

## Nomenclatura
- [ ] Componente en PascalCase
- [ ] Funciones/variables en camelCase
- [ ] Constantes en UPPER_SNAKE_CASE
- [ ] Props interface con Props suffix

## TypeScript
- [ ] Props tienen interface definida
- [ ] No uso de 'any' sin justificación
- [ ] Tipos importados de types/
- [ ] Return type en funciones complejas

## Componente React
- [ ] Props desestructuradas
- [ ] Hooks al inicio del componente
- [ ] Effects con dependencias correctas
- [ ] Handlers con nombre handleX
- [ ] PropTypes o validación Zod

## Validación (Formularios)
- [ ] Schema Zod definido
- [ ] react-hook-form configurado
- [ ] Mensajes de error claros
- [ ] Validación en tiempo real donde aplica

## Estilos
- [ ] Usa Tailwind CSS
- [ ] Usa shadcn/ui components
- [ ] Responsive (sm:, md:, lg:)
- [ ] Dark mode considerado

## Performance
- [ ] Memo/useMemo/useCallback donde necesario
- [ ] No renders innecesarios
- [ ] Lazy loading si aplica

## Accesibilidad
- [ ] Labels en inputs
- [ ] ARIA attributes donde necesario
- [ ] Keyboard navigation funciona
- [ ] Focus visible

## Tests
- [ ] Tests de renderizado
- [ ] Tests de interacciones del usuario
- [ ] Tests de estados
- [ ] Tests de validaciones
```

---

## 🎯 FASE 0: PREPARACIÓN DEL ENTORNO

### Objetivo
Crear estructura completa del proyecto con configuración funcional de backend y frontend.

### Duración Estimada
1-2 días (4-8 horas de trabajo efectivo)

### Pre-requisitos

**Software Instalado:**
- Python 3.13.0+
- Node.js 22 LTS
- PostgreSQL 16.6+
- Git
- Editor: Cursor / Windsurf / VS Code

**Verificación:**
```bash
python3.13 --version  # 3.13.0 o superior
node --version        # v22.x.x
npm --version         # 10.x.x
psql --version        # 16.x
git --version         # 2.x.x
```

---

### BACKEND

#### Tarea 0.1: Crear Estructura de Directorios

**Prompt para IA:**
```markdown
# TAREA 0.1: Crear Estructura de Directorios Backend

Crea la estructura completa de directorios para el backend Django:

```bash
mkdir -p inventario-escolar/backend
cd inventario-escolar/backend

mkdir -p config/settings
mkdir -p apps/core
mkdir -p apps/authentication/models
mkdir -p apps/authentication/serializers
mkdir -p apps/authentication/views
mkdir -p apps/authentication/tests
mkdir -p apps/inventario/models
mkdir -p apps/inventario/serializers
mkdir -p apps/inventario/views
mkdir -p apps/inventario/tests
mkdir -p requirements
mkdir -p static
mkdir -p media
```

Genera el script bash completo para crear esta estructura.
```

**Validación:**
```bash
tree -L 3 backend/
# Debe mostrar estructura completa
```

---

#### Tarea 0.2: Configurar Entorno Virtual e Instalar Django

**Prompt para IA:**
```markdown
# TAREA 0.2: Setup Entorno Virtual

Genera los comandos para:
1. Crear entorno virtual con Python 3.13
2. Activar entorno virtual
3. Instalar Django 5.2
4. Verificar instalación

Sistema operativo: [Linux/macOS/Windows]
```

**Ejecución:**
```bash
cd backend
python3.13 -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

pip install --break-system-packages django==5.2

# Verificar
python -c "import django; print(django.get_version())"
```

**Validación:**
- [ ] Debe imprimir: 5.2.x

---

#### Tarea 0.3: Crear Archivos de Requirements

**Prompt para IA:**
```markdown
# TAREA 0.3: Crear Archivos de Requirements

Genera 3 archivos de requirements según las especificaciones 
del documento de requerimientos:

1. **requirements/base.txt** - Dependencias comunes
2. **requirements/development.txt** - Dependencias de desarrollo
3. **requirements/production.txt** - Dependencias de producción

Usa las versiones exactas especificadas en el documento.
```

**Archivos a crear:**

`requirements/base.txt`:
```
Django==5.2
djangorestframework==3.16.1
psycopg==3.2.3
python-decouple==3.8
djangorestframework-simplejwt==5.4.0
django-cors-headers==4.6.0
django-filter==24.3
pandas==2.2.3
openpyxl==3.1.5
Pillow==11.0.0
```

`requirements/development.txt`:
```
-r base.txt

pytest==8.3.4
pytest-django==4.9.0
pytest-cov==6.0.0
factory-boy==3.3.0
faker==30.8.2
ipython==8.29.0
django-debug-toolbar==4.4.6
```

`requirements/production.txt`:
```
-r base.txt

gunicorn==23.0.0
whitenoise==6.8.2
```

**Instalación:**
```bash
pip install --break-system-packages -r requirements/development.txt
```

**Validación:**
```bash
pip list | grep Django
# Debe mostrar Django 5.2.x y djangorestframework 3.16.1
```

---

#### Tarea 0.4: Inicializar Proyecto Django

**Prompt para IA:**
```markdown
# TAREA 0.4: Inicializar Proyecto Django

Genera los comandos para:
1. Crear proyecto Django llamado 'config'
2. Reestructurar settings en carpeta settings/
3. Crear archivos: base.py, development.py, production.py

El manage.py debe quedar en la raíz de backend/
```

**Ejecución:**
```bash
cd backend
django-admin startproject config .

# Crear estructura de settings
mkdir -p config/settings
touch config/settings/__init__.py
touch config/settings/base.py
touch config/settings/development.py
touch config/settings/production.py
```

**Modificar `config/settings/__init__.py`:**
```python
"""
Configuración de Django basada en entorno.

Usa DJANGO_SETTINGS_MODULE o defaultea a development.
"""
import os

environment = os.getenv('DJANGO_SETTINGS_MODULE', 'config.settings.development')

if 'production' in environment:
    from .production import *
elif 'testing' in environment:
    from .testing import *
else:
    from .development import *
```

---

#### Tarea 0.5: Configurar Settings

**Prompt para IA:**
```markdown
# TAREA 0.5: Configurar Settings de Django

Genera el contenido completo para estos archivos:

1. **config/settings/base.py** - Settings comunes
2. **config/settings/development.py** - Hereda de base, DEBUG=True
3. **config/settings/production.py** - Hereda de base, DEBUG=False

Debe incluir:
- Apps instaladas (incluyendo DRF, CORS, etc.)
- Configuración de BD con PostgreSQL
- Configuración de JWT
- Configuración de CORS
- Configuración de archivos estáticos

Usa python-decouple para variables de entorno.
```

**Archivos a generar:** (La IA debe generar estos archivos completos)

---

#### Tarea 0.6: Crear Base de Datos PostgreSQL

**Ejecución manual:**
```bash
# Crear base de datos
createdb inventario_escolar

# Crear usuario
createuser -P inventario_user
# Ingresar password: inventario_pass_dev

# Dar permisos
psql -c "GRANT ALL PRIVILEGES ON DATABASE inventario_escolar TO inventario_user;"
```

**Validación:**
```bash
psql -U inventario_user -d inventario_escolar -c "\dt"
# Debe conectar sin errores
```

---

#### Tarea 0.7: Configurar Variables de Entorno

**Prompt para IA:**
```markdown
# TAREA 0.7: Crear Archivo .env.example

Genera el archivo .env.example con todas las variables 
necesarias para el proyecto, incluyendo:
- Django SECRET_KEY
- DEBUG
- ALLOWED_HOSTS
- Database credentials
- JWT settings
- CORS settings
```

**Archivo `.env.example`:** (IA debe generar)

**Ejecución manual:**
```bash
cp .env.example .env
# Editar .env con valores reales
```

---

#### Tarea 0.8: Crear Apps Django

**Ejecución:**
```bash
cd backend/apps

# Crear apps
django-admin startapp core
django-admin startapp authentication
django-admin startapp inventario

# Registrar en INSTALLED_APPS (settings/base.py)
```

**Validación:**
```bash
python manage.py check
# Debe decir: System check identified no issues
```

---

#### Tarea 0.9: Configurar URLs Base

**Prompt para IA:**
```markdown
# TAREA 0.9: Configurar URLs del Proyecto

Genera el archivo config/urls.py con:
- Admin de Django
- URLs de authentication app
- URLs de inventario app
- Configuración de archivos estáticos para desarrollo
```

**Archivo a generar:** `config/urls.py`

---

#### Tarea 0.10: Crear Migraciones Iniciales

**Ejecución:**
```bash
python manage.py makemigrations
python manage.py migrate
```

**Validación:**
```bash
python manage.py showmigrations
# Debe mostrar migraciones de Django aplicadas
```

---

### FRONTEND

#### Tarea 0.11: Inicializar Proyecto Next.js

**Ejecución:**
```bash
cd inventario-escolar
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd frontend
```

**Validación:**
```bash
npm run dev
# Debe iniciar en http://localhost:3000
```

---

#### Tarea 0.12: Instalar Dependencias

**Ejecución:**
```bash
cd frontend

# Dependencias principales
npm install zustand axios zod react-hook-form @hookform/resolvers
npm install @tanstack/react-query
npm install date-fns react-hot-toast lucide-react

# shadcn/ui
npx shadcn@latest init
# Seleccionar: Default, Neutral, CSS variables

# Componentes shadcn
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add card
npx shadcn@latest add form
npx shadcn@latest add label
npx shadcn@latest add textarea
```

**Validación:**
```bash
npm list zustand axios zod
# Debe mostrar versiones instaladas
```

---

#### Tarea 0.13: Crear Estructura de Carpetas Frontend

**Prompt para IA:**
```markdown
# TAREA 0.13: Crear Estructura de Carpetas Frontend

Genera el script para crear la siguiente estructura:

```
frontend/
├── app/
│   ├── (auth)/
│   │   └── login/
│   └── (dashboard)/
│       ├── dashboard/
│       ├── items/
│       └── catalogos/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── items/
│   ├── catalogos/
│   ├── auth/
│   └── common/
├── lib/
│   ├── api/
│   ├── stores/
│   ├── hooks/
│   └── schemas/
└── types/
```
```

**Ejecución:** (script generado por IA)

---

#### Tarea 0.14: Configurar Variables de Entorno Frontend

**Archivo `.env.local.example`:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**Ejecución:**
```bash
cp .env.local.example .env.local
```

---

### VALIDACIÓN FINAL FASE 0

```markdown
## Checklist Fase 0

### Backend
- [ ] Estructura de directorios creada
- [ ] Entorno virtual activado
- [ ] Django 5.2 instalado
- [ ] Requirements instalados
- [ ] Proyecto Django inicializado
- [ ] Settings configurados (base, dev, prod)
- [ ] PostgreSQL creado y conectado
- [ ] Variables de entorno configuradas
- [ ] Apps creadas (core, authentication, inventario)
- [ ] URLs base configuradas
- [ ] `python manage.py check` sin errores
- [ ] `python manage.py migrate` ejecutado exitosamente

### Frontend
- [ ] Next.js 16 inicializado
- [ ] Dependencias instaladas
- [ ] shadcn/ui configurado
- [ ] Estructura de carpetas creada
- [ ] Variables de entorno configuradas
- [ ] `npm run dev` inicia sin errores
- [ ] Página de inicio visible en http://localhost:3000

### General
- [ ] Git inicializado
- [ ] .gitignore configurado
- [ ] Primer commit realizado
- [ ] README.md creado con instrucciones básicas
```

---

## 📦 PRIMER COMMIT

**Después de validar todo:**

```bash
cd inventario-escolar

# Inicializar git
git init

# Crear .gitignore (IA debe generar)
touch .gitignore

# Agregar archivos
git add .

# Primer commit
git commit -m "feat(setup): configuración inicial del proyecto

- Estructura backend con Django 5.2
- Estructura frontend con Next.js 16
- Apps Django: core, authentication, inventario
- PostgreSQL configurado
- Variables de entorno configuradas
- shadcn/ui instalado

Fase: 0 - Preparación del entorno"
```

---

## ✅ SIGUIENTE PASO

Una vez completada y validada la Fase 0:

**Continuar con:** [FASE 1: Modelos + Autenticación]

**Documento de referencia:** REQUERIMIENTOS-SISTEMA-INVENTARIO-v3.0.md

**Validación previa:** Asegurarse de que TODOS los checkboxes de Fase 0 estén marcados.

---

**Documento generado:** Noviembre 15, 2025  
**Versión:** 1.0  
**Estado:** ✅ LISTO PARA EJECUCIÓN
