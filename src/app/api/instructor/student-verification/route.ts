import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        isStudentInstructor: true,
        studentVerificationStatus: true,
        studentUniversity: true,
        studentFaculty: true,
        studentStudyYear: true,
        studentBirthDate: true,
        studentIdCardUrl: true,
        studentNationalIdUrl: true,
        studentVerificationNote: true,
        trialEndsAt: true,
        subscriptionPlan: true,
      }
    });

    return NextResponse.json({ success: true, studentData: userData });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'فشل جلب بيانات التوثيق' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });
    }

    const body = await req.json();
    const {
      university,
      faculty,
      studyYear,
      birthDate,
      studentIdCardUrl,
      nationalIdUrl,
    } = body;

    if (!university?.trim() || !faculty?.trim() || !studyYear?.trim() || !birthDate || !studentIdCardUrl) {
      return NextResponse.json({ error: 'يرجى إكمال جميع الحقول ورفع صورة كارنيه الكلية' }, { status: 400 });
    }

    // Strict Age Verification: Max 23 Years Old
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) {
      return NextResponse.json({ error: 'تاريخ الميلاد غير صالح' }, { status: 400 });
    }

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age > 22) {
      return NextResponse.json({
        error: `عذراً، باقة الطالب مخصصة لطلبة الجامعات حتى سن 22 سنة (عمرك المسجل: ${age} سنة). يمكنك الاشتراك في باقة المدرسين والدكاترة العادية.`
      }, { status: 400 });
    }

    if (age < 15) {
      return NextResponse.json({ error: 'تاريخ الميلاد المدخل غير منطقي' }, { status: 400 });
    }

    // Update user profile and activate 30-Day Free Trial
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isStudentInstructor: true,
        studentVerificationStatus: 'PENDING',
        studentUniversity: university.trim(),
        studentFaculty: faculty.trim(),
        studentStudyYear: studyYear.trim(),
        studentBirthDate: birth,
        studentIdCardUrl: studentIdCardUrl.trim(),
        studentNationalIdUrl: nationalIdUrl?.trim() || null,
        instructorStatus: 'TRIAL',
        trialEndsAt: thirtyDaysFromNow,
        subscriptionPlan: 'STUDENT_PRO',
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلبك وتفعيل شهر كامل (30 يوماً مجاناً) في استوديو المحاضر بنجاح! سيتم مراجعة الكارنيه وتأكيد شارة التوثيق.',
      user: {
        isStudentInstructor: updatedUser.isStudentInstructor,
        studentVerificationStatus: updatedUser.studentVerificationStatus,
        trialEndsAt: updatedUser.trialEndsAt,
      }
    });
  } catch (e: any) {
    console.error('Student verification submission error:', e);
    return NextResponse.json({ error: e?.message || 'فشل إرسال طلب التوثيق' }, { status: 500 });
  }
}
