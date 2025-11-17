# 🗄️ Modelo de Datos

Estructura completa de la base de datos del Sistema de Inventario Escolar.

---

## 📚 Contenido

### [`entidades.md`](entidades.md) ⭐
**Documento principal** - Modelos Django completos

- Diagrama Entidad-Relación
- Enums y Choices
- Modelo Base (TimeStampedModel)
- Modelos de Catálogos (Sede, Ubicación, Responsable, Artículo)
- Modelo Principal (ItemInventario)
- Historial de Movimientos
- Índices y Optimizaciones

---

## 🎯 Uso Rápido

### Ver todos los modelos
→ [`entidades.md`](entidades.md)

### Buscar modelo específico
- **Sede:** [`entidades.md#sede`](entidades.md#sede)
- **ItemInventario:** [`entidades.md#itemInventario`](entidades.md#itemInventario)
- **HistorialMovimiento:** [`entidades.md#historialmovimiento`](entidades.md#historialmovimiento)

---

## 📝 Mantenimiento

### Agregar nuevo modelo
```bash
vim docs/modelo/entidades.md
# Agregar modelo siguiendo estructura existente
```

### Modificar modelo existente
```bash
vim docs/modelo/entidades.md
# Buscar el modelo y actualizar
```

**Regla:** Un solo archivo para todos los modelos. Fácil de buscar con Ctrl+F.

---

## 📦 Legacy

Versión original en: [`../specs/01-MODELO-DATOS.md`](../specs/01-MODELO-DATOS.md) (backup)

---

**Última actualización:** 2025-11-17
