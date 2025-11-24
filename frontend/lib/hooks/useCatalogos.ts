/**
 * TanStack Query hooks para catálogos (sedes, ubicaciones, responsables, artículos).
 */
import { useQuery } from '@tanstack/react-query';
import { SedesAPI, UbicacionesAPI, ResponsablesAPI, ArticulosAPI } from '@/lib/api';
import { fetchAllPages } from '@/lib/api/helpers';
import type {
  ISedeFilters,
  IUbicacionFilters,
  IResponsableFilters,
  IArticuloFilters,
} from '@/types';

interface CatalogHookOptions {
  fetchAll?: boolean;
  pageSize?: number;
}

const EMPTY_SEDE_FILTERS: ISedeFilters = {};
const EMPTY_UBICACION_FILTERS: IUbicacionFilters = {};
const EMPTY_RESPONSABLE_FILTERS: IResponsableFilters = {};
const EMPTY_ARTICULO_FILTERS: IArticuloFilters = {};

// ============================================================================
// Sedes
// ============================================================================

export const sedesKeys = {
  all: ['sedes'] as const,
  lists: () => [...sedesKeys.all, 'list'] as const,
  list: (scope: string, filters: ISedeFilters, pageSize?: number) =>
    [...sedesKeys.lists(), scope, pageSize ?? null, filters] as const,
};

export function useSedes(filters?: ISedeFilters, options: CatalogHookOptions = {}) {
  const params = (filters ?? EMPTY_SEDE_FILTERS) as ISedeFilters;
  const fetchAll = options.fetchAll ?? true;
  const scope = fetchAll ? 'all' : 'page';

  return useQuery({
    queryKey: sedesKeys.list(scope, params, options.pageSize),
    queryFn: () =>
      fetchAll
        ? fetchAllPages(SedesAPI.list, params, { pageSize: options.pageSize })
        : SedesAPI.list(params),
  });
}

// ============================================================================
// Ubicaciones
// ============================================================================

export const ubicacionesKeys = {
  all: ['ubicaciones'] as const,
  lists: () => [...ubicacionesKeys.all, 'list'] as const,
  list: (scope: string, filters: IUbicacionFilters, pageSize?: number) =>
    [...ubicacionesKeys.lists(), scope, pageSize ?? null, filters] as const,
};

export function useUbicaciones(filters?: IUbicacionFilters, options: CatalogHookOptions = {}) {
  const params = (filters ?? EMPTY_UBICACION_FILTERS) as IUbicacionFilters;
  const fetchAll = options.fetchAll ?? true;
  const scope = fetchAll ? 'all' : 'page';

  return useQuery({
    queryKey: ubicacionesKeys.list(scope, params, options.pageSize),
    queryFn: () =>
      fetchAll
        ? fetchAllPages(UbicacionesAPI.list, params, { pageSize: options.pageSize })
        : UbicacionesAPI.list(params),
  });
}

// ============================================================================
// Responsables
// ============================================================================

export const responsablesKeys = {
  all: ['responsables'] as const,
  lists: () => [...responsablesKeys.all, 'list'] as const,
  list: (scope: string, filters: IResponsableFilters, pageSize?: number) =>
    [...responsablesKeys.lists(), scope, pageSize ?? null, filters] as const,
};

export function useResponsables(filters?: IResponsableFilters, options: CatalogHookOptions = {}) {
  const params = (filters ?? EMPTY_RESPONSABLE_FILTERS) as IResponsableFilters;
  const fetchAll = options.fetchAll ?? true;
  const scope = fetchAll ? 'all' : 'page';

  return useQuery({
    queryKey: responsablesKeys.list(scope, params, options.pageSize),
    queryFn: () =>
      fetchAll
        ? fetchAllPages(ResponsablesAPI.list, params, { pageSize: options.pageSize })
        : ResponsablesAPI.list(params),
  });
}

// ============================================================================
// Artículos
// ============================================================================

export const articulosKeys = {
  all: ['articulos'] as const,
  lists: () => [...articulosKeys.all, 'list'] as const,
  list: (scope: string, filters: IArticuloFilters, pageSize?: number) =>
    [...articulosKeys.lists(), scope, pageSize ?? null, filters] as const,
};

export function useArticulos(filters?: IArticuloFilters, options: CatalogHookOptions = {}) {
  const params = (filters ?? EMPTY_ARTICULO_FILTERS) as IArticuloFilters;
  const fetchAll = options.fetchAll ?? true;
  const scope = fetchAll ? 'all' : 'page';

  return useQuery({
    queryKey: articulosKeys.list(scope, params, options.pageSize),
    queryFn: () =>
      fetchAll
        ? fetchAllPages(ArticulosAPI.list, params, { pageSize: options.pageSize })
        : ArticulosAPI.list(params),
  });
}
