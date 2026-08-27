import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get('lessonId');

    const notes = await prisma.studentNote.findMany({
      where: {
        userId: user.id,
        ...(lessonId ? { lessonId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ notes });
  } catch (e) {
    return NextResponse.json({ error: 'فشل جلب الملاحظات' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { lessonId, timestampSeconds, content } = await req.json();
    if (!lessonId || !content) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    const note = await prisma.studentNote.create({
      data: {
        userId: user.id,
        lessonId,
        timestampSeconds: timestampSeconds || 0,
        content: content.trim(),
      }
    });

    return NextResponse.json({ success: true, note });
  } catch (e) {
    return NextResponse.json({ error: 'فشل حفظ الملاحظة' }, { status: 500 });
  }
}