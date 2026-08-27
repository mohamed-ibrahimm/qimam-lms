import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await requireAuth(['ADMIN']);
    const grants = await prisma.manualAccessGrant.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, officialFullName: true, email: true, username: true } },
        grantedBy: { select: { officialFullName: true } },
        course: { select: { title: true } },
        diploma: { select: { title: true } },
      }
    });
    return NextResponse.json({ grants });
  } catch (e) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAuth(['ADMIN']);
    const { userIdentifier, courseId, diplomaId, duration, customDays, reason } = await req.json();

    if (!userIdentifier || (!courseId && !diplomaId)) {
      return NextResponse.json({ error: 'يرجى تحديد المستخدم والكورس/الدبلومة' }, { status: 400 });
    }

    const targetUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userIdentifier.toLowerCase().trim() },
          { username: userIdentifier.toLowerCase().trim() }
        ]
      }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    let expiresAt: Date | null = null;
    let daysCount: number | null = null;

    if (duration === 'DAYS_1') {
      daysCount = 1;
      expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    } else if (duration === 'DAYS_7') {
      daysCount = 7;
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    } else if (duration === 'DAYS_30') {
      daysCount = 30;
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } else if (duration === 'CUSTOM' && customDays) {
      daysCount = parseInt(customDays);
      expiresAt = new Date(Date.now() + daysCount * 24 * 60 * 60 * 1000);
    }

    const grant = await prisma.manualAccessGrant.create({
      data: {
        userId: targetUser.id,
        courseId: courseId || null,
        diplomaId: diplomaId || null,
        grantedById: admin.id,
        accessDuration: duration || 'PERMANENT',
        daysCount,
        expiresAt,
        reason: reason?.trim() || 'منح وصول يدوي من قبل الإدارة',
        status: 'ACTIVE',
      }
    });

    // Create or activate Enrollment
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: courseId ? { userId: targetUser.id, courseId } : undefined,
        userId_diplomaId: diplomaId ? { userId: targetUser.id, diplomaId } : undefined,
      },
      create: {
        userId: targetUser.id,
        courseId: courseId || null,
        diplomaId: diplomaId || null,
        type: courseId ? 'COURSE' : 'DIPLOMA',
        status: 'ACTIVE',
        accessType: expiresAt ? 'TEMPORARY' : 'LIFETIME',
        expiresAt,
        progressPercent: 0,
      },
      update: {
        status: 'ACTIVE',
        accessType: expiresAt ? 'TEMPORARY' : 'LIFETIME',
        expiresAt,
      }
    });

    // Notification
    await prisma.notification.create({
      data: {
        userId: targetUser.id,
        title: '🎁 تم منحك حق الوصول إلى المقرر التدريبي',
        message: `تم منحك وصول ${expiresAt ? `مؤقت حتى ${expiresAt.toLocaleDateString('ar-EG')}` : 'دائم'} من قبل إدارة المنصة.`,
        link: '/dashboard',
        type: 'COURSE',
      }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'MANUAL_ACCESS_GRANTED',
        entity: 'ENROLLMENT',
        detailsJson: JSON.stringify({
          studentEmail: targetUser.email,
          duration,
          expiresAt,
          reason,
        })
      }
    });

    return NextResponse.json({ success: true, grant });
  } catch (error) {
    return NextResponse.json({ error: 'فشل منح الوصول اليدوي' }, { status: 500 });
  }
}