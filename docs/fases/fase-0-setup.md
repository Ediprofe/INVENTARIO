# 📄 ARCHIVO 4 DE 5: `04-FASE-0-SETUP.md`

Copia este contenido completo en `docs/specs/04-FASE-0-SETUP.md`:

```markdown
# FASE 0: SETUP DEL PROYECTO - Sistema de Inventario Escolar
**Versión:** 2.0  
**Fecha:** Noviembre 16, 2025  
**Propósito:** Guía paso a paso ejecutable para configuración inicial del proyecto

---

## 📋 ÍNDICE

1. [Resumen de la Fase 0](#resumen-de-la-fase-0)
2. [Pre-requisitos](#pre-requisitos)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Backend: Setup Django](#backend-setup-django)
5. [Frontend: Setup Next.js](#frontend-setup-nextjs)
6. [Base de Datos: PostgreSQL](#base-de-datos-postgresql)
7. [Git y Control de Versiones](#git-y-control-de-versiones)
8. [Validación Final](#validación-final)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 RESUMEN DE LA FASE 0

### Objetivo
Tener un entorno de desarrollo local completamente funcional con:
- ✅ Backend Django ejecutándose en `http://localhost:8000`
- ✅ Frontend Next.js ejecutándose en `http://localhost:3000`
- ✅ PostgreSQL configurado y conectado
- ✅ Repositorio Git inicializado
- ✅ Variables de entorno configuradas

### Duración Estimada
**1-2 días** (4-8 horas de trabajo efectivo)

### Entregables
1. Estructura de directorios completa
2. Backend con migraciones aplicadas
3. Frontend con shadcn/ui instalado
4. Base de datos PostgreSQL funcionando
5. README.md con instrucciones de setup
6. Primer commit en Git

---

## ✅ PRE-REQUISITOS

### Software Requerido

| Software | Versión Mínima | Verificar con |
|----------|----------------|---------------|
| **Python** | 3.13.0 | `python3.13 --version` |
| **Node.js** | 22.x LTS | `node --version` |
| **npm** | 10.x | `npm --version` |
| **PostgreSQL** | 16.6 | `psql --version` |
| **Git** | 2.x | `git --version` |

### Instalación de Pre-requisitos

#### macOS
```bash
# Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Python 3.13
brew install python@3.13

# Node.js 22 LTS
brew install node@22

# PostgreSQL 16
brew install postgresql@16
brew services start postgresql@16

# Git
brew install git
```

#### Ubuntu/Debian
```bash
# Python 3.13
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install python3.13 python3.13-venv python3.13-dev

# Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# PostgreSQL 16
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install postgresql-16

# Git
sudo apt install git
```

#### Windows
```powershell
# Instalar Chocolatey primero
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Python 3.13
choco install python --version=3.13.0

# Node.js 22
choco install nodejs-lts --version=22.0.0

# PostgreSQL 16
choco install postgresql16

# Git
choco install git
```

---

## 📁 ESTRUCTURA DEL PROYECTO

### Tarea 0.0: Crear Directorio Raíz

```bash
# Crear directorio principal
mkdir inventario-escolar
cd inventario-escolar

# Crear subdirectorios principales
mkdir -p backend frontend docs scripts
```

**Resultado esperado:**
```
inventario-escolar/
├── backend/
├── frontend/
├── docs/
└── scripts/
```

---

## 🐍 BACKEND: SETUP DJANGO

### Tarea 0.1: Estructura de Directorios Backend

**Prompt para IA:**
```markdown
# TAREA 0.1: Crear Estructura Backend

Genera el script bash para crear la siguiente estructura de directorios:

```bash
inventario-escolar/backend/
├── config/
│   └── settings/
├── apps/
│   ├── core/
│   ├── authentication/
│   │   ├── models/
│   │   ├── serializers/
│   │   ├── views/
│   │   └── tests/
│   └── inventario/
│       ├── models/
│       ├── serializers/
│       ├── views/
│       └── tests/
├── requirements/
├── static/
└── media/
```

Incluye creación de archivos `__init__.py` donde sea necesario.
```

