'use client';

import { useState, useMemo } from 'react';
import { DashboardNav } from '@/components/dashboard';
import { useArticuloStats, useItemFilterOptions } from '@/lib/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { EstadoFisico, Disponibilidad } from '@/types';

const formatOptionLabel = (value: string) => {
  if (!value) return 'Sin asignar';
  return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

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

  // Opciones dinámicas
  const { data: filterOptions } = useItemFilterOptions();

  const disponibilidadOptions = useMemo(() => {
    return (filterOptions?.disponibilidades || []).map(value => ({
      value,
      label: formatOptionLabel(value)
    }));
  }, [filterOptions]);

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
                {disponibilidadOptions.map((disp) => (
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
            {disponibilidadFilter && ` • Disponibilidad: ${formatOptionLabel(disponibilidadFilter)}`}
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
            <div className="rounded-md border-none shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50/80">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-6 font-bold text-gray-700">Artículo</TableHead>
                      {stats.sedes.map((sede) => (
                        <TableHead key={sede.id} className="text-center font-semibold text-gray-700 min-w-[120px]">
                          {sede.nombre}
                        </TableHead>
                      ))}
                      <TableHead className="text-right pr-6 font-bold bg-gray-100/50 text-gray-800 w-[100px]">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.articulos.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={stats.sedes.length + 2}
                          className="text-center py-12 text-gray-500"
                        >
                          No hay datos de inventario disponibles
                        </TableCell>
                      </TableRow>
                    ) : (
                      stats.articulos.map((articulo) => (
                        <TableRow key={articulo.articulo_id} className="hover:bg-gray-50/50 transition-colors">
                          <TableCell className="pl-6 font-medium text-gray-900">
                            <div className="whitespace-normal break-words max-w-[200px] sm:max-w-xs">
                              {articulo.articulo_nombre}
                            </div>
                          </TableCell>
                          {stats.sedes.map((sede) => {
                            const totales = articulo.totales_por_sede[sede.codigo];
                            if (!totales || totales.total === 0) {
                              return (
                                <TableCell key={sede.id} className="text-center text-gray-300">
                                  -
                                </TableCell>
                              );
                            }
                            return (
                              <TableCell key={sede.id} className="text-center p-2">
                                <div className="flex flex-col items-center justify-center gap-1 min-h-[40px]">
                                  <div className="flex gap-1">
                                    {totales.bueno > 0 && (
                                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-[10px] font-bold text-green-700 ring-1 ring-green-600/20" title={`${totales.bueno} Buenos`}>
                                        {totales.bueno}
                                      </span>
                                    )}
                                    {totales.regular > 0 && (
                                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-yellow-100 text-[10px] font-bold text-yellow-700 ring-1 ring-yellow-600/20" title={`${totales.regular} Regulares`}>
                                        {totales.regular}
                                      </span>
                                    )}
                                    {totales.malo > 0 && (
                                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-[10px] font-bold text-red-700 ring-1 ring-red-600/20" title={`${totales.malo} Malos`}>
                                        {totales.malo}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs font-semibold text-gray-700">
                                    {totales.total}
                                  </span>
                                </div>
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-right pr-6 font-bold bg-gray-50/30 text-gray-900">
                            {articulo.total_general}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    
                    {/* Fila de totales por sede */}
                    {stats.articulos.length > 0 && (
                      <TableRow className="bg-gray-100/80 font-semibold border-t-2 border-gray-200">
                        <TableCell className="pl-6 text-gray-800">Total General</TableCell>
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
                            <TableCell key={sede.id} className="text-center py-3">
                              {totalSede === 0 ? (
                                <span className="text-gray-400">-</span>
                              ) : (
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-sm font-bold text-gray-900">{totalSede}</span>
                                  <div className="flex gap-0.5 text-[9px] text-gray-500 uppercase tracking-tighter">
                                    {totalBueno > 0 && <span className="text-green-700">{totalBueno}B</span>}
                                    {(totalBueno > 0 && (totalRegular > 0 || totalMalo > 0)) && <span>·</span>}
                                    {totalRegular > 0 && <span className="text-yellow-700">{totalRegular}R</span>}
                                    {(totalRegular > 0 && totalMalo > 0) && <span>·</span>}
                                    {totalMalo > 0 && <span className="text-red-700">{totalMalo}M</span>}
                                  </div>
                                </div>
                              )}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-right pr-6 bg-gray-200/50 text-gray-900 text-lg">
                          {stats.articulos.reduce((sum, articulo) => sum + articulo.total_general, 0)}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

