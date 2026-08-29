import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const payments = await prisma.payment.findMany({
      where: user.role === 'ADMIN' ? {} : {
        order: {
          course: {
            instructorId: user.id,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, officialFullName: true, firstName: true, email: true, phone: true, username: true }
        },
        order: {
          include: {
            course: { select: { id: true, title: true, slug: true } },
            coupon: { select: { code: true } }
          }
        }
      }
    });

    return NextResponse.json({ success: true, payments });
  } catch (error) {
    console.error('Failed to fetch instructor orders:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب طلبات الدفع' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const { paymentId, action, note } = await req.json();

    if (!paymentId || !action) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          include: {
            course: true,
          }
        },
        user: true,
      }
    });

    if (!payment) {
      return NextResponse.json({ error: 'المعاملة غير موجودة' }, { status: 404 });
    }

    // Ensure the instructor owns this course
    if (user.role !== 'ADMIN') {
      if (!payment.order.course || payment.order.course.instructorId !== user.id) {
        return NextResponse.json({ error: 'ليس لديك صلاحية لإدارة هذا الطلب' }, { status: 403 });
      }
    }

    if (action === 'APPROVE') {
      // 1. Update Payment
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'APPROVED',
          adminNotes: note || `تم تأكيد استلام التحويل وتفعيل الاشتراك بواسطة المحاضر (${user.officialFullName || user.firstName})`,
          reviewedById: user.id,
          reviewedAt: new Date(),
        }
      });

      // 2. Update Order
      await prisma.order.update({
        where: { id: payment.order.id },
        data: { status: 'COMPLETED' }
      });

      // 3. Create/Activate Enrollment
      if (payment.order.courseId) {
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
      }

      // 4. Send In-App Notification to Student
      await prisma.notification.create({
        data: {
          userId: payment.userId,
          title: '✅ تم تأكيد اشتراكك في الكورس بنجاح!',
          message: `تم اعتماد إيصال التحويل لكورس (${payment.order.course?.title || ''}) بواسطة المحاضر ويمكنك الآن بدء المشاهدة فوراً.`,
          link: `/courses/${payment.order.course?.slug || ''}`,
          type: 'PAYMENT',
        }
      });

      return NextResponse.json({
        success: true,
        message: 'تم تأكيد الدفعة وتفعيل الكورس للطالب فورياً',
      });
    } else if (action === 'REJECT') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'REJECTED',
          adminNotes: note || 'تم رفض الإيصال لعدم تطابق بيانات التحويل أو وضوح الصورة',
          reviewedById: user.id,
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
          title: '❌ تعذر تأكيد عملية الدفع',
          message: `لم يتم اعتماد إيصال الدفع لكورس (${payment.order.course?.title || ''}). السبب: ${note || 'بيانات التحويل غير مطابقة'}. يرجى التواصل مع المحاضر.`,
          link: '/dashboard',
          type: 'PAYMENT',
        }
      });

      return NextResponse.json({
        success: true,
        message: 'تم رفض الإيصال وإشعار الطالب',
      });
    }

    return NextResponse.json({ error: 'إجراء غير صالح' }, { status: 400 });
  } catch (error) {
    console.error('Failed to update payment status:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء معالجة الطلب' }, { status: 500 });
  }
}
