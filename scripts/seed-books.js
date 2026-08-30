const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const instructor = await prisma.user.findFirst({
    where: { role: { in: ['INSTRUCTOR', 'ADMIN'] } }
  });
  if (!instructor) {
    console.log('No instructor found');
    return;
  }

  const books = [
    {
      title: 'الملخص الذهبي الشامل في هندسة البرمجيات وتصميم النظم',
      slug: 'software-engineering-golden-summary',
      coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=600',
      fileUrl: '/uploads/sample_notes.pdf',
      description: 'ملخص مكثف وعالي الجودة يشمل أهم المفاهيم الهندسية، أنماط التصميم (Design Patterns)، ومبادئ SOLID مع أمثلة عملية ورسومات توضيحية تسهل الفهم والمراجعة قبل الامتحانات والمقابلات التقنية.',
      shortDescription: 'ملخص شامل لهندسة البرمجيات وأنماط التصميم مع أمثلة محلولة.',
      pageCount: 45,
      previewPagesCount: 4,
      price: 45,
      compareAtPrice: 85,
      isFree: false,
      authorName: 'م. محمد طارق عبد العزيز',
      academicSubject: 'هندسة البرمجيات',
      academicLevel: 'الفرقة الثالثة والرابعة',
      category: 'ملخصات',
      instructorId: instructor.id,
      salesCount: 128,
      viewsCount: 1420,
      rating: 4.9
    },
    {
      title: 'بنك أسئلة واختبارات هياكل البيانات والخوارزميات (محلول بالكامل)',
      slug: 'dsa-solved-exams-bank',
      coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
      fileUrl: '/uploads/sample_notes.pdf',
      description: 'أكثر من 150 مسألة وسؤال امتحانات جامعية ومقابلات شركات كبرى في هياكل البيانات (Arrays, Trees, Graphs, DP) مع الشرح والحل البرمجي خطوة بخطوة بالـ C++ و Python.',
      shortDescription: '150 مسألة امتحانات في الخوارزميات وهياكل البيانات مع الحلول النموذجية.',
      pageCount: 68,
      previewPagesCount: 5,
      price: 60,
      compareAtPrice: 110,
      isFree: false,
      authorName: 'د. عبد الرحمن خالد',
      academicSubject: 'هياكل البيانات والخوارزميات',
      academicLevel: 'الفرقة الثانية',
      category: 'بنك أسئلة',
      instructorId: instructor.id,
      salesCount: 215,
      viewsCount: 2890,
      rating: 5.0
    },
    {
      title: 'الدليل العملي لاحتراف تطوير واجهات الويب (React & Next.js 14)',
      slug: 'react-nextjs-handbook',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
      fileUrl: '/uploads/sample_notes.pdf',
      description: 'مرجع كامل وعصري يشرح بناء التطبيقات من الصفر حتى النشر، إدارة الحالة، تحسين محركات البحث SEO، والأمان، مع مشروع متجر إلكتروني تطبيقي متكامل.',
      shortDescription: 'دليل شامل لاحتراف أحدث تقنيات React و Next.js 14 بمشاريع إنتاجية.',
      pageCount: 92,
      previewPagesCount: 6,
      price: 75,
      compareAtPrice: 150,
      isFree: false,
      authorName: 'م / محمد إبراهيم',
      academicSubject: 'تطوير الويب والبرمجة',
      academicLevel: 'كافة المستويات',
      category: 'كتب ومراجع',
      instructorId: instructor.id,
      salesCount: 340,
      viewsCount: 4100,
      rating: 4.95
    },
    {
      title: 'مذكرة القوانين والمسائل المحلولة في الرياضيات الهندسية 2',
      slug: 'engineering-math-2-notes',
      coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600',
      fileUrl: '/uploads/sample_notes.pdf',
      description: 'تلخيص شامل لكافة قوانين التكاملات المتعددة، المعادلات التفاضلية، ومتسلسلات فورييه مع شروحات مبسطة وحلول امتحانات السنوات السابقة بالخطوات التفصيلية.',
      shortDescription: 'تلخيص قوانين وحلول امتحانات الرياضيات الهندسية والتفاضل والتكامل.',
      pageCount: 38,
      previewPagesCount: 3,
      price: 35,
      compareAtPrice: 70,
      isFree: false,
      authorName: 'م. أحمد مصطفى',
      academicSubject: 'رياضيات هندسية 2',
      academicLevel: 'الفرقة الأولى والثانية',
      category: 'ملخصات',
      instructorId: instructor.id,
      salesCount: 89,
      viewsCount: 950,
      rating: 4.85
    },
    {
      title: 'ملخص مهارات مقابلات البرمجة والـ Problem Solving (مجاني)',
      slug: 'free-coding-interview-cheatsheet',
      coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600',
      fileUrl: '/uploads/sample_notes.pdf',
      description: 'أهم الأسئلة الشائعة، التكتيكات الذهنية لحل المسائل المعقدة، وأسرار اجتياز المقابلات التقنية في كبرى الشركات البرمجية بنجاح.',
      shortDescription: 'كتيب مجاني يلخص أسرار المقابلات البرمجية وأسئلة حل المشكلات.',
      pageCount: 24,
      previewPagesCount: 24,
      price: 0,
      compareAtPrice: 50,
      isFree: true,
      authorName: 'م / محمد إبراهيم',
      academicSubject: 'التأهيل الوظيفي',
      academicLevel: 'عام للخريجين والطلاب',
      category: 'كتب ومراجع',
      instructorId: instructor.id,
      salesCount: 520,
      viewsCount: 6300,
      rating: 5.0
    }
  ];

  for (const b of books) {
    await prisma.digitalBook.upsert({
      where: { slug: b.slug },
      create: b,
      update: b
    });
  }
  console.log('Seeded sample books successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
