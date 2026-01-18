import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Check if user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const token = req.nextauth.token;
      
      // Check if user has admin or moderator role
      if (!token || (token.role !== 'ADMIN' && token.role !== 'MODERATOR')) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (!req.nextUrl.pathname.startsWith('/admin')) {
          return true;
        }
        
        // For admin routes, check if user is authenticated
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/users/:path*',
    '/api/tasks/:path*',
    '/api/languages/:path*',
    '/api/settings/:path*',
    '/api/stats/:path*',
  ],
};