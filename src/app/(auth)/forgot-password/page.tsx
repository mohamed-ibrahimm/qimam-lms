'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'حدث خطأ');
      } else {
        setSuccess(true);
      }
    } catch (e) {
      setError('تعذر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-white">استعادة كلمة المرور</h1>
          <p className="text-xs text-zinc-400">أدخل بريدك الإلكتروني لإرسال تعليمات إعادة التعيين</p>
        </div>

        <div className="p-8 rounded-3xl bg-surface border border-border shadow-xl">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">تم إرسال الرابط بنجاح</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                إذا كان البريد مسجلاً لدينا، فقد أرسلنا رابط تعيين كلمة المرور إلى بريدك الإلكتروني.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-primary-400 hover:underline pt-2"
              >
                <ArrowRight className="w-4 h-4" />
                العودة لصفحة تسجيل الدخول
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">البريد الإلكتروني المسجل</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-border text-white text-sm focus:outline-none focus:border-primary-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="text-xs text-zinc-400 hover:text-white">
                  تذكرت كلمة المرور؟ تسجيل الدخول
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}