'use client';

import { useState, useMemo } from 'react';
import { useBatchUpdateItems } from '@/lib/hooks/useItems';
import { useUbicaciones, useResponsables, useSedes } from '@/lib/hooks/useCatalogos';
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
import {
  formatResponsableLabel,
  formatSedeLabel,
  formatUbicacionLabel,
  sortResponsables,
  sortSedes,
  sortUbicaciones,
} from '@/lib/catalogs';

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

  // State for sede selection (used when changing ubicacion)
  const [selectedSedeId, setSelectedSedeId] = useState<string>('');
  const [changeSede, setChangeSede] = useState(false);

  // State for atomic mode
  const [atomicMode, setAtomicMode] = useState(false);

  // State for result
  const [result, setResult] = useState<IBatchUpdateResponse | null>(null);

  // Queries
  const { data: sedesData } = useSedes();
  const { data: ubicacionesData } = useUbicaciones();
  const { data: responsablesData } = useResponsables();
  const batchUpdateMutation = useBatchUpdateItems();

  const sedesOptions = useMemo(
    () => sortSedes(sedesData?.results ?? []),
    [sedesData]
  );
  const ubicacionesOptions = useMemo(
    () => sortUbicaciones(ubicacionesData?.results ?? []),
    [ubicacionesData]
  );
  const responsablesOptions = useMemo(
    () => sortResponsables(responsablesData?.results ?? []),
    [responsablesData]
  );

  // Filter ubicaciones by selected sede
  const filteredUbicaciones = useMemo(() => {
    if (ubicacionesOptions.length === 0) return [];
    if (!selectedSedeId) return ubicacionesOptions;
    
    return ubicacionesOptions.filter((ubicacion) => {
      const sedeId = typeof ubicacion.sede === 'object' ? ubicacion.sede.id : ubicacion.sede;
      return sedeId.toString() === selectedSedeId;
    });
  }, [ubicacionesOptions, selectedSedeId]);

  const handleToggleField = (field: keyof typeof updateFields) => {
    setUpdateFields((prev) => ({ ...prev, [field]: !prev[field] }));
    
    // Reset sede selection when unchecking ubicacion
    if (field === 'ubicacion' && updateFields.ubicacion) {
      setSelectedSedeId('');
      setChangeSede(false);
      setFormData((prev) => ({ ...prev, ubicacion_id: '' }));
    }
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
    setSelectedSedeId('');
    setChangeSede(false);
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
                <div className="space-y-3 pl-6 border-l-2 border-blue-200">
                  {/* Pregunta sobre cambio de sede */}
                  <div className="space-y-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="change-sede"
                        checked={changeSede}
                        onCheckedChange={(checked: boolean) => {
                          setChangeSede(checked);
                          if (!checked) {
                            setSelectedSedeId('');
                            setFormData((prev) => ({ ...prev, ubicacion_id: '' }));
                          }
                        }}
                      />
                      <Label htmlFor="change-sede" className="text-sm font-semibold cursor-pointer">
                        ¿Esta actualización implica cambio de sede?
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground pl-6">
                      Si marca esta opción, podrá elegir ubicaciones de otra sede. 
                      Si no la marca, solo verá ubicaciones de la sede actual de los ítems.
                    </p>
                  </div>

                  {/* Sede selector - solo si se quiere cambiar de sede */}
                  {changeSede && (
                    <div className="space-y-2">
                      <Label className="text-sm">
                        <span className="font-semibold">Paso 1:</span> Seleccionar Nueva Sede {selectedSedeId && '✓'}
                      </Label>
                      <Select
                        value={selectedSedeId}
                        onValueChange={(value) => {
                          setSelectedSedeId(value);
                          setFormData((prev) => ({ ...prev, ubicacion_id: '' }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar sede destino" />
                        </SelectTrigger>
                        <SelectContent>
                          {sedesOptions.map((sede) => (
                            <SelectItem key={sede.id} value={sede.id.toString()}>
                              {formatSedeLabel(sede)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Ubicacion selector */}
                  <div className="space-y-2">
                    <Label className="text-sm">
                      <span className="font-semibold">{changeSede ? 'Paso 2:' : 'Seleccionar'}</span> Ubicación
                      {filteredUbicaciones.length > 0 && ` (${filteredUbicaciones.length} disponibles)`}
                    </Label>
                    <Select
                      value={formData.ubicacion_id}
                      onValueChange={(value) => handleFieldChange('ubicacion_id', value)}
                      disabled={changeSede && !selectedSedeId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          changeSede && !selectedSedeId 
                            ? "Primero seleccione una sede" 
                            : "Seleccionar ubicación"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredUbicaciones.length === 0 ? (
                          <div className="py-2 px-4 text-sm text-gray-500">
                            {changeSede && selectedSedeId 
                              ? 'No hay ubicaciones en esta sede' 
                              : changeSede 
                                ? 'Seleccione primero una sede'
                                : 'No hay ubicaciones disponibles'}
                          </div>
                        ) : (
                          filteredUbicaciones.map((ubicacion) => (
                            <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                              {formatUbicacionLabel(ubicacion)}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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
                    {responsablesOptions.map((responsable) => (
                      <SelectItem key={responsable.id} value={responsable.id.toString()}>
                        {formatResponsableLabel(responsable)}
                      </SelectItem>
                    ))}
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
