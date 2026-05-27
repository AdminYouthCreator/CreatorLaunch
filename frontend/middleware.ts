import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const maintenanceConfig = {
  maintenanceMode: false,
};

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
    pathname.startsWith('/images') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.includes('.')
  );
};

const isRootDomain = (hostname: string) => {
  return (
    ROOT_DOMAINS.includes(hostname) ||
    hostname.endsWith('.vercel.app') ||
    hostname.endsWith('.vercel.dev')
  );
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const hostname = getHostname(request);

  if (shouldIgnorePath(pathname)) {
    return NextResponse.next();
  }

  if (maintenanceConfig.maintenanceMode && pathname !== '/maintenance') {
    url.pathname = '/maintenance';
    return NextResponse.redirect(url);
  }

  if (pathname === '/maintenance') {
    return NextResponse.next();
  }

  const isLocalhost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.localhost');

  if (isLocalhost) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const isAdminSubdomain = hostname.startsWith('admin.');

  if (isAdminSubdomain) {
    url.pathname = `/admin${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
  }

  if (isRootDomain(hostname)) {
    return NextResponse.next();
  }

  const subdomain = hostname.split('.')[0];

  if (!subdomain || subdomain === 'www' || subdomain === 'admin') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/store')) {
    return NextResponse.next();
  }

  url.pathname = `/store/${subdomain}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
