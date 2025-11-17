# Alcance del Proyecto - Sistema de Inventario Escolar

**Versión:** 1.0
**Fecha:** Noviembre 17, 2025

---

## 📦 Alcance del MVP (Versión 1.0)

### ✅ Incluido en MVP

#### Gestión de Catálogos
- ✅ CRUD de Sedes
- ✅ CRUD de Ubicaciones (vinculadas a sedes)
- ✅ CRUD de Responsables (docentes, administrativos)
- ✅ CRUD de Artículos (catálogo de tipos de bienes)

#### Gestión de Ítems
- ✅ Registro individual de ítems con código único
- ✅ Asignación de ítem a: sede, ubicación, responsable
- ✅ Estados: activo, inactivo, mantenimiento, dado de baja, extraviado, reparación
- ✅ Historial completo de movimientos
- ✅ Búsqueda y filtrado avanzado
- ✅ Paginación de resultados

#### Operaciones Masivas
- ✅ **Importar desde Excel** con validaciones
- ✅ **Exportar a Excel** con filtros aplicados
- ✅ **Edición masiva (Batch Edit)** de múltiples ítems simultáneamente ⭐

#### Autenticación y Seguridad
- ✅ Login con JWT
- ✅ Logout con invalidación de token
- ✅ Refresh token automático
- ✅ Rutas protegidas

#### Interfaz de Usuario
- ✅ Dashboard principal con estadísticas básicas
- ✅ Tabla de ítems con filtros y búsqueda
- ✅ Formularios de creación/edición
- ✅ Modales para confirmaciones
- ✅ Mensajes de feedback (éxito, error)
- ✅ Loading states

---

## ❌ Fuera del Alcance del MVP

### No Incluido (Versión 1.0)

#### Funcionalidades Avanzadas
- ❌ Sistema de permisos granular por rol
- ❌ Workflow de aprobaciones
- ❌ Notificaciones push o email
- ❌ Integración con sistemas externos (ERP, contabilidad)
- ❌ Mantenimiento preventivo programado
- ❌ Gestión de garantías

#### Características de Negocio
- ❌ Módulo de compras/adquisiciones
- ❌ Control presupuestario
- ❌ Gestión de proveedores
- ❌ Facturación
- ❌ Depreciación de activos

#### Tecnología
- ❌ App móvil nativa (iOS/Android)
- ❌ Escaneo de códigos QR/Barcode
- ❌ Reconocimiento de imágenes
- ❌ Geolocalización
- ❌ Modo offline

#### Reportes Avanzados
- ❌ Dashboard analytics con gráficos interactivos
- ❌ Reportes personalizados con querybuilder
- ❌ Exportación a PDF con formato institucional
- ❌ Programación de reportes automáticos

---

## 🎯 Límites y Restricciones

### Límites Técnicos

| Aspecto | Límite MVP | Justificación |
|---------|------------|---------------|
| **Usuarios concurrentes** | 50 | Institución mediana |
| **Ítems en BD** | 10,000 | Escalable a 100k post-MVP |
| **Sedes** | 10 | Suficiente para mayoría de instituciones |
| **Tamaño archivo Excel** | 10 MB | ~5000 registros |
| **Batch edit simultáneo** | 500 ítems | Balance performance/UX |

### Restricciones de Diseño

#### Solo Web Desktop
- **Prioridad**: Interfaz optimizada para desktop (1366x768+)
- **Mobile**: Responsive básico, pero no touch-optimizado
- **Justificación**: Usuarios trabajan desde oficinas con PCs

#### Solo Español
- **Idioma**: Español (Colombia)
- **Formatos**: Fecha DD/MM/YYYY, moneda COP
- **Justificación**: Mercado objetivo es Colombia

#### Sin Tiempo Real
- **Sincronización**: No hay WebSockets/SSE
- **Actualización**: Manual (refresh) o polling (cada 30s)
- **Justificación**: No es crítico para el caso de uso

---

## 📊 Escenarios de Uso Soportados

### ✅ Caso de Uso 1: Migración Inicial
**Descripción**: Importar inventario existente desde Excel
- **Actores**: Administrador
- **Frecuencia**: Una vez (al inicio)
- **Volumen**: 500-2000 ítems
- **Validaciones**: Códigos únicos, artículos auto-creados si no existen

