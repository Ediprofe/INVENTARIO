/**
 * TanStack Query hooks para catálogos (sedes, ubicaciones, responsables, artículos).
 */
import { useQuery } from '@tanstack/react-query';
import { SedesAPI, UbicacionesAPI, ResponsablesAPI, ArticulosAPI } from '@/lib/api';
import type {
  ISedeFilters,
  IUbicacionFilters,
  IResponsableFilters,
  IArticuloFilters,
} from '@/types';

// ============================================================================
// Sedes
// ============================================================================

export const sedesKeys = {
  all: ['sedes'] as const,
  lists: () => [...sedesKeys.all, 'list'] as const,
  list: (filters: ISedeFilters) => [...sedesKeys.lists(), filters] as const,
};

export function useSedes(filters: ISedeFilters = { activo: true }) {
  return useQuery({
    queryKey: sedesKeys.list(filters),
    queryFn: () => SedesAPI.list(filters),
  });
}

// ============================================================================
// Ubicaciones
// ============================================================================

export const ubicacionesKeys = {
  all: ['ubicaciones'] as const,
  lists: () => [...ubicacionesKeys.all, 'list'] as const,
  list: (filters: IUbicacionFilters) => [...ubicacionesKeys.lists(), filters] as const,
};

export function useUbicaciones(filters: IUbicacionFilters = { activo: true }) {
  return useQuery({
    queryKey: ubicacionesKeys.list(filters),
    queryFn: () => UbicacionesAPI.list(filters),
  });
}

// ============================================================================
// Responsables
// ============================================================================

export const responsablesKeys = {
  all: ['responsables'] as const,
  lists: () => [...responsablesKeys.all, 'list'] as const,
  list: (filters: IResponsableFilters) => [...responsablesKeys.lists(), filters] as const,
};

export function useResponsables(filters: IResponsableFilters = { activo: true }) {
  return useQuery({
    queryKey: responsablesKeys.list(filters),
    queryFn: () => ResponsablesAPI.list(filters),
  });
}

// ============================================================================
// Artículos
// ============================================================================

export const articulosKeys = {
  all: ['articulos'] as const,
  lists: () => [...articulosKeys.all, 'list'] as const,
  list: (filters: IArticuloFilters) => [...articulosKeys.lists(), filters] as const,
};

export function useArticulos(filters: IArticuloFilters = { activo: true }) {
  return useQuery({
    queryKey: articulosKeys.list(filters),
    queryFn: () => ArticulosAPI.list(filters),
  });
}
