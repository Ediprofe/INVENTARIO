'use client';

import { useState } from 'react';
import { DashboardNav } from '@/components/dashboard';
import { useSedes, useUbicaciones, useUbicacionStats } from '@/lib/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BatchEditDialog, ItemFormDialog, ItemsTable, ResetImportDialog } from '@/components/items';
import { ExcelAPI } from '@/lib/api/excel';

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
    sedeSeleccionada ? { sede: sedeSeleccionada, activo: true, page_size: 1000 } : undefined
  );
  // Stats solo para el resumen
  const { data: stats, isLoading: isLoadingStats } = useUbicacionStats(ubicacionSeleccionada);

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
        onOpenChange={setResetImportDialogOpen}
        onImport={ExcelAPI.resetImport}
      />
    </>
  );
}