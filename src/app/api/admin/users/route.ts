import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    await requireAuth(['ADMIN']);
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    const where: any = {};
    if (role && ['STUDENT', 'INSTRUCTOR', 'ADMIN'].includes(role)) {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { officialFullName: { contains: search } },
        { email: { contains: search } },
        { username: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        officialFullName: true,
        role: true,
        phone: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            instructedCourses: true,
            certificates: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }
}

// Update role or status
export async function PATCH(req: Request) {
  try {
    const admin = await requireAuth(['ADMIN']);
    const { userId, role } = await req.json();

    if (!userId || !['STUDENT', 'INSTRUCTOR', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'USER_ROLE_UPDATED',
        entity: 'USER',
        entityId: userId,
        detailsJson: JSON.stringify({ newRole: role, updatedBy: admin.username }),
      }
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'فشل تحديث بيانات المستخدم' }, { status: 500 });
  }
}
