'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { BatchEditSpreadsheet, type BatchEditRow } from './BatchEditSpreadsheet';
import { useArticulos, useUbicaciones, useSedes, useResponsables } from '@/lib/hooks/useCatalogos';
import { useCreateItem } from '@/lib/hooks/useItems';
import type { IItemCreateData } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  formatArticuloLabel,
  formatSedeLabel,
  formatUbicacionLabel,
  sortArticulos,
  sortSedes,
  sortUbicaciones,
  sortResponsables,
} from '@/lib/catalogs';

const bulkCreateSchema = z.object({
  articulo_id: z.number({
    message: 'El artículo es requerido',
  }),
  cantidad: z
    .number({
      message: 'La cantidad es requerida',
    })
    .min(1, 'La cantidad debe ser al menos 1')
    .max(100, 'La cantidad máxima es 100'),
  sede_id: z.number({
    message: 'La sede es requerida',
  }),
  ubicacion_id: z.number({
    message: 'La ubicación es requerida',
  }),
});

type BulkCreateFormData = z.infer<typeof bulkCreateSchema>;

interface BulkCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

export function BulkCreateDialog({ open, onClose }: BulkCreateDialogProps) {
  const [step, setStep] = useState<'config' | 'spreadsheet' | 'result'>('config');
  const [rows, setRows] = useState<BatchEditRow[]>([]);
  const [config, setConfig] = useState<BulkCreateFormData | null>(null);
  const [result, setResult] = useState<{
    success: number;
    errors: Array<{ index: number; error: string }>;
  } | null>(null);

  // Queries - se obtienen todos los registros para mantener filtros consistentes con el backend
  const { data: articulosData, isLoading: isLoadingArticulos } = useArticulos();
  const { data: sedesData, isLoading: isLoadingSedes } = useSedes();
  const { data: ubicacionesData, isLoading: isLoadingUbicaciones } = useUbicaciones();
  const { data: responsablesData, isLoading: isLoadingResponsables } = useResponsables();
  const createMutation = useCreateItem();

  const articulosOptions = useMemo(
    () => sortArticulos(articulosData?.results ?? []),
    [articulosData]
  );
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

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<BulkCreateFormData>({
    resolver: zodResolver(bulkCreateSchema),
    defaultValues: {
      articulo_id: undefined,
      cantidad: undefined,
      sede_id: undefined,
      ubicacion_id: undefined,
    },
  });

  const articulo_id = watch('articulo_id');
  const cantidad = watch('cantidad');
  const sede_id = watch('sede_id');
  const ubicacion_id = watch('ubicacion_id');

  // Filtrar ubicaciones por sede seleccionada
  const filteredUbicaciones = 
    sede_id && ubicacionesOptions.length > 0
      ? ubicacionesOptions.filter((ubicacion) => {
          if (!ubicacion.sede) return false;
          const ubicacionSedeId = typeof ubicacion.sede === 'object' ? ubicacion.sede.id : ubicacion.sede;
          return ubicacionSedeId === sede_id || ubicacionSedeId === Number(sede_id);
        })
      : [];


  const onConfigSubmit = (data: BulkCreateFormData) => {
    setConfig(data);

    // Obtener el responsable por defecto de la ubicación seleccionada
    const ubicacion = ubicacionesData?.results?.find((u) => u.id === data.ubicacion_id);
    const responsable_id = ubicacion?.responsable || undefined;

    // Crear filas para el spreadsheet
    const newRows: BatchEditRow[] = Array.from({ length: data.cantidad }, (_, index) => ({
      selected: false,
      codigo: `Nuevo-${index + 1}`,
      placa: '',
      marca: '',
      serial: '',
      estado: 'bueno',
      disponibilidad: 'en_uso',
      ubicacion_id: data.ubicacion_id,
      responsable_id: responsable_id,
      descripcion: '',
      observaciones: '',
    }));

    setRows(newRows);
    setStep('spreadsheet');
  };

  const handleSpreadsheetSave = async (updatedRows: BatchEditRow[]) => {
    if (!config) return;

    const createdItems: number[] = [];
    const errorItems: Array<{ index: number; error: string }> = [];

    // Crear cada ítem
    // El ubicacion_id y responsable_id ya vienen en cada row, y pueden haber sido modificados
    // en el spreadsheet usando las acciones en lote
    for (let i = 0; i < updatedRows.length; i++) {
      const row = updatedRows[i];
      try {
        const itemData: IItemCreateData = {
          articulo_id: config.articulo_id,
          ubicacion_id: row.ubicacion_id || config.ubicacion_id,
          responsable_id: row.responsable_id,
          placa: row.placa || undefined,
          marca: row.marca || undefined,
          serial: row.serial || undefined,
          estado: row.estado,
          disponibilidad: row.disponibilidad,
          descripcion: row.descripcion || undefined,
          observaciones: row.observaciones || undefined,
        };

        console.log('📝 Creando ítem:', itemData);
        await createMutation.mutateAsync(itemData);
        createdItems.push(i + 1);
      } catch (error: any) {
        console.error('❌ Error al crear ítem #' + (i + 1) + ':', error.response?.data);
        const errorMsg = error.response?.data
          ? JSON.stringify(error.response.data)
          : 'Error al crear el ítem';
        errorItems.push({
          index: i + 1,
          error: errorMsg,
        });
      }
    }

    setResult({
      success: createdItems.length,
      errors: errorItems,
    });
    setStep('result');
  };

  const handleSpreadsheetCancel = () => {
    setStep('config');
    setRows([]);
  };

  const handleClose = () => {
    setStep('config');
    setRows([]);
    setConfig(null);
    setResult(null);
    reset({
      articulo_id: undefined,
      cantidad: undefined,
      sede_id: undefined,
      ubicacion_id: undefined,
    });
    onClose();
  };

  const handleBackToConfig = () => {
    setStep('config');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={step === 'spreadsheet' ? 'max-w-[95vw] max-h-[90vh] p-0' : 'max-w-2xl'}>
        {step === 'config' && (
          <>
            <DialogHeader>
              <DialogTitle>Alta Masiva de Artículos</DialogTitle>
              <DialogDescription>
                Selecciona el artículo, cantidad y ubicación para crear múltiples ítems de inventario.
              </DialogDescription>
            </DialogHeader>

            {(isLoadingArticulos || isLoadingSedes || isLoadingUbicaciones || isLoadingResponsables) ? (
              <div className="py-8 text-center text-gray-500">
                <p>Cargando catálogos...</p>
                <p className="text-xs mt-2">
                  {isLoadingArticulos && '• Artículos '}
                  {isLoadingSedes && '• Sedes '}
                  {isLoadingUbicaciones && '• Ubicaciones '}
                  {isLoadingResponsables && '• Responsables'}
                </p>
              </div>
            ) : (
            <form onSubmit={handleSubmit(onConfigSubmit)} className="space-y-4">
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
                    {articulosOptions.map((articulo) => (
                      <SelectItem key={articulo.id} value={articulo.id.toString()}>
                        {formatArticuloLabel(articulo)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.articulo_id && <p className="text-sm text-red-600">{errors.articulo_id.message}</p>}
              </div>

              {/* Cantidad */}
              <div className="space-y-2">
                <Label htmlFor="cantidad">
                  Cantidad de unidades <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="cantidad"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="¿Cuántas unidades?"
                  {...register('cantidad', { valueAsNumber: true })}
                  disabled={isSubmitting}
                />
                {errors.cantidad && <p className="text-sm text-red-600">{errors.cantidad.message}</p>}
                <p className="text-xs text-gray-500">
                  Después podrás editar los detalles de cada ítem individualmente.
                </p>
              </div>

              {/* Sede */}
              <div className="space-y-2">
                <Label htmlFor="sede_id">
                  Sede <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={sede_id?.toString() || ''}
                  onValueChange={(value) => {
                    const sedeIdNumber = parseInt(value, 10);
                    setValue('sede_id', sedeIdNumber, { shouldValidate: true });
                    setValue('ubicacion_id', undefined as any); // Reset ubicación
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="sede_id">
                    <SelectValue placeholder="Selecciona una sede" />
                  </SelectTrigger>
                  <SelectContent>
                    {sedesOptions.map((sede) => (
                      <SelectItem key={sede.id} value={sede.id.toString()}>
                        {formatSedeLabel(sede)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sede_id && <p className="text-sm text-red-600">{errors.sede_id.message}</p>}
              </div>

              {/* Ubicación */}
              <div className="space-y-2">
                <Label htmlFor="ubicacion_id">
                  Ubicación <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={ubicacion_id?.toString() || ''}
                  onValueChange={(value) => setValue('ubicacion_id', parseInt(value))}
                  disabled={isSubmitting || !sede_id || isLoadingUbicaciones}
                >
                  <SelectTrigger id="ubicacion_id">
                    <SelectValue 
                      placeholder={
                        !sede_id 
                          ? 'Primero selecciona una sede' 
                          : isLoadingUbicaciones 
                          ? 'Cargando ubicaciones...' 
                          : 'Selecciona una ubicación'
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingUbicaciones ? (
                      <div className="p-2 text-sm text-gray-500 text-center">Cargando...</div>
                    ) : filteredUbicaciones.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500 text-center">
                        {sede_id 
                          ? 'No hay ubicaciones disponibles para esta sede' 
                          : 'Selecciona una sede primero'
                        }
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
                {errors.ubicacion_id && <p className="text-sm text-red-600">{errors.ubicacion_id.message}</p>}
                {sede_id && !isLoadingUbicaciones && filteredUbicaciones.length > 0 && (
                  <p className="text-xs text-gray-500">
                    {filteredUbicaciones.length} {filteredUbicaciones.length === 1 ? 'ubicación disponible' : 'ubicaciones disponibles'}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Procesando...' : 'Continuar a Edición'}
                </Button>
              </DialogFooter>
            </form>
            )}
          </>
        )}

        {step === 'spreadsheet' && (
          <>
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Edita los detalles de cada ítem</DialogTitle>
              <DialogDescription>
                Completa la información de cada uno de los {rows.length} ítems que vas a crear.
              </DialogDescription>
            </DialogHeader>
            <BatchEditSpreadsheet
              items={rows}
              onSave={handleSpreadsheetSave}
              onCancel={handleSpreadsheetCancel}
              ubicaciones={ubicacionesOptions}
              responsables={responsablesOptions}
            />
          </>
        )}

        {step === 'result' && result && (
          <>
            <DialogHeader>
              <DialogTitle>Resultado de la creación masiva</DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <Alert variant={result.errors.length > 0 ? 'destructive' : 'default'}>
                <AlertTitle>Proceso completado</AlertTitle>
                <AlertDescription>
                  {result.success > 0 && (
                    <p className="text-green-600 font-semibold">
                      ✓ {result.success} ítems creados correctamente
                    </p>
                  )}
                  {result.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-red-600 font-semibold">✗ {result.errors.length} errores</p>
                      <ul className="text-sm space-y-1 mt-2">
                        {result.errors.map((error, idx) => (
                          <li key={idx} className="text-red-600">
                            Ítem #{error.index}: {error.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </Alert>

              <DialogFooter>
                {result.errors.length > 0 && (
                  <Button variant="outline" onClick={handleBackToConfig}>
                    Volver a Configuración
                  </Button>
                )}
                <Button onClick={handleClose}>
                  {result.errors.length > 0 ? 'Cerrar' : 'Finalizar'}
                </Button>
              </DialogFooter>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

