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

    const coupons = await prisma.coupon.findMany({
      where: user.role === 'ADMIN' ? {} : { instructorId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { usages: true } }
      }
    });

    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error('Failed to fetch instructor coupons:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الكوبونات' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const subState = evaluateInstructorSubscription(user);
    if (!subState.canCreateCourse) {
      return NextResponse.json({ error: 'لقد انتهت الفترة التجريبية أو اشتراكك، يرجى التجديد لإنشاء كوبونات جديدة' }, { status: 403 });
    }

    const body = await req.json();
    const { code, discountType, discountValue, maxUses, validUntil } = body;

    if (!code || !discountValue) {
      return NextResponse.json({ error: 'يرجى إدخال كود الكوبون وقيمة الخصم' }, { status: 400 });
    }

    const cleanCode = code.toUpperCase().trim();
    const existing = await prisma.coupon.findUnique({ where: { code: cleanCode } });
    if (existing) {
      return NextResponse.json({ error: 'كود الكوبون هذا مستخدم بالفعل، يرجى اختيار كود آخر' }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        discountType: discountType || 'PERCENTAGE',
        discountValue: parseFloat(discountValue),
        maxUses: maxUses ? parseInt(maxUses) : 100,
        validUntil: validUntil ? new Date(validUntil) : null,
        instructorId: user.id,
        isActive: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء كود الخصم بنجاح، يمكنك الآن مشاركته مع طلابك',
      coupon,
    });
  } catch (error) {
    console.error('Failed to create coupon:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الكوبون' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'معرف الكوبون مطلوب' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return NextResponse.json({ error: 'الكوبون غير موجود' }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && coupon.instructorId !== user.id) {
      return NextResponse.json({ error: 'ليس لديك صلاحية لحذف هذا الكوبون' }, { status: 403 });
    }

    await prisma.coupon.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'تم حذف الكوبون بنجاح' });
  } catch (error) {
    console.error('Failed to delete coupon:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء حذف الكوبون' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const body = await req.json();
    const { id, discountValue, discountType, maxUses, validUntil, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'معرف الكوبون مطلوب' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return NextResponse.json({ error: 'الكوبون غير موجود' }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && coupon.instructorId !== user.id) {
      return NextResponse.json({ error: 'ليس لديك صلاحية لتعديل هذا الكوبون' }, { status: 403 });
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        ...(discountValue !== undefined && { discountValue: parseFloat(discountValue) }),
        ...(discountType && { discountType }),
        ...(maxUses !== undefined && { maxUses: parseInt(maxUses) }),
        ...(validUntil !== undefined && { validUntil: validUntil ? new Date(validUntil) : null }),
        ...(isActive !== undefined && { isActive: !!isActive }),
      },
    });

    return NextResponse.json({ success: true, coupon: updated, message: 'تم تحديث الكوبون بنجاح' });
  } catch (e: any) {
    console.error('Failed to update coupon:', e);
    return NextResponse.json({ error: 'فشل تحديث الكوبون' }, { status: 500 });
  }
}
