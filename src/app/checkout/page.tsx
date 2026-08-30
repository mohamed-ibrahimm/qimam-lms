import React from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import CheckoutClient from './CheckoutClient';

interface Props {
  searchParams: {
    courseId?: string;
    diplomaId?: string;
    bookId?: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) {
    const returnUrl = `/checkout?${
      searchParams.bookId
        ? `bookId=${searchParams.bookId}`
        : searchParams.courseId
        ? `courseId=${searchParams.courseId}`
        : `diplomaId=${searchParams.diplomaId}`
    }`;
    redirect(`/login?callbackUrl=${encodeURIComponent(returnUrl)}`);
  }

  let item: any = null;
  let itemType: 'COURSE' | 'DIPLOMA' | 'BOOK' = 'COURSE';

  if (searchParams.bookId) {
    item = await prisma.digitalBook.findUnique({
      where: { id: searchParams.bookId },
      include: {
        instructor: {
          select: {
            id: true,
            officialFullName: true,
            firstName: true,
            instapayAddress: true,
            instapayName: true,
            vodafoneCashNumber: true,
            paymentInstructions: true,
            role: true,
            instructorStatus: true,
            trialEndsAt: true,
            subscriptionEndsAt: true,
            subscriptionPlan: true,
            createdAt: true,
          }
        }
      }
    });
    itemType = 'BOOK';
  } else if (searchParams.courseId) {
    item = await prisma.course.findUnique({
      where: { id: searchParams.courseId },
      include: {
        instructor: {
          select: {
            id: true,
            officialFullName: true,
            firstName: true,
            instapayAddress: true,
            instapayName: true,
            vodafoneCashNumber: true,
            paymentInstructions: true,
            role: true,
            instructorStatus: true,
            trialEndsAt: true,
            subscriptionEndsAt: true,
            subscriptionPlan: true,
            createdAt: true,
          }
        }
      }
    });
    itemType = 'COURSE';
  } else if (searchParams.diplomaId) {
    item = await prisma.diploma.findUnique({
      where: { id: searchParams.diplomaId },
      include: { diplomaCourses: { include: { course: true } } }
    });
    itemType = 'DIPLOMA';
  }

  if (!item) {
    redirect(itemType === 'BOOK' ? '/books' : '/courses');
  }

  // Check if book is already purchased
  if (itemType === 'BOOK') {
    const existingBookPurchase = await prisma.bookPurchase.findUnique({
      where: {
        userId_bookId: {
          userId: user.id,
          bookId: item.id,
        }
      }
    });
    if (existingBookPurchase) {
      redirect(`/books/${item.slug}`);
    }
  }

  // Check if course instructor's subscription or 14-day trial is paused or expired
  if (itemType === 'COURSE' && item.instructor && item.instructor.role !== 'ADMIN') {
    const { evaluateInstructorSubscription } = await import('@/lib/instructor-subscription');
    const subState = evaluateInstructorSubscription(item.instructor);
    if (!subState.canAcceptOrders) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-surface border border-border shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold">
              ⏳
            </div>
            <h2 className="text-xl font-black text-white">التسجيل في هذا الكورس متوقف مؤقتاً</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              عزيزي الطالب، تم إيقاف استقبال طلبات التسجيل في هذا المسار مؤقتاً بواسطة إدارة الأكاديمية أو المحاضر لتحديث المحتوى. يمكنك تصفح باقي الكورسات المتاحة.
            </p>
            <div className="pt-2">
              <a
                href="/courses"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all shadow-md"
              >
                تصفح دليل الكورسات المتاحة
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  // Check if already enrolled in course/diploma
  if (itemType !== 'BOOK') {
    const existing = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: searchParams.courseId || undefined,
        diplomaId: searchParams.diplomaId || undefined,
        status: 'ACTIVE',
      }
    });

    if (existing) {
      redirect('/dashboard');
    }
  }

  // Fetch Payment settings
  const settings = await prisma.platformSetting.findMany();
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  // If this course belongs to an instructor with custom payment credentials, route payments directly to them
  const instructor = item.instructor;
  if (instructor && instructor.role !== 'ADMIN') {
    if (instructor.instapayAddress) settingsMap['INSTAPAY_ACCOUNT'] = instructor.instapayAddress;
    if (instructor.instapayName) settingsMap['INSTAPAY_NAME'] = instructor.instapayName;
    if (instructor.paymentInstructions) settingsMap['INSTAPAY_INSTRUCTIONS'] = instructor.paymentInstructions;
    if (instructor.vodafoneCashNumber) settingsMap['VODAFONE_CASH_NUMBER'] = instructor.vodafoneCashNumber;
    if (instructor.officialFullName) settingsMap['VODAFONE_CASH_NAME'] = instructor.officialFullName;
    if (instructor.paymentInstructions) settingsMap['VODAFONE_CASH_INSTRUCTIONS'] = instructor.paymentInstructions;
  }

  return (
    <CheckoutClient
      item={item}
      itemType={itemType}
      user={user}
      settings={settingsMap}
    />
  );
}