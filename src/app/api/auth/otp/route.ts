import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, code, fullName, role = 'STUDENT' } = body;

    if (!email) {
      return NextResponse.json({ error: 'يرجى إدخال البريد الإلكتروني' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (action === 'send') {
      // Generate 6-digit OTP code
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      let user = await prisma.user.findUnique({
        where: { email: cleanEmail }
      });

      const requestedRole = role === 'INSTRUCTOR' ? 'INSTRUCTOR' : 'STUDENT';
      const isInstructor = requestedRole === 'INSTRUCTOR';
      const now = new Date();
      const trialEndsAt = isInstructor ? new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) : null;

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            emailVerificationToken: otpCode,
            passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000) // 15 mins
          }
        });
      } else {
        // Create pending/new user record for passwordless OTP registration
        const nameParts = (fullName || cleanEmail.split('@')[0]).trim().split(/\s+/);
        const firstName = nameParts[0] || 'مستخدم';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'جديد';
        const randomSuffix = Math.floor(100 + Math.random() * 900);
        const username = `${cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '')}_${randomSuffix}`.slice(0, 30);
        const defaultPasswordHash = await hashPassword(`otp_secure_pwd_${Date.now()}`);

        user = await prisma.user.create({
          data: {
            email: cleanEmail,
            firstName,
            lastName,
            officialFullName: fullName?.trim() || `${firstName} ${lastName}`,
            username,
            passwordHash: defaultPasswordHash,
            role: requestedRole,
            isEmailVerified: false,
            emailVerificationToken: otpCode,
            passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000),
            instructorStatus: isInstructor ? 'TRIAL' : 'TRIAL',
            trialEndsAt,
            subscriptionPlan: isInstructor ? 'FREE_TRIAL' : 'FREE_TRIAL',
          }
        });
      }

      console.log(`[OTP VERIFICATION CODE FOR ${cleanEmail}]: ${otpCode}`);

      return NextResponse.json({
        success: true,
        message: `تم إرسال كود الدخول والتحقق إلى ${cleanEmail}`,
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
        return NextResponse.json({ error: 'البريد الإلكتروني غير مسجل، يرجى طلب كود جديد' }, { status: 404 });
      }

      if (!user.emailVerificationToken || user.emailVerificationToken !== code.trim()) {
        return NextResponse.json({ error: 'كود التحقق غير صحيح، يرجى التأكد وإعادة المحاولة' }, { status: 400 });
      }

      // Check expiration if set
      if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
        return NextResponse.json({ error: 'انتهت صلاحية كود التحقق، يرجى طلب كود جديد' }, { status: 400 });
      }

      // Mark user as verified and clear OTP
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          emailVerificationToken: null,
          passwordResetExpires: null,
        }
      });

      // Issue JWT session token
      const token = await createSessionToken({
        userId: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        username: updatedUser.username,
        officialFullName: updatedUser.officialFullName,
      });

      const response = NextResponse.json({
        success: true,
        message: 'تم تسجيل الدخول وتأكيد الحساب بنجاح',
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
