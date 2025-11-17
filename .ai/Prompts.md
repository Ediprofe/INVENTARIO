# PROMPTS REUTILIZABLES

## 🎯 Retomar Trabajo
```
Lee: PROYECTO.md, .claude/CONTEXTO.md, docs/specs/00-VISION-PROYECTO.md
Necesito: [descripción tarea]
```

## 🔨 Iniciar Feature
```
Lee: PROYECTO.md, docs/specs/02-FEATURES.md (RF-00X)
Implementa: [feature específico]
Incluye: código + tests (>85% coverage)
```

## 🐛 Fix Bug
```
Lee: PROYECTO.md, [archivo relevante]
Bug: [descripción]
Archivos afectados: [lista]
Fix + tests de regresión
```

## ✅ Validar Implementación
```bash
# Backend
cd backend && pytest --cov=apps
ruff check . && black --check .

# Frontend  
cd frontend && npm run lint && npm run type-check && npm test
```