import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { provider, role = 'STUDENT', email, name, avatarUrl } = body;

    if (!provider) {
      return NextResponse.json({ error: 'يرجى تحديد مزود تسجيل الدخول' }, { status: 400 });
    }

    // Determine default or provided profile info
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const userEmail = email?.toLowerCase().trim() || `${provider}_user_${randomSuffix}@gmail.com`;
    const userFullName = name?.trim() || (
      provider === 'google' ? 'مستخدم حساب جوجل' :
      provider === 'github' ? 'مستخدم حساب جيت هاب' : 'مستخدم حساب فيسبوك'
    );

    const nameParts = userFullName.split(/\s+/);
    const firstName = nameParts[0] || 'مستخدم';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'المنصة';

    const requestedRole = role === 'INSTRUCTOR' ? 'INSTRUCTOR' : 'STUDENT';
    const isInstructor = requestedRole === 'INSTRUCTOR';
    const now = new Date();
    const trialEndsAt = isInstructor ? new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) : null;

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    // If requireOtp flag is set (for new social registration flow)
    const { requireOtp } = body;

    if (!user) {
      const generatedUsername = `${provider}_${userEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '')}_${randomSuffix}`.slice(0, 30);
      const defaultPasswordHash = await hashPassword(`social_auth_secure_pwd_${Date.now()}`);
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      user = await prisma.user.create({
        data: {
          email: userEmail,
          firstName,
          lastName,
          officialFullName: userFullName,
          username: generatedUsername,
          passwordHash: defaultPasswordHash,
          role: requestedRole,
          avatarUrl: avatarUrl || null,
          isEmailVerified: !requireOtp,
          emailVerificationToken: requireOtp ? otpCode : null,
          passwordResetExpires: requireOtp ? new Date(Date.now() + 15 * 60 * 1000) : null,
          instructorStatus: isInstructor ? 'TRIAL' : 'TRIAL',
          trialEndsAt,
          subscriptionPlan: isInstructor ? 'FREE_TRIAL' : 'FREE_TRIAL',
        }
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_REGISTERED_SOCIAL',
          entity: 'USER',
          entityId: user.id,
          detailsJson: JSON.stringify({ email: user.email, provider, role: user.role }),
        }
      });

      if (requireOtp) {
        console.log(`[SOCIAL REGISTRATION OTP CODE FOR ${userEmail}]: ${otpCode}`);
        return NextResponse.json({
          success: true,
          requiresOtp: true,
          email: userEmail,
          demoCode: otpCode,
          message: `تم ربط حساب ${provider === 'google' ? 'جوجل' : provider === 'github' ? 'جيت هاب' : 'فيسبوك'}، تم إرسال كود التحقق (OTP) إلى ${userEmail}`
        });
      }
    } else if (requireOtp && !user.isEmailVerified) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationToken: otpCode,
          passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000),
        }
      });
      return NextResponse.json({
        success: true,
        requiresOtp: true,
        email: userEmail,
        demoCode: otpCode,
        message: `تم إرسال كود التحقق (OTP) إلى ${userEmail}`
      });
    }

    // Generate JWT Session Token
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
      officialFullName: user.officialFullName,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
        officialFullName: user.officialFullName,
      },
      redirectTo: user.role === 'INSTRUCTOR' ? '/instructor' : user.role === 'ADMIN' ? '/admin' : '/dashboard',
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Social Auth Error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تسجيل الدخول بالمزود الاجتماعي' }, { status: 500 });
  }
}
