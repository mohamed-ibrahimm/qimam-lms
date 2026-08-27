'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Save, ShieldCheck, CreditCard, Mail, Bot, Smartphone, MessageCircle, Facebook, Send, Youtube, Linkedin } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => setSettings(data.settings || {}))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage('تم حفظ وتحديث إعدادات المنصة وقنوات التواصل بنجاح! ✅');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('platform-settings-updated', { detail: settings }));
        }
        router.refresh();
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (e) {
      setMessage('حدث خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-zinc-400">جاري تحميل الإعدادات...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Settings className="w-7 h-7 text-primary-400" />
            إعدادات المنصة وقنوات التواصل والدفع
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            إدارة أرقام الواتساب، الجيميل، الفيسبوك، حسابات InstaPay، فودافون كاش، والعلامة المائية
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
          <h3 className="text-sm font-bold text-white">الهوية والبيانات العامة</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">اسم المنصة الرسمي</label>
              <input
                type="text"
                value={settings.PLATFORM_NAME || ''}
                onChange={(e) => handleChange('PLATFORM_NAME', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">الشعار التسويقي (Tagline)</label>
              <input
                type="text"
                value={settings.PLATFORM_TAGLINE || ''}
                onChange={(e) => handleChange('PLATFORM_TAGLINE', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Quick Contact & Social Media Channels (Show in Front-end) */}
        <div className="p-6 rounded-3xl bg-surface border border-cyan-900/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
              <MessageCircle className="w-4 h-4" />
              <span>قنوات التواصل السريع وروابط السوشيال ميديا (تظهر فورياً في واجهة الموقع)</span>
            </div>
            <span className="text-[10px] text-zinc-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.08] w-fit">
              الخانة الفارغة تختفي تلقائياً من الواجهة
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            أدخل أرقامك وحساباتك لتظهر كأيقونات تواصل مباشر للزوار والطلاب في واجهة الموقع (Hero Section) وشريط التواصل وأسفل الموقع.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>رقم الواتساب للتواصل المباشر (WhatsApp)</span>
              </label>
              <input
                type="text"
                placeholder="مثال: 01012345678 أو 201012345678"
                value={settings.WHATSAPP_NUMBER || ''}
                onChange={(e) => handleChange('WHATSAPP_NUMBER', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-emerald-900/40 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">يفتح محادثة واتساب فورية مباشرة مع الزائر</span>
            </div>

            {/* Email / Gmail */}
            <div>
              <label className="block text-xs font-semibold text-rose-400 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>البريد الإلكتروني / الجيميل (Gmail / Email)</span>
              </label>
              <input
                type="email"
                placeholder="مثال: yourname@gmail.com"
                value={settings.CONTACT_EMAIL || ''}
                onChange={(e) => handleChange('CONTACT_EMAIL', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-rose-900/40 text-white text-xs font-mono focus:outline-none focus:border-rose-500"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">يفتح إرسال بريد إلكتروني مباشر</span>
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-xs font-semibold text-blue-400 mb-1 flex items-center gap-1.5">
                <Facebook className="w-3.5 h-3.5" />
                <span>رابط صفحة أو حساب الفيسبوك (Facebook URL)</span>
              </label>
              <input
                type="text"
                placeholder="مثال: https://facebook.com/yourprofile"
                value={settings.FACEBOOK_URL || ''}
                onChange={(e) => handleChange('FACEBOOK_URL', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-blue-900/40 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Telegram */}
            <div>
              <label className="block text-xs font-semibold text-sky-400 mb-1 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>رابط قناة أو حساب التليجرام (Telegram)</span>
              </label>
              <input
                type="text"
                placeholder="مثال: https://t.me/yourchannel"
                value={settings.TELEGRAM_URL || ''}
                onChange={(e) => handleChange('TELEGRAM_URL', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-sky-900/40 text-white text-xs font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* YouTube */}
            <div>
              <label className="block text-xs font-semibold text-red-400 mb-1 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5" />
                <span>رابط قناة اليوتيوب (YouTube)</span>
              </label>
              <input
                type="text"
                placeholder="مثال: https://youtube.com/@yourchannel"
                value={settings.YOUTUBE_URL || ''}
                onChange={(e) => handleChange('YOUTUBE_URL', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-red-900/40 text-white text-xs font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-xs font-semibold text-indigo-400 mb-1 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5" />
                <span>رابط حساب لينكد إن (LinkedIn)</span>
              </label>
              <input
                type="text"
                placeholder="مثال: https://linkedin.com/in/yourprofile"
                value={settings.LINKEDIN_URL || ''}
                onChange={(e) => handleChange('LINKEDIN_URL', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-indigo-900/40 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* InstaPay Settings */}
        <div className="p-6 rounded-3xl bg-surface border border-purple-900/40 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
            <CreditCard className="w-4 h-4" />
            <span>إعدادات إنستاباي (InstaPay IPN)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">عنوان الدفع (InstaPay Account)</label>
              <input
                type="text"
                value={settings.INSTAPAY_ACCOUNT || ''}
                onChange={(e) => handleChange('INSTAPAY_ACCOUNT', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs font-mono focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">الاسم المعتمد في التحويل</label>
              <input
                type="text"
                value={settings.INSTAPAY_NAME || ''}
                onChange={(e) => handleChange('INSTAPAY_NAME', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">تعليمات التحويل للطلاب</label>
            <textarea
              rows={2}
              value={settings.INSTAPAY_INSTRUCTIONS || ''}
              onChange={(e) => handleChange('INSTAPAY_INSTRUCTIONS', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Vodafone Cash Settings */}
        <div className="p-6 rounded-3xl bg-surface border border-rose-900/40 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-rose-400">
            <Smartphone className="w-4 h-4" />
            <span>إعدادات فودافون كاش (Vodafone Cash)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">رقم محفظة فودافون كاش</label>
              <input
                type="text"
                value={settings.VODAFONE_CASH_NUMBER || ''}
                onChange={(e) => handleChange('VODAFONE_CASH_NUMBER', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs font-mono focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">اسم صاحب المحفظة</label>
              <input
                type="text"
                value={settings.VODAFONE_CASH_NAME || ''}
                onChange={(e) => handleChange('VODAFONE_CASH_NAME', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">تعليمات التحويل للطلاب</label>
            <textarea
              rows={2}
              value={settings.VODAFONE_CASH_INSTRUCTIONS || ''}
              onChange={(e) => handleChange('VODAFONE_CASH_INSTRUCTIONS', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Security & Completion Settings */}
        <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
          <h3 className="text-sm font-bold text-white">إعدادات الأمان ونسبة إنجاز الدروس</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                نسبة المشاهدة لاحتساب الدرس مكتملاً (%)
              </label>
              <select
                value={settings.LESSON_COMPLETION_THRESHOLD || '80'}
                onChange={(e) => handleChange('LESSON_COMPLETION_THRESHOLD', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              >
                <option value="80">80% من مدة الفيديو</option>
                <option value="90">90% من مدة الفيديو</option>
                <option value="100">100% (مشاهدة كاملة)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">العلامة المائية على الفيديو</label>
              <select
                value={settings.WATERMARK_ENABLED || 'true'}
                onChange={(e) => handleChange('WATERMARK_ENABLED', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              >
                <option value="true">مفعلة (إظهار اسم الطالب وبريده المشفر)</option>
                <option value="false">معطلة</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-primary-900/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}