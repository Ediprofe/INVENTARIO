Perfecto, continúo generando los archivos actualizados.

ARCHIVO 1 (continuación): GUIA-RAPIDA.md
markdown### 2. CRUD de Items
- GET /api/v1/inventario/items/ (paginado, filtros)
- POST /api/v1/inventario/items/
- GET/PUT/PATCH/DELETE /api/v1/inventario/items/{id}/

**Frontend:**
- Tabla con filtros avanzados
- Búsqueda en tiempo real (debounce 300ms)
- Paginación: 50 ítems/página

### 3. Import/Export Excel (CRITICO)

**Importación:**
- POST /api/v1/inventario/items/import/
- Validación exhaustiva por fila
- **Auto-creación de Artículos** con get_or_create()
- Transacción atómica (todo o nada)

**Flujo:**
1. Usuario sube .xlsx (< 5MB)
2. Backend lee con pandas
3. Valida CADA fila (código único, relaciones, rangos)
4. Si errores → reporte detallado
5. Si OK → get_or_create artículos + bulk_create ítems + historial

**Columnas Excel:**
| Columna | Requerido | Notas |
|---------|-----------|-------|
| codigo | Sí | Único |
| sede_codigo | Sí | Debe existir |
| ubicacion_nombre | Sí | Debe existir |
| responsable_documento | Sí | Debe existir |
| articulo_codigo | Sí | Se crea si no existe |
| articulo_nombre | Sí* | *Si artículo no existe |
| articulo_categoria | Sí* | *Si artículo no existe |
| cantidad | Sí | 1-9999 |
| valor_unitario | Sí | >= 0 |

Ver detalles: `docs/specs/0. Requerimientos-DETALLADOS.md` (buscar "RF-004: Importación")

### 4. Edición Masiva (MVP+ PRIORIDAD)

- PATCH /api/v1/inventario/items/batch-update/

**Frontend:**
- Modal con react-data-grid
- Columnas editables: Ubicación, Responsable, Cantidad, Valor, Estado
- Validación por celda en tiempo real
- Transacción atómica

Ver specs: `docs/specs/0. Requerimientos-DETALLADOS.md` (buscar "RF-005: Edición Masiva")

---

## 📐 ESTANDARES DE CODIGO

### Límites
| Tipo | Máximo |
|------|--------|
| Archivo Python/TS | 300 líneas |
| Función/Método | 50 líneas |
| Línea código | 100 caracteres |

### Nomenclatura

**Python:**
```python
# Variables/funciones: snake_case
total_items = 100
def calcular_total(items): pass

# Clases: PascalCase
class ItemInventario(models.Model): pass

# Constantes: UPPER_SNAKE_CASE
MAX_PAGE_SIZE = 100
```

**TypeScript:**
```typescript
// Componentes: PascalCase
export function ItemsTable() {}

// Variables/funciones: camelCase
const fetchItems = async () => {}

// Interfaces: PascalCase con I
interface IItem { id: number }

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8000'
```

### Validación Obligatoria
- Docstrings en Python
- Type hints en Python
- Zod en formularios React
- TypeScript strict mode

---

## 🚀 FASES DEL PROYECTO

### Fase 0: Preparación (1-2 días)
- Estructura de directorios
- Django + PostgreSQL
- Next.js + shadcn/ui
- Variables de entorno

Ver paso a paso: `docs/specs/Metodologia.md`

### Fase 1: Modelos + Auth (3-4 días)
- Modelos Django completos
- Migraciones
- JWT autenticación
- Tests > 90%

### Fase 2: API + Serializers (3-4 días)
- Serializers
- ViewSets con filtros
- Paginación
- Tests API

### Fase 3: Frontend MVP (5-6 días)
- ItemsTable con filtros
- CRUD completo
- Catálogos
- Dashboard

### Fase 4: Import/Export (3-4 días)
- Importación con validación
- Auto-creación artículos
- Exportación
- Componentes upload/download

### Fase 5: Modal Batch Edit (3-4 días)
- Endpoint batch-update
- Modal react-data-grid
- Validación por celda
- Transacción atómica

### Fase 6: Polish + Tests (2-3 días)
- Tests E2E
- Optimización queries
- UX improvements

### Fase 7: Docker + Deploy (2-3 días)
- Dockerfiles
- docker-compose
- nginx
- Variables producción

---

## 🏗️ ESTRUCTURA DIRECTORIOS
```
inventario-escolar/
├── backend/
│   ├── config/settings/
│   │   ├── base.py, development.py, production.py
│   ├── apps/
│   │   ├── core/
│   │   ├── authentication/
│   │   └── inventario/
│   │       ├── models/
│   │       ├── serializers/
│   │       ├── views/
│   │       └── tests/
│   └── requirements/
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/login/
│   │   └── (dashboard)/
│   ├── components/
│   │   ├── ui/ (shadcn)
│   │   ├── items/
│   │   └── catalogos/
│   ├── lib/
│   │   ├── api/, stores/, hooks/, schemas/
│   └── types/
│
├── docs/
│   ├── specs/ (documentación detallada)
│   ├── GUIA-RAPIDA.md (este archivo)
│   ├── ESTADO.md (estado actual)
│   └── CHANGELOG.md (histórico)
│
└── .claude/
    └── CONTEXTO.md (para nuevas sesiones)
```

---

## 🔗 ENDPOINTS PRINCIPALES

**Auth:**
```
POST /api/v1/auth/login/
POST /api/v1/auth/refresh/
POST /api/v1/auth/logout/
```

