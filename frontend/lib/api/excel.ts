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

export interface ResetImportResult {
  success: boolean;
  stats: {
    items_eliminados: number;
    items_creados: number;
    sedes_creadas: number;
    ubicaciones_creadas: number;
    articulos_creados: number;
    responsables_creados: number;
  };
  errors: string[];
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

  /**
   * Resetear e importar inventario completo desde Excel multi-hoja.
   */
  resetImport: async (file: File): Promise<ResetImportResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/inventario/excel/reset-import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutos de timeout para operaciones muy masivas
    });

    return response.data;
  },

  /**
   * Descargar plantilla de reseteo e importación completa.
   */
  downloadResetTemplate: async (): Promise<Blob> => {
    const response = await apiClient.get('/inventario/excel/reset-template/', {
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
