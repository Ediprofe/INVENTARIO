'use client';

import { useState, useEffect, useMemo } from 'react';
import { useItems, useDeleteItem, useExportItems, useDownloadTemplate, useItemFilterOptions, useExportFullDatabase } from '@/lib/hooks';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  sortArticulos,
  sortResponsables,
  sortUbicaciones,
  sortSedes,
  formatArticuloLabel,
  formatResponsableLabel,
  formatUbicacionLabel,
  formatSedeLabel,
} from '@/lib/catalogs';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react'; // Import icons

const formatOptionLabel = (value: string) => {
  if (!value) return 'Sin asignar';
  return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

interface ItemsTableProps {
  onCreateClick?: () => void;
  onEditClick?: (itemId: number) => void;
  onImportClick?: () => void;
  onResetImportClick?: () => void;
  onBatchEditClick?: (selectedIds: number[]) => void;
  onBulkCreateClick?: () => void;
  initialFilters?: Partial<IItemFilters>;
  hiddenFilters?: Array<keyof IItemFilters>;
  showDataManagementActions?: boolean;
}

export function ItemsTable({ 
  onCreateClick, 
  onEditClick, 
  onImportClick, 
  onResetImportClick,
  onBatchEditClick,
  onBulkCreateClick,
  initialFilters,
  hiddenFilters = [],
  showDataManagementActions = true
}: ItemsTableProps) {
  // Filtros state
  const [filters, setFilters] = useState<IItemFilters>({
    page: 1,
    page_size: 50,
    ordering: '-created_at',
    ...initialFilters
  });

  // Mostrar/ocultar filtros avanzados
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Selected items state
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Sincronizar filtros externos cuando cambian las props
  useEffect(() => {
    if (initialFilters) {
      setFilters(prev => ({
        ...prev,
        ...initialFilters,
        page: 1 // Reset a primera página si cambian filtros externos
      }));
    }
  }, [JSON.stringify(initialFilters)]);

  // Queries
  const { data, isLoading, isError, error } = useItems(filters);
  const { data: sedesData } = useSedes();
  const { data: ubicacionesData } = useUbicaciones();
  const { data: responsablesData } = useResponsables();
  const { data: articulosData } = useArticulos();
  const { data: filterOptions } = useItemFilterOptions(); // Opciones dinámicas
  const deleteMutation = useDeleteItem();

  // Opciones dinámicas de filtros
  const estadoOptions = useMemo(() => {
    return (filterOptions?.estados || []).map(value => ({
      value,
      label: formatOptionLabel(value)
    }));
  }, [filterOptions]);

  const disponibilidadOptions = useMemo(() => {
    return (filterOptions?.disponibilidades || []).map(value => ({
      value,
      label: formatOptionLabel(value)
    }));
  }, [filterOptions]);

  // Catálogos ordenados
  const articulosOptions = useMemo(
    () => sortArticulos(articulosData?.results ?? []),
    [articulosData]
  );
  const responsablesOptions = useMemo(
    () => sortResponsables(responsablesData?.results ?? []),
    [responsablesData]
  );
  const ubicacionesOptions = useMemo(
    () => sortUbicaciones(ubicacionesData?.results ?? []),
    [ubicacionesData]
  );
  const sedesOptions = useMemo(
    () => sortSedes(sedesData?.results ?? []),
    [sedesData]
  );

  // Excel mutations
  const exportMutation = useExportItems();
  const exportFullMutation = useExportFullDatabase();
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

  const handleFullExport = async () => {
    try {
      await exportFullMutation.mutateAsync();
    } catch (err) {
      console.error('Error al exportar base de datos completa:', err);
      alert('Error al exportar base de datos completa');
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

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      page_size: 50,
      ordering: '-created_at',
      ...initialFilters // Mantener filtros iniciales obligatorios
    });
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

  // Count active filters (excluding pagination and sorting)
  const activeFiltersCount = Object.keys(filters).filter(k => 
    !['page', 'page_size', 'ordering', 'search'].includes(k) && 
    filters[k as keyof IItemFilters] !== undefined &&
    // No contar filtros iniciales ocultos si son iguales
    (!initialFilters || filters[k as keyof IItemFilters] !== initialFilters[k as keyof IItemFilters])
  ).length;

  return (
    <Card className="border-none shadow-lg rounded-2xl overflow-hidden animate-fade-in">
      <CardHeader className="pb-6 px-8 pt-8 bg-gradient-to-br from-white to-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Inventario
            </CardTitle>
            <CardDescription className="mt-2 text-sm text-gray-600 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Gestión general de activos y existencias
              </span>
              {data && (
                <span className="ml-2 px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {data.count} {data.count === 1 ? 'registro' : 'registros'}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2.5 items-center">
            {selectedIds.length > 0 && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleBatchEdit} 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Selección ({selectedIds.length})
              </Button>
            )}
            
            {showDataManagementActions && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onBulkCreateClick} 
                  className="hidden sm:flex border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  Alta Masiva
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all">
                      Más Acciones
                      <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 shadow-xl">
                    <DropdownMenuItem onClick={onImportClick} className="cursor-pointer">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Importar Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadTemplate} disabled={templateMutation.isPending} className="cursor-pointer">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Descargar Plantilla
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExport} disabled={exportMutation.isPending} className="cursor-pointer">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Exportar Vista Actual
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleFullExport} disabled={exportFullMutation.isPending} className="cursor-pointer">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Exportar Todo (Editable)
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={onResetImportClick}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Resetear e Importar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            
            <Button 
              onClick={onCreateClick} 
              size="sm" 
              className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Ítem
            </Button>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por Placa, Artículo, Serial..."
              className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors w-full"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <Button 
            variant={showAdvancedFilters ? "secondary" : "outline"} 
            size="sm" 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="gap-2 border-gray-200 min-w-[110px]"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearFilters}
              className="text-gray-500 hover:text-red-600"
            >
              <X className="h-4 w-4 mr-1" /> Limpiar
            </Button>
          )}
        </div>

        {/* Panel de Filtros Avanzados */}
        {showAdvancedFilters && (
          <div className="mt-4 p-4 bg-gray-50/80 rounded-lg border border-gray-100 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Grupo: Ubicación */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ubicación</h4>
                {!hiddenFilters.includes('sede') && (
                  <Select
                    value={filters.sede?.toString()}
                    onValueChange={(value) => handleFilterChange('sede', value === 'all' ? undefined : parseInt(value))}
                  >
                    <SelectTrigger className="bg-white h-9 text-sm">
                      <SelectValue placeholder="Todas las sedes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {sedesOptions.map((sede) => (
                        <SelectItem key={sede.id} value={sede.id.toString()}>{formatSedeLabel(sede)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {!hiddenFilters.includes('ubicacion') && (
                  <Select
                    value={filters.ubicacion?.toString()}
                    onValueChange={(value) => handleFilterChange('ubicacion', value === 'all' ? undefined : parseInt(value))}
                  >
                    <SelectTrigger className="bg-white h-9 text-sm">
                      <SelectValue placeholder="Todas las ubicaciones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {ubicacionesOptions.map((ubicacion) => (
                        <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>{formatUbicacionLabel(ubicacion)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {!hiddenFilters.includes('responsable') && (
                  <Select
                    value={filters.responsable?.toString()}
                    onValueChange={(value) => handleFilterChange('responsable', value === 'all' ? undefined : parseInt(value))}
                  >
                    <SelectTrigger className="bg-white h-9 text-sm">
                      <SelectValue placeholder="Todos los responsables" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {responsablesOptions.map((responsable) => (
                        <SelectItem key={responsable.id} value={responsable.id.toString()}>{formatResponsableLabel(responsable)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Grupo: Estado */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</h4>
                {!hiddenFilters.includes('estado') && (
                  <Select
                    value={filters.estado}
                    onValueChange={(value) => handleFilterChange('estado', value === 'all' ? undefined : value as EstadoFisico)}
                  >
                    <SelectTrigger className="bg-white h-9 text-sm">
                      <SelectValue placeholder="Cualquier estado físico" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {estadoOptions.map((e) => (
                        <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {!hiddenFilters.includes('disponibilidad') && (
                  <Select
                    value={filters.disponibilidad}
                    onValueChange={(value) => handleFilterChange('disponibilidad', value === 'all' ? undefined : value as Disponibilidad)}
                  >
                    <SelectTrigger className="bg-white h-9 text-sm">
                      <SelectValue placeholder="Cualquier disponibilidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {disponibilidadOptions.map((d) => (
                        <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Grupo: Identificadores Específicos */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Identificación</h4>
                {!hiddenFilters.includes('articulo') && (
                  <Select
                    value={filters.articulo?.toString()}
                    onValueChange={(value) => handleFilterChange('articulo', value === 'all' ? undefined : parseInt(value))}
                  >
                    <SelectTrigger className="bg-white h-9 text-sm">
                      <SelectValue placeholder="Tipo de Artículo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {articulosOptions.map((articulo) => (
                        <SelectItem key={articulo.id} value={articulo.id.toString()}>{formatArticuloLabel(articulo)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {!hiddenFilters.includes('placa') && (
                  <Input 
                    placeholder="Placa exacta..." 
                    className="bg-white h-9 text-sm"
                    value={filters.placa || ''}
                    onChange={(e) => handleFilterChange('placa', e.target.value)}
                  />
                )}
                {!hiddenFilters.includes('serial') && (
                  <Input 
                    placeholder="Serial exacto..." 
                    className="bg-white h-9 text-sm"
                    value={filters.serial || ''}
                    onChange={(e) => handleFilterChange('serial', e.target.value)}
                  />
                )}
              </div>

              {/* Grupo: Detalles (NUEVO) */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Detalles</h4>
                <Input 
                  placeholder="Buscar en descripción..." 
                  className="bg-white h-9 text-sm"
                  value={filters.descripcion || ''}
                  onChange={(e) => handleFilterChange('descripcion', e.target.value)}
                />
                <Input 
                  placeholder="Buscar en observaciones..." 
                  className="bg-white h-9 text-sm"
                  value={filters.observaciones || ''}
                  onChange={(e) => handleFilterChange('observaciones', e.target.value)}
                />
                <Input 
                  placeholder="Marca..." 
                  className="bg-white h-9 text-sm"
                  value={filters.marca || ''}
                  onChange={(e) => handleFilterChange('marca', e.target.value)}
                />
              </div>

            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="px-0 sm:px-6">
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 space-y-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Cargando inventario...</p>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="mx-6 my-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700">
            <div className="bg-red-100 p-2 rounded-full">
              <X className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">Error al cargar datos</p>
              <p className="text-xs opacity-90">{error instanceof Error ? error.message : 'Error de conexión'}</p>
            </div>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && data && (
          <>
            <div className="border-y sm:border rounded-none sm:rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="w-full min-w-[1400px]">
                  <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <TableRow className="hover:bg-transparent border-b-2 border-gray-200">
                      <TableHead className="w-[50px] pl-6">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={handleSelectAll}
                          aria-label="Seleccionar todos"
                          className="border-gray-400"
                        />
                      </TableHead>
                      <TableHead className="min-w-[140px] font-bold text-gray-800 text-xs uppercase tracking-wide">Artículo</TableHead>
                      <TableHead className="min-w-[110px] font-bold text-gray-800 text-xs uppercase tracking-wide">Placa</TableHead>
                      <TableHead className="min-w-[130px] font-bold text-gray-800 text-xs uppercase tracking-wide">Ubicación</TableHead>
                      <TableHead className="min-w-[110px] font-bold text-gray-800 text-xs uppercase tracking-wide">Sede</TableHead>
                      <TableHead className="min-w-[130px] font-bold text-gray-800 text-xs uppercase tracking-wide">Responsable</TableHead>
                      <TableHead className="min-w-[90px] font-bold text-gray-800 text-xs uppercase tracking-wide">Estado</TableHead>
                      <TableHead className="min-w-[100px] font-bold text-gray-800 text-xs uppercase tracking-wide">Disponibilidad</TableHead>
                      <TableHead className="min-w-[150px] font-bold text-gray-800 text-xs uppercase tracking-wide">Descripción</TableHead>
                      <TableHead className="min-w-[150px] font-bold text-gray-800 text-xs uppercase tracking-wide">Observaciones</TableHead>
                      <TableHead className="min-w-[100px] font-bold text-gray-800 text-xs uppercase tracking-wide">Marca</TableHead>
                      <TableHead className="min-w-[120px] font-bold text-gray-800 text-xs uppercase tracking-wide">Serial</TableHead>
                      <TableHead className="w-[80px] text-right pr-6 font-bold text-gray-800 text-xs uppercase tracking-wide">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.results.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={13} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <Search className="h-8 w-8 mb-2 opacity-20" />
                            <p>No se encontraron ítems con los filtros actuales</p>
                            {activeFiltersCount > 0 && (
                              <Button variant="link" onClick={handleClearFilters} className="mt-1 h-auto p-0 text-blue-600">
                                Limpiar filtros
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.results.map((item: IItemList) => (
                        <TableRow key={item.id} className="group hover:bg-blue-50/30 transition-all duration-150 border-b border-gray-100">
                          <TableCell className="pl-6">
                            <Checkbox
                              checked={selectedIds.includes(item.id)}
                              onCheckedChange={(checked) => handleSelectItem(item.id, checked)}
                              aria-label={`Seleccionar ${item.codigo}`}
                              className="border-gray-400"
                            />
                          </TableCell>
                          <TableCell className="font-semibold text-gray-900">
                            <div className="truncate text-sm max-w-[140px]" title={item.articulo_nombre}>
                              {item.articulo_nombre}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-xs bg-gradient-to-r from-blue-50 to-blue-100/50 px-3 py-1.5 rounded-md inline-block text-blue-900 font-semibold border border-blue-200 whitespace-nowrap">
                              {item.placa || '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="truncate text-sm text-gray-600" title={`${item.ubicacion_nombre} (${item.ubicacion_codigo})`}>
                              {item.ubicacion_nombre}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="truncate text-sm text-gray-500" title={item.sede_nombre}>{item.sede_nombre}</div>
                          </TableCell>
                          <TableCell>
                            <div className="truncate text-sm text-gray-600 flex items-center gap-1" title={item.responsable_nombre}>
                              {item.responsable_nombre ? (
                                <>
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                  {item.responsable_nombre}
                                </>
                              ) : (
                                <span className="text-gray-400 italic">Sin asignar</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-xs font-semibold shadow-sm ${
                                item.estado === 'bueno'
                                  ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 ring-1 ring-green-200'
                                  : item.estado === 'regular'
                                  ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 ring-1 ring-yellow-200'
                                  : item.estado === 'malo'
                                  ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 ring-1 ring-red-200'
                                  : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 ring-1 ring-gray-200'
                              }`}
                            >
                              {formatOptionLabel(item.estado)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-xs font-semibold shadow-sm whitespace-nowrap ${
                                item.disponibilidad === 'en_uso'
                                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 ring-1 ring-blue-200'
                                  : item.disponibilidad === 'en_reparacion'
                                  ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 ring-1 ring-orange-200'
                                  : item.disponibilidad === 'extraviado'
                                  ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 ring-1 ring-red-200'
                                  : item.disponibilidad === 'de_baja'
                                  ? 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 ring-1 ring-purple-200'
                                  : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 ring-1 ring-gray-200'
                              }`}
                            >
                              {formatOptionLabel(item.disponibilidad)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="truncate text-xs text-gray-500 max-w-[150px]" title={item.descripcion || ''}>
                              {item.descripcion || '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="truncate text-xs text-gray-500 max-w-[150px]" title={item.observaciones || ''}>
                              {item.observaciones || '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="truncate text-sm text-gray-600" title={item.marca || ''}>{item.marca || '-'}</div>
                          </TableCell>
                          <TableCell className="text-xs font-mono text-gray-500">
                            <div className="truncate" title={item.serial || ''}>{item.serial || '-'}</div>
                          </TableCell>
                          <TableCell className="text-right pr-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 data-[state=open]:bg-gray-100">
                                  <span className="sr-only">Abrir menú</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-gray-500"
                                  >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => onEditClick?.(item.id)}>
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(item.id, item.codigo)}
                                  disabled={deleteMutation.isPending}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between px-2">
                <div className="text-sm text-gray-500">
                  Página <span className="font-medium text-gray-900">{currentPage}</span> de <span className="font-medium text-gray-900">{totalPages}</span>
                  <span className="hidden sm:inline text-gray-400 mx-2">•</span>
                  <span className="hidden sm:inline text-gray-500">{data.count} resultados</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-24"
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-24"
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
