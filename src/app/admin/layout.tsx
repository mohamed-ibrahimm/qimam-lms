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
    <div className="min-h-screen pt-20 sm:pt-24 relative flex flex-col md:flex-row bg-slate-50 dark:bg-[#07050e] text-slate-900 dark:text-slate-100 antialiased transition-colors">
      
      {/* Crisp Solid Ambient Lighting (Zero Blur Glitch) */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-radial from-amber-500/5 via-transparent to-transparent opacity-60" />

      {/* Streamlined Admin Sidebar */}
      <AdminSidebarClient
        platformName={platformName}
        adminName={adminName}
      />

      {/* Main Admin Content View */}
      <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl relative z-10 w-full min-w-0">
        {children}
      </main>
    </div>
  );
}