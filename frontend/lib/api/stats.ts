/**
 * Cliente API para estadísticas del inventario.
 */
import { apiClient } from './client';
import type {
  IUbicacionStats,
  IResponsableStats,
  IArticulosStatsResponse,
} from '@/types';

/**
 * API para consultas estadísticas del inventario.
 */
export const StatsAPI = {
  /**
   * Obtener estadísticas de inventario por ubicación.
   */
  porUbicacion: async (
    ubicacionId: number,
    params?: { page?: number; page_size?: number }
  ): Promise<IUbicacionStats> => {
    const response = await apiClient.get(
      `/inventario/stats/por-ubicacion/${ubicacionId}/`,
      { params }
    );
    return response.data;
  },

  /**
   * Obtener estadísticas de inventario por responsable.
   */
  porResponsable: async (
    responsableId: number,
    params?: { page?: number; page_size?: number }
  ): Promise<IResponsableStats> => {
    const response = await apiClient.get(
      `/inventario/stats/por-responsable/${responsableId}/`,
      { params }
    );
    return response.data;
  },

  /**
   * Obtener estadísticas de inventario por artículo (matriz de sedes).
   * 
   * @param filters - Filtros opcionales (disponibilidad, estado)
   */
  porArticulo: async (filters?: { disponibilidad?: string; estado?: string }): Promise<IArticulosStatsResponse> => {
    const response = await apiClient.get('/inventario/stats/por-articulo/', { params: filters });
    return response.data;
  },
};

