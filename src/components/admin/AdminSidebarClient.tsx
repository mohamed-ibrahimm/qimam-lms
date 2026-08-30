'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  BookOpen,
  Star,
  Tag,
  Award,
  ShieldAlert,
  SlidersHorizontal,
  X,
  Menu,
  Sparkles,
  Zap,
} from 'lucide-react';

interface Props {
  platformName: string;
  adminName: string;
}

interface NavSection {
  title?: string;
  items: {
    name: string;
    href: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
  }[];
}

export default function AdminSidebarClient({ platformName, adminName }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Categorized & Refined Navigation Sections
  const navSections: NavSection[] = useMemo(() => [
    {
      title: 'الرئيسية',
      items: [
        { name: 'لوحة التحكم والتحليلات', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      title: 'الإعدادات والـ SaaS',
      items: [
        { name: 'إعدادات المنصة والأسعار', href: '/admin/settings', icon: SlidersHorizontal, badge: 'VIP', badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 shadow-amber-500/20' },
        { name: 'إدارة المحاضرين والباقات', href: '/admin/instructors', icon: GraduationCap, badge: 'SaaS', badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
        { name: 'توثيق المحاضرين الطلبة', href: '/admin/student-verifications', icon: Award, badge: 'منحة', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
      ],
    },
    {
      title: 'المحتوى والطلاب',
      items: [
        { name: 'إدارة الكورسات والدروس', href: '/admin/courses', icon: BookOpen },
        { name: 'إدارة الطلاب والمستخدمين', href: '/admin/users', icon: Users },
        { name: 'المدفوعات والتحصيلات', href: '/admin/payments', icon: CreditCard },
        { name: 'كوبونات الخصم والعروض', href: '/admin/coupons', icon: Tag },
      ],
    },
    {
      title: 'الجودة والأمان',
      items: [
        { name: 'تقييمات ومراجعات الطلاب', href: '/admin/reviews', icon: Star },
        { name: 'سجلات النظام والأمان', href: '/admin/audit-logs', icon: ShieldAlert },
      ],
    },
  ], []);

  const renderContent = (isDrawer = false) => (
    <div className="flex flex-col h-full bg-[#0d091a]/95 dark:bg-[#0c0918]/95 text-white border-l border-white/[0.08] dark:border-amber-500/20 backdrop-blur-3xl shadow-2xl">
      
      {/* Mobile Drawer Top Bar (Minimal Close Button) */}
      {isDrawer && (
        <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-white/[0.02]">
          <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            لوحة الإدارة الشاملة
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-xl bg-white/10 text-zinc-300 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Nav List with Sections */}
      <div className="flex-1 p-3 space-y-4 overflow-y-auto pb-24 scrollbar-none">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            {section.title && (
              <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                {section.title}
              </div>
            )}
            
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20 font-black scale-[1.01]'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.07] border border-transparent hover:border-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0 ${
                        isActive
                          ? 'bg-zinc-950/20 text-zinc-950'
                          : 'bg-white/[0.05] border border-white/[0.08] text-amber-400'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 mr-1 shadow-xs ${
                        isActive
                          ? 'bg-zinc-950 text-amber-400'
                          : item.badgeColor || 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer: User Identity Profile Bar */}
      <div className="p-3 border-t border-white/[0.08] shrink-0 bg-black/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-[1px] shrink-0">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-[10px] font-black text-amber-400">
                {adminName?.[0] || 'م'}
              </div>
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">{adminName}</span>
              <span className="text-[9.5px] text-emerald-400 font-bold flex items-center gap-1 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                نشط كمسؤول
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors shrink-0"
          >
            الموقع
          </Link>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Docked Right Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 sticky top-16 sm:top-20 h-[calc(100vh-5rem)] z-20">
        {renderContent(false)}
      </aside>

      {/* Mobile Sticky Top Trigger Bar */}
      <div className="md:hidden flex items-center justify-between p-3 bg-[#0d091a]/95 border-b border-white/[0.08] sticky top-16 z-30 shadow-md backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="py-1.5 px-3 rounded-xl bg-amber-500 text-zinc-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>أقسام الإدارة</span>
        </button>

        <span className="text-xs font-black text-white">
          لوحة الإدارة
        </span>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex justify-end animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
