import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { formatPrice, formatDuration } from '@/lib/utils';
import {
  Award,
  Clock,
  Layers,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface Props {
  params: { slug: string };
}

export default async function DiplomaDetailPage({ params }: Props) {
  const user = await getCurrentUser();
  const diploma = await prisma.diploma.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      diplomaCourses: {
        orderBy: { orderIndex: 'asc' },
        include: {
          course: {
            include: {
              instructor: { select: { officialFullName: true } },
              sections: {
                include: {
                  lessons: { select: { id: true, title: true, durationMinutes: true, isFreePreview: true, slug: true } }
                }
              }
            }
          }
        }
      },
      finalExam: true
    }
  });

  if (!diploma) {
    notFound();
  }

  let isEnrolled = false;
  if (user) {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        diplomaId: diploma.id,
        status: 'ACTIVE',
      }
    });
    if (enrollment) isEnrolled = true;
  }

  const learningObjectives: string[] = diploma.learningObjectives ? JSON.parse(diploma.learningObjectives) : [];
  const requirements: string[] = diploma.requirements ? JSON.parse(diploma.requirements) : [];
  const totalOriginalPrice = diploma.diplomaCourses.reduce((sum, dc) => sum + dc.course.price, 0);

  return (
    <div className="pb-20 space-y-12">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-purple-950/40 via-surface to-background border-b border-border py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Link href="/diplomas" className="text-zinc-400 hover:text-white transition-colors">
                الدبلومات
              </Link>
              <span className="text-zinc-600">/</span>
              <span className="px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-bold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                دبلومة مهنية كبرى
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {diploma.title}
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {diploma.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-primary-400" />
                <span>{diploma.diplomaCourses.length} كورسات تخصصية</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
                <Award className="w-4 h-4 text-purple-400" />
                <span>شهادة الدبلومة الكبرى الموثقة برمز QR</span>
              </div>
            </div>
          </div>

          {/* Sticky Checkout Card */}
          <div className="lg:col-span-1 p-6 rounded-3xl bg-surface-card border border-purple-800/50 shadow-2xl space-y-6 sticky top-28">
            <div className="relative h-48 rounded-2xl overflow-hidden bg-zinc-900">
              <img
                src={diploma.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'}
                alt={diploma.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs text-zinc-400">سعر الدبلومة الكاملة</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-black text-white">{formatPrice(diploma.price)}</span>
                {totalOriginalPrice > diploma.price && (
                  <span className="text-sm text-zinc-500 line-through">
                    {formatPrice(totalOriginalPrice)}
                  </span>
                )}
              </div>
            </div>

            {isEnrolled ? (
              <Link
                href="/dashboard"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg text-center flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                أنت مسجل في الدبلومة • الانتقال لدراستي
              </Link>
            ) : (
              <div className="space-y-2">
                <Link
                  href={`/checkout?diplomaId=${diploma.id}`}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-5 h-5" />
                  تسجيل وشراء الدبلومة الآن
                </Link>
                <p className="text-center text-[11px] text-zinc-400">
                  دفع مباشر عبر InstaPay أو فودافون كاش
                </p>
              </div>
            )}

            <div className="border-t border-border pt-4 space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>فتح كافة كورسات الدبلومة دفعة واحدة</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>امتحان دبلومة نهائي شامل</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>شهادة الدبلومة الكبرى الرسمية</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses included */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">الكورسات المشمولة في الدبلومة</h2>
          <p className="text-xs text-zinc-400">
            تم ترتيب الكورسات تدريجياً لضمان بناء المعرفة البرمجية والتطبيقية بأعلى فاعلية.
          </p>
        </div>

        <div className="space-y-6">
          {diploma.diplomaCourses.map((dc, index) => {
            const course = dc.course;
            return (
              <div
                key={dc.id}
                className="p-6 rounded-3xl bg-surface border border-border space-y-4 hover:border-primary-600/50 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-purple-950 text-purple-300 font-black text-sm flex items-center justify-center border border-purple-800 shrink-0">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white">{course.title}</h3>
                      <p className="text-xs text-zinc-400">المحاضر: {course.instructor.officialFullName}</p>
                    </div>
                  </div>

                  <Link
                    href={`/courses/${course.slug}`}
                    className="px-4 py-2 rounded-xl bg-surface-raised hover:bg-surface-card border border-border text-xs font-bold text-zinc-200 transition-colors self-start sm:self-auto"
                  >
                    عرض تفاصيل الكورس
                  </Link>
                </div>

                <div className="p-3 rounded-2xl bg-surface-raised/60 text-xs text-zinc-400">
                  {course.sections.length} وحدات تعليمية • {course.sections.reduce((a, s) => a + s.lessons.length, 0)} درس
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}