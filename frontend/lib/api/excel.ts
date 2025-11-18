/**
 * Cliente API para importación/exportación de Excel.
 */
import { apiClient } from './client';

export interface ImportResult {
  message: string;
  created: number;
  errors: number;
  created_items: Array<{
    row: number;
    codigo: string;
    id: number;
  }>;
  error_details: Array<{
    row: number;
    error: string | object;
  }>;
}

export const ExcelAPI = {
  /**
   * Importar ítems desde archivo Excel.
   */
  importItems: async (file: File): Promise<ImportResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/inventario/excel/import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Exportar ítems a Excel.
   */
  exportItems: async (filters?: Record<string, unknown>): Promise<Blob> => {
    const response = await apiClient.get('/inventario/excel/export/', {
      params: filters,
      responseType: 'blob',
    });

    return response.data;
  },

  /**
   * Descargar plantilla de importación.
   */
  downloadTemplate: async (): Promise<Blob> => {
    const response = await apiClient.get('/inventario/excel/template/', {
      responseType: 'blob',
    });

    return response.data;
  },
};

/**
 * Función helper para descargar un Blob como archivo.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
