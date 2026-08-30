const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function fixUiUx() {
  const course = await p.course.findUnique({
    where: { slug: 'ui-ux-design-masterclass' },
    include: { sections: { include: { lessons: true } } }
  });

  if (!course) {
    console.log('Course not found');
    return;
  }

  // Delete empty sections
  for (const s of course.sections) {
    if (s.lessons.length === 0) {
      await p.section.delete({ where: { id: s.id } });
      console.log('Deleted empty section:', s.id);
    }
  }

  // Ensure Section 1 and Section 2 exist with lessons
  let s1 = await p.section.findFirst({
    where: { courseId: course.id, orderIndex: 1 }
  });
  if (!s1) {
    s1 = await p.section.create({
      data: {
        courseId: course.id,
        title: 'الوحدة الأولى: أساسيات التصميم وتجربة المستخدم وتجهيز Figma',
        orderIndex: 1
      }
    });
  }

  const s1Lessons = await p.lesson.findMany({ where: { sectionId: s1.id } });
  if (s1Lessons.length === 0) {
    await p.lesson.create({
      data: {
        sectionId: s1.id,
        title: '1. مقدمة في معايير تصميم واجهات المستخدم الحديثة (UI/UX)',
        slug: 'ui-ux-design-foundations',
        description: 'مرحباً بكم في أولى دروس تصميم واجهات المستخدم الاحترافية.',
        durationMinutes: 25,
        orderIndex: 1,
        isFreePreview: true,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDurationSeconds: 1500,
        videoProvider: 'DIRECT'
      }
    });
    await p.lesson.create({
      data: {
        sectionId: s1.id,
        title: '2. إنشاء أنظمة التصميم (Design Systems) والـ Color Palettes',
        slug: 'design-systems-and-palettes',
        description: 'بناء الـ Components والـ Auto-layout في Figma.',
        durationMinutes: 30,
        orderIndex: 2,
        isFreePreview: false,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDurationSeconds: 1800,
        videoProvider: 'DIRECT'
      }
    });
  }

  let s2 = await p.section.findFirst({
    where: { courseId: course.id, orderIndex: 2 }
  });
  if (!s2) {
    s2 = await p.section.create({
      data: {
        courseId: course.id,
        title: 'الوحدة الثانية: النماذج التفاعلية المتقدمة (Prototyping) والتصدير للمطورين',
        orderIndex: 2
      }
    });
  }

  const s2Lessons = await p.lesson.findMany({ where: { sectionId: s2.id } });
  if (s2Lessons.length === 0) {
    await p.lesson.create({
      data: {
        sectionId: s2.id,
        title: '3. تصميم واجهات الجوال وتطبيق معايير تجربة المستخدم RTL',
        slug: 'mobile-ui-ux-rtl-design',
        description: 'تطبيق عملي لتصميم شاشات تطبيق موبايل متكامل باللغة العربية.',
        durationMinutes: 35,
        orderIndex: 1,
        isFreePreview: false,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDurationSeconds: 2100,
        videoProvider: 'DIRECT'
      }
    });
    await p.lesson.create({
      data: {
        sectionId: s2.id,
        title: '4. بناء البروتوتايب التفاعلي وتجهيز ملفات التسليم للمبرمجين',
        slug: 'interactive-prototyping-developer-handoff',
        description: 'تجهيز ملفات Figma و Tokens للتسليم لفريق تطوير Front-end.',
        durationMinutes: 40,
        orderIndex: 2,
        isFreePreview: false,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDurationSeconds: 2400,
        videoProvider: 'DIRECT'
      }
    });
  }

  console.log('UI/UX course curriculum synchronized successfully!');
}

fixUiUx()
  .catch(console.error)
  .finally(() => p.$disconnect());
