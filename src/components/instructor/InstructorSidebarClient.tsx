'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  Plus,
  CreditCard,
  Tag,
  Receipt,
  Sparkles,
  Search,
  ExternalLink,
  Layers,
  Compass,
  GraduationCap,
  MessageSquare,
  SlidersHorizontal,
  Star,
  User,
  X,
  FileText,
  DollarSign,
  ShoppingBag,
  Video,
  Radio,
} from 'lucide-react';

export type InstructorTabType = 'overview' | 'courses' | 'pricing' | 'payments' | 'orders' | 'coupons' | 'subscription' | 'books' | 'live';

interface Props {
  instructorName: string;
  instructorEmail: string;
  subscriptionPlan: string;
  coursesCount: number;
  pendingOrdersCount: number;
  couponsCount: number;
  activeTab: InstructorTabType;
  setActiveTab: (tab: InstructorTabType) => void;
  onNewCourseClick: () => void;
  publicProfileSlug?: string;
}

interface NavItem {
  id?: InstructorTabType;
  name: string;
  icon: any;
  href?: string;
  badge?: string;
  badgeType?: 'amber' | 'purple' | 'rose' | 'emerald';
  isExternal?: boolean;
  action?: () => void;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export default function InstructorSidebarClient({
  instructorName,
  instructorEmail,
  subscriptionPlan,
  coursesCount,
  pendingOrdersCount,
  couponsCount,
  activeTab,
  setActiveTab,
  onNewCourseClick,
  publicProfileSlug,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navGroups: NavGroup[] = useMemo(() => [
    {
      groupName: 'الرئيسية والتحليلات',
      items: [
        {
          id: 'overview',
          name: 'نظرة عامة والتحليلات',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      groupName: 'أستوديو البث المباشر (VIP Live Studio)',
      items: [
        {
          id: 'live',
          name: 'غرفة البث المباشر والشاشة',
          icon: Radio,
          badge: 'LIVE VIP',
          badgeType: 'rose',
        },
      ],
    },
    {
      groupName: 'الكورسات والدورات التدريبية',
      items: [
        {
          id: 'courses',
          name: 'دوراتي التدريبية',
          icon: BookOpen,
          badge: coursesCount > 0 ? String(coursesCount) : undefined,
          badgeType: 'amber',
        },
        {
          name: 'إضافة كورس جديد',
          icon: Plus,
          badge: 'جديد',
          badgeType: 'emerald',
          action: onNewCourseClick,
        },
        {
          name: 'دليل الدبلومات والمسارات',
          href: '/diplomas',
          icon: Layers,
          isExternal: true,
        },
        {
          name: 'كتالوج الكورسات العام',
          href: '/courses',
          icon: Compass,
          isExternal: true,
        },
      ],
    },
    {
      groupName: 'المكتبة والمذكرات الرقمية (DRM Shield)',
      items: [
        {
          name: 'مذكراتي وكتبي الرقمية',
          href: '/instructor/books',
          icon: FileText,
          badge: 'DRM',
          badgeType: 'purple',
        },
        {
          name: 'نشر مذكرة / كتاب جديد',
          href: '/instructor/books/new',
          icon: Plus,
          badge: 'أرباح 85%',
          badgeType: 'amber',
        },
        {
          name: 'تصفح المكتبة العامة',
          href: '/books',
          icon: BookOpen,
          isExternal: true,
        },
      ],
    },
    {
      groupName: 'التسعير والكوبونات والأرباح',
      items: [
        {
          id: 'pricing',
          name: 'تعديل أسعار الكورسات والكتب',
          icon: SlidersHorizontal,
          badge: 'سريع',
          badgeType: 'emerald',
        },
        {
          id: 'coupons',
          name: 'كوبونات وأكواد الخصم',
          icon: Tag,
          badge: couponsCount > 0 ? String(couponsCount) : undefined,
          badgeType: 'purple',
        },
        {
          id: 'orders',
          name: 'طلبات الطلاب والإيصالات',
          icon: Receipt,
          badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} معلق` : undefined,
          badgeType: pendingOrdersCount > 0 ? 'rose' : 'purple',
        },
        {
          id: 'payments',
          name: 'بيانات استلام أرباحي المباشرة',
          icon: CreditCard,
        },
      ],
    },
    {
      groupName: 'الاشتراك وإدارة الاستوديو',
      items: [
        {
          id: 'subscription',
          name: 'باقة اشتراك الاستوديو (SaaS)',
          icon: Sparkles,
          badge: subscriptionPlan === 'FREE_TRIAL' ? 'تجريبي' : subscriptionPlan || 'PRO',
          badgeType: 'amber',
        },
        {
          name: 'شروط وباقات المحاضرين',
          href: '/instructors/join',
          icon: Star,
          isExternal: true,
        },
        {
          name: 'تصفح صفحتي كمحاضر',
          href: publicProfileSlug ? `/instructors/${publicProfileSlug}` : '/courses',
          icon: User,
          isExternal: true,
        },
      ],
    },
  ], [coursesCount, pendingOrdersCount, couponsCount, onNewCourseClick, publicProfileSlug, subscriptionPlan]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return navGroups;
    const q = searchQuery.toLowerCase().trim();

    return navGroups.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          group.groupName.toLowerCase().includes(q)
      ),
    })).filter((group) => group.items.length > 0);
  }, [navGroups, searchQuery]);

  const renderContent = (isDrawer = false) => (
    <div className="flex flex-col h-full bg-white/95 dark:bg-[#0e0a1f]/95 text-slate-900 dark:text-zinc-100">
      
      {/* 1. Header & Instructor Profile Card */}
      <div className="p-5 border-b border-slate-200/80 dark:border-purple-900/40 space-y-4 shrink-0 bg-gradient-to-b from-slate-50/80 to-transparent dark:from-purple-950/20 dark:to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/40 shadow-xs">
            استوديو المحاضر المستقل 👑
          </span>
          {isDrawer && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Instructor Avatar & Name */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-purple-600 to-indigo-600 p-[2px] shadow-md shadow-purple-900/20 shrink-0">
            <div className="w-full h-full rounded-2xl bg-slate-900 dark:bg-zinc-950 flex items-center justify-center text-sm font-black text-amber-400">
              {instructorName[0] || 'م'}
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-black text-slate-950 dark:text-white truncate">
              {instructorName}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium truncate font-mono">
              {instructorEmail}
            </p>
          </div>
        </div>

        {/* Quick Launch Live Studio Action in Sidebar */}
        <Link
          href="/live/instant-room"
          onClick={() => isDrawer && setMobileOpen(false)}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-black text-xs shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>بدء بث مباشر فوري (Live HD)</span>
        </Link>

        {/* Quick Search Input */}
        <div className="relative pt-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث سريع في أقسام الاستوديو..."
            className="w-full pl-8 pr-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-zinc-900/90 border border-slate-200 dark:border-purple-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-1/2 translate-y-[2px] text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 translate-y-[2px] text-slate-400 dark:text-zinc-500 pointer-events-none" />
          )}
        </div>
      </div>

      {/* 2. Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {filteredGroups.map((group) => (
          <div key={group.groupName} className="space-y-1.5">
            <div className="px-3 py-1 text-[10.5px] font-black uppercase tracking-wider text-slate-500 dark:text-purple-300/80">
              {group.groupName}
            </div>

            <div className="space-y-1">
              {group.items.map((item, idx) => {
                const isActive = item.id && activeTab === item.id;
                const Icon = item.icon;

                const handleClick = () => {
                  if (item.action) {
                    item.action();
                    if (isDrawer) setMobileOpen(false);
                    return;
                  }
                  if (item.id) {
                    setActiveTab(item.id);
                    if (isDrawer) setMobileOpen(false);
                  }
                };

                const isLiveItem = item.id === 'live';

                if (item.href) {
                  return (
                    <Link
                      key={item.href || idx}
                      href={item.href}
                      onClick={() => isDrawer && setMobileOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] font-bold transition-all text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/5 group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="truncate">{item.name}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id || item.name || idx}
                    type="button"
                    onClick={handleClick}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] font-bold transition-all text-right cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-zinc-950 shadow-md shadow-amber-500/25 font-black scale-[1.02]'
                        : isLiveItem
                        ? 'bg-rose-500/10 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-500/30 hover:bg-rose-500/20'
                        : 'text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-zinc-950 text-amber-400'
                          : isLiveItem
                          ? 'bg-rose-500/20 text-rose-500 animate-pulse'
                          : 'bg-slate-200/80 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border shrink-0 mr-1.5 ${
                        isActive
                          ? 'bg-zinc-950 text-amber-400 border-zinc-900'
                          : isLiveItem
                          ? 'bg-rose-500 text-white border-rose-400 shadow-sm animate-pulse'
                          : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Support Quick Callout */}
      <div className="p-3 border-t border-slate-200/80 dark:border-purple-900/40 text-[11px] text-slate-500 dark:text-zinc-400 flex items-center justify-between shrink-0">
        <span className="font-bold">نظام استوديو المحاضر</span>
        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 font-mono">v2.0</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Controls Bar (Below Fixed Header) */}
      <div className="md:hidden relative z-20 flex items-center justify-between p-3.5 bg-white/95 dark:bg-[#120e24]/95 border-b border-slate-200 dark:border-purple-900/50 backdrop-blur-xl shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-black text-slate-900 dark:text-white truncate">استوديو: {instructorName}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30 shrink-0">
            {subscriptionPlan === 'FREE_TRIAL' ? 'تجريبي' : 'SaaS Pro'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="py-1.5 px-3 rounded-xl bg-amber-500 text-zinc-950 text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>أقسام الاستوديو</span>
        </button>
      </div>

      {/* Mobile Slide-in Drawer with Backdrop */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 w-80 max-w-[85vw] h-full bg-white dark:bg-[#120e24] shadow-2xl flex flex-col border-l border-slate-200 dark:border-purple-900/50 animate-in slide-in-from-right duration-200">
            {renderContent(true)}
          </aside>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-72 bg-white/95 dark:bg-[#120e24]/95 border-l border-slate-200/90 dark:border-purple-900/40 flex-col justify-between shrink-0 backdrop-blur-2xl shadow-xl shadow-slate-900/5 min-h-screen">
        {renderContent(false)}
      </aside>
    </>
  );
}
