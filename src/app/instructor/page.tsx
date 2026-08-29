import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { evaluateInstructorSubscription } from '@/lib/instructor-subscription';
import InstructorClient from './InstructorClient';

export const dynamic = 'force-dynamic';

export default async function InstructorStudioPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    redirect('/login?error=unauthorized_instructor');
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
