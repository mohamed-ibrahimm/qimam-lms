import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetRole = (searchParams.get('role') || 'ADMIN').toUpperCase();

    // Find first user matching role or fallback to default
    let user = await prisma.user.findFirst({
      where: { role: targetRole as any },
      orderBy: { createdAt: 'asc' },
    });

    // If not found, fallback to any user or seed accounts
    if (!user) {
      const email = targetRole === 'ADMIN'
        ? 'admin@qimam.edu'
        : targetRole === 'INSTRUCTOR'
        ? 'instructor@qimam.edu'
        : 'student@qimam.edu';

      user = await prisma.user.findFirst({ where: { email } });
    }

    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
      officialFullName: user.officialFullName,
    });

    // Create session record
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    }).catch(() => {});

    // Target redirection
    let targetUrl = '/dashboard';
    if (user.role === 'ADMIN') targetUrl = '/admin';
    else if (user.role === 'INSTRUCTOR') targetUrl = '/instructor';

    if (searchParams.get('redirect')) {
      targetUrl = searchParams.get('redirect')!;
    }

    const response = NextResponse.redirect(new URL(targetUrl, req.url));
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Error in quick-role login:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
