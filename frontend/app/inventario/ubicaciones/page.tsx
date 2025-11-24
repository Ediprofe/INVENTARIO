'use client';

import { useState, useMemo } from 'react';
import { DashboardNav } from '@/components/dashboard';
import { useSedes, useUbicaciones, useUbicacionStats } from '@/lib/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BatchEditDialog, ItemFormDialog, ItemsTable, ResetImportDialog } from '@/components/items';
import { ExcelAPI } from '@/lib/api/excel';
import {
  sortSedes,
  sortUbicaciones,
  formatSedeLabel,
  formatUbicacionLabel,
} from '@/lib/catalogs';

export default function InventarioPorUbicaciones() {
  const [sedeSeleccionada, setSedeSeleccionada] = useState<number | null>(null);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<number | null>(null);
  
  // Diálogos controlados por ItemsTable via callbacks
  const [batchEditDialogOpen, setBatchEditDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [resetImportDialogOpen, setResetImportDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // Para BatchEdit

  // Queries
  const { data: sedesData } = useSedes();
  const { data: ubicacionesData } = useUbicaciones(
    sedeSeleccionada ? { sede: sedeSeleccionada } : undefined
  );
  // Stats solo para el resumen
  const { data: stats, isLoading: isLoadingStats } = useUbicacionStats(ubicacionSeleccionada);

  const sedesOptions = useMemo(
    () => sortSedes(sedesData?.results ?? []),
    [sedesData]
  );
  const ubicacionesOptions = useMemo(
    () => sortUbicaciones(ubicacionesData?.results ?? []),
    [ubicacionesData]
  );

  const handleSedeChange = (value: string) => {
    const sedeId = value === 'all' ? null : parseInt(value);
    setSedeSeleccionada(sedeId);
    setUbicacionSeleccionada(null);
  };

  const handleUbicacionChange = (value: string) => {
    const ubicacionId = value === 'all' ? null : parseInt(value);
    setUbicacionSeleccionada(ubicacionId);
  };

  // Handlers para ItemsTable
  const handleEditClick = (itemId: number) => {
    setSelectedItemId(itemId);
    setFormDialogOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedItemId(null);
    setFormDialogOpen(true);
  };

  const handleBatchEditClick = (ids: number[]) => {
    setSelectedIds(ids);
    setBatchEditDialogOpen(true);
  };

  const handleResetImportClick = () => {
    setResetImportDialogOpen(true);
  };
  
  const handleImportFile = async (file: File) => {
      // Implementación simple para cumplir interfaz, aunque ItemsTable tiene su propio onImportClick que quizás no usaremos aquí o sí.
      // De hecho ItemsTable no tiene lógica de importación interna, solo dispara evento.
      // Pero ResetImportDialog maneja su propia lógica.
      console.log("Import not implemented here directly");
  };

  return (
    <>
      <DashboardNav />

      {/* Selector de Sede y Ubicación */}
      <Card className="mb-6 shadow-lg border-0">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-lg">Filtrar por Ubicación</CardTitle>
              <CardDescription className="text-sm">
                Selecciona una sede y ubicación para ver el inventario detallado
              </CardDescription>
            </div>
          </div>
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
                  {sedesOptions.map((sede) => (
                    <SelectItem key={sede.id} value={sede.id.toString()}>
                      {formatSedeLabel(sede)}
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
                  {ubicacionesOptions.map((ubicacion) => (
                    <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                      {formatUbicacionLabel(ubicacion)}
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
              <Card className="mb-6 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-blue-100/50">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl text-gray-900 mb-1">
                        {stats.metadata.ubicacion_nombre}
                      </CardTitle>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                          {stats.metadata.ubicacion_codigo}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {stats.metadata.sede_nombre}
                        </span>
                        {stats.metadata.responsable_nombre && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {stats.metadata.responsable_nombre}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Tabla Resumen */}
              <Card className="mb-6 shadow-lg border-0">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-lg">Resumen de Inventario</CardTitle>
                        <CardDescription className="text-sm">Distribución de artículos en esta ubicación</CardDescription>
                      </div>
                    </div>
                    {stats.resumen.length > 0 && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {stats.resumen.reduce((sum, item) => sum + item.total, 0)} ítems
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table className="w-full">
                      <TableHeader className="bg-gray-50">
                        <TableRow className="hover:bg-transparent border-b">
                          <TableHead className="pl-6 font-bold text-gray-800 text-sm">Artículo</TableHead>
                          <TableHead className="text-right pr-6 font-bold text-gray-800 w-[120px] text-sm">Cantidad</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.resumen.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center py-12 text-gray-500">
                              <div className="flex flex-col items-center gap-2">
                                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="font-medium">No hay ítems registrados en esta ubicación</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          stats.resumen.map((item, index) => (
                            <TableRow key={index} className="hover:bg-blue-50/30 transition-colors border-b border-gray-100">
                              <TableCell className="pl-6 font-medium text-gray-900">{item.articulo__nombre}</TableCell>
                              <TableCell className="text-right pr-6">
                                <span className="inline-flex items-center justify-center min-w-[60px] px-3 py-1.5 rounded-lg text-sm font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                  {item.total}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* TABLA DETALLADA CENTRALIZADA */}
              <ItemsTable 
                initialFilters={{ 
                  ubicacion: ubicacionSeleccionada,
                  // Nota: No filtramos por disponibilidad fija aquí, dejamos que ItemsTable use su default 'en_uso' o lo que el usuario elija
                }}
                hiddenFilters={['ubicacion', 'sede']} // Ocultamos filtros redundantes
                showDataManagementActions={false} // Ocultar botones de gestión masiva
                onCreateClick={handleCreateClick}
                onEditClick={handleEditClick}
                onBatchEditClick={handleBatchEditClick}
                onResetImportClick={handleResetImportClick}
                onBulkCreateClick={() => {}} // No implementado aquí
                onImportClick={() => {}} // No implementado aquí
              />
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
        onClose={() => setFormDialogOpen(false)} 
        itemId={selectedItemId} 
      />
      <BatchEditDialog 
        open={batchEditDialogOpen} 
        onClose={() => setBatchEditDialogOpen(false)} 
        selectedIds={selectedIds} 
      />
      <ResetImportDialog
        open={resetImportDialogOpen}
        onClose={() => setResetImportDialogOpen(false)}
      />
    </>
  );
}