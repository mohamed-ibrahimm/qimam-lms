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
    <div className="min-h-screen relative flex flex-col">
      {/* Dynamic Ambient Mesh in Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="dynamic-drift-1 absolute top-[5%] right-[15%] w-[550px] h-[550px] bg-blue-400/15 dark:bg-amber-500/10 rounded-full blur-[130px]" />
        <div className="dynamic-drift-2 absolute bottom-[10%] right-[40%] w-[500px] h-[500px] bg-indigo-500/15 dark:bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="dynamic-drift-3 absolute top-[35%] left-[5%] w-[450px] h-[450px] bg-fuchsia-400/10 dark:bg-pink-600/10 rounded-full blur-[120px]" />
        <div className="dynamic-drift-4 absolute bottom-[25%] left-[25%] w-[480px] h-[480px] bg-emerald-400/10 dark:bg-teal-600/10 rounded-full blur-[125px]" />
      </div>

      {/* Modern Slim Status Bar & Floating Command Palette Launcher */}
      <AdminSidebarClient
        platformName={platformName}
        adminName={adminName}
      />

      {/* Main Admin View Area (Full Width & Pristine Margin) */}
      <main className="flex-1 p-3 sm:p-6 md:p-8 max-w-7xl mx-auto relative z-10 w-full min-w-0">
        {children}
      </main>
    </div>
  );
}