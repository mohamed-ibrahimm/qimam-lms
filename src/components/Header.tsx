'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
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
  Moon
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const [platformName, setPlatformName] = useState('أكاديمية المهندس محمد إبراهيم');
  const [platformTagline, setPlatformTagline] = useState('بوابتك الاحترافية لاحتراف البرمجة والذكاء الاصطناعي والتصميم');

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.platformName) setPlatformName(data.platformName);
        if (data.platformTagline) setPlatformTagline(data.platformTagline);
      }
    } catch (e) {}
  };

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchUser();
    fetchSettings();

    const handleSettingsUpdated = (e: any) => {
      if (e.detail?.PLATFORM_NAME) setPlatformName(e.detail.PLATFORM_NAME);
      if (e.detail?.PLATFORM_TAGLINE) setPlatformTagline(e.detail.PLATFORM_TAGLINE);
    };

    window.addEventListener('platform-settings-updated', handleSettingsUpdated);
    return () => window.removeEventListener('platform-settings-updated', handleSettingsUpdated);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    setDropdownOpen(false);
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'الكورسات', href: '/courses', icon: BookOpen },
    { name: 'الدبلومات الشاملة', href: '/diplomas', icon: Award, highlight: true },
    { name: 'التحقق من الشهادات', href: '/verify', icon: ShieldCheck },
    { name: 'الدعم الفني', href: '/support', icon: HelpCircle },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-2.5 sm:p-4 md:p-5 transition-all">
      <nav className="max-w-7xl mx-auto flex items-center justify-between min-h-[3.75rem] sm:min-h-[4.25rem] px-3.5 sm:px-8 rounded-full bg-zinc-900/90 border border-zinc-800/90 backdrop-blur-2xl shadow-2xl shadow-black/70 relative gap-2 sm:gap-4">
        {/* Logo & Platform Name */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group py-1">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-[2px] shadow-md shadow-amber-950/40 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full bg-[#0c0918] rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <span className="text-xs sm:text-sm md:text-[15px] font-black text-white group-hover:text-amber-300 transition-colors tracking-tight whitespace-nowrap">
            {platformName}
          </span>
        </Link>

        {/* Desktop Nav (Center) */}
        <div className="hidden lg:flex items-center gap-1 bg-zinc-950/60 px-2 py-1 rounded-full border border-zinc-800/80 shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                    : link.highlight
                    ? 'text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 shadow-sm shadow-amber-950/30'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/70'
                }`}
              >
                {link.icon && <link.icon className={`w-3.5 h-3.5 ${link.highlight ? 'text-amber-400' : ''}`} />}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Action Buttons: Desktop + Mobile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {currentUser ? (
            /* User Dropdown */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-600 transition-all text-right shadow-sm"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-zinc-950 flex items-center justify-center font-bold text-xs shadow-inner overflow-hidden relative shrink-0">
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
                <span className="text-xs font-bold text-white max-w-[80px] sm:max-w-[120px] truncate hidden xs:inline">
                  {currentUser.firstName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 mr-0.5" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-zinc-800">
                    <p className="text-xs text-zinc-400">مرحباً بك،</p>
                    <p className="text-sm font-bold text-white truncate">{currentUser.officialFullName || currentUser.email}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{currentUser.email}</p>
                  </div>

                  {currentUser.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-amber-300 hover:bg-amber-950/40 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-400" />
                      لوحة تحكم الإدارة (Admin)
                    </Link>
                  )}

                  {(currentUser.role === 'INSTRUCTOR' || currentUser.role === 'ADMIN') && (
                    <Link
                      href="/instructor"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      <GraduationCap className="w-4 h-4 text-purple-400" />
                      استوديو المعلم (Instructor)
                    </Link>
                  )}

                  <Link
                    href="/dashboard/my-courses"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-amber-300 hover:bg-zinc-800 hover:text-white transition-colors font-bold"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    الكورسات المشترك فيها
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                    لوحة المتابعة الأكاديمية
                  </Link>

                  <Link
                    href="/chat"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    المحادثات المباشرة
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-amber-400" />
                    الملف الشخصي والشهادات
                  </Link>

                  <div className="border-t border-zinc-800 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Auth Buttons (Always visible) */
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/login"
                className="px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-800/80 border border-zinc-700/80 transition-all shadow-sm flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>دخول</span>
              </Link>
              <Link
                href="/register"
                className="px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 transition-all shadow-md shadow-amber-950/40 whitespace-nowrap flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5 text-zinc-950" />
                <span>انضم الآن</span>
              </Link>
            </div>
          )}

          {/* Theme Toggle Button (Light/Dark Mode) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full border border-zinc-800 bg-zinc-900/90 text-amber-400 hover:text-amber-300 hover:bg-zinc-800 transition-all flex items-center justify-center shrink-0 shadow-sm"
            title={theme === 'DARK' ? 'التحويل إلى الوضع النهاري' : 'التحويل إلى الوضع الليلي'}
            aria-label="تبديل المظهر"
          >
            {theme === 'DARK' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-purple-400" />}
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 sm:p-2.5 rounded-full border transition-all flex items-center justify-center shrink-0 ${
              mobileMenuOpen
                ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-950/50'
                : 'bg-zinc-800/90 text-zinc-200 hover:text-white border-zinc-700/80 hover:bg-zinc-700'
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
        <div className="lg:hidden fixed inset-0 z-[99999] w-screen h-[100dvh] flex flex-col bg-zinc-950/98 backdrop-blur-2xl p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="max-w-md w-full mx-auto space-y-4 pt-2 pb-10">
            
            {/* Drawer Top Header */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-amber-400 p-[2px] shrink-0">
                  <div className="w-full h-full bg-[#0c0918] rounded-[9px] flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-bold text-white leading-tight">{platformName}</h4>
                  <span className="text-[10px] text-amber-300 font-medium">★ منصة هندسية معتمدة</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-9 h-9 rounded-full bg-zinc-800/90 text-amber-400 flex items-center justify-center border border-zinc-700"
                  title="تبديل المظهر"
                >
                  {theme === 'DARK' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-purple-400" />}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors border border-zinc-700"
                  aria-label="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Auth Section at the TOP of the Drawer */}
            {currentUser ? (
              <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 space-y-3.5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-[2px] shadow-lg shrink-0">
                    <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden flex items-center justify-center">
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-amber-400">{currentUser.firstName?.[0] || 'ق'}</span>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 text-right">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white truncate">{currentUser.officialFullName || currentUser.firstName}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold shrink-0">
                        {currentUser.role === 'ADMIN' ? 'المدير' : currentUser.role === 'INSTRUCTOR' ? 'محاضر' : 'طالب'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{currentUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {currentUser.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="col-span-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>لوحة تحكم الإدارة (Admin Panel)</span>
                    </Link>
                  )}
                  {currentUser.role === 'INSTRUCTOR' && (
                    <Link
                      href="/instructor"
                      onClick={() => setMobileMenuOpen(false)}
                      className="col-span-2 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>استوديو المعلم (Instructor Studio)</span>
                    </Link>
                  )}
                  <Link
                    href="/dashboard/my-courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="col-span-2 py-3 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 border border-amber-500/30 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>الكورسات المشترك فيها 🎓</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-zinc-700/80"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-zinc-400" />
                    <span>لوحة المتابعة</span>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-zinc-700/80"
                  >
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>الملف الشخصي</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900/95 to-zinc-900/70 border border-zinc-800 space-y-3 shadow-xl">
                <div className="text-right">
                  <p className="text-xs font-bold text-white">تسجيل الدخول والانضمام:</p>
                  <p className="text-[11px] text-zinc-400">سجل الآن وتابع كورساتك واحصل على شهاداتك المعتمدة</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs text-center border border-zinc-700 flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <LogIn className="w-4 h-4 text-zinc-300" />
                    <span>تسجيل الدخول</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 text-white font-bold text-xs text-center shadow-lg shadow-purple-950/60 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>إنشاء حساب جديد</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation Links with Icons & Highlighting */}
            <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1.5 shadow-xl">
              <p className="text-[11px] font-semibold text-zinc-500 px-3 py-1 text-right">أقسام المنصة:</p>
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-zinc-800 text-white border border-zinc-700'
                        : link.highlight
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {link.icon && (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          link.highlight ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          <link.icon className="w-4 h-4" />
                        </div>
                      )}
                      <span>{link.name}</span>
                    </div>
                    {link.highlight && (
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/25 text-amber-300 font-bold border border-amber-500/40 animate-pulse">
                        خصم 51% 🔥
                      </span>
                    )}
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