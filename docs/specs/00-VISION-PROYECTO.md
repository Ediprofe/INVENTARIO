# VISIÓN DEL PROYECTO - Sistema de Inventario Escolar
**Versión:** 1.0  
**Fecha:** Noviembre 17, 2025  
**Propósito:** Explicación general del proyecto en lenguaje natural

---

## 🎯 ¿QUÉ ES ESTE PROYECTO?

Este es un **sistema web de gestión de inventario físico** para una institución educativa (colegio). Permite llevar el control de **todos los bienes físicos** que tiene el colegio: desde computadores, sillas, proyectores, hasta útiles de oficina, equipos deportivos, libros de biblioteca, etc.

**En palabras simples:** Es como un "catálogo digital organizado" que sabe:
- ✅ Qué cosas tiene el colegio (7,000+ ítems actualmente)
- ✅ Dónde está cada cosa (salón 301, laboratorio, oficina director, etc.)
- ✅ Quién es responsable de cada cosa (profesor Juan, directora María, etc.)
- ✅ Cuánto vale cada cosa
- ✅ En qué estado está (activo, en mantenimiento, dado de baja, etc.)

---

## 🤔 ¿POR QUÉ ES NECESARIO?

### El Problema Actual

El colegio tiene actualmente **más de 7,000 ítems físicos** registrados en **hojas de cálculo de Excel** dispersas. Esto causa problemas como:

❌ **Desorganización:**
- Múltiples archivos Excel sin control de versiones
- Información duplicada o contradictoria
- Difícil saber qué está actualizado

❌ **Búsquedas lentas:**
- Encontrar un ítem específico toma mucho tiempo
- No hay filtros avanzados
- Imposible hacer búsquedas cruzadas (ej: "todos los computadores del laboratorio 2")

❌ **Sin trazabilidad:**
- No hay historial de movimientos
- No se sabe quién hizo qué cambio y cuándo
- Difícil identificar patrones (ej: "qué ubicaciones tienen más ítems perdidos")

❌ **Procesos manuales:**
- Editar múltiples ítems a la vez es tedioso
- Importar nuevos ítems es propenso a errores
- Generar reportes requiere trabajo manual

❌ **Riesgos de seguridad:**
- Cualquiera con acceso al Excel puede modificarlo
- No hay control de permisos
- Fácil perder información por borrado accidental

---

## 🎯 ¿QUÉ VAMOS A CONSTRUIR?

### La Solución

Un **sistema web moderno** con:

✅ **Base de datos centralizada:**
- Toda la información en un solo lugar
- PostgreSQL (base de datos profesional)
- Respaldos automáticos

✅ **Interfaz web intuitiva:**
- Accesible desde cualquier navegador
- Diseño limpio y fácil de usar
- Responsive (funciona en móviles y tablets)

✅ **Búsqueda y filtros potentes:**
- Buscar por código, nombre, ubicación, responsable, etc.
- Filtros combinables
- Resultados en tiempo real

✅ **Importación/Exportación Excel:**
- Importar los 7,000+ ítems existentes desde Excel
- Validación automática de datos
- Exportar reportes a Excel cuando se necesite

✅ **Edición masiva:**
- Seleccionar múltiples ítems y editarlos a la vez
- Cambiar ubicaciones, responsables, estados en lote
- Interfaz tipo "Excel dentro del navegador"

✅ **Historial completo:**
- Cada cambio queda registrado
- Saber quién, qué, cuándo y por qué
- Auditoría completa

✅ **Control de acceso:**
- Solo usuarios autorizados pueden acceder
- Diferentes niveles de permisos (consultar, editar, administrar)
- Cada acción está asociada a un usuario

---

## 🏗️ ¿CÓMO ESTÁ ESTRUCTURADO?

### Arquitectura General

El sistema tiene **3 partes principales**:
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  1️⃣ FRONTEND (Lo que ve el usuario)                │
│                                                     │
│  - Interfaz web en el navegador                    │
│  - Tablas, formularios, botones                    │
│  - Tecnología: Next.js + React + TypeScript        │
│                                                     │
└────────────────────┬────────────────────────────────┘
                     │
                     │ (Internet/Red local)
                     │
┌────────────────────▼────────────────────────────────┐
│                                                     │
│  2️⃣ BACKEND (El cerebro del sistema)               │
│                                                     │
│  - Procesa peticiones                              │
│  - Valida datos                                    │
│  - Aplica reglas de negocio                        │
│  - Tecnología: Django + Python                     │
│                                                     │
└────────────────────┬────────────────────────────────┘
                     │
                     │ (Conexión segura)
                     │
