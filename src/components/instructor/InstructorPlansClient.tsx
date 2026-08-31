'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  GraduationCap,
  Video,
  Radio,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  CheckCircle,
} from 'lucide-react';
import FileUploadInput from '@/components/FileUploadInput';

interface InstructorPlansClientProps {
  user: any;
  platformPricing: {
    monthlyPrice: number;
    annualPrice: number;
    studentPrice: number;
    studentMaxAge: number;
  };
  platformSettings: Record<string, string>;
}

export default function InstructorPlansClient({
  user,
  platformPricing,
  platformSettings,
}: InstructorPlansClientProps) {
  const router = useRouter();
  const isDefaultStudent = user?.isStudentInstructor && user?.studentVerificationStatus === 'APPROVED';
  const [selectedTrack, setSelectedTrack] = useState<'EXPERT' | 'STUDENT'>(isDefaultStudent ? 'STUDENT' : 'EXPERT');
  const [selectedPlan, setSelectedPlan] = useState<'LIVE_STUDIO_PRO' | 'MONTHLY' | 'ANNUAL' | 'STUDENT_PRO' | 'STUDENT_LIVE_PRO'>('LIVE_STUDIO_PRO');
  
  const [paymentMethod, setPaymentMethod] = useState<'INSTAPAY' | 'VODAFONE_CASH'>('INSTAPAY');
  const [txId, setTxId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const liveStudioPrice = 490;
  const studentLivePrice = 220;

  const getPlanDetails = () => {
    switch (selectedPlan) {
      case 'LIVE_STUDIO_PRO':
        return { name: 'باقة البث المباشر والأستوديو الشامل', price: liveStudioPrice, period: 'شهرياً' };
      case 'MONTHLY':
        return { name: 'الباقة الأساسية', price: platformPricing.monthlyPrice || 290, period: 'شهرياً' };
      case 'ANNUAL':
        return { name: 'الباقة السنوية الشاملة', price: platformPricing.annualPrice || 1499, period: 'سنوياً' };
      case 'STUDENT_PRO':
        return { name: 'باقة المحاضر الطالب الأساسية', price: platformPricing.studentPrice || 120, period: 'شهرياً' };
      case 'STUDENT_LIVE_PRO':
        return { name: 'باقة المحاضر الطالب مع البث المباشر', price: studentLivePrice, period: 'شهرياً' };
      default:
        return { name: 'الباقة الأساسية', price: 290, period: 'شهرياً' };
    }
  };

  const currentPlanInfo = getPlanDetails();
  const instapayAccount = platformSettings['INSTAPAY_ACCOUNT'] || 'qimam.edu@instapay';
  const vodafoneCashNumber = platformSettings['VODAFONE_CASH_NUMBER'] || '01555791568';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);
    try {
      const planToSend = selectedPlan === 'STUDENT_LIVE_PRO' ? 'LIVE_STUDIO_PRO' : selectedPlan;

      const res = await fetch('/api/instructor/subscription/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planToSend,
          paymentMethod,
          transactionId: txId,
          screenshotUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({
          type: 'success',
          text: data.message || 'تم إرسال طلب تفعيل الاشتراك بنجاح للإدارة! سيتم مراجعة الإيصال وتفعيل حسابك خلال دقائق.',
        });
        setTxId('');
        setScreenshotUrl('');
      } else {
        setFeedback({ type: 'error', text: data.error || 'فشل إرسال طلب الاشتراك' });
      }
    } catch (e) {
      setFeedback({ type: 'error', text: 'حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة ثانية' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-right space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Bar: Navigation link */}
      {user && (
        <div className="flex items-center justify-between pb-2">
          <Link
            href="/instructor"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى لوحة المحاضر</span>
          </Link>
        </div>
      )}

      {/* =========================================================================
          1. COMPACT HERO & TRACK SWITCHER
         ========================================================================= */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          باقات واشتراكات المحاضرين
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
          أنشئ دوراتك ومذكراتك أو افتح قاعات بث مباشر لطلابك مع تحصيل مباشر 100% لأموالك وبدون أي عمولة على المبيعات.
        </p>

        {/* Track Selector (Segmented Pill Switcher) */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex p-1 rounded-xl bg-zinc-900 border border-zinc-800 gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setSelectedTrack('EXPERT');
                if (selectedPlan === 'STUDENT_PRO' || selectedPlan === 'STUDENT_LIVE_PRO') {
                  setSelectedPlan('LIVE_STUDIO_PRO');
                }
              }}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                selectedTrack === 'EXPERT'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-amber-400" />
              <span>المحاضرين والدكاترة المعتمدين</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedTrack('STUDENT');
                setSelectedPlan('STUDENT_PRO');
              }}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                selectedTrack === 'STUDENT'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>المحاضر الطالب (سن {platformPricing.studentMaxAge} فأقل)</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. PRICING CARDS (IMMEDIATELY VISIBLE & COHESIVE)
         ========================================================================= */}
      <div className="max-w-5xl mx-auto">
        {selectedTrack === 'EXPERT' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-stretch">
            
            {/* 1. Standard Monthly */}
            <div
              onClick={() => setSelectedPlan('MONTHLY')}
              className={`p-6 rounded-2xl border text-right transition-all flex flex-col justify-between gap-5 cursor-pointer relative ${
                selectedPlan === 'MONTHLY'
                  ? 'bg-zinc-900 border-amber-500 shadow-xl ring-2 ring-amber-500/30'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-zinc-400" />
                    <span>الباقة الأساسية</span>
                  </span>
                  {selectedPlan === 'MONTHLY' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 ring-4 ring-amber-400/20" />
                  )}
                </div>

                <div>
                  <span className="text-3xl font-black text-white font-mono">{platformPricing.monthlyPrice}</span>
                  <span className="text-xs text-zinc-400 font-bold"> ج.م / شهر</span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  مخصصة لنشر الدورات المسجلة والمذكرات الرقمية المحمية وتتبع الطلاب.
                </p>

                <ul className="text-xs text-zinc-300 space-y-2 pt-3 border-t border-zinc-800/80">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>رفع ونشر كورسات مسجلة غير محدودة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>مذكرات رقمية محمية بالـ DRM</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>بنك أسئلة واختبارات إلكترونية</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>تحصيل مباشر 100% بدون عمولة</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                  selectedPlan === 'MONTHLY'
                    ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                    : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                }`}
              >
                {selectedPlan === 'MONTHLY' ? 'الباقة المحددة' : 'اختيار هذه الباقة'}
              </button>
            </div>

            {/* 2. Live Studio Pro (Featured VIP) */}
            <div
              onClick={() => setSelectedPlan('LIVE_STUDIO_PRO')}
              className={`p-6 rounded-2xl border text-right transition-all flex flex-col justify-between gap-5 cursor-pointer relative ${
                selectedPlan === 'LIVE_STUDIO_PRO'
                  ? 'bg-zinc-900 border-amber-500 shadow-2xl ring-2 ring-amber-500/40 md:-translate-y-1'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <Radio className="w-4 h-4" />
                    <span>باقة البث والأستوديو</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    الأكثر اختياراً
                  </span>
                </div>

                <div>
                  <span className="text-3xl font-black text-white font-mono">{liveStudioPrice}</span>
                  <span className="text-xs text-zinc-400 font-bold"> ج.م / شهر</span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  الحل الشامل للتدريس التفاعلي والبثوث الحية مع مسابقات وكويزات الطلاب.
                </p>

                <ul className="text-xs text-zinc-200 space-y-2 pt-3 border-t border-zinc-800/80">
                  <li className="flex items-center gap-2 text-amber-300 font-bold">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>قاعات بث مباشر 1080p غير محدودة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>فتح المايك للنقاش ومشاركة الشاشة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>كويزات ومسابقات تفاعلية للطلاب</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>كورسات مسجلة ومذكرات DRM</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>رابط دعوة مباشر للطلاب بدون قيود</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                  selectedPlan === 'LIVE_STUDIO_PRO'
                    ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                    : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                }`}
              >
                {selectedPlan === 'LIVE_STUDIO_PRO' ? 'الباقة المحددة' : 'اختيار هذه الباقة'}
              </button>
            </div>

            {/* 3. Annual VIP */}
            <div
              onClick={() => setSelectedPlan('ANNUAL')}
              className={`p-6 rounded-2xl border text-right transition-all flex flex-col justify-between gap-5 cursor-pointer relative ${
                selectedPlan === 'ANNUAL'
                  ? 'bg-zinc-900 border-amber-500 shadow-xl ring-2 ring-amber-500/30'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-zinc-400" />
                    <span>الباقة السنوية الشاملة</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                    توفير شهرين
                  </span>
                </div>

                <div>
                  <span className="text-3xl font-black text-white font-mono">{platformPricing.annualPrice.toLocaleString('en-US')}</span>
                  <span className="text-xs text-zinc-400 font-bold"> ج.م / سنة</span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  اشتراك سنوي كامل لجميع الخدمات مع توفير 30% من التكلفة الإجمالية.
                </p>

                <ul className="text-xs text-zinc-300 space-y-2 pt-3 border-t border-zinc-800/80">
                  <li className="flex items-center gap-2 text-amber-300 font-medium">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>شاملة ميزة البث طوال العام</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>شارة دكتور/محاضر معتمد موثق</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>أولوية دعم فني مخصصة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>جميع ميزات المنصة بدون حدود</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                  selectedPlan === 'ANNUAL'
                    ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                    : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                }`}
              >
                {selectedPlan === 'ANNUAL' ? 'الباقة المحددة' : 'اختيار هذه الباقة'}
              </button>
            </div>

          </div>
        ) : (
          /* Student Track Plans */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            
            {/* Student Basic */}
            <div
              onClick={() => setSelectedPlan('STUDENT_PRO')}
              className={`p-6 rounded-2xl border text-right transition-all flex flex-col justify-between gap-5 cursor-pointer ${
                selectedPlan === 'STUDENT_PRO'
                  ? 'bg-zinc-900 border-amber-500 shadow-xl ring-2 ring-amber-500/30'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-amber-400" />
                    <span>باقة الطالب الأساسية</span>
                  </span>
                </div>

                <div>
                  <span className="text-3xl font-black text-white font-mono">{platformPricing.studentPrice}</span>
                  <span className="text-xs text-zinc-400 font-bold"> ج.م / شهر</span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  منحة دراسية لطلاب الجامعات لنشر شروحات المواد والمذكرات.
                </p>

                <ul className="text-xs text-zinc-300 space-y-2 pt-3 border-t border-zinc-800/80">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>نشر كورسات ومذكرات لزملائك الطلاب</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>تحصيل مباشر لأموالك على محفظتك</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>تتبع درجات واختبارات الطلاب</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                  selectedPlan === 'STUDENT_PRO'
                    ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                    : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                }`}
              >
                {selectedPlan === 'STUDENT_PRO' ? 'الباقة المحددة' : 'اختيار هذه الباقة'}
              </button>
            </div>

            {/* Student Live Pro */}
            <div
              onClick={() => setSelectedPlan('STUDENT_LIVE_PRO')}
              className={`p-6 rounded-2xl border text-right transition-all flex flex-col justify-between gap-5 cursor-pointer ${
                selectedPlan === 'STUDENT_LIVE_PRO'
                  ? 'bg-zinc-900 border-amber-500 shadow-xl ring-2 ring-amber-500/30'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <Radio className="w-4 h-4" />
                    <span>باقة الطالب مع البث المباشر</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    بث مباشر
                  </span>
                </div>

                <div>
                  <span className="text-3xl font-black text-white font-mono">{studentLivePrice}</span>
                  <span className="text-xs text-zinc-400 font-bold"> ج.م / شهر</span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  مخصصة للمراجعات الحية ومناقشة المشاريع بالصوت والشاشة.
                </p>

                <ul className="text-xs text-zinc-300 space-y-2 pt-3 border-t border-zinc-800/80">
                  <li className="flex items-center gap-2 text-amber-300 font-medium">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>فتح قاعات بث مباشر لمراجعة المواد</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>مشاركة الشاشة وكويزات تفاعلية</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>رابط دعوة مباشر لجروبات الدفعة</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                  selectedPlan === 'STUDENT_LIVE_PRO'
                    ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                    : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                }`}
              >
                {selectedPlan === 'STUDENT_LIVE_PRO' ? 'الباقة المحددة' : 'اختيار هذه الباقة'}
              </button>
            </div>

          </div>
        )}
      </div>

      {/* =========================================================================
          3. PAYMENT & CONFIRMATION CONSOLE
         ========================================================================= */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-6">
        <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white">بيانات التحويل وتأكيد الاشتراك</h3>
            <p className="text-xs text-zinc-400">قم بتحويل المبلغ المطلوب عبر إنستاباي أو فودافون كاش ثم أرفق الإيصال أدناه</p>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-bold text-amber-400 font-mono">
            المبلغ: {currentPlanInfo.price} ج.م ({currentPlanInfo.period})
          </div>
        </div>

        {/* Payment Accounts Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* InstaPay */}
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 block">حساب إنستاباي الإدارة:</span>
              <span className="text-xs font-mono font-semibold text-white block">{instapayAccount}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(instapayAccount, 'instapay')}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedKey === 'instapay' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'instapay' ? 'تم النسخ' : 'نسخ'}</span>
            </button>
          </div>

          {/* Vodafone Cash */}
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 block">محفظة فودافون كاش:</span>
              <span className="text-xs font-mono font-semibold text-white block">{vodafoneCashNumber}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(vodafoneCashNumber, 'vodafone')}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedKey === 'vodafone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'vodafone' ? 'تم النسخ' : 'نسخ'}</span>
            </button>
          </div>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">طريقة التحويل المستخدمة:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('INSTAPAY')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    paymentMethod === 'INSTAPAY'
                      ? 'bg-zinc-800 border-zinc-600 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  إنستاباي (InstaPay)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('VODAFONE_CASH')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    paymentMethod === 'VODAFONE_CASH'
                      ? 'bg-zinc-800 border-zinc-600 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  فودافون كاش
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">رقم المعاملة / العملية (اختياري):</label>
              <input
                type="text"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                placeholder="رقم العملية من التطبيق"
                className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 font-mono"
              />
            </div>

          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">صورة إيصال التحويل:</label>
            <FileUploadInput
              label="صورة إيصال التحويل"
              accept="image/*"
              currentValue={screenshotUrl}
              onUploadComplete={(url: string) => setScreenshotUrl(url)}
              folder="payments"
            />
          </div>

          {feedback && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/60 border border-rose-800 text-rose-300'
              }`}
            >
              {feedback.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'جاري إرسال الطلب للإدارة...' : 'تأكيد وإرسال إيصال التحويل لتفعيل الحساب فوراً'}
          </button>
        </form>
      </div>

    </div>
  );
}