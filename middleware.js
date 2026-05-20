import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const apiRequestMap = new Map();

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  const currentOrigin = req.nextUrl.origin;

  // Get request headers for API protection
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const isInternalRequest = req.headers.get('x-internal-request') === process.env.INTERNAL_REQUEST_SECRET;
  const isReadOnlyRequest = req.method === 'GET' || req.method === 'HEAD';
  const publicSiteReadApiPrefixes = [
    '/api/site/categories',
    '/api/site/common',
    '/api/site/header',
    '/api/site/home',
    '/api/site/product',
    '/api/site/search',
  ];

  // Define allowed origins
  const allowedOrigins = [
    currentOrigin,
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_PAYMENT_SITE_URL,
    ...(process.env.VERCEL_DEPLOYMENT_URL ? process.env.VERCEL_DEPLOYMENT_URL.split(',') : []),
    ...(process.env.SITE_ENV === 'development'
      ? ['http://localhost:5100']
      : [])
  ].map(url => url?.trim()).filter(Boolean);

  // Check if it's an API route
  if (pathname.startsWith('/api')) {
    // Skip middleware for payment webhook endpoints
    if (pathname.startsWith('/api/site/order/payment/cybersource/validate') ||
      pathname.startsWith('/api/site/order/payment/koko/validate') ||
      pathname.startsWith('/api/site/order/payment/payhere/validate') ||
      pathname.startsWith('/api/site/order/payment/paypal/validate') ||
      pathname.startsWith('/api/site/payment/cross-site/callback') ||
      pathname.startsWith('/api/site/order/payment/cross-site/validate') ||
      pathname.startsWith('/api/site/order/payment/stripe/validate')) {
      return NextResponse.next();
    }

    // Rate limiting logic
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const now = Date.now();
    const requestCount = apiRequestMap.get(ip) || { count: 0, timestamp: now };

    // Clean up old entries
    if (now - requestCount.timestamp > 3600000) {
      apiRequestMap.delete(ip);
    }

    // Check rate limits
    if (now - requestCount.timestamp < 60000) {
      if (requestCount.count > 100) {
        return new NextResponse(
          JSON.stringify({
            error: 'Too many requests',
            retryAfter: '60 seconds'
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '60',
              'X-RateLimit-Limit': '100',
              'X-RateLimit-Remaining': '0'
            }
          }
        );
      }
      requestCount.count++;
    } else {
      requestCount.count = 1;
      requestCount.timestamp = now;
    }

    apiRequestMap.set(ip, requestCount);

    // Allow internal requests to bypass origin check
    if (!isInternalRequest) {
      const isPublicSiteReadApi = isReadOnlyRequest && publicSiteReadApiPrefixes.some(prefix =>
        pathname === prefix || pathname.startsWith(`${prefix}/`)
      );

      // Origin check for external API requests
      const isAllowedOrigin = allowedOrigins.some(allowed =>
        origin === allowed || referer?.startsWith(allowed)
      ) || (isPublicSiteReadApi && !origin && !referer);

      if (!isAllowedOrigin) {
        console.log('Blocked API request from unauthorized origin:', origin);
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized access' }),
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }

    // Special protection for send-mail endpoint
    if (pathname.startsWith('/api/send-mail')) {
      if (!isInternalRequest) {
        console.log('Blocked unauthorized access to send-mail endpoint');
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized access' }),
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
      }
    }

    // Admin route protection
    if (pathname.startsWith('/api/admin')) {
      const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];

      if (!token || !acceptRoles.some((d) => d === token?.role)) {
        console.log('Blocked non-admin API access attempt');
        return new NextResponse(
          JSON.stringify({ error: 'Admin access required' }),
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }
  }

  // Rest of your existing authentication logic
  if (token) {
    const capabilities = token.capabilities || [];

    const userRole = token.role;

    if (pathname === '/auth/login') {
      const adminUrl = new URL('/admin', req.url);
      return NextResponse.redirect(adminUrl);
    }

    if (userRole === "user" && pathname.startsWith('/admin')) {
      const accountUrl = new URL('/account', req.url);
      return NextResponse.redirect(accountUrl);
    }
  }

  if (!token && pathname.startsWith('/admin')) {
    const loginUrl = new URL('/auth/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/auth/login',
    '/admin/:path*',
    '/api/:path*'
  ],
};
