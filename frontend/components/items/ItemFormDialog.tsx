'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { itemSchema, type ItemFormData } from '@/lib/schemas';
import { useCreateItem, useUpdateItem, useItem } from '@/lib/hooks';
import { useArticulos, useUbicaciones, useResponsables } from '@/lib/hooks/useCatalogos';
import type { EstadoFisico, Disponibilidad } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

interface ItemFormDialogProps {
  open: boolean;
  onClose: () => void;
  itemId?: number | null;
}

export function ItemFormDialog({ open, onClose, itemId }: ItemFormDialogProps) {
  const isEditing = !!itemId;

  // Queries
  const { data: item, isLoading: isLoadingItem } = useItem(itemId || 0);
  const { data: articulosData } = useArticulos();
  const { data: ubicacionesData } = useUbicaciones();
  const { data: responsablesData } = useResponsables();

  // Mutations
  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      estado: 'bueno',
      disponibilidad: 'en_uso',
    },
  });

  // Load item data when editing
  useEffect(() => {
    if (isEditing && item) {
      setValue('articulo_id', item.articulo.id);
      setValue('ubicacion_id', item.ubicacion.id);
      setValue('responsable_id', item.responsable.id);
      setValue('placa', item.placa || '');
      setValue('marca', item.marca || '');
      setValue('serial', item.serial || '');
      setValue('estado', item.estado);
      setValue('disponibilidad', item.disponibilidad);
      setValue('descripcion', item.descripcion || '');
      setValue('observaciones', item.observaciones || '');
    }
  }, [item, isEditing, setValue]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset({
        estado: 'bueno',
        disponibilidad: 'en_uso',
      });
    }
  }, [open, reset]);

  const onSubmit = async (data: ItemFormData) => {
    try {
      console.log('Enviando datos:', data); // Debug
      if (isEditing && itemId) {
        await updateMutation.mutateAsync({ id: itemId, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onClose();
    } catch (err: any) {
      console.error('Error al guardar ítem:', err);
      console.error('Detalle del error:', err.response?.data); // Mostrar detalles del backend

      // Mostrar errores de validación específicos
      const errorMsg = err.response?.data
        ? JSON.stringify(err.response.data, null, 2)
        : 'Error desconocido al guardar el ítem';

      alert(`Error al guardar el ítem:\n\n${errorMsg}`);
    }
  };

  const articulo_id = watch('articulo_id');
  const ubicacion_id = watch('ubicacion_id');
  const responsable_id = watch('responsable_id');
  const estado = watch('estado');
  const disponibilidad = watch('disponibilidad');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Ítem' : 'Crear Nuevo Ítem'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifica la información del ítem de inventario.'
              : 'Completa los datos para crear un nuevo ítem de inventario.'}
          </DialogDescription>
        </DialogHeader>

        {isLoadingItem && isEditing ? (
          <div className="py-8 text-center text-gray-500">Cargando datos del ítem...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Artículo */}
            <div className="space-y-2">
              <Label htmlFor="articulo_id">
                Artículo <span className="text-red-600">*</span>
              </Label>
              <Select
                value={articulo_id?.toString() || ''}
                onValueChange={(value) => setValue('articulo_id', parseInt(value))}
                disabled={isSubmitting}
              >
                <SelectTrigger id="articulo_id">
                  <SelectValue placeholder="Selecciona un artículo" />
                </SelectTrigger>
                <SelectContent>
                  {articulosData?.results.map((articulo) => (
                    <SelectItem key={articulo.id} value={articulo.id.toString()}>
                      {articulo.nombre} ({articulo.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.articulo_id && <p className="text-sm text-red-600">{errors.articulo_id.message}</p>}
            </div>

            {/* Ubicación */}
            <div className="space-y-2">
              <Label htmlFor="ubicacion_id">
                Ubicación <span className="text-red-600">*</span>
              </Label>
              <Select
                value={ubicacion_id?.toString() || ''}
                onValueChange={(value) => setValue('ubicacion_id', parseInt(value))}
                disabled={isSubmitting}
              >
                <SelectTrigger id="ubicacion_id">
                  <SelectValue placeholder="Selecciona una ubicación" />
                </SelectTrigger>
                <SelectContent>
                  {ubicacionesData?.results.map((ubicacion) => (
                    <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                      {ubicacion.nombre} ({ubicacion.sede.nombre})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ubicacion_id && <p className="text-sm text-red-600">{errors.ubicacion_id.message}</p>}
            </div>

            {/* Responsable */}
            <div className="space-y-2">
              <Label htmlFor="responsable_id">
                Responsable <span className="text-red-600">*</span>
              </Label>
              <Select
                value={responsable_id?.toString() || ''}
                onValueChange={(value) => setValue('responsable_id', parseInt(value))}
                disabled={isSubmitting}
              >
                <SelectTrigger id="responsable_id">
                  <SelectValue placeholder="Selecciona un responsable" />
                </SelectTrigger>
                <SelectContent>
                  {responsablesData?.results.map((responsable) => (
                    <SelectItem key={responsable.id} value={responsable.id.toString()}>
                      {responsable.nombre_completo} ({responsable.cargo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.responsable_id && <p className="text-sm text-red-600">{errors.responsable_id.message}</p>}
            </div>

            {/* Grid for Placa, Marca, Serial */}
            <div className="grid grid-cols-3 gap-4">
              {/* Placa */}
              <div className="space-y-2">
                <Label htmlFor="placa">Placa</Label>
                <Input
                  id="placa"
                  {...register('placa')}
                  placeholder="PLA-001"
                  disabled={isSubmitting}
                />
                {errors.placa && <p className="text-sm text-red-600">{errors.placa.message}</p>}
              </div>

              {/* Marca */}
              <div className="space-y-2">
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  {...register('marca')}
                  placeholder="HP, Dell, etc."
                  disabled={isSubmitting}
                />
                {errors.marca && <p className="text-sm text-red-600">{errors.marca.message}</p>}
              </div>

              {/* Serial */}
              <div className="space-y-2">
                <Label htmlFor="serial">Serial</Label>
                <Input
                  id="serial"
                  {...register('serial')}
                  placeholder="SN123456"
                  disabled={isSubmitting}
                />
                {errors.serial && <p className="text-sm text-red-600">{errors.serial.message}</p>}
              </div>
            </div>

            {/* Grid for Estado Físico y Disponibilidad */}
            <div className="grid grid-cols-2 gap-4">
              {/* Estado Físico */}
              <div className="space-y-2">
                <Label htmlFor="estado">
                  Estado Físico <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={estado || 'bueno'}
                  onValueChange={(value) => setValue('estado', value as EstadoFisico)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADO_FISICO.map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {e.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.estado && <p className="text-sm text-red-600">{errors.estado.message}</p>}
              </div>

              {/* Disponibilidad */}
              <div className="space-y-2">
                <Label htmlFor="disponibilidad">
                  Disponibilidad <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={disponibilidad || 'en_uso'}
                  onValueChange={(value) => setValue('disponibilidad', value as Disponibilidad)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="disponibilidad">
                    <SelectValue placeholder="Selecciona disponibilidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISPONIBILIDADES.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.disponibilidad && <p className="text-sm text-red-600">{errors.disponibilidad.message}</p>}
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                {...register('descripcion')}
                placeholder="Descripción opcional del ítem"
                disabled={isSubmitting}
              />
              {errors.descripcion && <p className="text-sm text-red-600">{errors.descripcion.message}</p>}
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Input
                id="observaciones"
                {...register('observaciones')}
                placeholder="Observaciones adicionales"
                disabled={isSubmitting}
              />
              {errors.observaciones && <p className="text-sm text-red-600">{errors.observaciones.message}</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