**Ejecución:**
```bash
cd inventario-escolar/backend

# Crear estructura de directorios
mkdir -p config/settings
mkdir -p apps/core
mkdir -p apps/authentication/{models,serializers,views,tests}
mkdir -p apps/inventario/{models,serializers,views,tests}
mkdir -p requirements
mkdir -p static
mkdir -p media

# Crear archivos __init__.py
touch apps/__init__.py
touch apps/core/__init__.py
touch apps/authentication/__init__.py
touch apps/authentication/models/__init__.py
touch apps/authentication/serializers/__init__.py
touch apps/authentication/views/__init__.py
touch apps/authentication/tests/__init__.py
touch apps/inventario/__init__.py
touch apps/inventario/models/__init__.py
touch apps/inventario/serializers/__init__.py
touch apps/inventario/views/__init__.py
touch apps/inventario/tests/__init__.py
```

**Validación:**
```bash
tree -L 3 backend/
# Debe mostrar la estructura correcta
```

---

### Tarea 0.2: Entorno Virtual y Django

**Prompt para IA:**
```markdown
# TAREA 0.2: Configurar Entorno Virtual

Genera los comandos para:
1. Crear entorno virtual con Python 3.13
2. Activar entorno virtual
3. Instalar Django 5.2
4. Verificar instalación

Sistema operativo: [Linux/macOS/Windows]
```

**Ejecución:**

**Linux/macOS:**
```bash
cd backend

# Crear entorno virtual
python3.13 -m venv venv

# Activar
source venv/bin/activate

# Verificar activación
which python  # Debe mostrar ruta dentro de venv/

# Instalar Django
pip install --upgrade pip
pip install --break-system-packages django==5.2

# Verificar instalación
python -c "import django; print(django.get_version())"
# Debe imprimir: 5.2.x
```

**Windows (PowerShell):**
```powershell
cd backend

# Crear entorno virtual
python -m venv venv

# Activar
.\venv\Scripts\Activate.ps1

# Si hay error de permisos:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Instalar Django
pip install --upgrade pip
pip install django==5.2

# Verificar
python -c "import django; print(django.get_version())"
```

**Validación:**
- [ ] Entorno virtual activado (prompt muestra `(venv)`)
- [ ] Django instalado correctamente
- [ ] Versión 5.2.x verificada

---

### Tarea 0.3: Archivos de Requirements

**Archivo: `requirements/base.txt`**
```txt
# Core
Django==5.2
djangorestframework==3.16.1
psycopg==3.2.3
python-decouple==3.8

# CORS
django-cors-headers==4.6.0

# Authentication
djangorestframework-simplejwt==5.4.0

# Filtering
django-filter==24.3

# Images
Pillow==11.0.0
```

**Archivo: `requirements/development.txt`**
```txt
-r base.txt

# Development tools
ipython==8.30.0
django-debug-toolbar==4.4.6
django-extensions==3.2.3

# Testing
pytest==8.3.4
pytest-django==4.9.0
pytest-cov==6.0.0
factory-boy==3.3.1

# Linting & Formatting
ruff==0.8.4
black==24.10.0
isort==5.13.2

# Type checking
mypy==1.13.0
django-stubs==5.1.1
```

**Archivo: `requirements/production.txt`**
```txt
-r base.txt

# Production server
gunicorn==23.0.0

# Excel processing
pandas==2.2.3
openpyxl==3.1.5
```

**Ejecución:**
```bash
# Instalar dependencias de desarrollo
pip install --break-system-packages -r requirements/development.txt

# Verificar instalaciones
pip list | grep -E "Django|djangorestframework|psycopg"
```

**Validación:**
- [ ] Todos los paquetes instalados sin errores
- [ ] `pip list` muestra las versiones correctas

---

### Tarea 0.4: Inicializar Proyecto Django

```bash
cd backend

# Crear proyecto Django en el directorio actual
django-admin startproject config .

# La estructura debe quedar:
# backend/
#   ├── config/
#   │   ├── __init__.py
#   │   ├── asgi.py
#   │   ├── settings.py  (este lo moveremos)
#   │   ├── urls.py
#   │   └── wsgi.py
#   └── manage.py
```

**Validación:**
```bash
# Verificar que manage.py existe
ls manage.py

# Verificar que el proyecto se creó
python manage.py --version
# Debe imprimir: 5.2.x
```

---

