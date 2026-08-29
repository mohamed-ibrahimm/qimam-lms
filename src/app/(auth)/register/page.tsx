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
import SocialAccountChooserModal from '@/components/SocialAccountChooserModal';

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

  // Social Connect Modal State
  const [socialModalProvider, setSocialModalProvider] = useState<'google' | 'github' | 'facebook' | null>(null);
  const [socialEmail, setSocialEmail] = useState('');
  const [socialFullName, setSocialFullName] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialError, setSocialError] = useState('');

  useEffect(() => {
    if (initialRoleParam?.toUpperCase() === 'INSTRUCTOR') {
      setRole('INSTRUCTOR');
    }
  }, [initialRoleParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Social Connection
  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialModalProvider) return;

    setSocialLoading(true);
    setSocialError('');

    try {
      const res = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: socialModalProvider,
          role,
          email: socialEmail.trim() || undefined,
          name: socialFullName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSocialError(data.error || 'تعذر الربط بالحساب، يرجى المحاولة لاحقاً');
      } else {
        router.push(data.redirectTo || (role === 'INSTRUCTOR' ? '/instructor' : '/dashboard'));
        router.refresh();
      }
    } catch {
      setSocialError('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setSocialLoading(false);
    }
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

          {/* Prominent Google & Social Sign-Up (Matching User's Screenshot) */}
          <div className="space-y-2.5 pt-1">
            {/* Primary Google Button */}
            <button
              type="button"
              onClick={() => {
                setSocialModalProvider('google');
                setSocialError('');
              }}
              className="w-full h-12 rounded-2xl bg-white hover:bg-slate-50 dark:bg-[#181330] dark:hover:bg-[#1f193f] border border-slate-300 dark:border-purple-900/80 flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-100 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-sm hover:shadow-md"
              title="Sign up with Google"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>تسجيل بواسطة حساب Google</span>
            </button>

            {/* Secondary GitHub & Facebook Options */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSocialModalProvider('github');
                  setSocialError('');
                }}
                className="h-10 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#181330] dark:hover:bg-[#1f193f] border border-slate-200 dark:border-purple-900/60 flex items-center justify-center gap-2 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xs"
                title="إنشاء حساب من خلال GitHub"
              >
                <svg className="w-4 h-4 shrink-0 fill-current text-slate-800 dark:text-white" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>جيت هاب</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSocialModalProvider('facebook');
                  setSocialError('');
                }}
                className="h-10 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#181330] dark:hover:bg-[#1f193f] border border-slate-200 dark:border-purple-900/60 flex items-center justify-center gap-2 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xs"
                title="إنشاء حساب من خلال Facebook"
              >
                <svg className="w-4 h-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>فيسبوك</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center pt-2 pb-1">
              <div className="border-t border-slate-200 dark:border-purple-900/50 w-full" />
              <span className="bg-white dark:bg-[#120e24] px-3 text-[11px] font-semibold text-slate-400 dark:text-zinc-500 whitespace-nowrap absolute">
                أو التسجيل اليدوي بالبيانات
              </span>
            </div>
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

      {/* Social Account Chooser Modal */}
      {socialModalProvider && (
        <SocialAccountChooserModal
          provider={socialModalProvider}
          role={role}
          onClose={() => setSocialModalProvider(null)}
          onSuccess={(target) => {
            router.push(target);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
