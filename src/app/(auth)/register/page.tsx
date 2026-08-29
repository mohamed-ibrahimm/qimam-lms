'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  UserPlus,
  ShieldAlert,
  Award,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Video,
  BookOpen,
  ArrowLeft,
  Briefcase
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get('role');

  const [role, setRole] = useState<'STUDENT' | 'INSTRUCTOR'>(
    initialRoleParam?.toUpperCase() === 'INSTRUCTOR' ? 'INSTRUCTOR' : 'STUDENT'
  );

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

  useEffect(() => {
    if (initialRoleParam?.toUpperCase() === 'INSTRUCTOR') {
      setRole('INSTRUCTOR');
    }
  }, [initialRoleParam]);

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
        body: JSON.stringify({
          ...formData,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'فشل التسجيل');
      } else {
        const target = data.redirectTo || (role === 'INSTRUCTOR' ? '/instructor' : '/dashboard');
        router.push(target);
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
        <div className="dynamic-drift-1 absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-purple-600/15 dark:bg-purple-600/25 rounded-full blur-[120px]" />
        <div className="dynamic-drift-2 absolute bottom-[10%] left-[15%] w-[550px] h-[550px] bg-amber-500/15 dark:bg-amber-500/20 rounded-full blur-[130px]" />
        <div className="dynamic-drift-3 absolute top-[40%] left-[5%] w-[450px] h-[450px] bg-blue-600/15 dark:bg-blue-600/20 rounded-full blur-[110px]" />
      </div>

      <div className="w-full max-w-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center mb-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-purple-600/30 blur-md" />
            <div className="relative w-14 h-14 rounded-2xl p-[2px] bg-gradient-to-tr from-amber-500 via-indigo-500 to-amber-300 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full rounded-[14px] bg-[#0c0918] flex items-center justify-center border border-amber-400/30">
                {role === 'INSTRUCTOR' ? (
                  <Video className="w-6 h-6 text-purple-400 animate-pulse" />
                ) : (
                  <GraduationCap className="w-6 h-6 text-amber-400" />
                )}
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {role === 'INSTRUCTOR' ? 'انضم كمحاضر مستقل وابدأ التدريب' : 'إنشاء حساب طالب جديد'}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-300">
            انضم الآن إلى <span className="font-bold text-amber-500 dark:text-amber-400">أكاديمية م / محمد إبراهيم</span>
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-9 rounded-3xl bg-white/95 dark:bg-[#120e24]/95 border border-slate-200/90 dark:border-amber-500/30 shadow-2xl shadow-purple-950/40 space-y-6 backdrop-blur-2xl">
          
          {/* STEP 1: CHOOSE ACCOUNT TYPE (ROLE SELECTOR) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-slate-800 dark:text-zinc-200">
                اختر نوع الحساب الذي ترغب في إنشائه:
              </label>
              {role === 'INSTRUCTOR' && (
                <Link
                  href="/instructors/join"
                  className="text-[11px] font-bold text-amber-600 dark:text-amber-300 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>تفاصيل عروض المحاضرين 🏷️</span>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Student Card */}
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 relative overflow-hidden group cursor-pointer ${
                  role === 'STUDENT'
                    ? 'bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-transparent border-blue-500 shadow-lg shadow-blue-900/30 ring-2 ring-blue-500/50'
                    : 'bg-slate-50 dark:bg-[#181330] border-slate-200 dark:border-zinc-800 hover:border-blue-400/50 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  {role === 'STUDENT' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3 h-3" /> تم الاختيار
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[10px] font-bold">
                      طالب
                    </span>
                  )}
                </div>

                <div className="space-y-0.5 text-right">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">أنا طالب (Student)</h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-snug">
                    للتسجيل في الدورات، متابعة الدروس، ونيل شهادات التخرج المعتمدة.
                  </p>
                </div>
              </button>

              {/* Instructor Card */}
              <button
                type="button"
                onClick={() => setRole('INSTRUCTOR')}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 relative overflow-hidden group cursor-pointer ${
                  role === 'INSTRUCTOR'
                    ? 'bg-gradient-to-br from-purple-500/25 via-pink-500/15 to-transparent border-purple-500 shadow-lg shadow-purple-900/40 ring-2 ring-purple-500/60'
                    : 'bg-slate-50 dark:bg-[#181330] border-slate-200 dark:border-zinc-800 hover:border-purple-400/50 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  {role === 'INSTRUCTOR' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3 h-3" /> تم الاختيار
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-bold border border-amber-500/40">
                      14 يوم مجاناً 🚀
                    </span>
                  )}
                </div>

                <div className="space-y-0.5 text-right">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">أنا محاضر / مدرب (Instructor)</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-snug">
                    لإنشاء ونشر كورساتك واستلام أرباحك على انستاباي وكاش مباشرة (0% عمولة).
                  </p>
                </div>
              </button>
            </div>

            {/* Tempting Instructor Offer Notice */}
            {role === 'INSTRUCTOR' && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-500/40 text-purple-200 text-xs flex items-start gap-2.5 animate-in fade-in shadow-inner">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-white">🔥 عرض الإطلاق الحصري للمحاضرين:</span>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    ستحصل تلقائياً على <strong className="text-amber-400">14 يوماً تجربة مجانية كاملة</strong> لرفع دوراتك، مع <strong className="text-emerald-400">0% عمولة</strong> على المبيعات وتحويل مباشر على InstaPay وفودافون كاش!
                  </p>
                </div>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1.5">الاسم الأول *</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="أحمد"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:bg-white dark:focus:bg-[#1f193f] focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-all shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1.5">اسم الأب</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="مصطفى"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:bg-white dark:focus:bg-[#1f193f] focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-all shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1.5">اسم العائلة *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="إبراهيم"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:bg-white dark:focus:bg-[#1f193f] focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Official Full Name for Certificates (Students Only) */}
          {role === 'STUDENT' && (
            <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 dark:text-blue-300">
                <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>الاسم الرسمي الكامل (الذي سيظهر على الشهادات المعتمدة):</span>
              </div>
              <input
                type="text"
                name="officialFullName"
                required={role === 'STUDENT'}
                value={formData.officialFullName}
                onChange={handleChange}
                placeholder="الاسم الرباعي الرسمي للشهادات"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181330] border border-blue-200 dark:border-blue-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-semibold focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 shadow-xs"
              />
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                يرجى كتابة اسمك بدقة كما ترغب أن يظهر في وثيقة التخرج والشهادة الرسمية.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1.5">اسم المستخدم (Username) *</label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="ahmed_dev"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:bg-white dark:focus:bg-[#1f193f] focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-all shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1.5">رقم الهاتف (واتساب)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01012345678"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:bg-white dark:focus:bg-[#1f193f] focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-all shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1.5">البريد الإلكتروني *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:bg-white dark:focus:bg-[#1f193f] focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-all shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1.5">كلمة المرور *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:bg-white dark:focus:bg-[#1f193f] focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-all shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1.5">تأكيد كلمة المرور *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181330] border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:bg-white dark:focus:bg-[#1f193f] focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Dynamic CTA Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-13 rounded-2xl text-white font-black text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-xl ${
              role === 'INSTRUCTOR'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 shadow-purple-900/50'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-zinc-950 shadow-amber-500/30'
            }`}
          >
            {role === 'INSTRUCTOR' ? (
              <>
                <Video className="w-5 h-5 text-white" />
                <span>{loading ? 'جاري إنشاء حساب المحاضر...' : 'إنشاء حساب محاضر وبدء الفترة التجريبية (14 يوماً مجاناً) 🚀'}</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-5 h-5 text-zinc-950" />
                <span className="text-zinc-950">{loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب طالب وبدء التعلم 🎓'}</span>
              </>
            )}
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
