'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, Mail, Lock, AlertCircle, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const registered = searchParams.get('registered');

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const errorParam = searchParams.get('error');
  const getInitialError = () => {
    if (errorParam === 'invalid_credentials') return 'اسم المستخدم أو كلمة المرور غير صحيحة';
    if (errorParam === 'missing_credentials') return 'يرجى إدخال اسم المستخدم وكلمة المرور';
    if (errorParam === 'unauthorized_admin') return 'يجب تسجيل الدخول أولاً بحساب المدير للوصول إلى لوحة الإدارة';
    if (errorParam === 'unauthorized_instructor') return 'يجب تسجيل الدخول بحساب المعلم للوصول إلى استوديو المعلم';
    return '';
  };
  const [error, setError] = useState(getInitialError);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!formData.identifier.trim() || !formData.password.trim()) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'فشل تسجيل الدخول: يرجى التحقق من اسم المستخدم وكلمة المرور');
      } else {
        let target = '/dashboard';
        if (data.user?.role === 'ADMIN') {
          target = '/admin';
        } else if (data.user?.role === 'INSTRUCTOR') {
          target = '/instructor';
        } else if (callbackUrl && callbackUrl !== '/login' && !callbackUrl.startsWith('/login')) {
          target = callbackUrl;
        }
        window.location.replace(target);
      }
    } catch (err: any) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Dynamic Multi-Color Moving Glow Orbs in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="dynamic-drift-1 absolute top-[10%] right-[25%] w-[420px] h-[420px] bg-sky-400/25 dark:bg-amber-500/10 rounded-full blur-[110px]" />
        <div className="dynamic-drift-2 absolute bottom-[15%] left-[20%] w-[460px] h-[460px] bg-indigo-500/25 dark:bg-purple-600/15 rounded-full blur-[120px]" />
        <div className="dynamic-drift-3 absolute top-[40%] left-[10%] w-[380px] h-[380px] bg-fuchsia-400/20 dark:bg-pink-600/10 rounded-full blur-[100px]" />
        <div className="dynamic-drift-4 absolute bottom-[30%] right-[15%] w-[390px] h-[390px] bg-emerald-400/20 dark:bg-teal-600/10 rounded-full blur-[105px]" />
      </div>

      <div className="w-full max-w-md rounded-3xl bg-white/95 dark:bg-[#120e24]/95 border border-slate-200/90 dark:border-amber-500/30 p-7 sm:p-9 shadow-2xl shadow-purple-950/40 space-y-6 backdrop-blur-2xl relative">
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center mb-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-blue-600/30 blur-md" />
            <div className="relative w-14 h-14 rounded-2xl p-[2px] bg-gradient-to-tr from-amber-500 via-indigo-500 to-amber-300 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full rounded-[14px] bg-[#0c0918] flex items-center justify-center border border-amber-400/30">
                <LogIn className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">تسجيل الدخول</h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-300">
            مرحباً بك مجدداً في <span className="font-bold text-amber-500 dark:text-amber-400">أكاديمية م / محمد إبراهيم</span>
          </p>
        </div>

        {registered && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold text-center">
            تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Social Sign-In Buttons */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-3 gap-2">
            {/* Google Button */}
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await fetch('/api/auth/social', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ provider: 'google' }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    window.location.replace(data.redirectTo || '/dashboard');
                  }
                } catch {}
              }}
              className="h-11 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#181330] dark:hover:bg-[#1f193f] border border-slate-200 dark:border-purple-900/60 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xs"
              title="دخول بحساب Google"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>جوجل</span>
            </button>

            {/* GitHub Button */}
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await fetch('/api/auth/social', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ provider: 'github' }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    window.location.replace(data.redirectTo || '/dashboard');
                  }
                } catch {}
              }}
              className="h-11 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#181330] dark:hover:bg-[#1f193f] border border-slate-200 dark:border-purple-900/60 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xs"
              title="دخول بحساب GitHub"
            >
              <svg className="w-4 h-4 shrink-0 fill-current text-slate-800 dark:text-white" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>جيت هاب</span>
            </button>

            {/* Facebook Button */}
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await fetch('/api/auth/social', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ provider: 'facebook' }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    window.location.replace(data.redirectTo || '/dashboard');
                  }
                } catch {}
              }}
              className="h-11 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#181330] dark:hover:bg-[#1f193f] border border-slate-200 dark:border-purple-900/60 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xs"
              title="دخول بحساب Facebook"
            >
              <svg className="w-4 h-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>فيسبوك</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center pt-2 pb-1">
            <div className="border-t border-slate-200 dark:border-purple-900/50 w-full" />
            <span className="bg-white dark:bg-[#120e24] px-3 text-[11px] font-semibold text-slate-400 dark:text-zinc-500 whitespace-nowrap absolute">
              أو تسجيل الدخول اليدوي
            </span>
          </div>
        </div>

        <form
          action="/api/auth/form-login"
          method="POST"
          onSubmit={async (e) => {
            const identEl = document.getElementById('login-identifier') as HTMLInputElement | null;
            const passEl = document.getElementById('login-password') as HTMLInputElement | null;
            const idVal = (identEl?.value || formData.identifier || '').trim();
            const passVal = (passEl?.value || formData.password || '').trim();
            
            if (!idVal || !passVal) {
              e.preventDefault();
              setError('يرجى إدخال اسم المستخدم وكلمة المرور');
              return;
            }
          }}
          className="space-y-4"
        >
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-zinc-200 mb-1.5">
              اسم المستخدم أو البريد الإلكتروني
            </label>
            <div className="relative group">
              <input
                type="text"
                name="identifier"
                id="login-identifier"
                required
                defaultValue={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                placeholder="admin أو student أو البريد الإلكتروني"
                className="w-full h-11 pr-11 pl-4 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs sm:text-sm focus:bg-white dark:focus:bg-[#1f193f] focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-all shadow-xs"
              />
              <Mail className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400 transition-colors pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-zinc-200">كلمة المرور</label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>
            <div className="relative group">
              <input
                type="password"
                name="password"
                id="login-password"
                required
                defaultValue={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full h-12 pr-11 pl-4 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs sm:text-sm focus:bg-white dark:focus:bg-[#1f193f] focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-all shadow-xs"
              />
              <Lock className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400 transition-colors pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-zinc-950 font-black text-base shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'جاري التحقق...' : 'دخول المنصة'}</span>
            <ArrowLeft className="w-5 h-5 text-zinc-950" />
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-zinc-400 pt-2">
          ليس لديك حساب؟{' '}
          <Link href="/register" className="font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors underline-offset-4 hover:underline">
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-zinc-400">جاري التحميل...</div>}>
      <LoginForm />
    </Suspense>
  );
}