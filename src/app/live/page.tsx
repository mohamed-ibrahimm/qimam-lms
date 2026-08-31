import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import LiveMeetingHub from '@/components/live/LiveMeetingHub';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'قاعات البث المباشر والاجتماعات الافتراضية | أكاديمية قمم',
    description: 'انضم إلى محاضرتك الافتراضية عبر معرّف القاعة أو ابدأ بثاً جديداً لطلابك بجودة عالية.',
  };
}

export default async function LiveMeetingPage() {
  const currentUser = await getCurrentUser();

  const settings = await prisma.platformSetting.findMany().catch(() => []);
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const platformName = (settingsMap['PLATFORM_NAME'] || 'أكاديمية م / محمد إبراهيم')
    .replace(/سنجر/g, '')
    .trim();

  return (
    <div className="w-full pb-16">
      <LiveMeetingHub
        currentUser={currentUser}
        platformName={platformName}
      />
    </div>
  );
}