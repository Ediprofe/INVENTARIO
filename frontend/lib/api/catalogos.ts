/**
 * Cliente API para catálogos (sedes, ubicaciones, responsables, artículos).
 */
import { apiClient } from './client';
import type {
  ISede,
  ISedeFilters,
  IUbicacion,
  IUbicacionFilters,
  IResponsable,
  IResponsableFilters,
  IArticulo,
  IArticuloFilters,
  IPaginatedResponse,
} from '@/types';

// ============================================================================
// Sedes API
// ============================================================================

export const SedesAPI = {
  list: async (filters: ISedeFilters = {}): Promise<IPaginatedResponse<ISede>> => {
    const response = await apiClient.get('/inventario/sedes/', { params: filters });
    return response.data;
  },

  get: async (id: number): Promise<ISede> => {
    const response = await apiClient.get(`/inventario/sedes/${id}/`);
    return response.data;
  },

  create: async (data: Partial<ISede>): Promise<ISede> => {
    const response = await apiClient.post('/inventario/sedes/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<ISede>): Promise<ISede> => {
    const response = await apiClient.put(`/inventario/sedes/${id}/`, data);
    return response.data;
  },

  partialUpdate: async (id: number, data: Partial<ISede>): Promise<ISede> => {
    const response = await apiClient.patch(`/inventario/sedes/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/inventario/sedes/${id}/`);
  },
};

// ============================================================================
// Ubicaciones API
// ============================================================================

export const UbicacionesAPI = {
  list: async (filters: IUbicacionFilters = {}): Promise<IPaginatedResponse<IUbicacion>> => {
    const response = await apiClient.get('/inventario/ubicaciones/', { params: filters });
    return response.data;
  },

  get: async (id: number): Promise<IUbicacion> => {
    const response = await apiClient.get(`/inventario/ubicaciones/${id}/`);
    return response.data;
  },

  create: async (data: Partial<IUbicacion>): Promise<IUbicacion> => {
    const response = await apiClient.post('/inventario/ubicaciones/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<IUbicacion>): Promise<IUbicacion> => {
    const response = await apiClient.put(`/inventario/ubicaciones/${id}/`, data);
    return response.data;
  },

  partialUpdate: async (id: number, data: Partial<IUbicacion>): Promise<IUbicacion> => {
    const response = await apiClient.patch(`/inventario/ubicaciones/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/inventario/ubicaciones/${id}/`);
  },
};

// ============================================================================
// Responsables API
// ============================================================================

export const ResponsablesAPI = {
  list: async (filters: IResponsableFilters = {}): Promise<IPaginatedResponse<IResponsable>> => {
    const response = await apiClient.get('/inventario/responsables/', { params: filters });
    return response.data;
  },

  get: async (id: number): Promise<IResponsable> => {
    const response = await apiClient.get(`/inventario/responsables/${id}/`);
    return response.data;
  },

  create: async (data: Partial<IResponsable>): Promise<IResponsable> => {
    const response = await apiClient.post('/inventario/responsables/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<IResponsable>): Promise<IResponsable> => {
    const response = await apiClient.put(`/inventario/responsables/${id}/`, data);
    return response.data;
  },

  partialUpdate: async (id: number, data: Partial<IResponsable>): Promise<IResponsable> => {
    const response = await apiClient.patch(`/inventario/responsables/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/inventario/responsables/${id}/`);
  },
};

// ============================================================================
// Artículos API
// ============================================================================

export const ArticulosAPI = {
  list: async (filters: IArticuloFilters = {}): Promise<IPaginatedResponse<IArticulo>> => {
    const response = await apiClient.get('/inventario/articulos/', { params: filters });
    return response.data;
  },

  get: async (id: number): Promise<IArticulo> => {
    const response = await apiClient.get(`/inventario/articulos/${id}/`);
    return response.data;
  },

  create: async (data: Partial<IArticulo>): Promise<IArticulo> => {
    const response = await apiClient.post('/inventario/articulos/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<IArticulo>): Promise<IArticulo> => {
    const response = await apiClient.put(`/inventario/articulos/${id}/`, data);
    return response.data;
  },

  partialUpdate: async (id: number, data: Partial<IArticulo>): Promise<IArticulo> => {
    const response = await apiClient.patch(`/inventario/articulos/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/inventario/articulos/${id}/`);
  },
};
