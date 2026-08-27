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
  FileText,
  HelpCircle,
  Lock,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface Props {
  params: { slug: string };
}

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({ params }: Props) {
  const user = await getCurrentUser();
  let course: any = null;
  try {
    course = await prisma.course.findUnique({
      where: { slug: params.slug },
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

  // Check if current user is enrolled
  let isEnrolled = false;
  let firstLessonSlug = course.sections[0]?.lessons[0]?.slug;

  if (user) {
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

  const requirements: string[] = course.requirements ? JSON.parse(course.requirements) : [];
  const learningObjectives: string[] = course.learningObjectives ? JSON.parse(course.learningObjectives) : [];
  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

  return (
    <div className="pb-20 space-y-12">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-surface-raised via-surface to-background border-b border-border py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Link href="/courses" className="text-zinc-400 hover:text-white transition-colors">
                الكورسات
              </Link>
              <span className="text-zinc-600">/</span>
              {course.category && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary-950 text-primary-300 border border-primary-800 font-semibold">
                  {course.category.name}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-surface-card border border-border text-zinc-300">
                {course.level === 'BEGINNER' ? 'مبتدئ' : course.level === 'INTERMEDIATE' ? 'متوسط' : 'متقدم'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-900 border border-primary-700 flex items-center justify-center font-bold text-white text-xs">
                  {course.instructor.officialFullName[0]}
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500">المحاضر المعتمد</p>
                  <p className="font-bold text-white">{course.instructor.officialFullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary-400" />
                <span>{formatDuration(course.durationHours)}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-primary-400" />
                <span>{course.sections.length} وحدات • {totalLessons} درس</span>
              </div>

              {course.certificateEnabled && (
                <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>شهادة إتمام معتمدة</span>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Pricing / Action Card */}
          <div className="lg:col-span-1 p-6 rounded-3xl bg-surface-card border border-primary-800/40 shadow-2xl space-y-6 sticky top-28">
            <div className="relative h-48 rounded-2xl overflow-hidden bg-zinc-900">
              <img
                src={course.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary-600/90 text-white flex items-center justify-center shadow-lg backdrop-blur-sm">
                  <PlayCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-zinc-400">سعر الاشتراك الكامل</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-black text-white">{formatPrice(course.price)}</span>
                {course.compareAtPrice && (
                  <span className="text-sm text-zinc-500 line-through">
                    {formatPrice(course.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            {isEnrolled ? (
              <Link
                href={`/learn/${course.slug}/${firstLessonSlug || ''}`}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <PlayCircle className="w-5 h-5" />
                أنت مشترك بالفعل • استكمال التعلم
              </Link>
            ) : (
              <div className="space-y-2">
                <Link
                  href={`/checkout?courseId=${course.id}`}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-primary-900/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-5 h-5" />
                  شراء الكورس الآن والدفع الفوري
                </Link>
                <p className="text-center text-[11px] text-zinc-400">
                  دفع مباشر عبر InstaPay أو فودافون كاش أو كوبون الخصم
                </p>
              </div>
            )}

            <div className="border-t border-border pt-4 space-y-2.5 text-xs text-zinc-300">
              <p className="font-bold text-white">يشمل الكورس:</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>وصول دائم مدى الحياة لكافة الفيديوهات والملفات</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>اختبارات تقييمية ومشاريع عملية</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>مساعد ذكاء اصطناعي فوري داخل كل درس</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>شهادة تخرج رقمية برمز QR للتحقق الرسمي</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Curriculum */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Learning Objectives */}
          {learningObjectives.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-400" />
                ماذا ستتعلم في هذا الكورس؟
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {learningObjectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum Accordion */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">المنهج وخطة الدروس</h2>
              <span className="text-xs text-zinc-400">
                {course.sections.length} وحدات • {totalLessons} درس تعليمي
              </span>
            </div>

            <div className="space-y-4">
              {course.sections.map((section, sIndex) => (
                <div key={section.id} className="rounded-2xl bg-surface border border-border overflow-hidden">
                  <div className="p-4 bg-surface-raised/80 flex items-center justify-between border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-primary-950 text-primary-300 text-xs font-bold flex items-center justify-center border border-primary-800">
                        {sIndex + 1}
                      </span>
                      <h3 className="text-sm font-bold text-white">{section.title}</h3>
                    </div>
                    <span className="text-xs text-zinc-400">{section.lessons.length} دروس</span>
                  </div>

                  <div className="divide-y divide-border/40">
                    {section.lessons.map((lesson, lIndex) => (
                      <div
                        key={lesson.id}
                        className="p-3.5 px-4 flex items-center justify-between text-xs hover:bg-surface-raised/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.isFreePreview || isEnrolled ? (
                            <PlayCircle className="w-4 h-4 text-primary-400 shrink-0" />
                          ) : (
                            <Lock className="w-4 h-4 text-zinc-600 shrink-0" />
                          )}
                          <span className="font-medium text-zinc-200">{lesson.title}</span>
                          {lesson.isFreePreview && (
                            <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-800/60">
                              معاينة مجانية
                            </span>
                          )}
                          {lesson.quiz && (
                            <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-semibold border border-purple-800">
                              اختبار
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-zinc-500">{lesson.durationMinutes} دقيقة</span>
                          {(lesson.isFreePreview || isEnrolled) && (
                            <Link
                              href={`/learn/${course.slug}/${lesson.slug}`}
                              className="px-3 py-1 rounded-lg bg-primary-600/20 text-primary-300 hover:bg-primary-600 hover:text-white font-bold transition-colors"
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

          {/* Requirements */}
          {requirements.length > 0 && (
            <div className="p-6 rounded-3xl bg-surface border border-border space-y-3">
              <h2 className="text-base font-bold text-white">المتطلبات المسبقة</h2>
              <ul className="space-y-2 text-xs text-zinc-300">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructor Bio */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-4">
            <h2 className="text-base font-bold text-white">عن المحاضر</h2>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-purple-400 p-[2px] shrink-0">
                <div className="w-full h-full bg-zinc-900 rounded-[14px] flex items-center justify-center font-bold text-white text-lg">
                  {course.instructor.officialFullName[0]}
                </div>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white">{course.instructor.officialFullName}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {course.instructor.bio || 'خبير ومحاضر معتمد في هندسة البرمجيات والتقنيات الحديثة.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}