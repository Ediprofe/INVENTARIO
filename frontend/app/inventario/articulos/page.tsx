'use client';

import { useState } from 'react';
import { DashboardNav } from '@/components/dashboard';
import { useArticuloStats } from '@/lib/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
 * Página de Inventario por Artículos.
 * 
 * Muestra:
 * - Matriz de artículos x sedes con totales
 * - Filtros de Disponibilidad y Estado Físico
 * - Solo visualización (sin edición)
 */
export default function InventarioPorArticulos() {
  // Filtro - "En uso" por defecto según CLAUDE.md
  // Estado físico ya no es filtro, se muestra en la tabla
  const [disponibilidadFilter, setDisponibilidadFilter] = useState<Disponibilidad | undefined>('en_uso');

  // Query con filtro de disponibilidad
  const { data: stats, isLoading, isError } = useArticuloStats({
    disponibilidad: disponibilidadFilter,
  });

  return (
    <>
      <DashboardNav />

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Personaliza la vista del inventario por artículos. El estado físico se muestra desglosado en la tabla.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-md">
            <Label htmlFor="disponibilidad" className="font-semibold">Disponibilidad</Label>
            <Select
              value={disponibilidadFilter || 'all'}
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
            <p className="text-xs text-muted-foreground">
              Por defecto: &quot;En uso&quot; (ítems disponibles). El estado físico (Bueno/Regular/Malo) se muestra desglosado en cada sede.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventario por Artículos</CardTitle>
          <CardDescription>
            Total de ítems de cada artículo por sede, desglosado por estado físico (Bueno/Regular/Malo)
            {disponibilidadFilter && ` • Disponibilidad: ${DISPONIBILIDADES.find(d => d.value === disponibilidadFilter)?.label}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Loading state */}
          {isLoading && (
            <div className="py-8 text-center text-gray-500">
              Cargando estadísticas...
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="py-8 text-center text-red-600">
              Error al cargar estadísticas
            </div>
          )}

          {/* Matriz de Artículos x Sedes */}
          {!isLoading && !isError && stats && (
            <div className="rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 z-20 bg-white shadow-sm">
                  <TableRow>
                    <TableHead className="font-bold">Artículo</TableHead>
                    {stats.sedes.map((sede) => (
                      <TableHead key={sede.id} className="text-center">
                        {sede.nombre}
                      </TableHead>
                    ))}
                    <TableHead className="text-right font-bold bg-gray-100 dark:bg-gray-900">
                      Total General
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.articulos.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={stats.sedes.length + 2}
                        className="text-center text-gray-500"
                      >
                        No hay datos de inventario
                      </TableCell>
                    </TableRow>
                  ) : (
                    stats.articulos.map((articulo) => (
                      <TableRow key={articulo.articulo_id}>
                        <TableCell className="font-medium">
                          <div className="whitespace-normal break-words">
                            {articulo.articulo_nombre}
                          </div>
                        </TableCell>
                        {stats.sedes.map((sede) => {
                          const totales = articulo.totales_por_sede[sede.codigo];
                          if (!totales || totales.total === 0) {
                            return (
                              <TableCell key={sede.id} className="text-center text-gray-400">
                                -
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell key={sede.id} className="text-center">
                              <div className="flex flex-col gap-1 items-center">
                                {totales.bueno > 0 && (
                                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                                    {totales.bueno} B
                                  </span>
                                )}
                                {totales.regular > 0 && (
                                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                                    {totales.regular} R
                                  </span>
                                )}
                                {totales.malo > 0 && (
                                  <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
                                    {totales.malo} M
                                  </span>
                                )}
                                <span className="text-xs text-gray-500 font-medium mt-1">
                                  Total: {totales.total}
                                </span>
                              </div>
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-right font-semibold bg-gray-50">
                          {articulo.total_general}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  
                  {/* Fila de totales por sede */}
                  {stats.articulos.length > 0 && (
                    <TableRow className="bg-gray-100 font-semibold">
                      <TableCell>Total por Sede</TableCell>
                      {stats.sedes.map((sede) => {
                        // Sumar todos los estados para esta sede
                        const totalBueno = stats.articulos.reduce(
                          (sum, articulo) => sum + (articulo.totales_por_sede[sede.codigo]?.bueno || 0),
                          0
                        );
                        const totalRegular = stats.articulos.reduce(
                          (sum, articulo) => sum + (articulo.totales_por_sede[sede.codigo]?.regular || 0),
                          0
                        );
                        const totalMalo = stats.articulos.reduce(
                          (sum, articulo) => sum + (articulo.totales_por_sede[sede.codigo]?.malo || 0),
                          0
                        );
                        const totalSede = totalBueno + totalRegular + totalMalo;
                        
                        return (
                          <TableCell key={sede.id} className="text-center">
                            {totalSede === 0 ? (
                              <span className="text-gray-400">-</span>
                            ) : (
                              <div className="flex flex-col gap-1 items-center">
                                {totalBueno > 0 && (
                                  <span className="inline-flex items-center rounded-full bg-green-200 px-2 py-0.5 text-xs font-bold text-green-900">
                                    {totalBueno} B
                                  </span>
                                )}
                                {totalRegular > 0 && (
                                  <span className="inline-flex items-center rounded-full bg-yellow-200 px-2 py-0.5 text-xs font-bold text-yellow-900">
                                    {totalRegular} R
                                  </span>
                                )}
                                {totalMalo > 0 && (
                                  <span className="inline-flex items-center rounded-full bg-red-200 px-2 py-0.5 text-xs font-bold text-red-900">
                                    {totalMalo} M
                                  </span>
                                )}
                                <span className="text-xs font-bold mt-1">
                                  Total: {totalSede}
                                </span>
                              </div>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-right bg-gray-200">
                        {stats.articulos.reduce((sum, articulo) => sum + articulo.total_general, 0)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

