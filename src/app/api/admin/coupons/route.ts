import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateRandomCouponCode } from '@/lib/utils';

export async function GET() {
  try {
    await requireAuth(['ADMIN']);
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { usages: true, orders: true } }
      }
    });
    return NextResponse.json({ coupons });
  } catch (e) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAuth(['ADMIN']);
    const body = await req.json();
    const { code, discountType, discountValue, maxUses, perUserLimit, minOrderAmount, validUntil, count } = body;

    // Support Bulk Generation if count > 1
    if (count && count > 1) {
      const createdCoupons = [];
      for (let i = 0; i < Math.min(count, 50); i++) {
        const randomCode = generateRandomCouponCode('QIMAM');
        const c = await prisma.coupon.create({
          data: {
            code: randomCode,
            discountType: discountType || 'PERCENTAGE',
            discountValue: parseFloat(discountValue) || 10,
            maxUses: parseInt(maxUses) || 100,
            perUserLimit: parseInt(perUserLimit) || 1,
            minOrderAmount: parseFloat(minOrderAmount) || 0,
            validUntil: validUntil ? new Date(validUntil) : null,
          }
        });
        createdCoupons.push(c);
      }

      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: 'BULK_COUPONS_CREATED',
          entity: 'COUPON',
          detailsJson: JSON.stringify({ count: createdCoupons.length }),
        }
      });

      return NextResponse.json({ success: true, count: createdCoupons.length });
    }

    const finalCode = (code?.trim() || generateRandomCouponCode()).toUpperCase();

    const coupon = await prisma.coupon.create({
      data: {
        code: finalCode,
        discountType: discountType || 'PERCENTAGE',
        discountValue: parseFloat(discountValue) || 10,
        maxUses: parseInt(maxUses) || 100,
        perUserLimit: parseInt(perUserLimit) || 1,
        minOrderAmount: parseFloat(minOrderAmount) || 0,
        validUntil: validUntil ? new Date(validUntil) : null,
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'COUPON_CREATED',
        entity: 'COUPON',
        entityId: coupon.id,
        detailsJson: JSON.stringify({ code: coupon.code, discountValue: coupon.discountValue }),
      }
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    return NextResponse.json({ error: 'فشل إنشاء الكوبون (قد يكون الكود مستخدماً مسبقاً)' }, { status: 400 });
  }
}