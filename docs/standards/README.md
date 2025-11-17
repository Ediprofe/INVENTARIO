# 📏 Estándares de Código

Guías de convenciones, límites y buenas prácticas del proyecto.

---

## 📚 Contenido

### Documentación Principal
Por ahora, todos los estándares están documentados en:
**[../specs/03-ESTANDARES.md](../specs/03-ESTANDARES.md)**

---

## 🔄 Migración Pendiente

Esta carpeta está preparada para una futura modularización en:

### Estructura Propuesta
```
docs/standards/
├── README.md (este archivo)
├── python.md          # Estándares Python/Django
│   ├── Nomenclatura
│   ├── Docstrings
│   ├── Type hints
│   └── Estructura de archivos
│
├── typescript.md      # Estándares TypeScript/React
│   ├── Nomenclatura
│   ├── Componentes
│   ├── Hooks
│   └── Types e Interfaces
│
├── git.md            # Commits y branching
│   ├── Conventional Commits
│   ├── Estrategia de ramas
│   └── Pull requests
│
└── testing.md        # Testing y coverage
    ├── Pytest (Backend)
    ├── Jest/Testing Library (Frontend)
    └── Mínimos de coverage
```

### Cuándo Migrar
- Cuando se necesiten estándares muy específicos por tecnología
- Cuando se agreguen nuevos lenguajes/frameworks
- Cuando los estándares actuales superen las 1500 líneas

---

## ⚡ Referencia Rápida

### Límites Obligatorios (Resumen)
- **Archivos**: Máx 300 líneas
- **Funciones**: Máx 50 líneas
- **Líneas de código**: Máx 100 caracteres
- **Coverage**: Mín 85%

Para ver todos los estándares:
→ [docs/specs/03-ESTANDARES.md](../specs/03-ESTANDARES.md)

---

**Última actualización:** 2025-11-17
**Estado:** Pendiente de migración