### ✅ Caso de Uso 2: Registro Diario
**Descripción**: Registrar nuevos bienes adquiridos
- **Actores**: Operador
- **Frecuencia**: 2-10 ítems/día
- **Requisitos**: Formulario rápido, validaciones en tiempo real

### ✅ Caso de Uso 3: Actualización Masiva
**Descripción**: Cambiar ubicación de múltiples ítems (ej: traslado de aula)
- **Actores**: Operador
- **Frecuencia**: 1-2 veces/mes
- **Volumen**: 10-100 ítems simultáneos
- **Feature clave**: Batch Edit ⭐

### ✅ Caso de Uso 4: Búsqueda y Consulta
**Descripción**: Encontrar ítem específico o generar reporte
- **Actores**: Todos los usuarios
- **Frecuencia**: 10-50 veces/día
- **Requisitos**: Búsqueda rápida, filtros múltiples

### ✅ Caso de Uso 5: Auditoría Anual
**Descripción**: Generar listado completo para inventario físico
- **Actores**: Administrador
- **Frecuencia**: 1 vez/año
- **Requisitos**: Export a Excel con todos los campos, filtrado por sede

---

## 🚫 Escenarios NO Soportados (MVP)

### ❌ Caso de Uso: Escaneo Masivo con Móvil
**Por qué no**: Requiere app nativa, fuera del MVP

### ❌ Caso de Uso: Alertas de Mantenimiento
**Por qué no**: Requiere sistema de notificaciones, no prioritario

### ❌ Caso de Uso: Integración Contable
**Por qué no**: Requiere API a sistema externo, complejidad alta

### ❌ Caso de Uso: Multi-Institución
**Por qué no**: Arquitectura multi-tenant compleja, MVP es single-tenant

---

## 🔄 Criterios de Aceptación del MVP

### Funcionales
- [ ] Usuario puede importar 500 ítems desde Excel en < 1 minuto
- [ ] Usuario puede editar 50 ítems simultáneamente (batch edit)
- [ ] Usuario puede buscar y filtrar ítems con respuesta < 1 segundo
- [ ] Usuario puede exportar reporte Excel en < 10 segundos
- [ ] Sistema registra automáticamente historial de todos los cambios

### No Funcionales
- [ ] Sistema soporta 50 usuarios concurrentes sin degradación
- [ ] Uptime > 99% en entorno de producción
- [ ] Tests coverage > 85%
- [ ] Cumple con estándares de código definidos
- [ ] Documentación completa de API y componentes

### Usabilidad
- [ ] Tiempo de capacitación < 2 horas para usuario básico
- [ ] Formularios con validación en tiempo real
- [ ] Mensajes de error claros y accionables
- [ ] Confirmación antes de operaciones destructivas

---

## 📈 Roadmap Post-MVP

### Versión 1.1 (Q1 2026)
- Sistema de permisos granular (roles y permisos por módulo)
- Dashboard con gráficos básicos
- Exportación a PDF

### Versión 1.2 (Q2 2026)
- App móvil básica (solo consulta)
- Escaneo de códigos QR
- Notificaciones por email

### Versión 2.0 (Q3-Q4 2026)
- Módulo de mantenimiento preventivo
- Integración con sistema contable
- Multi-tenant (múltiples instituciones)
- Analytics avanzado

---

## 🎓 Notas sobre Alcance

### Principio de Progresividad
> "Es mejor un MVP funcional y estable que un sistema completo lleno de bugs"

El alcance del MVP está diseñado para:
1. **Validar el modelo de negocio**: ¿El sistema resuelve el problema real?
2. **Obtener feedback temprano**: Usuarios reales probando el sistema
3. **Base sólida para expansión**: Arquitectura preparada para crecer
4. **Time-to-market rápido**: 4-6 semanas de desarrollo efectivo

### Flexibilidad
Este alcance puede ajustarse según:
- Feedback de usuarios piloto
- Restricciones técnicas descubiertas
- Prioridades de negocio cambiantes
- Recursos disponibles

---

**Última actualización:** 2025-11-17
**Revisión próxima:** Al completar Fase 0 (Setup)
