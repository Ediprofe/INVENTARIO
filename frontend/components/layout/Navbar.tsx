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
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">Inventario Escolar</h1>
          </div>

          {/* Usuario y acciones */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{user.first_name || user.username}</span>
                  {user.cargo && (
                    <span className="ml-2 text-gray-500">| {user.cargo}</span>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
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
