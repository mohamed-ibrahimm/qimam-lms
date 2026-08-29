'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  GraduationCap,
  BookOpen,
  Award,
  ShieldCheck,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Compass,
  MessageSquare,
  HelpCircle,
  Sparkles,
  ChevronDown,
  LogIn,
  UserPlus,
  Sun,
  Moon,
  Headphones,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface HeaderProps {
  initialPlatformName?: string;
  initialPlatformTagline?: string;
  initialUser?: any;
}

export default function Header({
  initialPlatformName = 'أكاديمية م / محمد إبراهيم',
  initialPlatformTagline = 'بوابتك الاحترافية لاحتراف البرمجة والذكاء الاصطناعي والتصميم',
  initialUser = null,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(initialUser);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const cleanInitialName = (initialPlatformName || 'أكاديمية م / محمد إبراهيم').replace(/سنجر/g, '').trim();
  const [platformName, setPlatformName] = useState(cleanInitialName || 'أكاديمية م / محمد إبراهيم');
  const [platformTagline, setPlatformTagline] = useState(initialPlatformTagline || 'بوابتك الاحترافية لاحتراف البرمجة والذكاء الاصطناعي والتصميم');

  // Sync if prop updates from server
  useEffect(() => {
    if (initialUser !== undefined) {
      if (initialUser?.officialFullName) {
        initialUser.officialFullName = initialUser.officialFullName.replace(/سنجر/g, '').trim();
      }
      setCurrentUser(initialUser);
    }
  }, [initialUser]);

  useEffect(() => {
    if (initialPlatformName && !initialPlatformName.includes('?')) {
      setPlatformName(initialPlatformName.replace(/سنجر/g, '').trim());
    }
    if (initialPlatformTagline && !initialPlatformTagline.includes('?')) {
      setPlatformTagline(initialPlatformTagline);
    }
  }, [initialPlatformName, initialPlatformTagline]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.platformName && !data.platformName.includes('?')) {
          setPlatformName(data.platformName.replace(/سنجر/g, '').trim());
        }
        if (data.platformTagline && !data.platformTagline.includes('?')) setPlatformTagline(data.platformTagline);
      }
    } catch (e) {}
  };

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          if (data.user.officialFullName) {
            data.user.officialFullName = data.user.officialFullName.replace(/سنجر/g, '').trim();
          }
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user and settings once on mount
  useEffect(() => {
    setMounted(true);
    fetchUser();
    fetchSettings();

    const handleSettingsUpdated = (e: any) => {
      const name = e.detail?.PLATFORM_NAME || e.detail?.settings?.PLATFORM_NAME;
      const tagline = e.detail?.PLATFORM_TAGLINE || e.detail?.settings?.PLATFORM_TAGLINE;
      if (name && !name.includes('?')) setPlatformName(name.replace(/سنجر/g, '').trim());
      if (tagline && !tagline.includes('?')) setPlatformTagline(tagline);
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'platform_name' && e.newValue && !e.newValue.includes('?')) {
        setPlatformName(e.newValue.replace(/سنجر/g, '').trim());
      }
    };

    window.addEventListener('platform-settings-updated', handleSettingsUpdated);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('platform-settings-updated', handleSettingsUpdated);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Instant auto-close menus on navigation (0ms lag)
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    setDropdownOpen(false);
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { name: 'الرئيسية', href: '/', icon: Home },
    { name: 'المسارات التدريبية', href: '/courses', icon: BookOpen },
    { name: 'الدبلومات الشاملة', href: '/diplomas', icon: Award, isDiploma: true },
    { name: 'التحقق من الشهادات', href: '/verify', icon: ShieldCheck },
    { name: 'الدعم الفني', href: '/support', icon: Headphones },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-1.5 sm:p-3 md:p-4 transition-all">
      <nav className="dynamic-navbar-aura max-w-[1440px] w-full sm:w-[96%] mx-auto flex items-center justify-between min-h-[3.5rem] sm:min-h-[4.5rem] px-2.5 sm:px-6 md:px-8 rounded-full bg-white/95 dark:bg-zinc-900/95 border border-slate-200/90 dark:border-zinc-800/90 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-black/70 relative gap-1.5 sm:gap-6">
        
        {/* Logo & Platform Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 shrink min-w-0 group py-1">
          <div className="dynamic-logo-emblem w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl p-[2px] shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full bg-[#0c0918] dark:bg-[#0c0918] rounded-[10px] sm:rounded-[14px] flex items-center justify-center border border-amber-500/40">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
          </div>
          <div className="flex flex-col text-right justify-center min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-amber-500 dark:text-amber-400 flex items-center gap-1 leading-none mb-0.5 whitespace-nowrap">
              ★ منصة تعليمية معتمدة
            </span>
            <span className="text-sm xs:text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white dark:bg-gradient-to-r dark:from-white dark:via-amber-100 dark:to-amber-300 dark:bg-clip-text dark:text-transparent group-hover:text-blue-600 dark:group-hover:text-amber-300 transition-colors tracking-tight whitespace-nowrap leading-tight drop-shadow-xs">
              {platformName}
            </span>
            <span className="text-[8.5px] xs:text-[9.5px] sm:text-[10.5px] text-slate-500 dark:text-amber-200/80 font-medium whitespace-nowrap leading-none mt-0.5 block">
              {platformTagline}
            </span>
          </div>
        </Link>

        {/* Desktop Nav (Center) */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100/90 dark:bg-zinc-950/60 px-2.5 py-1.5 rounded-full border border-slate-200/90 dark:border-zinc-800/80 shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const isDiploma = (link as any).isDiploma;
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isDiploma
                    ? 'diploma-luxury-pill'
                    : isActive
                    ? 'bg-white dark:bg-zinc-800 text-blue-700 dark:text-white border border-slate-200 dark:border-zinc-700 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-white hover:bg-white/80 dark:hover:bg-zinc-800/70'
                }`}
              >
                {link.icon && (
                  <link.icon
                    className={`w-3.5 h-3.5 ${
                      isDiploma
                        ? 'text-amber-400'
                        : isActive
                        ? 'text-blue-600 dark:text-amber-400'
                        : 'text-slate-500 dark:text-zinc-400'
                    }`}
                  />
                )}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Action Buttons: Desktop + Mobile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* User Dropdown - ONLY ON DESKTOP (hidden on mobile, managed in mobile menu drawer) */}
          {currentUser ? (
            <div className="relative hidden lg:block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-zinc-800/80 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700/80 transition-all text-right shadow-xs"
                title={currentUser.officialFullName || 'حسابك الشخصي'}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-amber-500 dark:to-yellow-400 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs shadow-inner overflow-hidden relative shrink-0">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.officialFullName || 'User Avatar'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>{currentUser.firstName?.[0] || 'ق'}</span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-white max-w-[120px] truncate">
                  {currentUser.firstName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400 mr-0.5" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
                    <p className="text-xs text-slate-400 dark:text-zinc-400">مرحباً بك،</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentUser.officialFullName || currentUser.email}</p>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-500 truncate">{currentUser.email}</p>
                  </div>

                  {currentUser.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-blue-600 dark:text-amber-300 hover:bg-blue-50 dark:hover:bg-amber-950/40 hover:text-blue-800 dark:hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-amber-400" />
                      لوحة تحكم الإدارة (Admin)
                    </Link>
                  )}

                  {(currentUser.role === 'INSTRUCTOR' || currentUser.role === 'ADMIN') && (
                    <Link
                      href="/instructor"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
                      استوديو المعلم (Instructor)
                    </Link>
                  )}

                  <Link
                    href="/dashboard/my-courses"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-blue-700 dark:text-amber-300 hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors font-bold"
                  >
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-amber-400" />
                    الكورسات المشترك فيها
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400 dark:text-zinc-400" />
                    لوحة المتابعة الأكاديمية
                  </Link>

                  <Link
                    href="/chat"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    المحادثات المباشرة
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-indigo-600 dark:text-amber-400" />
                    الملف الشخصي والشهادات
                  </Link>

                  <div className="border-t border-slate-100 dark:border-zinc-800 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Auth Buttons - ONLY ON DESKTOP (hidden on mobile, managed in mobile menu drawer) */
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 dark:text-zinc-200 dark:hover:text-white dark:bg-transparent dark:hover:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 transition-all shadow-xs flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-600 dark:text-amber-400" />
                <span>دخول</span>
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all shadow-md shadow-blue-600/20 whitespace-nowrap flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5 text-white" />
                <span>انضم الآن</span>
              </Link>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleTheme();
            }}
            className="p-2 sm:p-2.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all flex items-center justify-center shrink-0 shadow-xs cursor-pointer"
            title={theme === 'DARK' ? 'التحويل إلى الوضع النهاري' : 'التحويل إلى الوضع الليلي'}
            aria-label="تبديل المظهر"
          >
            {theme === 'DARK' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 sm:p-2.5 rounded-full border transition-all flex items-center justify-center shrink-0 ${
              mobileMenuOpen
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                : 'bg-white/90 dark:bg-zinc-800/90 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700/80 hover:bg-slate-100 dark:hover:bg-zinc-700 shadow-xs'
            }`}
            aria-label="فتح القائمة"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </nav>

      {/* =========================================================================
          Ultra-Luxurious Full Mobile Drawer Sheet
         ========================================================================= */}
      {mounted && mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="mobile-drawer-sheet lg:hidden fixed inset-0 z-[99999] w-screen h-[100dvh] flex flex-col bg-slate-50/98 dark:bg-zinc-950/98 backdrop-blur-2xl p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="max-w-md w-full mx-auto space-y-4 pt-2 pb-10">
            
            {/* Drawer Top Header */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-purple-600 dark:via-fuchsia-600 dark:to-amber-400 p-[2px] shrink-0">
                  <div className="w-full h-full bg-white dark:bg-[#0c0918] rounded-[9px] flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-blue-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{platformName}</h4>
                  <span className="text-[10px] text-blue-600 dark:text-amber-300 font-medium">★ منصة هندسية معتمدة</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleTheme();
                  }}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800/90 text-slate-700 dark:text-amber-400 flex items-center justify-center border border-slate-200 dark:border-zinc-700 cursor-pointer"
                  title="تبديل المظهر"
                >
                  {theme === 'DARK' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-blue-600" />}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800/90 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors border border-slate-200 dark:border-zinc-700"
                  aria-label="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Auth Section at the TOP of the Drawer */}
            {currentUser ? (
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3.5 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-amber-500 dark:to-yellow-400 p-[2px] shadow-lg shrink-0">
                    <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 overflow-hidden flex items-center justify-center">
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-blue-600 dark:text-amber-400">{currentUser.firstName?.[0] || 'ق'}</span>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 text-right">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentUser.officialFullName || currentUser.firstName}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 font-semibold shrink-0">
                        {currentUser.role === 'ADMIN' ? 'المدير' : currentUser.role === 'INSTRUCTOR' ? 'محاضر' : 'طالب'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-500 truncate">{currentUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {currentUser.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="col-span-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-500 dark:to-yellow-500 text-white dark:text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>لوحة تحكم الإدارة (Admin Panel)</span>
                    </Link>
                  )}
                  {currentUser.role === 'INSTRUCTOR' && (
                    <Link
                      href="/instructor"
                      onClick={() => setMobileMenuOpen(false)}
                      className="col-span-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>استوديو المعلم (Instructor Studio)</span>
                    </Link>
                  )}
                  <Link
                    href="/dashboard/my-courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="col-span-2 py-3 px-4 rounded-xl bg-blue-50 dark:bg-amber-500/15 text-blue-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 border border-blue-200 dark:border-amber-500/30 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-amber-400" />
                    <span>الكورسات المشترك فيها 🎓</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800/90 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-zinc-700/80"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400" />
                    <span>لوحة المتابعة</span>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800/90 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-zinc-700/80"
                  >
                    <User className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                    <span>الملف الشخصي</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3 shadow-md">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">تسجيل الدخول والانضمام:</p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">سجل الآن وتابع كورساتك واحصل على شهاداتك المعتمدة</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-white font-bold text-xs text-center border border-slate-200 dark:border-zinc-700 flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <LogIn className="w-4 h-4 text-slate-600 dark:text-zinc-300" />
                    <span>تسجيل الدخول</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-purple-600 dark:via-indigo-600 dark:to-purple-500 text-white font-bold text-xs text-center shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>إنشاء حساب جديد</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation Links with Icons & Highlighting */}
            <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1.5 shadow-md">
              <p className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 px-3 py-1 text-right">أقسام المنصة:</p>
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                const isDiploma = (link as any).isDiploma;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={true}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 dark:bg-zinc-800 text-blue-700 dark:text-white border border-blue-200 dark:border-zinc-700'
                        : isDiploma
                        ? 'bg-purple-50/70 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30'
                        : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {link.icon && (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isDiploma
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}>
                          <link.icon className="w-4 h-4" />
                        </div>
                      )}
                      <span>{link.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Logout button if logged in */}
            {currentUser && (
              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 rounded-xl bg-rose-950/30 border border-rose-900/50 text-rose-300 hover:bg-rose-900/40 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج من الحساب</span>
              </button>
            )}

          </div>
        </div>,
        document.body
      )}
    </header>
  );
}