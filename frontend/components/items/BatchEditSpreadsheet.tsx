'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { EstadoFisico, Disponibilidad, IUbicacion, IResponsable } from '@/types';
import { formatUbicacionLabel, formatResponsableLabel } from '@/lib/catalogs';

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

export interface BatchEditRow {
  id?: number; // undefined para nuevos ítems
  selected: boolean;
  codigo?: string;
  placa: string;
  marca: string;
  serial: string;
  estado: EstadoFisico;
  disponibilidad: Disponibilidad;
  ubicacion_id?: number;
  responsable_id?: number | null;
  descripcion: string;
  observaciones: string;
}

interface BatchEditSpreadsheetProps {
  items: BatchEditRow[];
  onSave: (items: BatchEditRow[]) => void;
  onCancel: () => void;
  highlightedId?: number; // ID del ítem que activó el modal (resaltado pero no seleccionado)
  ubicaciones?: IUbicacion[];
  responsables?: IResponsable[];
}

export function BatchEditSpreadsheet({
  items: initialItems,
  onSave,
  onCancel,
  highlightedId,
  ubicaciones = [],
  responsables = [],
}: BatchEditSpreadsheetProps) {
  const [selectedCount, setSelectedCount] = useState(0);
  const [showResponsableDialog, setShowResponsableDialog] = useState(false);
  const [pendingUbicacionId, setPendingUbicacionId] = useState<number | null>(null);

  const { control, handleSubmit, setValue, watch } = useForm<{ items: BatchEditRow[] }>({
    defaultValues: {
      items: initialItems,
    },
  });

  const { fields, update } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');

  // Contar ítems seleccionados
  useEffect(() => {
    const count = items.filter((item) => item.selected).length;
    setSelectedCount(count);
  }, [items]);

  const handleSelectAll = (checked: boolean) => {
    items.forEach((_, index) => {
      setValue(`items.${index}.selected`, checked);
    });
  };

  const handleSelectRow = (index: number, checked: boolean) => {
    setValue(`items.${index}.selected`, checked);
  };

  // Acciones en lote
  const handleBatchUpdateField = (field: keyof BatchEditRow, value: any) => {
    items.forEach((item, index) => {
      if (item.selected) {
        setValue(`items.${index}.${field}` as any, value);
      }
    });
  };

  // Cambiar ubicación en lote (con lógica de responsable automático)
  const handleBatchChangeUbicacion = (ubicacionId: number) => {
    const ubicacion = ubicaciones.find((u) => u.id === ubicacionId);
    
    if (!ubicacion) return;

    // Si la ubicación tiene responsable por defecto, preguntar
    if (ubicacion.responsable) {
      setPendingUbicacionId(ubicacionId);
      setShowResponsableDialog(true);
    } else {
      // No hay responsable por defecto, solo cambiar ubicación
      handleBatchUpdateField('ubicacion_id', ubicacionId);
    }
  };

  // Confirmar uso del responsable por defecto de la ubicación
  const handleConfirmResponsableDefecto = (useDefault: boolean) => {
    if (pendingUbicacionId === null) return;

    const ubicacion = ubicaciones.find((u) => u.id === pendingUbicacionId);
    
    // Cambiar ubicación a todos los seleccionados
    handleBatchUpdateField('ubicacion_id', pendingUbicacionId);

    // Si acepta usar el responsable por defecto
    if (useDefault && ubicacion?.responsable) {
      handleBatchUpdateField('responsable_id', ubicacion.responsable);
    }

    // Limpiar estado
    setPendingUbicacionId(null);
    setShowResponsableDialog(false);
  };

  const onSubmit = (data: { items: BatchEditRow[] }) => {
    onSave(data.items);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar con acciones en lote */}
      <div className="p-4 border-b bg-gray-50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">
            {selectedCount > 0 ? (
              <span>
                {selectedCount} {selectedCount === 1 ? 'ítem seleccionado' : 'ítems seleccionados'}
              </span>
            ) : (
              <span className="text-gray-500">Selecciona ítems para aplicar acciones en lote</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
              Guardar cambios
            </Button>
          </div>
        </div>

        {/* Acciones en lote - solo visible si hay ítems seleccionados */}
        {selectedCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <div className="text-xs font-medium text-gray-600 w-full mb-1">
              Aplicar a {selectedCount} {selectedCount === 1 ? 'ítem' : 'ítems'}:
            </div>

            {/* Cambiar estado */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Estado:</span>
              <Select onValueChange={(value) => handleBatchUpdateField('estado', value as EstadoFisico)}>
                <SelectTrigger className="h-8 w-32">
                  <SelectValue placeholder="Cambiar..." />
                </SelectTrigger>
                <SelectContent>
                  {ESTADO_FISICO.map((e) => (
                    <SelectItem key={e.value} value={e.value}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cambiar disponibilidad */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Disponibilidad:</span>
              <Select
                onValueChange={(value) => handleBatchUpdateField('disponibilidad', value as Disponibilidad)}
              >
                <SelectTrigger className="h-8 w-40">
                  <SelectValue placeholder="Cambiar..." />
                </SelectTrigger>
                <SelectContent>
                  {DISPONIBILIDADES.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cambiar ubicación */}
            {ubicaciones.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Ubicación:</span>
                <Select onValueChange={(value) => handleBatchChangeUbicacion(parseInt(value))}>
                  <SelectTrigger className="h-8 w-48">
                    <SelectValue placeholder="Cambiar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ubicaciones.map((ubicacion) => (
                      <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                        {formatUbicacionLabel(ubicacion)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Cambiar responsable */}
            {responsables.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Responsable:</span>
                <Select
                  onValueChange={(value) =>
                    handleBatchUpdateField('responsable_id', value ? parseInt(value) : null)
                  }
                >
                  <SelectTrigger className="h-8 w-48">
                    <SelectValue placeholder="Cambiar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {responsables.map((responsable) => (
                      <SelectItem key={responsable.id} value={responsable.id.toString()}>
                        {formatResponsableLabel(responsable)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialog para confirmar responsable por defecto */}
      {showResponsableDialog && pendingUbicacionId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Cambiar Ubicación</h3>
            <p className="text-sm text-gray-600 mb-4">
              ¿Deseas usar el responsable por defecto de la nueva ubicación para los ítems seleccionados?
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleConfirmResponsableDefecto(false)}
              >
                No, mantener actual
              </Button>
              <Button type="button" onClick={() => handleConfirmResponsableDefecto(true)}>
                Sí, usar por defecto
              </Button>
            </div>
          </div>
        </div>
      )}
      

      {/* Tabla tipo hoja de cálculo */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={items.length > 0 && items.every((item) => item.selected)}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-24">Código</TableHead>
              <TableHead className="w-32">Placa</TableHead>
              <TableHead className="w-32">Marca</TableHead>
              <TableHead className="w-32">Serial</TableHead>
              <TableHead className="w-32">Estado</TableHead>
              <TableHead className="w-40">Disponibilidad</TableHead>
              <TableHead className="min-w-48">Descripción</TableHead>
              <TableHead className="min-w-48">Observaciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => {
              const item = items[index];
              const isHighlighted = highlightedId !== undefined && field.id === highlightedId;

              return (
                <TableRow
                  key={field.id}
                  className={`${isHighlighted ? 'bg-blue-50' : ''} ${item.selected ? 'bg-gray-50' : ''}`}
                >
                  {/* Checkbox */}
                  <TableCell>
                    <Checkbox
                      checked={item.selected}
                      onCheckedChange={(checked) => handleSelectRow(index, checked as boolean)}
                    />
                  </TableCell>

                  {/* Código (read-only) */}
                  <TableCell>
                    <span className="text-xs text-gray-500">{item.codigo || 'Nuevo'}</span>
                  </TableCell>

                  {/* Placa */}
                  <TableCell>
                    <Input
                      value={item.placa}
                      onChange={(e) => setValue(`items.${index}.placa`, e.target.value)}
                      className="h-8 text-sm"
                      placeholder="PLA-001"
                    />
                  </TableCell>

                  {/* Marca */}
                  <TableCell>
                    <Input
                      value={item.marca}
                      onChange={(e) => setValue(`items.${index}.marca`, e.target.value)}
                      className="h-8 text-sm"
                      placeholder="HP, Dell..."
                    />
                  </TableCell>

                  {/* Serial */}
                  <TableCell>
                    <Input
                      value={item.serial}
                      onChange={(e) => setValue(`items.${index}.serial`, e.target.value)}
                      className="h-8 text-sm"
                      placeholder="SN123456"
                    />
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    <Select
                      value={item.estado}
                      onValueChange={(value) => setValue(`items.${index}.estado`, value as EstadoFisico)}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTADO_FISICO.map((e) => (
                          <SelectItem key={e.value} value={e.value}>
                            {e.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Disponibilidad */}
                  <TableCell>
                    <Select
                      value={item.disponibilidad}
                      onValueChange={(value) =>
                        setValue(`items.${index}.disponibilidad`, value as Disponibilidad)
                      }
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DISPONIBILIDADES.map((d) => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Descripción */}
                  <TableCell>
                    <Input
                      value={item.descripcion}
                      onChange={(e) => setValue(`items.${index}.descripcion`, e.target.value)}
                      className="h-8 text-sm"
                      placeholder="Descripción..."
                    />
                  </TableCell>

                  {/* Observaciones */}
                  <TableCell>
                    <Input
                      value={item.observaciones}
                      onChange={(e) => setValue(`items.${index}.observaciones`, e.target.value)}
                      className="h-8 text-sm"
                      placeholder="Observaciones..."
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Footer con información */}
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>
            Total: {items.length} {items.length === 1 ? 'ítem' : 'ítems'}
          </span>
          <span className="text-gray-500">
            Tip: Usa Tab para moverte entre celdas, Enter para confirmar y bajar a la siguiente fila
          </span>
        </div>
      </div>
    </div>
  );
}
