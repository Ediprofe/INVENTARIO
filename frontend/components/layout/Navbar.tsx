'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    // Limpiar cookie del middleware
    document.cookie = 'access_token=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <nav className="border-b bg-gradient-to-r from-blue-600 to-blue-700 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-white">Inventario Escolar</h1>
          </div>

          {/* Usuario y acciones */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="hidden sm:block text-sm text-white/90">
                  <span className="font-medium">{user.first_name || user.username}</span>
                  {user.cargo && (
                    <span className="ml-2 text-white/70">| {user.cargo}</span>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-white hover:bg-white/20 hover:text-white"
                >
                  Cerrar sesión
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
