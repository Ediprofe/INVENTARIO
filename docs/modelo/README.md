# 🗄️ Modelo de Datos

Documentación del modelo de datos del Sistema de Inventario Escolar.

---

## 📚 Contenido

### Documentación Principal
Por ahora, toda la información del modelo de datos está en:
**[../specs/01-MODELO-DATOS.md](../specs/01-MODELO-DATOS.md)**

---

## 🔄 Migración Pendiente

Esta carpeta está preparada para una futura modularización en:

### Estructura Propuesta
```
docs/modelo/
├── README.md (este archivo)
├── entidades.md       # Modelos Django detallados
├── relaciones.md      # Diagramas y relaciones entre modelos
├── validaciones.md    # Reglas de negocio y constraints
└── migraciones.md     # Guía de migraciones Django
```

### Cuándo Migrar
- Cuando el archivo 01-MODELO-DATOS.md supere las 1000 líneas
- Cuando se agreguen nuevos modelos complejos
- Cuando se requiera documentar migraciones complejas

---

## 🔗 Referencia Rápida

Para consultar el modelo de datos completo:
→ [docs/specs/01-MODELO-DATOS.md](../specs/01-MODELO-DATOS.md)

---

**Última actualización:** 2025-11-17
**Estado:** Pendiente de migración
