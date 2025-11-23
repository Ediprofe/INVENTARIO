/**
 * TanStack Query hooks para estadísticas del inventario.
 */
import { useQuery } from '@tanstack/react-query';
import { StatsAPI } from '@/lib/api/stats';
import type {
  IUbicacionStats,
  IResponsableStats,
  IArticulosStatsResponse,
} from '@/types';

/**
 * Hook para obtener estadísticas por ubicación.
 */
export function useUbicacionStats(
  ubicacionId: number | null,
  params?: { page?: number; page_size?: number }
) {
  return useQuery<IUbicacionStats>({
    queryKey: ['stats', 'ubicacion', ubicacionId, params],
    queryFn: () => StatsAPI.porUbicacion(ubicacionId!, params),
    enabled: !!ubicacionId,
  });
}

/**
 * Hook para obtener estadísticas por responsable.
 */
export function useResponsableStats(
  responsableId: number | null,
  params?: { page?: number; page_size?: number }
) {
  return useQuery<IResponsableStats>({
    queryKey: ['stats', 'responsable', responsableId, params],
    queryFn: () => StatsAPI.porResponsable(responsableId!, params),
    enabled: !!responsableId,
  });
}

/**
 * Hook para obtener estadísticas por artículo (matriz de sedes).
 */
export function useArticuloStats() {
  return useQuery<IArticulosStatsResponse>({
    queryKey: ['stats', 'articulo'],
    queryFn: () => StatsAPI.porArticulo(),
  });
}

