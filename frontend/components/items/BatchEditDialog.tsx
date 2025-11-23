'use client';

import { useState } from 'react';
import { useBatchUpdateItems } from '@/lib/hooks/useItems';
import { useUbicaciones, useResponsables } from '@/lib/hooks/useCatalogos';
import type { EstadoFisico, Disponibilidad, IBatchUpdateItem, IBatchUpdateResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ESTADO_FISICO: Array<{ value: EstadoFisico; label: string }> = [
  { value: 'bueno', label: 'Bueno' },
  { value: 'regular', label: 'Regular' },
  { value: 'malo', label: 'Malo' },
];

const DISPONIBILIDADES: Array<{ value: Disponibilidad; label: string }> = [
  { value: 'en_uso', label: 'En uso' },
  { value: 'en_reparacion', label: 'En reparación' },
  { value: 'extraviado', label: 'Extraviado' },
  { value: 'de_baja', label: 'De baja' },
];

interface BatchEditDialogProps {
  open: boolean;
  onClose: () => void;
  selectedIds: number[];
}

/**
 * Diálogo de edición masiva simplificado.
 * 
 * Solo permite actualizar:
 * - Modo atómico (todo o nada)
 * - Ubicación
 * - Responsable
 * - Estado Físico
 * - Disponibilidad
 */
export function BatchEditDialog({ open, onClose, selectedIds }: BatchEditDialogProps) {
  // State for which fields to update
  const [updateFields, setUpdateFields] = useState({
    ubicacion: false,
    responsable: false,
    estado: false,
    disponibilidad: false,
  });

  // State for field values
  const [formData, setFormData] = useState({
    ubicacion_id: '',
    responsable_id: '',
    estado: '' as EstadoFisico | '',
    disponibilidad: '' as Disponibilidad | '',
  });

  // State for atomic mode
  const [atomicMode, setAtomicMode] = useState(false);

  // State for result
  const [result, setResult] = useState<IBatchUpdateResponse | null>(null);

  // Queries
  const { data: ubicacionesData } = useUbicaciones({ page_size: 1000 });
  const { data: responsablesData } = useResponsables({ page_size: 1000 });
  const batchUpdateMutation = useBatchUpdateItems();

  const handleToggleField = (field: keyof typeof updateFields) => {
    setUpdateFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Build the batch update items
    const items: IBatchUpdateItem[] = selectedIds.map((id) => {
      const item: IBatchUpdateItem = { id };

      if (updateFields.ubicacion && formData.ubicacion_id) {
        item.ubicacion_id = parseInt(formData.ubicacion_id);
      }
      if (updateFields.responsable && formData.responsable_id) {
        item.responsable_id = parseInt(formData.responsable_id);
      }
      if (updateFields.estado && formData.estado) {
        item.estado = formData.estado as EstadoFisico;
      }
      if (updateFields.disponibilidad && formData.disponibilidad) {
        item.disponibilidad = formData.disponibilidad as Disponibilidad;
      }

      return item;
    });

    try {
      const response = await batchUpdateMutation.mutateAsync({
        items,
        atomic: atomicMode,
      });
      setResult(response);
    } catch (err) {
      console.error('Error en actualización masiva:', err);
      alert('Error al actualizar ítems');
    }
  };

  const handleClose = () => {
    setUpdateFields({
      ubicacion: false,
      responsable: false,
      estado: false,
      disponibilidad: false,
    });
    setFormData({
      ubicacion_id: '',
      responsable_id: '',
      estado: '',
      disponibilidad: '',
    });
    setAtomicMode(false);
    setResult(null);
    onClose();
  };

  // Check if at least one field is selected
  const hasSelectedFields = Object.values(updateFields).some((v) => v);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edición Rápida</DialogTitle>
          <DialogDescription>
            Actualizar {selectedIds.length} ítems seleccionados
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-6">
            {/* Atomic mode toggle */}
            <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <Checkbox
                id="atomic"
                checked={atomicMode}
                onCheckedChange={(checked: boolean) => setAtomicMode(checked)}
              />
              <Label htmlFor="atomic" className="text-sm font-normal cursor-pointer">
                <span className="font-semibold">Modo atómico:</span> Si algún ítem falla, no se actualiza ninguno (todo o nada)
              </Label>
            </div>

            {/* Ubicacion field */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="update-ubicacion"
                  checked={updateFields.ubicacion}
                  onCheckedChange={() => handleToggleField('ubicacion')}
                />
                <Label htmlFor="update-ubicacion" className="font-semibold">
                  Actualizar Ubicación
                </Label>
              </div>
              {updateFields.ubicacion && (
                <Select
                  value={formData.ubicacion_id}
                  onValueChange={(value) => handleFieldChange('ubicacion_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {ubicacionesData?.results.map((ubicacion) => {
                      const sedeInfo = typeof ubicacion.sede === 'object' && ubicacion.sede
                        ? ubicacion.sede.codigo 
                        : '';
                      return (
                        <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                          {ubicacion.nombre} {sedeInfo && `(${sedeInfo})`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Responsable field */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="update-responsable"
                  checked={updateFields.responsable}
                  onCheckedChange={() => handleToggleField('responsable')}
                />
                <Label htmlFor="update-responsable" className="font-semibold">
                  Actualizar Responsable
                </Label>
              </div>
              {updateFields.responsable && (
                <Select
                  value={formData.responsable_id}
                  onValueChange={(value) => handleFieldChange('responsable_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar responsable" />
                  </SelectTrigger>
                  <SelectContent>
                    {responsablesData?.results.map((responsable) => {
                      const sedeInfo = typeof responsable.sede === 'object' && responsable.sede
                        ? responsable.sede.codigo 
                        : '';
                      return (
                        <SelectItem key={responsable.id} value={responsable.id.toString()}>
                          {responsable.nombre_completo} {sedeInfo && `(${sedeInfo})`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Estado Físico field */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="update-estado"
                  checked={updateFields.estado}
                  onCheckedChange={() => handleToggleField('estado')}
                />
                <Label htmlFor="update-estado" className="font-semibold">
                  Actualizar Estado Físico
                </Label>
              </div>
              {updateFields.estado && (
                <Select
                  value={formData.estado}
                  onValueChange={(value) => handleFieldChange('estado', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado físico" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADO_FISICO.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Disponibilidad field */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="update-disponibilidad"
                  checked={updateFields.disponibilidad}
                  onCheckedChange={() => handleToggleField('disponibilidad')}
                />
                <Label htmlFor="update-disponibilidad" className="font-semibold">
                  Actualizar Disponibilidad
                </Label>
              </div>
              {updateFields.disponibilidad && (
                <Select
                  value={formData.disponibilidad}
                  onValueChange={(value) => handleFieldChange('disponibilidad', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar disponibilidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISPONIBILIDADES.map((disp) => (
                      <SelectItem key={disp.value} value={disp.value}>
                        {disp.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        ) : (
          // Show results
          <div className="space-y-4">
            <Alert variant={result.errors.length > 0 ? 'destructive' : 'default'}>
              <AlertTitle>Resultado de la actualización</AlertTitle>
              <AlertDescription>
                {result.success.length > 0 && (
                  <p className="text-green-600 font-semibold">
                    ✓ {result.success.length} ítems actualizados correctamente
                  </p>
                )}
                {result.errors.length > 0 && (
                  <p className="text-red-600 font-semibold">
                    ✗ {result.errors.length} ítems con errores
                  </p>
                )}
              </AlertDescription>
            </Alert>

            {result.errors.length > 0 && (
              <div className="max-h-60 overflow-y-auto">
                <h4 className="text-sm font-semibold mb-2">Errores:</h4>
                <ul className="text-sm space-y-1">
                  {result.errors.map((error, idx) => (
                    <li key={idx} className="text-red-600">
                      Ítem ID {error.id}: {error.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {!result ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!hasSelectedFields || batchUpdateMutation.isPending}
              >
                {batchUpdateMutation.isPending ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose}>
              Cerrar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
