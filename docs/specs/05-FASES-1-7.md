# 📄 ARCHIVO 5 DE 5: `05-FASES-1-7.md`

Copia este contenido completo en `docs/specs/05-FASES-1-7.md`:

```markdown
# FASES 1-7: IMPLEMENTACIÓN COMPLETA - Sistema de Inventario Escolar
**Versión:** 2.0  
**Fecha:** Noviembre 16, 2025  
**Propósito:** Plan detallado de implementación desde modelos hasta deployment

---

## 📋 ÍNDICE

1. [Visión General de Fases](#visión-general-de-fases)
2. [Fase 1: Modelos y Autenticación](#fase-1-modelos-y-autenticación)
3. [Fase 2: API REST y Serializers](#fase-2-api-rest-y-serializers)
4. [Fase 3: Frontend MVP](#fase-3-frontend-mvp)
5. [Fase 4: Import/Export Excel](#fase-4-importexport-excel)
6. [Fase 5: Edición Masiva](#fase-5-edición-masiva)
7. [Fase 6: Testing y Polish](#fase-6-testing-y-polish)
8. [Fase 7: Docker y Deployment](#fase-7-docker-y-deployment)
9. [Metodología de Trabajo](#metodología-de-trabajo)

---

## 🎯 VISIÓN GENERAL DE FASES

### Diagrama de Progresión

```
Fase 0 (Setup) ──────────────────────────────────────────── COMPLETADA ✅
    │
    ├─ Backend Django funcionando
    ├─ Frontend Next.js funcionando
    ├─ PostgreSQL conectado
    └─ Git inicializado
    │
    ▼
Fase 1 (Modelos + Auth) ─────────────────────── 3-4 días
    │
    ├─ Todos los modelos Django implementados
    ├─ Migraciones aplicadas
    ├─ Sistema de autenticación JWT
    ├─ CustomUser
    └─ Tests > 90%
    │
    ▼
Fase 2 (API + Serializers) ──────────────────── 3-4 días
    │
    ├─ Serializers completos
    ├─ ViewSets con filtros
    ├─ Paginación
    ├─ Validaciones robustas
    └─ Tests API > 85%
    │
    ▼
Fase 3 (Frontend MVP) ───────────────────────── 5-6 días
    │
    ├─ ItemsTable con filtros avanzados
    ├─ CRUD completo de ítems
    ├─ Gestión de catálogos
    ├─ Dashboard inicial
    └─ Autenticación frontend
    │
    ▼
Fase 4 (Import/Export) ──────────────────────── 3-4 días
    │
    ├─ Importación Excel con validación
    ├─ Auto-creación de artículos
    ├─ Exportación Excel
    ├─ Componentes upload/download
    └─ Manejo de errores detallado
    │
    ▼
Fase 5 (Batch Edit) ─────────────────────────── 3-4 días ⭐ PRIORIDAD
    │
    ├─ Endpoint batch-update
    ├─ Modal con react-data-grid
    ├─ Validación por celda
    ├─ Transacción atómica
    └─ UX optimizada
    │
    ▼
Fase 6 (Polish + Tests) ─────────────────────── 2-3 días
    │
    ├─ Tests E2E
    ├─ Optimización de queries
    ├─ UX improvements
    ├─ Documentación completa
    └─ Coverage > 85%
    │
    ▼
Fase 7 (Docker + Deploy) ────────────────────── 2-3 días
    │
    ├─ Dockerfiles
    ├─ docker-compose.yml
    ├─ nginx configurado
    ├─ Variables de producción
    └─ Guía de deployment
```

---

### Resumen de Entregables por Fase

| Fase | Duración | Backend | Frontend | Tests | Docs |
|------|----------|---------|----------|-------|------|
| **0** | 1-2 días | Setup Django | Setup Next.js | - | README |
| **1** | 3-4 días | Modelos + Auth | - | > 90% | API Docs |
| **2** | 3-4 días | API completa | - | > 85% | Endpoints |
| **3** | 5-6 días | - | CRUD + Dashboard | > 70% | Components |
| **4** | 3-4 días | Import/Export | Upload/Download | > 80% | Flujos |
| **5** | 3-4 días | Batch Update | Modal Edición | > 85% | UX Guide |
| **6** | 2-3 días | Optimización | Polish | > 85% | Final |
| **7** | 2-3 días | Docker | Deploy | E2E | Deployment |

**Total estimado:** 22-30 días de trabajo efectivo

---

## 📊 FASE 1: MODELOS Y AUTENTICACIÓN

### Objetivo
Implementar todos los modelos Django con validaciones robustas y sistema de autenticación JWT completo.

### Duración: 3-4 días

---

### Tarea 1.1: Modelo Base (TimeStampedModel)

**Archivo: `apps/core/models.py`**

```python
"""
Modelo base abstracto para timestamps.
"""
from django.db import models


class TimeStampedModel(models.Model):
    """
    Modelo abstracto que agrega campos de auditoría temporal.
    
    Attributes:
        created_at: Fecha y hora de creación (auto)
        updated_at: Fecha y hora de última modificación (auto)
    """
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de creación",
        help_text="Timestamp de creación del registro",
        db_index=True
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Fecha de actualización",
        help_text="Timestamp de última modificación",
        db_index=True
    )
    
    class Meta:
        abstract = True
        ordering = ['-created_at']
```

**Tests:**
```python
# apps/core/tests/test_models.py

import pytest
from django.utils import timezone
from datetime import timedelta


