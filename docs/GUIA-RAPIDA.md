Perfecto, Edilberto. Voy a revisar el repositorio de GitHub que tienes cargado en el proyecto.Perfecto, Edilberto. He revisado la documentación del repositorio. Veo que ya tienes una estructura inicial creada. Ahora voy a **adaptarla y mejorarla** para que quede 100% funcional y cómoda para ambos.

## 📋 EVALUACIÓN DE LO QUE TIENES

**Lo que veo en el repo:**
✅ Carpeta `docs/specs/` con documentos numerados
✅ Archivos base: ESTADO.md, CHANGELOG.md, CONTEXTO.md
✅ README.md inicial

**Lo que necesitamos ajustar:**
⚠️ Homogeneizar los nombres de archivos
⚠️ Crear GUIA-RAPIDA.md consolidada
⚠️ Actualizar archivos de contexto con formato definitivo
⚠️ Crear README.md del proyecto completo

---

## 🎯 PLAN DE ADAPTACIÓN

Voy a generar todos los archivos actualizados. **Tú solo copia y pega** donde te indique.

### ARCHIVO 1: GUIA-RAPIDA.md

**Ubicación:** `docs/GUIA-RAPIDA.md`

**Acción:** Copia este contenido completo:

```markdown
# GUIA RAPIDA - Sistema de Inventario Escolar
**Versión:** 1.0  
**Fecha:** Noviembre 16, 2025  
**Propósito:** Referencia esencial para desarrollo con IA

---

## 📌 INICIO RAPIDO

**Para nueva sesión con Claude:**
```
"Claude, lee:
1. docs/ESTADO.md
2. .claude/CONTEXTO.md  
3. docs/GUIA-RAPIDA.md

Continuamos con [descripción de tarea]"
```

---

## 🎯 VISION DEL PROYECTO

Sistema web para gestión de inventario físico escolar con desarrollo **progresivo** (Local → Docker → Producción) y **código limpio** verificable en cada incremento.

**Características distintivas:**
- Despliegue progresivo: Local → Docker → Producción
- Validaciones robustas: doble capa (aplicación + BD)
- Edición masiva temprana: modal tipo Excel desde MVP+
- Trazabilidad completa: historial automático de movimientos
- Import/Export Excel: con validación exhaustiva pre-inserción
- Auto-creación de catálogos: artículos se crean dinámicamente

---

## 💻 STACK TECNOLOGICO (NO NEGOCIABLE)

### Backend
```yaml
Python: 3.13.0
Django: 5.2 LTS
Django REST Framework: 3.16.1
PostgreSQL: 16.6
Simple JWT: 5.4.0
pandas: 2.2.3 (Excel)
openpyxl: 3.1.5 (Excel)
django-filter: 24.3
django-cors-headers: 4.6.0
```

### Frontend
```yaml
Node.js: 22 LTS
Next.js: 16.0.3 (App Router)
React: 19.2
TypeScript: 5.7
Zustand: 5.0.3 (estado - DEFINITIVO)
TanStack Query: 5.61
Tailwind CSS: 3.4.17 (DEFINITIVO)
shadcn/ui: última compatible
zod: 3.24.1 (validación)
react-hook-form: 7.54.0
```

**Decisiones clave:**
- Zustand > Context API (mejor rendimiento)
- shadcn/ui desde MVP (no cambios después)
- PostgreSQL desde inicio (no SQLite)
- Validación doble (cliente + servidor)

---

## 🗄️ MODELO DE DATOS

```
Sede (1) ──┬──> (N) Ubicacion ──┬──> (N) ItemInventario ──> (N) HistorialMovimiento
           │                     │
           │                     └──> (N) Responsable
           │
           └──────────────────────────> (N) Articulo
```

### Entidades Principales

**ItemInventario (núcleo):**
- codigo (único, uppercase, max 50)
- ubicacion, responsable, articulo (FK)
- cantidad (1-9999)
- valor_unitario (>= 0)
- fecha_adquisicion (no futuro)
- estado (enum: activo, inactivo, mantenimiento, dado_baja, extraviado)
- observaciones (max 500)

**Validaciones críticas:**
- Código único y uppercase
- Relaciones deben estar activas
- Sede derivada de ubicacion (read-only)

Ver código completo: `docs/specs/0. Requerimientos-DETALLADOS.md` (buscar "class ItemInventario")

---

## ⚡ FEATURES CRITICAS

### 1. Autenticación JWT
- POST /api/v1/auth/login/
- POST /api/v1/auth/refresh/
- POST /api/v1/auth/logout/

ARCHIVO 1 (continuación): GUIA-RAPIDA.mdmarkdown### 2. CRUD de Items
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
```pythonVariables/funciones: snake_case
total_items = 100
def calcular_total(items): passClases: PascalCase
class ItemInventario(models.Model): passConstantes: UPPER_SNAKE_CASE
MAX_PAGE_SIZE = 100

**TypeScript:**
```typescript// Componentes: PascalCase
export function ItemsTable() {}// Variables/funciones: camelCase
const fetchItems = async () => {}// Interfaces: PascalCase con I
interface IItem { id: number }// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8000'

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

## 🏗️ ESTRUCTURA DIRECTORIOSinventario-escolar/
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

---

## 🔗 ENDPOINTS PRINCIPALES

**Auth:**POST /api/v1/auth/login/
POST /api/v1/auth/refresh/
POST /api/v1/auth/logout/

**Items:**GET    /api/v1/inventario/items/
POST   /api/v1/inventario/items/
GET    /api/v1/inventario/items/{id}/
PUT    /api/v1/inventario/items/{id}/
PATCH  /api/v1/inventario/items/{id}/
DELETE /api/v1/inventario/items/{id}/
POST   /api/v1/inventario/items/import/
GET    /api/v1/inventario/items/export/
PATCH  /api/v1/inventario/items/batch-update/

**Catálogos:**GET/POST /api/v1/inventario/sedes/
GET/POST /api/v1/inventario/ubicaciones/
GET/POST /api/v1/inventario/responsables/
GET/POST /api/v1/inventario/articulos/

---

## ⚙️ COMANDOS RAPIDOS
```bashBackend
cd backend && source venv/bin/activate
python manage.py runserver
python manage.py makemigrations
python manage.py migrate
pytestFrontend
cd frontend
npm run dev
npm run buildGit
git status
git add .
git commit -m "feat(fase): descripción"

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