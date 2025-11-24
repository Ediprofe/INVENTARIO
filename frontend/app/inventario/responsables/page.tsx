'use client';

import { useState, useMemo } from 'react';
import { DashboardNav } from '@/components/dashboard';
import { useResponsables, useResponsableStats } from '@/lib/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BatchEditDialog, ItemFormDialog, ItemsTable, ResetImportDialog } from '@/components/items';
import { ExcelAPI } from '@/lib/api/excel';
import { sortResponsables, formatResponsableLabel } from '@/lib/catalogs';

export default function InventarioPorResponsables() {
  const [responsableSeleccionado, setResponsableSeleccionado] = useState<number | null>(null);
  
  // Diálogos
  const [batchEditDialogOpen, setBatchEditDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [resetImportDialogOpen, setResetImportDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Queries
  const { data: responsablesData } = useResponsables();
  const responsablesOptions = useMemo(
    () => sortResponsables(responsablesData?.results ?? []),
    [responsablesData]
  );
  const { data: stats, isLoading: isLoadingStats } = useResponsableStats(responsableSeleccionado);

  const handleResponsableChange = (value: string) => {
    const respId = value === 'all' ? null : parseInt(value);
    setResponsableSeleccionado(respId);
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

  return (
    <>
      <DashboardNav />

      {/* Selector de Responsable */}
      <Card className="mb-6 shadow-lg border-0">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-lg">Filtrar por Responsable</CardTitle>
              <CardDescription className="text-sm">
                Selecciona un responsable para ver sus asignaciones
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-w-md space-y-2">
            <Label htmlFor="responsable" className="font-semibold">Responsable</Label>
            <Select value={responsableSeleccionado?.toString() || undefined} onValueChange={handleResponsableChange}>
              <SelectTrigger id="responsable">
                <SelectValue placeholder="Selecciona un responsable" />
              </SelectTrigger>
              <SelectContent>
                {responsablesOptions.map((resp) => (
                  <SelectItem key={resp.id} value={resp.id.toString()}>
                    {formatResponsableLabel(resp)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mostrar estadísticas si hay un responsable seleccionado */}
      {responsableSeleccionado && (
        <>
          {isLoadingStats ? (
            <div className="py-8 text-center text-gray-500">Cargando estadísticas...</div>
          ) : stats ? (
            <>
              {/* Información del Responsable */}
              <Card className="mb-6 shadow-lg border-0 bg-gradient-to-r from-purple-50 to-purple-100/50">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl text-gray-900 mb-1">
                        {stats.metadata.responsable_nombre}
                      </CardTitle>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {stats.metadata.responsable_cargo && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {stats.metadata.responsable_cargo}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {stats.metadata.sede_nombre}
                        </span>
                      </div>
                      {stats.metadata.ubicaciones_a_cargo && stats.metadata.ubicaciones_a_cargo.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Ubicaciones a cargo:</p>
                          <div className="flex flex-wrap gap-2">
                            {stats.metadata.ubicaciones_a_cargo.map((u, i) => (
                              <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 border border-gray-200">
                                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {u.nombre} · {u.codigo}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-lg">Resumen de Asignaciones</CardTitle>
                        <CardDescription className="text-sm">Distribución de ítems por artículo y ubicación</CardDescription>
                      </div>
                    </div>
                    {stats.resumen.length > 0 && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
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
                          <TableHead className="font-bold text-gray-800 text-sm">Ubicación</TableHead>
                          <TableHead className="text-right pr-6 font-bold text-gray-800 w-[120px] text-sm">Cantidad</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.resumen.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-12 text-gray-500">
                              <div className="flex flex-col items-center gap-2">
                                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="font-medium">Este responsable no tiene ítems asignados</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          stats.resumen.map((item, index) => (
                            <TableRow key={index} className="hover:bg-purple-50/30 transition-colors border-b border-gray-100">
                              <TableCell className="pl-6 font-medium text-gray-900">{item.articulo__nombre}</TableCell>
                              <TableCell className="text-gray-600">
                                <span className="inline-flex items-center gap-1.5">
                                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  </svg>
                                  {item.ubicacion__nombre} <span className="text-gray-400 text-xs">· {item.ubicacion__codigo}</span>
                                </span>
                              </TableCell>
                              <TableCell className="text-right pr-6">
                                <span className="inline-flex items-center justify-center min-w-[60px] px-3 py-1.5 rounded-lg text-sm font-bold bg-purple-100 text-purple-800 border border-purple-200">
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
                  responsable: responsableSeleccionado
                }}
                hiddenFilters={['responsable']} // Ocultar filtro redundante
                showDataManagementActions={false} // Ocultar botones de gestión masiva
                onCreateClick={handleCreateClick}
                onEditClick={handleEditClick}
                onBatchEditClick={handleBatchEditClick}
                onResetImportClick={handleResetImportClick}
                onBulkCreateClick={() => {}}
                onImportClick={() => {}}
              />
            </>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No se encontraron datos para este responsable
            </div>
          )}
        </>
      )}

      {/* Mensaje inicial */}
      {!responsableSeleccionado && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <p className="text-lg font-semibold mb-2">Selecciona un responsable</p>
              <p>Elige un responsable para ver su inventario asignado</p>
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