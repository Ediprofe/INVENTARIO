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

// Función para obtener colores según el estado
const getEstadoColor = (estado: string): string => {
  const estadoLower = estado?.toLowerCase() || 'sin_estado';
  
  const colorMap: Record<string, string> = {
    'bueno': 'bg-green-100 text-green-700 border-green-300',
    'regular': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'malo': 'bg-red-100 text-red-700 border-red-300',
    'sin_estado': 'bg-gray-100 text-gray-600 border-gray-300',
    'excelente': 'bg-emerald-100 text-emerald-700 border-emerald-300',
    'nuevo': 'bg-blue-100 text-blue-700 border-blue-300',
  };
  
  return colorMap[estadoLower] || 'bg-purple-100 text-purple-700 border-purple-300';
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
      <Card className="mb-8 shadow-lg border-0 animate-fade-in">
        <CardHeader className="bg-gradient-to-r from-white to-gray-50/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Filtros</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Personaliza la vista del inventario por artículos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3 max-w-md">
            <Label htmlFor="disponibilidad" className="font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Disponibilidad
            </Label>
            <Select
              value={disponibilidadFilter || 'all'}
              onValueChange={(value) => setDisponibilidadFilter(value === 'all' ? undefined : value as Disponibilidad)}
            >
              <SelectTrigger id="disponibilidad" className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-blue-800 leading-relaxed">
                Por defecto: <span className="font-semibold">&quot;En uso&quot;</span> (ítems disponibles). El estado físico (Bueno/Regular/Malo) se muestra desglosado en cada sede.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 animate-slide-up">
        <CardHeader className="bg-gradient-to-r from-white to-gray-50/50 pb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
                  <path strokeWidth="2" d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/>
                  <path strokeWidth="2" d="M12 3v6"/>
                </svg>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Inventario por Artículos</CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">
                  Total de ítems de cada artículo por sede, desglosado por estado físico
                  {disponibilidadFilter && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {formatOptionLabel(disponibilidadFilter)}
                    </span>
                  )}
                </CardDescription>
              </div>
            </div>
          </div>
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

          {/* Leyenda de estados */}
          {!isLoading && !isError && stats && stats.estados_disponibles && stats.estados_disponibles.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Estados Físicos Detectados:</p>
                  <div className="flex flex-wrap gap-2">
                    {stats.estados_disponibles.map((estado: string) => (
                      <span 
                        key={estado}
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold border ${getEstadoColor(estado)}`}
                      >
                        {formatOptionLabel(estado)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Matriz de Artículos x Sedes */}
          {!isLoading && !isError && stats && (
            <div className="rounded-lg border border-gray-200 shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow className="hover:bg-transparent border-b">
                      <TableHead className="pl-6 font-bold text-gray-800 text-sm sticky left-0 bg-gray-50 z-10">Artículo</TableHead>
                      {stats.sedes.map((sede) => (
                        <TableHead key={sede.id} className="text-center font-bold text-gray-800 text-xs min-w-[120px] px-2">
                          {sede.nombre}
                        </TableHead>
                      ))}
                      <TableHead className="text-right pr-6 font-bold bg-blue-50 text-blue-900 w-[100px] text-sm sticky right-0 z-10">
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
                        <TableRow key={articulo.articulo_id} className="group hover:bg-gray-50 transition-colors border-b border-gray-100">
                          <TableCell className="pl-6 font-medium text-gray-900 sticky left-0 bg-white group-hover:bg-gray-50 z-10 transition-colors">
                            <div className="text-sm py-1">
                              {articulo.articulo_nombre}
                            </div>
                          </TableCell>
                          {stats.sedes.map((sede) => {
                            const totales = articulo.totales_por_sede[sede.codigo];
                            if (!totales || totales.total === 0) {
                              return (
                                <TableCell key={sede.id} className="text-center text-gray-300 py-2">
                                  -
                                </TableCell>
                              );
                            }
                            return (
                              <TableCell key={sede.id} className="text-center py-2 px-2">
                                <div className="flex flex-col items-center gap-1">
                                  <div className="flex flex-wrap gap-1 justify-center">
                                    {/* Renderizar dinámicamente todos los estados que existen */}
                                    {Object.entries(totales)
                                      .filter(([key, value]) => key !== 'total' && typeof value === 'number' && value > 0)
                                      .map(([estado, cantidad]) => (
                                        <span 
                                          key={estado}
                                          className={`inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-bold border ${getEstadoColor(estado)}`}
                                          title={`${cantidad} ${formatOptionLabel(estado)}`}
                                        >
                                          {cantidad}
                                        </span>
                                      ))}
                                  </div>
                                  <span className="text-xs font-bold text-gray-900">
                                    {totales.total}
                                  </span>
                                </div>
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-right pr-6 font-bold bg-blue-50 group-hover:bg-blue-100 text-blue-900 text-base sticky right-0 z-10 transition-colors">
                            {articulo.total_general}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    
                    {/* Fila de totales por sede */}
                    {stats.articulos.length > 0 && (
                      <TableRow className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                        <TableCell className="pl-6 text-gray-900 font-bold sticky left-0 bg-gray-100 z-10">Total General</TableCell>
                        {stats.sedes.map((sede) => {
                          // Sumar dinámicamente todos los estados para esta sede
                          const totalesPorEstado: Record<string, number> = {};
                          let totalSede = 0;
                          
                          stats.articulos.forEach((articulo) => {
                            const totales = articulo.totales_por_sede[sede.codigo];
                            if (totales) {
                              Object.entries(totales).forEach(([estado, cantidad]) => {
                                if (estado !== 'total' && typeof cantidad === 'number') {
                                  totalesPorEstado[estado] = (totalesPorEstado[estado] || 0) + cantidad;
                                  totalSede += cantidad;
                                }
                              });
                            }
                          });
                          
                          return (
                            <TableCell key={sede.id} className="text-center py-2">
                              {totalSede === 0 ? (
                                <span className="text-gray-400">-</span>
                              ) : (
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-sm font-bold text-gray-900">{totalSede}</span>
                                  <div className="flex flex-wrap gap-0.5 justify-center text-[9px] font-medium">
                                    {Object.entries(totalesPorEstado)
                                      .filter(([_, cantidad]) => cantidad > 0)
                                      .map(([estado, cantidad]) => (
                                        <span 
                                          key={estado}
                                          className={`px-1 py-0.5 rounded text-[9px] ${getEstadoColor(estado)}`}
                                        >
                                          {cantidad}
                                        </span>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-right pr-6 bg-blue-100 text-blue-900 text-base font-bold sticky right-0 z-10">
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

