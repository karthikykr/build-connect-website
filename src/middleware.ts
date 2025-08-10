import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Public routes that don't require authentication
    const publicRoutes = [
      '/',
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/error',
      '/properties', // Public property listings
      '/brokers', // Public broker directory
      '/contractors', // Public contractor directory
      '/support',
      '/map', // Public map view
      '/chat', // Public chat view
      'ai-features',
    ];

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );

    // Allow access to public routes
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // If user is not authenticated, redirect to login
    if (!token) {
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based route protection
    const userRole = token.role;

    // Admin routes - Allow access in development mode for testing
    if (pathname.startsWith('/admin')) {
      // In development, allow admin access for any authenticated user
      // In production, this should be properly restricted
      const isDevelopment = true; // Hardcoded for development

      if (!isDevelopment && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // For development: Allow admin access for any authenticated user
      console.log(`Admin route access: ${pathname}, User role: ${userRole}, Development mode: ${isDevelopment}`);
    }

    // Broker dashboard routes
    if (pathname.startsWith('/brokers/dashboard') || pathname.startsWith('/brokers/application')) {
      if (userRole !== 'broker' && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Contractor dashboard routes
    if (pathname.startsWith('/contractors/dashboard') || pathname.startsWith('/contractors/application')) {
      if (userRole !== 'contractor' && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Property management routes (only for brokers and admins)
    if (pathname.startsWith('/properties/add') || pathname.startsWith('/properties/edit')) {
      if (userRole !== 'broker' && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/properties', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public routes without token
        const publicRoutes = [
          '/',
          '/auth/login',
          '/auth/register',
          '/auth/forgot-password',
          '/auth/reset-password',
          '/auth/error',
          '/properties',
          '/brokers',
          '/contractors',
          '/support',
          '/map',
          '/chat',
          '/ai-features',
        ];

        const isPublicRoute = publicRoutes.some(route => 
          pathname === route || pathname.startsWith(`${route}/`)
        );

        if (isPublicRoute) {
          return true;
        }

        // For protected routes, require a valid token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
