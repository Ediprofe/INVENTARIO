# PERMISOS Y ROLES

## Roles del Sistema

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **Super Admin** | Control total | Todo |
| **Admin** | Gestión completa inventario | CRUD + Import/Export + Reports |
| **Operador** | Gestión diaria | CRUD ítems, Ver catálogos |
| **Consulta** | Solo lectura | Ver ítems, Ver reportes |

## Matriz de Permisos

| Acción | Super Admin | Admin | Operador | Consulta |
|--------|-------------|-------|----------|----------|
| Crear/Editar Sedes | ✅ | ✅ | ❌ | ❌ |
| Crear/Editar Ubicaciones | ✅ | ✅ | ❌ | ❌ |
| Crear/Editar Responsables | ✅ | ✅ | ❌ | ❌ |
| Crear/Editar Artículos | ✅ | ✅ | ✅ | ❌ |
| Crear/Editar Ítems | ✅ | ✅ | ✅ | ❌ |
| Eliminar Ítems | ✅ | ✅ | ❌ | ❌ |
| Importar Excel | ✅ | ✅ | ❌ | ❌ |
| Exportar Excel | ✅ | ✅ | ✅ | ✅ |
| Batch Edit | ✅ | ✅ | ❌ | ❌ |
| Ver Historial | ✅ | ✅ | ✅ | ✅ |
| Gestionar Usuarios | ✅ | ❌ | ❌ | ❌ |

## Implementación Django
```python
# apps/core/permissions.py

from rest_framework.permissions import BasePermission

class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser

class IsAdminOrSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name__in=['Admin', 'SuperAdmin']).exists()

class CanManageItems(BasePermission):
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        return request.user.groups.filter(name__in=['Admin', 'Operador']).exists()
```