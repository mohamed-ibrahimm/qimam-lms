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
    <div className="min-h-screen pt-16 sm:pt-20 relative flex flex-col bg-slate-50 dark:bg-[#07050e] text-slate-900 dark:text-slate-100 antialiased transition-colors">
      
      {/* Dynamic Animated Ambient Light Orbs (Exact matching Homepage DesktopHero) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="dynamic-drift-1 absolute top-[10%] right-[20%] w-[500px] h-[380px] bg-amber-400/20 dark:bg-amber-500/15 rounded-full blur-[120px]" />
        <div className="dynamic-drift-2 absolute bottom-[15%] left-[25%] w-[520px] h-[400px] bg-blue-500/20 dark:bg-purple-600/15 rounded-full blur-[130px]" />
        <div className="dynamic-drift-3 absolute top-[40%] left-[5%] w-[420px] h-[320px] bg-indigo-400/15 dark:bg-yellow-500/10 rounded-full blur-[110px]" />
      </div>

      {/* Full-width seamless Dashboard Frame (Docked Sidebar + Fluid Content) */}
      <div className="flex-1 flex flex-col md:flex-row w-full items-start">
        
        {/* Docked Admin Sidebar (Attached cleanly to the right edge) */}
        <AdminSidebarClient
          platformName={platformName}
          adminName={adminName}
        />

        {/* Main Admin Content Canvas (Raised up directly below header with zero dead space) */}
        <main className="flex-1 min-w-0 px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2 w-full max-w-7xl">
          {children}
        </main>
      </div>

    </div>
  );
}