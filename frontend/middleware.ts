import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ################## ----- ADMIN SUBDOMAIN MIDDLEWARE ----- ##################
// Handles routing for admin subdomain (admin.youthcreator.com)
// Ensures admin pages are only accessible via admin subdomain
// ####################################################################

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  
  // Allow admin access during local development
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  
  // Check if this is an admin subdomain request
  const isAdminSubdomain = hostname.startsWith('admin.');
  
  // Check if the path is an admin route
  const isAdminPath = pathname.startsWith('/admin');
  
  // If accessing admin path during local development, allow it
  if (isAdminPath && isLocalhost) {
    return NextResponse.next();
  }
  
  // If accessing admin path but not on admin subdomain (and not localhost), redirect to main site
  if (isAdminPath && !isAdminSubdomain && !isLocalhost) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  // If on admin subdomain but not accessing admin path, redirect to admin dashboard
  if (isAdminSubdomain && !isAdminPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }
  
  // If accessing admin subdomain with admin path, allow the request
  if (isAdminSubdomain && isAdminPath) {
    return NextResponse.next();
  }
  
  // For all other requests, continue normally
  return NextResponse.next();
}

// Configure which paths this middleware should run on
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
