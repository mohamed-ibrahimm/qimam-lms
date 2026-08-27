import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET reviews for a course or diploma
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const diplomaId = searchParams.get('diplomaId');

    const where: any = { isHidden: false };
    if (courseId) where.courseId = courseId;
    if (diplomaId) where.diplomaId = diplomaId;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            officialFullName: true,
            avatarUrl: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ reviews });
  } catch (error: any) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json({ error: 'فشل جلب التقييمات' }, { status: 500 });
  }
}

// POST: Student submits a review (or forced review)
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح لك بالتقييم قبل تسجيل الدخول' }, { status: 401 });
    }

    const { courseId, diplomaId, rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'يرجى اختيار تقييم صحيح من 1 إلى 5 نجوم' }, { status: 400 });
    }

    if (!comment || comment.trim().length < 3) {
      return NextResponse.json({ error: 'يرجى كتابة تعليق تقييم لا يقل عن 3 أحرف' }, { status: 400 });
    }

    // Upsert review so student can update their existing review
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.id,
        ...(courseId ? { courseId } : { diplomaId }),
      }
    });

    let review;
    if (existingReview) {
      review = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating: Number(rating),
          comment: comment.trim(),
          isApproved: true,
        }
      });
    } else {
      review = await prisma.review.create({
        data: {
          userId: user.id,
          courseId: courseId || null,
          diplomaId: diplomaId || null,
          rating: Number(rating),
          comment: comment.trim(),
          isApproved: true,
          isHidden: false,
        }
      });
    }

    return NextResponse.json({
      success: true,
      review,
      message: 'شكراً لك! تم تسجيل تقييمك بنجاح وسماح بمواصلة التعلم 🌟',
    });
  } catch (error: any) {
    console.error('Submit review error:', error);
    return NextResponse.json({ error: 'فشل حفظ التقييم' }, { status: 500 });
  }
}

// DELETE / PUT for Admin Manual Ratings Management
export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get('id');
    if (!reviewId) {
      return NextResponse.json({ error: 'معرف التقييم مطلوب' }, { status: 400 });
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ success: true, message: 'تم حذف التقييم بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ error: 'فشل حذف التقييم' }, { status: 500 });
  }
}
