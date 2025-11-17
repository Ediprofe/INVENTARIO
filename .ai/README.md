# 🏫 Sistema de Inventario Escolar

Sistema integral de gestión de inventario físico para instituciones educativas, diseñado para manejar más de 7,000 ítems con funcionalidades avanzadas de importación, exportación y edición masiva.

---

## 🎯 Características Principales

- ✅ **CRUD completo** de ítems de inventario con validación robusta
- 📊 **Importación masiva** desde Excel con auto-creación de artículos
- 📤 **Exportación** a Excel con filtros personalizados
- ✏️ **Edición masiva** con interfaz tipo Excel (react-data-grid)
- 📜 **Historial automático** de todos los movimientos
- 🔍 **Búsqueda y filtros** avanzados en tiempo real
- 🔒 **Autenticación JWT** con refresh tokens
- 📱 **UI moderna** con Tailwind CSS + shadcn/ui

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| **Backend** | Django | 5.2 |
| **API** | Django REST Framework | 3.16.1 |
| **Base de datos** | PostgreSQL | 16.6 |
| **Frontend** | Next.js (App Router) | 16 |
| **UI Framework** | React | 19 |
| **Lenguaje Frontend** | TypeScript | 5.7 |
| **Estilos** | Tailwind CSS | 3.4.17 |
| **Componentes** | shadcn/ui | Latest |
| **Estado** | Zustand | 5.0.3 |
| **Data Fetching** | TanStack Query | 5.61 |
| **Testing Backend** | pytest | 8.3.4 |
| **Testing Frontend** | Jest + RTL | Latest |

---

## ⚡ Quick Start

### Pre-requisitos

- Python 3.13+
- Node.js 22+ LTS
- PostgreSQL 16.6+
- Git 2.x

### 1. Clonar repositorio

```bash
git clone <repository-url>
cd inventario-escolar
```

### 2. Backend (Django)

```bash
# Navegar a backend
cd backend

# Crear entorno virtual
python3.13 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements/development.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Crear base de datos
createdb inventario_escolar

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Iniciar servidor de desarrollo
python manage.py runserver
```

Backend disponible en: `http://localhost:8000`

### 3. Frontend (Next.js)

```bash
# Navegar a frontend (desde raíz del proyecto)
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con la URL de tu backend

# Iniciar servidor de desarrollo
npm run dev
```

Frontend disponible en: `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
inventario-escolar/
├── backend/                    # Aplicación Django
│   ├── config/                 # Configuración del proyecto
│   │   ├── settings/
│   │   │   ├── base.py         # Settings base
│   │   │   ├── development.py  # Settings desarrollo
│   │   │   └── production.py   # Settings producción
│   │   ├── urls.py             # URLs raíz
│   │   └── wsgi.py
│   ├── apps/                   # Aplicaciones Django
│   │   ├── core/               # App core (mixins, utils)
│   │   ├── authentication/     # App de autenticación JWT
│   │   └── inventario/         # App principal de inventario
│   │       ├── models/         # Modelos (Sede, Item, etc.)
│   │       ├── serializers/    # Serializers DRF
│   │       ├── views/          # ViewSets
│   │       └── tests/          # Tests unitarios
│   ├── requirements/           # Dependencias Python
│   │   ├── base.txt
│   │   ├── development.txt
│   │   └── production.txt
│   └── manage.py
│
├── frontend/                   # Aplicación Next.js
│   ├── app/                    # App Router de Next.js 16
│   │   ├── (auth)/             # Grupo de rutas de auth
│   │   │   └── login/
│   │   └── (dashboard)/        # Grupo de rutas protegidas
│   │       ├── items/
│   │       └── catalogos/
│   ├── components/             # Componentes React
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── items/              # Componentes de ítems
│   │   └── catalogos/          # Componentes de catálogos
│   ├── lib/                    # Utilidades
│   │   ├── api/                # Cliente API Axios
│   │   ├── stores/             # Zustand stores
│   │   ├── hooks/              # Custom hooks
│   │   └── schemas/            # Zod schemas
│   ├── types/                  # TypeScript types
│   └── package.json
│
├── docs/                       # Documentación técnica detallada
│   └── specs/
│       ├── 00-VISION-PROYECTO.md      # Explicación general
│       ├── 01-MODELO-DATOS.md         # Estructura de base de datos
│       ├── 02-FEATURES.md             # Especificación funcional
│       ├── 03-ESTANDARES.md           # Convenciones de código
│       ├── 04-FASE-0-SETUP.md         # Guía de instalación detallada
│       └── 05-FASES-1-7.md            # Plan de implementación
│
├── .claude/                    # Contexto para IA
│   └── CONTEXTO.md             # Instrucciones para Claude
│
├── README.md                   # Este archivo
└── PROYECTO.md                 # Estado vivo del proyecto
```