┌────────────────────▼────────────────────────────────┐
│                                                     │
│  3️⃣ BASE DE DATOS (Donde se guarda todo)           │
│                                                     │
│  - Almacena ítems, ubicaciones, responsables       │
│  - Historial de cambios                            │
│  - Tecnología: PostgreSQL                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📊 DATOS QUE MANEJA EL SISTEMA

### Entidades Principales

El sistema organiza la información en **5 tipos de registros principales**:

#### 1️⃣ **Ítems del Inventario** (Lo más importante)

Cada **ítem** representa un objeto físico individual. Por ejemplo:
```
Ítem: Computador de escritorio
├─ Código: INV-00542
├─ Artículo: Computador Dell Optiplex 7050
├─ Ubicación: Sala de sistemas - 2do piso
├─ Responsable: Prof. Carlos Rodríguez
├─ Cantidad: 1 unidad
├─ Valor: $1,500,000 COP
├─ Estado: Activo
├─ Fecha de adquisición: 15/03/2023
└─ Observaciones: "Incluye teclado y mouse inalámbricos"
```

#### 2️⃣ **Sedes**

El colegio puede tener **múltiples sedes**. Cada sede agrupa ubicaciones:
```
Sede: Campus Principal
├─ Código: SEDE-001
├─ Nombre: Campus Principal Norte
├─ Dirección: Calle 100 # 15-20, Bogotá
├─ Teléfono: +57 (1) 555-1234
└─ Ubicaciones: 45 ubicaciones activas
```

#### 3️⃣ **Ubicaciones**

Lugares físicos específicos **dentro de una sede**:
```
Ubicación: Laboratorio de Química
├─ Nombre: Laboratorio de Química
├─ Tipo: Laboratorio
├─ Sede: Campus Principal
├─ Capacidad: 30 estudiantes
├─ Piso: 3er piso
└─ Ítems: 87 ítems asignados
```

#### 4️⃣ **Responsables**

Personas a cargo de cuidar los ítems:
```
Responsable: Prof. Ana García
├─ Nombres: Ana María
├─ Apellidos: García López
├─ Documento: CC 52.345.678
├─ Cargo: Profesora de Matemáticas
├─ Email: ana.garcia@colegio.edu.co
├─ Teléfono: +57 300 123 4567
└─ Ítems a cargo: 15 ítems
```

#### 5️⃣ **Artículos** (Catálogo de tipos)

Los artículos son "plantillas" o "tipos" de ítems:
```
Artículo: Computador Dell Optiplex 7050
├─ Código: ART-COMP-001
├─ Nombre: Computador Dell Optiplex 7050
├─ Categoría: Tecnología > Computadores
├─ Marca: Dell
├─ Modelo: Optiplex 7050
├─ Descripción: "Desktop i5, 8GB RAM, 256GB SSD"
└─ Usado en: 42 ítems diferentes
```

---

### Relaciones entre Datos
```
SEDE
 ├─ tiene muchas → UBICACIONES
 └─ tiene muchos → RESPONSABLES
                        │
                        ▼
                    UBICACIÓN
                        │
                        └─ aloja muchos → ÍTEMS
                                             │
                                             ├─ es de tipo → ARTÍCULO
                                             └─ está a cargo de → RESPONSABLE
```

**En palabras simples:**
- Una **sede** agrupa varias **ubicaciones**
- Cada **ubicación** tiene varios **ítems**
- Cada **ítem** es de un **artículo** específico (tipo)
- Cada **ítem** tiene un **responsable** asignado

---

## 🎨 ¿CÓMO SE USA?

### Flujos de Trabajo Principales

#### 📥 **1. Importar Ítems desde Excel** (Configuración inicial)
```
Usuario → Sube archivo .xlsx con 7,000+ ítems
    ↓
Sistema → Valida cada fila del Excel
    ↓
Sistema → Crea automáticamente artículos que no existan
    ↓
Sistema → Inserta todos los ítems validados
    ↓
Usuario → Recibe confirmación o reporte de errores
```

**Validaciones automáticas:**
- ✅ Códigos únicos
- ✅ Ubicaciones existen
- ✅ Responsables existen
- ✅ Valores numéricos válidos
- ✅ Fechas correctas

---

#### 🔍 **2. Buscar y Consultar Ítems** (Uso diario)
```
Usuario → Abre el sistema
    ↓
Usuario → Aplica filtros: "Sede X + Estado: Activo + Ubicación: Laboratorio"
    ↓
Sistema → Muestra tabla con resultados (ej: 45 ítems)
    ↓
Usuario → Hace clic en un ítem para ver detalles completos
```

