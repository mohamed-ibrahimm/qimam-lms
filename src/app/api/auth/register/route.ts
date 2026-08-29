import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName,
      fatherName,
      lastName,
      officialFullName,
      username,
      email,
      phone,
      password,
    } = body;

    if (!firstName || !lastName || !username || !email || !password) {
      return NextResponse.json({ error: 'يرجى ملء جميع الحقول الإلزامية' }, { status: 400 });
    }

    // Check duplicate email or username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase().trim() },
          { username: username.toLowerCase().trim() }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.toLowerCase().trim()) {
        return NextResponse.json({ error: 'البريد الإلكتروني مسجل بالفعل' }, { status: 400 });
      }
      return NextResponse.json({ error: 'اسم المستخدم محجوز بالفعل' }, { status: 400 });
    }

    const calculatedOfficialName = officialFullName?.trim() || `${firstName.trim()} ${fatherName ? fatherName.trim() + ' ' : ''}${lastName.trim()}`;
    const passwordHash = await hashPassword(password);

    const requestedRole = body.role === 'INSTRUCTOR' ? 'INSTRUCTOR' : 'STUDENT';
    const isInstructor = requestedRole === 'INSTRUCTOR';
    const now = new Date();
    const trialEndsAt = isInstructor ? new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) : null;

    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        fatherName: fatherName?.trim() || null,
        lastName: lastName.trim(),
        officialFullName: calculatedOfficialName,
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        passwordHash,
        role: requestedRole,
        instructorStatus: isInstructor ? 'TRIAL' : 'TRIAL',
        trialEndsAt: trialEndsAt,
        subscriptionPlan: isInstructor ? 'FREE_TRIAL' : 'FREE_TRIAL',
        isEmailVerified: true,
      }
    });

    // Create session token
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
      officialFullName: user.officialFullName,
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        entity: 'USER',
        entityId: user.id,
        detailsJson: JSON.stringify({ email: user.email, role: user.role }),
      }
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
      redirectTo: isInstructor ? '/instructor' : '/dashboard',
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى' }, { status: 500 });
  }
}