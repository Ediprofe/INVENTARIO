# PROMPTS REUTILIZABLES
**Sistema de Inventario Escolar**

---

## 🚀 Inicio Rápido / Retomar Trabajo

```
Lee en orden:
1. GUIA-INICIAL.md - Entender proyecto en 5 min
2. ESTADO.md - Ver progreso y próximas tareas
3. docs/NAVIGATION.md - Mapa de documentación técnica

Necesito: [descripción de la tarea]
```

---

## 🎯 Entender el Proyecto (Primera Vez)

```
Soy [Claude/Cursor/Windsurf], necesito entender el proyecto.

Lee:
- GUIA-INICIAL.md (contexto general en 5 min)
- docs/vision/stack.md (versiones exactas del stack)
- docs/modelo/entidades.md (estructura de BD)
- ESTADO.md (fase actual y progreso)

Luego dame un resumen de qué vamos a construir.
```

---

## 🔨 Iniciar Nueva Feature

```
Lee:
- ESTADO.md (verificar fase actual)
- docs/features/[nombre-feature].md (especificación completa)
- docs/standards/codigo.md (límites y convenciones)

Implementa:
- [Feature específico según especificación]
- Tests completos (>85% coverage)
- Validación doble (cliente + servidor)
- Actualizar ESTADO.md al finalizar
```

**Ejemplo - Batch Edit:**
```
Lee:
- docs/features/batch-edit.md
- docs/standards/codigo.md

Implementa edición masiva de ítems con:
- Backend: endpoint batch-update con transacciones atómicas
- Frontend: react-data-grid con validación Zod
- Tests: pytest + jest (>85% coverage)
```

---

## 📋 Ejecutar Setup Inicial (Fase 0)

```
Lee: docs/fases/fase-0-setup.md

Ejecuta paso a paso:
1. Crear estructura backend/frontend
2. Configurar Python 3.13 + venv
3. Instalar Django 5.2
4. Configurar PostgreSQL 16
5. Inicializar Next.js 16
6. Verificar instalaciones
7. Actualizar ESTADO.md con resultados
```

---

## 🐛 Fix Bug

```
Lee:
- ESTADO.md (verificar contexto actual)
- [archivo relevante donde está el bug]

Bug detectado:
- Descripción: [qué falla]
- Archivos afectados: [lista]
- Pasos para reproducir: [lista]

Fix requerido:
- Corregir el bug
- Agregar test de regresión
- Verificar que no rompe otras funcionalidades
```

---

## ✅ Validar Implementación

```bash
# Backend
cd backend
pytest --cov=apps --cov-report=term-missing  # Coverage > 85%
ruff check .                                  # Linting
black --check .                               # Formatting
mypy apps/                                    # Type checking

# Frontend
cd frontend
npm run lint           # ESLint
npm run type-check     # TypeScript
npm test               # Jest + RTL
```

---

## 📊 Actualizar Progreso

```
Tarea completada: [descripción]

Actualiza ESTADO.md:
- Marca fase/tarea como completada
- Actualiza porcentaje de progreso
- Agrega a "Completado Recientemente"
- Actualiza "Próximos Pasos"
```

---

## 🔍 Buscar en Documentación

```
Necesito encontrar: [qué estás buscando]

Primero revisa: docs/NAVIGATION.md (mapa completo)

Ubicaciones comunes:
- Versiones de stack → docs/vision/stack.md
- Modelo de datos → docs/modelo/entidades.md
- Feature específico → docs/features/[nombre].md
- Estándares → docs/standards/codigo.md
- Guía de fase → docs/fases/fase-X-*.md
```

---

## 🚨 Reglas Críticas (SIEMPRE REVISAR)

```
Antes de implementar CUALQUIER cosa, verifica:

1. Leer docs/standards/codigo.md:
   - Máx 300 líneas/archivo
   - Máx 50 líneas/función
   - Coverage > 85%

2. Stack (docs/vision/stack.md):
   - Django 5.2 (NO cambiar)
   - Next.js 16 (NO cambiar)
   - PostgreSQL 16.6 (NO cambiar)

3. Validación:
   - SIEMPRE doble (cliente + servidor)
   - Backend: Django validators
   - Frontend: Zod schemas

4. NO usar localStorage en artifacts

5. Actualizar ESTADO.md después de cada tarea
```

---

## 📝 Crear Commit

```
Cambios realizados: [descripción]

Crear commit siguiendo Conventional Commits:
- tipo(alcance): descripción corta

Tipos permitidos:
- feat: Nueva funcionalidad
- fix: Corrección de bug
- docs: Cambios en documentación
- refactor: Refactorización sin cambio funcional
- test: Agregar o modificar tests
- chore: Cambios en build, configs, etc.

Ejemplo:
feat(batch-edit): agregar endpoint de actualización masiva
```

---

## 🎨 Implementar Componente UI

```
Lee:
- docs/standards/codigo.md (sección TypeScript/React)
- docs/vision/stack.md (verificar shadcn/ui)

Implementa componente:
- Usar shadcn/ui components
- TypeScript strict mode
- Props con tipos explícitos
- Tests con Jest + RTL
- Máx 250 líneas

Ejemplo de estructura:
```typescript
// components/items/ItemTable.tsx
interface ItemTableProps {
  items: Item[]
  onEdit: (id: string) => void
}

export function ItemTable({ items, onEdit }: ItemTableProps) {
  // Implementación
}
```
```

---

## 🗄️ Implementar Modelo Django

```
Lee:
- docs/modelo/entidades.md (ver estructura completa)
- docs/standards/codigo.md (sección Python/Django)

Implementa modelo según especificación:
- Type hints completos
- Docstrings (Google Style)
- Validaciones en clean()
- Métodos __str__ descriptivos
- Meta class con ordering
- Tests unitarios
```

---

**Última actualización:** 2025-11-17
**Documentación completa:** docs/NAVIGATION.md
