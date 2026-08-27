'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }
    if (password.length < 6) {
      setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'فشلت العملية');
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2500);
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="rounded-3xl bg-surface border border-border p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary-950 border border-primary-800 flex items-center justify-center mx-auto text-primary-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">تعيين كلمة المرور الجديدة</h1>
          <p className="text-xs text-zinc-400">
            أدخل كلمة المرور الجديدة لحسابك لتسجيل الدخول بأمان
          </p>
        </div>

        {success ? (
          <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p>تم تعيين كلمة المرور بنجاح! جاري تحويلك لصفحة تسجيل الدخول...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">كلمة المرور الجديدة</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">تأكيد كلمة المرور</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ كلمة المرور الجديدة'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-zinc-400">جاري التحميل...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}