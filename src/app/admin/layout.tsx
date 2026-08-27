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
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-l border-border flex flex-col justify-between shrink-0 p-4">
        <div className="space-y-6">
          <div className="px-2 py-3 border-b border-border">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-950 text-primary-300 border border-primary-800">
              لوحة الإدارة الشاملة (Admin)
            </span>
            <h2 className="text-base font-black text-white mt-1.5 flex items-center gap-1.5">
              <span>{platformName}</span>
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">مرحباً، {user.firstName}</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-surface-raised transition-colors"
              >
                <item.icon className="w-4 h-4 text-primary-400 shrink-0" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-border space-y-2">
          <Link
            href="/"
            className="w-full block text-center py-2 rounded-xl bg-surface-raised hover:bg-surface-card text-zinc-300 text-xs font-semibold"
          >
            ← العودة للموقع العام
          </Link>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl">
        {/* Admin Top Utility Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold border border-zinc-700 transition-colors"
            >
              <span>← العودة للرئيسية</span>
            </Link>
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all shadow-sm"
              title="تعديل اسم المنصة واللوجو والبيانات"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>إعدادات المنصة واسم الأكاديمية</span>
            </Link>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 transition-colors"
              title="التحكم في المستخدمين والطلاب والصلاحيات"
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>إدارة المستخدمين والبيانات</span>
            </Link>
            <Link
              href="/admin/content-editor"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 text-xs font-bold border border-purple-800/60 transition-colors"
              title="محرر محتوى الموقع والبانر والنصوص"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>محرر الموقع والبانر</span>
            </Link>
            <Link
              href="/instructor"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold border border-zinc-700 transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
              <span>استوديو المعلم</span>
            </Link>
          </div>

          {/* User Profile & Theme Controls */}
          <div className="flex items-center justify-between lg:justify-end gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2 pr-2 border-r border-border">
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-bold transition-all shadow-sm"
                title="تعديل اسمك، اسم المستخدم، الصورة، كلمة المرور وبياناتك الشخصية"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>{user.officialFullName || user.username} ✏️ (تعديل بياناتي)</span>
              </Link>
              <a
                href="/api/auth/logout"
                className="px-2.5 py-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/40 text-rose-300 text-xs font-bold flex items-center gap-1 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </a>
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}