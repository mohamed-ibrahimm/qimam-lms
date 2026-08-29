import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { evaluateInstructorSubscription } from '@/lib/instructor-subscription';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAuth(['ADMIN']);

    const instructors = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'INSTRUCTOR' },
          { role: 'ADMIN' },
        ]
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        role: true,
        firstName: true,
        lastName: true,
        officialFullName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        instructorStatus: true,
        trialEndsAt: true,
        subscriptionPlan: true,
        subscriptionEndsAt: true,
        instapayAddress: true,
        instapayName: true,
        vodafoneCashNumber: true,
        createdAt: true,
        _count: {
          select: {
            instructedCourses: true,
          }
        },
        instructorSubscriptionPayments: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        }
      }
    });

    const pendingSubscriptionPayments = await prisma.instructorSubscriptionPayment.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      include: {
        instructor: {
          select: { id: true, officialFullName: true, email: true, phone: true }
        }
      }
    });

    const enriched = instructors.map((inst) => {
      const sub = evaluateInstructorSubscription(inst);
      return {
        ...inst,
        subscriptionState: sub,
      };
    });

    return NextResponse.json({
      success: true,
      instructors: enriched,
      pendingSubscriptions: pendingSubscriptionPayments,
    });
  } catch (error) {
    console.error('Failed to fetch admin instructors:', error);
    return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 403 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireAuth(['ADMIN']);
    const body = await req.json();
    const { action, instructorId, paymentId, plan, durationMonths, status, notes } = body;

    if (action === 'APPROVE_SUBSCRIPTION') {
      if (!paymentId) {
        return NextResponse.json({ error: 'معرف طلب الاشتراك مطلوب' }, { status: 400 });
      }

      const payment = await prisma.instructorSubscriptionPayment.findUnique({
        where: { id: paymentId },
        include: { instructor: true }
      });

      if (!payment) {
        return NextResponse.json({ error: 'طلب الاشتراك غير موجود' }, { status: 404 });
      }

      const months = payment.durationMonths || 1;
      const now = new Date();
      // If current subscription is still active, extend from current end, else from now
      let baseDate = now;
      if (payment.instructor.subscriptionEndsAt && new Date(payment.instructor.subscriptionEndsAt) > now) {
        baseDate = new Date(payment.instructor.subscriptionEndsAt);
      }
      const newEnd = new Date(baseDate.getTime() + months * 30 * 24 * 60 * 60 * 1000);

      await prisma.instructorSubscriptionPayment.update({
        where: { id: payment.id },
        data: {
          status: 'APPROVED',
          adminNotes: notes || 'تم التحقق من استلام اشتراك المحاضر وتفعيل حسابه بنجاح',
          reviewedById: admin.id,
          reviewedAt: new Date(),
        }
      });

      await prisma.user.update({
        where: { id: payment.instructorId },
        data: {
          instructorStatus: 'ACTIVE',
          subscriptionPlan: payment.plan,
          subscriptionEndsAt: newEnd,
        }
      });

      await prisma.notification.create({
        data: {
          userId: payment.instructorId,
          title: '🎉 تم تفعيل وتجديد اشتراكك في الأكاديمية بنجاح!',
          message: `تم اعتماد إيصال سداد الاشتراك (${payment.plan === 'ANNUAL' ? 'السنوي' : 'الشهري'}) وحسابك نشط الآن حتى ${newEnd.toLocaleDateString('ar-EG')}.`,
          link: '/instructor',
          type: 'PAYMENT',
        }
      });

      return NextResponse.json({ success: true, message: 'تم اعتماد اشتراك المحاضر بنجاح' });
    }

    if (action === 'REJECT_SUBSCRIPTION') {
      if (!paymentId) {
        return NextResponse.json({ error: 'معرف طلب الاشتراك مطلوب' }, { status: 400 });
      }

      await prisma.instructorSubscriptionPayment.update({
        where: { id: paymentId },
        data: {
          status: 'REJECTED',
          adminNotes: notes || 'تعذر التحقق من عملية التحويل',
          reviewedById: admin.id,
          reviewedAt: new Date(),
        }
      });

      return NextResponse.json({ success: true, message: 'تم رفض طلب الاشتراك' });
    }

    if (action === 'MANUAL_UPDATE') {
      if (!instructorId) {
        return NextResponse.json({ error: 'معرف المحاضر مطلوب' }, { status: 400 });
      }

      const updateData: any = {};
      if (status) updateData.instructorStatus = status;
      if (plan) updateData.subscriptionPlan = plan;
      if (durationMonths) {
        const addedDays = parseInt(durationMonths) * 30;
        updateData.subscriptionEndsAt = new Date(Date.now() + addedDays * 24 * 60 * 60 * 1000);
        updateData.instructorStatus = 'ACTIVE';
      }

      const updated = await prisma.user.update({
        where: { id: instructorId },
        data: updateData,
      });

      return NextResponse.json({ success: true, message: 'تم تحديث بيانات اشتراك المحاضر بنجاح', instructor: updated });
    }

    return NextResponse.json({ error: 'إجراء غير صالح' }, { status: 400 });
  } catch (error) {
    console.error('Failed to update admin instructor:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تنفيذ الإجراء' }, { status: 500 });
  }
}
