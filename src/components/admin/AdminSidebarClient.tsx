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
} from 'lucide-react';

interface Props {
  platformName: string;
  adminName: string;
}

export default function AdminSidebarClient({ platformName, adminName }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Essential Admin Links with crisp labels and clean icons
  const navItems = useMemo(() => [
    { name: 'لوحة التحكم والتحليلات', href: '/admin', icon: LayoutDashboard },
    { name: 'إعدادات المنصة والأسعار (VIP)', href: '/admin/settings', icon: SlidersHorizontal, badge: 'VIP' },
    { name: 'إدارة المحاضرين والباقات', href: '/admin/instructors', icon: GraduationCap, badge: 'SaaS' },
    { name: 'توثيق المحاضرين الطلبة', href: '/admin/student-verifications', icon: Award, badge: 'منحة' },
    { name: 'إدارة الكورسات والدروس', href: '/admin/courses', icon: BookOpen },
    { name: 'إدارة الطلاب والمستخدمين', href: '/admin/users', icon: Users },
    { name: 'المدفوعات والتحصيلات', href: '/admin/payments', icon: CreditCard },
    { name: 'كوبونات الخصم والعروض', href: '/admin/coupons', icon: Tag },
    { name: 'تقييمات ومراجعات الطلاب', href: '/admin/reviews', icon: Star },
    { name: 'سجلات النظام والأمان', href: '/admin/audit-logs', icon: ShieldAlert },
  ], []);

  const renderContent = (isDrawer = false) => (
    <div className="flex flex-col h-full bg-white/95 dark:bg-[#0c0918]/95 text-slate-900 dark:text-slate-100 border-l border-slate-200 dark:border-amber-500/25 backdrop-blur-2xl shadow-xl">
      
      {/* Header Info (Docked & Clean) */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-amber-500/20 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-black/30">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black text-slate-900 dark:text-white">
            أقسام الإدارة والتحكم
          </span>
        </div>

        {isDrawer && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Streamlined Links List (Spacious & Fits cleanly with zero scroll on desktop) */}
      <div className="flex-1 p-2.5 sm:p-3 space-y-1 overflow-y-auto pb-14">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 shadow-md shadow-amber-500/25 font-black scale-[1.01]'
                  : 'text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-zinc-950' : 'text-amber-600 dark:text-amber-400'}`} />
                <span className="truncate">{item.name}</span>
              </div>

              {item.badge && (
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0 mr-1 ${
                  isActive
                    ? 'bg-zinc-950 text-amber-400'
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Status */}
      <div className="p-3 border-t border-slate-200 dark:border-amber-500/20 shrink-0 bg-slate-50/80 dark:bg-black/50">
        <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-zinc-400 font-bold">
          <span className="truncate max-w-[150px]">{adminName}</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1 shrink-0">
            ● متصل
          </span>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Docked Right Sidebar (Solid Full-Height Dashboard Column) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 sticky top-16 sm:top-20 h-[calc(100vh-5rem)] z-20">
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
          href="/admin/settings"
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
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
