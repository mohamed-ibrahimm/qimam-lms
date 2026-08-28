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

      <div className="w-full max-w-md rounded-3xl bg-white/90 dark:bg-surface border border-slate-200/90 dark:border-zinc-800 p-7 sm:p-9 shadow-2xl shadow-blue-900/10 dark:shadow-black/80 space-y-6 backdrop-blur-2xl relative">
        <div className="text-center space-y-2.5">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            {/* Ambient Blurred Colored Glow Behind Icon */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-500 to-fuchsia-500 rounded-2xl blur-lg opacity-60 animate-pulse" />
            <div className="dynamic-auth-emblem w-14 h-14 rounded-2xl p-[2.5px] relative z-10 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-[13px] flex items-center justify-center shadow-inner">
                <LogIn className="w-6 h-6 text-blue-600 dark:text-amber-400" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">تسجيل الدخول</h1>
          <p className="text-xs font-bold text-blue-700 dark:text-amber-300">
            أكاديمية م / محمد إبراهيم
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
          className="space-y-4.5"
        >
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
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
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-50/80 dark:bg-surface-raised border border-slate-200 dark:border-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs focus:bg-white focus:outline-none focus:border-blue-600 dark:focus:border-amber-400 shadow-xs focus:shadow-md focus:shadow-blue-500/10 transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute right-3.5 top-3.5 group-focus-within:text-blue-600 dark:group-focus-within:text-amber-400 transition-colors" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">كلمة المرور</label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
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
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-50/80 dark:bg-surface-raised border border-slate-200 dark:border-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs focus:bg-white focus:outline-none focus:border-blue-600 dark:focus:border-amber-400 shadow-xs focus:shadow-md focus:shadow-blue-500/10 transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute right-3.5 top-3.5 group-focus-within:text-blue-600 dark:group-focus-within:text-amber-400 transition-colors" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="dynamic-multi-cta w-full py-4 rounded-2xl text-white font-black text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-xl relative"
          >
            <div className="shimmer-beam-gold opacity-40" />
            <span className="relative z-10">{loading ? 'جاري التحقق...' : 'دخول المنصة'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-600 dark:text-zinc-400 pt-3 border-t border-slate-100 dark:border-border/60">
          ليس لديك حساب بعد؟{' '}
          <Link href="/register" className="font-black text-blue-600 hover:text-blue-800 dark:text-amber-400 dark:hover:text-amber-300">
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