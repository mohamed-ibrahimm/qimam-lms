import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const user = await requireAuth(['INSTRUCTOR', 'ADMIN']);

    const books = await prisma.digitalBook.findMany({
      where: user.role === 'ADMIN' ? {} : { instructorId: user.id },
      include: {
        purchases: {
          select: { id: true, amountPaid: true, createdAt: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ books });
  } catch (error: any) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth(['INSTRUCTOR', 'ADMIN']);

    const data = await req.json();
    const {
      title,
      coverImage,
      fileUrl,
      description,
      shortDescription,
      pageCount,
      previewPagesCount,
      price,
      compareAtPrice,
      isFree,
      academicSubject,
      academicLevel,
      category,
    } = data;

    if (!title || !description) {
      return NextResponse.json({ error: 'يرجى إدخال عنوان ووصف المذكرة' }, { status: 400 });
    }

    const slug = `${title.toLowerCase().trim().replace(/[^a-z0-9\u0621-\u064A]+/g, '-')}-${Date.now().toString(36)}`;

    const newBook = await prisma.digitalBook.create({
      data: {
        title,
        slug,
        coverImage: coverImage || null,
        fileUrl: fileUrl || '/uploads/sample_notes.pdf',
        description,
        shortDescription: shortDescription || null,
        pageCount: Number(pageCount) || 30,
        previewPagesCount: Number(previewPagesCount) || 3,
        price: isFree ? 0 : (Number(price) || 0),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        isFree: !!isFree || Number(price) === 0,
        authorName: user.officialFullName || user.firstName,
        academicSubject: academicSubject || 'عام',
        academicLevel: academicLevel || 'كافة المستويات',
        category: category || 'ملخصات',
        instructorId: user.id,
        status: 'PUBLISHED',
      }
    });

    return NextResponse.json({ success: true, book: newBook });
  } catch (error: any) {
    console.error('Error creating book:', error);
    return NextResponse.json({ error: 'فشل حفظ ونشر المذكرة' }, { status: 500 });
  }
}
