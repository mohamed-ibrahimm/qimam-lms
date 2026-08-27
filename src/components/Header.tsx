'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronDown
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [platformName, setPlatformName] = useState('أكاديمية قِمَم');
  const [platformTagline, setPlatformTagline] = useState('المنصة الرائدة لعلوم البرمجة والتقنية');

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
    <header className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-5 transition-all">
      <nav className="max-w-7xl mx-auto flex items-center justify-between min-h-[4.25rem] px-5 sm:px-8 rounded-full bg-zinc-900/90 border border-zinc-800/90 backdrop-blur-2xl shadow-2xl shadow-black/70 relative gap-4">
        {/* Logo & Platform Name (Royal Purple & Gold Emblem Style) */}
        <Link href="/" className="flex items-center gap-3.5 shrink-0 group py-1.5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-amber-400 p-[2px] shadow-lg shadow-purple-950/60 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full bg-[#0c0918] rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
          </div>
          <div className="flex flex-col text-right justify-center">
            <div className="flex items-center gap-2.5 whitespace-nowrap">
              <span className="text-base sm:text-lg font-bold text-white group-hover:text-amber-200 transition-colors tracking-tight">
                {platformName}
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/40 font-bold whitespace-nowrap shadow-sm shadow-amber-950/30">
                ★ تعليم احترافي
              </span>
            </div>
            {platformTagline && (
              <span className="text-[11px] text-amber-200/75 font-medium whitespace-nowrap mt-0.5 hidden sm:block">
                {platformTagline}
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Nav (Spacious & Cleanly Separated) */}
        <div className="hidden lg:flex items-center gap-2 bg-zinc-950/50 px-3 py-1.5 rounded-full border border-zinc-800/60 shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                    : link.highlight
                    ? 'text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 shadow-sm shadow-amber-950/30'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/70'
                }`}
              >
                {link.icon && <link.icon className={`w-4 h-4 ${link.highlight ? 'text-amber-400' : ''}`} />}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Auth / User Actions */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {loading ? (
            <div className="w-24 h-9 bg-zinc-800/60 animate-pulse rounded-full" />
          ) : currentUser ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-600 transition-all text-right shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-zinc-950 flex items-center justify-center font-bold text-xs shadow-inner overflow-hidden relative shrink-0">
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
                <span className="text-xs font-bold text-white max-w-[100px] truncate">
                  {currentUser.firstName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 mr-0.5" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-60 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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
                      <LayoutDashboard className="w-4 h-4" />
                      لوحة تحكم الإدارة (Admin)
                    </Link>
                  )}

                  {(currentUser.role === 'INSTRUCTOR' || currentUser.role === 'ADMIN') && (
                    <Link
                      href="/instructor"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      <GraduationCap className="w-4 h-4" />
                      استوديو المعلم (Instructor)
                    </Link>
                  )}

                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    لوحة دراستي وكورساتي
                  </Link>

                  <Link
                    href="/chat"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    المحادثات المباشرة
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4" />
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
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                دخول
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
              >
                انضم الآن
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-full bg-zinc-800/80 text-zinc-300 hover:text-white border border-zinc-700/60"
          aria-label="القائمة"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Drawer Floating Card */}
      {mobileMenuOpen && (
        <div className="max-w-7xl mx-auto mt-2 rounded-3xl border border-zinc-800/90 bg-zinc-900/95 backdrop-blur-2xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-top-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-zinc-800 pt-3">
            {currentUser ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-zinc-800/60 rounded-xl">
                  <p className="text-xs text-zinc-400">مسجل كـ</p>
                  <p className="text-sm font-bold text-white">{currentUser.officialFullName}</p>
                </div>
                {currentUser.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-amber-400 font-bold"
                  >
                    لوحة تحكم الإدارة (Admin)
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-zinc-200"
                >
                  لوحة دراستي
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-zinc-200"
                >
                  الملف الشخصي
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-right px-3 py-2 text-sm text-rose-400 font-medium"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-zinc-800 text-white text-sm font-semibold hover:bg-zinc-700"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-zinc-100 text-zinc-950 text-sm font-bold hover:bg-zinc-200"
                >
                  إنشاء حساب جديد
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}