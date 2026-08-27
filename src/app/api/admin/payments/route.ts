import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await requireAuth(['ADMIN']);

    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, officialFullName: true, email: true, phone: true, username: true }
        },
        order: {
          include: {
            course: { select: { id: true, title: true, slug: true } },
            diploma: { select: { id: true, title: true, slug: true } },
            coupon: { select: { code: true } }
          }
        }
      }
    });

    return NextResponse.json({ payments });
  } catch (error) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireAuth(['ADMIN']);
    const { paymentId, action, adminNotes } = await req.json();

    if (!paymentId || !action) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true, user: true }
    });

    if (!payment) {
      return NextResponse.json({ error: 'المعاملة غير موجودة' }, { status: 404 });
    }

    if (action === 'APPROVE') {
      // 1. Update Payment
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'APPROVED',
          adminNotes: adminNotes || 'تم تأكيد وصول التحويل البنكي/المحفظة من قبل الإدارة',
          reviewedById: admin.id,
          reviewedAt: new Date(),
        }
      });

      // 2. Update Order
      await prisma.order.update({
        where: { id: payment.order.id },
        data: { status: 'COMPLETED' }
      });

      // 3. Create Enrollment & Unlock Course/Diploma
      await prisma.enrollment.upsert({
        where: {
          userId_courseId: payment.order.courseId ? {
            userId: payment.userId,
            courseId: payment.order.courseId,
          } : undefined,
          userId_diplomaId: payment.order.diplomaId ? {
            userId: payment.userId,
            diplomaId: payment.order.diplomaId,
          } : undefined,
        },
        create: {
          userId: payment.userId,
          courseId: payment.order.courseId,
          diplomaId: payment.order.diplomaId,
          type: payment.order.courseId ? 'COURSE' : 'DIPLOMA',
          status: 'ACTIVE',
          accessType: 'LIFETIME',
          progressPercent: 0,
        },
        update: {
          status: 'ACTIVE',
        }
      });

      // 4. Send In-App Notification
      await prisma.notification.create({
        data: {
          userId: payment.userId,
          title: '✅ تم تأكيد دفعتك وفتح المحتوى بنجاح!',
          message: `تم اعتماد عملية الدفع رقم (${payment.transactionId || payment.order.orderNumber}) وتفعيل اشتراكك فورياً.`,
          link: '/dashboard',
          type: 'PAYMENT',
        }
      });

      // 5. Audit Log
      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: 'PAYMENT_APPROVED',
          entity: 'PAYMENT',
          entityId: payment.id,
          detailsJson: JSON.stringify({
            orderNumber: payment.order.orderNumber,
            amount: payment.amount,
            studentEmail: payment.user.email,
          })
        }
      });

      return NextResponse.json({ success: true, message: 'تمت الموافقة وتفعيل الاشتراك بنجاح' });
    } else if (action === 'REJECT') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'REJECTED',
          adminNotes: adminNotes || 'لم يتم تأكيد وصول التحويل المالي',
          reviewedById: admin.id,
          reviewedAt: new Date(),
        }
      });

      await prisma.order.update({
        where: { id: payment.order.id },
        data: { status: 'CANCELLED' }
      });

      await prisma.notification.create({
        data: {
          userId: payment.userId,
          title: '❌ تعذر التحقق من عملية الدفع',
          message: `تم رفض إيصال الدفع للطلب ${payment.order.orderNumber}. السبب: ${adminNotes || 'عدم مطابقة بيانات التحويل'}. يرجى التواصل مع الدعم الفني.`,
          link: '/support',
          type: 'PAYMENT',
        }
      });

      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: 'PAYMENT_REJECTED',
          entity: 'PAYMENT',
          entityId: payment.id,
          detailsJson: JSON.stringify({
            orderNumber: payment.order.orderNumber,
            reason: adminNotes,
          })
        }
      });

      return NextResponse.json({ success: true, message: 'تم رفض المعاملة وإشعار الطالب' });
    }

    return NextResponse.json({ error: 'إجراء غير صالح' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'فشلت معالجة الطلب' }, { status: 500 });
  }
}