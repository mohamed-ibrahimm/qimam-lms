import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { evaluateInstructorSubscription } from '@/lib/instructor-subscription';
import InstructorClient from './InstructorClient';
import { GraduationCap, ArrowLeft, KeyRound } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InstructorStudioPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 relative">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#120e24]/95 border border-slate-200 dark:border-purple-500/40 shadow-2xl text-center space-y-5 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-md">
            <GraduationCap className="w-8 h-8" />
          </div>
          
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              استوديو المحاضر السحابي (Instructor)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-medium">
              هذه الصفحة مخصصة لإدارة دورات المحاضر، المبيعات، والدروس. يمكنك الدخول الفوري بضغطة زر واحدة للمعاينة والتجربة على الهاتف.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <a
              href="/api/auth/quick-role?role=INSTRUCTOR&redirect=/instructor"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>دخول فوري كـ محاضر معتمد الآن</span>
              <ArrowLeft className="w-4 h-4 text-white" />
            </a>

            <Link
              href="/login?callbackUrl=/instructor"
              className="w-full h-11 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-zinc-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-white/10 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>تسجيل الدخول بالبيانات</span>
            </Link>

            <Link
              href="/instructors/join"
              className="w-full text-center text-xs text-purple-600 dark:text-purple-400 hover:underline block pt-1 font-bold"
            >
              الاطلاع على باقات ومزايا المحاضرين
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch full user record from DB for up-to-date subscription and payments
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      role: true,
      firstName: true,
      lastName: true,
      officialFullName: true,
      email: true,
      phone: true,
      avatarUrl: true,
      bio: true,
      instructorStatus: true,
      trialEndsAt: true,
      subscriptionPlan: true,
      subscriptionEndsAt: true,
      instapayAddress: true,
      instapayName: true,
      vodafoneCashNumber: true,
      paymentInstructions: true,
      createdAt: true,
    }
  });

  if (!dbUser) {
    redirect('/login');
  }

  const subscriptionState = evaluateInstructorSubscription(dbUser);

  let courses: any[] = [];
  try {
    courses = await prisma.course.findMany({
      where: dbUser.role === 'ADMIN' ? {} : { instructorId: dbUser.id },
      orderBy: { createdAt: 'desc' },
      include: {
        instructor: { select: { officialFullName: true } },
        _count: { select: { sections: true, enrollments: true } },
        sections: {
          include: {
            lessons: {
              include: { quiz: { include: { attempts: true } } }
            }
          }
        }
      }
    });
  } catch (e) {
    console.error('Failed to fetch instructor courses:', e);
  }

  const totalStudents = courses.reduce((acc, c) => acc + c._count.enrollments, 0);

  // Fetch instructor's coupons
  let coupons: any[] = [];
  try {
    coupons = await prisma.coupon.findMany({
      where: dbUser.role === 'ADMIN' ? {} : { instructorId: dbUser.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { usages: true } }
      }
    });
  } catch (e) {}

  // Fetch instructor's student orders/payments
  let studentPayments: any[] = [];
  try {
    studentPayments = await prisma.payment.findMany({
      where: dbUser.role === 'ADMIN' ? {} : {
        order: {
          course: {
            instructorId: dbUser.id,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: { select: { id: true, officialFullName: true, firstName: true, email: true, phone: true } },
        order: {
          include: {
            course: { select: { id: true, title: true, slug: true } },
            coupon: { select: { code: true } }
          }
        }
      }
    });
  } catch (e) {}

  // Fetch platform settings for subscription renewal instructions
  let platformSettings: Record<string, string> = {};
  try {
    const s = await prisma.platformSetting.findMany();
    platformSettings = Object.fromEntries(s.map((item) => [item.key, item.value]));
  } catch (e) {}

  return (
    <InstructorClient
      user={dbUser}
      initialCourses={courses as any}
      totalStudents={totalStudents}
      subscriptionState={subscriptionState}
      initialCoupons={coupons as any}
      initialPayments={studentPayments as any}
      platformSettings={platformSettings}
    />
  );
}
