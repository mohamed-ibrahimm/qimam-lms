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
  KeyRound,
  Award,
  MessageSquare,
  HelpCircle,
  Settings,
  ShieldAlert,
  Mail,
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Layers,
  Compass,
  DollarSign,
  ShieldCheck,
  Home,
  UserCheck,
  User,
  ShoppingBag,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface Props {
  platformName: string;
  adminName: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  isExternal?: boolean;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export default function AdminSidebarClient({ platformName, adminName }: Props) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navGroups: NavGroup[] = useMemo(() => [
    {
      groupName: 'الرئيسية والتحليلات',
      items: [
        { name: 'نظرة عامة والتحليلات', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      groupName: 'المناهج والدورات',
      items: [
        { name: 'إدارة الكورسات والدروس', href: '/admin/courses', icon: BookOpen },
        { name: 'دليل الدبلومات والمسارات', href: '/diplomas', icon: Layers, isExternal: true },
        { name: 'كتالوج الكورسات العام', href: '/courses', icon: Compass, isExternal: true },
      ],
    },
    {
      groupName: 'المحاضرون والاشتراكات',
      items: [
        { name: 'المحاضرون واشتراكات SaaS', href: '/admin/instructors', icon: GraduationCap, badge: 'SaaS' },
        { name: 'صفحة انضم كمحاضر والباقات', href: '/instructors/join', icon: Star, isExternal: true },
        { name: 'استوديو تدريس المحاضر', href: '/instructor', icon: SlidersHorizontal, isExternal: true },
      ],
    },
    {
      groupName: 'الطلاب والمستخدمون',
      items: [
        { name: 'إدارة الطلاب والمستخدمين', href: '/admin/users', icon: Users },
        { name: 'منح الوصول اليدوي والتسجيل', href: '/admin/manual-access', icon: KeyRound },
        { name: 'لوحة تحكم الطالب', href: '/dashboard', icon: UserCheck, isExternal: true },
        { name: 'كورسات الطالب المسجلة', href: '/dashboard/my-courses', icon: BookOpen, isExternal: true },
      ],
    },
    {
      groupName: 'المالية والمدفوعات',
      items: [
        { name: 'المدفوعات والتحويلات البنكية', href: '/admin/payments', icon: CreditCard, badge: 'جديد' },
        { name: 'كوبونات الخصم والعروض', href: '/admin/coupons', icon: Tag },
        { name: 'صفحة إتمام الدفع (Checkout)', href: '/checkout', icon: ShoppingBag, isExternal: true },
      ],
    },
    {
      groupName: 'الشهادات والتحقق',
      items: [
        { name: 'مصمم الشهادات الرقمية', href: '/admin/certificates/designer', icon: Award },
        { name: 'بوابة فحص وتوثيق الشهادات', href: '/verify', icon: ShieldCheck, isExternal: true },
      ],
    },
    {
      groupName: 'الدعم والمجتمع',
      items: [
        { name: 'تقييمات ومراجعات الطلاب', href: '/admin/reviews', icon: Star },
        { name: 'تذاكر الدعم الفني والشكاوى', href: '/support', icon: HelpCircle },
        { name: 'المحادثات المباشرة والشات', href: '/chat', icon: MessageSquare },
      ],
    },
    {
      groupName: 'التخصيص ومظهر المنصة',
      items: [
        { name: 'محرر الموقع والبنرات السحري', href: '/admin/content-editor', icon: Sparkles, badge: 'محرر' },
        { name: 'إعدادات المنصة وطرق الدفع والـ SEO', href: '/admin/settings', icon: Settings },
        { name: 'الملف الشخصي والحساب', href: '/profile', icon: User, isExternal: true },
        { name: 'الصفحة الرئيسية للموقع', href: '/', icon: Home, isExternal: true },
      ],
    },
    {
      groupName: 'السجلات والأمان',
      items: [
        { name: 'سجلات التدقيق (Audit Logs)', href: '/admin/audit-logs', icon: ShieldAlert },
        { name: 'سجلات البريد (Email Logs)', href: '/admin/email-logs', icon: Mail },
      ],
    },
  ], []);

  // Filtered by search query
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

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="md:hidden flex items-center justify-between p-3.5 bg-white/95 dark:bg-[#120e24]/95 border-b border-slate-200 dark:border-purple-900/40 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-900 dark:text-white">{platformName}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-purple-950/60 text-blue-700 dark:text-purple-300 font-bold border border-blue-200 dark:border-purple-800/60">
            لوحة الإدارة
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
          <span>قائمة الأقسام</span>
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`${
          mobileOpen ? 'fixed inset-0 z-40 bg-black/60 md:static md:bg-transparent' : 'hidden md:flex'
        } w-full md:w-72 bg-white/95 dark:bg-[#120e24]/95 border-l border-slate-200/90 dark:border-purple-900/40 flex-col justify-between shrink-0 backdrop-blur-2xl shadow-xl shadow-slate-900/5 transition-all`}
      >
        <div className="flex flex-col h-full max-h-screen">
          
          {/* Header & Identity */}
          <div className="p-4 border-b border-slate-200/80 dark:border-purple-900/40 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                لوحة الإدارة الشاملة
              </span>
              {mobileOpen && (
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="md:hidden p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white truncate">
                {platformName}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                المسؤول: {adminName}
              </p>
            </div>

            {/* Quick Search across EVERY page on the platform */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في أي قسم بالمنصة..."
                className="w-full h-9 pr-8 pl-7 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs focus:outline-none focus:border-amber-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Items (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar">
            {filteredGroups.map((group) => (
              <div key={group.groupName} className="space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                  {group.groupName}
                </div>

                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-black'
                            : 'text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-zinc-950' : 'text-amber-600 dark:text-amber-400'}`} />
                          <span className="truncate">{item.name}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 mr-1">
                          {item.badge && (
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                              isActive
                                ? 'bg-zinc-950 text-amber-400'
                                : 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                          {item.isExternal && (
                            <ExternalLink className={`w-3 h-3 ${isActive ? 'text-zinc-950' : 'text-slate-400 dark:text-zinc-500'}`} />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredGroups.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-500 dark:text-zinc-400 space-y-1">
                <p>لا يوجد قسم يطابق بحثك</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  مسح البحث
                </button>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="p-3 border-t border-slate-200/80 dark:border-purple-900/40 space-y-2 shrink-0 bg-slate-50/50 dark:bg-black/20">
            <Link
              href="/"
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-zinc-300 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-amber-500" />
              <span>العودة للموقع العام</span>
            </Link>
          </div>

        </div>
      </aside>
    </>
  );
}
