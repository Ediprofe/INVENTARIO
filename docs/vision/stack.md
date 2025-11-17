# Stack Tecnológico - Sistema de Inventario Escolar

**Versión:** 1.0
**Última actualización:** Noviembre 17, 2025
**Fuente única de verdad** para versiones y tecnologías del proyecto

---

## 🎯 Stack Principal

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Python** | 3.13+ | Lenguaje principal |
| **Django** | 5.2 | Framework web |
| **Django REST Framework** | 3.16.1 | API REST |
| **PostgreSQL** | 16.6+ | Base de datos |
| **psycopg** | 3.2.3 | Adaptador PostgreSQL |

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 22.x LTS | Runtime JavaScript |
| **Next.js** | 16 | Framework React |
| **React** | 19 | Librería UI |
| **TypeScript** | 5.7 | Tipado estático |
| **Tailwind CSS** | 3.x | Framework CSS |
| **shadcn/ui** | Latest | Componentes UI |

---

## 📦 Dependencias Backend

### Core
```txt
Django==5.2
djangorestframework==3.16.1
psycopg==3.2.3
python-decouple==3.8
```

### Autenticación
```txt
djangorestframework-simplejwt==5.4.0
```

### Utilidades
```txt
django-cors-headers==4.6.0
django-filter==24.3
Pillow==11.0.0
```

### Excel Processing
```txt
pandas==2.2.3
openpyxl==3.1.5
```

### Development
```txt
ipython==8.30.0
django-debug-toolbar==4.4.6
django-extensions==3.2.3
```

### Testing
```txt
pytest==8.3.4
pytest-django==4.9.0
pytest-cov==6.0.0
factory-boy==3.3.1
```

### Linting & Formatting
```txt
ruff==0.8.4
black==24.10.0
isort==5.13.2
mypy==1.13.0
django-stubs==5.1.1
```

### Production
```txt
gunicorn==23.0.0
```

---

## 📦 Dependencias Frontend

### Core
```json
{
  "next": "^16.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.7.0"
}
```

### Estado y Data Fetching
```json
{
  "zustand": "^5.0.0",
  "@tanstack/react-query": "^5.0.0"
}
```

### Formularios y Validación
```json
{
  "react-hook-form": "^7.0.0",
  "zod": "^3.0.0",
  "@hookform/resolvers": "^3.0.0"
}
```

### HTTP Client
```json
{
  "axios": "^1.6.0"
}
```

### UI Components
```json
{
  "tailwindcss": "^3.4.0",
  "@radix-ui/react-*": "^1.0.0"
}
```

### Utilidades
```json
{
  "date-fns": "^3.0.0",
  "xlsx": "^0.18.0",
  "react-data-grid": "^7.0.0"
}
```

---

## 🔧 Herramientas de Desarrollo

### Control de Versiones
- **Git** 2.x+
- **GitHub** (repositorio remoto)

### IDEs / Editores
- **VS Code** (recomendado)
- **Cursor** (AI coding)
- **PyCharm** (alternativa)

### Containerización
- **Docker** 24.x+ (Fase 7)
- **Docker Compose** 2.x+ (Fase 7)

### CI/CD (Futuro)
- **GitHub Actions** (a implementar)
- **Pre-commit hooks** (a configurar)

---

## 🌍 Navegadores Soportados

### Desktop
- Chrome 100+
- Firefox 100+
- Safari 15+
- Edge 100+

### Mobile (opcional)
- Chrome Mobile
- Safari iOS 15+

---

## ⚙️ Requisitos del Sistema

### Desarrollo Local

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| **RAM** | 8 GB | 16 GB |
| **CPU** | 4 cores | 8 cores |
| **Disco** | 20 GB libres | 50 GB libres |
| **SO** | macOS 12+, Ubuntu 20.04+, Windows 10+ | macOS 14+, Ubuntu 22.04+ |

### Producción (Estimado)

| Componente | MVP | Escalado |
|------------|-----|----------|
| **RAM** | 2 GB | 8 GB |
| **CPU** | 2 vCPUs | 4 vCPUs |
| **Disco** | 20 GB | 100 GB |
| **Ancho de banda** | 1 TB/mes | 5 TB/mes |

---

## 📝 Notas de Actualización

### Política de Versiones
- **Major updates**: Solo con aprobación del equipo
- **Minor updates**: Revisar changelog antes de actualizar
- **Patch updates**: Aplicar regularmente por seguridad

### Frecuencia de Actualización
- **Dependencias de seguridad**: Inmediatamente
- **Dependencias principales**: Cada 3 meses
- **Dependencias de desarrollo**: Cada 6 meses

---

## 🔗 Referencias

- [Django Releases](https://www.djangoproject.com/download/)
- [Next.js Releases](https://github.com/vercel/next.js/releases)
- [PostgreSQL Versions](https://www.postgresql.org/support/versioning/)
- [Node.js Releases](https://nodejs.org/en/about/previous-releases)

---

**Mantenido por:** Equipo de desarrollo
**Última revisión:** 2025-11-17
