import type { NextApiRequest, NextApiResponse } from 'next';

const UPSTREAM_ORIGIN = 'https://creatorlaunchforms.qwentin-856.workers.dev';
const PROXY_PREFIX = '/api/boardapplication-proxy';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

const readRequestBody = async (request: NextApiRequest) => {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
};

const getUpstreamUrl = (request: NextApiRequest) => {
  const rawPath = request.query.path;
  const path = Array.isArray(rawPath)
    ? rawPath.map(segment => encodeURIComponent(segment)).join('/')
    : '';
  const upstreamUrl = new URL(path ? `/${path}` : '/', UPSTREAM_ORIGIN);

  Object.entries(request.query).forEach(([key, value]) => {
    if (key === 'path' || value === undefined) return;

    const values = Array.isArray(value) ? value : [value];
    values.forEach(item => upstreamUrl.searchParams.append(key, item));
  });

  return upstreamUrl;
};

const rewriteTextResponse = (body: string, contentType: string) => {
  if (contentType.includes('text/html')) {
    return body.replace(/(["'])\/(?!\/)/g, `$1${PROXY_PREFIX}/`);
  }

  if (contentType.includes('javascript')) {
    return body.replace(/`\/(?!\/)/g, `\`${PROXY_PREFIX}/`);
  }

  if (contentType.includes('text/css')) {
    return body
      .replace(/url\((['"]?)\/(?!\/)/g, `url($1${PROXY_PREFIX}/`)
      .replace(/@import\s+(['"])\/(?!\/)/g, `@import $1${PROXY_PREFIX}/`);
  }

  return body;
};

const rewriteCookie = (cookie: string) => {
  const withoutDomain = cookie.replace(/;\s*Domain=[^;]*/gi, '');

  if (/;\s*Path=/i.test(withoutDomain)) {
    return withoutDomain.replace(
      /;\s*Path=[^;]*/i,
      `; Path=${PROXY_PREFIX}`,
    );
  }

  return `${withoutDomain}; Path=${PROXY_PREFIX}`;
};

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const upstreamUrl = getUpstreamUrl(request);
  const method = request.method ?? 'GET';
  const headers = new Headers();

  ['accept', 'accept-language', 'content-type', 'cookie', 'user-agent'].forEach(
    header => {
      const value = request.headers[header];
      if (typeof value === 'string') headers.set(header, value);
    },
  );

  headers.set('origin', UPSTREAM_ORIGIN);
  headers.set('referer', upstreamUrl.toString());

  const body = method === 'GET' || method === 'HEAD'
    ? undefined
    : await readRequestBody(request);
  const upstreamResponse = await fetch(upstreamUrl, {
    method,
    headers,
    body,
    redirect: 'manual',
  });
  const contentType = upstreamResponse.headers.get('content-type') ?? '';

  response.status(upstreamResponse.status);
  response.setHeader('X-Robots-Tag', 'noindex, nofollow');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'",
  );

  ['cache-control', 'content-disposition', 'etag', 'last-modified'].forEach(
    header => {
      const value = upstreamResponse.headers.get(header);
      if (value) response.setHeader(header, value);
    },
  );

  if (contentType) response.setHeader('Content-Type', contentType);

  const location = upstreamResponse.headers.get('location');
  if (location) {
    const redirectUrl = new URL(location, upstreamUrl);
    const redirectPath = `${redirectUrl.pathname}${redirectUrl.search}`;
    response.setHeader('Location', `${PROXY_PREFIX}${redirectPath}`);
  }

  const responseHeaders = upstreamResponse.headers as Headers & {
    getSetCookie?: () => string[];
  };
  const cookies = responseHeaders.getSetCookie?.()
    ?? (upstreamResponse.headers.get('set-cookie')
      ? [upstreamResponse.headers.get('set-cookie') as string]
      : []);

  if (cookies.length) {
    response.setHeader('Set-Cookie', cookies.map(rewriteCookie));
  }

  if (method === 'HEAD' || upstreamResponse.status === 204) {
    response.end();
    return;
  }

  const isTextResponse = contentType.includes('text/html')
    || contentType.includes('javascript')
    || contentType.includes('text/css');

  if (isTextResponse) {
    const rewrittenBody = rewriteTextResponse(
      await upstreamResponse.text(),
      contentType,
    );
    response.send(rewrittenBody);
    return;
  }

  const upstreamBody = Buffer.from(await upstreamResponse.arrayBuffer());
  response.send(upstreamBody);
};

export default handler;