### Tarea 0.5: Configurar Settings Modulares

**Mover `settings.py` a estructura modular:**

```bash
# Mover settings.py a settings/base.py
mv config/settings.py config/settings/base.py

# Crear __init__.py
touch config/settings/__init__.py
```

**Archivo: `config/settings/__init__.py`**
```python
"""
Importa settings según DJANGO_ENV.
Por defecto usa development.
"""
import os

environment = os.getenv('DJANGO_ENV', 'development')

if environment == 'production':
    from .production import *
else:
    from .development import *
```

**Archivo: `config/settings/base.py`**
```python
"""
Settings comunes para todos los entornos.
"""
from pathlib import Path
from decouple import config

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default='django-insecure-CHANGE-THIS-IN-PRODUCTION')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    
    # Local apps
    'apps.core',
    'apps.authentication',
    'apps.inventario',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS debe estar aquí
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'es-co'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User Model
AUTH_USER_MODEL = 'authentication.CustomUser'

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}

# JWT Settings
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
}
```

**Archivo: `config/settings/development.py`**
```python
"""
Settings para entorno de desarrollo local.
"""
from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='inventario_escolar'),
        'USER': config('DB_USER', default='postgres'),
        'PASSWORD': config('DB_PASSWORD', default='postgres'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True

# Django Debug Toolbar
INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
INTERNAL_IPS = ['127.0.0.1']
```

**Archivo: `config/settings/production.py`**
```python
"""
Settings para entorno de producción.
"""
from .base import *

DEBUG = False

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# CORS (más restrictivo en producción)
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
```

---

### Tarea 0.6: Variables de Entorno

**Archivo: `backend/.env.example`**
```bash
# Django
DJANGO_ENV=development
SECRET_KEY=django-insecure-CHANGE-THIS-IN-PRODUCTION
DEBUG=True

# Database
DB_NAME=inventario_escolar
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

**Archivo: `backend/.env`**
```bash
# Copiar desde .env.example
cp .env.example .env

# Editar valores si es necesario
nano .env  # o vim, code, etc.
```

**⚠️ IMPORTANTE:**
```bash
# Asegurarse de que .env está en .gitignore
echo ".env" >> .gitignore
```

---

### Tarea 0.7: Crear Apps Django

```bash
cd backend

# Crear apps (ya existen los directorios, solo registrar)
python manage.py startapp core apps/core
python manage.py startapp authentication apps/authentication
python manage.py startapp inventario apps/inventario

# Limpiar archivos autogenerados innecesarios
rm apps/core/models.py apps/core/views.py
rm apps/authentication/models.py apps/authentication/views.py
rm apps/inventario/models.py apps/inventario/views.py
```

**Configurar apps en `apps/core/apps.py`:**
```python
from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.core'
    verbose_name = 'Core'
```

**Similar para `authentication` e `inventario`.**

---

### Tarea 0.8: URLs Base

**Archivo: `config/urls.py`**
```python
"""
URLs raíz del proyecto.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.authentication.urls')),
    path('api/v1/inventario/', include('apps.inventario.urls')),
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    # Django Debug Toolbar
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
```

**Archivo: `apps/authentication/urls.py`**
```python
"""
URLs de autenticación.
"""
from django.urls import path

app_name = 'authentication'

urlpatterns = [
    # Agregar endpoints en Fase 1
]
```

**Archivo: `apps/inventario/urls.py`**
```python
"""
URLs de inventario.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

app_name = 'inventario'

router = DefaultRouter()

# Registrar viewsets en Fase 2

urlpatterns = [
    path('', include(router.urls)),
]
```

---

### Tarea 0.9: Verificar Backend

```bash
cd backend

# Verificar configuración
python manage.py check

# Debe mostrar:
# System check identified no issues (0 silenced).
```

**Si hay errores:**
- Revisar imports en settings
- Verificar que todas las apps estén instaladas
- Revisar sintaxis en archivos Python

---

## ⚛️ FRONTEND: SETUP NEXT.JS

### Tarea 0.10: Inicializar Next.js

```bash
cd inventario-escolar/frontend

# Inicializar proyecto Next.js con opciones específicas
npx create-next-app@latest . --typescript --tailwind --app --import-alias "@/*"

