'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Settings,
  Save,
  ShieldCheck,
  CreditCard,
  Mail,
  Bot,
  Smartphone,
  MessageCircle,
  Facebook,
  Send,
  Youtube,
  Linkedin,
  Tag,
  DollarSign,
  GraduationCap,
  Building,
  Type,
  FileText,
  Percent,
  Calendar,
  Layers,
  Sparkles,
  Megaphone,
  CheckCircle2,
  Lock,
  Globe,
  HelpCircle,
  SlidersHorizontal,
  Compass,
  Check,
  Award,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'all' | 'pricing' | 'content' | 'contacts' | 'payments' | 'workflow'>(
    (requestedTab as any) || 'pricing'
  );

  useEffect(() => {
    if (requestedTab && ['pricing', 'content', 'contacts', 'payments', 'workflow', 'all'].includes(requestedTab)) {
      setActiveTab(requestedTab as any);
    }
  }, [requestedTab]);

  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetch('/api/admin/settings', {
      credentials: 'include',
      cache: 'no-store',
    })
      .then((r) => r.json())
      .then((data) => setSettings(data.settings || {}))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessageType('success');
        setMessage('تم حفظ وتحديث كافة أسعار الباقات ونصوص المنصة والإعدادات بنجاح!');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('platform-settings-updated', { detail: settings }));
          localStorage.setItem('platform_name', settings.PLATFORM_NAME || '');
        }
        router.refresh();
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessageType('error');
        setMessage(data.error || 'فشل حفظ الإعدادات، يرجى التحقق من الصلاحيات.');
      }
    } catch (e) {
      setMessageType('error');
      setMessage('حدث خطأ في الاتصال بالخادم، يرجى المحاولة ثانية.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 dark:text-zinc-400 font-bold">جاري تحميل إعدادات المنصة والأسعار...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'pricing', label: 'أسعار الباقات (SaaS)', icon: DollarSign, badge: 'SaaS' },
    { id: 'content', label: 'محرر نصوص الصفحات', icon: Type, badge: 'CMS' },
    { id: 'contacts', label: 'الهوية والسوشيال', icon: MessageCircle },
    { id: 'payments', label: 'حسابات الدفع والمحافظ', icon: CreditCard },
    { id: 'workflow', label: 'الأمان والشهادات', icon: ShieldCheck },
    { id: 'all', label: 'كافة الإعدادات', icon: Layers },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 text-slate-900 dark:text-slate-100">
      
      {/* =========================================================================
          HEADER & SAVE ACTION
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#120d24] border border-slate-200 dark:border-amber-500/30 shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>لوحة التحكم الشاملة لإدارة المنصة</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            إعدادات المنصة وأسعار الباقات ومحرر النصوص
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            تحكم كامل بأسعار باقات المدرسين والطلبة، وتعديل أي كلمة أو عنوان يظهر في أي صفحة على المنصة لحظياً.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'جاري الحفظ...' : 'حفظ كافة التعديلات'}</span>
        </button>
      </div>

      {/* Notification Toast */}
      {message && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 ${
          messageType === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 shadow-md'
            : 'bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 shadow-md'
        }`}>
          <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-500" />
          <span>{message}</span>
        </div>
      )}

      {/* =========================================================================
          RESPONSIVE LUXURY TABS NAVIGATION
         ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 rounded-3xl bg-slate-100 dark:bg-[#0c0918] border border-slate-200 dark:border-zinc-800 shadow-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-black'
                  : 'bg-white dark:bg-zinc-900/60 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white border border-slate-200/60 dark:border-zinc-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-zinc-950' : 'text-amber-500'}`} />
              <span className="truncate">{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-zinc-950 text-amber-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          FORM SECTIONS
         ========================================================================= */}
      <form onSubmit={handleSave} className="space-y-6">

        {/* =========================================================================
            TAB 1: PRICING & SUBSCRIPTION PACKAGES
           ========================================================================= */}
        {(activeTab === 'pricing' || activeTab === 'all') && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#120d24] border border-slate-200 dark:border-amber-500/30 shadow-xl space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-sm font-black text-amber-700 dark:text-amber-400">
                <DollarSign className="w-5 h-5 text-amber-500" />
                <span>التحكم في أسعار باقات واشتراكات استوديو المحاضرين (SaaS Pricing)</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                تطبق الأسعار فورياً في صفحة الانضمام والاستوديو وبوابة الدفع
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Regular Monthly Price */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b0816] border border-purple-200 dark:border-purple-900/40 space-y-2.5 shadow-sm">
                <label className="block text-xs font-black text-slate-900 dark:text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    باقة المدرس (الاشتراك الشهري)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold">شهرياً</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={settings.INSTRUCTOR_PRICE_MONTHLY ?? '290'}
                    onChange={(e) => handleChange('INSTRUCTOR_PRICE_MONTHLY', e.target.value)}
                    placeholder="290"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-purple-900/60 text-slate-900 dark:text-white text-base font-mono font-black focus:outline-none focus:border-purple-500 shadow-inner"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 dark:text-zinc-400 font-bold">ج.م / شهر</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  قيمة التجديد الشهري للمدرس أو الدكتور الجامعي (الافتراضي: 290 ج.م)
                </p>
              </div>

              {/* Regular Annual Price */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b0816] border border-indigo-200 dark:border-indigo-900/40 space-y-2.5 shadow-sm">
                <label className="block text-xs font-black text-slate-900 dark:text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    باقة المدرس (الاشتراك السنوي)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-black">وفر شهرين</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={settings.INSTRUCTOR_PRICE_ANNUAL ?? '1499'}
                    onChange={(e) => handleChange('INSTRUCTOR_PRICE_ANNUAL', e.target.value)}
                    placeholder="1499"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white text-base font-mono font-black focus:outline-none focus:border-indigo-500 shadow-inner"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 dark:text-zinc-400 font-bold">ج.م / سنة</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  سعر الاشتراك السنوي الكامل (الافتراضي: 1,499 ج.م)
                </p>
              </div>

              {/* Student Plan Price */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-[#0e0914] border-2 border-amber-300 dark:border-amber-500/40 space-y-2.5 shadow-sm">
                <label className="block text-xs font-black text-slate-900 dark:text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-amber-500" />
                    باقة المحاضر الطالب (المدعومة)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-black">منحة مخفضة</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={settings.INSTRUCTOR_PRICE_STUDENT ?? '120'}
                    onChange={(e) => handleChange('INSTRUCTOR_PRICE_STUDENT', e.target.value)}
                    placeholder="120"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-amber-300 dark:border-amber-500/50 text-slate-900 dark:text-white text-base font-mono font-black focus:outline-none focus:border-amber-500 shadow-inner"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 dark:text-zinc-400 font-bold">ج.م / شهر</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  السعر المدعوم لطلبة الجامعات والمدارس بعد انتهاء الشهر المجاني (الافتراضي: 120 ج.م)
                </p>
              </div>

              {/* Student Free Trial Duration */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b0816] border border-slate-200 dark:border-zinc-800 space-y-2.5 shadow-sm">
                <label className="block text-xs font-black text-slate-900 dark:text-white flex items-center justify-between">
                  <span>أيام التجربة المجانية للطالب</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">منحة مجانية</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={settings.STUDENT_TRIAL_DAYS ?? '30'}
                    onChange={(e) => handleChange('STUDENT_TRIAL_DAYS', e.target.value)}
                    placeholder="30"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-base font-mono font-black focus:outline-none focus:border-amber-500 shadow-inner"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 dark:text-zinc-400 font-bold">يوم</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  فترة التجربة الكاملة للطالب فور تسجيله وتوثيق دراسته (الافتراضي: 30 يوماً)
                </p>
              </div>

              {/* Regular Instructor Free Trial Duration */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b0816] border border-slate-200 dark:border-zinc-800 space-y-2.5 shadow-sm">
                <label className="block text-xs font-black text-slate-900 dark:text-white flex items-center justify-between">
                  <span>أيام التجربة المجانية للمدرس والدكتور</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold">تجربة مجانية</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.INSTRUCTOR_TRIAL_DAYS ?? '14'}
                    onChange={(e) => handleChange('INSTRUCTOR_TRIAL_DAYS', e.target.value)}
                    placeholder="14"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-base font-mono font-black focus:outline-none focus:border-purple-500 shadow-inner"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 dark:text-zinc-400 font-bold">يوم</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  فترة التجربة الأولية لكبار المدرسين والدكاترة (الافتراضي: 14 يوماً)
                </p>
              </div>

              {/* Student Maximum Age */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b0816] border border-slate-200 dark:border-zinc-800 space-y-2.5 shadow-sm">
                <label className="block text-xs font-black text-slate-900 dark:text-white flex items-center justify-between">
                  <span>الحد الأقصى لسن باقة الطالب</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400">شرط العمر</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="16"
                    max="35"
                    value={settings.STUDENT_MAX_AGE ?? '22'}
                    onChange={(e) => handleChange('STUDENT_MAX_AGE', e.target.value)}
                    placeholder="22"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-base font-mono font-black focus:outline-none focus:border-amber-500 shadow-inner"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 dark:text-zinc-400 font-bold">سنة</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  أي مستخدم يتجاوز هذا السن يُمنع من تفعيل باقة الطالب ويُلزم بالباقة العادية
                </p>
              </div>

              {/* Platform Commission Percent */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b0816] border border-slate-200 dark:border-zinc-800 space-y-2.5 shadow-sm">
                <label className="block text-xs font-black text-slate-900 dark:text-white flex items-center justify-between">
                  <span>عمولة المنصة على مبيعات المحاضرين</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-black">0% نموذج قمم</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={settings.PLATFORM_COMMISSION_PERCENT ?? '0'}
                    onChange={(e) => handleChange('PLATFORM_COMMISSION_PERCENT', e.target.value)}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-base font-mono font-black focus:outline-none focus:border-emerald-500 shadow-inner"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 dark:text-zinc-400 font-bold">%</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  النسبة المقتطعة من مبيعات كورسات المحاضر (موصى بها: 0% كأقوى ميزة تنافسية)
                </p>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: CMS - CONTROL ALL PAGE TEXTS & HEADLINES
           ========================================================================= */}
        {(activeTab === 'content' || activeTab === 'all') && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#120d24] border border-slate-200 dark:border-amber-500/30 shadow-xl space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-sm font-black text-purple-700 dark:text-purple-400">
                <Type className="w-5 h-5 text-purple-500" />
                <span>التحكم في كلام ونصوص أي صفحة في المنصة (Platform Pages CMS)</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                أي نص تدخله هنا يظهر فورياً في واجهة المنصة للزوار والطلاب
              </span>
            </div>

            {/* Homepage & Hero Section Texts */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0b0816] border border-slate-200 dark:border-zinc-800 space-y-4">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <Compass className="w-4 h-4" />
                نصوص الصفحة الرئيسية (Hero Section & Homepage)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                    العنوان الرئيسي في الصفحة الأولى (Main Hero Headline)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: نحو مستقبل برمجي وهندسي احترافي"
                    value={settings.HERO_TITLE || ''}
                    onChange={(e) => handleChange('HERO_TITLE', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 block">اتركه فارغاً لاستخدام العنوان التلقائي الافتراضي</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                    النص الوصفي تحت العنوان الرئيسي (Hero Subtitle)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="أكاديمية تعليمية متكاملة تقدم دورات احترافية ودبلومات شاملة..."
                    value={settings.HERO_SUBTITLE || ''}
                    onChange={(e) => handleChange('HERO_SUBTITLE', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                    نص زر المدرس أو الدكتور الجامعي بالهيرو
                  </label>
                  <input
                    type="text"
                    value={settings.HERO_BTN_EXPERT || 'انضم كـ مدرس أو دكتور جامعي (0% عمولة)'}
                    onChange={(e) => handleChange('HERO_BTN_EXPERT', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                    نص زر المحاضر الطالب بالهيرو
                  </label>
                  <input
                    type="text"
                    value={settings.HERO_BTN_STUDENT || 'اشترك كمحاضر طالب (شهر كامل مجاناً)'}
                    onChange={(e) => handleChange('HERO_BTN_STUDENT', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Promotional Top Banner */}
                <div className="sm:col-span-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Megaphone className="w-3.5 h-3.5 text-amber-500" />
                      <span>نص شريط الإعلانات الترويجي في أعلى الموقع (Announcement Bar)</span>
                    </label>
                    <select
                      value={settings.BANNER_ENABLED || 'true'}
                      onChange={(e) => handleChange('BANNER_ENABLED', e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-900 dark:text-white"
                    >
                      <option value="true">مفعل (يظهر بأعلى الموقع)</option>
                      <option value="false">معطل (مخفي)</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="مثال: خصم استثنائي 50% لفترة محدودة على جميع المسارات الهندسية"
                    value={settings.BANNER_TEXT || ''}
                    onChange={(e) => handleChange('BANNER_TEXT', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Instructors Join Page Texts (/instructors/join) */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0b0816] border border-slate-200 dark:border-zinc-800 space-y-4">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                نصوص صفحة انضمام المحاضرين والباقات (/instructors/join)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                    عنوان كارت المدرس والدكتور الجامعي
                  </label>
                  <input
                    type="text"
                    value={settings.JOIN_EXPERT_CARD_TITLE || 'انضم كـ مدرس أو دكتور جامعي'}
                    onChange={(e) => handleChange('JOIN_EXPERT_CARD_TITLE', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                    عنوان كارت المحاضر الطالب
                  </label>
                  <input
                    type="text"
                    value={settings.JOIN_STUDENT_CARD_TITLE || 'اشترك كـ محاضر طالب'}
                    onChange={(e) => handleChange('JOIN_STUDENT_CARD_TITLE', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                    نص وصف كارت المدرس والدكتور
                  </label>
                  <textarea
                    rows={2}
                    value={settings.JOIN_EXPERT_CARD_DESC || 'مخصص للأساتذة والمحاضرين الذين يرغبون في بناء استوديو تعليمي سحابي مستقل لدفعاتهم مع سيطرة كاملة على المحتوى والأسعار.'}
                    onChange={(e) => handleChange('JOIN_EXPERT_CARD_DESC', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                    نص وصف كارت المحاضر الطالب
                  </label>
                  <textarea
                    rows={2}
                    value={settings.JOIN_STUDENT_CARD_DESC || 'لكل طالب بالكلية أو المدرسة يريد شرح المواد لزملائه؛ نمنحك شهر كامل مجاناً وشارة "طالب معتمد" مع باقة اشتراك مدعومة ومخفضة.'}
                    onChange={(e) => handleChange('JOIN_STUDENT_CARD_DESC', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                    نص شروط إثبات الدراسة الميسرة للطالب
                  </label>
                  <input
                    type="text"
                    value={settings.JOIN_STUDENT_PROOF_TEXT || 'كارنيه كلية أو مدرسة، جدول المحاضرات أو الحصص، أو إثبات قيد للعام الحالي دون الحاجة لبطاقة شخصية'}
                    onChange={(e) => handleChange('JOIN_STUDENT_PROOF_TEXT', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Navigation & Footer Texts */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0b0816] border border-slate-200 dark:border-zinc-800 space-y-4">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                نصوص الهيدر العلوي والفوتر (Header & Footer)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                    نص زر المدرس في شريط الهيدر
                  </label>
                  <input
                    type="text"
                    value={settings.NAV_EXPERT_BTN_TEXT || 'انضم كـ محاضر'}
                    onChange={(e) => handleChange('NAV_EXPERT_BTN_TEXT', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                    نص زر الطالب في شريط الهيدر
                  </label>
                  <input
                    type="text"
                    value={settings.NAV_STUDENT_BTN_TEXT || 'انضم كـ محاضر طالب'}
                    onChange={(e) => handleChange('NAV_STUDENT_BTN_TEXT', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                    نص حقوق الملكية في أسفل الموقع (Footer Copyright)
                  </label>
                  <input
                    type="text"
                    placeholder="جميع الحقوق محفوظة © أكاديمية قمم"
                    value={settings.FOOTER_COPYRIGHT || ''}
                    onChange={(e) => handleChange('FOOTER_COPYRIGHT', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: IDENTITY & SOCIAL CHANNELS
           ========================================================================= */}
        {(activeTab === 'contacts' || activeTab === 'all') && (
          <div className="space-y-6 animate-in fade-in">
            {/* Identity */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#120d24] border border-slate-200 dark:border-amber-500/30 shadow-xl space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-500" />
                <span>الهوية والبيانات العامة للمنصة</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">اسم المنصة الرسمي</label>
                  <input
                    type="text"
                    value={settings.PLATFORM_NAME || ''}
                    onChange={(e) => handleChange('PLATFORM_NAME', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">الشعار التسويقي (Tagline)</label>
                  <input
                    type="text"
                    value={settings.PLATFORM_TAGLINE || ''}
                    onChange={(e) => handleChange('PLATFORM_TAGLINE', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Quick Contact & Social Media Channels */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#120d24] border border-slate-200 dark:border-amber-500/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-black text-amber-700 dark:text-amber-400">
                  <MessageCircle className="w-4 h-4 text-amber-500" />
                  <span>قنوات التواصل السريع وروابط السوشيال ميديا</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-white/[0.04] px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/[0.08] w-fit font-bold">
                  الخانة الفارغة تختفي تلقائياً من الواجهة
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>رقم الواتساب للتواصل المباشر (WhatsApp)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 01555791568"
                    value={settings.WHATSAPP_NUMBER || ''}
                    onChange={(e) => handleChange('WHATSAPP_NUMBER', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Telegram */}
                <div>
                  <label className="block text-xs font-bold text-sky-600 dark:text-sky-400 mb-1 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    <span>رابط قناة أو جروب التليجرام (Telegram)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: https://t.me/qimam_academy"
                    value={settings.TELEGRAM_URL || ''}
                    onChange={(e) => handleChange('TELEGRAM_URL', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Facebook */}
                <div>
                  <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
                    <Facebook className="w-3.5 h-3.5" />
                    <span>رابط صفحة الفيسبوك (Facebook Page)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: https://facebook.com/qimam"
                    value={settings.FACEBOOK_URL || ''}
                    onChange={(e) => handleChange('FACEBOOK_URL', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* YouTube */}
                <div>
                  <label className="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1.5">
                    <Youtube className="w-3.5 h-3.5" />
                    <span>رابط قناة اليوتيوب (YouTube Channel)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: https://youtube.com/@qimam"
                    value={settings.YOUTUBE_URL || ''}
                    onChange={(e) => handleChange('YOUTUBE_URL', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block text-xs font-bold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>رابط صفحة لينكد إن (LinkedIn)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: https://linkedin.com/company/qimam"
                    value={settings.LINKEDIN_URL || ''}
                    onChange={(e) => handleChange('LINKEDIN_URL', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>البريد الإلكتروني الرسمي للدعم والمراسلات</span>
                  </label>
                  <input
                    type="email"
                    placeholder="support@qimam.com"
                    value={settings.CONTACT_EMAIL || ''}
                    onChange={(e) => handleChange('CONTACT_EMAIL', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: PAYMENT GATEWAYS
           ========================================================================= */}
        {(activeTab === 'payments' || activeTab === 'all') && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#120d24] border border-slate-200 dark:border-amber-500/30 shadow-xl space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 text-sm font-black text-amber-700 dark:text-amber-400 pb-4 border-b border-slate-200 dark:border-zinc-800">
              <CreditCard className="w-5 h-5 text-amber-500" />
              <span>إعدادات الدفع المباشر والمحافظ (InstaPay & Vodafone Cash)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b0816] border border-slate-200 dark:border-zinc-800 space-y-2">
                <label className="block text-xs font-bold text-slate-900 dark:text-white">
                  معرف إنستاباي للمنصة (InstaPay IPA / Username)
                </label>
                <input
                  type="text"
                  placeholder="مثال: qimam@instapay"
                  value={settings.INSTAPAY_USERNAME || ''}
                  onChange={(e) => handleChange('INSTAPAY_USERNAME', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b0816] border border-slate-200 dark:border-zinc-800 space-y-2">
                <label className="block text-xs font-bold text-slate-900 dark:text-white">
                  رقم فودافون كاش / المحافظ الإلكترونية للمنصة
                </label>
                <input
                  type="text"
                  placeholder="مثال: 01012345678"
                  value={settings.VODAFONE_CASH_NUMBER || ''}
                  onChange={(e) => handleChange('VODAFONE_CASH_NUMBER', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: LEARNING WORKFLOW & SECURITY
           ========================================================================= */}
        {(activeTab === 'workflow' || activeTab === 'all') && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#120d24] border border-slate-200 dark:border-amber-500/30 shadow-xl space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 text-sm font-black text-amber-700 dark:text-amber-400 pb-4 border-b border-slate-200 dark:border-zinc-800">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <span>إعدادات مسار التعلم وحماية الفيديوهات بالعلامة المائية</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b0816] border border-slate-200 dark:border-zinc-800 space-y-2">
                <label className="block text-xs font-bold text-slate-900 dark:text-white">
                  العلامة المائية الديناميكية المتحركة على مشغل الفيديو
                </label>
                <select
                  value={settings.DYNAMIC_WATERMARK_ENABLED || 'true'}
                  onChange={(e) => handleChange('DYNAMIC_WATERMARK_ENABLED', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-bold"
                >
                  <option value="true">مفعلة (طباعة اسم الطالب والبريد ورقم الهاتف لمنع التسريب)</option>
                  <option value="false">معطلة</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b0816] border border-slate-200 dark:border-zinc-800 space-y-2">
                <label className="block text-xs font-bold text-slate-900 dark:text-white">
                  إلزام الطالب بمشاهدة الدروس بالترتيب المتسلسل
                </label>
                <select
                  value={settings.SEQUENTIAL_LESSON_LOCK || 'false'}
                  onChange={(e) => handleChange('SEQUENTIAL_LESSON_LOCK', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-bold"
                >
                  <option value="false">معطل (حرية التنقل بين الدروس)</option>
                  <option value="true">مفعل (قفل كل درس حتى إتمام الدرس السابق)</option>
                </select>
              </div>
            </div>
          </div>
        )}

      </form>

    </div>
  );
}