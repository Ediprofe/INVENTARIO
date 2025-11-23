'use client';

import { DashboardNav } from '@/components/dashboard';
import { useArticuloStats } from '@/lib/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

/**
 * Página de Inventario por Artículos.
 * 
 * Muestra:
 * - Matriz de artículos x sedes con totales
 * - Solo visualización (sin edición)
 */
export default function InventarioPorArticulos() {
  const { data: stats, isLoading, isError } = useArticuloStats();

  return (
    <>
      <DashboardNav />

      <Card>
        <CardHeader>
          <CardTitle>Inventario por Artículos</CardTitle>
          <CardDescription>
            Total de ítems de cada artículo por sede
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
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Artículo</TableHead>
                    {stats.sedes.map((sede) => (
                      <TableHead key={sede.id} className="text-center">
                        {sede.nombre}
                      </TableHead>
                    ))}
                    <TableHead className="text-right font-bold bg-gray-50">
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
                          {articulo.articulo_nombre}
                        </TableCell>
                        {stats.sedes.map((sede) => (
                          <TableCell key={sede.id} className="text-center">
                            {articulo.totales_por_sede[sede.codigo] || 0}
                          </TableCell>
                        ))}
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
                        const total = stats.articulos.reduce(
                          (sum, articulo) => sum + (articulo.totales_por_sede[sede.codigo] || 0),
                          0
                        );
                        return (
                          <TableCell key={sede.id} className="text-center">
                            {total}
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