# Responder:
# ✔ Would you like to use TypeScript? … Yes
# ✔ Would you like to use ESLint? … Yes
# ✔ Would you like to use Tailwind CSS? … Yes
# ✔ Would you like your code inside a `src/` directory? … No
# ✔ Would you like to use App Router? … Yes
# ✔ Would you like to use Turbopack for next dev? … Yes
# ✔ Would you like to customize the import alias? … No
```

**Estructura generada:**
```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
├── node_modules/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

### Tarea 0.11: Instalar Dependencias Adicionales

```bash
cd frontend

# Zustand (estado global)
npm install zustand

# TanStack Query (data fetching)
npm install @tanstack/react-query

# Zod (validación)
npm install zod react-hook-form @hookform/resolvers

# Axios (HTTP client)
npm install axios

# Date utilities
npm install date-fns

# Excel processing (frontend)
npm install xlsx

# React Data Grid (para batch edit)
npm install react-data-grid
```

**Validación:**
```bash
npm list | grep -E "zustand|react-query|zod|axios"
```

---

### Tarea 0.12: Instalar shadcn/ui

```bash
cd frontend

# Inicializar shadcn/ui
npx shadcn@latest init

# Responder:
# ✔ Prefered style: Default
# ✔ Base color: Slate
# ✔ CSS variables: Yes
```

**Instalar componentes iniciales:**
```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add select
npx shadcn@latest add alert
npx shadcn@latest add dialog
npx shadcn@latest add form
```

**Validación:**
```bash
# Verificar que se creó la carpeta components/ui
ls components/ui/

# Debe mostrar:
# button.tsx  input.tsx  label.tsx  card.tsx  table.tsx  ...
```

---

### Tarea 0.13: Estructura de Directorios Frontend

```bash
cd frontend

# Crear directorios
mkdir -p components/{layout,items,catalogos,auth,common}
mkdir -p lib/{api,stores,hooks,schemas,utils}
mkdir -p types
mkdir -p app/\(auth\)/login
mkdir -p app/\(dashboard\)/{items,catalogos}
```

**Estructura resultante:**
```
frontend/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── items/
│   │   │   └── page.tsx
│   │   └── catalogos/
│   │       └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/              # shadcn/ui (no modificar)
│   ├── layout/
│   ├── items/
│   ├── catalogos/
│   ├── auth/
│   └── common/
├── lib/
│   ├── api/
│   ├── stores/
│   ├── hooks/
│   ├── schemas/
│   └── utils/
└── types/
```

---

### Tarea 0.14: Configurar Variables de Entorno Frontend

**Archivo: `.env.local.example`**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**Archivo: `.env.local`**
```bash
# Copiar desde .env.local.example
cp .env.local.example .env.local
```

**⚠️ IMPORTANTE:**
```bash
# Verificar que .env.local está en .gitignore
cat .gitignore | grep .env.local
# Debe aparecer
```

---

### Tarea 0.15: Configurar Tailwind CSS

**Archivo: `tailwind.config.ts`**
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // ... resto de colores de shadcn/ui
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

### Tarea 0.16: Verificar Frontend

```bash
cd frontend

# Iniciar servidor de desarrollo
npm run dev

# Abrir navegador en http://localhost:3000
# Debe mostrar la página de inicio de Next.js
```

**Validación:**
- [ ] Servidor inicia sin errores
- [ ] Página carga en `http://localhost:3000`
- [ ] No hay errores en consola del navegador

---

## 🐘 BASE DE DATOS: POSTGRESQL

### Tarea 0.17: Crear Base de Datos

**macOS/Linux:**
```bash
# Conectar a PostgreSQL
psql -U postgres

# En el prompt de psql:
CREATE DATABASE inventario_escolar;
CREATE USER inventario_user WITH PASSWORD 'postgres';
ALTER ROLE inventario_user SET client_encoding TO 'utf8';
ALTER ROLE inventario_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE inventario_user SET timezone TO 'America/Bogota';
GRANT ALL PRIVILEGES ON DATABASE inventario_escolar TO inventario_user;

# Salir
\q
```

