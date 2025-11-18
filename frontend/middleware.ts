/**
 * Next.js Middleware para proteger rutas con autenticación.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login'];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Obtener token de las cookies o headers
  const token = request.cookies.get('access_token')?.value;

  // Si es ruta pública y el usuario está autenticado, redirigir a dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Si es ruta protegida y no hay token, redirigir a login
  if (!isPublicPath && !token && pathname !== '/login') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
