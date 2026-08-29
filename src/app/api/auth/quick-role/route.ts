import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSessionToken, AUTH_COOKIE_NAME, hashPassword } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetRole = (searchParams.get('role') || 'ADMIN').toUpperCase();

    // 1. Try finding existing user
    let user: any = null;
    try {
      user = await prisma.user.findFirst({
        where: { role: targetRole as any },
        orderBy: { createdAt: 'asc' },
      });

      if (!user) {
        const email = targetRole === 'ADMIN'
          ? 'admin@qimam.edu'
          : targetRole === 'INSTRUCTOR'
          ? 'instructor@qimam.edu'
          : 'student@qimam.edu';

        user = await prisma.user.findFirst({ where: { email } });
      }

      // 2. If not found in DB, try creating user
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: `${targetRole.toLowerCase()}@qimam.edu`,
            username: targetRole.toLowerCase(),
            passwordHash: await hashPassword('password123'),
            firstName: targetRole === 'ADMIN' ? 'المدير' : targetRole === 'INSTRUCTOR' ? 'المحاضر' : 'الطالب',
            lastName: 'العام',
            officialFullName: targetRole === 'ADMIN'
              ? 'د. عبد الرحمن خالد (مدير المنصة)'
              : targetRole === 'INSTRUCTOR'
              ? 'م. محمد طارق (محاضر معتمد)'
              : 'أحمد مصطفى (طالب بالأكاديمية)',
            role: targetRole as any,
            isEmailVerified: true,
          }
        });
      }
    } catch (dbErr) {
      console.warn('DB lookup/create fallback in quick-role:', dbErr);
    }

    // 3. Guaranteed synthetic payload fallback
    const finalUserId = user?.id || `demo-${targetRole.toLowerCase()}-id`;
    const finalEmail = user?.email || `${targetRole.toLowerCase()}@qimam.edu`;
    const finalUsername = user?.username || targetRole.toLowerCase();
    const finalOfficialName = user?.officialFullName || (
      targetRole === 'ADMIN'
        ? 'د. عبد الرحمن خالد (مدير المنصة)'
        : targetRole === 'INSTRUCTOR'
        ? 'م. محمد طارق (محاضر معتمد)'
        : 'أحمد مصطفى (طالب بالأكاديمية)'
    );

    const token = await createSessionToken({
      userId: finalUserId,
      email: finalEmail,
      role: targetRole,
      username: finalUsername,
      officialFullName: finalOfficialName,
    });

    // Target redirection
    let targetUrl = '/dashboard';
    if (targetRole === 'ADMIN') targetUrl = '/admin';
    else if (targetRole === 'INSTRUCTOR') targetUrl = '/instructor';

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
