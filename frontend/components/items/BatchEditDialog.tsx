'use client';

import { useState } from 'react';
import { useBatchUpdateItems } from '@/lib/hooks/useItems';
import { useUbicaciones, useResponsables } from '@/lib/hooks/useCatalogos';
import type { EstadoItem, IBatchUpdateItem, IBatchUpdateResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

const ESTADOS: Array<{ value: EstadoItem; label: string }> = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'mantenimiento', label: 'En Mantenimiento' },
  { value: 'dado_baja', label: 'Dado de Baja' },
  { value: 'extraviado', label: 'Extraviado' },
  { value: 'reparacion', label: 'En Reparación' },
];

interface BatchEditDialogProps {
  open: boolean;
  onClose: () => void;
  selectedIds: number[];
}

export function BatchEditDialog({ open, onClose, selectedIds }: BatchEditDialogProps) {
  // State for which fields to update
  const [updateFields, setUpdateFields] = useState({
    ubicacion: false,
    responsable: false,
    estado: false,
    valor_unitario: false,
    descripcion: false,
    observaciones: false,
  });

  // State for field values
  const [formData, setFormData] = useState({
    ubicacion_id: '',
    responsable_id: '',
    estado: '' as EstadoItem | '',
    valor_unitario: '',
    descripcion: '',
    observaciones: '',
  });

  // State for atomic mode
  const [atomicMode, setAtomicMode] = useState(false);

  // State for result
  const [result, setResult] = useState<IBatchUpdateResponse | null>(null);

  // Queries
  const { data: ubicacionesData } = useUbicaciones();
  const { data: responsablesData } = useResponsables();
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
        item.estado = formData.estado as EstadoItem;
      }
      if (updateFields.valor_unitario && formData.valor_unitario) {
        item.valor_unitario = parseFloat(formData.valor_unitario);
      }
      if (updateFields.descripcion) {
        item.descripcion = formData.descripcion;
      }
      if (updateFields.observaciones) {
        item.observaciones = formData.observaciones;
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
      valor_unitario: false,
      descripcion: false,
      observaciones: false,
    });
    setFormData({
      ubicacion_id: '',
      responsable_id: '',
      estado: '',
      valor_unitario: '',
      descripcion: '',
      observaciones: '',
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
          <DialogTitle>Edición Masiva</DialogTitle>
          <DialogDescription>
            Actualizar {selectedIds.length} ítems seleccionados
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-6">
            {/* Atomic mode toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="atomic"
                checked={atomicMode}
                onCheckedChange={(checked: boolean) => setAtomicMode(checked)}
              />
              <Label htmlFor="atomic" className="text-sm font-normal">
                Modo atómico (todo o nada - si alguno falla, no se actualiza ninguno)
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
                <Label htmlFor="update-ubicacion">Actualizar Ubicación</Label>
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
                    {ubicacionesData?.results.map((ubicacion) => (
                      <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                        {ubicacion.nombre} ({ubicacion.sede.codigo})
                      </SelectItem>
                    ))}
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
                <Label htmlFor="update-responsable">Actualizar Responsable</Label>
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
                    {responsablesData?.results.map((responsable) => (
                      <SelectItem key={responsable.id} value={responsable.id.toString()}>
                        {responsable.nombre_completo} ({responsable.sede.codigo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Estado field */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="update-estado"
                  checked={updateFields.estado}
                  onCheckedChange={() => handleToggleField('estado')}
                />
                <Label htmlFor="update-estado">Actualizar Estado</Label>
              </div>
              {updateFields.estado && (
                <Select
                  value={formData.estado}
                  onValueChange={(value) => handleFieldChange('estado', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Valor Unitario field */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="update-valor"
                  checked={updateFields.valor_unitario}
                  onCheckedChange={() => handleToggleField('valor_unitario')}
                />
                <Label htmlFor="update-valor">Actualizar Valor Unitario</Label>
              </div>
              {updateFields.valor_unitario && (
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Valor unitario"
                  value={formData.valor_unitario}
                  onChange={(e) => handleFieldChange('valor_unitario', e.target.value)}
                />
              )}
            </div>

            {/* Descripcion field */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="update-descripcion"
                  checked={updateFields.descripcion}
                  onCheckedChange={() => handleToggleField('descripcion')}
                />
                <Label htmlFor="update-descripcion">Actualizar Descripción</Label>
              </div>
              {updateFields.descripcion && (
                <Textarea
                  placeholder="Descripción"
                  value={formData.descripcion}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange('descripcion', e.target.value)}
                  rows={3}
                />
              )}
            </div>

            {/* Observaciones field */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="update-observaciones"
                  checked={updateFields.observaciones}
                  onCheckedChange={() => handleToggleField('observaciones')}
                />
                <Label htmlFor="update-observaciones">Actualizar Observaciones</Label>
              </div>
              {updateFields.observaciones && (
                <Textarea
                  placeholder="Observaciones"
                  value={formData.observaciones}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange('observaciones', e.target.value)}
                  rows={3}
                />
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
