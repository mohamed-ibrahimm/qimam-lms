'use client';

import React, { useState } from 'react';
import { User, X, Plus, Check } from 'lucide-react';

interface Props {
  provider: 'google' | 'github' | 'facebook';
  role?: 'STUDENT' | 'INSTRUCTOR';
  onClose: () => void;
  onSuccess: (redirectTo: string) => void;
}

export default function SocialAccountChooserModal({
  provider,
  role = 'STUDENT',
  onClose,
  onSuccess,
}: Props) {
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [error, setError] = useState('');

  // Pre-configured accounts list for Google (directly matching user's browser accounts)
  const defaultAccounts = provider === 'google' ? [
    {
      name: 'Mohamed Ibrahim',
      email: 'mehac196@gmail.com',
      avatarInitial: 'M',
      avatarColor: 'bg-indigo-600',
    },
    {
      name: 'mohamed ebrahim',
      email: 'me20210230@sva.edu.eg',
      avatarInitial: 'm',
      avatarColor: 'bg-emerald-600',
    },
    {
      name: 'Mohamed Ibrahim',
      email: 'me2021023ss@gmail.com',
      avatarInitial: 'M',
      avatarColor: 'bg-purple-600',
    },
    {
      name: 'Mohamed Ibrahim',
      email: 'mi4565812@gmail.com',
      avatarInitial: 'M',
      avatarColor: 'bg-amber-600',
    },
  ] : provider === 'github' ? [
    {
      name: 'mohamed-ibrahimm',
      email: 'mohamed.dev@github.com',
      avatarInitial: 'G',
      avatarColor: 'bg-zinc-800',
    },
  ] : [
    {
      name: 'Mohamed Ibrahim',
      email: 'mohamed.ibrahim@facebook.com',
      avatarInitial: 'F',
      avatarColor: 'bg-blue-600',
    },
  ];

  const handleSelectAccount = async (account: { name: string; email: string }) => {
    setLoadingEmail(account.email);
    setError('');
    try {
      const res = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          role,
          email: account.email,
          name: account.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'حدث خطأ أثناء تسجيل الدخول');
        setLoadingEmail(null);
      } else {
        onSuccess(data.redirectTo || (role === 'INSTRUCTOR' ? '/instructor' : '/dashboard'));
      }
    } catch {
      setError('فشل الاتصال بخدمة التحقق');
      setLoadingEmail(null);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    handleSelectAccount({
      name: customName.trim() || customEmail.split('@')[0],
      email: customEmail.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#120e24] border border-slate-200 dark:border-amber-500/40 shadow-2xl overflow-hidden relative">
        
        {/* Header Bar - Authentic OAuth Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/80 dark:bg-[#181330]/80">
          <div className="flex items-center gap-2.5">
            {provider === 'google' ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            ) : provider === 'github' ? (
              <svg className="w-5 h-5 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            )}
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">
              {provider === 'google' ? 'تسجيل الدخول باستخدام Google' : provider === 'github' ? 'تسجيل الدخول باستخدام GitHub' : 'تسجيل الدخول باستخدام Facebook'}
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

        {/* Content Area */}
        <div className="p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              اختيار حساب
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              المتابعة إلى <span className="font-bold text-amber-600 dark:text-amber-400">أكاديمية م / محمد إبراهيم</span>
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Accounts List (Google Style) */}
          <div className="divide-y divide-slate-100 dark:divide-purple-900/40 border border-slate-200/90 dark:border-purple-900/50 rounded-2xl overflow-hidden">
            {defaultAccounts.map((acc) => {
              const isThisLoading = loadingEmail === acc.email;

              return (
                <button
                  key={acc.email}
                  type="button"
                  disabled={!!loadingEmail}
                  onClick={() => handleSelectAccount(acc)}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-right cursor-pointer group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-full ${acc.avatarColor} text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0`}>
                      {acc.avatarInitial}
                    </div>
                    <div className="truncate">
                      <span className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {acc.name}
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                        {acc.email}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 mr-2">
                    {isThisLoading ? (
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 animate-pulse">
                        جاري الربط...
                      </span>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-zinc-600 group-hover:border-amber-500 flex items-center justify-center transition-colors">
                        <Check className="w-3 h-3 text-transparent group-hover:text-amber-500 transition-colors" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Use Another Account Button */}
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="w-full px-4 py-3 flex items-center gap-3.5 hover:bg-slate-50 dark:hover:bg-white/5 text-right transition-colors cursor-pointer text-xs font-bold text-slate-700 dark:text-zinc-300"
              >
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 dark:border-zinc-600 flex items-center justify-center text-slate-500 dark:text-zinc-400">
                  <Plus className="w-4 h-4" />
                </div>
                <span>استخدام حساب آخر</span>
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="p-4 bg-slate-50/50 dark:bg-white/[0.02] space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    الاسم (اختياري)
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="اسم صاحب الحساب"
                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={!!loadingEmail || !customEmail.trim()}
                    className="flex-1 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black transition-all cursor-pointer disabled:opacity-50"
                  >
                    متابعة بهذا الحساب
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    className="px-3 h-9 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 text-xs font-bold hover:bg-white/10"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Legal Footer Notice */}
          <p className="text-[10px] text-slate-400 dark:text-zinc-500 text-center leading-relaxed">
            قبل استخدام هذا التطبيق، يمكنك مراجعة سياسة الخصوصية وبنود الخدمة الخاصة بالمنصة.
          </p>
        </div>
      </div>
    </div>
  );
}
