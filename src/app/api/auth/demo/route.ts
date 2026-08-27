import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const role = request.nextUrl.searchParams.get('role') || 'ADMIN';
  const validRole = (role === 'INSTRUCTOR' || role === 'STUDENT') ? role : 'ADMIN';

  const user = await prisma.user.findFirst({
    where: { role: validRole },
    select: {
      id: true,
      email: true,
      role: true,
      username: true,
      officialFullName: true,
      firstName: true,
    }
  });

  if (!user) {
    return NextResponse.redirect(new URL('/login?error=user_not_found', request.url));
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    username: user.username,
    officialFullName: user.officialFullName || user.firstName || 'مستخدم المنصة',
  });

  let targetUrl = '/dashboard';
  if (user.role === 'ADMIN') targetUrl = '/admin';
  else if (user.role === 'INSTRUCTOR') targetUrl = '/instructor';

  const response = NextResponse.redirect(new URL(targetUrl, request.url));

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return response;
}
