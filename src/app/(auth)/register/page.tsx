'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldAlert,
  GraduationCap,
  Video,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  KeyRound,
  X
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get('role');

  const [role, setRole] = useState<'STUDENT' | 'INSTRUCTOR'>(
    initialRoleParam?.toUpperCase() === 'INSTRUCTOR' ? 'INSTRUCTOR' : 'STUDENT'
  );

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialRoleParam?.toUpperCase() === 'INSTRUCTOR') {
      setRole('INSTRUCTOR');
    }
  }, [initialRoleParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manual Form Submit
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setErrorMessage('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('كلمتا المرور غير متطابقتين');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('يجب ألا تقل كلمة المرور عن 6 أحرف');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'فشل إنشاء الحساب');
      } else {
        router.push(data.redirectTo || (role === 'INSTRUCTOR' ? '/instructor' : '/dashboard'));
        router.refresh();
      }
    } catch {
      setErrorMessage('حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="dynamic-drift-1 absolute top-[10%] right-[25%] w-[450px] h-[450px] bg-purple-600/15 dark:bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="dynamic-drift-2 absolute bottom-[15%] left-[20%] w-[500px] h-[500px] bg-amber-500/15 dark:bg-amber-500/20 rounded-full blur-[130px]" />
      </div>

      <div className="w-full max-w-md space-y-5">
        {/* Header Title */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {role === 'INSTRUCTOR' ? 'إنشاء حساب محاضر' : 'إنشاء حساب جديد'}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-300">
            أكاديمية المهندس محمد إبراهيم التعليمية
          </p>
        </div>

        {/* Main Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#120e24]/95 border border-slate-200 dark:border-amber-500/30 shadow-2xl shadow-purple-950/40 space-y-5 backdrop-blur-2xl">
          
          {/* Role Switcher */}
          <div className="p-1 rounded-2xl bg-slate-100 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/40 grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setRole('STUDENT')}
              className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                role === 'STUDENT'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>حساب طالب</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('INSTRUCTOR')}
              className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                role === 'INSTRUCTOR'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>حساب محاضر</span>
            </button>
          </div>



          {/* Instructor Notice */}
          {role === 'INSTRUCTOR' && (
            <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/60 text-purple-200 text-xs flex items-center justify-between animate-in fade-in">
              <span className="font-semibold">فترة تجريبية 14 يوماً مجاناً مع 0% عمولة</span>
              <Link href="/instructors/join" className="text-amber-400 font-bold hover:underline shrink-0 mr-2 text-[11px]">
                تفاصيل الباقات
              </Link>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Manual Registration Form */}
          <form onSubmit={handleManualSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1.5">
                الاسم بالكامل
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="أدخل اسمك الثلاثي أو الرباعي"
                  className="w-full h-11 pr-11 pl-4 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs sm:text-sm focus:bg-white dark:focus:bg-[#1f193f] focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-all shadow-xs"
                />
                <User className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400 transition-colors pointer-events-none" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1.5">
                البريد الإلكتروني
              </label>
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full h-11 pr-11 pl-4 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs sm:text-sm focus:bg-white dark:focus:bg-[#1f193f] focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-all shadow-xs"
                />
                <Mail className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400 transition-colors pointer-events-none" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1.5">
                رقم الهاتف أو الواتساب
              </label>
              <div className="relative group">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01012345678"
                  className="w-full h-11 pr-11 pl-4 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs sm:text-sm focus:bg-white dark:focus:bg-[#1f193f] focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-all shadow-xs"
                />
                <Phone className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400 transition-colors pointer-events-none" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative group">
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="6 أحرف على الأقل"
                  className="w-full h-11 pr-11 pl-4 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs sm:text-sm focus:bg-white dark:focus:bg-[#1f193f] focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-all shadow-xs"
                />
                <Lock className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400 transition-colors pointer-events-none" />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1.5">
                تأكيد كلمة المرور
              </label>
              <div className="relative group">
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="أعد إدخال كلمة المرور"
                  className="w-full h-11 pr-11 pl-4 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs sm:text-sm focus:bg-white dark:focus:bg-[#1f193f] focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-all shadow-xs"
                />
                <KeyRound className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400 transition-colors pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-zinc-950 font-black text-base shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب والبدء الآن'}</span>
                <ArrowLeft className="w-5 h-5 text-zinc-950" />
              </button>
            </div>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors underline-offset-4 hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
