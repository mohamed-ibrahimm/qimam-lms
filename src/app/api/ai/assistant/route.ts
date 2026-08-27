import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { lessonId, message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'نص السؤال مطلوب' }, { status: 400 });
    }

    const lesson = lessonId
      ? await prisma.lesson.findUnique({
          where: { id: lessonId },
          include: { summary: true, section: { include: { course: true } } }
        })
      : null;

    const lessonContext = lesson
      ? `الدرس: ${lesson.title}\nالكورس: ${lesson.section.course.title}\nالملخص: ${lesson.summary?.summaryText || ''}`
      : 'دروس أكاديمية قمم';

    // Built-in Intelligent Arabic Educational Assistant Response Engine
    let reply = '';
    const qLower = message.toLowerCase();

    if (qLower.includes('ملخص') || qLower.includes('لخص') || qLower.includes('summary')) {
      reply = `📚 **ملخص مركز للدرس (${lesson?.title || 'الدرس الحالي'}):**\n\n` +
        (lesson?.summary?.summaryText || 'يركز هذا الدرس على بناء التطبيقات الحديثة باستخدام أفضل المعايير المعمارية، مع مراعاة فصل المهام بين الخادم والواجهة لتحقيق أعلى سرعة استجابة وأمان.') +
        `\n\n💡 **نصيحة عملية:** احرص على تطبيق الكود بيدك وإعادة كتابة الأمثلة في بيئة التطوير الخاصة بك.`;
    } else if (qLower.includes('server') || qLower.includes('خادم') || qLower.includes('rsc')) {
      reply = `⚙️ **مكونات الخادم (React Server Components):**\n\nتُنفذ مباشرة على خادم Next.js، ولا يُرسل كودها المصدري إلى متصفح المستخدم، مما يعني:\n1. حزمة جافاسكريبت أصغر حجماً وسرعة تحميل فائقة.\n2. إمكانية الاستعلام المباشر والآمن من قاعدة البيانات دون الحاجة لـ API الوسيط.\n3. عند الحاجة للتفاعل والـ Hooks مثل useState، نستخدم التوجيه 'use client' أعلى الملف.`;
    } else if (qLower.includes('امتحان') || qLower.includes('اختبار') || qLower.includes('quiz')) {
      reply = `📝 **نصائح للاختبار التقييمي:**\n\n- اقرأ السؤال وخيارات الإجابة بعناية.\n- انتبه لأسئلة الاختيار المتعدد التي قد تحتوي أكثر من إجابة صحيحة.\n- يمكنك إعادة المحاولة إذا لم تحقق درجة النجاح المطلوبة.`;
    } else {
      reply = `مرحباً بك يا ${user.firstName}! 🚀\n\nبخصوص سؤالك حول **"${message}"** في سياق درس (${lesson?.title || 'المقرر'}):\n\nتطبيق هذه المفاهيم برمجياً يعتمد على فهم تدفق البيانات من الخادم وإدارتها بدقة. إذا كنت تواجه أي صعوبة في كتابة الأكواد، يمكنك أيضاً كتابة ملاحظاتك والاحتفاظ بنقاط التوقف (Timestamps) للرجوع إليها في أي وقت.`;
    }

    return NextResponse.json({
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'فشل معالجة استفسار الذكاء الاصطناعي' }, { status: 500 });
  }
}