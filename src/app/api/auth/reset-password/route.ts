import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { token, email, newPassword } = await req.json();
    if (!token || !email || !newPassword) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'رابط استعادة كلمة المرور غير صالح أو منتهي الصلاحية' }, { status: 400 });
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      }
    });

    return NextResponse.json({ success: true, message: 'تم تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.' });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ أثناء إعادة تعيين كلمة المرور' }, { status: 500 });
  }
}