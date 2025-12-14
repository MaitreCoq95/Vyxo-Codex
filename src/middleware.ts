import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityMiddleware, withSecurityHeaders, getCorsHeaders } from '@/lib/api/security';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 1. Security checks
  const securityCheck = await securityMiddleware(req);
  if (!securityCheck.allowed) {
    console.warn('🚨 Security check failed:', securityCheck.reason);
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 2. CORS headers for API routes
  if (req.nextUrl.pathname.startsWith('/api')) {
    const origin = req.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);

    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.headers.set(key, value);
    });

    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: corsHeaders as HeadersInit,
      });
    }
  }

  // 3. Supabase auth session refresh
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options });
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: '', ...options });
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // 4. Protected routes - redirect to login
  const protectedPaths = ['/dashboard', '/codex', '/challenge', '/director', '/manager']
  const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))

  if (isProtectedPath && !session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 5. Role-based access control
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    // Director-only routes
    if (req.nextUrl.pathname.startsWith('/director') && profile?.role !== 'director') {
      return new NextResponse('Access Denied', { status: 403 })
    }

    // Manager-only routes
    if (req.nextUrl.pathname.startsWith('/manager') && !['manager', 'director'].includes(profile?.role || '')) {
      return new NextResponse('Access Denied', { status: 403 })
    }
  }

  // 6. Apply security headers to all responses
  return withSecurityHeaders(res)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sw.js|icons).*)',
  ],
}