@pytest.mark.django_db
class TestTimeStampedModel:
    """Tests para TimeStampedModel."""
    
    def test_created_at_auto_set(self, sede):
        """created_at se establece automáticamente."""
        assert sede.created_at is not None
        assert sede.created_at <= timezone.now()
    
    def test_updated_at_auto_updates(self, sede):
        """updated_at se actualiza al guardar."""
        old_updated = sede.updated_at
        
        # Esperar 1 segundo
        import time
        time.sleep(1)
        
        sede.nombre = "Nombre Actualizado"
        sede.save()
        
        assert sede.updated_at > old_updated
```

---

### Tarea 1.2: Enums y Choices

**Archivo: `apps/inventario/models/choices.py`**

```python
"""
Enumeraciones y constantes del sistema de inventario.
"""
from django.db import models


class TipoUbicacion(models.TextChoices):
    """Tipos de ubicaciones físicas."""
    AULA = 'aula', 'Aula'
    LABORATORIO = 'laboratorio', 'Laboratorio'
    OFICINA = 'oficina', 'Oficina'
    BIBLIOTECA = 'biblioteca', 'Biblioteca'
    DEPOSITO = 'deposito', 'Depósito'
    AUDITORIO = 'auditorio', 'Auditorio'
    SALON_MULTIPLE = 'salon_multiple', 'Salón Múltiple'
    OTRO = 'otro', 'Otro'


class CategoriaArticulo(models.TextChoices):
    """Categorías principales de artículos."""
    TECNOLOGIA = 'tecnologia', 'Tecnología'
    MOBILIARIO = 'mobiliario', 'Mobiliario'
    LABORATORIO = 'laboratorio', 'Laboratorio'
    DEPORTES = 'deportes', 'Deportes'
    AUDIOVISUAL = 'audiovisual', 'Audiovisual'
    LIBROS = 'libros', 'Libros'
    HERRAMIENTAS = 'herramientas', 'Herramientas'
    VEHICULOS = 'vehiculos', 'Vehículos'
    OTROS = 'otros', 'Otros'


class EstadoItem(models.TextChoices):
    """Estado físico del ítem."""
    ACTIVO = 'activo', 'Activo'
    INACTIVO = 'inactivo', 'Inactivo'
    MANTENIMIENTO = 'mantenimiento', 'En Mantenimiento'
    DADO_BAJA = 'dado_baja', 'Dado de Baja'
    EXTRAVIADO = 'extraviado', 'Extraviado'
    REPARACION = 'reparacion', 'En Reparación'


class TipoMovimiento(models.TextChoices):
    """Tipos de movimientos en el historial."""
    CREACION = 'creacion', 'Creación'
    MODIFICACION = 'modificacion', 'Modificación'
    CAMBIO_UBICACION = 'cambio_ubicacion', 'Cambio de Ubicación'
    CAMBIO_RESPONSABLE = 'cambio_responsable', 'Cambio de Responsable'
    CAMBIO_ESTADO = 'cambio_estado', 'Cambio de Estado'
    ELIMINACION = 'eliminacion', 'Eliminación'
    IMPORTACION = 'importacion', 'Importación Excel'
    EXPORTACION = 'exportacion', 'Exportación Excel'
    BATCH_UPDATE = 'batch_update', 'Actualización Masiva'


class TipoDocumento(models.TextChoices):
    """Tipos de documento de identidad."""
    CC = 'cc', 'Cédula de Ciudadanía'
    TI = 'ti', 'Tarjeta de Identidad'
    CE = 'ce', 'Cédula de Extranjería'
    PAS = 'pas', 'Pasaporte'
    NIT = 'nit', 'NIT'
```

**Exponer en `__init__.py`:**
```python
# apps/inventario/models/__init__.py

from .choices import (
    TipoUbicacion,
    CategoriaArticulo,
    EstadoItem,
    TipoMovimiento,
    TipoDocumento,
)