**Búsquedas posibles:**
- Por código: `INV-00542`
- Por texto: `"computador"` (busca en nombre de artículo)
- Por ubicación: Todos los ítems del "Laboratorio de Química"
- Por responsable: Todos los ítems a cargo de "Prof. Carlos"
- Por rango de valor: Ítems entre $500,000 y $2,000,000
- Combinaciones: "Computadores activos en sede principal > $1M"

---

#### ✏️ **3. Editar Múltiples Ítems** (Feature estrella ⭐)
```
Usuario → Selecciona 20 computadores que cambiarán de ubicación
    ↓
Usuario → Hace clic en "Editar selección masiva"
    ↓
Sistema → Abre modal tipo Excel
    ↓
Usuario → Cambia ubicación de todos a "Sala 301"
    ↓
Usuario → Cambia responsable de todos a "Prof. María"
    ↓
Usuario → Guarda cambios
    ↓
Sistema → Valida todos los cambios
    ↓
Sistema → Aplica cambios en bloque (transacción atómica)
    ↓
Sistema → Registra en historial: "20 ítems movidos a Sala 301 por Usuario X"
```

---

#### 📤 **4. Exportar Reportes a Excel**
```
Usuario → Filtra ítems (ej: "Todos los activos de Sede Principal")
    ↓
Usuario → Hace clic en "Exportar a Excel"
    ↓
Sistema → Genera archivo .xlsx con los ítems filtrados
    ↓
Usuario → Descarga el archivo
    ↓
Usuario → Abre en Excel para análisis offline o presentación
```

---

## 🚀 PLAN DE DESARROLLO

### Fases del Proyecto (7 fases, ~22-30 días)
```
📅 FASE 0: Setup (1-2 días)
└─ Configurar Django, Next.js, PostgreSQL
└─ Estructura de carpetas
└─ Variables de entorno

📅 FASE 1: Modelos + Autenticación (3-4 días)
└─ Crear base de datos
└─ Modelos: Sede, Ubicación, Responsable, Artículo, Ítem
└─ Sistema de login con JWT

📅 FASE 2: API REST (3-4 días)
└─ Endpoints para CRUD de ítems
└─ Endpoints para catálogos
└─ Filtros y paginación

📅 FASE 3: Frontend MVP (5-6 días)
└─ Interfaz de login
└─ Tabla de ítems con filtros
└─ Formularios para crear/editar
└─ Dashboard inicial

📅 FASE 4: Import/Export Excel (3-4 días)
└─ Importar ítems desde Excel
└─ Auto-crear artículos
└─ Exportar reportes a Excel

📅 FASE 5: Edición Masiva ⭐ PRIORIDAD (3-4 días)
└─ Modal de edición masiva
└─ Interfaz tipo Excel
└─ Validaciones en tiempo real

📅 FASE 6: Testing + Polish (2-3 días)
└─ Tests automatizados
└─ Optimización de performance
└─ Mejoras UX

📅 FASE 7: Docker + Deploy (2-3 días)
└─ Dockerizar aplicación
└─ Preparar para producción
└─ Guía de deployment
```

---

## 🎯 CARACTERÍSTICAS DIFERENCIADORAS

### Lo que hace ÚNICO a este sistema:

1. **⚡ Optimizado para grandes volúmenes**
   - Diseñado desde el inicio para +7,000 ítems
   - Índices de base de datos estratégicos
   - Consultas optimizadas

2. **🤖 Auto-creación inteligente**
   - Al importar Excel, crea automáticamente artículos que no existan
   - No requiere preparar catálogos antes de importar

3. **✏️ Edición masiva potente**
   - Interfaz tipo Excel dentro del navegador
   - Validaciones en tiempo real
   - Transacciones atómicas (todo o nada)

4. **📊 Historial completo automático**
   - Cada cambio se registra sin intervención manual
   - Auditoría completa de movimientos

5. **🔒 Validación doble**
   - Validaciones en frontend (usuario ve errores inmediatamente)
   - Validaciones en backend (seguridad garantizada)

6. **📱 Progresivo y escalable**
   - Comienza simple (local)
   - Escala a Docker
   - Listo para producción

---

## 🛠️ TECNOLOGÍAS UTILIZADAS

### ¿Por qué estas tecnologías?

#### **Backend: Django 5.2 + PostgreSQL 16**
- ✅ Django tiene admin built-in → menos código custom
- ✅ ORM potente → consultas complejas fáciles
- ✅ PostgreSQL → robusto para +7,000 registros
- ✅ Comunidad grande → soporte y librerías

