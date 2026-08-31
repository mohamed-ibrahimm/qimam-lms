import React from 'react';
import { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import InstructorPlansClient from '@/components/instructor/InstructorPlansClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'باقات واشتراكات المحاضرين | أكاديمية قمم',
    description: 'اختر باقة الاشتراك المناسبة لإطلاق استوديو التدريس ونشر الدورات والبث المباشر التفاعلي.',
  };
}

export default async function InstructorPlansPage() {
  const user = await getCurrentUser();

  // Fetch platform settings and pricing
  const settings = await prisma.platformSetting.findMany().catch(() => []);
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const platformPricing = {
    monthlyPrice: Number(settingsMap['INSTRUCTOR_PRICE_MONTHLY']) || 290,
    annualPrice: Number(settingsMap['INSTRUCTOR_PRICE_ANNUAL']) || 1499,
    studentPrice: Number(settingsMap['INSTRUCTOR_PRICE_STUDENT']) || 120,
    studentMaxAge: Number(settingsMap['STUDENT_MAX_AGE']) || 22,
  };

  return (
    <div className="pt-24 sm:pt-28 pb-16 min-h-screen">
      <InstructorPlansClient
        user={user}
        platformPricing={platformPricing}
        platformSettings={settingsMap}
      />
    </div>
  );
}