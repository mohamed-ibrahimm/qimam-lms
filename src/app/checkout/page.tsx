import React from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import CheckoutClient from './CheckoutClient';

interface Props {
  searchParams: {
    courseId?: string;
    diplomaId?: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) {
    const returnUrl = `/checkout?${searchParams.courseId ? `courseId=${searchParams.courseId}` : `diplomaId=${searchParams.diplomaId}`}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(returnUrl)}`);
  }

  let item: any = null;
  let itemType: 'COURSE' | 'DIPLOMA' = 'COURSE';

  if (searchParams.courseId) {
    item = await prisma.course.findUnique({
      where: { id: searchParams.courseId },
      include: { instructor: { select: { officialFullName: true } } }
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
    redirect('/courses');
  }

  // Check if already enrolled
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

  // Fetch Payment settings
  const settings = await prisma.platformSetting.findMany();
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <CheckoutClient
      item={item}
      itemType={itemType}
      user={user}
      settings={settingsMap}
    />
  );
}