---

## 📚 Documentación Completa

### Para empezar

1. **Este archivo (README.md)** - Setup rápido y visión general
2. **PROYECTO.md** - Estado actual del proyecto y próximos pasos
3. **docs/specs/00-VISION-PROYECTO.md** - Explicación detallada en lenguaje natural

### Para desarrolladores

- **01-MODELO-DATOS.md** - Estructura completa de base de datos con validaciones
- **02-FEATURES.md** - Especificación funcional de todas las features (RF-001 a RF-008)
- **03-ESTANDARES.md** - Convenciones de código, límites y buenas prácticas
- **04-FASE-0-SETUP.md** - Guía paso a paso del setup inicial
- **05-FASES-1-7.md** - Plan de implementación completo (7 fases, ~22-30 días)

---

## 🧪 Testing

### Backend

```bash
cd backend
source venv/bin/activate

# Ejecutar todos los tests
pytest

# Tests con coverage
pytest --cov=apps --cov-report=term-missing --cov-report=html

# Tests de una app específica
pytest apps/inventario/tests/

# Ver reporte HTML de coverage
open htmlcov/index.html  # macOS
```

### Frontend

```bash
cd frontend

# Ejecutar tests
npm run test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 🔧 Comandos Útiles

### Backend

```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Shell interactivo
python manage.py shell

# Verificar configuración
python manage.py check

# Formatear código
black .

# Linting
ruff check .
```

### Frontend

```bash
# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm run start

# Linting
npm run lint

# Type checking
npm run type-check

# Formatear código
npm run format
```

---

## 📦 Deployment

**Fase 7 del proyecto** (2-3 días)

- Dockerización completa (backend + frontend + PostgreSQL + nginx)
- docker-compose para orquestación
- Variables de entorno para producción
- Guía de deployment

Ver: `docs/specs/05-FASES-1-7.md` para detalles.

---

## 🤝 Contribuir

### Workflow

1. Crear branch desde `develop`: `git checkout -b feature/nombre-feature`
2. Implementar cambios siguiendo `docs/specs/03-ESTANDARES.md`
3. Ejecutar tests y linters
4. Commit con Conventional Commits: `feat(alcance): descripción`
5. Push y crear Pull Request
6. Code review
7. Merge a `develop`

### Estándares

- **Archivos:** máx 300 líneas
- **Funciones:** máx 50 líneas
- **Líneas de código:** máx 100 caracteres
- **Test coverage:** mín 85%
- **Commits:** Conventional Commits

Ver: `docs/specs/03-ESTANDARES.md` para detalles completos.

---

## 📊 Estado del Proyecto

**Fase actual:** Ver `PROYECTO.md` para estado actualizado

**Progreso general:**
- ⏳ Fase 0: Setup del proyecto
- ⏹️ Fase 1: Modelos + Autenticación (3-4 días)
- ⏹️ Fase 2: API + Serializers (3-4 días)
- ⏹️ Fase 3: Frontend MVP (5-6 días)
- ⏹️ Fase 4: Import/Export Excel (3-4 días)
- ⏹️ Fase 5: Edición Masiva ⭐ (3-4 días)
- ⏹️ Fase 6: Testing + Polish (2-3 días)
- ⏹️ Fase 7: Docker + Deploy (2-3 días)

---

## 📄 Licencia

[Especificar licencia]

---

## 👤 Autor

**Edilberto** - Sistema de Inventario Escolar

---

## 📞 Soporte

Para preguntas sobre el proyecto, consultar:
- Documentación técnica en `/docs/specs/`
- Estado actual en `PROYECTO.md`
- Issues en GitHub

---

**Última actualización:** 2025-11-17