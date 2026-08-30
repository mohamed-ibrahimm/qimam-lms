'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  Sparkles,
  BookOpen,
  Star,
  Tag,
  Award,
  Settings,
  ShieldAlert,
  SlidersHorizontal,
  DollarSign,
  Type,
  X,
  Menu,
  ChevronLeft,
  Circle,
} from 'lucide-react';

interface Props {
  platformName: string;
  adminName: string;
}

interface NavSection {
  title: string;
  items: {
    name: string;
    href: string;
    icon: any;
    badge?: string;
    matchTab?: string;
  }[];
}

export default function AdminSidebarClient({ platformName, adminName }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Clean platform name by stripping 'أكاديمية' prefix
  const cleanDisplayName = useMemo(() => {
    return platformName.replace(/^أكاديمية\s*/i, '').trim() || platformName;
  }, [platformName]);

  const navSections: NavSection[] = useMemo(() => [
    {
      title: 'الرئيسية',
      items: [
        { name: 'نظرة عامة والتحليلات', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      title: 'الإعدادات والأسعار (VIP)',
      items: [
        { name: 'أسعار الباقات (SaaS)', href: '/admin/settings?tab=pricing', icon: DollarSign, badge: 'SaaS', matchTab: 'pricing' },
        { name: 'محرر نصوص المنصة (CMS)', href: '/admin/settings?tab=content', icon: Type, badge: 'CMS', matchTab: 'content' },
        { name: 'حسابات الدفع والمحافظ', href: '/admin/settings?tab=payments', icon: CreditCard, badge: 'دفع', matchTab: 'payments' },
      ],
    },
    {
      title: 'المحاضرون والطلاب',
      items: [
        { name: 'إدارة المحاضرين والباقات', href: '/admin/instructors', icon: GraduationCap, badge: 'SaaS' },
        { name: 'توثيق المحاضرين الطلبة', href: '/admin/student-verifications', icon: Award, badge: 'منحة' },
        { name: 'إدارة الطلاب والمستخدمين', href: '/admin/users', icon: Users },
      ],
    },
    {
      title: 'المحتوى والمالية',
      items: [
        { name: 'إدارة الكورسات والدروس', href: '/admin/courses', icon: BookOpen },
        { name: 'سجل المدفوعات والتحصيل', href: '/admin/payments', icon: CreditCard },
        { name: 'كوبونات الخصم والعروض', href: '/admin/coupons', icon: Tag },
        { name: 'مصمم الشهادات الرقمية', href: '/admin/certificates/designer', icon: Award },
        { name: 'تقييمات ومراجعات الطلاب', href: '/admin/reviews', icon: Star },
        { name: 'سجلات النظام والأمان', href: '/admin/audit-logs', icon: ShieldAlert },
      ],
    },
  ], []);

  const renderContent = (isDrawer = false) => (
    <div className="flex flex-col h-full bg-white/95 dark:bg-[#0c0818]/95 text-slate-900 dark:text-slate-100 rounded-3xl border border-slate-200/90 dark:border-amber-500/25 shadow-2xl backdrop-blur-2xl overflow-hidden pt-2">
      
      {/* Mobile Drawer Close Header Only */}
      {isDrawer && (
        <div className="p-3 border-b border-slate-200 dark:border-amber-500/20 flex items-center justify-between shrink-0 mb-1">
          <span className="text-xs font-black text-amber-500">لوحة الإدارة</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Categorized Navigation Links with Custom Amber Scroll */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto pb-24 scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-transparent">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              {section.title}
            </div>

            <div className="space-y-0.5">
              {section.items.map((item) => {
                let isActive = false;
                if (item.matchTab) {
                  isActive = pathname === '/admin/settings' && (currentTab === item.matchTab || (!currentTab && item.matchTab === 'pricing'));
                } else if (item.href === '/admin') {
                  isActive = pathname === '/admin';
                } else {
                  isActive = pathname.startsWith(item.href) && pathname !== '/admin/settings';
                }

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 via-purple-600/10 to-transparent border-r-3 border-amber-400 text-amber-700 dark:text-amber-300 font-black shadow-xs'
                        : 'text-slate-600 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/[0.05] font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-amber-500 dark:text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]' : 'text-slate-400 dark:text-zinc-400'
                      }`} />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0 mr-1 transition-colors ${
                        isActive
                          ? 'bg-amber-500 text-zinc-950 shadow-xs shadow-amber-500/30'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700'
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

      {/* Footer Identity Status */}
      <div className="p-3 border-t border-slate-200 dark:border-amber-500/20 shrink-0 bg-slate-50/90 dark:bg-black/60">
        <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-zinc-300 font-bold px-1">
          <span className="truncate max-w-[150px]">{adminName}</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1 shrink-0 text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            متصل
          </span>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Compact Sidebar */}
      <aside className="hidden md:block w-64 lg:w-72 shrink-0 sticky top-16 sm:top-20 h-[calc(100vh-5.5rem)] z-20">
        {renderContent(false)}
      </aside>

      {/* Mobile Sticky Top Header */}
      <div className="md:hidden flex items-center justify-between p-3 bg-white dark:bg-[#0c0918] border-b border-slate-200 dark:border-zinc-800 sticky top-16 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-white cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs font-black text-slate-900 dark:text-white">
            لوحة الإدارة • {platformName}
          </span>
        </div>

        <Link
          href="/admin/settings?tab=pricing"
          className="px-3 py-1.5 rounded-xl bg-amber-500 text-zinc-950 font-black text-xs flex items-center gap-1 shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>الإعدادات</span>
        </Link>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 p-3 animate-in slide-in-from-right duration-200">
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
