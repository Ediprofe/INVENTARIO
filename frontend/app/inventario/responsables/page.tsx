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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtrar por Responsable</CardTitle>
          <CardDescription>
            Selecciona un responsable para ver sus ítems asignados
          </CardDescription>
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
              <Card className="mb-6 border-none shadow-sm bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">
                    {stats.metadata.responsable_nombre}
                  </CardTitle>
                  <CardDescription className="text-blue-700/80 mt-2">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold">Sede Principal:</span> {stats.metadata.sede_nombre}
                    </span>
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Tabla Resumen */}
              <Card className="mb-6 border-none shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Resumen de Asignaciones</CardTitle>
                  <CardDescription>Distribución de ítems por artículo y ubicación</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="border-y overflow-x-auto">
                    <Table className="w-full">
                      <TableHeader className="bg-gray-50/80">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="pl-6 font-semibold text-gray-700">Artículo</TableHead>
                          <TableHead className="font-semibold text-gray-700">Ubicación</TableHead>
                          <TableHead className="text-right pr-6 font-semibold text-gray-700 w-[100px]">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.resumen.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                              Este responsable no tiene ítems asignados
                            </TableCell>
                          </TableRow>
                        ) : (
                          stats.resumen.map((item, index) => (
                            <TableRow key={index} className="hover:bg-gray-50/50">
                              <TableCell className="pl-6 font-medium text-gray-900">{item.articulo__nombre}</TableCell>
                              <TableCell className="text-gray-600">
                                {item.ubicacion__nombre} <span className="text-gray-400 text-xs">({item.ubicacion__codigo})</span>
                              </TableCell>
                              <TableCell className="text-right pr-6">
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
        onOpenChange={setResetImportDialogOpen}
        onImport={ExcelAPI.resetImport}
      />
    </>
  );
}