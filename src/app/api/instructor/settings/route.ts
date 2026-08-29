import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { evaluateInstructorSubscription } from '@/lib/instructor-subscription';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const instructor = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        role: true,
        firstName: true,
        lastName: true,
        officialFullName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        bio: true,
        instapayAddress: true,
        instapayName: true,
        vodafoneCashNumber: true,
        paymentInstructions: true,
        instructorStatus: true,
        trialEndsAt: true,
        subscriptionPlan: true,
        subscriptionEndsAt: true,
        createdAt: true,
      }
    });

    const subState = evaluateInstructorSubscription(instructor);

    return NextResponse.json({
      success: true,
      instructor,
      subscription: subState,
    });
  } catch (error) {
    console.error('Failed to fetch instructor settings:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب بيانات الإعدادات' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const body = await req.json();
    const { instapayAddress, instapayName, vodafoneCashNumber, paymentInstructions, phone } = body;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        instapayAddress: instapayAddress !== undefined ? (instapayAddress?.trim() || null) : undefined,
        instapayName: instapayName !== undefined ? (instapayName?.trim() || null) : undefined,
        vodafoneCashNumber: vodafoneCashNumber !== undefined ? (vodafoneCashNumber?.trim() || null) : undefined,
        paymentInstructions: paymentInstructions !== undefined ? (paymentInstructions?.trim() || null) : undefined,
        phone: phone !== undefined ? (phone?.trim() || null) : undefined,
      },
      select: {
        id: true,
        instapayAddress: true,
        instapayName: true,
        vodafoneCashNumber: true,
        paymentInstructions: true,
        phone: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حفظ وتحديث إعدادات الدفع المباشر بنجاح',
      data: updated,
    });
  } catch (error) {
    console.error('Failed to update instructor settings:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث الإعدادات' }, { status: 500 });
  }
}
