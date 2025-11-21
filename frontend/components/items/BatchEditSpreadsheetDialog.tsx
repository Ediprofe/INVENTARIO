'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BatchEditSpreadsheet, type BatchEditRow } from './BatchEditSpreadsheet';
import { useMultipleItems, useBulkUpdateItems } from '@/lib/hooks/useItems';
import { useUbicaciones, useResponsables } from '@/lib/hooks/useCatalogos';
import type { IItemUpdateData } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface BatchEditSpreadsheetDialogProps {
  open: boolean;
  onClose: () => void;
  selectedIds: number[];
  highlightedId?: number;
}

export function BatchEditSpreadsheetDialog({
  open,
  onClose,
  selectedIds,
  highlightedId,
}: BatchEditSpreadsheetDialogProps) {
  const [rows, setRows] = useState<BatchEditRow[]>([]);
  const [result, setResult] = useState<{
    success: number;
    errors: Array<{ id: number; error: string }>;
  } | null>(null);

  const { data: ubicacionesData } = useUbicaciones({ page_size: 1000 });
  const { data: responsablesData } = useResponsables({ page_size: 1000 });
  const bulkUpdateMutation = useBulkUpdateItems();

  // Cargar datos de los ítems seleccionados usando el nuevo hook
  const { data: items, isLoading } = useMultipleItems(selectedIds);

  useEffect(() => {
    if (open && items && items.length > 0) {
      // Convertir los ítems cargados a rows para el spreadsheet
      const initialRows: BatchEditRow[] = items.map((item) => ({
        id: item.id,
        selected: false,
        codigo: item.codigo,
        placa: item.placa || '',
        marca: item.marca || '',
        serial: item.serial || '',
        estado: item.estado,
        disponibilidad: item.disponibilidad,
        ubicacion_id: typeof item.ubicacion === 'object' ? item.ubicacion.id : item.ubicacion,
        responsable_id: item.responsable ? (typeof item.responsable === 'object' ? item.responsable.id : item.responsable) : null,
        descripcion: item.descripcion || '',
        observaciones: item.observaciones || '',
      }));
      setRows(initialRows);
    }
  }, [open, items]);

  const handleSave = async (updatedRows: BatchEditRow[]) => {
    try {
      // Filtrar solo las filas que tienen ID (ítems existentes)
      const updates = updatedRows
        .filter((row) => row.id !== undefined)
        .map((row) => ({
          id: row.id!,
          data: {
            placa: row.placa || undefined,
            marca: row.marca || undefined,
            serial: row.serial || undefined,
            estado: row.estado,
            disponibilidad: row.disponibilidad,
            ubicacion_id: row.ubicacion_id,
            responsable_id: row.responsable_id,
            descripcion: row.descripcion || undefined,
            observaciones: row.observaciones || undefined,
          } as IItemUpdateData,
        }));

      await bulkUpdateMutation.mutateAsync(updates);

      setResult({
        success: updates.length,
        errors: [],
      });

      // Cerrar después de 2 segundos
      setTimeout(() => {
        onClose();
        setResult(null);
      }, 2000);
    } catch (error) {
      console.error('Error al guardar:', error);
      setResult({
        success: 0,
        errors: [{ id: 0, error: 'Error al actualizar ítems' }],
      });
    }
  };

  const handleCancel = () => {
    setRows([]);
    setResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Edición Masiva - Modal Tipo Hoja de Cálculo</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Cargando ítems...</div>
        ) : result ? (
          <div className="p-6">
            <Alert variant={result.errors.length > 0 ? 'destructive' : 'default'}>
              <AlertTitle>Resultado de la actualización</AlertTitle>
              <AlertDescription>
                {result.success > 0 && (
                  <p className="text-green-600 font-semibold">
                    ✓ {result.success} ítems actualizados correctamente
                  </p>
                )}
                {result.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-red-600 font-semibold">✗ {result.errors.length} errores</p>
                    <ul className="text-sm space-y-1 mt-2">
                      {result.errors.map((error, idx) => (
                        <li key={idx} className="text-red-600">
                          Ítem ID {error.id}: {error.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <BatchEditSpreadsheet
            items={rows}
            onSave={handleSave}
            onCancel={handleCancel}
            highlightedId={highlightedId}
            ubicaciones={ubicacionesData?.results}
            responsables={responsablesData?.results}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