__all__ = [
    'TipoUbicacion',
    'CategoriaArticulo',
    'EstadoItem',
    'TipoMovimiento',
    'TipoDocumento',
]
```

---

### Tarea 1.3: Modelo CustomUser

**Archivo: `apps/authentication/models.py`**

```python
"""
Modelo de usuario personalizado.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    """
    Usuario personalizado del sistema.
    
    Extiende AbstractUser de Django para agregar campos adicionales.
    """
    
    email = models.EmailField(
        unique=True,
        verbose_name="Email",
        help_text="Email institucional del usuario"
    )
    
    telefono = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Teléfono"
    )
    
    cargo = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Cargo"
    )
    
    class Meta:
        db_table = 'authentication_user'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['username']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.username})"
    
    def get_full_name(self):
        """Retorna nombre completo o username."""
        full_name = super().get_full_name()
        return full_name if full_name else self.username
```

**Registrar en admin:**
```python
# apps/authentication/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """Admin para CustomUser."""
    
    list_display = ['username', 'email', 'first_name', 'last_name', 'cargo', 'is_staff']
    list_filter = ['is_staff', 'is_superuser', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Información Adicional', {
            'fields': ('telefono', 'cargo')
        }),
    )
```

---

### Tarea 1.4: Modelos de Catálogos

Ver especificación completa en `docs/specs/01-MODELO-DATOS.md`

**Orden de implementación:**
1. Sede
2. Responsable
3. Ubicacion
4. Articulo

**Migración:**
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

---

### Tarea 1.5: Modelo ItemInventario

Ver especificación completa en `docs/specs/01-MODELO-DATOS.md`

**Puntos críticos:**
- Constraint de código único
- Validación de responsable en misma sede
- Propiedad `valor_total` calculada
- Índices para performance

---

### Tarea 1.6: Modelo HistorialMovimiento

Ver especificación completa en `docs/specs/01-MODELO-DATOS.md`

**Signal para auto-creación:**

```python
# apps/inventario/signals.py

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import ItemInventario, HistorialMovimiento


@receiver(post_save, sender=ItemInventario)
def crear_historial_creacion(sender, instance, created, **kwargs):
    """
    Crear registro de historial al crear un ítem.
    """
    if created:
        HistorialMovimiento.objects.create(
            item=instance,
            tipo_movimiento='creacion',
            datos_nuevos={
                'codigo': instance.codigo,
                'articulo': instance.articulo.nombre,
                'ubicacion': instance.ubicacion.nombre,
                'responsable': instance.responsable.nombre_completo,
            },
            observaciones='Creación inicial del ítem'
        )


@receiver(pre_save, sender=ItemInventario)
def detectar_cambios_item(sender, instance, **kwargs):
    """
    Detectar cambios en el ítem y crear historial.
    """
    if instance.pk:  # Solo si ya existe
        try:
            old_instance = ItemInventario.objects.get(pk=instance.pk)
            
            # Detectar cambio de ubicación
            if old_instance.ubicacion != instance.ubicacion:
                HistorialMovimiento.objects.create(
                    item=instance,
                    tipo_movimiento='cambio_ubicacion',
                    datos_anteriores={'ubicacion': old_instance.ubicacion.nombre},
                    datos_nuevos={'ubicacion': instance.ubicacion.nombre},
                    observaciones=f'Movido de {old_instance.ubicacion.nombre} a {instance.ubicacion.nombre}'
                )
            
            # Detectar cambio de responsable
            if old_instance.responsable != instance.responsable:
                HistorialMovimiento.objects.create(
                    item=instance,
                    tipo_movimiento='cambio_responsable',
                    datos_anteriores={'responsable': old_instance.responsable.nombre_completo},
                    datos_nuevos={'responsable': instance.responsable.nombre_completo},
                    observaciones=f'Reasignado de {old_instance.responsable.nombre_completo} a {instance.responsable.nombre_completo}'
                )
            
            # Detectar cambio de estado
            if old_instance.estado != instance.estado:
                HistorialMovimiento.objects.create(
                    item=instance,
                    tipo_movimiento='cambio_estado',
                    datos_anteriores={'estado': old_instance.estado},
                    datos_nuevos={'estado': instance.estado},
                    observaciones=f'Estado cambiado de {old_instance.estado} a {instance.estado}'
                )
        
        except ItemInventario.DoesNotExist:
            pass
```

**Registrar signals:**
```python
# apps/inventario/apps.py

from django.apps import AppConfig


class InventarioConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.inventario'
    verbose_name = 'Inventario'
    
    def ready(self):
        import apps.inventario.signals  # noqa
```

---

### Tarea 1.7: Autenticación JWT

**Serializers:**

```python
# apps/authentication/serializers.py

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para datos de usuario.
    """
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'cargo']
        read_only_fields = ['id']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer JWT que incluye datos del usuario.
    """
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Agregar información del usuario
        user_data = UserSerializer(self.user).data
        data['user'] = user_data
        
        return data


class LogoutSerializer(serializers.Serializer):
    """
    Serializer para logout con invalidación de refresh token.
    """
    
    refresh = serializers.CharField(required=True)
    
    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs
    
    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except Exception:
            raise serializers.ValidationError({'detail': 'Token inválido'})
```

**Views:**

```python
# apps/authentication/views.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer, LogoutSerializer


class LoginView(TokenObtainPairView):
    """
    Vista de login que retorna JWT + datos de usuario.
    
    POST /api/v1/auth/login/
    Body: {"username": "admin", "password": "pass"}
    Response: {"access": "...", "refresh": "...", "user": {...}}
    """
    permission_classes = (AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    """
    Vista de logout que invalida el refresh token.
    
    POST /api/v1/auth/logout/
    Body: {"refresh": "..."}
    Response: {"detail": "Logout exitoso"}
    """
    permission_classes = (IsAuthenticated,)
    
    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(
            {'detail': 'Logout exitoso'},
            status=status.HTTP_200_OK
        )
```

**URLs:**

```python
# apps/authentication/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, LogoutView

app_name = 'authentication'

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
```

---

### Tarea 1.8: Tests de Modelos y Autenticación

**Fixtures:**

```python
# apps/inventario/tests/conftest.py

import pytest
from rest_framework.test import APIClient
from apps.authentication.models import CustomUser
from apps.inventario.models import Sede, Ubicacion, Responsable, Articulo


@pytest.fixture
def api_client():
    """Cliente API de DRF."""
    return APIClient()


@pytest.fixture
def user():
    """Usuario de prueba."""
    return CustomUser.objects.create_user(
        username='testuser',
        password='testpass123',
        email='test@escuela.edu.co',
        first_name='Test',
        last_name='User'
    )


@pytest.fixture
def authenticated_user(api_client, user):
    """Usuario autenticado con tokens."""
    from rest_framework_simplejwt.tokens import RefreshToken
    
    refresh = RefreshToken.for_user(user)
    tokens = {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }
    
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {tokens["access"]}')
    
    return user, tokens


@pytest.fixture
def sede():
    """Sede de prueba."""
    return Sede.objects.create(
        codigo='TEST-001',
        nombre='Sede de Prueba',
        direccion='Calle Falsa 123',
        telefono='3001234567'
    )


@pytest.fixture
def ubicacion(sede):
    """Ubicación de prueba."""
    return Ubicacion.objects.create(
        nombre='Sala de Prueba',
        tipo='laboratorio',
        sede=sede
    )


@pytest.fixture
def responsable(sede):
    """Responsable de prueba."""
    return Responsable.objects.create(
        nombre='Juan',
        apellido='Pérez',
        documento='123456789',
        tipo_documento='cc',
        cargo='Docente',
        sede=sede
    )


@pytest.fixture
def articulo():
    """Artículo de prueba."""
    return Articulo.objects.create(
        nombre='Computador de Prueba',
        categoria='tecnologia',
        descripcion='PC de prueba'
    )
```

**Tests:**

```python
# apps/authentication/tests/test_auth.py

import pytest
from django.urls import reverse
from rest_framework import status


@pytest.mark.django_db
class TestAuthentication:
    """Tests de autenticación JWT."""
    
    def test_login_exitoso(self, api_client, user):
        """Login con credenciales válidas retorna tokens."""
        url = reverse('authentication:login')
        data = {'username': 'testuser', 'password': 'testpass123'}
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert 'user' in response.data
        assert response.data['user']['username'] == 'testuser'
    
    def test_login_credenciales_invalidas(self, api_client):
        """Login con credenciales inválidas retorna 401."""
        url = reverse('authentication:login')
        data = {'username': 'noexiste', 'password': 'wrong'}
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_logout_invalida_token(self, api_client, authenticated_user):
        """Logout invalida el refresh token."""
        user, tokens = authenticated_user
        
        url = reverse('authentication:logout')
        response = api_client.post(url, {'refresh': tokens['refresh']})
        
        assert response.status_code == status.HTTP_200_OK
        
        # Intentar usar el refresh token blacklisteado
        refresh_url = reverse('authentication:refresh')
        response = api_client.post(refresh_url, {'refresh': tokens['refresh']})
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
```

---

### Checklist Fase 1

```markdown
## Modelos
- [ ] TimeStampedModel implementado
- [ ] Enums en choices.py
- [ ] CustomUser implementado
- [ ] Sede implementado con validaciones
- [ ] Responsable implementado
- [ ] Ubicacion implementado
- [ ] Articulo implementado con auto-generación de código
- [ ] ItemInventario implementado con constraints
- [ ] HistorialMovimiento implementado
- [ ] Signals configurados

## Migraciones
- [ ] makemigrations ejecutado sin errores
- [ ] migrate ejecutado exitosamente
- [ ] Índices creados en BD
- [ ] Constraints verificados en BD

## Autenticación
- [ ] Serializers JWT implementados
- [ ] LoginView funcionando
- [ ] LogoutView funcionando
- [ ] Refresh token funcionando
- [ ] URLs configurados

## Tests
- [ ] Fixtures en conftest.py
- [ ] Tests de modelos > 90% coverage
- [ ] Tests de autenticación completos
- [ ] pytest pasa sin errores

## Admin
- [ ] CustomUser registrado en admin
- [ ] Todos los modelos registrados
- [ ] Superusuario creado
- [ ] Admin accesible en /admin/

## Validación
- [ ] python manage.py check sin errores
- [ ] Crear ítems manualmente en admin
- [ ] Login/logout funciona en API
```

---

## 🔌 FASE 2: API REST Y SERIALIZERS

### Objetivo
Implementar API REST completa con serializers, viewsets, filtros y paginación.

### Duración: 3-4 días

---

### Tarea 2.1: Serializers de Catálogos

**Archivo: `apps/inventario/serializers/catalogos.py`**

```python
"""
Serializers para modelos de catálogos.
"""
from rest_framework import serializers
from apps.inventario.models import Sede, Ubicacion, Responsable, Articulo


class SedeSerializer(serializers.ModelSerializer):
    """Serializer para Sede."""
    
    total_ubicaciones = serializers.IntegerField(read_only=True, source='ubicaciones.count')
    total_items = serializers.SerializerMethodField()
    
    class Meta:
        model = Sede
        fields = [
            'id', 'codigo', 'nombre', 'direccion', 'telefono',
            'email', 'activo', 'total_ubicaciones', 'total_items',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_total_items(self, obj):
        """Total de ítems activos en la sede."""
        return obj.items.exclude(estado='dado_baja').count()


class UbicacionSerializer(serializers.ModelSerializer):
    """Serializer para Ubicacion."""
    
    sede_nombre = serializers.CharField(source='sede.nombre', read_only=True)
    total_items = serializers.IntegerField(read_only=True, source='items.count')
    
    class Meta:
        model = Ubicacion
        fields = [
            'id', 'nombre', 'tipo', 'sede', 'sede_nombre',
            'capacidad', 'piso', 'observaciones', 'activo',
            'total_items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ResponsableSerializer(serializers.ModelSerializer):
    """Serializer para Responsable."""
    
    nombre_completo = serializers.CharField(read_only=True)
    sede_nombre = serializers.CharField(source='sede.nombre', read_only=True)
    total_items = serializers.IntegerField(read_only=True, source='items_asignados.count')
    
    class Meta:
        model = Responsable
        fields = [
            'id', 'nombre', 'apellido', 'nombre_completo',
            'tipo_documento', 'documento', 'cargo', 'email',
            'telefono', 'sede', 'sede_nombre', 'activo',
            'total_items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'nombre_completo', 'created_at', 'updated_at']


class ArticuloSerializer(serializers.ModelSerializer):
    """Serializer para Articulo."""
    
    total_items = serializers.IntegerField(read_only=True, source='items_inventario.count')
    
    class Meta:
        model = Articulo
        fields = [
            'id', 'nombre', 'codigo', 'categoria', 'descripcion',
            'foto', 'activo', 'total_items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'codigo', 'created_at', 'updated_at']
```

---

### Tarea 2.2: Serializers de Items

**Archivo: `apps/inventario/serializers/item.py`**

```python
"""
Serializers para ItemInventario.
"""
from rest_framework import serializers
from apps.inventario.models import ItemInventario
from .catalogos import SedeSerializer, UbicacionSerializer, ResponsableSerializer, ArticuloSerializer


class ItemInventarioListSerializer(serializers.ModelSerializer):
    """
    Serializer para lista de ítems (optimizado).
    """
    
    articulo_nombre = serializers.CharField(source='articulo.nombre', read_only=True)
    ubicacion_nombre = serializers.CharField(source='ubicacion.nombre', read_only=True)
    responsable_nombre = serializers.CharField(source='responsable.nombre_completo', read_only=True)
    
    class Meta:
        model = ItemInventario
        fields = [
            'id', 'codigo', 'articulo_nombre', 'ubicacion_nombre',
            'responsable_nombre', 'cantidad', 'valor_unitario',
            'valor_total', 'estado', 'created_at'
        ]


class ItemInventarioSerializer(serializers.ModelSerializer):
    """
    Serializer completo para ItemInventario.
    """
    
    # Nested para lectura
    articulo = ArticuloSerializer(read_only=True)
    sede = SedeSerializer(read_only=True)
    ubicacion = UbicacionSerializer(read_only=True)
    responsable = ResponsableSerializer(read_only=True)
    
    # IDs para escritura
    articulo_id = serializers.PrimaryKeyRelatedField(
        queryset=Articulo.objects.filter(activo=True),
        source='articulo',
        write_only=True
    )
    ubicacion_id = serializers.PrimaryKeyRelatedField(
        queryset=Ubicacion.objects.filter(activo=True),
        source='ubicacion',
        write_only=True
    )
    responsable_id = serializers.PrimaryKeyRelatedField(
        queryset=Responsable.objects.filter(activo=True),
        source='responsable',
        write_only=True
    )
    
    class Meta:
        model = ItemInventario
        fields = [
            'id', 'codigo', 'articulo', 'articulo_id', 'sede',
            'ubicacion', 'ubicacion_id', 'responsable', 'responsable_id',
            'cantidad', 'valor_unitario', 'valor_total', 'estado',
            'descripcion', 'observaciones', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'sede', 'valor_total', 'created_at', 'updated_at']
    
    def validate_cantidad(self, value):
        """Validar que cantidad esté en rango."""
        if not (1 <= value <= 9999):
            raise serializers.ValidationError(
                "La cantidad debe estar entre 1 y 9999"
            )
        return value
    
    def validate_valor_unitario(self, value):
        """Validar que valor sea positivo."""
        if value < 0:
            raise serializers.ValidationError(
                "El valor unitario debe ser mayor o igual a 0"
            )
        return value
    
    def validate(self, attrs):
        """Validaciones cruzadas."""
        ubicacion = attrs.get('ubicacion')
        responsable = attrs.get('responsable')
        
        if ubicacion and responsable:
            if responsable.sede != ubicacion.sede:
                raise serializers.ValidationError({
                    'responsable_id': f'El responsable debe pertenecer a {ubicacion.sede.codigo}'
                })
        
        return attrs


class ItemInventarioDetailSerializer(ItemInventarioSerializer):
    """
    Serializer extendido con historial.
    """
    from apps.inventario.serializers.historial import HistorialMovimientoSerializer
    
    historial = HistorialMovimientoSerializer(many=True, read_only=True)
    
    class Meta(ItemInventarioSerializer.Meta):
        fields = ItemInventarioSerializer.Meta.fields + ['historial']
```

---

### Tarea 2.3: Filtros

**Archivo: `apps/inventario/filters.py`**

```python
"""
Filtros para API de inventario.
"""
import django_filters
from apps.inventario.models import ItemInventario, Sede, Ubicacion, Responsable, Articulo


class ItemInventarioFilter(django_filters.FilterSet):
    """
    Filtros avanzados para ítems del inventario.
    """
    
    # Filtros exactos
    sede = django_filters.NumberFilter(field_name='sede__id')
    ubicacion = django_filters.NumberFilter(field_name='ubicacion__id')
    responsable = django_filters.NumberFilter(field_name='responsable__id')
    articulo = django_filters.NumberFilter(field_name='articulo__id')
    estado = django_filters.ChoiceFilter(choices=ItemInventario._meta.get_field('estado').choices)
    
    # Filtros por rango
    valor_min = django_filters.NumberFilter(field_name='valor_unitario', lookup_expr='gte')
    valor_max = django_filters.NumberFilter(field_name='valor_unitario', lookup_expr='lte')
    
    cantidad_min = django_filters.NumberFilter(field_name='cantidad', lookup_expr='gte')
    cantidad_max = django_filters.NumberFilter(field_name='cantidad', lookup_expr='lte')
    
    # Filtros por fecha
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = ItemInventario
        fields = ['sede', 'ubicacion', 'responsable', 'articulo', 'estado']


class SedeFilter(django_filters.FilterSet):
    """Filtros para Sede."""
    
    activo = django_filters.BooleanFilter()
    
    class Meta:
        model = Sede
        fields = ['activo']
```

---

### Tarea 2.4: ViewSets

**Archivo: `apps/inventario/views/catalogos.py`**

```python
"""
ViewSets para catálogos.
"""
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from apps.inventario.models import Sede, Ubicacion, Responsable, Articulo
from apps.inventario.serializers.catalogos import (
    SedeSerializer,
    UbicacionSerializer,
    ResponsableSerializer,
    ArticuloSerializer
)


class SedeViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de Sedes."""
    
    permission_classes = [IsAuthenticated]
    serializer_class = SedeSerializer
    queryset = Sede.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['activo']
    search_fields = ['codigo', 'nombre']
    ordering_fields = ['codigo', 'nombre', 'created_at']
    ordering = ['codigo']


class UbicacionViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de Ubicaciones."""
    
    permission_classes = [IsAuthenticated]
    serializer_class = UbicacionSerializer
    queryset = Ubicacion.objects.select_related('sede')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['sede', 'tipo', 'activo']
    search_fields = ['nombre', 'sede__nombre']
    ordering_fields = ['nombre', 'created_at']
    ordering = ['sede__codigo', 'nombre']


class ResponsableViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de Responsables."""
    
    permission_classes = [IsAuthenticated]
    serializer_class = ResponsableSerializer
    queryset = Responsable.objects.select_related('sede')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['sede', 'activo']
    search_fields = ['nombre', 'apellido', 'documento']
    ordering_fields = ['apellido', 'created_at']
    ordering = ['apellido', 'nombre']


class ArticuloViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de Artículos."""
    
    permission_classes = [IsAuthenticated]
    serializer_class = ArticuloSerializer
    queryset = Articulo.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'activo']
    search_fields = ['nombre', 'codigo', 'descripcion']
    ordering_fields = ['nombre', 'codigo', 'created_at']
    ordering = ['categoria', 'nombre']
```

**Archivo: `apps/inventario/views/item.py`**

```python
"""
ViewSet para ItemInventario.
"""
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from apps.inventario.models import ItemInventario
from apps.inventario.serializers.item import (
    ItemInventarioListSerializer,
    ItemInventarioSerializer,
    ItemInventarioDetailSerializer
)
from apps.inventario.filters import ItemInventarioFilter


class ItemInventarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para CRUD de ítems del inventario.
    
    Endpoints:
        - GET /items/ - Listar (paginado)
        - POST /items/ - Crear
        - GET /items/{id}/ - Detalle
        - PUT /items/{id}/ - Actualizar
        - PATCH /items/{id}/ - Actualizar parcial
        - DELETE /items/{id}/ - Eliminar (soft delete)
    """
    
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ItemInventarioFilter
    search_fields = ['codigo', 'articulo__nombre', 'ubicacion__nombre', 'descripcion']
    ordering_fields = ['codigo', 'created_at', 'valor_total', 'estado']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Optimizar queries."""
        return ItemInventario.objects.select_related(
            'articulo',
            'sede',
            'ubicacion',
            'ubicacion__sede',
            'responsable',
            'responsable__sede'
        ).prefetch_related('historial')
    
    def get_serializer_class(self):
        """Serializer según acción."""
        if self.action == 'list':
            return ItemInventarioListSerializer
        elif self.action == 'retrieve':
            return ItemInventarioDetailSerializer
        return ItemInventarioSerializer
    
    def perform_create(self, serializer):
        """Auto-asignar sede."""
        ubicacion = serializer.validated_data['ubicacion']
        serializer.save(sede=ubicacion.sede)
    
    def perform_update(self, serializer):
        """Auto-actualizar sede si cambia ubicación."""
        ubicacion = serializer.validated_data.get('ubicacion')
        if ubicacion:
            serializer.save(sede=ubicacion.sede)
        else:
            serializer.save()
    
    def perform_destroy(self, instance):
        """Soft delete."""
        instance.estado = 'dado_baja'
        instance.save()
```

---

### Tarea 2.5: Registrar ViewSets en URLs

**Archivo: `apps/inventario/urls.py`**

```python
"""
URLs de inventario.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.catalogos import (
    SedeViewSet,
    UbicacionViewSet,
    ResponsableViewSet,
    ArticuloViewSet
)
from .views.item import ItemInventarioViewSet

