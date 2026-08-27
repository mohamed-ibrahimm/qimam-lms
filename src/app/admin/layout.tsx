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
  MessageSquare
} from 'lucide-react';

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
    { name: 'المدفوعات والتحويلات', href: '/admin/payments', icon: CreditCard, highlight: true },
    { name: 'إدارة الكورسات والمحتوى', href: '/admin/courses', icon: BookOpen },
    { name: 'كوبونات الخصم', href: '/admin/coupons', icon: Tag },
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
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}