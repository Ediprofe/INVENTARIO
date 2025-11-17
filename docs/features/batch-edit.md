# RF-006: Edición Masiva de Ítems (Batch Edit)

**Prioridad:** ⭐ ALTA
**Estado:** Pendiente
**Fase:** 5
**Duración estimada:** 3-4 días

---

## 📋 Descripción

Permitir la **edición simultánea de múltiples ítems** en una interfaz tipo hoja de cálculo (Excel-like), con validaciones en tiempo real y actualización transaccional.

---

## 🎯 Objetivo

Optimizar el proceso de actualización masiva de ítems cuando se requieren cambios en múltiples registros simultáneamente (ej: cambio de ubicación de un salón completo, reasignación de responsables, actualización de valores).

---

## 👥 Usuarios

- **Administrador**: Actualizaciones masivas periódicas
- **Operador**: Cambios frecuentes de ubicación/responsable

---

## ✅ Criterios de Aceptación

### Backend

1. **Endpoint de Batch Update**
   ```
   POST /api/v1/inventario/items/batch-update/
   Body: {
     "items": [
       {"id": 1, "ubicacion_id": 5, "responsable_id": 3},
       {"id": 2, "estado": "mantenimiento"},
       {"id": 3, "valor_unitario": "150000.00"}
     ]
   }
   Response: {
     "success": 120,
     "errors": [
       {"id": 5, "error": "Responsable no pertenece a la misma sede"}
     ]
   }
   ```

2. **Validaciones**
   - Validar cada ítem individualmente
   - Retornar errores específicos por ítem
   - **Transacción atómica**: Todo o nada (opcional)
   - **Transacción parcial**: Aplicar solo los ítems válidos (preferido)

3. **Campos Editables en Batch**
   - `ubicacion_id`
   - `responsable_id`
   - `estado`
   - `valor_unitario`
   - `descripcion`
   - `observaciones`

4. **Límites**
   - Máximo 500 ítems por request
   - Timeout de 60 segundos

### Frontend

1. **Selección de Ítems**
   - Checkboxes en tabla de ítems
   - "Seleccionar todos" con paginación
   - Contador de ítems seleccionados

2. **Modal de Edición Masiva**
   - Se abre al hacer clic en "Editar Seleccionados"
   - Muestra grilla editable estilo Excel
   - Componente: `react-data-grid`

3. **Interfaz de Grilla**
   - Columnas configurables (mostrar solo las que se editarán)
   - Edición inline por celda
   - Validación al salir de la celda
   - Indicadores visuales:
     - ✅ Verde: Valor válido
     - ❌ Rojo: Error de validación
     - 🟡 Amarillo: Cambio pendiente

4. **Validaciones en Tiempo Real**
   - Al cambiar `ubicacion`, validar que existe y está activa
   - Al cambiar `responsable`, validar que pertenece a la misma sede
   - Al cambiar `valor_unitario`, validar que es número positivo
   - Al cambiar `estado`, validar que es un estado válido

5. **Acciones**
   - **Guardar Cambios**: Envía solo los ítems modificados
   - **Cancelar**: Descarta todos los cambios
   - **Aplicar a Todos**: Cambiar un campo en todos los seleccionados

6. **Feedback**
   - Loading overlay durante el guardado
   - Mensaje de éxito con cantidad de ítems actualizados
   - Lista de errores con ítem específico y razón

---

## 🎨 Wireframe (Concepto)

```
┌─────────────────────────────────────────────────────────────┐
│  Edición Masiva (145 ítems seleccionados)           [X]     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [Aplicar a todos] ▼  Campo: Ubicación  Valor: Lab 201      │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Código      │ Ubicación    │ Responsable │ Estado    │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ INV-00001  │ Lab 201 ✅   │ Juan Pérez  │ activo    │  │
│  │ INV-00002  │ Lab 201 🟡   │ Ana López   │ activo    │  │
│  │ INV-00003  │ Lab 305 ❌   │ Pedro G.    │ mantenim. │  │
│  │             Error: Ubicación no existe                 │  │
│  │ INV-00004  │ Lab 201 ✅   │ Juan Pérez  │ activo    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│                      [Cancelar]  [Guardar (143 válidos)]    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Implementación Técnica

### Backend Django

**Archivo:** `apps/inventario/views/batch_operations.py`

```python
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction


class ItemViewSet(viewsets.ModelViewSet):
    # ... código existente ...

    @action(detail=False, methods=['post'], url_path='batch-update')
    def batch_update(self, request):
        """
        Actualización masiva de ítems.

        Body: {
          "items": [
            {"id": 1, "ubicacion_id": 5, "responsable_id": 3},
            {"id": 2, "estado": "mantenimiento"}
          ],
          "atomic": false  # true = todo o nada, false = parcial
        }
        """
        items_data = request.data.get('items', [])
        atomic = request.data.get('atomic', False)

        if len(items_data) > 500:
            return Response(
                {'error': 'Máximo 500 ítems por operación'},
                status=status.HTTP_400_BAD_REQUEST
            )

        results = {
            'success': [],
            'errors': []
        }

        # Modo atómico: todo o nada
        if atomic:
            try:
                with transaction.atomic():
                    for item_data in items_data:
                        self._update_single_item(item_data, results)

                    if results['errors']:
                        raise Exception("Errores en validación")

                return Response(results, status=status.HTTP_200_OK)

            except Exception as e:
                return Response(
                    {'error': 'Transacción abortada por errores'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Modo parcial: aplicar solo los válidos
        else:
            for item_data in items_data:
                try:
                    with transaction.atomic():
                        self._update_single_item(item_data, results)
                except Exception:
                    pass  # Ya agregado a results['errors']

            return Response(results, status=status.HTTP_200_OK)

    def _update_single_item(self, item_data, results):
        """Actualiza un ítem individual con validaciones."""
        item_id = item_data.get('id')

        try:
            item = ItemInventario.objects.get(pk=item_id)

            # Validar responsable si se cambia
            if 'responsable_id' in item_data:
                responsable_id = item_data['responsable_id']
                responsable = Responsable.objects.get(pk=responsable_id)

                # Validar misma sede
                if responsable.sede != item.sede:
                    raise ValidationError(
                        f'Responsable debe pertenecer a {item.sede.codigo}'
                    )

                item.responsable = responsable

            # Validar ubicacion si se cambia
            if 'ubicacion_id' in item_data:
                ubicacion_id = item_data['ubicacion_id']
                ubicacion = Ubicacion.objects.get(pk=ubicacion_id)

                if ubicacion.sede != item.sede:
                    raise ValidationError(
                        f'Ubicación debe pertenecer a {item.sede.codigo}'
                    )

                item.ubicacion = ubicacion

            # Otros campos
            if 'estado' in item_data:
                item.estado = item_data['estado']

            if 'valor_unitario' in item_data:
                item.valor_unitario = Decimal(item_data['valor_unitario'])

            if 'descripcion' in item_data:
                item.descripcion = item_data['descripcion']

            if 'observaciones' in item_data:
                item.observaciones = item_data['observaciones']

            # Guardar
            item.save()

            # Registrar en historial
            HistorialMovimiento.objects.create(
                item=item,
                tipo_movimiento='batch_update',
                datos_nuevos=item_data,
                observaciones='Actualización masiva'
            )

            results['success'].append(item_id)

        except ItemInventario.DoesNotExist:
            results['errors'].append({
                'id': item_id,
                'error': 'Ítem no encontrado'
            })

        except Responsable.DoesNotExist:
            results['errors'].append({
                'id': item_id,
                'error': 'Responsable no encontrado'
            })

        except Ubicacion.DoesNotExist:
            results['errors'].append({
                'id': item_id,
                'error': 'Ubicación no encontrada'
            })

        except ValidationError as e:
            results['errors'].append({
                'id': item_id,
                'error': str(e)
            })

        except Exception as e:
            results['errors'].append({
                'id': item_id,
                'error': f'Error inesperado: {str(e)}'
            })
```

---

### Frontend React

**Archivo:** `components/items/BatchEditModal.tsx`

```typescript
'use client';

import { useState, useCallback } from 'react';
import DataGrid, { Column } from 'react-data-grid';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { ItemsAPI } from '@/lib/api/items';
import type { IItem } from '@/types/item';

interface BatchEditModalProps {
  items: IItem[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface EditableRow {
  id: number;
  codigo: string;
  ubicacion_id: number;
  ubicacion_nombre: string;
  responsable_id: number;
  responsable_nombre: string;
  estado: string;
  valor_unitario: string;
  _errors?: Record<string, string>;
  _modified?: boolean;
}

export function BatchEditModal({ items, isOpen, onClose, onSuccess }: BatchEditModalProps) {
  const [rows, setRows] = useState<EditableRow[]>(
    items.map((item) => ({
      id: item.id,
      codigo: item.codigo,
      ubicacion_id: item.ubicacion.id,
      ubicacion_nombre: item.ubicacion.nombre,
      responsable_id: item.responsable.id,
      responsable_nombre: item.responsable.nombre_completo,
      estado: item.estado,
      valor_unitario: item.valor_unitario,
      _errors: {},
      _modified: false,
    }))
  );

  const [isSaving, setIsSaving] = useState(false);

  const columns: Column<EditableRow>[] = [
    {
      key: 'codigo',
      name: 'Código',
      width: 120,
      frozen: true,
    },
    {
      key: 'ubicacion_nombre',
      name: 'Ubicación',
      width: 200,
      editable: true,
      renderEditCell: (props) => (
        <SelectUbicacion
          value={props.row.ubicacion_id}
          onChange={(value) => {
            props.onRowChange({ ...props.row, ubicacion_id: value, _modified: true });
          }}
        />
      ),
    },
    {
      key: 'responsable_nombre',
      name: 'Responsable',
      width: 200,
      editable: true,
    },
    {
      key: 'estado',
      name: 'Estado',
      width: 150,
      editable: true,
    },
    {
      key: 'valor_unitario',
      name: 'Valor Unitario',
      width: 150,
      editable: true,
    },
  ];

  const handleSave = async () => {
    setIsSaving(true);

    // Obtener solo los modificados
    const modifiedItems = rows
      .filter((row) => row._modified)
      .map((row) => ({
        id: row.id,
        ubicacion_id: row.ubicacion_id,
        responsable_id: row.responsable_id,
        estado: row.estado,
        valor_unitario: row.valor_unitario,
      }));

    try {
      const response = await ItemsAPI.batchUpdate(modifiedItems, false);

      if (response.errors.length > 0) {
        // Marcar errores en la grilla
        const newRows = rows.map((row) => {
          const error = response.errors.find((e) => e.id === row.id);
          if (error) {
            return { ...row, _errors: { general: error.error } };
          }
          return row;
        });
        setRows(newRows);

        alert(`${response.success.length} ítems actualizados. ${response.errors.length} errores.`);
      } else {
        alert(`${response.success.length} ítems actualizados exitosamente`);
        onSuccess();
        onClose();
      }
    } catch (error) {
      alert('Error al guardar cambios');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Edición Masiva ({items.length} ítems)</DialogTitle>
        </DialogHeader>

        <div className="h-[500px]">
          <DataGrid
            columns={columns}
            rows={rows}
            onRowsChange={setRows}
            className="fill-grid"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Guardando...' : `Guardar ${rows.filter((r) => r._modified).length} cambios`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🧪 Tests

### Backend

```python
@pytest.mark.django_db
class TestBatchUpdate:
    """Tests para batch update de ítems."""

    def test_batch_update_exitoso(self, api_client, authenticated_user, ubicacion):
        """Batch update de ítems válidos retorna success."""
        items = ItemFactory.create_batch(10)

        url = reverse('inventario:items-batch-update')
        data = {
            'items': [
                {'id': items[0].id, 'ubicacion_id': ubicacion.id},
                {'id': items[1].id, 'estado': 'mantenimiento'},
            ]
        }

        response = api_client.post(url, data, format='json')

        assert response.status_code == 200
        assert len(response.data['success']) == 2
        assert len(response.data['errors']) == 0

    def test_batch_update_con_errores(self, api_client, authenticated_user):
        """Batch update con errores retorna lista de errores."""
        items = ItemFactory.create_batch(5)

        url = reverse('inventario:items-batch-update')
        data = {
            'items': [
                {'id': items[0].id, 'responsable_id': 99999},  # No existe
                {'id': items[1].id, 'estado': 'activo'},  # Válido
            ]
        }

        response = api_client.post(url, data, format='json')

        assert response.status_code == 200
        assert len(response.data['success']) == 1
        assert len(response.data['errors']) == 1
        assert response.data['errors'][0]['id'] == items[0].id
```

---

## 📊 Performance

### Benchmarks Esperados
- **100 ítems**: < 5 segundos
- **500 ítems**: < 30 segundos

### Optimizaciones
- Usar `select_related()` para evitar N+1 queries
- Validaciones en memoria antes de DB writes
- Bulk update cuando sea posible

---

## ⚠️ Consideraciones

### UX
- Mostrar progreso visual durante guardado largo
- Permitir cancelar operación en progreso
- Destacar ítems con errores en la grilla

### Seguridad
- Rate limiting: 10 requests/minuto
- Máximo 500 ítems por request
- Validar permisos del usuario

### Edge Cases
- ¿Qué pasa si un ítem se elimina durante la edición?
- ¿Qué pasa si dos usuarios editan el mismo ítem?
- ¿Timeouts en requests largos?

---

**Última actualización:** 2025-11-17
**Estado:** Especificación completa
