# 🚀 Guía de Despliegue - Sistema de Inventario Escolar

## 📋 Análisis de Viabilidad - Planes Gratuitos

### ✅ **SÍ ES POSIBLE** desplegar gratuitamente, pero con limitaciones:

#### **Frontend (Next.js) - Vercel Free Tier**
- ✅ **100% GRATIS** para proyectos personales
- ✅ Deploy automático desde Git
- ✅ SSL/HTTPS incluido
- ✅ Edge Functions
- ✅ 100 GB bandwidth/mes
- ✅ Dominio personalizado gratis
- ⚠️ Límite: 1 build concurrente

#### **Backend (Django) - Railway Free Tier**
- ⚠️ **LIMITADO**: Railway eliminó su plan gratuito permanente en agosto 2023
- **Opciones actuales:**
  - Trial gratuito: $5 de crédito inicial (dura ~1 mes)
  - Después requiere tarjeta de crédito
  - Plan Hobby: ~$5/mes

#### **Base de Datos PostgreSQL**
- ⚠️ Railway: Requiere plan de pago
- ✅ **Alternativas gratuitas:**
  - **Supabase**: 500 MB gratis
  - **Neon**: 512 MB gratis
  - **ElephantSQL**: 20 MB gratis
  - **Render**: 90 días gratis PostgreSQL

---

## 🎯 Alternativa 100% Gratuita Recomendada

### Opción 1: **Render.com** (Más estable)
- ✅ Frontend Next.js: GRATIS
- ✅ Backend Django: GRATIS (con limitaciones)
- ✅ PostgreSQL: GRATIS (90 días)
- ⚠️ Backend entra en "sleep" después de 15 min de inactividad
- ⚠️ Cold start: 50-60 segundos al despertar

### Opción 2: **Railway** (Solo para pruebas)
- Trial de $5 USD (suficiente para ~1 mes)
- Mejor rendimiento que Render
- No tiene "sleep mode"

### Opción 3: **Vercel + PythonAnywhere** (100% Gratis permanente)
- ✅ Frontend: Vercel
- ✅ Backend Django: PythonAnywhere (plan gratuito)
- ⚠️ PythonAnywhere: CPU limitado, 512 MB storage

---

## 📦 Preparación del Proyecto

### 1. Archivos Necesarios para Railway/Render (Backend)

#### `railway.json` o `render.yaml`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python manage.py migrate && gunicorn config.wsgi:application",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### `Procfile` (para Railway/Render/Heroku)
```
web: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
release: python manage.py migrate
```

#### `runtime.txt` (Especificar versión de Python)
```
python-3.12.0
```

#### `.env.production` (NO subir a Git - solo referencia)
```env
# Django
DJANGO_ENV=production
SECRET_KEY=tu-secret-key-super-segura-aqui
DEBUG=False

# Database (Railway/Render proporcionará DATABASE_URL)
DATABASE_URL=postgresql://user:password@host:port/dbname

# Hosts permitidos
ALLOWED_HOSTS=tu-app.up.railway.app,tu-dominio.com

# CORS (URL del frontend en Vercel)
CORS_ALLOWED_ORIGINS=https://tu-frontend.vercel.app

# Media/Static (usar S3 o Railway Volumes en producción)
STATIC_URL=/static/
MEDIA_URL=/media/
```

### 2. Archivos Necesarios para Vercel (Frontend)

#### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://tu-backend.up.railway.app/api/:path*"
    }
  ]
}
```

#### `.env.production` (Variables de entorno en Vercel)
```env
NEXT_PUBLIC_API_URL=https://tu-backend.up.railway.app/api/v1
```

---

## 🔧 Configuraciones Necesarias

### Backend Django - Ajustes para Producción

#### `config/settings/production.py` - Mejoras necesarias:

```python
import os
import dj_database_url
from .base import *

DEBUG = False

# Hosts permitidos desde variable de entorno
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')

# Database - Usar DATABASE_URL de Railway/Render
DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# CORS - Permitir frontend de Vercel
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')
CORS_ALLOW_CREDENTIALS = True

# Static files - WhiteNoise (para servir estáticos sin S3)
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
CSRF_TRUSTED_ORIGINS = config('CSRF_TRUSTED_ORIGINS', default='').split(',')

# Media files - Usar Railway Volumes o S3
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
```

#### Actualizar `requirements/production.txt`:

```txt
-r base.txt

# Production server
gunicorn==23.0.0
whitenoise==6.6.0
dj-database-url==2.1.0

