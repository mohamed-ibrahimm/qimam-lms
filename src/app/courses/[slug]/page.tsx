import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { formatPrice, formatDuration } from '@/lib/utils';
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  PlayCircle,
  Lock,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Star,
  MessageCircle,
  Zap,
  Flame,
  UserCheck,
  Check,
} from 'lucide-react';

interface Props {
  params: { slug: string };
}

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({ params }: Props) {
  const user = await getCurrentUser();
  let decodedSlug = params.slug;
  try {
    decodedSlug = decodeURIComponent(params.slug);
  } catch (e) {}

  let course: any = null;
  try {
    course = await prisma.course.findFirst({
      where: {
        OR: [
          { slug: params.slug },
          { slug: decodedSlug },
        ]
      },
      include: {
        instructor: {
          select: { id: true, officialFullName: true, bio: true, avatarUrl: true }
        },
        category: true,
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' },
              include: {
                summary: true,
                quiz: { select: { id: true, title: true } }
              }
            }
          }
        },
        finalExam: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { officialFullName: true } } }
        }
      }
    });
  } catch (e) {
    console.error('Failed to fetch course detail:', e);
  }

  if (!course) {
    notFound();
  }

  // Check if current user is enrolled or course owner
  let isEnrolled = false;
  const isOwner = Boolean(user && (user.role === 'ADMIN' || user.id === course.instructorId));
  if (isOwner) {
    isEnrolled = true;
  } else if (user) {
    try {
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          userId: user.id,
          courseId: course.id,
          status: 'ACTIVE'
        }
      });
      if (enrollment) isEnrolled = true;
    } catch (e) {}
  }

  // Fetch WhatsApp number for direct contact
  let whatsappNum = '201001234567';
  try {
    const wsSetting = await prisma.platformSetting.findFirst({
      where: { key: { in: ['CONTACT_WHATSAPP', 'WHATSAPP_NUMBER', 'CONTACT_PHONE'] } }
    });
    if (wsSetting?.value) whatsappNum = wsSetting.value.replace(/[^0-9]/g, '');
  } catch (e) {}
  const formattedWhatsapp = whatsappNum.startsWith('0') ? '2' + whatsappNum : (whatsappNum.length < 10 ? '201001234567' : whatsappNum);
  const whatsappCourseUrl = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(`السلام عليكم، أود الاستفسار والتسجيل في دورة: ${course.title}`)}`;

  const firstLessonSlug = course.sections[0]?.lessons[0]?.slug;
  const requirements: string[] = course.requirements ? JSON.parse(course.requirements) : [];
  const learningObjectives: string[] = course.learningObjectives ? JSON.parse(course.learningObjectives) : [];
  const totalLessons = course.sections.reduce((acc: number, s: any) => acc + s.lessons.length, 0);

  const defaultObjectives = [
    'إتقان المبادئ الأساسية والتقنيات الهندسية المتقدمة وفق أحدث معايير العمل',
    'بناء مشاريع برمجية متكاملة وإضافتها إلى معرض أعمالك المهني (Portfolio)',
    'تطبيق أفضل ممارسات كتابة الأكواد النظيفة وحل المشكلات الواقعية',
    'الحصول على شهادة تخرج رقمية معتمدة برمز QR موثقة لدعم سيرتك الذاتية',
  ];
  const displayObjectives = learningObjectives.length > 0 ? learningObjectives : defaultObjectives;

  const reviewsCount = course.reviews.length;
  const avgRating = reviewsCount > 0
    ? (course.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewsCount).toFixed(1)
    : '5.0';

  // Dynamic pricing with high-impact savings
  const originalPrice = course.compareAtPrice || Math.round((course.price * 1.55) / 50) * 50;
  const discountAmount = Math.max(0, originalPrice - course.price);
  const discountPercent = originalPrice > course.price ? Math.round(((originalPrice - course.price) / originalPrice) * 100) : 35;

  const cleanThumbnail = course.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

  return (
    <div className="pb-24 pt-6 sm:pt-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================================
            UNIFIED TWO-COLUMN MASTERPIECE LAYOUT (Zero Empty Voids)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* =========================================================================
              RIGHT COLUMN: Main Course Info, Curriculum, Instructor & Reviews (col-span-7/8)
             ========================================================================= */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            
            {/* 1. Header & Breadcrumbs Card */}
            <div className="space-y-4">
              
              {/* Badges & Breadcrumb */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Link href="/courses" className="text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-amber-400 transition-colors font-medium">
                  الكورسات
                </Link>
                <span className="text-slate-400 dark:text-zinc-600">/</span>
                {course.category && (
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-amber-500/10 dark:text-amber-300 border border-blue-200 dark:border-amber-500/25 font-bold">
                    {course.category.name}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold">
                  {course.level === 'BEGINNER' ? 'مبتدئ' : course.level === 'INTERMEDIATE' ? 'متوسط' : 'متقدم'}
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{avgRating}</span>
                  <span className="text-slate-400 dark:text-zinc-400 font-normal">({reviewsCount > 0 ? `${reviewsCount} تقييم` : 'جديد'})</span>
                </div>
              </div>

              {/* Course Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                {course.title}
              </h1>

              {/* Course Description */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed">
                {course.description}
              </p>

              {/* Key Highlights Pill Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                
                {/* Instructor */}
                <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-xs">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-amber-500 dark:to-yellow-500 flex items-center justify-center font-black text-white text-[10px]">
                    {course.instructor?.officialFullName?.[0] || 'م'}
                  </div>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">
                    {course.instructor?.officialFullName || 'م / محمد إبراهيم'}
                  </span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-300 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                  <span>{formatDuration(course.durationHours)}</span>
                </div>

                {/* Sections & Lessons */}
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-300 font-semibold">
                  <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-amber-400" />
                  <span>{course.sections.length} وحدات • {totalLessons} درس</span>
                </div>

                {/* Certificate */}
                {course.certificateEnabled && (
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-700 dark:text-purple-300 font-bold">
                    <Award className="w-3.5 h-3.5 text-purple-500" />
                    <span>شهادة إتمام معتمدة</span>
                  </div>
                )}

              </div>

            </div>

            {/* 2. What You'll Learn (ماذا ستتعلم في هذا الكورس) */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white/95 dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800/80 shadow-md space-y-4">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-amber-400" />
                <span>ماذا ستتعلم في هذا الكورس؟</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {displayObjectives.map((obj: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="leading-relaxed">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Curriculum & Lessons Accordion (المنهج وخطة الدروس) - LIFTED UP! */}
            <div id="curriculum" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-amber-400" />
                  <span>المنهج وخطة الدروس</span>
                </h2>
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-bold bg-slate-100 dark:bg-zinc-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-zinc-700">
                  {course.sections.length} وحدات • {totalLessons} درس تعليمي
                </span>
              </div>

              <div className="space-y-3.5">
                {course.sections.map((section: any, sIndex: number) => (
                  <div key={section.id} className="rounded-2xl bg-white/95 dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800/80 shadow-xs overflow-hidden">
                    
                    {/* Section Header */}
                    <div className="p-4 bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 dark:bg-amber-500/20 dark:text-amber-400 text-xs font-black flex items-center justify-center border border-blue-200 dark:border-amber-500/30">
                          {sIndex + 1}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{section.title}</h3>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-semibold">{section.lessons.length} دروس</span>
                    </div>

                    {/* Lessons List */}
                    <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                      {section.lessons.map((lesson: any) => (
                        <div
                          key={lesson.id}
                          className="p-3.5 px-4 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {lesson.isFreePreview || isEnrolled ? (
                              <PlayCircle className="w-4 h-4 text-blue-600 dark:text-amber-400 shrink-0" />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-400 dark:text-zinc-600 shrink-0" />
                            )}
                            <span className="font-semibold text-slate-800 dark:text-zinc-200">{lesson.title}</span>
                            {lesson.isFreePreview && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/60">
                                معاينة مجانية
                              </span>
                            )}
                            {lesson.quiz && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold border border-purple-200 dark:border-purple-800">
                                اختبار
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-slate-500 dark:text-zinc-400 text-[11px]">{lesson.durationMinutes} دقيقة</span>
                            {(lesson.isFreePreview || isEnrolled) && (
                              <Link
                                href={`/learn/${course.slug}/${lesson.slug}`}
                                className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white dark:bg-amber-500/15 dark:hover:bg-amber-500 dark:text-amber-300 dark:hover:text-zinc-950 font-bold transition-all text-xs"
                              >
                                مشاهدة
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* 4. Requirements (المتطلبات المسبقة) */}
            {requirements.length > 0 && (
              <div className="p-6 rounded-2xl bg-white/95 dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800/80 shadow-xs space-y-3">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">المتطلبات المسبقة</h2>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-zinc-300">
                  {requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-amber-400" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 5. Instructor Bio (عن المحاضر) */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white/95 dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800/80 shadow-md space-y-4">
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">عن المحاضر</h2>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-amber-500 dark:to-yellow-400 p-[2px] shrink-0 shadow-md">
                  <div className="w-full h-full bg-slate-900 dark:bg-zinc-950 rounded-[14px] flex items-center justify-center font-black text-white text-xl">
                    {course.instructor?.officialFullName?.[0] || 'م'}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {course.instructor?.officialFullName || 'م / محمد إبراهيم'}
                    </h3>
                    <UserCheck className="w-4 h-4 text-blue-600 dark:text-amber-400" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {course.instructor?.bio || 'مهندس برمجيات أول ومحاضر معتمد بخبرة عملية في بناء الأنظمة والحلول الرقمية المتطورة.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 6. Student Reviews (تقييمات وآراء الطلاب) */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white/95 dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800/80 shadow-md space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span>تقييمات ومراجعات الطلاب ({reviewsCount})</span>
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{avgRating} من 5</span>
                </div>
              </div>

              {course.reviews.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-zinc-400 text-center py-4">
                  كن أول من يقيم هذا الكورس بعد إتمام الدرس الأول! 🌟
                </p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                  {course.reviews.map((rev: any) => (
                    <div key={rev.id} className="py-3.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {rev.user?.officialFullName || 'طالب مجهول'}
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* =========================================================================
              LEFT COLUMN: High-Converting Sticky Purchase & Offer Card (col-span-5/4)
             ========================================================================= */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4">
            
            {/* The Main High-End Checkout Card */}
            <div className="rounded-3xl bg-white/95 dark:bg-zinc-900/85 backdrop-blur-2xl border border-slate-200/90 dark:border-zinc-800/90 shadow-2xl overflow-hidden relative">
              
              {/* Luminous Top Gold/Blue Accent Line */}
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500" />

              {/* Upper Media Section */}
              <div className="p-4 sm:p-5 pb-0">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/80 dark:border-zinc-800 shadow-md">
                  <img
                    src={cleanThumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-black bg-black/75 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-sm">
                      <PlayCircle className="w-3 h-3 text-amber-400" />
                      <span>معاينة مجانية 🎥</span>
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/90 backdrop-blur-md text-white border border-rose-400/40 flex items-center gap-1 shadow-sm">
                      <Flame className="w-2.5 h-2.5" />
                      <span>خصم استثنائي</span>
                    </span>
                  </div>

                  {/* Centered Glowing Play Button for Preview */}
                  <Link
                    href={firstLessonSlug ? `/learn/${course.slug}/${firstLessonSlug}` : '#curriculum'}
                    className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                    title="بدء المعاينة وتشغيل الفيديو"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-zinc-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <PlayCircle className="w-8 h-8 fill-zinc-950 text-amber-400 mr-0.5" />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Limited-Time Offer Alert Ticker */}
              <div className="mx-4 sm:mx-5 mt-4 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 flex items-center justify-center gap-2 text-center text-xs font-black shadow-xs">
                <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
                <span>عرض استثنائي: وفر {discountPercent}% فوراً عند التسجيل اليوم!</span>
              </div>

              {/* Center Dazzling Pricing Block */}
              <div className="p-4 sm:p-5 pt-3 space-y-4">
                
                <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/70 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs sm:text-sm text-slate-400 dark:text-zinc-500 line-through font-bold">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-black border border-emerald-500/25">
                      وفر {discountPercent}% ({formatPrice(discountAmount)}) 🎉
                    </span>
                  </div>

                  {/* Huge Bold Centered Price */}
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-600 dark:text-amber-400 tracking-tight drop-shadow-sm">
                      {formatPrice(course.price)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                    دفعة واحدة لمرة واحدة • وصول فوري ودائم مدى الحياة
                  </p>
                </div>

                {/* Primary CTA Buttons */}
                {isEnrolled ? (
                  <Link
                    href={firstLessonSlug ? `/learn/${course.slug}/${firstLessonSlug}` : '#curriculum'}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98"
                  >
                    <PlayCircle className="w-5 h-5" />
                    <span>{isOwner ? 'أنت محاضر الدورة • دخول قاعة الدرس' : 'أنت مشترك بالفعل • استكمال التعلم 🚀'}</span>
                  </Link>
                ) : (
                  <div className="space-y-2.5">
                    <Link
                      href={`/checkout?courseId=${course.id}`}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 dark:from-amber-500 dark:via-yellow-500 dark:to-amber-600 dark:hover:from-amber-400 dark:hover:to-yellow-400 text-white dark:text-zinc-950 font-black text-sm shadow-xl shadow-blue-500/25 dark:shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>شراء الكورس والاشتراك الفوري</span>
                    </Link>

                    {/* Direct WhatsApp Instant Consultation/Enrollment */}
                    <a
                      href={whatsappCourseUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>طلب الكورس عبر واتساب والتفعيل المباشر</span>
                    </a>

                    <p className="text-center text-[10.5px] text-slate-500 dark:text-zinc-400 font-medium">
                      دفع مباشر آمن عبر InstaPay • فودافون كاش • البطاقات البنكية
                    </p>
                  </div>
                )}

                {/* Included Value Perks Checklist */}
                <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-4 space-y-2.5 text-xs text-slate-700 dark:text-zinc-300">
                  <p className="font-black text-slate-900 dark:text-white text-xs">يشمل هذا الاشتراك:</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>وصول دائم مدى الحياة لكافة الفيديوهات والملفات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>شهادة تخرج معتمدة برمز QR رسمي للتوظيف</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>مشاريع وتطبيقات واقعية تؤهلك لسوق العمل</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>مساعد ذكاء اصطناعي فوري داخل كل درس</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>تحديثات مستمرة للمحتوى مجاناً</span>
                  </div>
                </div>

                {/* Trust Guarantee Badge */}
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-amber-400" />
                  <span>دفع آمن 100% • ضمان جودة المحتوى الأكاديمي</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Mobile Sticky Bottom CTA Bar */}
      {!isEnrolled && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-zinc-800 p-3.5 flex items-center justify-between shadow-2xl">
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 line-through">
                {formatPrice(originalPrice)}
              </span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                وفر {discountPercent}%
              </span>
            </div>
            <span className="text-lg font-black text-blue-600 dark:text-amber-400">{formatPrice(course.price)}</span>
          </div>
          <Link
            href={`/checkout?courseId=${course.id}`}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-500 dark:to-yellow-500 text-white dark:text-zinc-950 font-black text-xs shadow-xl shadow-blue-500/25 dark:shadow-amber-500/25 flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>اشترك الآن والدفع الفوري</span>
          </Link>
        </div>
      )}
    </div>
  );
}