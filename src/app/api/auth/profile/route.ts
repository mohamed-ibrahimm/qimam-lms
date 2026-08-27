import { NextResponse } from 'next/server';
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, fatherName, lastName, officialFullName, phone, bio, avatarUrl, currentPassword, newPassword } = body;

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName.trim();
    if (fatherName !== undefined) updateData.fatherName = fatherName ? fatherName.trim() : null;
    if (lastName) updateData.lastName = lastName.trim();
    if (officialFullName) updateData.officialFullName = officialFullName.trim();
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
    if (bio !== undefined) updateData.bio = bio ? bio.trim() : null;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl ? avatarUrl.trim() : null;

    // Change Password if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'يرجى إدخال كلمة المرور الحالية لتغيير كلمة المرور' }, { status: 400 });
      }
      const fullUser = await prisma.user.findUnique({ where: { id: currentUser.id } });
      if (!fullUser || !(await verifyPassword(currentPassword, fullUser.passwordHash))) {
        return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
      }
      updateData.passwordHash = await hashPassword(newPassword);
    }

    const updated = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        fatherName: true,
        lastName: true,
        officialFullName: true,
        username: true,
        phone: true,
        avatarUrl: true,
        bio: true,
      }
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'فشل تحديث البيانات' }, { status: 500 });
  }
}