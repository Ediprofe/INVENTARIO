"""
ViewSet para estadísticas e informes del inventario.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from apps.inventario.models import ItemInventario, Ubicacion, Responsable, Articulo, Sede
from apps.inventario.serializers import ItemInventarioListSerializer


class InventarioStatsViewSet(viewsets.ViewSet):
    """
    ViewSet para consultas estadísticas del inventario.
    
    Endpoints:
        - GET /stats/por-ubicacion/{ubicacion_id}/ - Inventario por ubicación
        - GET /stats/por-responsable/{responsable_id}/ - Inventario por responsable
        - GET /stats/por-articulo/ - Inventario por artículo (matriz sedes)
    """
    
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='por-ubicacion/(?P<ubicacion_id>[^/.]+)')
    def por_ubicacion(self, request, ubicacion_id=None):
        """
        GET /inventario/stats/por-ubicacion/{ubicacion_id}/
        
        Retorna inventario de una ubicación específica:
        - metadata: información de la ubicación
        - resumen: totalizado por artículo
        - detalle: lista de ítems (paginado)
        """
        try:
            ubicacion = Ubicacion.objects.select_related(
                'sede', 'responsable'
            ).get(id=ubicacion_id)
        except Ubicacion.DoesNotExist:
            return Response(
                {'error': 'Ubicación no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Filtrar ítems de esta ubicación
        items_queryset = ItemInventario.objects.filter(
            ubicacion=ubicacion
        ).select_related(
            'articulo', 'sede', 'ubicacion', 'responsable'
        )

        # Resumen: Totalizado por artículo
        resumen = items_queryset.values(
            'articulo__nombre'
        ).annotate(
            total=Count('id')
        ).order_by('articulo__nombre')

        # Detalle: Lista de ítems (aplicar filtros adicionales si se proporcionan)
        # TODO: Implementar filtros de búsqueda
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 50))
        start = (page - 1) * page_size
        end = start + page_size

        total_items = items_queryset.count()
        items = items_queryset[start:end]
        serializer = ItemInventarioListSerializer(items, many=True)

        return Response({
            'metadata': {
                'ubicacion_id': ubicacion.id,
                'ubicacion_nombre': ubicacion.nombre,
                'ubicacion_codigo': ubicacion.codigo,
                'sede_nombre': ubicacion.sede.nombre,
                'responsable_nombre': ubicacion.responsable.nombre_completo if ubicacion.responsable else None,
            },
            'resumen': list(resumen),
            'detalle': {
                'count': total_items,
                'results': serializer.data,
                'page': page,
                'page_size': page_size,
            }
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='por-responsable/(?P<responsable_id>[^/.]+)')
    def por_responsable(self, request, responsable_id=None):
        """
        GET /inventario/stats/por-responsable/{responsable_id}/
        
        Retorna inventario de un responsable específico:
        - metadata: información del responsable
        - resumen: totalizado por artículo y ubicación
        - detalle: lista de ítems (paginado)
        """
        try:
            responsable = Responsable.objects.select_related('sede').get(id=responsable_id)
        except Responsable.DoesNotExist:
            return Response(
                {'error': 'Responsable no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Filtrar ítems de este responsable
        items_queryset = ItemInventario.objects.filter(
            responsable=responsable
        ).select_related(
            'articulo', 'sede', 'ubicacion', 'responsable'
        )

        # Resumen: Totalizado por artículo y ubicación
        resumen = items_queryset.values(
            'articulo__nombre',
            'ubicacion__nombre',
            'ubicacion__codigo'
        ).annotate(
            total=Count('id')
        ).order_by('articulo__nombre', 'ubicacion__nombre')

        # Detalle: Lista de ítems (aplicar filtros adicionales si se proporcionan)
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 50))
        start = (page - 1) * page_size
        end = start + page_size

        total_items = items_queryset.count()
        items = items_queryset[start:end]
        serializer = ItemInventarioListSerializer(items, many=True)

        return Response({
            'metadata': {
                'responsable_id': responsable.id,
                'responsable_nombre': responsable.nombre_completo,
                'sede_nombre': responsable.sede.nombre,
            },
            'resumen': list(resumen),
            'detalle': {
                'count': total_items,
                'results': serializer.data,
                'page': page,
                'page_size': page_size,
            }
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='por-articulo')
    def por_articulo(self, request):
        """
        GET /inventario/stats/por-articulo/
        
        Retorna inventario por artículo en matriz de sedes:
        - sedes: lista de sedes (columnas)
        - articulos: lista de artículos con totales por sede (filas)
        
        Query params:
        - disponibilidad: filtrar por disponibilidad (en_uso, en_reparacion, extraviado, de_baja)
        - estado: filtrar por estado físico (bueno, regular, malo)
        """
        # Obtener filtros desde query params
        disponibilidad_filter = request.query_params.get('disponibilidad', None)
        estado_filter = request.query_params.get('estado', None)
        
        # Obtener todas las sedes activas
        sedes = Sede.objects.filter(activo=True).order_by('nombre')
        
        # Base queryset para items con filtros aplicados
        items_base_qs = ItemInventario.objects.all()
        if disponibilidad_filter:
            items_base_qs = items_base_qs.filter(disponibilidad=disponibilidad_filter)
        if estado_filter:
            items_base_qs = items_base_qs.filter(estado=estado_filter)
        
        # Obtener todos los artículos que tienen items (con filtros aplicados)
        articulos = Articulo.objects.filter(
            activo=True,
            items_inventario__in=items_base_qs
        ).distinct().order_by('nombre')

        # Construir matriz: artículo x sede x estado físico
        matriz = []
        for articulo in articulos:
            fila = {
                'articulo_id': articulo.id,
                'articulo_nombre': articulo.nombre,
                'totales_por_sede': {},
                'total_general': 0
            }
            
            # Contar ítems por sede para este artículo (con filtros aplicados)
            # Desglosado por estado físico
            for sede in sedes:
                queryset = items_base_qs.filter(
                    articulo=articulo,
                    sede=sede
                )
                
                # Contar por estado físico
                total_bueno = queryset.filter(estado='bueno').count()
                total_regular = queryset.filter(estado='regular').count()
                total_malo = queryset.filter(estado='malo').count()
                total_sede = total_bueno + total_regular + total_malo
                
                fila['totales_por_sede'][sede.codigo] = {
                    'bueno': total_bueno,
                    'regular': total_regular,
                    'malo': total_malo,
                    'total': total_sede
                }
                fila['total_general'] += total_sede
            
            matriz.append(fila)

        return Response({
            'sedes': [
                {'id': s.id, 'nombre': s.nombre, 'codigo': s.codigo}
                for s in sedes
            ],
            'articulos': matriz,
            'filtros_aplicados': {
                'disponibilidad': disponibilidad_filter,
                'estado': estado_filter,
            }
        }, status=status.HTTP_200_OK)

