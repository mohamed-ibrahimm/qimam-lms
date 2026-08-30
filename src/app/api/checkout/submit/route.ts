import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const {
      courseId,
      diplomaId,
      bookId,
      couponId,
      paymentMethod,
      senderPhone,
      transactionId,
      screenshotUrl,
    } = await req.json();

    // Fetch product details
    let totalAmount = 0;
    let title = '';

    if (bookId) {
      const b = await prisma.digitalBook.findUnique({ where: { id: bookId } });
      if (!b) return NextResponse.json({ error: 'المذكرة غير موجودة' }, { status: 404 });
      totalAmount = b.price;
      title = b.title;

      // Check if already purchased
      const existingBook = await prisma.bookPurchase.findUnique({
        where: {
          userId_bookId: {
            userId: user.id,
            bookId,
          }
        }
      });
      if (existingBook) {
        return NextResponse.json({ error: 'أنت تمتلك هذه المذكرة بالفعل في مكتبتك!' }, { status: 400 });
      }
    } else if (courseId) {
      const c = await prisma.course.findUnique({ where: { id: courseId } });
      if (!c) return NextResponse.json({ error: 'الكورس غير موجود' }, { status: 404 });
      totalAmount = c.price;
      title = c.title;

      // Check if already enrolled
      const existing = await prisma.enrollment.findFirst({
        where: {
          userId: user.id,
          courseId,
          status: 'ACTIVE',
        }
      });
      if (existing) {
        return NextResponse.json({ error: 'أنت مسجل بالفعل في هذا الكورس!' }, { status: 400 });
      }
    } else if (diplomaId) {
      const d = await prisma.diploma.findUnique({ where: { id: diplomaId } });
      if (!d) return NextResponse.json({ error: 'الدبلومة غير موجودة' }, { status: 404 });
      totalAmount = d.price;
      title = d.title;

      // Check if already enrolled
      const existing = await prisma.enrollment.findFirst({
        where: {
          userId: user.id,
          diplomaId,
          status: 'ACTIVE',
        }
      });
      if (existing) {
        return NextResponse.json({ error: 'أنت مسجل بالفعل في هذه الدبلومة!' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'يرجى تحديد المنتج المطلوب' }, { status: 400 });
    }

    // Handle Coupon discount calculation
    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponId) {
      appliedCoupon = await prisma.coupon.findUnique({ where: { id: couponId } });
      if (appliedCoupon && appliedCoupon.isActive) {
        if (appliedCoupon.discountType === 'PERCENTAGE') {
          discountAmount = (totalAmount * appliedCoupon.discountValue) / 100;
        } else if (appliedCoupon.discountType === 'FIXED') {
          discountAmount = Math.min(totalAmount, appliedCoupon.discountValue);
        } else if (appliedCoupon.discountType === 'FREE_100') {
          discountAmount = totalAmount;
        }
      }
    }

    const finalAmount = Math.max(0, totalAmount - discountAmount);
    const orderNumber = `ORD-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        courseId: courseId || null,
        diplomaId: diplomaId || null,
        bookId: bookId || null,
        totalAmount,
        discountAmount,
        finalAmount,
        couponId: appliedCoupon ? appliedCoupon.id : null,
        status: finalAmount === 0 ? 'COMPLETED' : 'PENDING',
      }
    });

    // Record Coupon usage if applied
    if (appliedCoupon) {
      await prisma.couponUsage.create({
        data: {
          couponId: appliedCoupon.id,
          userId: user.id,
          orderId: order.id,
        }
      });
      await prisma.coupon.update({
        where: { id: appliedCoupon.id },
        data: { usedCount: { increment: 1 } }
      });
    }

    // 100% Free Coupon Case or Free Book -> Instant Enrollment & Access
    if (finalAmount === 0) {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          userId: user.id,
          amount: 0,
          paymentMethod: 'COUPON_100',
          status: 'APPROVED',
          adminNotes: `تم التفعيل التلقائي (${appliedCoupon?.code || 'مجاني'})`,
        }
      });

      if (bookId) {
        await prisma.bookPurchase.create({
          data: {
            userId: user.id,
            bookId,
            amountPaid: 0,
          }
        });
        await prisma.digitalBook.update({
          where: { id: bookId },
          data: { salesCount: { increment: 1 } }
        });
      } else {
        // Create Course / Diploma Enrollment
        await prisma.enrollment.create({
          data: {
            userId: user.id,
            courseId: courseId || null,
            diplomaId: diplomaId || null,
            type: courseId ? 'COURSE' : 'DIPLOMA',
            status: 'ACTIVE',
            accessType: 'LIFETIME',
            progressPercent: 0,
          }
        });
      }

      // Notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: '🎉 تم تفعيل اشتراكك بنجاح!',
          message: `تم فتح ${title} لك فوراً في حسابك. يمكنك الوصول إليها الآن.`,
          link: bookId ? '/dashboard/library' : '/dashboard',
          type: bookId ? 'SYSTEM' : 'COURSE',
        }
      });

      return NextResponse.json({
        success: true,
        isFree: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        redirectUrl: bookId ? '/dashboard/library' : '/dashboard',
      });
    }

    // Paid Order Case (InstaPay / Vodafone Cash)
    if (!transactionId) {
      return NextResponse.json({ error: 'يرجى إدخال رقم المعاملة (Transaction ID)' }, { status: 400 });
    }

    // Prevent duplicate transaction ID
    const duplicateTxn = await prisma.payment.findUnique({
      where: { transactionId: transactionId.trim() }
    });

    if (duplicateTxn) {
      return NextResponse.json({ error: 'رقم المعاملة هذا مسجل مسبقاً في عملية دفع أخرى' }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        userId: user.id,
        amount: finalAmount,
        paymentMethod: paymentMethod || 'INSTAPAY',
        transactionId: transactionId.trim(),
        senderPhone: senderPhone?.trim() || null,
        screenshotUrl: screenshotUrl || null,
        status: 'PENDING',
      }
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'تم استلام طلب التحويل المالي ⏳',
        message: `طلب رقم ${order.orderNumber} قيد مراجعة وتدكيد الإدارة. سيتم فتح المحتوى تلقائياً فور التحقق.`,
        link: `/checkout/confirmation/${order.id}`,
        type: 'PAYMENT',
      }
    });

    return NextResponse.json({
      success: true,
      isFree: false,
      orderId: order.id,
      orderNumber: order.orderNumber,
      redirectUrl: `/checkout/confirmation/${order.id}`,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'فشلت معالجة الطلب' }, { status: 500 });
  }
}