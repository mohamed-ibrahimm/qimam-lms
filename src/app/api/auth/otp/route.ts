import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, code } = body;

    if (!email) {
      return NextResponse.json({ error: 'يرجى إدخال البريد الإلكتروني' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (action === 'send') {
      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Find user or prepare verification
      let user = await prisma.user.findUnique({
        where: { email: cleanEmail }
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            emailVerificationToken: otpCode,
            passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000) // 15 mins
          }
        });
      }

      console.log(`[OTP VERIFICATION CODE FOR ${cleanEmail}]: ${otpCode}`);

      return NextResponse.json({
        success: true,
        message: `تم إرسال كود التحقق بنجاح إلى ${cleanEmail}`,
        // For developer / quick testing convenience
        demoCode: otpCode,
      });
    }

    if (action === 'verify') {
      if (!code) {
        return NextResponse.json({ error: 'يرجى إدخال كود التحقق المكون من 6 أرقام' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { email: cleanEmail }
      });

      if (!user) {
        return NextResponse.json({ error: 'البريد الإلكتروني غير مسجل' }, { status: 404 });
      }

      if (user.emailVerificationToken !== code.trim()) {
        return NextResponse.json({ error: 'كود التحقق غير صحيح، يرجى المحاولة مرة أخرى' }, { status: 400 });
      }

      // Mark verified
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          emailVerificationToken: null,
        }
      });

      // Create session
      const token = await createSessionToken({
        userId: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        username: updatedUser.username,
        officialFullName: updatedUser.officialFullName,
      });

      const response = NextResponse.json({
        success: true,
        message: 'تم تأكيد الحساب بنجاح',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
          username: updatedUser.username,
          officialFullName: updatedUser.officialFullName,
        },
        redirectTo: updatedUser.role === 'INSTRUCTOR' ? '/instructor' : updatedUser.role === 'ADMIN' ? '/admin' : '/dashboard',
      });

      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'إجراء غير صالح' }, { status: 400 });
  } catch (error: any) {
    console.error('OTP Error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء معالجة كود التحقق' }, { status: 500 });
  }
}
