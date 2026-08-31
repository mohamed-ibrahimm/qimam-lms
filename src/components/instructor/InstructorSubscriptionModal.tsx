'use client';

import React, { useState } from 'react';
import {
  X,
  CreditCard,
  GraduationCap,
  Video,
  Radio,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  ArrowLeft,
  Flame,
  Award,
  Upload,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import FileUploadInput from '@/components/FileUploadInput';
import { formatPrice } from '@/lib/utils';

interface InstructorSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  platformPricing: {
    monthlyPrice: number;
    annualPrice: number;
    studentPrice: number;
    studentMaxAge: number;
  };
  platformSettings: Record<string, string>;
  onSuccess: (msg: string) => void;
  onError: (err: string) => void;
  onOpenStudentVerification?: () => void;
}

export default function InstructorSubscriptionModal({
  isOpen,
  onClose,
  user,
  platformPricing,
  platformSettings,
  onSuccess,
  onError,
  onOpenStudentVerification,
}: InstructorSubscriptionModalProps) {
  // Track: 'EXPERT' (الدكاترة والمدرسين) vs 'STUDENT' (المحاضر الطالب)
  const isDefaultStudent = user?.isStudentInstructor && user?.studentVerificationStatus === 'APPROVED';
  const [selectedTrack, setSelectedTrack] = useState<'EXPERT' | 'STUDENT'>(isDefaultStudent ? 'STUDENT' : 'EXPERT');

  // Selected Plan
  const [selectedPlan, setSelectedPlan] = useState<'LIVE_STUDIO_PRO' | 'MONTHLY' | 'ANNUAL' | 'STUDENT_PRO' | 'STUDENT_LIVE_PRO'>('LIVE_STUDIO_PRO');
  
  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState<'INSTAPAY' | 'VODAFONE_CASH'>('INSTAPAY');
  const [txId, setTxId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Compute calculated price
  const liveStudioPrice = 490;
  const studentLivePrice = 220;

  const getCurrentPrice = () => {
    switch (selectedPlan) {
      case 'LIVE_STUDIO_PRO':
        return liveStudioPrice;
      case 'MONTHLY':
        return platformPricing.monthlyPrice || 290;
      case 'ANNUAL':
        return platformPricing.annualPrice || 1499;
      case 'STUDENT_PRO':
        return platformPricing.studentPrice || 120;
      case 'STUDENT_LIVE_PRO':
        return studentLivePrice;
      default:
        return 290;
    }
  };

  const currentPrice = getCurrentPrice();
  const instapayAccount = platformSettings['INSTAPAY_ACCOUNT'] || 'qimam.edu@instapay';
  const vodafoneCashNumber = platformSettings['VODAFONE_CASH_NUMBER'] || '01555791568';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Map STUDENT_LIVE_PRO to LIVE_STUDIO_PRO or STUDENT_PRO in backend
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
        onSuccess(data.message || 'تم إرسال طلب تفعيل الاشتراك بنجاح للإدارة!');
        onClose();
        setTxId('');
        setScreenshotUrl('');
      } else {
        onError(data.error || 'فشل إرسال طلب الاشتراك');
      }
    } catch (e) {
      onError('حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة ثانية');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="max-w-3xl w-full rounded-3xl bg-white dark:bg-[#0c0919] border-2 border-slate-200 dark:border-amber-500/30 shadow-[0_25px_80px_rgba(0,0,0,0.4)] dark:shadow-[0_25px_80px_rgba(245,158,11,0.2)] p-5 sm:p-8 space-y-6 text-right animate-in fade-in zoom-in-95 my-6 relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>اشتراكات وباقات المحاضرين (SaaS)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>تفعيل وتجديد باقة استوديو المحاضر</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =========================================================================
            TRACK SELECTOR (ICON FOR STUDENTS VS ICON FOR INSTRUCTORS)
           ========================================================================= */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-700 dark:text-zinc-300 block">
            اختر مسار ونوع اشتراكك في الأكاديمية:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Track 1: Expert & Professor */}
            <button
              type="button"
              onClick={() => {
                setSelectedTrack('EXPERT');
                if (selectedPlan === 'STUDENT_PRO' || selectedPlan === 'STUDENT_LIVE_PRO') {
                  setSelectedPlan('LIVE_STUDIO_PRO');
                }
              }}
              className={`p-4 rounded-2xl border-2 text-right transition-all flex items-start gap-3.5 cursor-pointer relative ${
                selectedTrack === 'EXPERT'
                  ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/10 ring-2 ring-purple-500/30'
                  : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Video className="w-6 h-6" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    مسار المحاضر الخبير / الدكتور الجامعي
                  </span>
                  {selectedTrack === 'EXPERT' && (
                    <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  للمدرسين والدكاترة وأصحاب المراكز التعليمية (0% عمولة على المبيعات وبث مباشر 1080p).
                </p>
              </div>
            </button>

            {/* Track 2: Student Instructor */}
            <button
              type="button"
              onClick={() => {
                setSelectedTrack('STUDENT');
                setSelectedPlan('STUDENT_PRO');
              }}
              className={`p-4 rounded-2xl border-2 text-right transition-all flex items-start gap-3.5 cursor-pointer relative ${
                selectedTrack === 'STUDENT'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/30'
                  : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-zinc-950 flex items-center justify-center shrink-0 shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    مسار المحاضر الطالب (سن {platformPricing.studentMaxAge} فأقل)
                  </span>
                  {selectedTrack === 'STUDENT' && (
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  منحة دعم دراسي لطلبة الجامعات والمدارس بخصم 60% لإطلاق شروحاتهم ومذكراتهم.
                </p>
              </div>
            </button>

          </div>
        </div>

        {/* =========================================================================
            PLANS CARDS (EXPERT VS STUDENT WITH LIVE STREAMING HIGHLIGHTS)
           ========================================================================= */}
        <div className="space-y-2.5">
          <label className="text-xs font-black text-slate-700 dark:text-zinc-300 block">
            اختر الباقة المناسبة لاحتياجاتك:
          </label>

          {selectedTrack === 'EXPERT' ? (
            /* Expert Track Plans */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              {/* Plan 1: Live Studio Pro (Featured VIP) */}
              <div
                onClick={() => setSelectedPlan('LIVE_STUDIO_PRO')}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between gap-3 cursor-pointer relative ${
                  selectedPlan === 'LIVE_STUDIO_PRO'
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 shadow-xl shadow-rose-500/15 ring-2 ring-rose-500/40 scale-[1.02]'
                    : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-white/10 hover:border-rose-400'
                }`}
              >
                <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white text-[9.5px] font-black shadow-md flex items-center gap-1">
                  <Flame className="w-3 h-3 text-yellow-300" />
                  <span>الأكثر طلباً VIP</span>
                </span>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      <span>باقة البث والأستوديو</span>
                    </span>
                    {selectedPlan === 'LIVE_STUDIO_PRO' && <Check className="w-4 h-4 text-rose-500 font-black" />}
                  </div>

                  <div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{liveStudioPrice}</span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-bold"> ج.م / شهر</span>
                  </div>

                  <ul className="text-[11px] text-slate-600 dark:text-zinc-300 space-y-1 pt-1">
                    <li className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-300">
                      <span>✓</span> 🔴 قاعات بث مباشر 1080p غير محدودة
                    </li>
                    <li className="flex items-center gap-1">
                      <span>✓</span> 🎙️ فتح المايك للطلاب والنقاش المباشر
                    </li>
                    <li className="flex items-center gap-1">
                      <span>✓</span> 🏆 مسابقات وكويزات Kahoot الحية
                    </li>
                    <li className="flex items-center gap-1">
                      <span>✓</span> 📚 كورسات ومذكرات DRM + 0% عمولة
                    </li>
                  </ul>
                </div>
              </div>

              {/* Plan 2: Basic Monthly */}
              <div
                onClick={() => setSelectedPlan('MONTHLY')}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between gap-3 cursor-pointer relative ${
                  selectedPlan === 'MONTHLY'
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-xl shadow-blue-500/15 ring-2 ring-blue-500/40 scale-[1.02]'
                    : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-white/10 hover:border-blue-400'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" />
                      <span>الباقة الأساسية (شهري)</span>
                    </span>
                    {selectedPlan === 'MONTHLY' && <Check className="w-4 h-4 text-blue-500 font-black" />}
                  </div>

                  <div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{platformPricing.monthlyPrice}</span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-bold"> ج.م / شهر</span>
                  </div>

                  <ul className="text-[11px] text-slate-600 dark:text-zinc-300 space-y-1 pt-1">
                    <li className="flex items-center gap-1">
                      <span>✓</span> كورسات مسجلة غير محدودة
                    </li>
                    <li className="flex items-center gap-1">
                      <span>✓</span> مذكرات وكتب رقمية محمية بالـ DRM
                    </li>
                    <li className="flex items-center gap-1">
                      <span>✓</span> تحصيل مباشر على محفظتك (0% عمولة)
                    </li>
                    <li className="flex items-center gap-1 text-zinc-400">
                      <span>✕</span> <span className="line-through">لا تشمل البث المباشر</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Plan 3: Annual VIP */}
              <div
                onClick={() => setSelectedPlan('ANNUAL')}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between gap-3 cursor-pointer relative ${
                  selectedPlan === 'ANNUAL'
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-xl shadow-emerald-500/15 ring-2 ring-emerald-500/40 scale-[1.02]'
                    : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-white/10 hover:border-emerald-400'
                }`}
              >
                <span className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9.5px] font-black shadow-md">
                  وفر شهرين مجاناً!
                </span>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>الباقة السنوية الشاملة</span>
                    </span>
                    {selectedPlan === 'ANNUAL' && <Check className="w-4 h-4 text-emerald-500 font-black" />}
                  </div>

                  <div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{platformPricing.annualPrice.toLocaleString('en-US')}</span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-bold"> ج.م / سنة</span>
                  </div>

                  <ul className="text-[11px] text-slate-600 dark:text-zinc-300 space-y-1 pt-1">
                    <li className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-300">
                      <span>✓</span> شاملة البثوث المباشرة طوال العام
                    </li>
                    <li className="flex items-center gap-1">
                      <span>✓</span> شارة دكتور/محاضر معتمد موثق
                    </li>
                    <li className="flex items-center gap-1">
                      <span>✓</span> أولوية دعم فني مخصصة VIP
                    </li>
                    <li className="flex items-center gap-1">
                      <span>✓</span> وفّر 30% من التكلفة الشهرية
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          ) : (
            /* Student Instructor Track Plans */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Student Plan 1: Starter */}
              <div
                onClick={() => setSelectedPlan('STUDENT_PRO')}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between gap-3 cursor-pointer relative ${
                  selectedPlan === 'STUDENT_PRO'
                    ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 shadow-xl shadow-amber-500/15 ring-2 ring-amber-500/40 scale-[1.02]'
                    : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-white/10 hover:border-amber-400'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>باقة المحاضر الطالب الأساسية</span>
                    </span>
                    {selectedPlan === 'STUDENT_PRO' && <Check className="w-4 h-4 text-amber-500 font-black" />}
                  </div>

                  <div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{platformPricing.studentPrice}</span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-bold"> ج.م / شهر (منحة دراسية)</span>
                  </div>

                  <ul className="text-[11px] text-slate-600 dark:text-zinc-300 space-y-1 pt-1">
                    <li className="flex items-center gap-1">
                      <span>✓</span> رفع ونشر كورسات ومذكرات لزملائك الطلاب
                    </li>
                    <li className="flex items-center gap-1">
                      <span>✓</span> تحصيل مباشر لأموالك على فودافون كاش أو إنستاباي
                    </li>
                    <li className="flex items-center gap-1">
                      <span>✓</span> شهادات إتمام وتتبع درجات الطلبة
                    </li>
                  </ul>
                </div>
              </div>

              {/* Student Plan 2: Student Live Pro */}
              <div
                onClick={() => setSelectedPlan('STUDENT_LIVE_PRO')}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between gap-3 cursor-pointer relative ${
                  selectedPlan === 'STUDENT_LIVE_PRO'
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 shadow-xl shadow-rose-500/15 ring-2 ring-rose-500/40 scale-[1.02]'
                    : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-white/10 hover:border-rose-400'
                }`}
              >
                <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[9.5px] font-black shadow-md flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>طالب + بث مباشر</span>
                </span>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>باقة الطالب مع البث التفاعلي</span>
                    </span>
                    {selectedPlan === 'STUDENT_LIVE_PRO' && <Check className="w-4 h-4 text-rose-500 font-black" />}
                  </div>

                  <div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{studentLivePrice}</span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-bold"> ج.م / شهر</span>
                  </div>

                  <ul className="text-[11px] text-slate-600 dark:text-zinc-300 space-y-1 pt-1">
                    <li className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-300">
                      <span>✓</span> فتح غرف بث مباشر لمراجعة المواد والمشاريع
                    </li>
                    <li className="flex items-center gap-1">
                      <span>✓</span> كويزات Kahoot حية ومشاركة الشاشة 1080p
                    </li>
                    <li className="flex items-center gap-1">
                      <span>✓</span> إرسال رابط البث لجروبات الدفعة بدون قيود
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* =========================================================================
            PAYMENT ACCOUNTS & DETAILS CARD
           ========================================================================= */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 dark:text-white">
              بيانات الدفع والتحويل المباشر لإدارة الأكاديمية:
            </span>
            <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">
              المطلوب تحويله: {currentPrice} ج.م
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            
            {/* InstaPay */}
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/30 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold block">حساب إنستاباي الإدارة:</span>
                <span className="text-xs font-mono font-black text-purple-900 dark:text-white block">{instapayAccount}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(instapayAccount, 'instapay')}
                className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedKey === 'instapay' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'instapay' ? 'تم النسخ!' : 'نسخ'}</span>
              </button>
            </div>

            {/* Vodafone Cash */}
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/30 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-rose-700 dark:text-rose-300 font-bold block">محفظة فودافون كاش الإدارة:</span>
                <span className="text-xs font-mono font-black text-rose-900 dark:text-white block">{vodafoneCashNumber}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(vodafoneCashNumber, 'vodafone')}
                className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedKey === 'vodafone' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'vodafone' ? 'تم النسخ!' : 'نسخ'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* =========================================================================
            CONFIRMATION FORM: METHOD + TX ID + SCREENSHOT
           ========================================================================= */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Payment Method Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">طريقة التحويل:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('INSTAPAY')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    paymentMethod === 'INSTAPAY'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700'
                  }`}
                >
                  إنستاباي (InstaPay)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('VODAFONE_CASH')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    paymentMethod === 'VODAFONE_CASH'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700'
                  }`}
                >
                  فودافون كاش
                </button>
              </div>
            </div>

            {/* Transaction ID */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">رقم العملية / الحساب المحول منه:</label>
              <input
                type="text"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                placeholder="رقم المعاملة أو رقم المحفظة المحول منها"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

          </div>

          {/* Screenshot Upload */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">صورة إيصال التحويل (سكرين شوت):</label>
            <FileUploadInput
              label="صورة أو لقطة شاشة لإيصال التحويل"
              accept="image/*"
              currentValue={screenshotUrl}
              onUploadComplete={(url: string) => setScreenshotUrl(url)}
              folder="payments"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-black transition-all cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>جاري إرسال الطلب للإدارة...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-zinc-950" />
                  <span>تأكيد وإرسال إيصال التحويل لتفعيل الحساب فوراً 🚀</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}