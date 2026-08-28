import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  LayoutDashboard,
  CreditCard,
  BookOpen,
  Tag,
  KeyRound,
  Award,
  HelpCircle,
  Settings,
  ShieldAlert,
  Mail,
  Users,
  LogOut,
  GraduationCap,
  MessageSquare,
  Sparkles,
  Star,
  User
} from 'lucide-react';

import ThemeToggle from '@/components/ThemeToggle';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login?error=unauthorized_admin');
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

  const navItems = [
    { name: 'نظرة عامة والتحليلات', href: '/admin', icon: LayoutDashboard },
    { name: 'المستخدمين والصلاحيات', href: '/admin/users', icon: Users },
    { name: 'المدفوعات والتحويلات', href: '/admin/payments', icon: CreditCard, highlight: true },
    { name: 'محرر الموقع السحري', href: '/admin/content-editor', icon: Sparkles, highlight: true },
    { name: 'إدارة الكورسات والمحتوى', href: '/admin/courses', icon: BookOpen },
    { name: 'التقييمات والمراجعات', href: '/admin/reviews', icon: Star },
    { name: 'كوبونات الخصم الذكية', href: '/admin/coupons', icon: Tag },
    { name: 'منح الوصول اليدوي', href: '/admin/manual-access', icon: KeyRound },
    { name: 'مصمم الشهادات الرقمية', href: '/admin/certificates/designer', icon: Award },
    { name: 'المحادثات المباشرة', href: '/chat', icon: MessageSquare },
    { name: 'تذاكر الدعم الفني', href: '/support', icon: HelpCircle },
    { name: 'إعدادات المنصة وطرق الدفع', href: '/admin/settings', icon: Settings },
    { name: 'سجلات التدقيق (Audit Logs)', href: '/admin/audit-logs', icon: ShieldAlert },
    { name: 'سجلات البريد (Email Logs)', href: '/admin/email-logs', icon: Mail },
  ];

  return (
    <div className="min-h-screen relative flex flex-col md:flex-row overflow-hidden">
      {/* Dynamic Multi-Color Moving Glow Orbs in Admin Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="dynamic-drift-1 absolute top-[5%] right-[15%] w-[550px] h-[550px] bg-blue-400/20 dark:bg-amber-500/10 rounded-full blur-[130px]" />
        <div className="dynamic-drift-2 absolute bottom-[10%] right-[40%] w-[500px] h-[500px] bg-indigo-500/20 dark:bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="dynamic-drift-3 absolute top-[35%] left-[5%] w-[450px] h-[450px] bg-fuchsia-400/15 dark:bg-pink-600/10 rounded-full blur-[120px]" />
        <div className="dynamic-drift-4 absolute bottom-[25%] left-[25%] w-[480px] h-[480px] bg-emerald-400/15 dark:bg-teal-600/10 rounded-full blur-[125px]" />
      </div>

      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white/80 dark:bg-surface border-l border-slate-200/90 dark:border-border flex flex-col justify-between shrink-0 p-4 backdrop-blur-2xl shadow-xl shadow-slate-900/5 z-20">
        <div className="space-y-6">
          <div className="px-2 py-3 border-b border-slate-200/80 dark:border-border">
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-primary-950 dark:text-primary-300 border border-blue-200 dark:border-primary-800">
              لوحة الإدارة الشاملة (Admin)
            </span>
            <h2 className="text-base font-black text-slate-900 dark:text-white mt-2 flex items-center gap-1.5">
              <span>{platformName}</span>
            </h2>
            <p className="text-[11.5px] text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">مرحباً، {user.firstName}</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 hover:text-blue-700 dark:hover:text-white hover:bg-blue-50/80 dark:hover:bg-surface-raised transition-all"
              >
                <item.icon className="w-4 h-4 text-blue-600 dark:text-primary-400 shrink-0" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-border space-y-2">
          <Link
            href="/"
            className="w-full block text-center py-2.5 rounded-xl bg-slate-100 dark:bg-surface-raised hover:bg-slate-200 dark:hover:bg-surface-card text-slate-800 dark:text-zinc-300 text-xs font-bold transition-all shadow-xs"
          >
            ← العودة للموقع العام
          </Link>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl relative z-10">
        {children}
      </main>
    </div>
  );
}