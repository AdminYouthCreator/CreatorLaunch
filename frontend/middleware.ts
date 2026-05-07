import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROOT_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'creatorlaunch-frontend.onrender.com',
  'youthcreatorlaunch.org',
  'www.youthcreatorlaunch.org',
  'mycreatorlaunch.me',
  'www.mycreatorlaunch.me',
];

const getHostname = (request: NextRequest) => {
  const host = request.headers.get('host') || request.nextUrl.hostname || '';
  return host.split(':')[0].toLowerCase();
};

const shouldIgnorePath = (pathname: string) => {
  return (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.')
  );
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const hostname = getHostname(request);

  if (shouldIgnorePath(pathname)) {
    return NextResponse.next();
  }

  const isLocalhost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.localhost');

  const isAdminSubdomain = hostname.startsWith('admin.');
  const isAdminPath = pathname.startsWith('/admin');

  // Allow local admin development.
  if (isAdminPath && isLocalhost) {
    return NextResponse.next();
  }

  // Admin paths must use admin subdomain in production.
  if (isAdminPath && !isAdminSubdomain && !isLocalhost) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // admin.youthcreatorlaunch.org -> /admin
  if (isAdminSubdomain && !isAdminPath) {
    url.pathname = '/admin';
    return NextResponse.rewrite(url);
  }

  if (isAdminSubdomain && isAdminPath) {
    return NextResponse.next();
  }

  // Main/root domains behave normally.
  if (ROOT_DOMAINS.includes(hostname) || isLocalhost) {
    return NextResponse.next();
  }

  // Store subdomain routing:
  // demo.youthcreatorlaunch.org -> /store/demo
  // demo.mycreatorlaunch.me -> /store/demo
  const subdomain = hostname.split('.')[0];

  if (!subdomain || subdomain === 'www' || subdomain === 'admin') {
    return NextResponse.next();
  }

  // Do not rewrite if already on /store.
  if (pathname.startsWith('/store')) {
    return NextResponse.next();
  }

  url.pathname = `/store/${subdomain}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
