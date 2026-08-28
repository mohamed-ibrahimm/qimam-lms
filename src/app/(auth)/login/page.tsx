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

      <div className="w-full max-w-md rounded-3xl bg-white/95 dark:bg-[#0e0b1d] border border-slate-200/90 dark:border-amber-500/20 p-7 sm:p-9 shadow-2xl shadow-blue-900/10 dark:shadow-black/90 space-y-6 backdrop-blur-2xl relative">
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center mb-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-blue-600/30 blur-md" />
            <div className="relative w-14 h-14 rounded-2xl p-[2px] bg-gradient-to-tr from-amber-500 via-indigo-500 to-amber-300 shadow-lg shadow-amber-500/15">
              <div className="w-full h-full rounded-[14px] bg-[#0c0918] flex items-center justify-center border border-amber-400/25">
                <LogIn className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">تسجيل الدخول</h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400">
            مرحباً بك مجدداً في <span className="font-bold text-amber-500 dark:text-amber-400">أكاديمية م / محمد إبراهيم</span>
          </p>
        </div>

        {registered && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold text-center">
            تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

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
          className="space-y-5"
        >
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-zinc-200 mb-2">
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
                className="w-full h-12 pr-11 pl-4 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs sm:text-sm focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all shadow-xs"
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
                className="w-full h-12 pr-11 pl-4 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs sm:text-sm focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all shadow-xs"
              />
              <Lock className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400 transition-colors pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 dark:from-amber-500 dark:via-yellow-500 dark:to-amber-600 dark:hover:from-amber-400 dark:hover:to-yellow-400 text-white dark:text-zinc-950 font-black text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 dark:shadow-amber-500/20"
          >
            <span>{loading ? 'جاري التحقق...' : 'دخول المنصة'}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 text-center text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
          ليس لديك حساب بعد؟{' '}
          <Link
            href="/register"
            className="font-bold text-blue-600 hover:text-blue-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors underline-offset-4 hover:underline"
          >
            إنشاء حساب جديد
          </Link>
        </div>
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