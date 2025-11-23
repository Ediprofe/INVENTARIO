'use client';

import { useState } from 'react';
import { useItems, useDeleteItem, useExportItems, useDownloadTemplate } from '@/lib/hooks';
import { useSedes, useUbicaciones, useResponsables, useArticulos } from '@/lib/hooks/useCatalogos';
import type { IItemFilters, EstadoFisico, Disponibilidad, IItemList } from '@/types';
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

const ESTADO_FISICO: Array<{ value: EstadoFisico; label: string }> = [
  { value: 'bueno', label: 'Bueno' },
  { value: 'regular', label: 'Regular' },
  { value: 'malo', label: 'Malo' },
];

const DISPONIBILIDADES: Array<{ value: Disponibilidad; label: string }> = [
  { value: 'en_uso', label: 'En uso' },
  { value: 'en_reparacion', label: 'En reparación' },
  { value: 'extraviado', label: 'Extraviado' },
  { value: 'de_baja', label: 'De baja' },
];

interface ItemsTableProps {
  onCreateClick?: () => void;
  onEditClick?: (itemId: number) => void;
  onImportClick?: () => void;
  onBatchEditClick?: (selectedIds: number[]) => void;
  onBulkCreateClick?: () => void;
}

export function ItemsTable({ 
  onCreateClick, 
  onEditClick, 
  onImportClick, 
  onBatchEditClick,
  onBulkCreateClick 
}: ItemsTableProps) {
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
  const { data: responsablesData } = useResponsables();
  const { data: articulosData } = useArticulos();
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
    const confirmed = confirm(
      `¿Estás seguro de dar de baja el ítem ${codigo}?\n\n` +
      `El ítem no se eliminará físicamente, sino que cambiará su disponibilidad a "De baja".`
    );
    
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(id);
        alert(`Ítem ${codigo} dado de baja exitosamente`);
      } catch (err) {
        console.error('Error al dar de baja el ítem:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        alert(`Error al dar de baja el ítem: ${errorMessage}\n\nPor favor, intenta de nuevo.`);
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

  // Calculate pagination and item range
  const totalPages = data ? Math.ceil(data.count / (filters.page_size || 50)) : 0;
  const currentPage = filters.page || 1;
  const startItem = data ? (currentPage - 1) * (filters.page_size || 50) + 1 : 0;
  const endItem = data ? Math.min(currentPage * (filters.page_size || 50), data.count) : 0;

  // Check if all items on current page are selected
  const allSelected = data ? data.results.length > 0 && data.results.every((item) => selectedIds.includes(item.id)) : false;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Ítems de Inventario</CardTitle>
            <CardDescription>
              {data && `Mostrando ${startItem}-${endItem} de ${data.count} ítems`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {selectedIds.length > 0 && (
              <Button variant="default" size="sm" onClick={handleBatchEdit}>
                Editar Rápido ({selectedIds.length})
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
            <Button variant="outline" size="sm" onClick={onBulkCreateClick}>
              Alta Masiva
            </Button>
            <Button onClick={onCreateClick}>Crear Ítem</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="mb-6 space-y-4">
          {/* Primera fila: Búsqueda global */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="font-semibold">
                Búsqueda General
              </Label>
              <Input
                id="search"
                placeholder="Buscar por Placa, Artículo o Serial..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              <p className="text-xs text-gray-500">
                {data && filters.search && `${data.count} coincidencias encontradas`}
              </p>
            </div>
          </div>

          {/* Segunda fila: Filtros específicos por campo */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="placa" className="font-semibold">
                Placa
              </Label>
              <Input
                id="placa"
                placeholder="Buscar por placa específica..."
                value={filters.placa || ''}
                onChange={(e) => handleFilterChange('placa', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serial" className="font-semibold">
                Serial
              </Label>
              <Input
                id="serial"
                placeholder="Buscar por serial específico..."
                value={filters.serial || ''}
                onChange={(e) => handleFilterChange('serial', e.target.value)}
              />
            </div>
          </div>

          {/* Tercera fila: Selectores de catálogos */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="articulo" className="font-semibold">
                Artículo
              </Label>
              <Select
                value={filters.articulo?.toString()}
                onValueChange={(value) => handleFilterChange('articulo', value === 'all' ? undefined : parseInt(value))}
              >
                <SelectTrigger id="articulo">
                  <SelectValue placeholder="Todos los artículos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {articulosData?.results.map((articulo) => (
                    <SelectItem key={articulo.id} value={articulo.id.toString()}>
                      {articulo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsable" className="font-semibold">
                Responsable
              </Label>
              <Select
                value={filters.responsable?.toString()}
                onValueChange={(value) => handleFilterChange('responsable', value === 'all' ? undefined : parseInt(value))}
              >
                <SelectTrigger id="responsable">
                  <SelectValue placeholder="Todos los responsables" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {responsablesData?.results.map((responsable) => (
                    <SelectItem key={responsable.id} value={responsable.id.toString()}>
                      {responsable.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ubicacion" className="font-semibold">
                Ubicación
              </Label>
              <Select
                value={filters.ubicacion?.toString()}
                onValueChange={(value) => handleFilterChange('ubicacion', value === 'all' ? undefined : parseInt(value))}
              >
                <SelectTrigger id="ubicacion">
                  <SelectValue placeholder="Todas las ubicaciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {ubicacionesData?.results.map((ubicacion) => (
                    <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                      {ubicacion.nombre} ({ubicacion.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sede" className="font-semibold">
                Sede
              </Label>
              <Select
                value={filters.sede?.toString()}
                onValueChange={(value) => handleFilterChange('sede', value === 'all' ? undefined : parseInt(value))}
              >
                <SelectTrigger id="sede">
                  <SelectValue placeholder="Todas las sedes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {sedesData?.results.map((sede) => (
                    <SelectItem key={sede.id} value={sede.id.toString()}>
                      {sede.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cuarta fila: Estado y Disponibilidad */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="estado" className="font-semibold">
                Estado Físico
              </Label>
              <Select
                value={filters.estado}
                onValueChange={(value) => handleFilterChange('estado', value === 'all' ? undefined : value as EstadoFisico)}
              >
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {ESTADO_FISICO.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="disponibilidad" className="font-semibold">
                Disponibilidad
              </Label>
              <Select
                value={filters.disponibilidad}
                onValueChange={(value) => handleFilterChange('disponibilidad', value === 'all' ? undefined : value as Disponibilidad)}
              >
                <SelectTrigger id="disponibilidad">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {DISPONIBILIDADES.map((disp) => (
                    <SelectItem key={disp.value} value={disp.value}>
                      {disp.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                    <TableHead>Artículo</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Código Ubicación</TableHead>
                    <TableHead>Sede</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Serial</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Disponibilidad</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.results.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center text-gray-500">
                        No se encontraron ítems
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.results.map((item: IItemList) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(item.id)}
                            onCheckedChange={(checked) => handleSelectItem(item.id, checked)}
                            aria-label={`Seleccionar ${item.codigo}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{item.articulo_nombre}</TableCell>
                        <TableCell>{item.placa || '-'}</TableCell>
                        <TableCell>{item.ubicacion_nombre}</TableCell>
                        <TableCell className="font-mono text-xs">{item.ubicacion_codigo || '-'}</TableCell>
                        <TableCell>{item.sede_nombre}</TableCell>
                        <TableCell>{item.responsable_nombre}</TableCell>
                        <TableCell>{item.marca || '-'}</TableCell>
                        <TableCell>{item.serial || '-'}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              item.estado === 'bueno'
                                ? 'bg-green-100 text-green-800'
                                : item.estado === 'regular'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {ESTADO_FISICO.find((e) => e.value === item.estado)?.label || item.estado}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              item.disponibilidad === 'en_uso'
                                ? 'bg-blue-100 text-blue-800'
                                : item.disponibilidad === 'en_reparacion'
                                ? 'bg-orange-100 text-orange-800'
                                : item.disponibilidad === 'extraviado'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {DISPONIBILIDADES.find((d) => d.value === item.disponibilidad)?.label || item.disponibilidad}
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
                  Mostrando {startItem}-{endItem} de {data.count} ítems (Página {currentPage} de {totalPages})
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
