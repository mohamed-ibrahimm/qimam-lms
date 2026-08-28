'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, ShieldAlert, Award } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    fatherName: '',
    lastName: '',
    officialFullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'firstName' || name === 'fatherName' || name === 'lastName') {
        const full = `${updated.firstName} ${updated.fatherName ? updated.fatherName + ' ' : ''}${updated.lastName}`.trim();
        updated.officialFullName = full;
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('كلمتا المرور غير متطابقتين');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('يجب أن لا تقل كلمة المرور عن 6 أحرف');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'فشل التسجيل');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setErrorMessage('حدث خطأ في الخادم، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Dynamic Multi-Color Moving Glow Orbs in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="dynamic-drift-1 absolute top-[10%] right-[25%] w-[440px] h-[440px] bg-sky-400/25 dark:bg-amber-500/10 rounded-full blur-[110px]" />
        <div className="dynamic-drift-2 absolute bottom-[15%] left-[20%] w-[480px] h-[480px] bg-indigo-500/25 dark:bg-purple-600/15 rounded-full blur-[120px]" />
        <div className="dynamic-drift-3 absolute top-[40%] left-[10%] w-[400px] h-[400px] bg-fuchsia-400/20 dark:bg-pink-600/10 rounded-full blur-[100px]" />
        <div className="dynamic-drift-4 absolute bottom-[30%] right-[15%] w-[420px] h-[420px] bg-emerald-400/20 dark:bg-teal-600/10 rounded-full blur-[105px]" />
      </div>

      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center mb-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-blue-600/30 blur-md" />
            <div className="relative w-14 h-14 rounded-2xl p-[2px] bg-gradient-to-tr from-amber-500 via-indigo-500 to-amber-300 shadow-lg shadow-amber-500/15">
              <div className="w-full h-full rounded-[14px] bg-[#0c0918] flex items-center justify-center border border-amber-400/25">
                <UserPlus className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">إنشاء حساب جديد</h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400">
            انضم الآن إلى <span className="font-bold text-amber-500 dark:text-amber-400">أكاديمية م / محمد إبراهيم</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-7 sm:p-9 rounded-3xl bg-white/95 dark:bg-[#0e0b1d] border border-slate-200/90 dark:border-amber-500/20 shadow-2xl shadow-blue-900/10 dark:shadow-black/90 space-y-5 backdrop-blur-2xl">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">الاسم الأول *</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="أحمد"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-raised border border-slate-200 dark:border-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:bg-white focus:outline-none focus:border-blue-600 dark:focus:border-amber-400 transition-all shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">اسم الأب</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="مصطفى"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-raised border border-slate-200 dark:border-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:bg-white focus:outline-none focus:border-blue-600 dark:focus:border-amber-400 transition-all shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">اسم العائلة *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="إبراهيم"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-raised border border-slate-200 dark:border-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:bg-white focus:outline-none focus:border-blue-600 dark:focus:border-amber-400 transition-all shadow-xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-purple-950/30 border border-blue-200 dark:border-purple-800/40 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 dark:text-purple-300">
              <Award className="w-4 h-4 text-blue-600 dark:text-purple-400" />
              <span>الاسم الرسمي الكامل (الذي سيظهر على الشهادات المعتمدة):</span>
            </div>
            <input
              type="text"
              name="officialFullName"
              required
              value={formData.officialFullName}
              onChange={handleChange}
              placeholder="الاسم الرباعي الرسمي للشهادات"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-surface-card border border-blue-200 dark:border-purple-900 text-slate-900 dark:text-purple-100 placeholder:text-slate-400 text-sm font-semibold focus:outline-none focus:border-blue-600 dark:focus:border-primary-400 shadow-xs"
            />
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">يرجى كتابة اسمك بدقة كما ترغب أن يظهر في وثيقة التخرج والشهادة الرسمية.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">اسم المستخدم (Username) *</label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="ahmed_dev"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-raised border border-slate-200 dark:border-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:bg-white focus:outline-none focus:border-blue-600 dark:focus:border-amber-400 transition-all shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">رقم الهاتف (واتساب)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01012345678"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-raised border border-slate-200 dark:border-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:bg-white focus:outline-none focus:border-blue-600 dark:focus:border-amber-400 transition-all shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">البريد الإلكتروني *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-raised border border-slate-200 dark:border-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:bg-white focus:outline-none focus:border-blue-600 dark:focus:border-amber-400 transition-all shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">كلمة المرور *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-raised border border-slate-200 dark:border-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:bg-white focus:outline-none focus:border-blue-600 dark:focus:border-amber-400 transition-all shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">تأكيد كلمة المرور *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-raised border border-slate-200 dark:border-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:bg-white focus:outline-none focus:border-blue-600 dark:focus:border-amber-400 transition-all shadow-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 dark:from-amber-500 dark:via-yellow-500 dark:to-amber-600 dark:hover:from-amber-400 dark:hover:to-yellow-400 text-white dark:text-zinc-950 font-black text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 dark:shadow-amber-500/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب وبدء التعلم'}</span>
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-zinc-400 pt-2">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors underline-offset-4 hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}