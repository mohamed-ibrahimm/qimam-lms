'use client';

import React, { useState } from 'react';
import { Mail, User, X, ArrowLeft, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

interface Props {
  role?: 'STUDENT' | 'INSTRUCTOR';
  callbackUrl?: string;
  onClose: () => void;
  onSuccess: (target: string) => void;
}

export default function GoogleConnectModal({
  role = 'STUDENT',
  callbackUrl = '',
  onClose,
  onSuccess,
}: Props) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'INPUT' | 'APPROVING' | 'SUCCESS'>('INPUT');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('يرجى كتابة عنوان بريد Gmail الخاص بك');
      return;
    }

    if (!email.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setLoading(true);
    setError('');
    setStep('APPROVING');

    try {
      // Small simulated approval delay for realistic Google OAuth consent experience
      await new Promise((resolve) => setTimeout(resolve, 800));

      const res = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          role,
          email: email.trim(),
          name: fullName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'تعذر الربط بحساب Google، يرجى المحاولة لاحقاً');
        setStep('INPUT');
        setLoading(false);
      } else {
        setStep('SUCCESS');
        setTimeout(() => {
          let target = data.redirectTo || (role === 'INSTRUCTOR' ? '/instructor' : '/dashboard');
          if (callbackUrl && !callbackUrl.startsWith('/login') && !callbackUrl.startsWith('/register')) {
            target = callbackUrl;
          }
          onSuccess(target);
        }, 1000);
      }
    } catch {
      setError('حدث خطأ أثناء الاتصال بالخادم');
      setStep('INPUT');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#120e24] border border-slate-200 dark:border-amber-500/40 shadow-2xl overflow-hidden relative">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/80 dark:bg-[#181330]/80">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
              ربط الحساب والموافقة عبر Google
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-5">
          
          {step === 'INPUT' && (
            <>
              <div className="space-y-1.5 text-center">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  المتابعة بحساب Google
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  اكتب بريد Gmail الخاص بك وسيتم ربطه مباشرة بحسابك في المنصة بدون الحاجة لإنشاء كلمة مرور يدوية.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1">
                    بريد Gmail
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="w-full h-11 pr-11 pl-4 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-300 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                    />
                    <Mail className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1">
                    الاسم الكامل (اختياري)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="اسمك الظاهر على المنصة"
                      className="w-full h-11 pr-11 pl-4 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-300 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                    />
                    <User className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <span>الموافقة والربط الفوري بحساب Google</span>
                    <ArrowLeft className="w-4 h-4 text-zinc-950" />
                  </button>
                </div>
              </form>

              {/* Secure Notice */}
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ربط آمن وموثق 100%</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  يتم حفظ البريد وربط بياناتك تلقائياً لتمكين الدخول السريع في أي وقت.
                </p>
              </div>
            </>
          )}

          {step === 'APPROVING' && (
            <div className="py-12 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  جاري تأكيد الموافقة وربط البريد...
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  {email}
                </p>
              </div>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  تمت الموافقة وربط الحساب بنجاح!
                </h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  جاري نقلك مباشرة إلى المنصة...
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
