import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminSidebarClient from '@/components/admin/AdminSidebarClient';
import { ShieldAlert, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  let platformName = 'أكاديمية قِمَم';
  try {
    const platformNameSetting = await prisma.platformSetting.findUnique({
      where: { key: 'PLATFORM_NAME' }
    });
    if (platformNameSetting?.value) platformName = platformNameSetting.value;
  } catch (e) {
    console.error('Failed to fetch platform name in admin layout:', e);
  }

  // Mobile Friendly Gateway if not logged in as ADMIN
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 relative">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#120e24]/95 border border-slate-200 dark:border-amber-500/40 shadow-2xl text-center space-y-5 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-md">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              لوحة الإدارة الشاملة (Admin)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-medium">
              هذا القسم مخصص لإدارة المنصة والمحتوى. يمكنك الدخول الفوري بضغطة زر واحدة للمعاينة والتجربة على الهاتف.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <a
              href="/api/auth/quick-role?role=ADMIN&redirect=/admin"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>دخول فوري كـ مدير النظام (Admin)</span>
              <ArrowLeft className="w-4 h-4 text-zinc-950" />
            </a>

            <Link
              href="/login?callbackUrl=/admin"
              className="w-full h-11 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-zinc-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-white/10 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>تسجيل الدخول اليدوي ببيانات المدير</span>
            </Link>

            <Link
              href="/"
              className="w-full text-center text-xs text-slate-500 dark:text-zinc-400 hover:underline block pt-1"
            >
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const adminName = user.officialFullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'المدير';

  return (
    <div className="min-h-screen relative flex flex-col md:flex-row">
      {/* Dynamic Ambient Mesh in Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="dynamic-drift-1 absolute top-[5%] right-[15%] w-[550px] h-[550px] bg-blue-400/15 dark:bg-amber-500/10 rounded-full blur-[130px]" />
        <div className="dynamic-drift-2 absolute bottom-[10%] right-[40%] w-[500px] h-[500px] bg-indigo-500/15 dark:bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="dynamic-drift-3 absolute top-[35%] left-[5%] w-[450px] h-[450px] bg-fuchsia-400/10 dark:bg-pink-600/10 rounded-full blur-[120px]" />
        <div className="dynamic-drift-4 absolute bottom-[25%] left-[25%] w-[480px] h-[480px] bg-emerald-400/10 dark:bg-teal-600/10 rounded-full blur-[125px]" />
      </div>

      {/* Comprehensive Admin Sidebar with live search across every page in the platform */}
      <AdminSidebarClient
        platformName={platformName}
        adminName={adminName}
      />

      {/* Main Admin View Area */}
      <main className="flex-1 p-3 sm:p-6 md:p-8 max-w-7xl relative z-10 w-full min-w-0">
        {children}
      </main>
    </div>
  );
}