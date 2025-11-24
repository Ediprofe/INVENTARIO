'use client';

import { useAuthStore } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * Navbar superior simple y elegante con color de marca.
 */
export function TopNavbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        {/* Logo y título */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">
            Inventario Escolar
          </h1>
        </div>

        {/* Usuario y acciones */}
        <div className="flex items-center gap-3">
          {user && (
            <>
              <span className="hidden sm:inline text-sm text-gray-600">
                {user.username}
              </span>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                Cerrar sesión
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