# Excel processing
pandas==2.2.3
openpyxl==3.1.5
```

---

## 🚀 Pasos de Despliegue

### Fase 1: Preparar el Código

```bash
# 1. Crear archivos de configuración (ya incluidos arriba)
# 2. Actualizar requirements
# 3. Commit y push a GitHub
git add .
git commit -m "Configuración para despliegue en producción"
git push origin main
```

### Fase 2: Desplegar Backend en Railway

1. **Crear cuenta en Railway**: https://railway.app
2. **Nuevo Proyecto**: "New Project" → "Deploy from GitHub repo"
3. **Seleccionar repo**: Autorizar y seleccionar tu repositorio
4. **Configurar variables de entorno**:
   ```
   DJANGO_ENV=production
   SECRET_KEY=genera-una-clave-segura-con-django
   DEBUG=False
   ALLOWED_HOSTS=*.up.railway.app,*.railway.app
   CORS_ALLOWED_ORIGINS=https://tu-app.vercel.app
   ```
5. **Agregar PostgreSQL**: "+ New" → "Database" → "PostgreSQL"
   - Railway automáticamente crea `DATABASE_URL`
6. **Root Directory**: Configurar en settings → `/backend`
7. **Start Command**: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
8. **Deploy**: Railway detectará cambios automáticamente

### Fase 3: Desplegar Frontend en Vercel

1. **Crear cuenta en Vercel**: https://vercel.com
2. **Importar proyecto**: "Add New" → "Project"
3. **Seleccionar repo** desde GitHub
4. **Configuración**:
   - Framework Preset: **Next.js**
   - Root Directory: **`frontend`**
   - Build Command: `npm run build` (auto-detectado)
   - Output Directory: `.next` (auto-detectado)
5. **Variables de entorno**:
   ```
   NEXT_PUBLIC_API_URL=https://tu-backend.up.railway.app/api/v1
   ```
6. **Deploy**: Click en "Deploy"

### Fase 4: Configurar CORS y Dominios

1. **En Railway** (Backend):
   - Copiar la URL generada: `https://tu-app.up.railway.app`
   - Actualizar variable `CORS_ALLOWED_ORIGINS` con la URL de Vercel

2. **En Vercel** (Frontend):
   - Copiar la URL: `https://tu-app.vercel.app`
   - Volver a Railway y agregar esta URL a `CORS_ALLOWED_ORIGINS`
   - Agregar también a `CSRF_TRUSTED_ORIGINS`

3. **Verificar conexión**:
   - Abrir frontend en Vercel
   - Verificar que puede comunicarse con el backend

---

## ⚠️ Limitaciones del Plan Gratuito

### Railway (Trial $5):
- ⏱️ Crédito se agota en ~30 días
- 💾 500 MB de storage
- 🚀 Sin sleep mode (mejor rendimiento)
- Después necesitarás migrar o pagar

### Render (Free Tier):
- 😴 Backend entra en sleep después de 15 min inactivo
- ⏰ Cold start de 50-60 segundos
- 💾 PostgreSQL gratis solo 90 días
- Después DB requiere pago o migración

### Vercel (Free Tier):
- ✅ Sin limitaciones significativas para este proyecto
- 📊 100 GB bandwidth/mes (suficiente)
- ⚡ Edge functions incluidas

---

## 🎓 Recomendación Final

### Para **desarrollo/demo/pruebas** (Corto plazo):
1. **Frontend**: Vercel (gratis permanente)
2. **Backend**: Railway con trial $5 (1 mes)
3. **DB**: PostgreSQL de Railway (incluido)

### Para **producción** (Largo plazo):
1. **Frontend**: Vercel (gratis permanente)
2. **Backend**: Render free tier (con sleep mode) o Railway $5/mes
3. **DB**: Supabase (500 MB gratis) o Neon (512 MB gratis)

### Para **100% gratis permanente** (Con limitaciones):
1. **Frontend**: Vercel
2. **Backend**: PythonAnywhere Free Tier
3. **DB**: Supabase o Neon

---

## 🆘 Solución de Problemas Comunes

### Error: "ALLOWED_HOSTS"
```python
# Agregar en variables de entorno:
ALLOWED_HOSTS=.railway.app,.up.railway.app,localhost
```

### Error: CORS
```python
# Verificar que CORS incluye el dominio de Vercel:
CORS_ALLOWED_ORIGINS=https://tu-app.vercel.app,https://tu-app-git-main.vercel.app
```

### Error: Static files no se cargan
```bash
# Ejecutar collectstatic en Railway:
python manage.py collectstatic --noinput
```

### Error: Migraciones
```bash
# Railway debe ejecutar automáticamente, pero puedes forzar:
python manage.py migrate --noinput
```

---

## 📞 Siguiente Paso

**¿Qué prefieres?**

1. **Opción A**: Despliegue en Railway (trial $5) + Vercel → Mejor rendimiento, 1 mes gratis
2. **Opción B**: Despliegue en Render (free) + Vercel → 100% gratis pero con sleep mode
3. **Opción C**: Otro servicio alternativo

Dime cuál prefieres y creo los archivos de configuración específicos para ese servicio.