**Windows:**
```powershell
# Abrir SQL Shell (psql)
# Conectar con usuario postgres

CREATE DATABASE inventario_escolar;
CREATE USER inventario_user WITH PASSWORD 'postgres';
ALTER ROLE inventario_user SET client_encoding TO 'utf8';
ALTER ROLE inventario_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE inventario_user SET timezone TO 'America/Bogota';
GRANT ALL PRIVILEGES ON DATABASE inventario_escolar TO inventario_user;
```

**Validación:**
```bash
# Listar bases de datos
psql -U postgres -c "\l"

# Debe aparecer inventario_escolar
```

---

### Tarea 0.18: Probar Conexión desde Django

```bash
cd backend
source venv/bin/activate  # Si no está activado

# Verificar conexión
python manage.py dbshell

# En el prompt de psql:
\dt  # Listar tablas (debe estar vacío aún)
\q   # Salir
```

**Si hay error de conexión:**
- Revisar variables en `.env`
- Verificar que PostgreSQL está corriendo: `pg_isready`
- Verificar que el usuario tiene permisos

---

### Tarea 0.19: Ejecutar Migraciones Iniciales

```bash
cd backend

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Debe crear tablas de Django (auth, admin, sessions, etc.)
```

**Validación:**
```bash
# Conectar a la BD
python manage.py dbshell

# Listar tablas
\dt

# Debe mostrar:
# django_migrations
# django_content_type
# auth_user
# auth_group
# ... etc
```

---

## 🔧 GIT Y CONTROL DE VERSIONES

### Tarea 0.20: Inicializar Git

```bash
cd inventario-escolar

# Inicializar repositorio
git init

# Verificar
git status
```

---

### Tarea 0.21: Crear .gitignore

**Archivo: `.gitignore` (raíz del proyecto)**
```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
.venv/

# Django
*.log
db.sqlite3
media/
staticfiles/

# Environment
.env
.env.local
.env.*.local

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
.next/
out/
build/

# Testing
coverage/
.pytest_cache/
```

---

### Tarea 0.22: Primer Commit

```bash
cd inventario-escolar

# Agregar todos los archivos
git add .

# Verificar archivos a commitear
git status

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

## ✅ VALIDACIÓN FINAL

### Checklist Fase 0

```markdown
## Backend
- [ ] Estructura de directorios creada
- [ ] Entorno virtual activado
- [ ] Django 5.2 instalado
- [ ] Requirements instalados correctamente
- [ ] Proyecto Django inicializado
- [ ] Settings configurados (base, dev, prod)
- [ ] PostgreSQL creado y conectado
- [ ] Variables de entorno configuradas (.env)
- [ ] Apps creadas (core, authentication, inventario)
- [ ] URLs base configuradas
- [ ] `python manage.py check` sin errores
- [ ] `python manage.py migrate` ejecutado exitosamente
- [ ] Servidor Django inicia: `python manage.py runserver`

## Frontend
- [ ] Next.js 16 inicializado con TypeScript
- [ ] Dependencias instaladas (Zustand, TanStack Query, Zod, etc.)
- [ ] shadcn/ui configurado
- [ ] Componentes UI base instalados
- [ ] Estructura de carpetas creada
- [ ] Variables de entorno configuradas (.env.local)
- [ ] `npm run dev` inicia sin errores
- [ ] Página de inicio visible en http://localhost:3000
- [ ] No hay errores en consola del navegador

## Base de Datos
- [ ] PostgreSQL 16 instalado
- [ ] Base de datos `inventario_escolar` creada
- [ ] Usuario `inventario_user` creado con permisos
- [ ] Conexión desde Django funciona
- [ ] Migraciones iniciales aplicadas
- [ ] Tablas de Django creadas correctamente

## Git
- [ ] Repositorio Git inicializado
- [ ] .gitignore configurado correctamente
- [ ] .env y .env.local NO están en Git
- [ ] Primer commit realizado
- [ ] `git log` muestra el commit inicial

## Documentación
- [ ] README.md creado con instrucciones básicas
- [ ] .env.example creados (backend y frontend)
- [ ] Comentarios en código explicativos

## Verificación Final
- [ ] Backend responde en http://localhost:8000
- [ ] Frontend responde en http://localhost:3000
- [ ] No hay errores en ningún terminal
- [ ] Ambos servidores se pueden detener y reiniciar sin problemas
```

---

### Script de Validación Automática

**Archivo: `scripts/validate-phase-0.sh`**
```bash
#!/bin/bash

