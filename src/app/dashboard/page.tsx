import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDate, formatDuration, formatPrice } from '@/lib/utils';
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  PlayCircle,
  FileText,
  Bookmark,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  // Fetch student data
  const [enrollments, certificates, quizAttempts, notes, parentContact] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: user.id, status: 'ACTIVE' },
      include: {
        course: {
          include: {
            instructor: { select: { officialFullName: true } },
            sections: {
              include: {
                lessons: {
                  select: { id: true, title: true, slug: true, durationMinutes: true }
                }
              }
            }
          }
        },
        diploma: {
          include: {
            diplomaCourses: {
              include: { course: true }
            }
          }
        }
      },
      orderBy: { enrolledAt: 'desc' },
    }),
    prisma.certificate.findMany({
      where: { userId: user.id, isValid: true },
      orderBy: { issuedAt: 'desc' },
    }),
    prisma.quizAttempt.findMany({
      where: { userId: user.id },
      include: { quiz: true },
      orderBy: { completedAt: 'desc' },
      take: 10,
    }),
    prisma.studentNote.findMany({
      where: { userId: user.id },
      include: { lesson: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.parentContact.findFirst({
      where: { userId: user.id }
    })
  ]);

  const courseEnrollments = enrollments.filter((e) => e.courseId && e.course);
  const diplomaEnrollments = enrollments.filter((e) => e.diplomaId && e.diploma);
  const completedCoursesCount = courseEnrollments.filter((e) => e.isCompleted).length;

  const averageQuizScore = quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((acc, q) => acc + q.percentage, 0) / quizAttempts.length)
    : 0;

  // Find active course for "Continue Learning"
  const activeEnrollment = courseEnrollments.find((e) => !e.isCompleted) || courseEnrollments[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-surface to-surface border border-primary-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-950 border border-primary-800 text-primary-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>لوحة المتابعة الأكاديمية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            مرحباً بك، {user.firstName} {user.lastName} 🎓
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            الاسم المعتمد للشهادات: <strong className="text-white">{user.officialFullName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="px-5 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-card border border-border text-xs font-bold text-white transition-colors"
          >
            تصفح المزيد من الكورسات
          </Link>
          <Link
            href="/chat"
            className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-md shadow-primary-900/30"
          >
            <MessageSquare className="w-4 h-4" />
            <span>المحادثات</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
          <div className="w-8 h-8 rounded-lg bg-primary-950 text-primary-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white">{courseEnrollments.length}</p>
          <p className="text-xs text-zinc-400">الكورسات المشترك بها</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white">{completedCoursesCount}</p>
          <p className="text-xs text-zinc-400">الكورسات المكتملة</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white">{certificates.length}</p>
          <p className="text-xs text-zinc-400">الشهادات المكتسبة</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white">{averageQuizScore}%</p>
          <p className="text-xs text-zinc-400">متوسط درجات الاختبارات</p>
        </div>
      </div>

      {/* Continue Learning Featured Box */}
      {activeEnrollment && activeEnrollment.course && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-l from-primary-950/40 via-surface to-surface border border-primary-800/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-300 flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4 text-purple-400" />
              متابعة التعلم (آخر كورس تم فتحه):
            </span>
            <span className="text-xs font-bold text-emerald-400">
              إنجاز: {Math.round(activeEnrollment.progressPercent)}%
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {activeEnrollment.course.title}
              </h2>
              <p className="text-xs text-zinc-400">
                المحاضر: {activeEnrollment.course.instructor.officialFullName}
              </p>
            </div>

            <Link
              href={`/learn/${activeEnrollment.course.slug}/${activeEnrollment.course.sections[0]?.lessons[0]?.slug || ''}`}
              className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all shadow-lg shadow-primary-900/40 flex items-center gap-2 shrink-0 hover:scale-105"
            >
              <PlayCircle className="w-4 h-4" />
              <span>متابعة المشاهدة الآن</span>
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-surface-raised overflow-hidden border border-border/80">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, activeEnrollment.progressPercent)}%` }}
            />
          </div>
        </div>
      )}

      {/* Enrolled Courses Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-white">الكورسات المشترك فيها ({courseEnrollments.length})</h2>
            <Link
              href="/dashboard/my-courses"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 transition-colors"
            >
              عرض الصفحة المستقلة ➔
            </Link>
          </div>
          <Link href="/courses" className="text-xs font-bold text-primary-400 hover:underline">
            استكشف المزيد من الكورسات
          </Link>
        </div>

        {courseEnrollments.length === 0 ? (
          <div className="py-12 text-center rounded-3xl bg-surface border border-border space-y-3">
            <BookOpen className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-sm font-bold text-white">لم تقم بالاشتراك في أي كورس حتى الآن</p>
            <Link
              href="/courses"
              className="inline-block px-5 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-bold"
            >
              تصفح الكورسات المتاحة
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseEnrollments.map((enr) => {
              const course = enr.course!;
              const firstSlug = course.sections[0]?.lessons[0]?.slug || '';

              return (
                <div
                  key={enr.id}
                  className="rounded-2xl bg-surface border border-border hover:border-primary-600/50 p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all"
                >
                  <div className="space-y-3">
                    <div className="relative h-40 rounded-xl overflow-hidden bg-zinc-900">
                      <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      {enr.isCompleted && (
                        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-emerald-950/90 border border-emerald-700 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>مكتمل</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-zinc-400">المحاضر: {course.instructor.officialFullName}</p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">التقدم:</span>
                      <span className="font-bold text-primary-400">{Math.round(enr.progressPercent)}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-surface-raised overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full"
                        style={{ width: `${Math.max(4, enr.progressPercent)}%` }}
                      />
                    </div>

                    <Link
                      href={`/learn/${course.slug}/${firstSlug}`}
                      className="w-full py-2.5 rounded-xl bg-surface-raised hover:bg-primary-600 hover:text-white text-zinc-200 border border-border text-center text-xs font-bold block transition-all"
                    >
                      دخول قاعة الدرس
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Diplomas Tab if enrolled */}
      {diplomaEnrollments.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white">دبلوماتي الشاملة ({diplomaEnrollments.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diplomaEnrollments.map((enr) => {
              const diploma = enr.diploma!;
              return (
                <div
                  key={enr.id}
                  className="p-6 rounded-3xl bg-surface border border-purple-800/40 space-y-4"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                    <Award className="w-4 h-4" />
                    <span>دبلومة مهنية كبرى</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{diploma.title}</h3>
                  <p className="text-xs text-zinc-400">
                    تتضمن {diploma.diplomaCourses.length} دورات تدريبية متقدمة
                  </p>
                  <Link
                    href={`/diplomas/${diploma.slug}`}
                    className="inline-block px-4 py-2 rounded-xl bg-purple-950 text-purple-300 border border-purple-800 text-xs font-bold"
                  >
                    عرض مقررات الدبلومة
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Earned Certificates */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-white">الشهادات المكتسبة المعتمدة ({certificates.length})</h2>
        {certificates.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-surface border border-border space-y-2">
            <Award className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">
              أكمل مقرراتك واجتز الاختبارات النهائية للحصول على شهاداتك الرسمية مع رمز QR للتحقق.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl bg-surface border border-purple-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    معتمدة وموثقة
                  </span>
                  <span className="text-[10px] text-zinc-500">{formatDate(cert.issuedAt)}</span>
                </div>

                <h4 className="text-sm font-bold text-white line-clamp-1">{cert.title}</h4>
                <p className="text-xs text-zinc-400">
                  كود الشهادة: <strong className="text-white font-mono">{cert.certificateNumber}</strong>
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href={`/verify/${cert.certificateNumber}`}
                    className="px-3.5 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold flex items-center gap-1"
                  >
                    عرض وثيقة التحقق
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}