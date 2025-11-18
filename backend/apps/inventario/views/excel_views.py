"""
Views para importación y exportación de Excel.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import HttpResponse
from django.db import transaction
import pandas as pd
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from datetime import datetime
from apps.inventario.models import ItemInventario, Articulo, Ubicacion, Responsable
from apps.inventario.serializers import ItemInventarioSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def import_items_excel(request):
    """
    Importar ítems desde archivo Excel - según CLAUDE.md.

    Expected Excel columns:
    - articulo_codigo, ubicacion_codigo, responsable_documento,
      estado, disponibilidad, placa, marca, serial, descripcion, observaciones

    Nota: El código del ítem se genera automáticamente.
    Cada fila = 1 ítem físico (sin campo cantidad).
    """
    if 'file' not in request.FILES:
        return Response(
            {'error': 'No se proporcionó ningún archivo'},
            status=status.HTTP_400_BAD_REQUEST
        )

    excel_file = request.FILES['file']

    # Validar extensión
    if not excel_file.name.endswith(('.xlsx', '.xls')):
        return Response(
            {'error': 'El archivo debe ser formato Excel (.xlsx o .xls)'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Leer Excel con pandas
        df = pd.read_excel(excel_file)

        # Validar columnas requeridas (según CLAUDE.md)
        required_columns = [
            'articulo_codigo', 'ubicacion_codigo', 'responsable_documento',
            'estado', 'disponibilidad'
        ]
        missing_columns = [col for col in required_columns if col not in df.columns]

        if missing_columns:
            return Response(
                {'error': f'Faltan columnas requeridas: {", ".join(missing_columns)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Procesar datos
        created_items = []
        errors = []

        with transaction.atomic():
            for index, row in df.iterrows():
                try:
                    # Buscar relaciones
                    try:
                        articulo = Articulo.objects.get(codigo=row['articulo_codigo'])
                    except Articulo.DoesNotExist:
                        errors.append({
                            'row': index + 2,  # +2 porque Excel empieza en 1 y header es 1
                            'error': f'Artículo con código {row["articulo_codigo"]} no existe'
                        })
                        continue

                    try:
                        ubicacion = Ubicacion.objects.get(codigo=row['ubicacion_codigo'])
                    except Ubicacion.DoesNotExist:
                        errors.append({
                            'row': index + 2,
                            'error': f'Ubicación con código {row["ubicacion_codigo"]} no existe'
                        })
                        continue

                    try:
                        responsable = Responsable.objects.get(documento=row['responsable_documento'])
                    except Responsable.DoesNotExist:
                        errors.append({
                            'row': index + 2,
                            'error': f'Responsable con documento {row["responsable_documento"]} no existe'
                        })
                        continue

                    # Validar responsable de la misma sede
                    if responsable.sede != ubicacion.sede:
                        errors.append({
                            'row': index + 2,
                            'error': f'Responsable debe ser de la sede {ubicacion.sede.codigo}'
                        })
                        continue

                    # Crear ítem (según CLAUDE.md - sin cantidad ni valor_unitario)
                    item_data = {
                        'articulo_id': articulo.id,
                        'ubicacion_id': ubicacion.id,
                        'responsable_id': responsable.id,
                        'estado': str(row['estado']).strip().lower(),
                        'disponibilidad': str(row['disponibilidad']).strip().lower().replace(' ', '_'),
                        'placa': str(row.get('placa', '')).strip() if pd.notna(row.get('placa')) else '',
                        'marca': str(row.get('marca', '')).strip() if pd.notna(row.get('marca')) else '',
                        'serial': str(row.get('serial', '')).strip() if pd.notna(row.get('serial')) else '',
                        'descripcion': str(row.get('descripcion', '')).strip() if pd.notna(row.get('descripcion')) else '',
                        'observaciones': str(row.get('observaciones', '')).strip() if pd.notna(row.get('observaciones')) else '',
                    }

                    serializer = ItemInventarioSerializer(data=item_data)
                    if serializer.is_valid():
                        item = serializer.save()
                        created_items.append({
                            'row': index + 2,
                            'codigo': item.codigo,
                            'placa': item.placa or '-',
                            'id': item.id
                        })
                    else:
                        errors.append({
                            'row': index + 2,
                            'error': serializer.errors
                        })

                except Exception as e:
                    errors.append({
                        'row': index + 2,
                        'error': str(e)
                    })

        return Response({
            'message': f'Importación completada',
            'created': len(created_items),
            'errors': len(errors),
            'created_items': created_items,
            'error_details': errors
        }, status=status.HTTP_201_CREATED if created_items else status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(
            {'error': f'Error al procesar archivo: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_items_excel(request):
    """
    Exportar ítems a archivo Excel - según CLAUDE.md.

    Query params opcionales: mismo que ItemInventarioFilter
    """
    from apps.inventario.filters import ItemInventarioFilter

    # Aplicar filtros (excluir solo los dados de baja si es necesario)
    queryset = ItemInventario.objects.select_related(
        'articulo', 'sede', 'ubicacion', 'responsable'
    )

    filterset = ItemInventarioFilter(request.GET, queryset=queryset)
    items = filterset.qs

    # Crear Excel con openpyxl
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Ítems Inventario"

    # Estilos
    header_fill = PatternFill(start_color="0066CC", end_color="0066CC", fill_type="solid")
    header_font = Font(color="FFFFFF", bold=True)
    header_alignment = Alignment(horizontal="center", vertical="center")

    # Headers (según CLAUDE.md)
    headers = [
        'ID', 'Código Ítem', 'Placa', 'Artículo', 'Artículo Código', 'Categoría',
        'Sede', 'Ubicación', 'Ubicación Código', 'Responsable',
        'Responsable Documento', 'Marca', 'Serial', 'Estado Físico', 'Disponibilidad',
        'Descripción', 'Observaciones', 'Creado', 'Actualizado'
    ]

    for col_num, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_num, value=header)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = header_alignment

    # Datos
    for row_num, item in enumerate(items, 2):
        ws.cell(row=row_num, column=1, value=item.id)
        ws.cell(row=row_num, column=2, value=item.codigo)
        ws.cell(row=row_num, column=3, value=item.placa or '')
        ws.cell(row=row_num, column=4, value=item.articulo.nombre)
        ws.cell(row=row_num, column=5, value=item.articulo.codigo)
        ws.cell(row=row_num, column=6, value=item.articulo.get_categoria_display())
        ws.cell(row=row_num, column=7, value=item.sede.nombre)
        ws.cell(row=row_num, column=8, value=item.ubicacion.nombre)
        ws.cell(row=row_num, column=9, value=item.ubicacion.codigo)
        ws.cell(row=row_num, column=10, value=item.responsable.nombre_completo)
        ws.cell(row=row_num, column=11, value=item.responsable.documento)
        ws.cell(row=row_num, column=12, value=item.marca or '')
        ws.cell(row=row_num, column=13, value=item.serial or '')
        ws.cell(row=row_num, column=14, value=item.get_estado_display())
        ws.cell(row=row_num, column=15, value=item.get_disponibilidad_display())
        ws.cell(row=row_num, column=16, value=item.descripcion or '')
        ws.cell(row=row_num, column=17, value=item.observaciones or '')
        ws.cell(row=row_num, column=18, value=item.created_at.strftime('%Y-%m-%d %H:%M'))
        ws.cell(row=row_num, column=19, value=item.updated_at.strftime('%Y-%m-%d %H:%M'))

    # Ajustar anchos de columna
    for column in ws.columns:
        max_length = 0
        column_letter = column[0].column_letter
        for cell in column:
            try:
                if len(str(cell.value)) > max_length:
                    max_length = len(str(cell.value))
            except:
                pass
        adjusted_width = min(max_length + 2, 50)
        ws.column_dimensions[column_letter].width = adjusted_width

    # Preparar respuesta
    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    filename = f'inventario_{datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx'
    response['Content-Disposition'] = f'attachment; filename="{filename}"'

    wb.save(response)
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_template(request):
    """
    Descargar plantilla Excel para importación - según CLAUDE.md.

    Columnas: articulo_codigo, ubicacion_codigo, responsable_documento,
              estado, disponibilidad, placa, marca, serial, descripcion, observaciones

    Nota: El código del ítem se genera automáticamente.
    """
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Plantilla Importación"

    # Estilos
    header_fill = PatternFill(start_color="0066CC", end_color="0066CC", fill_type="solid")
    header_font = Font(color="FFFFFF", bold=True)
    header_alignment = Alignment(horizontal="center", vertical="center")

    # Headers (según CLAUDE.md - sin cantidad ni valor_unitario)
    headers = [
        'articulo_codigo', 'ubicacion_codigo', 'responsable_documento',
        'estado', 'disponibilidad', 'placa', 'marca', 'serial',
        'descripcion', 'observaciones'
    ]

    for col_num, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_num, value=header)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = header_alignment

    # Fila de ejemplo
    ws.cell(row=2, column=1, value='TEC-00001')  # articulo_codigo
    ws.cell(row=2, column=2, value='A-101')  # ubicacion_codigo
    ws.cell(row=2, column=3, value='1234567890')  # responsable_documento
    ws.cell(row=2, column=4, value='bueno')  # estado (bueno/regular/malo)
    ws.cell(row=2, column=5, value='en_uso')  # disponibilidad (en_uso/en_reparacion/extraviado/de_baja)
    ws.cell(row=2, column=6, value='PLA-001')  # placa (opcional)
    ws.cell(row=2, column=7, value='HP')  # marca (opcional)
    ws.cell(row=2, column=8, value='SN123456')  # serial (opcional)
    ws.cell(row=2, column=9, value='Descripción del ítem')  # descripcion
    ws.cell(row=2, column=10, value='Observaciones adicionales')  # observaciones

    # Ajustar anchos
    for col_num in range(1, len(headers) + 1):
        ws.column_dimensions[openpyxl.utils.get_column_letter(col_num)].width = 22

    # Preparar respuesta
    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename="plantilla_importacion.xlsx"'

    wb.save(response)
    return response
