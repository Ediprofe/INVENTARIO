'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { itemSchema, type ItemFormData } from '@/lib/schemas';
import { useCreateItem, useUpdateItem, useItem } from '@/lib/hooks';
import { useArticulos, useUbicaciones, useResponsables } from '@/lib/hooks/useCatalogos';
import type { EstadoFisico, Disponibilidad, IItemList } from '@/types';
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

interface ItemFormContentProps {
  initialData?: ItemFormData;
  isEditing: boolean;
  itemId?: number;
  onClose: () => void;
  articulos: any[];
  ubicaciones: any[];
  responsables: any[];
}

/**
 * Componente Presentacional del Formulario
 * Se renderiza SOLO cuando los datos están listos.
 * Usa defaultValues para inicialización robusta.
 */
function ItemFormContent({ 
  initialData, 
  isEditing, 
  itemId, 
  onClose,
  articulos,
  ubicaciones,
  responsables 
}: ItemFormContentProps) {
  // Mutations
  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: initialData || {
      articulo_id: undefined,
      ubicacion_id: undefined,
      responsable_id: null,
      placa: '',
      marca: '',
      serial: '',
      estado: 'bueno',
      disponibilidad: 'en_uso',
      descripcion: '',
      observaciones: '',
    },
  });

  const onSubmit = async (data: ItemFormData) => {
    try {
      console.log('Enviando datos:', data);
      if (isEditing && itemId) {
        await updateMutation.mutateAsync({ id: itemId, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onClose();
    } catch (err: any) {
      console.error('Error al guardar ítem:', err);
      const errorMsg = err.response?.data
        ? JSON.stringify(err.response.data, null, 2)
        : 'Error desconocido al guardar el ítem';
      alert(`Error al guardar el ítem:\n\n${errorMsg}`);
    }
  };

  // Watch values for controlled inputs
  const articulo_id = watch('articulo_id');
  const ubicacion_id = watch('ubicacion_id');
  const responsable_id = watch('responsable_id');
  const estado = watch('estado');
  const disponibilidad = watch('disponibilidad');

  return (
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
            {articulos.map((articulo) => (
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
          onValueChange={(value) => {
            const ubicacionId = parseInt(value);
            setValue('ubicacion_id', ubicacionId);
            
            // Autoasignar responsable de la ubicación
            const ubicacionSeleccionada = ubicaciones.find(u => u.id === ubicacionId);
            if (ubicacionSeleccionada?.responsable) {
              setValue('responsable_id', ubicacionSeleccionada.responsable);
            }
          }}
          disabled={isSubmitting}
        >
          <SelectTrigger id="ubicacion_id">
            <SelectValue placeholder="Selecciona una ubicación" />
          </SelectTrigger>
          <SelectContent>
            {ubicaciones.map((ubicacion) => (
              <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                {ubicacion.nombre} ({typeof ubicacion.sede === 'object' ? ubicacion.sede.nombre : ubicacion.sede})
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
            {responsables.map((responsable) => (
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
        <div className="space-y-2">
          <Label htmlFor="placa">Placa</Label>
          <Input id="placa" {...register('placa')} placeholder="PLA-001" disabled={isSubmitting} />
          {errors.placa && <p className="text-sm text-red-600">{errors.placa.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="marca">Marca</Label>
          <Input id="marca" {...register('marca')} placeholder="HP, Dell, etc." disabled={isSubmitting} />
          {errors.marca && <p className="text-sm text-red-600">{errors.marca.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="serial">Serial</Label>
          <Input id="serial" {...register('serial')} placeholder="SN123456" disabled={isSubmitting} />
          {errors.serial && <p className="text-sm text-red-600">{errors.serial.message}</p>}
        </div>
      </div>

      {/* Grid for Estado Físico y Disponibilidad */}
      <div className="grid grid-cols-2 gap-4">
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

      {/* Descripción y Observaciones */}
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Input id="descripcion" {...register('descripcion')} placeholder="Descripción opcional" disabled={isSubmitting} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Input id="observaciones" {...register('observaciones')} placeholder="Observaciones adicionales" disabled={isSubmitting} />
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
  );
}

interface ItemFormDialogProps {
  open: boolean;
  onClose: () => void;
  itemId?: number | null;
}

/**
 * Componente Contenedor (Container)
 * Maneja SOLO la lógica de carga de datos y estado del diálogo.
 * Delega el renderizado del formulario a ItemFormContent.
 */
export function ItemFormDialog({ open, onClose, itemId }: ItemFormDialogProps) {
  const isEditing = !!itemId;

  // Queries
  // Solo ejecutar query de item si estamos editando y el modal está abierto
  const { data: item, isLoading: isLoadingItem } = useItem(itemId || 0);
  const { data: articulosData, isLoading: isLoadingArticulos } = useArticulos();
  const { data: ubicacionesData, isLoading: isLoadingUbicaciones } = useUbicaciones();
  const { data: responsablesData, isLoading: isLoadingResponsables } = useResponsables();

  // Preparar datos iniciales si estamos editando
  const getInitialData = (): ItemFormData | undefined => {
    if (!item) return undefined;
    
    return {
      articulo_id: item.articulo.id,
      ubicacion_id: item.ubicacion.id,
      responsable_id: item.responsable?.id || null,
      placa: item.placa || '',
      marca: item.marca || '',
      serial: item.serial || '',
      estado: item.estado,
      disponibilidad: item.disponibilidad,
      descripcion: item.descripcion || '',
      observaciones: item.observaciones || '',
    };
  };

  // Determinar si todo está listo para renderizar
  const isDataReady = () => {
    // Siempre necesitamos los catálogos
    if (!articulosData?.results || !ubicacionesData?.results || !responsablesData?.results) {
      return false;
    }
    
    // Si es edición, necesitamos el item cargado
    if (isEditing && !item) {
      return false;
    }

    return true;
  };

  const isLoading = 
    isLoadingArticulos || 
    isLoadingUbicaciones || 
    isLoadingResponsables || 
    (isEditing && isLoadingItem);

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

        {!isDataReady() ? (
          <div className="py-8 text-center text-gray-500">
            {isLoading ? 'Cargando datos...' : 'Preparando formulario...'}
          </div>
        ) : (
          <ItemFormContent 
            initialData={isEditing ? getInitialData() : undefined}
            isEditing={isEditing}
            itemId={itemId || undefined}
            onClose={onClose}
            articulos={articulosData?.results || []}
            ubicaciones={ubicacionesData?.results || []}
            responsables={responsablesData?.results || []}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
