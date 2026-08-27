import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: user.id, isRead: false }
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (e) {
    return NextResponse.json({ error: 'فشل جلب الإشعارات' }, { status: 500 });
  }
}

export async function PUT() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true }
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'فشل تحديث الإشعارات' }, { status: 500 });
  }
}