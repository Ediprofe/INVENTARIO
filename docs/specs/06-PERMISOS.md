# PERMISOS Y ROLES - Sistema de Inventario Escolar
**Versión:** 1.0  
**Fecha:** Noviembre 16, 2025  
**Propósito:** Definición de roles y permisos del sistema

---

## 🎭 ROLES DEL SISTEMA

### Definición de Roles

| Rol | Código | Descripción | Cantidad Estimada |
|-----|--------|-------------|-------------------|
| **Super Admin** | `SUPERADMIN` | Control total del sistema | 1-2 usuarios |
| **Administrador** | `ADMIN` | Gestión completa de inventario | 3-5 usuarios |
| **Operador** | `OPERADOR` | Operaciones diarias de inventario | 10-15 usuarios |
| **Consulta** | `CONSULTA` | Solo lectura y reportes | Ilimitado |

---

## 📊 MATRIZ DE PERMISOS

### Gestión de Catálogos

| Acción | Super Admin | Admin | Operador | Consulta |
|--------|:-----------:|:-----:|:--------:|:--------:|
| **Sedes** |
| Ver sedes | ✅ | ✅ | ✅ | ✅ |
| Crear sede | ✅ | ✅ | ❌ | ❌ |
| Editar sede | ✅ | ✅ | ❌ | ❌ |
| Eliminar sede | ✅ | ❌ | ❌ | ❌ |
| **Ubicaciones** |
| Ver ubicaciones | ✅ | ✅ | ✅ | ✅ |
| Crear ubicación | ✅ | ✅ | ❌ | ❌ |
| Editar ubicación | ✅ | ✅ | ❌ | ❌ |
| Eliminar ubicación | ✅ | ❌ | ❌ | ❌ |
| **Responsables** |
| Ver responsables | ✅ | ✅ | ✅ | ✅ |
| Crear responsable | ✅ | ✅ | ❌ | ❌ |
| Editar responsable | ✅ | ✅ | ❌ | ❌ |
| Eliminar responsable | ✅ | ❌ | ❌ | ❌ |
| **Artículos** |
| Ver artículos | ✅ | ✅ | ✅ | ✅ |
| Crear artículo | ✅ | ✅ | ✅ | ❌ |
| Editar artículo | ✅ | ✅ | ✅ | ❌ |
| Eliminar artículo | ✅ | ✅ | ❌ | ❌ |

---

### Gestión de Inventario

| Acción | Super Admin | Admin | Operador | Consulta |
|--------|:-----------:|:-----:|:--------:|:--------:|
| Ver ítems | ✅ | ✅ | ✅ | ✅ |
| Crear ítem | ✅ | ✅ | ✅ | ❌ |
| Editar ítem | ✅ | ✅ | ✅ | ❌ |
| Eliminar ítem | ✅ | ✅ | ❌ | ❌ |
| Cambiar estado a "Dado de Baja" | ✅ | ✅ | ❌ | ❌ |
| Ver historial de ítem | ✅ | ✅ | ✅ | ✅ |

---

### Operaciones Masivas

| Acción | Super Admin | Admin | Operador | Consulta |
|--------|:-----------:|:-----:|:--------:|:--------:|
| Importar Excel | ✅ | ✅ | ❌ | ❌ |
| Exportar Excel | ✅ | ✅ | ✅ | ✅ |
| Edición masiva (Batch Edit) | ✅ | ✅ | ❌ | ❌ |
| Ver reportes | ✅ | ✅ | ✅ | ✅ |
| Generar reportes personalizados | ✅ | ✅ | ❌ | ❌ |

---

### Administración del Sistema

| Acción | Super Admin | Admin | Operador | Consulta |
|--------|:-----------:|:-----:|:--------:|:--------:|
| Gestionar usuarios | ✅ | ❌ | ❌ | ❌ |
| Asignar roles | ✅ | ❌ | ❌ | ❌ |
| Ver logs del sistema | ✅ | ❌ | ❌ | ❌ |
| Configuración general | ✅ | ❌ | ❌ | ❌ |

---

## 💻 IMPLEMENTACIÓN TÉCNICA

### Fase de Implementación

**🔔 IMPORTANTE:** Los permisos se implementan en **Fase 2** (después de tener los modelos y API básica).

**Por ahora (Fases 0-1):** No implementar permisos, todos los endpoints son públicos para desarrollo.

---

### Estructura Django (Fase 2)

**Archivo:** `apps/core/permissions.py`
```python
"""
Sistema de permisos personalizado.
Implementar en Fase 2.
"""
from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):
    """Solo Super Admins."""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superuser


class IsAdminOrAbove(BasePermission):
    """Admin o Super Admin."""
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return (
            request.user.is_superuser or
            request.user.groups.filter(name='Admin').exists()
        )


class CanManageInventory(BasePermission):
    """Operador, Admin o Super Admin."""
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Lectura: todos los roles autenticados
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        
        # Escritura: Operador o superior
        return (
            request.user.is_superuser or
            request.user.groups.filter(name__in=['Admin', 'Operador']).exists()
        )


class CanDeleteItems(BasePermission):
    """Solo Admin y Super Admin pueden eliminar."""
    
    def has_permission(self, request, view):
        if request.method != 'DELETE':
            return True
        
        return (
            request.user.is_superuser or
            request.user.groups.filter(name='Admin').exists()
        )
```

---

### Uso en ViewSets (Fase 2)
```python
from rest_framework import viewsets
from apps.core.permissions import CanManageInventory, CanDeleteItems


class ItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet para ítems de inventario.
    """
    permission_classes = [CanManageInventory, CanDeleteItems]
    # ... resto del código
```

---

### Creación de Grupos (Fase 2)

**Comando de gestión:** `apps/core/management/commands/create_groups.py`
```python
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission


class Command(BaseCommand):
    help = 'Crear grupos de permisos del sistema'
    
    def handle(self, *args, **kwargs):
        # Crear grupos
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        operador_group, _ = Group.objects.get_or_create(name='Operador')
        consulta_group, _ = Group.objects.get_or_create(name='Consulta')
        
        self.stdout.write(self.style.SUCCESS('Grupos creados exitosamente'))
```

**Ejecutar:**
```bash
python manage.py create_groups
```

---

## 📝 NOTAS PARA DESARROLLO

1. **Fase 0-1:** Ignorar permisos completamente, enfocarse en funcionalidad
2. **Fase 2:** Implementar sistema de permisos después de tener API funcionando
3. **Fase 3:** Implementar validación de permisos en frontend
4. **Fase 6:** Agregar tests de permisos

---

**Documento creado:** Noviembre 16, 2025  
**Implementación:** Fase 2  
**Estado:** Especificación completa