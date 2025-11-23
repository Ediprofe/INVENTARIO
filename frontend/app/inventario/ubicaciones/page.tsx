'use client';

import { useState } from 'react';
import { DashboardNav } from '@/components/dashboard';
import { useSedes, useUbicaciones, useUbicacionStats, useDeleteItem, useArticulos, useResponsables } from '@/lib/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BatchEditDialog, ItemFormDialog, FloatingBatchEditButton } from '@/components/items';
import type { EstadoFisico, Disponibilidad } from '@/types';

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

/**
 * Página de Inventario por Ubicaciones.
 * 
 * Muestra:
 * - Selector de sede y ubicación
 * - Resumen: Totalizado por artículo
 * - Detalle: Tabla de ítems (con filtros, edición y eliminación)
 */
export default function InventarioPorUbicaciones() {
  const [sedeSeleccionada, setSedeSeleccionada] = useState<number | null>(null);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [batchEditDialogOpen, setBatchEditDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // Filtros de búsqueda - con disponibilidad "en_uso" por defecto según CLAUDE.md línea 203
  const [searchTerm, setSearchTerm] = useState('');
  const [placaFilter, setPlacaFilter] = useState('');
  const [serialFilter, setSerialFilter] = useState('');
  const [articuloFilter, setArticuloFilter] = useState<number | undefined>();
  const [responsableFilter, setResponsableFilter] = useState<number | undefined>();
  const [estadoFilter, setEstadoFilter] = useState<EstadoFisico | undefined>();
  const [disponibilidadFilter, setDisponibilidadFilter] = useState<Disponibilidad | undefined>('en_uso');

  // Queries
  const { data: sedesData } = useSedes();
  const { data: ubicacionesData } = useUbicaciones(
    sedeSeleccionada ? { sede: sedeSeleccionada, activo: true, page_size: 1000 } : undefined
  );
  const { data: articulosData } = useArticulos();
  const { data: responsablesData } = useResponsables();
  const { data: stats, isLoading: isLoadingStats, refetch } = useUbicacionStats(ubicacionSeleccionada);
  const deleteMutation = useDeleteItem();

  const handleSedeChange = (value: string) => {
    const sedeId = value === 'all' ? null : parseInt(value);
    setSedeSeleccionada(sedeId);
    setUbicacionSeleccionada(null);
    setSelectedIds([]);
  };

  const handleUbicacionChange = (value: string) => {
    const ubicacionId = value === 'all' ? null : parseInt(value);
    setUbicacionSeleccionada(ubicacionId);
    setSelectedIds([]);
  };

  const handleEditClick = (itemId: number) => {
    setSelectedItemId(itemId);
    setFormDialogOpen(true);
  };

  const handleFormDialogClose = () => {
    setFormDialogOpen(false);
    setSelectedItemId(null);
    refetch();
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
        refetch();
      } catch (err) {
        console.error('Error al dar de baja el ítem:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        alert(`Error al dar de baja el ítem: ${errorMessage}\n\nPor favor, intenta de nuevo.`);
      }
    }
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true && stats?.detalle.results) {
      setSelectedIds(filteredItems.map((item) => item.id));
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

  const handleBatchEditClick = () => {
    if (selectedIds.length > 0) {
      setBatchEditDialogOpen(true);
    }
  };

  const handleBatchEditDialogClose = () => {
    setBatchEditDialogOpen(false);
    setSelectedIds([]);
    refetch();
  };

  // Filtrado local de items
  const filteredItems = stats?.detalle.results.filter((item) => {
    if (searchTerm && !(
      item.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.articulo_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serial?.toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    if (placaFilter && !item.placa?.toLowerCase().includes(placaFilter.toLowerCase())) return false;
    if (serialFilter && !item.serial?.toLowerCase().includes(serialFilter.toLowerCase())) return false;
    if (articuloFilter && item.articulo_nombre !== articulosData?.results.find(a => a.id === articuloFilter)?.nombre) return false;
    if (responsableFilter && item.responsable_nombre !== responsablesData?.results.find(r => r.id === responsableFilter)?.nombre_completo) return false;
    if (estadoFilter && item.estado !== estadoFilter) return false;
    if (disponibilidadFilter && item.disponibilidad !== disponibilidadFilter) return false;
    return true;
  }) || [];

  const allSelected = filteredItems.length > 0 && filteredItems.every((item) => selectedIds.includes(item.id));

  return (
    <>
      <DashboardNav />

      {/* Selector de Sede y Ubicación */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtrar por Ubicación</CardTitle>
          <CardDescription>
            Selecciona una sede y ubicación para ver el inventario detallado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sede" className="font-semibold">Sede</Label>
              <Select value={sedeSeleccionada?.toString() || undefined} onValueChange={handleSedeChange}>
                <SelectTrigger id="sede">
                  <SelectValue placeholder="Selecciona una sede" />
                </SelectTrigger>
                <SelectContent>
                  {sedesData?.results.map((sede) => (
                    <SelectItem key={sede.id} value={sede.id.toString()}>
                      {sede.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ubicacion" className="font-semibold">Ubicación</Label>
              <Select
                value={ubicacionSeleccionada?.toString() || undefined}
                onValueChange={handleUbicacionChange}
                disabled={!sedeSeleccionada}
              >
                <SelectTrigger id="ubicacion">
                  <SelectValue placeholder="Selecciona una ubicación" />
                </SelectTrigger>
                <SelectContent>
                  {ubicacionesData?.results.map((ubicacion) => (
                    <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                      {ubicacion.codigo} - {ubicacion.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mostrar estadísticas si hay una ubicación seleccionada */}
      {ubicacionSeleccionada && (
        <>
          {isLoadingStats ? (
            <div className="py-8 text-center text-gray-500">Cargando estadísticas...</div>
          ) : stats ? (
            <>
              {/* Información de la Ubicación */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>
                    {stats.metadata.ubicacion_codigo} - {stats.metadata.ubicacion_nombre}
                  </CardTitle>
                  <CardDescription>
                    Sede: {stats.metadata.sede_nombre}
                    {stats.metadata.responsable_nombre && (
                      <> • Responsable: {stats.metadata.responsable_nombre}</>
                    )}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Tabla Resumen */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Resumen de Inventario</CardTitle>
                  <CardDescription>Totalizado por artículo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-x-auto">
                    <Table className="w-full table-fixed">
                      <TableHeader className="sticky top-0 z-20 bg-white shadow-sm">
                        <TableRow>
                          <TableHead>Artículo</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.resumen.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center text-gray-500">
                              No hay ítems en esta ubicación
                            </TableCell>
                          </TableRow>
                        ) : (
                          stats.resumen.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.articulo__nombre}</TableCell>
                              <TableCell className="text-right font-semibold">{item.total}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Filtros de Búsqueda */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Filtros de Búsqueda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Búsqueda general */}
                    <div className="space-y-2">
                      <Label htmlFor="search" className="font-semibold">Búsqueda General</Label>
                      <Input
                        id="search"
                        placeholder="Buscar por Placa, Artículo o Serial..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        {filteredItems.length} coincidencias encontradas
                      </p>
                    </div>

                    {/* Filtros específicos */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="placa" className="font-semibold">Placa</Label>
                        <Input
                          id="placa"
                          placeholder="Buscar por placa..."
                          value={placaFilter}
                          onChange={(e) => setPlacaFilter(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="serial" className="font-semibold">Serial</Label>
                        <Input
                          id="serial"
                          placeholder="Buscar por serial..."
                          value={serialFilter}
                          onChange={(e) => setSerialFilter(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Selectores de catálogos */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label htmlFor="articulo" className="font-semibold">Artículo</Label>
                        <Select
                          value={articuloFilter?.toString() || undefined}
                          onValueChange={(value) => setArticuloFilter(value === 'all' ? undefined : parseInt(value))}
                        >
                          <SelectTrigger id="articulo">
                            <SelectValue placeholder="Todos" />
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
                        <Label htmlFor="responsable" className="font-semibold">Responsable</Label>
                        <Select
                          value={responsableFilter?.toString() || undefined}
                          onValueChange={(value) => setResponsableFilter(value === 'all' ? undefined : parseInt(value))}
                        >
                          <SelectTrigger id="responsable">
                            <SelectValue placeholder="Todos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {responsablesData?.results.map((responsable) => (
                              <SelectItem key={responsable.id} value={responsable.id.toString()}>
                                {responsable.nombre_completo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="estado" className="font-semibold">Estado Físico</Label>
                        <Select
                          value={estadoFilter || undefined}
                          onValueChange={(value) => setEstadoFilter(value === 'all' ? undefined : value as EstadoFisico)}
                        >
                          <SelectTrigger id="estado">
                            <SelectValue placeholder="Todos" />
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
                        <Label htmlFor="disponibilidad" className="font-semibold">Disponibilidad</Label>
                        <Select
                          value={disponibilidadFilter || undefined}
                          onValueChange={(value) => setDisponibilidadFilter(value === 'all' ? undefined : value as Disponibilidad)}
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
                </CardContent>
              </Card>

              {/* Tabla Detallada */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventario Detallado</CardTitle>
                  <CardDescription>
                    Mostrando {filteredItems.length} de {stats.detalle.count} ítems
                    {selectedIds.length > 0 && ` • ${selectedIds.length} seleccionados`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-x-auto">
                    <Table className="w-full table-fixed">
                      <TableHeader className="sticky top-0 z-20 bg-white shadow-sm">
                        <TableRow>
                          <TableHead className="w-[3%]">
                            <Checkbox
                              checked={allSelected}
                              onCheckedChange={handleSelectAll}
                              aria-label="Seleccionar todos"
                            />
                          </TableHead>
                          <TableHead className="w-[18%]">Artículo</TableHead>
                          <TableHead className="w-[10%]">Placa</TableHead>
                          <TableHead className="w-[10%]">Estado</TableHead>
                          <TableHead className="w-[10%]">Marca</TableHead>
                          <TableHead className="w-[13%]">Serial</TableHead>
                          <TableHead className="w-[11%]">Disponibilidad</TableHead>
                          <TableHead className="w-[20%]">Responsable</TableHead>
                          <TableHead className="w-[5%] text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center text-gray-500">
                              No hay ítems que coincidan con los filtros
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedIds.includes(item.id)}
                                  onCheckedChange={(checked) => handleSelectItem(item.id, checked)}
                                  aria-label={`Seleccionar ${item.codigo}`}
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                <div className="line-clamp-2 break-words text-sm">{item.articulo_nombre}</div>
                              </TableCell>
                              <TableCell>
                                <div className="line-clamp-2 break-words text-sm">{item.placa || '-'}</div>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap ${
                                    item.estado === 'bueno'
                                      ? 'bg-green-100 text-green-800'
                                      : item.estado === 'regular'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {item.estado === 'bueno' ? 'Bueno' : item.estado === 'regular' ? 'Regular' : 'Malo'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="line-clamp-2 break-words text-sm">{item.marca || '-'}</div>
                              </TableCell>
                              <TableCell className="text-xs">
                                <div className="line-clamp-3 break-all leading-tight">{item.serial || '-'}</div>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap ${
                                    item.disponibilidad === 'en_uso'
                                      ? 'bg-blue-100 text-blue-800'
                                      : item.disponibilidad === 'en_reparacion'
                                      ? 'bg-orange-100 text-orange-800'
                                      : item.disponibilidad === 'extraviado'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {item.disponibilidad === 'en_uso' ? 'En uso' : 
                                   item.disponibilidad === 'en_reparacion' ? 'En reparación' :
                                   item.disponibilidad === 'extraviado' ? 'Extraviado' : 'De baja'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="line-clamp-2 break-words text-sm">{item.responsable_nombre}</div>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                                      >
                                        <circle cx="12" cy="12" r="1" />
                                        <circle cx="12" cy="5" r="1" />
                                        <circle cx="12" cy="19" r="1" />
                                      </svg>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditClick(item.id)}>
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDelete(item.id, item.codigo)}
                                      disabled={deleteMutation.isPending}
                                      className="text-red-600"
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
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No se encontraron datos para esta ubicación
            </div>
          )}
        </>
      )}

      {/* Mensaje inicial */}
      {!ubicacionSeleccionada && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <p className="text-lg font-semibold mb-2">Selecciona una ubicación</p>
              <p>Elige una sede y ubicación en los filtros superiores para ver el inventario</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diálogos */}
      <ItemFormDialog 
        open={formDialogOpen} 
        onClose={handleFormDialogClose} 
        itemId={selectedItemId} 
      />
      <BatchEditDialog 
        open={batchEditDialogOpen} 
        onClose={handleBatchEditDialogClose} 
        selectedIds={selectedIds} 
      />

      {/* Botón flotante de edición rápida */}
      <FloatingBatchEditButton
        selectedCount={selectedIds.length}
        onClick={handleBatchEditClick}
      />
    </>
  );
}
