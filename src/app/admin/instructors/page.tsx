import React from 'react';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { evaluateInstructorSubscription } from '@/lib/instructor-subscription';
import InstructorsClient from './InstructorsClient';

export const dynamic = 'force-dynamic';

export default async function AdminInstructorsPage() {
  const admin = await requireAuth(['ADMIN']);
  if (!admin) {
    redirect('/login');
  }

  const instructors = await prisma.user.findMany({
    where: {
      OR: [
        { role: 'INSTRUCTOR' },
        { role: 'ADMIN' },
      ]
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      role: true,
      firstName: true,
      lastName: true,
      officialFullName: true,
      email: true,
      phone: true,
      avatarUrl: true,
      instructorStatus: true,
      trialEndsAt: true,
      subscriptionPlan: true,
      subscriptionEndsAt: true,
      instapayAddress: true,
      instapayName: true,
      vodafoneCashNumber: true,
      createdAt: true,
      _count: {
        select: {
          instructedCourses: true,
        }
      }
    }
  });

  const pendingSubscriptionPayments = await prisma.instructorSubscriptionPayment.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    include: {
      instructor: {
        select: { id: true, officialFullName: true, email: true, phone: true }
      }
    }
  });

  const enrichedInstructors = instructors.map((inst) => {
    const sub = evaluateInstructorSubscription(inst);
    return {
      ...inst,
      subscriptionState: sub,
    };
  });

  return (
    <InstructorsClient
      admin={admin}
      instructors={enrichedInstructors}
      initialPendingSubscriptions={pendingSubscriptionPayments as any}
    />
  );
}
