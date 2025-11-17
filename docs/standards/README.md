# 📏 Estándares de Código

Convenciones, límites y buenas prácticas del proyecto.

---

## 📚 Contenido

### [`codigo.md`](codigo.md) ⭐
**Guía completa de estándares** - Todo en un archivo

Incluye:
1. **Principios Generales** - DRY, KISS, YAGNI
2. **Límites Obligatorios** - Máx líneas por archivo/función
3. **Nomenclatura** - Python vs TypeScript
4. **Python / Django** - Docstrings, type hints, estructura
5. **TypeScript / React** - Componentes, hooks, types
6. **Git y Commits** - Conventional Commits
7. **Testing** - Coverage mínimos, pytest, jest
8. **Documentación** - README, docstrings
9. **Checklist de Calidad** - Pre-commit, pre-PR
10. **Herramientas** - Linters, formatters

---

## 🎯 Referencia Rápida

### Límites Críticos
- **Archivos:** Máx 300 líneas
- **Funciones:** Máx 50 líneas
- **Línea de código:** Máx 100 caracteres
- **Coverage:** Mín 85%

### Nomenclatura
- **Python:** `snake_case` (variables/funciones), `PascalCase` (clases)
- **TypeScript:** `camelCase` (variables/funciones), `PascalCase` (componentes/tipos)

### Git
- **Commits:** `tipo(alcance): descripción`
- **Tipos:** feat, fix, docs, style, refactor, test, chore

---

## 📖 Uso

### Consulta Rápida
```bash
# Buscar estándar específico
grep -i "nomenclatura" docs/standards/codigo.md
grep -i "docstring" docs/standards/codigo.md
```

### Durante Desarrollo
- Consultar límites antes de escribir código
- Verificar nomenclatura al crear archivos/funciones
- Revisar checklist antes de commit/PR

---

## 🔍 Búsquedas Comunes

| Busco... | Sección en codigo.md |
|----------|----------------------|
| Límites de líneas | `## LÍMITES OBLIGATORIOS` |
| Nomenclatura Python | `### Python` |
| Nomenclatura TypeScript | `### TypeScript` |
| Commits | `## Git y Commits` |
| Testing | `## Testing` |
| Docstrings | `### Docstrings` |

---

## ⚡ Herramientas

### Backend
```bash
# Linting
ruff check .

# Formatting
black .
isort .

# Type checking
mypy apps/
```

### Frontend
```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking
npm run type-check
```

---

## ✅ Checklists

### Pre-Commit
- [ ] Límite de 300 líneas por archivo
- [ ] Funciones < 50 líneas
- [ ] Líneas < 100 caracteres
- [ ] Nomenclatura correcta
- [ ] Docstrings/JSDoc completos

### Pre-PR
- [ ] Linters pasan
- [ ] Tests pasan
- [ ] Coverage > 85%
- [ ] Commits siguen Conventional Commits

---

**Última actualización:** 2025-11-17
