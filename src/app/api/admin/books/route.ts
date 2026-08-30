import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    await requireAuth(['ADMIN']);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const books = await prisma.digitalBook.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            officialFullName: true,
            firstName: true,
            email: true,
            avatarUrl: true,
          }
        },
        purchases: {
          select: { id: true, amountPaid: true, createdAt: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const pendingCount = await prisma.digitalBook.count({ where: { status: 'PENDING_REVIEW' } });
    const publishedCount = await prisma.digitalBook.count({ where: { status: 'PUBLISHED' } });
    const rejectedCount = await prisma.digitalBook.count({ where: { status: 'REJECTED' } });

    return NextResponse.json({
      books,
      counts: {
        pending: pendingCount,
        published: publishedCount,
        rejected: rejectedCount,
        total: books.length,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'غير مصرح لك' }, { status: 403 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAuth(['ADMIN']);
    const body = await req.json();
    const { id, status, price, compareAtPrice, isFree } = body;

    if (!id) {
      return NextResponse.json({ error: 'معرف المذكرة مطلوب' }, { status: 400 });
    }

    const book = await prisma.digitalBook.findUnique({ where: { id } });
    if (!book) {
      return NextResponse.json({ error: 'المذكرة غير موجودة' }, { status: 404 });
    }

    const updated = await prisma.digitalBook.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(price !== undefined && { price: isFree ? 0 : Number(price) }),
        ...(compareAtPrice !== undefined && { compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null }),
        ...(isFree !== undefined && { isFree: !!isFree || Number(price) === 0 }),
      },
      include: {
        instructor: { select: { officialFullName: true, email: true } },
      }
    });

    try {
      revalidatePath('/admin/books');
      revalidatePath('/books');
      revalidatePath('/instructor/books');
      revalidatePath(`/books/${updated.slug}`);
    } catch (e) {}

    return NextResponse.json({
      success: true,
      book: updated,
      message: status === 'PUBLISHED'
        ? `تم اعتماد ونشر مذكرة "${updated.title}" بنجاح في المكتبة العامة.`
        : status === 'REJECTED'
        ? `تم رفض نشر مذكرة "${updated.title}".`
        : `تم تحديث حالة المذكرة بنجاح.`
    });
  } catch (e: any) {
    console.error('Admin book review error:', e);
    return NextResponse.json({ error: 'فشل تحديث حالة المذكرة' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAuth(['ADMIN']);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'معرف المذكرة مطلوب' }, { status: 400 });
    }

    const book = await prisma.digitalBook.findUnique({ where: { id } });
    if (!book) {
      return NextResponse.json({ error: 'المذكرة غير موجودة' }, { status: 404 });
    }

    await prisma.digitalBook.delete({ where: { id } });

    try {
      revalidatePath('/admin/books');
      revalidatePath('/books');
    } catch (e) {}

    return NextResponse.json({ success: true, message: `تم حذف مذكرة "${book.title}" بنجاح.` });
  } catch (e: any) {
    return NextResponse.json({ error: 'فشل حذف المذكرة' }, { status: 500 });
  }
}
