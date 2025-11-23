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
    <div className="mb-8">
      <div className="border-b border-border/50 pb-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
          Sistema de Inventario
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestión integral de ítems y recursos institucionales
        </p>
      </div>
      
      <Tabs value={getActiveTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50 backdrop-blur-sm">
          <TabsTrigger 
            value="general" 
            asChild
            className="data-[state=active]:bg-card data-[state=active]:shadow-md transition-all"
          >
            <Link href="/" className="flex items-center gap-2 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
              <span>Tabla General</span>
            </Link>
          </TabsTrigger>
          
          <TabsTrigger 
            value="ubicaciones" 
            asChild
            className="data-[state=active]:bg-card data-[state=active]:shadow-md transition-all"
          >
            <Link href="/inventario/ubicaciones" className="flex items-center gap-2 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Por Ubicaciones</span>
            </Link>
          </TabsTrigger>
          
          <TabsTrigger 
            value="responsables" 
            asChild
            className="data-[state=active]:bg-card data-[state=active]:shadow-md transition-all"
          >
            <Link href="/inventario/responsables" className="flex items-center gap-2 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Por Responsables</span>
            </Link>
          </TabsTrigger>
          
          <TabsTrigger 
            value="articulos" 
            asChild
            className="data-[state=active]:bg-card data-[state=active]:shadow-md transition-all"
          >
            <Link href="/inventario/articulos" className="flex items-center gap-2 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
                <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/>
                <path d="M12 3v6"/>
              </svg>
              <span>Por Artículos</span>
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

