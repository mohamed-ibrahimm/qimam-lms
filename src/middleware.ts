import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'qimam-super-secure-production-ready-jwt-secret-key-2026'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('qimam_session')?.value;

  let userRole: string | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      userRole = (payload as any)?.role || null;
    } catch (e) {}
  }

  // Admin Routes protection
  if (pathname.startsWith('/admin')) {
    if (!token || userRole !== 'ADMIN') {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      url.searchParams.set('error', 'unauthorized_admin');
      return NextResponse.redirect(url);
    }
  }

  // Instructor Routes protection
  if (pathname.startsWith('/instructor')) {
    if (!token || (userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN')) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      url.searchParams.set('error', 'unauthorized_instructor');
      return NextResponse.redirect(url);
    }
  }

  // Student Dashboard & Learning Routes protection
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/learn') || pathname.startsWith('/checkout')) {
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect /api/admin API routes
  if (pathname.startsWith('/api/admin')) {
    if (pathname.startsWith('/api/admin/courses')) {
      if (!token || (userRole !== 'ADMIN' && userRole !== 'INSTRUCTOR')) {
        return NextResponse.json({ error: 'غير مصرح: هذا الإجراء يتطلب صلاحيات المحاضر أو المدير' }, { status: 403 });
      }
    } else if (!token || userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح: هذا الإجراء يتطلب صلاحيات مدير المنصة' }, { status: 403 });
    }
  }

  // Protect /api/instructor API routes
  if (pathname.startsWith('/api/instructor')) {
    if (!token || (userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح: هذا الإجراء يتطلب صلاحيات المحاضر' }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/instructor/:path*',
    '/dashboard/:path*',
    '/learn/:path*',
    '/checkout/:path*',
    '/api/admin/:path*',
    '/api/instructor/:path*',
  ],
};