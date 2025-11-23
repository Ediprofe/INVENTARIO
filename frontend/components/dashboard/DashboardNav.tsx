'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Componente de navegación del dashboard de inventario.
 * 
 * Proporciona navegación entre las diferentes vistas:
 * - Tabla General
 * - Por Ubicaciones
 * - Por Responsables
 * - Por Artículos
 */
export function DashboardNav() {
  const pathname = usePathname();

  // Determinar la vista activa basándose en la ruta
  const getActiveTab = () => {
    if (pathname === '/') return 'general';
    if (pathname.startsWith('/inventario/ubicaciones')) return 'ubicaciones';
    if (pathname.startsWith('/inventario/responsables')) return 'responsables';
    if (pathname.startsWith('/inventario/articulos')) return 'articulos';
    return 'general';
  };

  return (
    <div className="mb-6">
      <Tabs value={getActiveTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" asChild>
            <Link href="/">Tabla General</Link>
          </TabsTrigger>
          
          <TabsTrigger value="ubicaciones" asChild>
            <Link href="/inventario/ubicaciones">Por Ubicaciones</Link>
          </TabsTrigger>
          
          <TabsTrigger value="responsables" asChild>
            <Link href="/inventario/responsables">Por Responsables</Link>
          </TabsTrigger>
          
          <TabsTrigger value="articulos" asChild>
            <Link href="/inventario/articulos">Por Artículos</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

