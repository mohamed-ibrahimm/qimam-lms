'use client';

import React, { useState } from 'react';
import {
  X,
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
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import FileUploadInput from '@/components/FileUploadInput';

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
  const isDefaultStudent = user?.isStudentInstructor && user?.studentVerificationStatus === 'APPROVED';
  const [selectedTrack, setSelectedTrack] = useState<'EXPERT' | 'STUDENT'>(isDefaultStudent ? 'STUDENT' : 'EXPERT');
  const [selectedPlan, setSelectedPlan] = useState<'LIVE_STUDIO_PRO' | 'MONTHLY' | 'ANNUAL' | 'STUDENT_PRO' | 'STUDENT_LIVE_PRO'>('LIVE_STUDIO_PRO');
  
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
        onSuccess(data.message || 'تم إرسال طلب تفعيل الاشتراك بنجاح للإدارة');
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-4xl w-full rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 text-right animate-in fade-in zoom-in-95 my-6 text-zinc-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <span>اشتراكات وباقات المحاضرين</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              اختر باقة الاشتراك المناسبة وأرسل إيصال التحويل لتفعيل حسابك وميزاتك فوراً
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Track Switcher (Classic Segmented Control) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300">مسار الاشتراك:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Expert Track */}
            <button
              type="button"
              onClick={() => {
                setSelectedTrack('EXPERT');
                if (selectedPlan === 'STUDENT_PRO' || selectedPlan === 'STUDENT_LIVE_PRO') {
                  setSelectedPlan('LIVE_STUDIO_PRO');
                }
              }}
              className={`p-3.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                selectedTrack === 'EXPERT'
                  ? 'bg-zinc-900 border-amber-500/80 text-white shadow-sm ring-1 ring-amber-500/40'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">المحاضرين والدكاترة المعتمدين</span>
                  <span className="text-[11px] text-zinc-400 block">بدون عمولة على المبيعات + خيارات البث المباشر</span>
                </div>
              </div>
              {selectedTrack === 'EXPERT' && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
            </button>

            {/* Student Track */}
            <button
              type="button"
              onClick={() => {
                setSelectedTrack('STUDENT');
                setSelectedPlan('STUDENT_PRO');
              }}
              className={`p-3.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                selectedTrack === 'STUDENT'
                  ? 'bg-zinc-900 border-amber-500/80 text-white shadow-sm ring-1 ring-amber-500/40'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">المحاضر الطالب (سن {platformPricing.studentMaxAge} فأقل)</span>
                  <span className="text-[11px] text-zinc-400 block">منحة دعم دراسي مخفضة لطلبة الجامعات</span>
                </div>
              </div>
              {selectedTrack === 'STUDENT' && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
            </button>

          </div>
        </div>

        {/* Pricing Cards */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300">اختر الباقة المطلوبة:</label>

          {selectedTrack === 'EXPERT' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* 1. Live Studio Pro */}
              <div
                onClick={() => setSelectedPlan('LIVE_STUDIO_PRO')}
                className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                  selectedPlan === 'LIVE_STUDIO_PRO'
                    ? 'bg-zinc-900 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5" />
                      <span>باقة البث المباشر والأستوديو</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      الأكثر اختياراً
                    </span>
                  </div>

                  <div>
                    <span className="text-xl font-bold text-white font-mono">{liveStudioPrice}</span>
                    <span className="text-xs text-zinc-400"> ج.م / شهر</span>
                  </div>

                  <ul className="text-[11px] text-zinc-300 space-y-1.5 pt-1 border-t border-zinc-800/60">
                    <li className="flex items-center gap-1.5 text-amber-300 font-medium">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>قاعات بث مباشر غير محدودة 1080p</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>فتح المايك للنقاش الصوتي ومشاركة الشاشة</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>كويزات ومسابقات تفاعلية للطلاب</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>كورسات ومذكرات DRM بدون عمولة</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 2. Basic Monthly */}
              <div
                onClick={() => setSelectedPlan('MONTHLY')}
                className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                  selectedPlan === 'MONTHLY'
                    ? 'bg-zinc-900 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-zinc-400" />
                      <span>الباقة الأساسية (شهري)</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-xl font-bold text-white font-mono">{platformPricing.monthlyPrice}</span>
                    <span className="text-xs text-zinc-400"> ج.م / شهر</span>
                  </div>

                  <ul className="text-[11px] text-zinc-300 space-y-1.5 pt-1 border-t border-zinc-800/60">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>كورسات مسجلة غير محدودة</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>مذكرات رقمية محمية بالـ DRM</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>تحصيل مباشر على حسابك الخاص</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 3. Annual VIP */}
              <div
                onClick={() => setSelectedPlan('ANNUAL')}
                className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                  selectedPlan === 'ANNUAL'
                    ? 'bg-zinc-900 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-zinc-400" />
                      <span>الباقة السنوية الشاملة</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                      توفير شهرين
                    </span>
                  </div>

                  <div>
                    <span className="text-xl font-bold text-white font-mono">{platformPricing.annualPrice.toLocaleString('en-US')}</span>
                    <span className="text-xs text-zinc-400"> ج.م / سنة</span>
                  </div>

                  <ul className="text-[11px] text-zinc-300 space-y-1.5 pt-1 border-t border-zinc-800/60">
                    <li className="flex items-center gap-1.5 text-amber-300 font-medium">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>شاملة البث المباشر طوال العام</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>شارة محاضر معتمد موثق</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>أولوية دعم فني مخصصة</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          ) : (
            /* Student Track Plans */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Student Basic */}
              <div
                onClick={() => setSelectedPlan('STUDENT_PRO')}
                className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                  selectedPlan === 'STUDENT_PRO'
                    ? 'bg-zinc-900 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                      <span>باقة المحاضر الطالب الأساسية</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-xl font-bold text-white font-mono">{platformPricing.studentPrice}</span>
                    <span className="text-xs text-zinc-400"> ج.م / شهر</span>
                  </div>

                  <ul className="text-[11px] text-zinc-300 space-y-1.5 pt-1 border-t border-zinc-800/60">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>نشر كورسات ومذكرات لزملائك الطلاب</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>تحصيل مباشر لأموالك على محفظتك</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Student Live Pro */}
              <div
                onClick={() => setSelectedPlan('STUDENT_LIVE_PRO')}
                className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                  selectedPlan === 'STUDENT_LIVE_PRO'
                    ? 'bg-zinc-900 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5" />
                      <span>باقة الطالب مع البث المباشر</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      بث مباشر
                    </span>
                  </div>

                  <div>
                    <span className="text-xl font-bold text-white font-mono">{studentLivePrice}</span>
                    <span className="text-xs text-zinc-400"> ج.م / شهر</span>
                  </div>

                  <ul className="text-[11px] text-zinc-300 space-y-1.5 pt-1 border-t border-zinc-800/60">
                    <li className="flex items-center gap-1.5 text-amber-300 font-medium">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>فتح قاعات بث مباشر لمراجعة المواد</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>مشاركة الشاشة وكويزات تفاعلية</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Payment Accounts Card */}
        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-zinc-300">بيانات التحويل لإدارة المنصة:</span>
            <span className="text-amber-400 font-mono font-bold">المطلوب تحويله: {currentPrice} ج.م</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* InstaPay */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 block">حساب إنستاباي:</span>
                <span className="text-xs font-mono font-semibold text-white block">{instapayAccount}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(instapayAccount, 'instapay')}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedKey === 'instapay' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'instapay' ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>

            {/* Vodafone Cash */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 block">محفظة فودافون كاش:</span>
                <span className="text-xs font-mono font-semibold text-white block">{vodafoneCashNumber}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(vodafoneCashNumber, 'vodafone')}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedKey === 'vodafone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'vodafone' ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Payment Confirmation Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div className="space-y-1">
              <label className="text-xs text-zinc-300">طريقة التحويل المستخدمة:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('INSTAPAY')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
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
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
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
              <label className="text-xs text-zinc-300">رقم المعاملة / العملية (اختياري):</label>
              <input
                type="text"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                placeholder="رقم العملية من التطبيق"
                className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 font-mono"
              />
            </div>

          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-300">صورة إيصال التحويل:</label>
            <FileUploadInput
              label="صورة إيصال التحويل"
              accept="image/*"
              currentValue={screenshotUrl}
              onUploadComplete={(url: string) => setScreenshotUrl(url)}
              folder="payments"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'جاري الإرسال...' : 'تأكيد وإرسال إيصال التحويل'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}