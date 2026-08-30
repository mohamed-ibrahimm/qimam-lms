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
    <div className="min-h-screen flex flex-col pt-[4.25rem] sm:pt-[4.5rem] bg-slate-50 dark:bg-[#07050e] text-slate-900 dark:text-slate-100 antialiased transition-colors">
      
      {/* Full-width seamless Dashboard Frame (Docked Sidebar + Fluid Content) */}
      <div className="flex-1 flex flex-col md:flex-row w-full items-start">
        
        {/* Docked Admin Sidebar (Attached cleanly to the right edge) */}
        <AdminSidebarClient
          platformName={platformName}
          adminName={adminName}
        />

        {/* Main Admin Content Canvas (Raised up right below header with no dead space) */}
        <main className="flex-1 min-w-0 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 w-full max-w-7xl">
          {children}
        </main>
      </div>

    </div>
  );
}