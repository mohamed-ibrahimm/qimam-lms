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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setError(data.error || 'فشل تسجيل الدخول');
      } else {
        if (data.user?.role === 'ADMIN') {
          router.push('/admin');
        } else if (data.user?.role === 'INSTRUCTOR') {
          router.push('/instructor');
        } else {
          router.push(callbackUrl);
        }
        router.refresh();
      }
    } catch (err: any) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="rounded-3xl bg-surface border border-amber-500/20 p-8 shadow-2xl shadow-black/80 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-[2px] shadow-lg shadow-amber-950/60 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-[#0c0918] rounded-[14px] flex items-center justify-center">
              <LogIn className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white">تسجيل الدخول</h1>
          <p className="text-xs font-bold text-amber-300">
            أكاديمية المهندس محمد إبراهيم
          </p>
        </div>

        {/* Fast 1-Click Demo Login Panel */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2.5 shadow-md">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>الدخول السريع بنقرة واحدة (لتجربة كافة اللوحات مباشرة):</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <a
              href="/api/auth/demo?role=ADMIN"
              className="px-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs text-center shadow-sm flex flex-col items-center justify-center gap-1 transition-transform hover:scale-105"
            >
              <span>👑 مدير (Admin)</span>
            </a>
            <a
              href="/api/auth/demo?role=INSTRUCTOR"
              className="px-2 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold text-xs text-center border border-amber-500/30 shadow-sm flex flex-col items-center justify-center gap-1 transition-transform hover:scale-105"
            >
              <span>👨‍🏫 معلّم (Studio)</span>
            </a>
            <a
              href="/api/auth/demo?role=STUDENT"
              className="px-2 py-2.5 rounded-xl bg-zinc-800 hover:from-zinc-700 text-zinc-200 font-bold text-xs text-center border border-zinc-700 shadow-sm flex flex-col items-center justify-center gap-1 transition-transform hover:scale-105"
            >
              <span>🎓 طالب (Student)</span>
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">
              اسم المستخدم أو البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                placeholder="admin أو student أو البريد الإلكتروني"
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-zinc-300">كلمة المرور</label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-sm shadow-xl shadow-amber-950/40 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? 'جاري التحقق...' : 'دخول المنصة'}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400 pt-2 border-t border-border/60">
          ليس لديك حساب بعد؟{' '}
          <Link href="/register" className="font-bold text-amber-400 hover:text-amber-300">
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