**Items:**
```
GET    /api/v1/inventario/items/
POST   /api/v1/inventario/items/
GET    /api/v1/inventario/items/{id}/
PUT    /api/v1/inventario/items/{id}/
PATCH  /api/v1/inventario/items/{id}/
DELETE /api/v1/inventario/items/{id}/
POST   /api/v1/inventario/items/import/
GET    /api/v1/inventario/items/export/
PATCH  /api/v1/inventario/items/batch-update/
```

**Catálogos:**
```
GET/POST /api/v1/inventario/sedes/
GET/POST /api/v1/inventario/ubicaciones/
GET/POST /api/v1/inventario/responsables/
GET/POST /api/v1/inventario/articulos/
```

---

## ⚙️ COMANDOS RAPIDOS
```bash
# Backend
cd backend && source venv/bin/activate
python manage.py runserver
python manage.py makemigrations
python manage.py migrate
pytest

# Frontend
cd frontend
npm run dev
npm run build

# Git
git status
git add .
git commit -m "feat(fase): descripción"
```

---

## 📚 REFERENCIAS A DOCS DETALLADAS

**Código de ejemplo completo:**
- Modelos: `docs/specs/0. Requerimientos-DETALLADOS.md` (buscar "class ItemInventario")
- Serializers: `docs/specs/0. Requerimientos-DETALLADOS.md` (buscar "ItemSerializer")
- Views: `docs/specs/0. Requerimientos-DETALLADOS.md` (buscar "ItemViewSet")
- Componentes React: `docs/specs/1. Estandares-codigo.md`

**Flujos detallados:**
- Importación Excel: `docs/specs/0. Requerimientos-DETALLADOS.md` (buscar "RF-004")
- Modal batch edit: `docs/specs/0. Requerimientos-DETALLADOS.md` (buscar "RF-005")
- Autenticación: `docs/specs/0. Requerimientos-DETALLADOS.md` (buscar "RF-001")

**Metodología:**
- Fase 0 paso a paso: `docs/specs/Metodologia.md`
- Plantillas prompts: `docs/specs/Metodologia.md` (buscar "PLANTILLA")
- Checklists: `docs/specs/Metodologia.md` (buscar "Checklist")

---

## ⚠️ NOTAS CRITICAS

1. **NO cambiar el stack** - Tecnologías definitivas
2. **Validación doble** - SIEMPRE cliente + servidor
3. **Límite 300 líneas** - Dividir si se excede
4. **Tests obligatorios** - Coverage mínimo 85%
5. **Historial automático** - En cada modificación
6. **Transacciones atómicas** - En batch e import
7. **Auto-creación artículos** - get_or_create en import
8. **shadcn/ui desde inicio** - NO cambiar después

---

**Documento generado:** Noviembre 16, 2025  
**Fuente:** Consolidación de documentos detallados  
**Uso:** Lectura rápida en cada sesión nueva

ARCHIVO 2: ESTADO.md (actualizado)
Ubicación: docs/ESTADO.md
Acción: Reemplaza todo el contenido con esto:
markdown# ESTADO DEL PROYECTO
**Actualizado:** 2025-11-16 | **Sesión:** #1

---

## 📍 AHORA MISMO

**Fase:** 0 - Preparación de Documentación  
**Tarea actual:** Adaptación de documentos para desarrollo  
**Último commit:** Inicial (documentación base)

---

## ✅ FUNCIONA

- ✅ Repositorio Git inicializado
- ✅ Estructura de documentación creada
- ✅ Documentación detallada en `docs/specs/`
- ✅ Guía rápida consolidada generada
- ✅ Metodología de trabajo definida

---

## ⚠️ NO FUNCIONA / PENDIENTE

- 📝 Backend: No iniciado
- 📝 Frontend: No iniciado
- 📝 Base de datos: No creada
- 📝 Código: Ninguno generado aún

---

## 📋 PROXIMA TAREA

**Fase 0.1:** Crear estructura de carpetas backend  
**Detalles:** Ver `docs/specs/Metodologia.md` - Tarea 0.1

---

## 💡 DECISIONES TOMADAS

**#1:** Stack tecnológico definitivo aprobado  
- Django 5.2 + Next.js 16 + PostgreSQL 16
- No negociable

**#2:** Metodología simplificada aprobada  
- Claude actualiza documentación
- Edilberto solo copia/pega

**#3:** Estructura de documentación de 3 niveles  
- specs/ (detallado)
- GUIA-RAPIDA.md (esencial)
- ESTADO.md + CHANGELOG.md (vivo)

---

## 📁 ARCHIVOS CLAVE
```
docs/
├── specs/
│   ├── 0. Requerimientos-DETALLADOS.md
│   ├── 1. Estandares-codigo.md
│   ├── 2. Fases.md
│   ├── 2.1-fases_perspectiva.md
│   └── Metodologia.md
├── GUIA-RAPIDA.md (referencia rápida)
├── ESTADO.md (este archivo)
└── CHANGELOG.md (histórico)

.claude/
└── CONTEXTO.md (para nuevas sesiones)
```

---

## 🎯 PARA NUEVA SESION

Si abres un chat nuevo con Claude, dile:
```
"Claude, lee estos archivos del proyecto:
1. docs/ESTADO.md
2. .claude/CONTEXTO.md
3. docs/GUIA-RAPIDA.md

Estamos en Fase 0, preparando el entorno.
Esta es la sesión #2."
```

---

## ⏭️ SIGUIENTE PASO

1. Validar que toda la documentación esté actualizada
2. Comenzar Fase 0: Setup del proyecto
3. Crear estructura backend
4. Configurar PostgreSQL
5. Inicializar Next.js

---

**Última actualización:** Edilberto + Claude  
**Comando para ver cambios:** `git log --oneline -5`