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
  X
} from 'lucide-react';

export type InstructorTabType = 'overview' | 'courses' | 'payments' | 'orders' | 'coupons' | 'subscription';

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
      groupName: 'الكورسات والمحتوى التعليمي',
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
      groupName: 'المالية والتحويلات المباشرة',
      items: [
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
      groupName: 'التسويق والتفاعل مع الطلاب',
      items: [
        {
          id: 'coupons',
          name: 'كوبونات وأكواد الخصم',
          icon: Tag,
          badge: couponsCount > 0 ? String(couponsCount) : undefined,
          badgeType: 'purple',
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
          icon: GraduationCap,
          isExternal: true,
        },
      ],
    },
  ], [
    coursesCount,
    pendingOrdersCount,
    couponsCount,
    subscriptionPlan,
    onNewCourseClick,
    publicProfileSlug,
  ]);

  // Filtered by live search query
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
    <div className="flex flex-col h-full">
      {/* Header & Identity */}
      <div className="p-4 border-b border-slate-200/80 dark:border-purple-900/40 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
            استوديو المحاضر المستقل
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

        <div>
          <h2 className="text-sm font-black text-slate-900 dark:text-white truncate">
            {instructorName}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium truncate">
            {instructorEmail}
          </p>
        </div>

        {/* Quick Search in Studio */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في أي قسم بالاستوديو..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-zinc-900/90 border border-slate-200 dark:border-purple-900/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
          )}
        </div>
      </div>

      {/* Navigation Groups (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {filteredGroups.map((group) => (
          <div key={group.groupName} className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              {group.groupName}
            </div>

            <div className="space-y-0.5">
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

                const badgeBg = item.badgeType === 'rose'
                  ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                  : item.badgeType === 'emerald'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  : item.badgeType === 'amber'
                  ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                  : 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30';

                if (item.href) {
                  return (
                    <Link
                      key={item.href || idx}
                      href={item.href}
                      onClick={() => isDrawer && setMobileOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-400 dark:text-zinc-500 shrink-0 mr-1" />
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id || item.name || idx}
                    type="button"
                    onClick={handleClick}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-right cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-black'
                        : 'text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-zinc-950' : 'text-amber-600 dark:text-amber-400'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border shrink-0 mr-1 ${
                        isActive ? 'bg-zinc-950 text-amber-400 border-zinc-800' : badgeBg
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
