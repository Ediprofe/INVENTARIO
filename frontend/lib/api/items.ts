/**
 * Cliente API para ítems del inventario.
 */
import { apiClient } from './client';
import type {
  IItem,
  IItemFilters,
  IItemCreateData,
  IItemUpdateData,
  IPaginatedResponse,
} from '@/types';

export const ItemsAPI = {
  /**
   * Listar ítems con filtros y paginación.
   */
  list: async (filters: IItemFilters = {}): Promise<IPaginatedResponse<IItem>> => {
    const response = await apiClient.get('/inventario/items/', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Obtener detalle de un ítem.
   */
  get: async (id: number): Promise<IItem> => {
    const response = await apiClient.get(`/inventario/items/${id}/`);
    return response.data;
  },

  /**
   * Crear nuevo ítem.
   */
  create: async (data: IItemCreateData): Promise<IItem> => {
    const response = await apiClient.post('/inventario/items/', data);
    return response.data;
  },

  /**
   * Actualizar ítem completo.
   */
  update: async (id: number, data: IItemCreateData): Promise<IItem> => {
    const response = await apiClient.put(`/inventario/items/${id}/`, data);
    return response.data;
  },

  /**
   * Actualizar ítem parcialmente.
   */
  partialUpdate: async (id: number, data: IItemUpdateData): Promise<IItem> => {
    const response = await apiClient.patch(`/inventario/items/${id}/`, data);
    return response.data;
  },

  /**
   * Eliminar ítem (soft delete).
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/inventario/items/${id}/`);
  },
};
