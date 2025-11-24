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
      <div className="border-b border-gray-200 pb-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1.5">
              Sistema de Inventario
            </h1>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Gestión integral de ítems y recursos institucionales
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">Sistema Activo</span>
          </div>
        </div>
      </div>
      
      <Tabs value={getActiveTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-gray-50 rounded-lg border border-gray-200">
          <TabsTrigger 
            value="general" 
            asChild
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all rounded-md"
          >
            <Link href="/" className="flex items-center gap-2 py-2.5 px-3 group">
              <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center group-data-[state=active]:bg-blue-600 transition-colors">
                <svg className="w-5 h-5 text-blue-700 group-data-[state=active]:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                  <line x1="3" y1="9" x2="21" y2="9" strokeWidth="2"/>
                  <line x1="9" y1="21" x2="9" y2="9" strokeWidth="2"/>
                </svg>
              </div>
              <span className="font-semibold text-sm text-gray-700 group-data-[state=active]:text-gray-900">Tabla General</span>
            </Link>
          </TabsTrigger>
          
          <TabsTrigger 
            value="ubicaciones" 
            asChild
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all rounded-md"
          >
            <Link href="/inventario/ubicaciones" className="flex items-center gap-2 py-2.5 px-3 group">
              <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center group-data-[state=active]:bg-green-600 transition-colors">
                <svg className="w-5 h-5 text-green-700 group-data-[state=active]:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3" strokeWidth="2"/>
                </svg>
              </div>
              <span className="font-semibold text-sm text-gray-700 group-data-[state=active]:text-gray-900">Ubicaciones</span>
            </Link>
          </TabsTrigger>
          
          <TabsTrigger 
            value="responsables" 
            asChild
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all rounded-md"
          >
            <Link href="/inventario/responsables" className="flex items-center gap-2 py-2.5 px-3 group">
              <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center group-data-[state=active]:bg-purple-600 transition-colors">
                <svg className="w-5 h-5 text-purple-700 group-data-[state=active]:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4" strokeWidth="2"/>
                  <path strokeWidth="2" d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path strokeWidth="2" d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <span className="font-semibold text-sm text-gray-700 group-data-[state=active]:text-gray-900">Responsables</span>
            </Link>
          </TabsTrigger>
          
          <TabsTrigger 
            value="articulos" 
            asChild
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all rounded-md"
          >
            <Link href="/inventario/articulos" className="flex items-center gap-2 py-2.5 px-3 group">
              <div className="w-8 h-8 rounded-md bg-orange-100 flex items-center justify-center group-data-[state=active]:bg-orange-600 transition-colors">
                <svg className="w-5 h-5 text-orange-700 group-data-[state=active]:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
                  <path strokeWidth="2" d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/>
                  <path strokeWidth="2" d="M12 3v6"/>
                </svg>
              </div>
              <span className="font-semibold text-sm text-gray-700 group-data-[state=active]:text-gray-900">Artículos</span>
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

