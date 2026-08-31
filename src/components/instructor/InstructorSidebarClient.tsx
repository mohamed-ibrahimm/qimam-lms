'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  SlidersHorizontal,
  User,
  X,
  FileText,
  Radio,
  LayoutGrid,
  ChevronLeft,
  Globe,
} from 'lucide-react';

export type InstructorTabType =
  | 'overview'
  | 'courses'
  | 'pricing'
  | 'payments'
  | 'orders'
  | 'coupons'
  | 'subscription'
  | 'books'
  | 'live';

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
  description: string;
  icon: any;
  href?: string;
  badge?: string;
  badgeColor?: string;
  accent: string;
  isExternal?: boolean;
  action?: () => void;
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
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 10 Rich Navigation Cards for Instructor matching Admin design
  const allNavItems: NavItem[] = useMemo(
    () => [
      {
        id: 'overview',
        name: 'نظرة عامة والتحليلات',
        description: 'متابعة إحصائيات الطلاب، المبيعات المباشرة، وحالة اشتراك الاستوديو',
        icon: LayoutDashboard,
        accent: 'from-blue-500 to-indigo-600',
      },
      {
        id: 'live',
        name: 'أستوديو البث المباشر (Google Meet VIP)',
        description: 'شرح حي تفاعلي، مشاركة الشاشة بدقة 1080p، كويزات Kahoot وفتح المايك',
        icon: Radio,
        badge: 'VIP LIVE',
        badgeColor: 'bg-rose-500 text-white shadow-rose-500/30 animate-pulse',
        accent: 'from-rose-500 via-rose-600 to-amber-500',
      },
      {
        id: 'courses',
        name: 'دوراتي وكورساتي التدريبية',
        description: 'إدارة المناهج، الدروس، الامتحانات، والفيديوهات التعليمية',
        icon: BookOpen,
        badge: coursesCount > 0 ? `${coursesCount} دورة` : undefined,
        badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        accent: 'from-amber-400 to-yellow-500',
      },
      {
        name: 'إضافة كورس تدريبي جديد',
        description: 'رفع دورة جديدة مع المناهج والمحاضرات وحماية DRM',
        icon: Plus,
        badge: 'جديد',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        accent: 'from-emerald-400 to-teal-500',
        action: onNewCourseClick,
      },
      {
        name: 'مذكراتي وكتبي الرقمية (DRM Shield)',
        description: 'نشر المذكرات والملخصات مع تشفير كامل ومنع الطباعة والتسريب',
        href: '/instructor/books',
        icon: FileText,
        badge: 'أرباح 85%',
        badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
        accent: 'from-purple-500 to-indigo-600',
      },
      {
        id: 'pricing',
        name: 'تعديل أسعار الكورسات والكتب',
        description: 'تغيير أسعار الدورات والكتب فورياً وتحديد عروض التخفيض',
        icon: SlidersHorizontal,
        badge: 'تعديل سريع',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        accent: 'from-emerald-500 to-green-600',
      },
      {
        id: 'orders',
        name: 'طلبات الطلاب وإيصالات التحويل',
        description: 'مراجعة إيصالات فودافون كاش وإنستاباي وتأكيد اشتراك الطلاب',
        icon: Receipt,
        badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} معلق` : undefined,
        badgeColor: pendingOrdersCount > 0 ? 'bg-rose-500 text-white animate-pulse' : 'bg-purple-500/20 text-purple-300',
        accent: 'from-rose-500 to-pink-600',
      },
      {
        id: 'payments',
        name: 'بيانات استلام أرباحي المباشرة',
        description: 'تحديد عنوان InstaPay ورقم فودافون كاش لتحويلات الطلاب 100%',
        icon: CreditCard,
        accent: 'from-cyan-500 to-blue-600',
      },
      {
        id: 'coupons',
        name: 'كوبونات وقسائم الخصم',
        description: 'إنشاء أكواد خصم بنسبة مئوية أو قيمة مالية لطلابك',
        icon: Tag,
        badge: couponsCount > 0 ? `${couponsCount} نشط` : undefined,
        badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
        accent: 'from-blue-500 to-indigo-600',
      },
      {
        id: 'subscription',
        name: 'باقة اشتراك الاستوديو (SaaS)',
        description: 'تجديد أو ترقية باقة الأكاديمية (شهري، سنوي، طالب، بث مباشر VIP)',
        icon: Sparkles,
        badge: subscriptionPlan === 'FREE_TRIAL' ? 'تجريبي' : subscriptionPlan || 'PRO',
        badgeColor: 'bg-amber-500 text-zinc-950 font-black',
        accent: 'from-amber-400 to-orange-500',
      },
      {
        name: 'تصفح صفحتي كمحاضر للطلاب',
        description: 'معاينة البروفايل العام والكورسات المنشورة كما يراها الطلاب',
        href: publicProfileSlug ? `/instructors/${publicProfileSlug}` : '/courses',
        icon: User,
        isExternal: true,
        accent: 'from-slate-500 to-zinc-600',
      },
    ],
    [coursesCount, pendingOrdersCount, couponsCount, onNewCourseClick, publicProfileSlug, subscriptionPlan]
  );

  // Keyboard Shortcut: Cmd+K or Ctrl+K or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return allNavItems;
    const q = searchQuery.toLowerCase().trim();
    return allNavItems.filter(
      (item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
    );
  }, [allNavItems, searchQuery]);

  // Current active item for Top Status Bar
  const currentItem = useMemo(() => {
    return allNavItems.find((item) => item.id === activeTab) || allNavItems[0];
  }, [allNavItems, activeTab]);

  return (
    <>
      {/* =========================================================================
          1. SLIM & ELEGANT TOP STATUS BAR (Matching Admin exactly, Zero Layout Shift)
         ========================================================================= */}
      <div className="w-full bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-amber-500/25 backdrop-blur-xl px-4 sm:px-6 py-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400/50" />
          <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
            {currentItem?.name || 'استوديو المحاضر'}
          </span>
          <span className="hidden md:inline-block text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
            • {instructorName}
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30">
            {subscriptionPlan === 'FREE_TRIAL' ? 'فترة تجريبية' : 'SaaS Pro'}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Direct Live Broadcast Button */}
          <Link
            href="/live/instant-room"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white text-xs font-black shadow-md shadow-rose-600/25 hover:scale-105 transition-all cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>أستوديو البث (Live)</span>
          </Link>

          {/* Quick Launcher Trigger Button (⌘K) */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setSearchQuery('');
            }}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-black transition-all border border-slate-200 dark:border-white/10 shadow-xs cursor-pointer active:scale-95 group"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-90 transition-transform duration-300" />
            <span>أقسام الاستوديو</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-black/10 dark:bg-black/40 text-[10px] font-mono text-slate-500 dark:text-zinc-400 border border-black/5 dark:border-white/10">
              ⌘K
            </kbd>
          </button>

          {/* Home Link */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-bold transition-all border border-amber-500/30 shrink-0"
            title="العودة للموقع العام"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">الموقع العام</span>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          2. FLOATING CIRCULAR COMMAND TRIGGER (Bottom-Left Floating Button)
         ========================================================================= */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setSearchQuery('');
        }}
        className="fixed bottom-6 left-6 z-[9999] group flex items-center gap-2 p-1.5 pr-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-zinc-950 shadow-[0_10px_35px_rgba(245,158,11,0.45)] hover:shadow-[0_15px_45px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ring-4 ring-amber-400/20"
        title="فتح أقسام الاستوديو (Ctrl+K)"
        aria-label="أقسام استوديو المحاضر"
      >
        <span className="text-xs font-black tracking-wide whitespace-nowrap hidden sm:inline-block">
          أقسام الاستوديو
        </span>
        <div className="w-9 h-9 rounded-full bg-zinc-950 text-amber-400 flex items-center justify-center shadow-md group-hover:rotate-180 transition-transform duration-500">
          <LayoutGrid className="w-4 h-4" />
        </div>
      </button>

      {/* =========================================================================
          3. LUXURY QUICK COMMAND PALETTE MODAL (Searchable, Fast & Beautiful)
         ========================================================================= */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-[#0e0a1f]/95 dark:bg-[#0c0918]/95 border-2 border-amber-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-3xl p-4 sm:p-6 space-y-4 animate-in zoom-in-95 duration-200 text-right">
            {/* Modal Header & Search */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white">
                      أقسام استوديو المحاضر السحابي 
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      انتقل لأي قسم بالاستوديو أو أطلق البث المباشر بضغطة زر
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Instant Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن قسم (مثل: البث المباشر، الكورسات، المذكرات، الأسعار، الأرباح)..."
                  className="w-full h-11 pr-10 pl-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
                <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Interactive Grid of Navigation Cards */}
            <div className="max-h-[60vh] overflow-y-auto pr-1 pl-1 space-y-2 scrollbar-thin">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredItems.map((item, idx) => {
                  const isActive = item.id && activeTab === item.id;
                  const Icon = item.icon;

                  const handleClick = () => {
                    if (item.action) {
                      item.action();
                      setIsOpen(false);
                      return;
                    }
                    if (item.id) {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }
                  };

                  if (item.href) {
                    return (
                      <Link
                        key={item.href || idx}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-start gap-3 p-3 rounded-2xl border transition-all duration-200 bg-white/[0.03] hover:bg-white/[0.08] text-white border-white/[0.06] hover:border-amber-500/40 hover:-translate-y-0.5 cursor-pointer"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm bg-gradient-to-tr ${item.accent} text-white`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-xs font-black truncate text-white group-hover:text-amber-300">
                              {item.name}
                            </span>
                            {item.badge && (
                              <span
                                className={`text-[9px] font-black px-1.5 py-0.2 rounded-full shrink-0 ${
                                  item.badgeColor || 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10.5px] leading-snug line-clamp-1 text-zinc-400 group-hover:text-zinc-300">
                            {item.description}
                          </p>
                        </div>

                        <ChevronLeft className="w-4 h-4 shrink-0 mt-2 transition-transform group-hover:-translate-x-1 text-zinc-500 group-hover:text-amber-400" />
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={item.id || item.name || idx}
                      type="button"
                      onClick={handleClick}
                      className={`w-full group flex items-start gap-3 p-3 rounded-2xl border text-right transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/25 font-black scale-[1.01]'
                          : 'bg-white/[0.03] hover:bg-white/[0.08] text-white border-white/[0.06] hover:border-amber-500/40 hover:-translate-y-0.5'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm ${
                          isActive
                            ? 'bg-zinc-950 text-amber-400'
                            : `bg-gradient-to-tr ${item.accent} text-white`
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span
                            className={`text-xs font-black truncate ${
                              isActive ? 'text-zinc-950' : 'text-white group-hover:text-amber-300'
                            }`}
                          >
                            {item.name}
                          </span>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-black px-1.5 py-0.2 rounded-full shrink-0 ${
                                isActive
                                  ? 'bg-zinc-950 text-amber-400'
                                  : item.badgeColor || 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-[10.5px] leading-snug line-clamp-1 ${
                            isActive
                              ? 'text-zinc-900 font-medium'
                              : 'text-zinc-400 group-hover:text-zinc-300'
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>

                      <ChevronLeft
                        className={`w-4 h-4 shrink-0 mt-2 transition-transform group-hover:-translate-x-1 ${
                          isActive ? 'text-zinc-950' : 'text-zinc-500 group-hover:text-amber-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {filteredItems.length === 0 && (
                <div className="p-8 text-center text-zinc-400 space-y-2">
                  <p className="text-xs">لم يتم العثور على قسم يطابق بحثك</p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-amber-400 font-black hover:underline cursor-pointer"
                  >
                    عرض كافة الأقسام
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-300 font-bold">المحاضر: {instructorName}</span>
              </div>
              <span className="hidden sm:inline text-zinc-500">
                اضغط <kbd className="px-1 py-0.5 rounded bg-white/10 text-[10px] text-zinc-300 font-mono">ESC</kbd> للإغلاق
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}