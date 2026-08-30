'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Search,
  SlidersHorizontal,
  DollarSign,
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

  // Essential, Clean Admin Navigation Links (No Clutter, No Redundant Items)
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
    <div className="flex flex-col h-full bg-white dark:bg-[#0d091a] text-slate-900 dark:text-slate-100 rounded-2xl md:rounded-3xl border border-slate-200/90 dark:border-amber-500/25 shadow-xl">
      
      {/* Header Info */}
      <div className="p-4 border-b border-slate-200 dark:border-zinc-800 space-y-1 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20">
              👑
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 block leading-none">
                لوحة الإدارة
              </span>
              <h2 className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[140px] mt-0.5">
                {platformName}
              </h2>
            </div>
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
      </div>

      {/* Streamlined Links List (Fits in one screen with zero scrollbar on desktop) */}
      <div className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 shadow-md shadow-amber-500/25 font-black scale-[1.02]'
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
      <div className="p-3 border-t border-slate-200 dark:border-zinc-800 shrink-0 bg-slate-50/60 dark:bg-black/40 rounded-b-2xl md:rounded-b-3xl">
        <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-zinc-400 font-bold">
          <span>{adminName}</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1">
            ● متصل
          </span>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Compact Sidebar (Clean fit, No scrollbar) */}
      <aside className="hidden md:block w-64 lg:w-72 shrink-0 sticky top-24 h-[calc(100vh-7rem)] mr-3.5 sm:mr-6 z-20">
        {renderContent(false)}
      </aside>

      {/* Mobile Sticky Top Header */}
      <div className="md:hidden flex items-center justify-between p-3 bg-white dark:bg-[#0c0918] border-b border-slate-200 dark:border-zinc-800 sticky top-16 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-white"
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
          <Settings className="w-3.5 h-3.5" />
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