echo "🔍 Validando Fase 0..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Backend
echo "📦 Backend:"
cd backend

if [ -d "venv" ]; then
    echo -e "${GREEN}✓${NC} Entorno virtual existe"
else
    echo -e "${RED}✗${NC} Entorno virtual NO existe"
fi

source venv/bin/activate 2>/dev/null

if python manage.py check &>/dev/null; then
    echo -e "${GREEN}✓${NC} Django check pasa"
else
    echo -e "${RED}✗${NC} Django check FALLA"
fi

if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env existe"
else
    echo -e "${RED}✗${NC} .env NO existe"
fi

cd ..

# Frontend
echo ""
echo "⚛️  Frontend:"
cd frontend

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules existe"
else
    echo -e "${RED}✗${NC} node_modules NO existe"
fi

if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local existe"
else
    echo -e "${RED}✗${NC} .env.local NO existe"
fi

if [ -d "components/ui" ]; then
    echo -e "${GREEN}✓${NC} shadcn/ui instalado"
else
    echo -e "${RED}✗${NC} shadcn/ui NO instalado"
fi

cd ..

# Git
echo ""
echo "🔧 Git:"

if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Repositorio Git inicializado"
else
    echo -e "${RED}✗${NC} Repositorio Git NO inicializado"
fi

if git log &>/dev/null; then
    echo -e "${GREEN}✓${NC} Hay al menos 1 commit"
else
    echo -e "${RED}✗${NC} No hay commits"
fi

echo ""
echo "✅ Validación completada"
```

**Ejecutar:**
```bash
chmod +x scripts/validate-phase-0.sh
./scripts/validate-phase-0.sh
```

---

## 🔧 TROUBLESHOOTING

### Problema: "python3.13: command not found"

**Solución:**
```bash
# macOS
brew install python@3.13

# Ubuntu/Debian
sudo apt install python3.13

# Verificar
python3.13 --version
```

---

### Problema: "psycopg error: pg_config not found"

**Solución:**
```bash
# macOS
brew install postgresql@16

# Ubuntu/Debian
sudo apt install libpq-dev

# Reinstalar psycopg
pip install --break-system-packages --force-reinstall psycopg==3.2.3
```

---

### Problema: "FATAL: role 'postgres' does not exist"

**Solución:**
```bash
# Crear usuario postgres
createuser -s postgres

# O usar el usuario por defecto del sistema
psql -U $(whoami) postgres
```

---

### Problema: "Port 8000 already in use"

**Solución:**
```bash
# Encontrar proceso
lsof -i :8000

# Matar proceso
kill -9 <PID>

# O usar otro puerto
python manage.py runserver 8001
```

---

### Problema: "Cannot find module 'next'"

**Solución:**
```bash
cd frontend

# Limpiar cache
rm -rf node_modules package-lock.json

# Reinstalar
npm install

# Verificar
npm run dev
```

---

## 📝 SIGUIENTE PASO

Una vez completada y validada la Fase 0:

**✅ Validar con el checklist completo**

**✅ Ejecutar script de validación**

**✅ Hacer commit final de Fase 0**

**➡️ Continuar con Fase 1: Modelos + Autenticación**

Ver documento: `docs/specs/05-FASES-1-7.md`

---

## 📚 RECURSOS ADICIONALES

### Comandos Útiles

**Backend:**
```bash
# Activar entorno
source venv/bin/activate  # Linux/macOS
.\venv\Scripts\Activate.ps1  # Windows

# Servidor desarrollo
python manage.py runserver

# Shell interactivo
python manage.py shell

# Crear superusuario
python manage.py createsuperuser

# Ver SQL de migraciones
python manage.py sqlmigrate <app> <migration_number>
```

**Frontend:**
```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Iniciar producción
npm start

# Linting
npm run lint
```

**Git:**
```bash
# Ver estado
git status

# Ver log
git log --oneline

# Ver diferencias
git diff

# Ver ramas
git branch
```

---

**Documento generado:** Noviembre 16, 2025  
**Versión:** 2.0  
**Próximo:** Fases 1-7 completas
```

---