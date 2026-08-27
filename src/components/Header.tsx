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
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#090812]/90 backdrop-blur-xl transition-all">
      {/* Subtle top/bottom ambient edge with gold and purple */}
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/35 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4 relative">
        {/* Logo & Platform Name */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-amber-400 p-[2px] shadow-lg shadow-purple-950/50 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full bg-[#0c0918] rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-sm sm:text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                {platformName}
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/40 font-bold whitespace-nowrap shadow-sm shadow-amber-950/30">
                ★ تعليم احترافي
              </span>
            </div>
            {platformTagline && (
              <span className="text-[10px] text-amber-200/80 font-medium whitespace-nowrap mt-0.5 hidden sm:block">
                {platformTagline}
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Nav (Spacious & Cleanly Separated) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/[0.03] px-2.5 py-1.5 rounded-full border border-white/[0.06] shadow-inner shrink-0">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-normal whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/60 border border-purple-400/40'
                    : link.highlight
                    ? 'text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 shadow-sm shadow-amber-950/30'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {link.icon && <link.icon className={`w-3.5 h-3.5 ${link.highlight ? 'text-amber-400' : ''}`} />}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Auth / User Actions */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {loading ? (
            <div className="w-24 h-9 bg-zinc-800/60 animate-pulse rounded-full" />
          ) : currentUser ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] transition-colors text-right"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-amber-400 text-white flex items-center justify-center font-bold text-xs shadow-inner overflow-hidden relative ring-1 ring-amber-400/50 shrink-0">
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
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-white max-w-[100px] lg:max-w-[130px] truncate tracking-normal">
                    {currentUser.firstName} {currentUser.lastName}
                  </span>
                  <span className="text-[10px] text-amber-300 font-semibold tracking-normal">
                    {currentUser.role === 'ADMIN' ? 'مدير المنصة' : currentUser.role === 'INSTRUCTOR' ? 'معلم معتمد' : 'طالب'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 mr-0.5" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-60 rounded-2xl bg-surface-card border border-border shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-border/60">
                    <p className="text-xs text-zinc-400">مرحباً بك،</p>
                    <p className="text-sm font-bold text-white truncate">{currentUser.officialFullName || currentUser.email}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{currentUser.email}</p>
                  </div>

                  {currentUser.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary-300 hover:bg-primary-950/50 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      لوحة تحكم الإدارة (Admin)
                    </Link>
                  )}

                  {(currentUser.role === 'INSTRUCTOR' || currentUser.role === 'ADMIN') && (
                    <Link
                      href="/instructor"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-purple-300 hover:bg-purple-950/40 hover:text-white transition-colors"
                    >
                      <GraduationCap className="w-4 h-4" />
                      استوديو المعلم (Instructor)
                    </Link>
                  )}

                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-200 hover:bg-surface-raised hover:text-white transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    لوحة دراستي وكورساتي
                  </Link>

                  <Link
                    href="/chat"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-200 hover:bg-surface-raised hover:text-white transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    المحادثات المباشرة
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-200 hover:bg-surface-raised hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4" />
                    الملف الشخصي والشهادات
                  </Link>

                  <div className="border-t border-border/60 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-200 hover:text-white hover:bg-surface-raised transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-md shadow-indigo-900/30 transition-all hover:scale-[1.02]"
              >
                حساب جديد
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-surface-raised text-zinc-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-zinc-300 hover:bg-surface-raised hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-border pt-3">
            {currentUser ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-surface-raised rounded-lg">
                  <p className="text-xs text-zinc-400">مسجل كـ</p>
                  <p className="text-sm font-bold text-white">{currentUser.officialFullName}</p>
                </div>
                {currentUser.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-primary-400 font-bold"
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
                  className="w-full text-center py-2.5 rounded-lg bg-surface-raised text-white text-sm font-bold"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-primary-600 text-white text-sm font-bold"
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