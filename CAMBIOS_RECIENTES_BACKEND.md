# Cambios Recientes en el Backend

**Fecha:** 23 de noviembre de 2025  
**Autor:** Asistente IA (Claude Sonnet 4.5)  
**Referencia:** Archivo CLAUDE.md - Sección "Peticiones"

---

## 📋 Resumen

Este documento describe los cambios realizados en el backend del sistema de inventario como parte del proceso de refinamiento y mejora de funcionalidades.

---

## 🔧 Cambios Implementados

### 1. Modelo de Cargos para Responsables

**Archivo modificado:** `apps/inventario/models/choices.py`

**Descripción:**
Se agregó una nueva clase `CargoResponsable` con choices predeterminados para los cargos de los responsables del inventario.

**Cambios específicos:**
```python
class CargoResponsable(models.TextChoices):
    """
    Cargos predeterminados para los responsables del inventario.
    
    Lista configurable según las necesidades de la institución educativa.
    Incluye los cargos mencionados en CLAUDE.md línea 196.
    """
    DOCENTE = 'docente', 'Docente'
    COORDINADOR = 'coordinador', 'Coordinador'
    RECTOR = 'rector', 'Rector'
    AUXILIAR_ADMINISTRATIVO = 'auxiliar_administrativo', 'Auxiliar Administrativo'
    OPERARIO_SISTEMA = 'operario_sistema', 'Operario Sistema'
    OTRO = 'otro', 'Otro'
```

**Justificación:**
- Estandariza los cargos disponibles en el sistema
- Facilita la búsqueda y filtrado por cargo
- Mantiene consistencia en los datos
- Permite agregar nuevos cargos de manera centralizada

**Referencia:** CLAUDE.md líneas 193-196

---

### 2. Actualización del Modelo Responsable

**Archivo modificado:** `apps/inventario/models/responsable.py`

**Cambios específicos:**
1. Se importó la clase `CargoResponsable`:
   ```python
   from .choices import TipoDocumento, CargoResponsable
   ```

2. Se modificó el campo `cargo` para usar choices:
   ```python
   cargo = models.CharField(
       max_length=50,
       choices=CargoResponsable.choices,
       blank=True,
       verbose_name="Cargo",
       help_text="Cargo o rol en la institución"
   )
   ```

**Impacto:**
- El campo `cargo` ahora solo acepta valores de la lista predeterminada
- Los formularios de admin y API automáticamente mostrarán un selector
- Mejora la integridad de los datos

**Nota:** Se redujo `max_length` de 100 a 50 caracteres ya que los valores son predeterminados.

---

### 3. Mejoras en el Admin de Django

**Archivo modificado:** `apps/inventario/admin.py`

**Cambios específicos:**
Se agregó `cargo` a los filtros del admin de Responsable:

```python
@admin.register(Responsable)
class ResponsableAdmin(admin.ModelAdmin):
    """Admin para Responsable con filtros de cargo."""

    list_display = ['nombre_completo', 'documento', 'cargo', 'sede', 'activo']
    list_filter = ['activo', 'cargo', 'sede', 'created_at']  # <- cargo agregado
    search_fields = ['nombre', 'apellido', 'documento', 'email']
    ordering = ['apellido', 'nombre']
    readonly_fields = ['created_at', 'updated_at']
```

**Beneficios:**
- Permite filtrar responsables por cargo en el admin panel
- Facilita la administración de usuarios del sistema
- Mejora la experiencia de usuario para administradores

---

### 4. Endpoint de Estadísticas con Filtros

**Archivo modificado:** `apps/inventario/views/stats.py`

**Cambios específicos:**
Se modificó el endpoint `por_articulo` para aceptar filtros de disponibilidad y estado físico:

```python
@action(detail=False, methods=['get'], url_path='por-articulo')
def por_articulo(self, request):
    """
    GET /inventario/stats/por-articulo/
    
    Query params:
    - disponibilidad: filtrar por disponibilidad (en_uso, en_reparacion, extraviado, de_baja)
    - estado: filtrar por estado físico (bueno, regular, malo)
    """
    # Obtener filtros desde query params
    disponibilidad_filter = request.query_params.get('disponibilidad', None)
    estado_filter = request.query_params.get('estado', None)
    
    # Base queryset para items con filtros aplicados
    items_base_qs = ItemInventario.objects.all()
    if disponibilidad_filter:
        items_base_qs = items_base_qs.filter(disponibilidad=disponibilidad_filter)
    if estado_filter:
        items_base_qs = items_base_qs.filter(estado=estado_filter)
    
    # ... resto del código
```

