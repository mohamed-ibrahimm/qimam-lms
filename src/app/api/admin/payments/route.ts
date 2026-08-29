import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    // Determine safe reviewer admin ID in DB to avoid FK constraint errors
    let reviewerId: string | null = null;
    try {
      const validAdmin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        select: { id: true }
      });
      if (validAdmin) reviewerId = validAdmin.id;
    } catch (_) {}

    if (action === 'APPROVE') {
      // 1. Update Payment
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'APPROVED',
          adminNotes: adminNotes || 'تم تأكيد وصول التحويل البنكي/المحفظة من قبل الإدارة',
          reviewedById: reviewerId,
          reviewedAt: new Date(),
        }
      });

      // 2. Update Order if exists
      if (payment.order?.id) {
        await prisma.order.update({
          where: { id: payment.order.id },
          data: { status: 'COMPLETED' }
        }).catch(() => {});
      }

      // 3. Create Enrollment & Unlock Course/Diploma cleanly
      try {
        if (payment.order?.courseId) {
          await prisma.enrollment.upsert({
            where: {
              userId_courseId: {
                userId: payment.userId,
                courseId: payment.order.courseId,
              }
            },
            create: {
              userId: payment.userId,
              courseId: payment.order.courseId,
              type: 'COURSE',
              status: 'ACTIVE',
              accessType: 'LIFETIME',
              progressPercent: 0,
            },
            update: {
              status: 'ACTIVE',
            }
          });
        } else if (payment.order?.diplomaId) {
          await prisma.enrollment.upsert({
            where: {
              userId_diplomaId: {
                userId: payment.userId,
                diplomaId: payment.order.diplomaId,
              }
            },
            create: {
              userId: payment.userId,
              diplomaId: payment.order.diplomaId,
              type: 'DIPLOMA',
              status: 'ACTIVE',
              accessType: 'LIFETIME',
              progressPercent: 0,
            },
            update: {
              status: 'ACTIVE',
            }
          });
        }
      } catch (enrollErr) {
        console.warn('Enrollment upsert warning:', enrollErr);
      }

      // 4. Send In-App Notification (Zero Emojis)
      try {
        await prisma.notification.create({
          data: {
            userId: payment.userId,
            title: 'تم تأكيد دفعتك وتفعيل المحتوى بنجاح',
            message: `تم اعتماد عملية الدفع رقم (${payment.transactionId || payment.order?.orderNumber || payment.id}) وتفعيل اشتراكك فورياً.`,
            link: '/dashboard',
            type: 'PAYMENT',
          }
        });
      } catch (_) {}

      // 5. Audit Log safely
      if (reviewerId) {
        try {
          await prisma.auditLog.create({
            data: {
              userId: reviewerId,
              action: 'PAYMENT_APPROVED',
              entity: 'PAYMENT',
              entityId: payment.id,
              detailsJson: JSON.stringify({
                orderNumber: payment.order?.orderNumber,
                amount: payment.amount,
                studentEmail: payment.user?.email,
              })
            }
          });
        } catch (_) {}
      }

      return NextResponse.json({ success: true, message: 'تمت الموافقة وتفعيل الاشتراك بنجاح' });
    } else if (action === 'REJECT') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'REJECTED',
          adminNotes: adminNotes || 'لم يتم تأكيد وصول التحويل المالي',
          reviewedById: reviewerId,
          reviewedAt: new Date(),
        }
      });

      if (payment.order?.id) {
        await prisma.order.update({
          where: { id: payment.order.id },
          data: { status: 'CANCELLED' }
        }).catch(() => {});
      }

      try {
        await prisma.notification.create({
          data: {
            userId: payment.userId,
            title: 'تعذر التحقق من عملية الدفع',
            message: `تم رفض إيصال الدفع للطلب ${payment.order?.orderNumber || payment.id}. السبب: ${adminNotes || 'عدم مطابقة بيانات التحويل'}. يرجى التواصل مع الدعم الفني.`,
            link: '/support',
            type: 'PAYMENT',
          }
        });
      } catch (_) {}

      if (reviewerId) {
        try {
          await prisma.auditLog.create({
            data: {
              userId: reviewerId,
              action: 'PAYMENT_REJECTED',
              entity: 'PAYMENT',
              entityId: payment.id,
              detailsJson: JSON.stringify({
                orderNumber: payment.order?.orderNumber,
                reason: adminNotes,
              })
            }
          });
        } catch (_) {}
      }

      return NextResponse.json({ success: true, message: 'تم رفض المعاملة وإشعار الطالب' });
    }

    return NextResponse.json({ error: 'إجراء غير صالح' }, { status: 400 });
  } catch (error: any) {
    console.error('Failed to process payment action:', error);
    return NextResponse.json({ error: error?.message || 'فشلت معالجة الطلب' }, { status: 500 });
  }
}