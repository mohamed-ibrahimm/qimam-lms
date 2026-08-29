'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ShieldCheck, KeyRound, ExternalLink, HelpCircle } from 'lucide-react';

export default function GoogleSetupPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'STUDENT';
  const callbackUrl = searchParams.get('callbackUrl') || '';

  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/save-google-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, clientSecret }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'فشل حفظ الإعدادات');
      } else {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = `/api/auth/google?role=${role}&callbackUrl=${encodeURIComponent(callbackUrl)}`;
        }, 1200);
      }
    } catch {
      setError('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 flex items-center justify-center mx-auto shadow-md">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            تفعيل الربط الفعلي مع Google OAuth
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300">
            لربط حسابات Google الحقيقية والتحويل المباشر إلى صفحة اختيار الحسابات من Google
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#120e24]/95 border border-slate-200 dark:border-amber-500/30 shadow-2xl space-y-6">
          
          {/* Step-by-Step Guide */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 space-y-2 text-xs">
            <span className="font-black block text-sm">خطوات الحصول على مفاتيح Google في دقيقتين:</span>
            <ol className="list-decimal list-inside space-y-1.5 font-medium leading-relaxed">
              <li>ادخل إلى <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="underline font-bold text-amber-600 dark:text-amber-400 inline-flex items-center gap-1">Google Cloud Console <ExternalLink className="w-3 h-3" /></a></li>
              <li>أنشئ أو اختر مشروعك، ثم اضغط على <b>Create Credentials &gt; OAuth client ID</b>.</li>
              <li>اختر نوع التطبيق <b>Web application</b>.</li>
              <li>أضف في خانة <b>Authorized redirect URIs</b> الرابطين التاليين:
                <div className="mt-1 space-y-1 font-mono text-[11px] bg-white/80 dark:bg-black/40 p-2 rounded-xl border border-amber-300 dark:border-amber-700/50 select-all">
                  <div>http://localhost:3000/api/auth/google/callback</div>
                  <div>https://qimam-lms.vercel.app/api/auth/google/callback</div>
                </div>
              </li>
              <li>انسخ <b>Client ID</b> و <b>Client Secret</b> وضعهما في الأسفل ثم اضغط حفظ.</li>
            </ol>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>تم حفظ المفاتيح بنجاح! جاري تحويلك الآن إلى صفحة Google الحقيقية...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1">
                Google Client ID
              </label>
              <input
                type="text"
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="1045959409666-xxxxxxxx.apps.googleusercontent.com"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1">
                Google Client Secret
              </label>
              <input
                type="password"
                required
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxx"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'جاري الحفظ والتفعيل...' : 'حفظ وتفعيل ربط Google فوراً'}</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link href="/login" className="text-xs text-slate-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 underline">
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
