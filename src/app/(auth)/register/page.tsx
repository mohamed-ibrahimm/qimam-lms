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
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-[2px] shadow-lg shadow-amber-950/60 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-[#0c0918] rounded-[14px] flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white">إنشاء حساب جديد</h1>
          <p className="text-xs font-bold text-amber-300">
            أكاديمية المهندس محمد إبراهيم
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-surface border border-amber-500/20 shadow-2xl space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">الاسم الأول *</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="أحمد"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">اسم الأب</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="مصطفى"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">اسم العائلة *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="إبراهيم"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
              <Award className="w-4 h-4" />
              <span>الاسم الرسمي الكامل (الذي سيظهر على الشهادات المعتمدة):</span>
            </div>
            <input
              type="text"
              name="officialFullName"
              required
              value={formData.officialFullName}
              onChange={handleChange}
              placeholder="الاسم الرباعي الرسمي للشهادات"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-card border border-purple-900 text-purple-100 text-sm font-semibold focus:outline-none focus:border-primary-400"
            />
            <p className="text-[11px] text-zinc-400">يرجى كتابة اسمك بدقة كما ترغب أن يظهر في وثيقة التخرج والشهادة الرسمية.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">اسم المستخدم (Username) *</label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="ahmed_dev"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">رقم الهاتف (واتساب)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01012345678"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">البريد الإلكتروني *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">كلمة المرور *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">تأكيد كلمة المرور *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-sm shadow-xl shadow-amber-950/40 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'جاري إنشاء الحساب...' : (
              <>
                <UserPlus className="w-4 h-4" />
                إنشاء الحساب وبدء التعلم
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-400">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="font-bold text-amber-400 hover:text-amber-300">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}