/**
 * TanStack Query hooks para ítems del inventario.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ItemsAPI } from '@/lib/api';
import type { IItem, IItemFilters, IItemCreateData, IItemUpdateData, IBatchUpdateRequest } from '@/types';

// Query keys
export const itemsKeys = {
  all: ['items'] as const,
  lists: () => [...itemsKeys.all, 'list'] as const,
  list: (filters: IItemFilters) => [...itemsKeys.lists(), filters] as const,
  details: () => [...itemsKeys.all, 'detail'] as const,
  detail: (id: number) => [...itemsKeys.details(), id] as const,
};

/**
 * Hook para obtener lista de ítems.
 */
export function useItems(filters: IItemFilters = {}) {
  return useQuery({
    queryKey: itemsKeys.list(filters),
    queryFn: () => ItemsAPI.list(filters),
  });
}

/**
 * Hook para obtener detalle de un ítem.
 */
export function useItem(id: number) {
  return useQuery({
    queryKey: itemsKeys.detail(id),
    queryFn: () => ItemsAPI.get(id),
    enabled: !!id,
  });
}

/**
 * Hook para crear un ítem.
 */
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IItemCreateData) => ItemsAPI.create(data),
    onSuccess: () => {
      // Invalidar todas las listas de ítems
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
    },
  });
}

/**
 * Hook para actualizar un ítem.
 */
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IItemUpdateData }) =>
      ItemsAPI.partialUpdate(id, data),
    onSuccess: (updatedItem) => {
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
      // Actualizar detalle específico
      queryClient.setQueryData(itemsKeys.detail(updatedItem.id), updatedItem);
    },
  });
}

/**
 * Hook para eliminar un ítem (soft delete).
 */
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ItemsAPI.delete(id),
    onSuccess: () => {
      // Invalidar todas las listas
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
    },
  });
}

/**
 * Hook para actualizar múltiples ítems (optimistic update).
 */
export function useBulkUpdateItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Array<{ id: number; data: IItemUpdateData }>) => {
      return Promise.all(
        updates.map(({ id, data }) => ItemsAPI.partialUpdate(id, data))
      );
    },
    onMutate: async () => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: itemsKeys.lists() });
    },
    onSuccess: () => {
      // Invalidar todas las listas
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
    },
  });
}

/**
 * Hook para actualizar múltiples ítems en lote (batch update endpoint).
 */
export function useBatchUpdateItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: IBatchUpdateRequest) => ItemsAPI.batchUpdate(request),
    onSuccess: () => {
      // Invalidar todas las listas de ítems
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
    },
  });
}