app_name = 'inventario'

router = DefaultRouter()
router.register(r'sedes', SedeViewSet, basename='sedes')
router.register(r'ubicaciones', UbicacionViewSet, basename='ubicaciones')
router.register(r'responsables', ResponsableViewSet, basename='responsables')
router.register(r'articulos', ArticuloViewSet, basename='articulos')
router.register(r'items', ItemInventarioViewSet, basename='items')

urlpatterns = [
    path('', include(router.urls)),
]
```

---

### Tarea 2.6: Tests de API

```python
# apps/inventario/tests/test_api.py

import pytest
from django.urls import reverse
from rest_framework import status


@pytest.mark.django_db
class TestItemAPI:
    """Tests de API de ítems."""
    
    def test_listar_items(self, api_client, authenticated_user):
        """GET /items/ retorna lista paginada."""
        url = reverse('inventario:items-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data
        assert 'count' in response.data
    
    def test_crear_item_exitoso(self, api_client, authenticated_user, ubicacion, responsable, articulo):
        """POST /items/ crea ítem correctamente."""
        url = reverse('inventario:items-list')
        data = {
            'codigo': 'INV-TEST-001',
            'articulo_id': articulo.id,
            'ubicacion_id': ubicacion.id,
            'responsable_id': responsable.id,
            'cantidad': 1,
            'valor_unitario': '100000.00',
            'estado': 'activo',
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['codigo'] == 'INV-TEST-001'
        assert ItemInventario.objects.filter(codigo='INV-TEST-001').exists()
    
    def test_crear_item_codigo_duplicado(self, api_client, authenticated_user, item):
        """POST /items/ con código duplicado retorna 400."""
        url = reverse('inventario:items-list')
        data = {
            'codigo': item.codigo,  # Duplicado
            # ... resto de datos
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
```

---

### Checklist Fase 2

```markdown
## Serializers
- [ ] SedeSerializer completo
- [ ] UbicacionSerializer completo
- [ ] ResponsableSerializer completo
- [ ] ArticuloSerializer completo
- [ ] ItemInventarioListSerializer (optimizado)
- [ ] ItemInventarioSerializer completo
- [ ] ItemInventarioDetailSerializer con historial
- [ ] Validaciones implementadas

## Filtros
- [ ] ItemInventarioFilter con todos los filtros
- [ ] Filtros de catálogos
- [ ] django-filter configurado en settings

## ViewSets
- [ ] SedeViewSet funcionando
- [ ] UbicacionViewSet funcionando
- [ ] ResponsableViewSet funcionando
- [ ] ArticuloViewSet funcionando
- [ ] ItemInventarioViewSet completo
- [ ] Optimización de queries con select_related/prefetch_related
- [ ] Soft delete funcionando

## URLs
- [ ] Router configurado
- [ ] Todos los viewsets registrados
- [ ] URLs accesibles

## Tests
- [ ] Tests de serializers > 85%
- [ ] Tests de ViewSets > 85%
- [ ] Tests de filtros
- [ ] Tests de validaciones

## Validación
- [ ] Endpoint /items/ funciona
- [ ] Paginación funciona
- [ ] Búsqueda funciona
- [ ] Filtros funcionan
- [ ] Ordering funciona
- [ ] Create/Update/Delete funciona
```

---

## ⚛️ FASE 3: FRONTEND MVP

### Objetivo
Implementar interfaz completa de usuario con tabla de ítems, CRUD, dashboard y autenticación.

### Duración: 5-6 días

---

### Tarea 3.1: Cliente API (Axios)

**Archivo: `lib/api/client.ts`**

```typescript
/**
 * Cliente HTTP configurado con Axios.
 */
import axios from 'axios';
import { useAuthStore } from '@/lib/stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Crear instancia de Axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para renovar token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = useAuthStore.getState().refreshToken;
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          
          useAuthStore.getState().setTokens(access, refreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);
```

---

### Tarea 3.2: Store de Autenticación

Ver especificación completa en `docs/specs/02-FEATURES.md` (RF-001)

---

### Tarea 3.3: Componente de Login

Ver especificación completa en `docs/specs/02-FEATURES.md` (RF-001)

---

### Tarea 3.4: Middleware de Protección

Ver especificación completa en `docs/specs/02-FEATURES.md` (RF-001)

---

### Tarea 3.5: API de Items (Frontend)

**Archivo: `lib/api/items.ts`**

```typescript
/**
 * Cliente API para ítems del inventario.
 */
import { apiClient } from './client';
import type { IItem, IItemFilters, IPaginatedResponse } from '@/types/item';

export const ItemsAPI = {
  /**
   * Listar ítems con filtros y paginación.
   */
  list: async (filters: IItemFilters = {}): Promise<IPaginatedResponse<IItem>> => {
    const response = await apiClient.get('/inventario/items/', {
      params: filters,
    });
    return response.data;
  },
  
  /**
   * Obtener detalle de un ítem.
   */
  get: async (id: number): Promise<IItem> => {
    const response = await apiClient.get(`/inventario/items/${id}/`);
    return response.data;
  },
  
  /**
   * Crear nuevo ítem.
   */
  create: async (data: Partial<IItem>): Promise<IItem> => {
    const response = await apiClient.post('/inventario/items/', data);
    return response.data;
  },
  
  /**
   * Actualizar ítem.
   */
  update: async (id: number, data: Partial<IItem>): Promise<IItem> => {
    const response = await apiClient.put(`/inventario/items/${id}/`, data);
    return response.data;
  },
  
  /**
   * Actualizar parcialmente.
   */
  partialUpdate: async (id: number, data: Partial<IItem>): Promise<IItem> => {
    const response = await apiClient.patch(`/inventario/items/${id}/`, data);
    return response.data;
  },
  
  /**
   * Eliminar ítem (soft delete).
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/inventario/items/${id}/`);
  },
};
```

---

### Tarea 3.6: Types de TypeScript

**Archivo: `types/item.ts`**

```typescript
/**
 * Types para ítems del inventario.
 */

export interface IArticulo {
  id: number;
  nombre: string;
  codigo: string;
  categoria: string;
  descripcion: string;
  foto: string | null;
  activo: boolean;
  total_items: number;
  created_at: string;
  updated_at: string;
}

export interface ISede {
  id: number;
  codigo: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  activo: boolean;
  total_ubicaciones: number;
  total_items: number;
  created_at: string;
  updated_at: string;
}

export interface IUbicacion {
  id: number;
  nombre: string;
  tipo: string;
  sede: number;
  sede_nombre: string;
  capacidad: number | null;
  piso: number | null;
  observaciones: string;
  activo: boolean;
  total_items: number;
  created_at: string;
  updated_at: string;
}

export interface IResponsable {
  id: number;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  tipo_documento: string;
  documento: string;
  cargo: string;
  email: string;
  telefono: string;
  sede: number;
  sede_nombre: string;
  activo: boolean;
  total_items: number;
  created_at: string;
  updated_at: string;
}

export interface IItem {
  id: number;
  codigo: string;
  articulo: IArticulo;
  sede: ISede;
  ubicacion: IUbicacion;
  responsable: IResponsable;
  cantidad: number;
  valor_unitario: string;
  valor_total: string;
  estado: 'activo' | 'inactivo' | 'mantenimiento' | 'dado_baja' | 'extraviado' | 'reparacion';
  descripcion: string;
  observaciones: string;
  created_at: string;
  updated_at: string;
}

export interface IItemFilters {
  page?: number;
  page_size?: number;
  search?: string;
  sede?: number;
  ubicacion?: number;
  responsable?: number;
  articulo?: number;
  estado?: string;
  valor_min?: number;
  valor_max?: number;
  ordering?: string;
}

export interface IPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
```

---

### Tarea 3.7: Tabla de Ítems

Ver especificación completa en `docs/specs/02-FEATURES.md` (RF-002)

---

### Tarea 3.8: Formulario de Ítem

**Archivo: `components/items/ItemForm.tsx`**

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { itemSchema, type ItemFormData } from '@/lib/schemas/itemSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { IItem } from '@/types/item';

interface ItemFormProps {
  item?: IItem;
  onSubmit: (data: ItemFormData) => Promise<void>;
  onCancel: () => void;
}

export function ItemForm({ item, onSubmit, onCancel }: ItemFormProps) {
  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: item ? {
      codigo: item.codigo,
      articulo_id: item.articulo.id,
      ubicacion_id: item.ubicacion.id,
      responsable_id: item.responsable.id,
      cantidad: item.cantidad,
      valor_unitario: parseFloat(item.valor_unitario),
      estado: item.estado,
      descripcion: item.descripcion,
      observaciones: item.observaciones,
    } : {
      cantidad: 1,
      valor_unitario: 0,
      estado: 'activo',
    },
  });
  
  const handleSubmit = async (data: ItemFormData) => {
    await onSubmit(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="codigo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input {...field} placeholder="INV-00001" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Resto de campos... */}
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

---

### Checklist Fase 3

```markdown
## Autenticación Frontend
- [ ] AuthStore implementado
- [ ] Login page funcionando
- [ ] Logout funcionando
- [ ] Middleware de protección
- [ ] Redirect automático si no autenticado

## API Client
- [ ] Axios configurado
- [ ] Interceptors para token
- [ ] Refresh token automático
- [ ] Manejo de errores

## Types
- [ ] Todas las interfaces definidas
- [ ] Types exportados correctamente

## Componentes
- [ ] ItemsTable con filtros
- [ ] ItemForm completo
- [ ] Paginación funcionando
- [ ] Loading states
- [ ] Error states

## Navegación
- [ ] Layout principal
- [ ] Navbar
- [ ] Sidebar (opcional)
- [ ] Rutas protegidas

## Validación
- [ ] Frontend carga en localhost:3000
- [ ] Login funciona
- [ ] Tabla de ítems carga
- [ ] Crear ítem funciona
- [ ] Editar ítem funciona
- [ ] Eliminar ítem funciona
```

---

## 📤 FASE 4: IMPORT/EXPORT EXCEL

Ver especificación completa en `docs/specs/02-FEATURES.md` (RF-004 y RF-005)

### Duración: 3-4 días

---

## ✏️ FASE 5: EDICIÓN MASIVA

Ver especificación completa en `docs/specs/02-FEATURES.md` (RF-006)

### Duración: 3-4 días ⭐ PRIORIDAD ALTA

---

## 🧪 FASE 6: TESTING Y POLISH

### Objetivo
Optimizar performance, completar tests y pulir UX.

### Duración: 2-3 días

---

## 🐳 FASE 7: DOCKER Y DEPLOYMENT

### Objetivo
Dockerizar aplicación y preparar para deployment.

### Duración: 2-3 días

---

## 📚 METODOLOGÍA DE TRABAJO

### Flujo de Desarrollo

```
1. PLANIFICACIÓN
   ├─ Leer especificación de tarea
   ├─ Identificar dependencias
   └─ Estimar tiempo

2. IMPLEMENTACIÓN
   ├─ Escribir código
   ├─ Seguir estándares
   └─ Documentar inline

3. VALIDACIÓN LOCAL
   ├─ Ejecutar linters
   ├─ Ejecutar tests
   └─ Probar manualmente

4. REVISIÓN HUMANA
   ├─ Verificar checklist
   ├─ Probar funcionalmente
   └─ Aprobar o corregir

5. COMMIT
   ├─ Mensaje descriptivo
   ├─ Push a repositorio
   └─ Actualizar docs
```

---

**Documento generado:** Noviembre 16, 2025  
**Versión:** 2.0  
**Próximo:** ¡Implementación! 🚀
```

---

## ✅ ¡TODOS LOS ARCHIVOS GENERADOS!

Edilberto, ya tienes los **5 archivos completos** de la reorganización:

1. ✅ `docs/specs/01-MODELO-DATOS.md` (ya estaba)
2. ✅ `docs/specs/02-FEATURES.md` 
3. ✅ `docs/specs/03-ESTANDARES.md`
4. ✅ `docs/specs/04-FASE-0-SETUP.md`
5. ✅ `docs/specs/05-FASES-1-7.md` (este último)

---

## 📝 PRÓXIMOS PASOS RECOMENDADOS

1. **Copia el archivo 5** en `docs/specs/05-FASES-1-7.md`

2. **Elimina los archivos antiguos** que ya no necesitas:
   ```bash
   rm "docs/specs/0. Requerimientos-DETALLADOS.md"
   rm "docs/specs/2. Fases.md"
   rm "docs/specs/2.1-fases_perspectiva.md"
   rm "docs/specs/Metodologia.md"
   ```

3. **Renombra el archivo de estándares**:
   ```bash
   mv "docs/specs/1. Estandares-codigo.md" "docs/specs/03-ESTANDARES-old.md"
   # (como backup, luego puedes eliminar)
   ```

4. **Commit de la reorganización**:
   ```bash
   git add docs/specs/
   git commit -m "docs(specs): reorganización completa de documentación técnica

   - 01-MODELO-DATOS.md: Modelo de datos completo y optimizado
   - 02-FEATURES.md: Especificación funcional de todas las features
   - 03-ESTANDARES.md: Estándares de código y convenciones
   - 04-FASE-0-SETUP.md: Guía paso a paso de setup inicial
   - 05-FASES-1-7.md: Plan de implementación completo

   Eliminados archivos antiguos con numeración inconsistente.
   Nueva estructura: 01-05 con nombres descriptivos."
   ```

5. **¡Listo para comenzar Fase 0!** 🚀

Ahora tienes toda la documentación reorganizada, coherente y lista para usar con los agentes de código (Cursor, Windsurf, etc.).