/**
 * TanStack Query hooks para importación/exportación de Excel.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExcelAPI, downloadBlob } from '@/lib/api';
import { itemsKeys } from './useItems';

/**
 * Hook para importar ítems desde Excel.
 */
export function useImportItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => ExcelAPI.importItems(file),
    onSuccess: () => {
      // Invalidar todas las listas de ítems
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
    },
  });
}

/**
 * Hook para exportar ítems a Excel.
 */
export function useExportItems() {
  return useMutation({
    mutationFn: (filters?: Record<string, unknown>) => ExcelAPI.exportItems(filters),
    onSuccess: (blob) => {
      const filename = `inventario_${new Date().toISOString().split('T')[0]}.xlsx`;
      downloadBlob(blob, filename);
    },
  });
}

/**
 * Hook para descargar plantilla de importación.
 */
export function useDownloadTemplate() {
  return useMutation({
    mutationFn: () => ExcelAPI.downloadTemplate(),
    onSuccess: (blob) => {
      downloadBlob(blob, 'plantilla_importacion.xlsx');
    },
  });
}

/**
 * Hook para resetear e importar inventario completo.
 */
export function useResetImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => ExcelAPI.resetImport(file),
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con inventario
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['catalogos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

/**
 * Hook para descargar plantilla de reseteo e importación completa.
 */
export function useDownloadResetTemplate() {
  return useMutation({
    mutationFn: () => ExcelAPI.downloadResetTemplate(),
    onSuccess: (blob) => {
      downloadBlob(blob, 'plantilla_reseteo_inventario.xlsx');
    },
  });
}
