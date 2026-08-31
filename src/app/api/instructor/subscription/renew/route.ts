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

    // Fetch dynamic pricing and limits from platform settings
    const dbSettings = await prisma.platformSetting.findMany({
      where: {
        key: {
          in: ['INSTRUCTOR_PRICE_MONTHLY', 'INSTRUCTOR_PRICE_ANNUAL', 'INSTRUCTOR_PRICE_STUDENT', 'STUDENT_MAX_AGE']
        }
      }
    });
    const settingsMap = Object.fromEntries(dbSettings.map((s) => [s.key, s.value]));
    const monthlyPrice = Number(settingsMap['INSTRUCTOR_PRICE_MONTHLY']) || 290;
    const annualPrice = Number(settingsMap['INSTRUCTOR_PRICE_ANNUAL']) || 1499;
    const studentPrice = Number(settingsMap['INSTRUCTOR_PRICE_STUDENT']) || 120;
    const maxAge = Number(settingsMap['STUDENT_MAX_AGE']) || 22;

    if (isStudent) {
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { isStudentInstructor: true, studentVerificationStatus: true, studentBirthDate: true }
      });
      if (fullUser?.studentBirthDate) {
        const b = new Date(fullUser.studentBirthDate);
        const today = new Date();
        let age = today.getFullYear() - b.getFullYear();
        const m = today.getMonth() - b.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
        if (age > maxAge) {
          return NextResponse.json({
            error: `عفواً، باقة الطالب مخصصة لمن هم بسن ${maxAge} سنة فأقل. بما أن عمرك (${age} سنة) أكبر من ${maxAge} سنة، يرجى الاشتراك في باقة المدرسين والدكاترة العادية (الشهري ${monthlyPrice} ج.م أو السنوي).`
          }, { status: 400 });
        }
      }
    }

    const isLiveStudio = plan === 'LIVE_STUDIO_PRO';
    const liveStudioPrice = Number(settingsMap['INSTRUCTOR_PRICE_LIVE_STUDIO']) || 490;

    const amount = isStudent ? studentPrice : isAnnual ? annualPrice : isLiveStudio ? liveStudioPrice : monthlyPrice;
    const durationMonths = isAnnual ? 12 : 1;

    const payment = await prisma.instructorSubscriptionPayment.create({
      data: {
        instructorId: user.id,
        plan: isStudent ? 'STUDENT_PRO' : isAnnual ? 'ANNUAL' : isLiveStudio ? 'LIVE_STUDIO_PRO' : 'MONTHLY',
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
            title: 'طلب تجديد اشتراك محاضر جديد ',
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
