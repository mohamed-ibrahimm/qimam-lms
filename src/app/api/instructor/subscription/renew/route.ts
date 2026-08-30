import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const body = await req.json();
    const { plan, paymentMethod, transactionId, screenshotUrl } = body;

    if (!plan || !paymentMethod) {
      return NextResponse.json({ error: 'يرجى اختيار باقة الاشتراك ووسيلة الدفع' }, { status: 400 });
    }

    const isStudent = plan === 'STUDENT_PRO';
    const isAnnual = plan === 'ANNUAL';
    const amount = isStudent ? 120 : isAnnual ? 2900 : 290;
    const durationMonths = isAnnual ? 12 : 1;

    const payment = await prisma.instructorSubscriptionPayment.create({
      data: {
        instructorId: user.id,
        plan: isStudent ? 'STUDENT_PRO' : isAnnual ? 'ANNUAL' : 'MONTHLY',
        amount,
        paymentMethod: paymentMethod === 'VODAFONE_CASH' ? 'VODAFONE_CASH' : 'INSTAPAY',
        transactionId: transactionId ? transactionId.trim() : null,
        screenshotUrl: screenshotUrl || null,
        status: 'PENDING',
        durationMonths,
      }
    });

    // Notify admins via system notification
    try {
      const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: 'طلب تجديد اشتراك محاضر جديد 💳',
            message: `قام المحاضر ${user.officialFullName || user.firstName} بتقديم طلب تجديد اشتراك ${isAnnual ? 'سنوي' : 'شهري'} بمبلغ ${amount} ج.م.`,
            type: 'PAYMENT',
            link: '/admin/instructors',
          }
        });
      }
    } catch (notifErr) {
      console.warn('Could not create admin notification:', notifErr);
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلب تجديد الاشتراك بنجاح، سيقوم المشرف بمراجعته وتفعيله فوراً',
      payment,
    });
  } catch (error) {
    console.error('Failed to submit subscription renewal:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إرسال طلب التجديد' }, { status: 500 });
  }
}
