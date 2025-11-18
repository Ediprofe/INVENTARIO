"""
ViewSet para ItemInventario.
"""
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from django.core.exceptions import ValidationError
from decimal import Decimal
from apps.inventario.models import ItemInventario, Ubicacion, Responsable, HistorialMovimiento
from apps.inventario.serializers import (
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
    ordering_fields = ['codigo', 'created_at', 'valor_unitario', 'estado']
    ordering = ['-created_at']

    def get_queryset(self):
        """Optimizar queries con select_related y prefetch_related."""
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
        """Auto-asignar sede desde ubicación."""
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
        """Soft delete: cambiar estado a dado_baja."""
        instance.estado = 'dado_baja'
        instance.save()

    @action(detail=False, methods=['post'], url_path='batch-update')
    def batch_update(self, request):
        """
        Actualización masiva de ítems.

        Body: {
          "items": [
            {"id": 1, "ubicacion_id": 5, "responsable_id": 3},
            {"id": 2, "estado": "mantenimiento"}
          ],
          "atomic": false  # true = todo o nada, false = parcial (default)
        }

        Response: {
          "success": [1, 2],
          "errors": [
            {"id": 3, "error": "Descripción del error"}
          ]
        }
        """
        items_data = request.data.get('items', [])
        atomic = request.data.get('atomic', False)

        if not items_data:
            return Response(
                {'error': 'Se requiere lista de ítems'},
                status=status.HTTP_400_BAD_REQUEST
            )

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
                        self._update_single_item(item_data, results, request.user)

                    if results['errors']:
                        raise Exception("Errores en validación")

                return Response(results, status=status.HTTP_200_OK)

            except Exception:
                return Response(
                    {
                        'error': 'Transacción abortada por errores',
                        'errors': results['errors']
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Modo parcial: aplicar solo los válidos (default)
        else:
            for item_data in items_data:
                try:
                    with transaction.atomic():
                        self._update_single_item(item_data, results, request.user)
                except Exception:
                    pass  # Ya agregado a results['errors']

            return Response(results, status=status.HTTP_200_OK)

    def _update_single_item(self, item_data, results, user):
        """Actualiza un ítem individual con validaciones."""
        item_id = item_data.get('id')

        if not item_id:
            results['errors'].append({
                'id': None,
                'error': 'ID de ítem requerido'
            })
            raise ValidationError('ID requerido')

        try:
            item = ItemInventario.objects.select_related(
                'sede', 'ubicacion', 'responsable'
            ).get(pk=item_id)

            datos_anteriores = {}
            datos_nuevos = {}

            # Validar y actualizar ubicacion
            if 'ubicacion_id' in item_data:
                ubicacion_id = item_data['ubicacion_id']
                try:
                    ubicacion = Ubicacion.objects.select_related('sede').get(pk=ubicacion_id)

                    # Validar misma sede
                    if item.sede and ubicacion.sede != item.sede:
                        raise ValidationError(
                            f'Ubicación debe pertenecer a {item.sede.codigo}'
                        )

                    datos_anteriores['ubicacion'] = item.ubicacion.nombre
                    item.ubicacion = ubicacion
                    item.sede = ubicacion.sede
                    datos_nuevos['ubicacion'] = ubicacion.nombre

                except Ubicacion.DoesNotExist:
                    raise ValidationError(f'Ubicación con ID {ubicacion_id} no encontrada')

            # Validar y actualizar responsable
            if 'responsable_id' in item_data:
                responsable_id = item_data['responsable_id']
                try:
                    responsable = Responsable.objects.select_related('sede').get(pk=responsable_id)

                    # Validar misma sede
                    if item.sede and responsable.sede and responsable.sede != item.sede:
                        raise ValidationError(
                            f'Responsable debe pertenecer a {item.sede.codigo}'
                        )

                    datos_anteriores['responsable'] = item.responsable.nombre_completo
                    item.responsable = responsable
                    datos_nuevos['responsable'] = responsable.nombre_completo

                except Responsable.DoesNotExist:
                    raise ValidationError(f'Responsable con ID {responsable_id} no encontrado')

            # Actualizar estado
            if 'estado' in item_data:
                estado = item_data['estado']
                valid_estados = ['activo', 'inactivo', 'mantenimiento', 'dado_baja', 'extraviado', 'reparacion']

                if estado not in valid_estados:
                    raise ValidationError(f'Estado inválido: {estado}')

                datos_anteriores['estado'] = item.estado
                item.estado = estado
                datos_nuevos['estado'] = estado

            # Actualizar valor_unitario
            if 'valor_unitario' in item_data:
                try:
                    valor = Decimal(str(item_data['valor_unitario']))
                    if valor < 0:
                        raise ValidationError('Valor unitario debe ser mayor o igual a 0')

                    datos_anteriores['valor_unitario'] = str(item.valor_unitario)
                    item.valor_unitario = valor
                    datos_nuevos['valor_unitario'] = str(valor)

                except (ValueError, TypeError):
                    raise ValidationError('Valor unitario debe ser un número válido')

            # Actualizar descripcion
            if 'descripcion' in item_data:
                datos_anteriores['descripcion'] = item.descripcion
                item.descripcion = item_data['descripcion']
                datos_nuevos['descripcion'] = item_data['descripcion']

            # Actualizar observaciones
            if 'observaciones' in item_data:
                datos_anteriores['observaciones'] = item.observaciones
                item.observaciones = item_data['observaciones']
                datos_nuevos['observaciones'] = item_data['observaciones']

            # Guardar cambios
            item.save()

            # Registrar en historial
            if datos_nuevos:
                HistorialMovimiento.objects.create(
                    item=item,
                    tipo_movimiento='batch_update',
                    usuario=user,
                    datos_anteriores=datos_anteriores,
                    datos_nuevos=datos_nuevos,
                    observaciones='Actualización masiva'
                )

            results['success'].append(item_id)

        except ItemInventario.DoesNotExist:
            results['errors'].append({
                'id': item_id,
                'error': 'Ítem no encontrado'
            })
            raise

        except ValidationError as e:
            error_msg = str(e.message) if hasattr(e, 'message') else str(e)
            results['errors'].append({
                'id': item_id,
                'error': error_msg
            })
            raise

        except Exception as e:
            results['errors'].append({
                'id': item_id,
                'error': f'Error inesperado: {str(e)}'
            })
            raise
