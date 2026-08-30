import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminSidebarClient from '@/components/admin/AdminSidebarClient';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login?callbackUrl=/admin&error=unauthorized_admin');
  }

  let platformName = 'أكاديمية قِمَم';
  try {
    const platformNameSetting = await prisma.platformSetting.findUnique({
      where: { key: 'PLATFORM_NAME' }
    });
    if (platformNameSetting?.value) platformName = platformNameSetting.value;
  } catch (e) {
    console.error('Failed to fetch platform name in admin layout:', e);
  }

  const adminName = user.officialFullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'المدير';

  return (
    <div className="min-h-screen pt-14 sm:pt-16 pb-12 relative bg-slate-50 dark:bg-[#07050e] text-slate-900 dark:text-slate-100 antialiased transition-colors">
      
      {/* Container with ideal max-width and balanced padding */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
        
        {/* Streamlined Admin Sidebar */}
        <AdminSidebarClient
          platformName={platformName}
          adminName={adminName}
        />

        {/* Main Admin Content View (Clean, Raised Up, Zero Dead Space) */}
        <main className="flex-1 w-full min-w-0 py-1">
          {children}
        </main>
      </div>

    </div>
  );
}