**Funcionalidad agregada:**
- Permite filtrar estadísticas por disponibilidad (ej: solo ítems "en uso")
- Permite filtrar estadísticas por estado físico (ej: solo ítems "buenos")
- Los filtros se aplican a toda la matriz de artículos x sedes
- Retorna los filtros aplicados en la respuesta

**Ejemplo de uso:**
```bash
# Sin filtros
GET /inventario/stats/por-articulo/

# Con filtro de disponibilidad
GET /inventario/stats/por-articulo/?disponibilidad=en_uso

# Con ambos filtros
GET /inventario/stats/por-articulo/?disponibilidad=en_uso&estado=bueno
```

**Referencia:** CLAUDE.md líneas 199-201, 203

---

## 📊 Compatibilidad y Migraciones

### Migraciones Necesarias

Los cambios en el modelo `Responsable` requieren una migración de base de datos:

```bash
# Generar migraciones
python manage.py makemigrations inventario

# Aplicar migraciones
python manage.py migrate inventario
```

### Retrocompatibilidad

- **Campo `cargo`:** Los valores existentes se mantendrán. Si hay cargos no estándar, pueden necesitar ser actualizados manualmente en el admin.
- **Endpoint de estadísticas:** Totalmente retrocompatible. Si no se envían parámetros, funciona como antes.

---

## ✅ Estándares de Código Aplicados

Todos los cambios siguen los estándares definidos en `docs/specs/03-ESTANDARES.md`:

1. **Docstrings completos** en todas las clases y métodos modificados
2. **Type hints** presentes (cuando aplica)
3. **Nomenclatura consistente:** snake_case para Python
4. **Imports organizados** según el estándar del proyecto
5. **Comentarios explicativos** donde la lógica no es obvia
6. **Límites de línea** respetados (< 100 caracteres)

---

## 🧪 Testing

### Tests Recomendados

Para asegurar la calidad de los cambios, se recomiendan los siguientes tests:

#### Tests del Modelo Responsable
```python
@pytest.mark.django_db
def test_cargo_choices():
    """Verificar que cargo solo acepta valores válidos."""
    responsable = Responsable.objects.create(
        nombre="Juan",
        apellido="Pérez",
        cargo="docente"  # Valor válido
    )
    assert responsable.cargo == "docente"
    
    # Intentar con valor inválido debería fallar en validación
    # (esto se prueba a nivel de formulario/serializer)
```

#### Tests del Endpoint de Estadísticas
```python
@pytest.mark.django_db
def test_stats_por_articulo_con_filtros(api_client):
    """Verificar que los filtros funcionan correctamente."""
    # Setup: crear items de prueba con diferentes estados
    # ...
    
    # Test sin filtros
    response = api_client.get('/inventario/stats/por-articulo/')
    assert response.status_code == 200
    
    # Test con filtro de disponibilidad
    response = api_client.get('/inventario/stats/por-articulo/?disponibilidad=en_uso')
    assert response.status_code == 200
    assert response.data['filtros_aplicados']['disponibilidad'] == 'en_uso'
    
    # Test con ambos filtros
    response = api_client.get(
        '/inventario/stats/por-articulo/?disponibilidad=en_uso&estado=bueno'
    )
    assert response.status_code == 200
    assert response.data['filtros_aplicados']['disponibilidad'] == 'en_uso'
    assert response.data['filtros_aplicados']['estado'] == 'bueno'
```

---

## 📝 Notas Adicionales

### Datos Existentes

Si ya existen responsables con cargos personalizados (no estándar), el admin mostrará una advertencia. Se recomienda:

1. Revisar los cargos existentes en el admin
2. Actualizar los cargos no estándar al valor más cercano de la lista
3. Si hay cargos que no encajan, usar la opción "Otro"

### Futuras Extensiones

El modelo actual de cargos es fácilmente extensible. Para agregar nuevos cargos:

1. Modificar `CargoResponsable` en `choices.py`
2. Agregar la nueva entrada al enum
3. Ejecutar migraciones (no es necesario si solo se agregan nuevas opciones)

**Ejemplo:**
```python
class CargoResponsable(models.TextChoices):
    # ... cargos existentes ...
    SECRETARIO = 'secretario', 'Secretario/a'
    BIBLIOTECARIO = 'bibliotecario', 'Bibliotecario/a'
```

---

## 🔗 Referencias

- **Documento de peticiones:** `CLAUDE.md` (raíz del proyecto)
- **Estándares de código:** `docs/specs/03-ESTANDARES.md`
- **Modelo de datos:** `docs/specs/01-MODELO-DATOS.md`
- **Django TextChoices:** https://docs.djangoproject.com/en/5.2/ref/models/fields/#choices

---

**Fin del documento**

