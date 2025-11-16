# FEATURES

```markdown
# FEATURES Y FLUJOS - Sistema de Inventario Escolar
**Versión:** 2.0  
**Fecha:** Noviembre 16, 2025  
**Propósito:** Especificación funcional completa de todas las features del sistema

---

## 📋 ÍNDICE

1. [Overview de Features](#overview-de-features)
2. [RF-001: Autenticación y Autorización](#rf-001-autenticación-y-autorización)
3. [RF-002: CRUD de Ítems](#rf-002-crud-de-ítems)
4. [RF-003: Gestión de Catálogos](#rf-003-gestión-de-catálogos)
5. [RF-004: Importación Excel](#rf-004-importación-excel)
6. [RF-005: Exportación Excel](#rf-005-exportación-excel)
7. [RF-006: Edición Masiva (Batch Edit)](#rf-006-edición-masiva-batch-edit)
8. [RF-007: Historial de Movimientos](#rf-007-historial-de-movimientos)
9. [RF-008: Filtros y Búsqueda](#rf-008-filtros-y-búsqueda)
10. [Matriz de Features por Fase](#matriz-de-features-por-fase)

---

## 🎯 OVERVIEW DE FEATURES

### Priorización por Fases

| Feature | MVP | MVP+ | Post-MVP | Criticidad |
|---------|:---:|:----:|:--------:|:----------:|
| Autenticación JWT | ✅ | | | 🔴 Crítica |
| CRUD Ítems | ✅ | | | 🔴 Crítica |
| Gestión Catálogos | ✅ | | | 🔴 Crítica |
| Import Excel | ✅ | | | 🔴 Crítica |
| Export Excel | ✅ | | | 🟡 Alta |
| Filtros Avanzados | ✅ | | | 🟡 Alta |
| **Edición Masiva** | | ✅ | | 🔴 **Crítica** |
| Historial UI | | | ✅ | 🟢 Media |
| Vistas Especializadas | | | ✅ | 🟢 Media |
| Permisos Granulares | | | ✅ | 🟢 Media |
| QR Codes | | | ✅ | 🔵 Baja |

---

## 🔐 RF-001: AUTENTICACIÓN Y AUTORIZACIÓN

### Objetivo
Sistema de autenticación JWT para control de acceso y trazabilidad de operaciones.

### Alcance

**MVP:**
- Login con usuario/contraseña
- Tokens JWT (access + refresh)
- Logout con invalidación de tokens
- Protección de endpoints

**Post-MVP:**
- Roles y permisos granulares
- MFA (autenticación multifactor)
- Registro de usuarios (por admin)
- Reseteo de contraseñas

---

### Especificación Backend

#### Endpoints

**1. Login**
```http
POST /api/v1/auth/login/
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@escuela.edu.co",
    "first_name": "Admin",
    "last_name": "Sistema"
  }
}
```

**Errores:**
- `400`: Credenciales faltantes
- `401`: Credenciales inválidas
- `403`: Usuario inactivo

---

**2. Refresh Token**
```http
POST /api/v1/auth/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Respuesta (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

**3. Logout**
```http
POST /api/v1/auth/logout/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Respuesta (200):**
```json
{
  "detail": "Logout exitoso"
}
```

---

#### Implementación Backend

**Serializer:**
```python
# apps/authentication/serializers.py

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer JWT que incluye datos del usuario en la respuesta.
    """
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Agregar información del usuario
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        }
        
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
    """
    permission_classes = (AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    """
    Vista de logout que invalida el refresh token.
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

### Especificación Frontend

#### Store de Autenticación (Zustand)

```typescript
// frontend/lib/stores/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      
      login: async (username: string, password: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        
        if (!response.ok) {
          throw new Error('Credenciales inválidas');
        }
        
        const data = await response.json();
        
        set({
          user: data.user,
          accessToken: data.access,
          refreshToken: data.refresh,
          isAuthenticated: true,
        });
      },
      
      logout: async () => {
        const { refreshToken } = get();
        
        if (refreshToken) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${get().accessToken}`,
            },
            body: JSON.stringify({ refresh: refreshToken }),
          });
        }
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
      
      setTokens: (access: string, refresh: string) => {
        set({ accessToken: access, refreshToken: refresh });
      },
      
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

---

#### Componente de Login

```tsx
// frontend/app/(auth)/login/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(username, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Sistema de Inventario Escolar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

#### Middleware de Autenticación

```typescript
// frontend/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authStorage = request.cookies.get('auth-storage')?.value;
  
  if (!authStorage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    const { state } = JSON.parse(authStorage);
    
    if (!state.isAuthenticated || !state.accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/items/:path*', '/catalogos/:path*'],
};
```

---

### Validaciones

**Backend:**
- ✅ Usuario y contraseña requeridos
- ✅ Usuario debe existir y estar activo
- ✅ Contraseña debe coincidir
- ✅ Tokens con expiración (access: 60min, refresh: 24h)

**Frontend:**
- ✅ Campos requeridos
- ✅ Feedback visual de errores
- ✅ Loading states
- ✅ Redirect automático después de login/logout

---

### Tests Requeridos

```python
# apps/authentication/tests/test_auth.py

import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestAuthentication:
    """
    Tests de autenticación JWT.
    """
    
    def test_login_exitoso(self, api_client):
        """Login con credenciales válidas retorna tokens."""
        user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@escuela.edu.co'
        )
        
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
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {tokens["access"]}')
        
        response = api_client.post(url, {'refresh': tokens['refresh']})
        
        assert response.status_code == status.HTTP_200_OK
        
        # Intentar usar el refresh token blacklisteado
        refresh_url = reverse('authentication:refresh')
        response = api_client.post(refresh_url, {'refresh': tokens['refresh']})
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
```

---

## 📦 RF-002: CRUD DE ÍTEMS

### Objetivo
Gestión completa de ítems individuales del inventario con validaciones robustas.

### Alcance

**MVP:**
- Crear ítem individual
- Editar ítem existente
- Eliminar ítem (soft delete)
- Listar ítems con paginación
- Ver detalle de ítem

**MVP+:**
- Edición inline en tabla
- Duplicar ítem

---

### Especificación Backend

#### Endpoints

**1. Listar Ítems (Paginado)**
```http
GET /api/v1/inventario/items/?page=1&page_size=50&search=PC&sede=1
Authorization: Bearer {access_token}
```

**Parámetros de Query:**
- `page`: Número de página (default: 1)
- `page_size`: Ítems por página (default: 50, max: 100)
- `search`: Búsqueda en código, artículo, ubicación
- `sede`: Filtro por sede (ID)
- `estado`: Filtro por estado
- `ubicacion`: Filtro por ubicación (ID)
- `responsable`: Filtro por responsable (ID)
- `ordering`: Ordenamiento (ej: `-created_at`, `codigo`)

**Respuesta (200):**
```json
{
  "count": 7000,
  "next": "http://localhost:8000/api/v1/inventario/items/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "codigo": "INV-00001",
      "articulo": {
        "id": 1,
        "nombre": "Computador de Escritorio",
        "codigo": "TEC-00001",
        "categoria": "tecnologia"
      },
      "sede": {
        "id": 1,
        "nombre": "Sede Principal",
        "codigo": "SP-001"
      },
      "ubicacion": {
        "id": 1,
        "nombre": "Sala de Informática 1",
        "tipo": "laboratorio",
        "sede_nombre": "Sede Principal"
      },
      "responsable": {
        "id": 1,
        "nombre_completo": "Juan Pérez",
        "documento": "123456789",
        "cargo": "Docente"
      },
      "cantidad": 1,
      "valor_unitario": "1500000.00",
      "valor_total": "1500000.00",
      "estado": "activo",
      "descripcion": "PC Dell OptiPlex 7090",
      "observaciones": "",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

**2. Crear Ítem**
```http
POST /api/v1/inventario/items/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "codigo": "INV-07001",
  "articulo_id": 1,
  "ubicacion_id": 1,
  "responsable_id": 1,
  "cantidad": 1,
  "valor_unitario": "1500000.00",
  "estado": "activo",
  "descripcion": "PC Dell OptiPlex 7090",
  "observaciones": "Nuevo ingreso"
}
```

**Validaciones:**
- ✅ `codigo` único (400 si duplicado)
- ✅ `articulo_id` debe existir (404)
- ✅ `ubicacion_id` debe existir (404)
- ✅ `responsable_id` debe existir (404)
- ✅ Responsable debe pertenecer a la misma sede que ubicación (400)
- ✅ `cantidad`: 1-9999 (400)
- ✅ `valor_unitario` >= 0 (400)

**Respuesta exitosa (201):**
```json
{
  "id": 7001,
  "codigo": "INV-07001",
  "articulo": {...},
  "sede": {...},
  "ubicacion": {...},
  "responsable": {...},
  "cantidad": 1,
  "valor_unitario": "1500000.00",
  "valor_total": "1500000.00",
  "estado": "activo",
  "descripcion": "PC Dell OptiPlex 7090",
  "observaciones": "Nuevo ingreso",
  "created_at": "2025-01-20T14:45:00Z",
  "updated_at": "2025-01-20T14:45:00Z"
}
```

---

**3. Ver Detalle de Ítem**
```http
GET /api/v1/inventario/items/7001/
Authorization: Bearer {access_token}
```

**Respuesta (200):**
```json
{
  "id": 7001,
  "codigo": "INV-07001",
  "articulo": {...},
  "sede": {...},
  "ubicacion": {...},
  "responsable": {...},
  "cantidad": 1,
  "valor_unitario": "1500000.00",
  "valor_total": "1500000.00",
  "estado": "activo",
  "descripcion": "PC Dell OptiPlex 7090",
  "observaciones": "Nuevo ingreso",
  "created_at": "2025-01-20T14:45:00Z",
  "updated_at": "2025-01-20T14:45:00Z",
  "historial": [
    {
      "id": 1,
      "tipo_movimiento": "creacion",
      "usuario": "admin",
      "observaciones": "Creación inicial",
      "created_at": "2025-01-20T14:45:00Z"
    }
  ]
}
```

---

**4. Actualizar Ítem**
```http
PUT /api/v1/inventario/items/7001/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "codigo": "INV-07001",
  "articulo_id": 1,
  "ubicacion_id": 2,
  "responsable_id": 3,
  "cantidad": 1,
  "valor_unitario": "1500000.00",
  "estado": "activo",
  "descripcion": "PC Dell OptiPlex 7090 - Actualizado",
  "observaciones": "Cambio de ubicación y responsable"
}
```

**Actualización Parcial (PATCH):**
```http
PATCH /api/v1/inventario/items/7001/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "ubicacion_id": 2,
  "responsable_id": 3,
  "observaciones": "Trasladado a laboratorio 2"
}
```

**Respuesta (200):**
```json
{
  "id": 7001,
  "codigo": "INV-07001",
  ...
}
```

---

**5. Eliminar Ítem**
```http
DELETE /api/v1/inventario/items/7001/
Authorization: Bearer {access_token}
```

**Respuesta (204):**
```
No Content
```

**Nota:** Es un soft delete, el registro se marca como `estado='dado_baja'` pero no se elimina de la BD.

---

#### Implementación Backend

**Serializer:**
```python
# apps/inventario/serializers/item.py

from rest_framework import serializers
from apps.inventario.models import ItemInventario, Sede, Ubicacion, Responsable, Articulo
from apps.inventario.serializers.catalogos import (
    SedeSerializer,
    UbicacionSerializer,
    ResponsableSerializer,
    ArticuloSerializer
)


class ItemInventarioSerializer(serializers.ModelSerializer):
    """
    Serializer completo para ItemInventario con datos nested.
    """
    
    # Nested serializers para lectura
    articulo = ArticuloSerializer(read_only=True)
    sede = SedeSerializer(read_only=True)
    ubicacion = UbicacionSerializer(read_only=True)
    responsable = ResponsableSerializer(read_only=True)
    
    # IDs para escritura
    articulo_id = serializers.PrimaryKeyRelatedField(
        queryset=Articulo.objects.all(),
        source='articulo',
        write_only=True
    )
    ubicacion_id = serializers.PrimaryKeyRelatedField(
        queryset=Ubicacion.objects.all(),
        source='ubicacion',
        write_only=True
    )
    responsable_id = serializers.PrimaryKeyRelatedField(
        queryset=Responsable.objects.all(),
        source='responsable',
        write_only=True
    )
    
    class Meta:
        model = ItemInventario
        fields = [
            'id', 'codigo', 'articulo', 'articulo_id', 'sede', 'ubicacion',
            'ubicacion_id', 'responsable', 'responsable_id', 'cantidad',
            'valor_unitario', 'valor_total', 'estado', 'descripcion',
            'observaciones', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'sede', 'valor_total', 'created_at', 'updated_at']
    
    def validate(self, attrs):
        """
        Validaciones cruzadas.
        """
        ubicacion = attrs.get('ubicacion')
        responsable = attrs.get('responsable')
        
        if ubicacion and responsable:
            # Validar que responsable pertenezca a la misma sede
            if responsable.sede != ubicacion.sede:
                raise serializers.ValidationError({
                    'responsable_id': f'El responsable debe pertenecer a {ubicacion.sede.codigo}'
                })
        
        return attrs


class ItemInventarioDetailSerializer(ItemInventarioSerializer):
    """
    Serializer extendido con historial para vista de detalle.
    """
    from apps.inventario.serializers.historial import HistorialMovimientoSerializer
    
    historial = HistorialMovimientoSerializer(many=True, read_only=True)
    
    class Meta(ItemInventarioSerializer.Meta):
        fields = ItemInventarioSerializer.Meta.fields + ['historial']
```

---

**ViewSet:**
```python
# apps/inventario/views/item.py

from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from apps.inventario.models import ItemInventario
from apps.inventario.serializers.item import (
    ItemInventarioSerializer,
    ItemInventarioDetailSerializer
)
from apps.inventario.filters import ItemInventarioFilter


class ItemInventarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para CRUD de ítems del inventario.
    
    Endpoints:
    - GET /api/v1/inventario/items/ - Listar (paginado)
    - POST /api/v1/inventario/items/ - Crear
    - GET /api/v1/inventario/items/{id}/ - Detalle
    - PUT /api/v1/inventario/items/{id}/ - Actualizar completo
    - PATCH /api/v1/inventario/items/{id}/ - Actualizar parcial
    - DELETE /api/v1/inventario/items/{id}/ - Eliminar (soft delete)
    """
    
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ItemInventarioFilter
    search_fields = ['codigo', 'articulo__nombre', 'ubicacion__nombre', 'descripcion']
    ordering_fields = ['codigo', 'created_at', 'valor_total', 'estado']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Optimizar queries con select_related y prefetch_related.
        """
        return ItemInventario.objects.select_related(
            'articulo',
            'sede',
            'ubicacion',
            'ubicacion__sede',
            'responsable',
            'responsable__sede'
        ).prefetch_related('historial')
    
    def get_serializer_class(self):
        """
        Usar serializer extendido en retrieve.
        """
        if self.action == 'retrieve':
            return ItemInventarioDetailSerializer
        return ItemInventarioSerializer
    
    def perform_create(self, serializer):
        """
        Auto-asignar sede basada en ubicación.
        """
        ubicacion = serializer.validated_data['ubicacion']
        serializer.save(sede=ubicacion.sede)
    
    def perform_update(self, serializer):
        """
        Auto-actualizar sede si cambia ubicación.
        """
        ubicacion = serializer.validated_data.get('ubicacion')
        if ubicacion:
            serializer.save(sede=ubicacion.sede)
        else:
            serializer.save()
    
    def perform_destroy(self, instance):
        """
        Soft delete: cambiar estado a 'dado_baja'.
        """
        instance.estado = 'dado_baja'
        instance.save()
```

---

**Filtros:**
```python
# apps/inventario/filters.py

import django_filters
from apps.inventario.models import ItemInventario


class ItemInventarioFilter(django_filters.FilterSet):
    """
    Filtros avanzados para ítems del inventario.
    """
    
    sede = django_filters.NumberFilter(field_name='sede__id')
    ubicacion = django_filters.NumberFilter(field_name='ubicacion__id')
    responsable = django_filters.NumberFilter(field_name='responsable__id')
    estado = django_filters.ChoiceFilter(choices=ItemInventario._meta.get_field('estado').choices)
    
    # Filtros por rango
    valor_min = django_filters.NumberFilter(field_name='valor_unitario', lookup_expr='gte')
    valor_max = django_filters.NumberFilter(field_name='valor_unitario', lookup_expr='lte')
    
    # Filtros por fecha
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = ItemInventario
        fields = ['sede', 'ubicacion', 'responsable', 'estado']
```

---

### Especificación Frontend

#### Tabla de Ítems

```tsx
// frontend/components/items/ItemsTable.tsx

'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ItemsAPI } from '@/lib/api/items';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Eye } from 'lucide-react';

export function ItemsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sedeFilter, setSedeFilter] = useState<number | null>(null);
  const [estadoFilter, setEstadoFilter] = useState<string | null>(null);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['items', page, search, sedeFilter, estadoFilter],
    queryFn: () => ItemsAPI.list({
      page,
      page_size: 50,
      search,
      sede: sedeFilter,
      estado: estadoFilter,
    }),
  });
  
  if (isLoading) {
    return <Skeleton className="w-full h-96" />;
  }
  
  if (error) {
    return <div className="text-red-500">Error al cargar ítems</div>;
  }
  
  const estadoBadgeVariant = (estado: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'activo': 'default',
      'inactivo': 'secondary',
      'mantenimiento': 'outline',
      'dado_baja': 'destructive',
    };
    return variants[estado] || 'default';
  };
  
  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-4">
        <Input
          placeholder="Buscar por código, artículo o ubicación..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        
        <Select value={estadoFilter || ''} onValueChange={(v) => setEstadoFilter(v || null)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
            <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
            <SelectItem value="dado_baja">Dado de Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Tabla */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Artículo</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Valor Unit.</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.results.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono">{item.codigo}</TableCell>
                <TableCell>{item.articulo.nombre}</TableCell>
                <TableCell>{item.ubicacion.nombre}</TableCell>
                <TableCell>{item.responsable.nombre_completo}</TableCell>
                <TableCell className="text-right">{item.cantidad}</TableCell>
                <TableCell className="text-right">
                  ${Number(item.valor_unitario).toLocaleString('es-CO')}
                </TableCell>
                <TableCell>
                  <Badge variant={estadoBadgeVariant(item.estado)}>
                    {item.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Paginación */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {((page - 1) * 50) + 1} - {Math.min(page * 50, data?.count || 0)} de {data?.count} ítems
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!data?.previous}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={!data?.next}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

### Validaciones

**Backend:**
- ✅ Código único
- ✅ Artículo existe
- ✅ Ubicación existe
- ✅ Responsable existe y pertenece a la misma sede
- ✅ Cantidad entre 1-9999
- ✅ Valor unitario >= 0
- ✅ Estado es un valor válido

**Frontend:**
- ✅ Campos requeridos
- ✅ Validación de formato de código
- ✅ Confirmación antes de eliminar
- ✅ Feedback visual de errores

---

## 📋 RF-003: GESTIÓN DE CATÁLOGOS

### Objetivo
CRUD de catálogos maestros: Sedes, Ubicaciones, Responsables, Artículos.

### Alcance MVP
- Listar catálogos
- Crear registros
- Editar registros
- Eliminar registros (con validación de uso)

---

### Especificación (Ejemplo: Artículos)

**Endpoint:**
```http
GET /api/v1/inventario/articulos/
POST /api/v1/inventario/articulos/
GET /api/v1/inventario/articulos/{id}/
PUT /api/v1/inventario/articulos/{id}/
PATCH /api/v1/inventario/articulos/{id}/
DELETE /api/v1/inventario/articulos/{id}/
```

**Estructura similar a RF-002** pero aplicada a cada catálogo.

---

## 📥 RF-004: IMPORTACIÓN EXCEL

### Objetivo
Importar ítems masivamente desde archivo Excel con validación exhaustiva y auto-creación de artículos.

### Alcance MVP
- Subir archivo .xlsx (máximo 5MB)
- Validar estructura y datos
- Auto-crear artículos que no existan
- Inserción atómica (todo o nada)
- Reporte detallado de errores

---

### Flujo Completo

```
1. Usuario sube .xlsx → Frontend valida extensión y tamaño
2. POST /api/v1/inventario/items/import/ → Backend recibe
3. Pandas lee el archivo
4. Validación exhaustiva fila por fila:
   - Estructura de columnas
   - Códigos únicos
   - Relaciones (sede, ubicación, responsable existen)
   - Rangos (cantidad 1-9999, valor >= 0)
5. Si errores → Retorna reporte con detalles
6. Si OK → Transacción atómica:
   - Auto-crear artículos con get_or_create()
   - bulk_create() de ítems (hasta 1000 a la vez)
   - Crear registros de historial
7. Retorna resumen de importación
```

---

### Especificación Excel

**Columnas Requeridas:**

| Columna | Tipo | Requerido | Validaciones |
|---------|------|:---------:|--------------|
| `codigo` | string | ✅ | Único, <= 50 chars |
| `sede_codigo` | string | ✅ | Debe existir en BD |
| `ubicacion_nombre` | string | ✅ | Debe existir en BD |
| `responsable_documento` | string | ✅ | Debe existir en BD |
| `articulo_codigo` | string | ✅ | Se crea si no existe |
| `articulo_nombre` | string | ✅* | *Requerido si artículo no existe |
| `articulo_categoria` | string | ✅* | *Requerido si artículo no existe |
| `cantidad` | int | ✅ | 1-9999 |
| `valor_unitario` | decimal | ✅ | >= 0 |
| `estado` | string | ❌ | Default: 'activo' |
| `descripcion` | string | ❌ | <= 500 chars |
| `observaciones` | string | ❌ | <= 1000 chars |

---

### Ejemplo de Archivo Excel

| codigo | sede_codigo | ubicacion_nombre | responsable_documento | articulo_codigo | articulo_nombre | articulo_categoria | cantidad | valor_unitario | estado | descripcion |
|--------|-------------|------------------|----------------------|-----------------|-----------------|-------------------|----------|----------------|--------|-------------|
| INV-07001 | SP-001 | Sala de Informática 1 | 123456789 | TEC-00001 | Computador de Escritorio | tecnologia | 1 | 1500000 | activo | PC Dell OptiPlex 7090 |
| INV-07002 | SP-001 | Sala de Informática 1 | 123456789 | TEC-00001 | Computador de Escritorio | tecnologia | 1 | 1500000 | activo | PC Dell OptiPlex 7090 |

---

### Implementación Backend

**Endpoint:**
```http
POST /api/v1/inventario/items/import/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

file: archivo.xlsx
```

**View:**
```python
# apps/inventario/views/import_export.py

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import pandas as pd
from apps.inventario.models import (
    ItemInventario, Sede, Ubicacion, Responsable, Articulo,
    HistorialMovimiento
)


class ItemImportViewSet(viewsets.ViewSet):
    """
    ViewSet para importación de ítems desde Excel.
    """
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def import_items(self, request):
        """
        Importar ítems desde archivo Excel.
        
        Proceso:
        1. Validar archivo
        2. Leer con pandas
        3. Validar estructura y datos
        4. Auto-crear artículos
        5. Inserción atómica
        6. Crear historial
        
        Returns:
            - 200: Importación exitosa con resumen
            - 400: Errores de validación con detalles
        """
        
        file = request.FILES.get('file')
        
        if not file:
            return Response(
                {'error': 'No se proporcionó archivo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar extensión
        if not file.name.endswith('.xlsx'):
            return Response(
                {'error': 'Solo se permiten archivos .xlsx'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar tamaño (5MB)
        if file.size > 5 * 1024 * 1024:
            return Response(
                {'error': 'El archivo no debe superar 5MB'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Leer Excel
            df = pd.read_excel(file)
            
            # Validar columnas requeridas
            required_columns = [
                'codigo', 'sede_codigo', 'ubicacion_nombre',
                'responsable_documento', 'articulo_codigo',
                'articulo_nombre', 'articulo_categoria',
                'cantidad', 'valor_unitario'
            ]
            
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                return Response(
                    {
                        'error': 'Columnas faltantes',
                        'missing': missing_columns
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validar cada fila
            errores = []
            items_to_create = []
            historial_to_create = []
            
            for idx, row in df.iterrows():
                fila = idx + 2  # +2 porque Excel empieza en 1 y hay header
                
                # Validar código único
                if ItemInventario.objects.filter(codigo=row['codigo']).exists():
                    errores.append({
                        'fila': fila,
                        'campo': 'codigo',
                        'error': f"El código '{row['codigo']}' ya existe"
                    })
                    continue
                
                # Validar sede
                try:
                    sede = Sede.objects.get(codigo=row['sede_codigo'])
                except Sede.DoesNotExist:
                    errores.append({
                        'fila': fila,
                        'campo': 'sede_codigo',
                        'error': f"Sede '{row['sede_codigo']}' no existe"
                    })
                    continue
                
                # Validar ubicación
                try:
                    ubicacion = Ubicacion.objects.get(
                        nombre=row['ubicacion_nombre'],
                        sede=sede
                    )
                except Ubicacion.DoesNotExist:
                    errores.append({
                        'fila': fila,
                        'campo': 'ubicacion_nombre',
                        'error': f"Ubicación '{row['ubicacion_nombre']}' no existe en {sede.codigo}"
                    })
                    continue
                
                # Validar responsable
                try:
                    responsable = Responsable.objects.get(
                        documento=row['responsable_documento'],
                        sede=sede
                    )
                except Responsable.DoesNotExist:
                    errores.append({
                        'fila': fila,
                        'campo': 'responsable_documento',
                        'error': f"Responsable con documento '{row['responsable_documento']}' no existe en {sede.codigo}"
                    })
                    continue
                
                # Auto-crear artículo si no existe
                articulo, created = Articulo.objects.get_or_create(
                    codigo=row['articulo_codigo'],
                    defaults={
                        'nombre': row['articulo_nombre'],
                        'categoria': row['articulo_categoria'],
                    }
                )
                
                # Validar cantidad
                if not (1 <= row['cantidad'] <= 9999):
                    errores.append({
                        'fila': fila,
                        'campo': 'cantidad',
                        'error': 'La cantidad debe estar entre 1 y 9999'
                    })
                    continue
                
                # Validar valor
                if row['valor_unitario'] < 0:
                    errores.append({
                        'fila': fila,
                        'campo': 'valor_unitario',
                        'error': 'El valor unitario debe ser mayor o igual a 0'
                    })
                    continue
                
                # Preparar ítem para creación
                item = ItemInventario(
                    codigo=row['codigo'],
                    articulo=articulo,
                    sede=sede,
                    ubicacion=ubicacion,
                    responsable=responsable,
                    cantidad=row['cantidad'],
                    valor_unitario=row['valor_unitario'],
                    estado=row.get('estado', 'activo'),
                    descripcion=row.get('descripcion', ''),
                    observaciones=row.get('observaciones', '')
                )
                
                items_to_create.append(item)
            
            # Si hay errores, retornarlos
            if errores:
                return Response(
                    {
                        'error': 'Errores de validación',
                        'total_filas': len(df),
                        'filas_con_error': len(errores),
                        'detalles': errores
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Inserción atómica
            with transaction.atomic():
                # Bulk create ítems (máximo 1000 a la vez)
                created_items = ItemInventario.objects.bulk_create(
                    items_to_create,
                    batch_size=1000
                )
                
                # Crear historial para cada ítem
                for item in created_items:
                    historial_to_create.append(
                        HistorialMovimiento(
                            item=item,
                            tipo_movimiento='importacion',
                            usuario=request.user,
                            datos_nuevos={
                                'codigo': item.codigo,
                                'articulo': item.articulo.nombre,
                                'ubicacion': item.ubicacion.nombre,
                            },
                            observaciones='Importación desde Excel'
                        )
                    )
                
                HistorialMovimiento.objects.bulk_create(historial_to_create)
            
            return Response(
                {
                    'success': True,
                    'total_importados': len(created_items),
                    'resumen': {
                        'total_filas': len(df),
                        'articulos_creados': sum(1 for item in created_items if not Articulo.objects.filter(codigo=item.articulo.codigo).count() > 1),
                        'items_creados': len(created_items),
                    }
                },
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            return Response(
                {'error': f'Error procesando archivo: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

---

### Tests

```python
# apps/inventario/tests/test_import.py

import pytest
import pandas as pd
from io import BytesIO
from django.urls import reverse
from rest_framework import status
from apps.inventario.models import ItemInventario, Articulo

@pytest.mark.django_db
class TestImportExcel:
    """
    Tests de importación Excel.
    """
    
    def test_import_exitoso(self, api_client, authenticated_user, sede, ubicacion, responsable):
        """Importación exitosa con auto-creación de artículo."""
        
        # Crear Excel en memoria
        df = pd.DataFrame([
            {
                'codigo': 'INV-TEST-001',
                'sede_codigo': sede.codigo,
                'ubicacion_nombre': ubicacion.nombre,
                'responsable_documento': responsable.documento,
                'articulo_codigo': 'NEW-ART-001',
                'articulo_nombre': 'Nuevo Artículo',
                'articulo_categoria': 'tecnologia',
                'cantidad': 1,
                'valor_unitario': 100000,
            }
        ])
        
        excel_file = BytesIO()
        df.to_excel(excel_file, index=False)
        excel_file.seek(0)
        
        url = reverse('inventario:items-import-items')
        response = api_client.post(url, {'file': excel_file}, format='multipart')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['total_importados'] == 1
        
        # Verificar que se creó el ítem
        assert ItemInventario.objects.filter(codigo='INV-TEST-001').exists()
        
        # Verificar que se creó el artículo
        assert Articulo.objects.filter(codigo='NEW-ART-001').exists()
    
    def test_import_codigo_duplicado(self, api_client, authenticated_user, item_existente):
        """Importación falla si hay código duplicado."""
        
        df = pd.DataFrame([
            {
                'codigo': item_existente.codigo,  # Código duplicado
                ...
            }
        ])
        
        excel_file = BytesIO()
        df.to_excel(excel_file, index=False)
        excel_file.seek(0)
        
        url = reverse('inventario:items-import-items')
        response = api_client.post(url, {'file': excel_file}, format='multipart')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'ya existe' in response.data['detalles'][0]['error']
```

---

## 📤 RF-005: EXPORTACIÓN EXCEL

### Objetivo
Exportar ítems filtrados a archivo Excel.

### Especificación

**Endpoint:**
```http
GET /api/v1/inventario/items/export/?sede=1&estado=activo
Authorization: Bearer {access_token}
```

**Respuesta:**
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="inventario_2025-01-20.xlsx"

[Binary Excel file]
```

**Columnas del Excel:**
- Código
- Artículo
- Categoría
- Sede
- Ubicación
- Responsable
- Cantidad
- Valor Unitario
- Valor Total
- Estado
- Descripción
- Fecha Creación

---

## ✏️ RF-006: EDICIÓN MASIVA (BATCH EDIT)

### Objetivo
Modal tipo Excel para editar múltiples ítems simultáneamente.

### Alcance MVP+
- Seleccionar ítems desde tabla principal
- Abrir modal con grid editable
- Editar: ubicación, responsable, cantidad, valor, estado
- Validación por celda en tiempo real
- Guardar cambios con transacción atómica

---

### Especificación

**Endpoint:**
```http
PATCH /api/v1/inventario/items/batch-update/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "items": [
    {
      "id": 1,
      "ubicacion_id": 2,
      "responsable_id": 3,
      "observaciones": "Traslado a laboratorio 2"
    },
    {
      "id": 2,
      "estado": "mantenimiento",
      "observaciones": "Reparación programada"
    }
  ]
}
```

**Validaciones:**
- ✅ Todos los IDs deben existir
- ✅ Responsable debe pertenecer a la misma sede que ubicación
- ✅ Cantidad entre 1-9999
- ✅ Valor >= 0
- ✅ Transacción atómica (todo o nada)

**Respuesta (200):**
```json
{
  "success": True,
  "updated": 2,
  "items": [
    {...},
    {...}
  ]
}
```

---

### Frontend

**Modal con react-data-grid:**
```tsx
// frontend/components/items/BatchEditModal.tsx

import DataGrid from 'react-data-grid';

// ... implementación completa en documento anterior
```

---

## 📜 RF-007: HISTORIAL DE MOVIMIENTOS

### Objetivo
Registro automático de todos los cambios en ítems.

### Alcance

**MVP:**
- Registro automático vía signals
- API para consultar historial

**Post-MVP:**
- UI de historial completo
- Filtros por tipo de movimiento
- Timeline visual

---

## 🔍 RF-008: FILTROS Y BÚSQUEDA

### Objetivo
Filtrado avanzado y búsqueda en tiempo real.

### Filtros Disponibles

- 📍 **Por Sede**: Dropdown
- 📍 **Por Ubicación**: Dropdown (filtrado por sede)
- 👤 **Por Responsable**: Autocomplete
- 📦 **Por Artículo**: Autocomplete
- 🟢 **Por Estado**: Checkbox múltiple
- 💰 **Por Rango de Valor**: Slider
- 📅 **Por Fecha**: Date picker (creación/actualización)

**Búsqueda:**
- Texto libre en: código, nombre de artículo, descripción
- Debounce: 300ms
- Resaltado de coincidencias

---

## 📊 MATRIZ DE FEATURES POR FASE

| Feature | Fase 0 | Fase 1 | Fase 2 | Fase 3 | Fase 4 | Fase 5 | Fase 6 | Fase 7 |
|---------|:------:|:------:|:------:|:------:|:------:|:------:|:------:|:------:|
| Setup Proyecto | ✅ | | | | | | | |
| Modelos Django | | ✅ | | | | | | |
| Autenticación | | ✅ | | | | | | |
| API CRUD Ítems | | | ✅ | | | | | |
| API Catálogos | | | ✅ | | | | | |
| Tabla Items Frontend | | | | ✅ | | | | |
| Filtros Avanzados | | | | ✅ | | | | |
| Import Excel | | | | | ✅ | | | |
| Export Excel | | | | | ✅ | | | |
| **Modal Batch Edit** | | | | | | ✅ | | |
| Historial UI | | | | | | | ✅ | |
| Tests E2E | | | | | | | ✅ | |
| Docker Setup | | | | | | | | ✅ |

---

## ✅ SIGUIENTE PASO

Con las features completamente especificadas:

**Ver estándares de código en:** `docs/specs/03-ESTANDARES.md`  
**Ver Fase 0 detallada en:** `docs/specs/04-FASE-0-SETUP.md`  
**Ver plan completo de fases en:** `docs/specs/05-FASES-1-7.md`

---

**Documento generado:** Noviembre 16, 2025  
**Versión:** 2.0  
**Próximo:** Estándares de código y convenciones
```

---