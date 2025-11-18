'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // No mostrar navbar en la página de login
  const showNavbar = pathname !== '/login';

  return (
    <>
      {showNavbar && <Navbar />}
      <main className={showNavbar ? 'container mx-auto px-4 py-8' : ''}>
        {children}
      </main>
    </>
  );
}
