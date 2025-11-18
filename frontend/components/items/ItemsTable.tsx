'use client';

import { useState } from 'react';
import { useItems, useDeleteItem, useExportItems, useDownloadTemplate } from '@/lib/hooks';
import { useSedes, useUbicaciones } from '@/lib/hooks/useCatalogos';
import type { IItemFilters, EstadoItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ESTADOS: Array<{ value: EstadoItem; label: string }> = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'mantenimiento', label: 'En Mantenimiento' },
  { value: 'dado_baja', label: 'Dado de Baja' },
  { value: 'extraviado', label: 'Extraviado' },
  { value: 'reparacion', label: 'En Reparación' },
];

interface ItemsTableProps {
  onCreateClick?: () => void;
  onEditClick?: (itemId: number) => void;
  onImportClick?: () => void;
  onBatchEditClick?: (selectedIds: number[]) => void;
}

export function ItemsTable({ onCreateClick, onEditClick, onImportClick, onBatchEditClick }: ItemsTableProps) {
  // Filtros state
  const [filters, setFilters] = useState<IItemFilters>({
    page: 1,
    page_size: 50,
    ordering: '-created_at',
  });

  // Selected items state
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Queries
  const { data, isLoading, isError, error } = useItems(filters);
  const { data: sedesData } = useSedes();
  const { data: ubicacionesData } = useUbicaciones();
  const deleteMutation = useDeleteItem();

  // Excel mutations
  const exportMutation = useExportItems();
  const templateMutation = useDownloadTemplate();

  // Excel handlers
  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync(filters as Record<string, unknown>);
    } catch (err) {
      console.error('Error al exportar:', err);
      alert('Error al exportar ítems');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await templateMutation.mutateAsync();
    } catch (err) {
      console.error('Error al descargar plantilla:', err);
      alert('Error al descargar plantilla');
    }
  };

  // Handlers
  const handleFilterChange = (key: keyof IItemFilters, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handleDelete = async (id: number, codigo: string) => {
    if (confirm(`¿Estás seguro de eliminar el ítem ${codigo}?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Error al eliminar ítem:', err);
        alert('Error al eliminar el ítem');
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    setSelectedIds([]); // Reset selection when changing pages
  };

  // Checkbox handlers
  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true && data) {
      setSelectedIds(data.results.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (itemId: number, checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedIds((prev) => [...prev, itemId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const handleBatchEdit = () => {
    if (selectedIds.length > 0 && onBatchEditClick) {
      onBatchEditClick(selectedIds);
    }
  };

  // Calculate pagination
  const totalPages = data ? Math.ceil(data.count / (filters.page_size || 50)) : 0;
  const currentPage = filters.page || 1;

  // Check if all items on current page are selected
  const allSelected = data ? data.results.length > 0 && data.results.every((item) => selectedIds.includes(item.id)) : false;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Ítems de Inventario</CardTitle>
            <CardDescription>
              {data && `${data.count} ítems en total`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {selectedIds.length > 0 && (
              <Button variant="default" size="sm" onClick={handleBatchEdit}>
                Editar Seleccionados ({selectedIds.length})
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate} disabled={templateMutation.isPending}>
              {templateMutation.isPending ? 'Descargando...' : 'Plantilla'}
            </Button>
            <Button variant="outline" size="sm" onClick={onImportClick}>
              Importar
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={exportMutation.isPending}>
              {exportMutation.isPending ? 'Exportando...' : 'Exportar'}
            </Button>
            <Button onClick={onCreateClick}>Crear Ítem</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              placeholder="Código, artículo, ubicación..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sede">Sede</Label>
            <Select
              value={filters.sede?.toString() || ''}
              onValueChange={(value) => handleFilterChange('sede', value ? parseInt(value) : undefined)}
            >
              <SelectTrigger id="sede">
                <SelectValue placeholder="Todas las sedes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las sedes</SelectItem>
                {sedesData?.results.map((sede) => (
                  <SelectItem key={sede.id} value={sede.id.toString()}>
                    {sede.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ubicacion">Ubicación</Label>
            <Select
              value={filters.ubicacion?.toString() || ''}
              onValueChange={(value) => handleFilterChange('ubicacion', value ? parseInt(value) : undefined)}
            >
              <SelectTrigger id="ubicacion">
                <SelectValue placeholder="Todas las ubicaciones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las ubicaciones</SelectItem>
                {ubicacionesData?.results.map((ubicacion) => (
                  <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                    {ubicacion.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={filters.estado || ''}
              onValueChange={(value) => handleFilterChange('estado', value as EstadoItem || undefined)}
            >
              <SelectTrigger id="estado">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                {ESTADOS.map((estado) => (
                  <SelectItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="py-8 text-center text-gray-500">
            Cargando ítems...
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="py-8 text-center text-red-600">
            Error al cargar ítems: {error instanceof Error ? error.message : 'Error desconocido'}
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && data && (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Seleccionar todos"
                      />
                    </TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Artículo</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Valor Unit.</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.results.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-gray-500">
                        No se encontraron ítems
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.results.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(item.id)}
                            onCheckedChange={(checked) => handleSelectItem(item.id, checked)}
                            aria-label={`Seleccionar ${item.codigo}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{item.codigo}</TableCell>
                        <TableCell>{item.articulo.nombre}</TableCell>
                        <TableCell>{item.ubicacion.nombre}</TableCell>
                        <TableCell>{item.responsable.nombre_completo}</TableCell>
                        <TableCell className="text-right">{item.cantidad}</TableCell>
                        <TableCell className="text-right">
                          ${parseFloat(item.valor_unitario).toLocaleString('es-CO')}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              item.estado === 'activo'
                                ? 'bg-green-100 text-green-800'
                                : item.estado === 'mantenimiento'
                                ? 'bg-yellow-100 text-yellow-800'
                                : item.estado === 'dado_baja'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {ESTADOS.find((e) => e.value === item.estado)?.label || item.estado}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEditClick?.(item.id)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(item.id, item.codigo)}
                              disabled={deleteMutation.isPending}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
