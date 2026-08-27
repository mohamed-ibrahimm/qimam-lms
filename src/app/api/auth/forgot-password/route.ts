import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'يرجى إدخال البريد الإلكتروني' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (user) {
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpires: expires,
        }
      });

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

      await sendEmail({
        to: user.email,
        recipientName: user.officialFullName,
        subject: 'إعادة تعيين كلمة المرور - أكاديمية قِمَم',
        templateType: 'PASSWORD_RESET',
        htmlContent: `
          <div dir="rtl" style="font-family: 'Cairo', Tahoma, sans-serif; background-color: #0f0f13; color: #fff; padding: 24px; border-radius: 8px;">
            <h2>طلب استعادة كلمة المرور</h2>
            <p>مرحباً ${user.officialFullName}، لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في أكاديمية قِمَم.</p>
            <p><a href="${resetUrl}" style="background-color: #7c3aed; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">اضغط هنا لتعيين كلمة مرور جديدة</a></p>
            <p style="color: #a1a1aa; font-size: 13px;">الرابط صالح لمدة ساعة واحدة فقط.</p>
          </div>
        `
      });
    }

    return NextResponse.json({
      success: true,
      message: 'إذا كان البريد مسجلاً لدينا، فستصلك تعليمات استعادة كلمة المرور خلال دقائق.'
    });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ، يرجى المحاولة لاحقاً' }, { status: 500 });
  }
}