#### **Frontend: Next.js 16 + React 19 + TypeScript**
- ✅ Next.js → rendering moderno y rápido
- ✅ React → componentes reutilizables
- ✅ TypeScript → menos errores, código más seguro
- ✅ shadcn/ui → componentes profesionales listos

#### **Estado: Zustand**
- ✅ Más simple que Redux
- ✅ Mejor rendimiento que Context API
- ✅ Código más limpio

#### **Validación: Zod**
- ✅ Validaciones type-safe
- ✅ Mensajes de error claros
- ✅ Integración perfecta con TypeScript

---

## 👥 ROLES DE USUARIO (Futuro)

### Post-MVP

**Administrador:**
- ✅ Acceso completo
- ✅ Crear/editar/eliminar todo
- ✅ Ver reportes completos
- ✅ Gestionar usuarios

**Editor:**
- ✅ Ver todos los ítems
- ✅ Editar ítems
- ✅ Importar/exportar
- ❌ No puede eliminar
- ❌ No puede gestionar usuarios

**Consultor:**
- ✅ Ver todos los ítems
- ✅ Exportar reportes
- ❌ No puede editar
- ❌ No puede importar

**Responsable:**
- ✅ Ver solo ítems a su cargo
- ✅ Actualizar estado/observaciones
- ❌ No puede cambiar ubicación
- ❌ No puede exportar

---

## 📈 MÉTRICAS DE ÉXITO

### ¿Cómo sabremos que el sistema funciona?

✅ **Funcionalidad:**
- [ ] Importación de 7,000+ ítems en < 5 minutos
- [ ] Búsquedas retornan resultados en < 2 segundos
- [ ] Edición masiva de 100 ítems en < 10 segundos

✅ **Usabilidad:**
- [ ] Usuario nuevo puede hacer búsqueda básica sin capacitación
- [ ] Interfaz clara y sin elementos confusos
- [ ] Mensajes de error comprensibles

✅ **Calidad del código:**
- [ ] Cobertura de tests > 85%
- [ ] Sin archivos > 300 líneas
- [ ] Sin funciones > 50 líneas

✅ **Mantenibilidad:**
- [ ] Documentación completa
- [ ] Código autodocumentado
- [ ] Estándares consistentes

---

## 🎓 GLOSARIO

### Términos importantes:

- **Ítem:** Un objeto físico individual (ej: "el computador #542")
- **Artículo:** Tipo o categoría de ítem (ej: "Computador Dell Optiplex")
- **Sede:** Campus o locación principal del colegio
- **Ubicación:** Lugar específico dentro de una sede (salón, laboratorio, etc.)
- **Responsable:** Persona a cargo de cuidar ítems
- **CRUD:** Create, Read, Update, Delete (operaciones básicas)
- **Batch Edit:** Edición masiva de múltiples registros a la vez
- **JWT:** Token de autenticación (como una "llave digital")
- **API REST:** Forma de comunicación entre frontend y backend

---

## 🤝 PRÓXIMOS PASOS

### Para comenzar a trabajar:

### Para Contexto Rápido
1. `README.md` - Setup e introducción
2. `PROYECTO.md` - Este archivo (estado actual y guía de archivos)

### Para Especificaciones Técnicas
4. `docs/specs/00-VISION-PROYECTO.md` - Visión general
5. `docs/specs/01-MODELO-DATOS.md` - Base de datos
6. `docs/specs/02-FEATURES.md` - Funcionalidades (RF-001 a RF-008)
7. `docs/specs/03-ESTANDARES.md` - Convenciones de código
8. `docs/specs/04-FASE-0-SETUP.md` - Guía de setup
9. `docs/specs/05-FASES-1-7.md` - Plan de implementación
10. `docs/specs/06-PERMISOS.md` - Sistema de permisos

### Para IA (Claude/Cursor)
11. `.claude/CONTEXTO.md` - Instrucciones para Claude
12. `.ai/agent-config.yaml` - Configuración Windsurf/Cursor

---

## 📞 CONTACTO Y RECURSOS

- **Repositorio GitHub:** [URL del repo]
- **Documentación técnica:** `docs/specs/`
- **Stack definitivo:** Django 5.2 + Next.js 16 + PostgreSQL 16
- **Metodología:** Desarrollo progresivo con validación en cada fase

---

**¿Preguntas sobre el proyecto?**

Si algo no está claro en este documento, es una señal de que necesitamos mejorarlo. Por favor indicar qué sección requiere más claridad.

---

**Documento creado:** 2025-11-17  
**Última actualización:** 2025-11-17  
**Versión:** 1.0  
**Autor:** Edilberto + Claude