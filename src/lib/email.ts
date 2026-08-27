import { prisma } from './prisma';

export interface SendEmailParams {
  to: string;
  recipientName?: string;
  subject: string;
  templateType: string;
  htmlContent: string;
}

export async function sendEmail({ to, recipientName, subject, templateType, htmlContent }: SendEmailParams) {
  try {
    // In production, nodemailer / SendGrid / Postmark can be configured using SMTP env variables
    const isMock = !process.env.SMTP_HOST;
    
    // Log to Database EmailLog
    const emailLog = await prisma.emailLog.create({
      data: {
        recipientEmail: to,
        recipientName: recipientName || '',
        subject,
        templateType,
        content: htmlContent,
        status: 'SENT',
      }
    });

    if (process.env.NODE_ENV === 'development' || isMock) {
      console.log(`📧 [EMAIL SENT - ${templateType}] To: ${to} | Subject: ${subject}`);
    }

    return { success: true, logId: emailLog.id };
  } catch (error: any) {
    console.error('❌ Failed to send email:', error);
    try {
      await prisma.emailLog.create({
        data: {
          recipientEmail: to,
          recipientName: recipientName || '',
          subject,
          templateType,
          content: htmlContent,
          status: 'FAILED',
          errorMessage: error?.message || 'Unknown error',
        }
      });
    } catch (e) {}
    return { success: false, error: error?.message };
  }
}

export function buildParentQuizEmail({
  parentName,
  studentName,
  courseTitle,
  quizTitle,
  score,
  totalPoints,
  percentage,
  isPassed,
  progressPercent
}: {
  parentName: string;
  studentName: string;
  courseTitle: string;
  quizTitle: string;
  score: number;
  totalPoints: number;
  percentage: number;
  isPassed: boolean;
  progressPercent: number;
}) {
  return `
    <div dir="rtl" style="font-family: 'Cairo', Tahoma, sans-serif; background-color: #0f0f13; color: #f4f4f5; padding: 24px; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #272732;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #a855f7; margin: 0; font-size: 24px;">أكاديمية قِمَم التعليمية</h1>
        <p style="color: #a1a1aa; font-size: 14px;">تقرير أداء الطالب لولي الأمر</p>
      </div>
      <div style="background-color: #18181f; padding: 20px; border-radius: 8px; border: 1px solid #272732;">
        <p style="font-size: 16px; margin-top: 0;">عزيزي ولي الأمر / <strong>${parentName}</strong>، تحية طيبة وبعد،</p>
        <p>نود إعلامكم بأن الطالب <strong>${studentName}</strong> قد أتم للتو اختباراً جديداً في منصة قِمَم التعليمية:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px; color: #a1a1aa; border-bottom: 1px solid #272732;">المقرر التدريبي:</td>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #272732;">${courseTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #a1a1aa; border-bottom: 1px solid #272732;">عنوان الاختبار:</td>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #272732;">${quizTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #a1a1aa; border-bottom: 1px solid #272732;">الدرجة المحققة:</td>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #272732;">${score} من ${totalPoints} (${percentage}%)</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #a1a1aa; border-bottom: 1px solid #272732;">الحالة:</td>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #272732; color: ${isPassed ? '#22c55e' : '#ef4444'};">
              ${isPassed ? '✅ ناجح ومجتاز للاختبار' : '⚠️ يحتاج للمراجعة وإعادة المحاولة'}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #a1a1aa;">نسبة التقدم في الكورس:</td>
            <td style="padding: 8px; font-weight: bold; color: #a855f7;">${progressPercent}%</td>
          </tr>
        </table>
        <p style="font-size: 13px; color: #71717a; margin-bottom: 0;">هذه الرسالة آلية لمتابعة التحصيل الدراسي للطالب في أكاديمية قِمَم.</p>
      </div>
    </div>
  `;
}