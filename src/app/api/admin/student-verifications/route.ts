import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await requireAuth(['ADMIN']);

    const students = await prisma.user.findMany({
      where: {
        isStudentInstructor: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        officialFullName: true,
        email: true,
        phone: true,
        studentUniversity: true,
        studentFaculty: true,
        studentStudyYear: true,
        studentBirthDate: true,
        studentIdCardUrl: true,
        studentNationalIdUrl: true,
        studentVerificationStatus: true,
        studentVerificationNote: true,
        trialEndsAt: true,
        subscriptionPlan: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, students });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'غير مصرح' }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAuth(['ADMIN']);
    const { userId, action, note } = await req.json();

    if (!userId || !action) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    if (action === 'APPROVE') {
      const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await prisma.user.update({
        where: { id: userId },
        data: {
          studentVerificationStatus: 'APPROVED',
          isStudentInstructor: true,
          subscriptionPlan: 'STUDENT_PRO',
          instructorStatus: 'TRIAL',
          trialEndsAt: thirtyDays,
          studentVerificationNote: note || 'تم التحقق من كارنيه الكلية واعتماد منحة الـ 30 يوماً المجانية بنجاح.',
        }
      });

      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: 'STUDENT_INSTRUCTOR_APPROVED',
          entity: 'USER',
          entityId: userId,
        }
      });

      return NextResponse.json({ success: true, message: 'تم اعتماد الطالب وتفعيل اشتراكه وشهر التجربة المجاني بنجاح!' });
    }

    if (action === 'REJECT') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          studentVerificationStatus: 'REJECTED',
          studentVerificationNote: note || 'لم يتم قبول الطلب نظراً لعدم وضوح الكارنيه أو تجاوز شرط السن المحدد (23 سنة).',
        }
      });

      return NextResponse.json({ success: true, message: 'تم رفض طلب التوثيق وتحديث حالة الحساب' });
    }

    return NextResponse.json({ error: 'إجراء غير صالح' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'فشل تنفيذ الإجراء' }, { status: 500 });
  }
}
