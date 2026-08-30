'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FileUploadInput from '@/components/FileUploadInput';
import { formatPrice } from '@/lib/utils';
import {
  CreditCard,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  Upload,
  ArrowRight
} from 'lucide-react';

interface CheckoutClientProps {
  item: any;
  itemType: 'COURSE' | 'DIPLOMA' | 'BOOK';
  user: any;
  settings: Record<string, string>;
}

export default function CheckoutClient({
  item,
  itemType,
  user,
  settings,
}: CheckoutClientProps) {
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<'INSTAPAY' | 'VODAFONE_CASH'>('INSTAPAY');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(item.price);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Form Fields
  const [transactionId, setTransactionId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim() || applyingCoupon) return;
    setApplyingCoupon(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim(),
          amount: item.price,
          courseId: itemType === 'COURSE' ? item.id : undefined,
          diplomaId: itemType === 'DIPLOMA' ? item.id : undefined,
          bookId: itemType === 'BOOK' ? item.id : undefined,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || 'كوبون الخصم غير صالح أو منتهي الصلاحية');
      } else {
        setAppliedCoupon(data.coupon);
        setDiscountAmount(data.discountAmount);
        setFinalAmount(data.finalAmount);
        setCouponSuccess(`تم تطبيق خصم بقيمة ${data.discountAmount} ج.م بنجاح! 🎉`);
      }
    } catch (e) {
      setCouponError('حدث خطأ أثناء فحص الكوبون');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (finalAmount > 0 && !transactionId.trim()) {
      setFormError('يرجى كتابة رقم المعاملة (Transaction ID) بعد إتمام التحويل');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: itemType === 'COURSE' ? item.id : undefined,
          diplomaId: itemType === 'DIPLOMA' ? item.id : undefined,
          bookId: itemType === 'BOOK' ? item.id : undefined,
          couponId: appliedCoupon?.id,
          paymentMethod: finalAmount === 0 ? 'COUPON_100' : paymentMethod,
          senderPhone,
          transactionId: finalAmount === 0 ? `FREE-${Date.now()}` : transactionId,
          screenshotUrl,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'فشلت معالجة الطلب');
      } else {
        router.push(data.redirectUrl);
      }
    } catch (e) {
      setFormError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isFree = finalAmount === 0;

  const backLink = itemType === 'BOOK'
    ? `/books/${item.slug}`
    : itemType === 'COURSE'
    ? `/courses/${item.slug}`
    : `/diplomas/${item.slug}`;

  const itemTypeName = itemType === 'BOOK' ? 'المذكرة' : itemType === 'COURSE' ? 'الكورس' : 'الدبلومة';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link href={backLink} className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1 mb-2">
          ← العودة لتفاصيل {itemTypeName}
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-white">إتمام الاشتراك والطلب</h1>
        <p className="text-xs text-zinc-400 mt-1">
          اختر وسيلة التحويل المباشر وأدخل بيانات المعاملة لتفعيل اشتراكك فور التحقق
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Payment Instructions & Submission Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Coupon Box */}
          <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary-400" />
              هل لديك كوبون خصم؟
            </h3>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="أدخل كود الكوبون مثل: QIMAM50 أو FREE100"
                className="flex-1 px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs font-mono focus:outline-none focus:border-primary-500"
              />
              <button
                type="submit"
                disabled={applyingCoupon || !couponCode.trim()}
                className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {applyingCoupon ? 'جاري الفحص...' : 'تطبيق الكوبون'}
              </button>
            </form>

            {couponSuccess && (
              <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{couponSuccess}</span>
              </p>
            )}

            {couponError && (
              <p className="text-xs text-rose-400 font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{couponError}</span>
              </p>
            )}
          </div>

          {/* If 100% Free Coupon is Applied */}
          {isFree ? (
            <div className="p-8 rounded-3xl bg-emerald-950/40 border border-emerald-700 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-full bg-emerald-900/60 border border-emerald-600 flex items-center justify-center mx-auto text-2xl">
                🎁
              </div>
              <h2 className="text-xl font-black text-white">الكوبون يغطي 100% من الرسوم!</h2>
              <p className="text-xs text-emerald-200 max-w-md mx-auto">
                لقد قمت بتطبيق كوبون مجاني بالكامل. يمكنك تفعيل الكورس فوراً بضغطة واحدة دون الحاجة لأي تحويل مالي.
              </p>
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmitOrder}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-950/50 transition-all hover:scale-105"
              >
                {loading ? 'جاري تفعيل الاشتراك...' : 'تفعيل الكورس الآن وبدء التعلم مجاناً'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Payment Gateway Tabs */}
              <div className="p-6 rounded-3xl bg-surface border border-border space-y-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary-400" />
                  اختر وسيلة التحويل المالي المباشر:
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* InstaPay Selector */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('INSTAPAY')}
                    className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between ${
                      paymentMethod === 'INSTAPAY'
                        ? 'bg-purple-950/60 border-primary-500 shadow-md shadow-primary-950/50'
                        : 'bg-surface-raised border-border text-zinc-300 hover:bg-surface-card'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                        <span className="text-xs font-bold text-white">إنستاباي (InstaPay IPN)</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">تحويل لحظي من أي بنك أو محفظة</p>
                    </div>
                    {paymentMethod === 'INSTAPAY' && <Check className="w-4 h-4 text-primary-400" />}
                  </button>

                  {/* Vodafone Cash Selector */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('VODAFONE_CASH')}
                    className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between ${
                      paymentMethod === 'VODAFONE_CASH'
                        ? 'bg-purple-950/60 border-primary-500 shadow-md shadow-primary-950/50'
                        : 'bg-surface-raised border-border text-zinc-300 hover:bg-surface-card'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                        <span className="text-xs font-bold text-white">فودافون كاش (Vodafone Cash)</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">تحويل مباشر إلى رقم المحفظة</p>
                    </div>
                    {paymentMethod === 'VODAFONE_CASH' && <Check className="w-4 h-4 text-primary-400" />}
                  </button>
                </div>

                {/* Instructions Box for Selected Gateway */}
                {paymentMethod === 'INSTAPAY' ? (
                  <div className="p-4 rounded-2xl bg-surface-card border border-border/80 space-y-3">
                    <p className="text-xs font-bold text-primary-300">بيانات التحويل عبر إنستاباي:</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-border">
                        <span className="text-zinc-400">عنوان الدفع (IPA):</span>
                        <div className="flex items-center gap-2 font-mono font-bold text-white">
                          <span>{settings.INSTAPAY_ACCOUNT || 'qimam.edu@instapay'}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(settings.INSTAPAY_ACCOUNT || 'qimam.edu@instapay', 'instapay')}
                            className="p-1 text-primary-400 hover:text-white"
                          >
                            {copiedKey === 'instapay' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-border">
                        <span className="text-zinc-400">الاسم المعتمد للحساب:</span>
                        <span className="font-bold text-white">{settings.INSTAPAY_NAME || 'منصة قِمَم التعليمية ذ.م.م'}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {settings.INSTAPAY_INSTRUCTIONS || 'قم بتحويل المبلغ بدقة عبر تطبيق إنستاباي، ثم انسخ رقم العملية/المعاملة والصقه في الحقل أدناه.'}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-surface-card border border-border/80 space-y-3">
                    <p className="text-xs font-bold text-rose-300">بيانات التحويل عبر فودافون كاش:</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-border">
                        <span className="text-zinc-400">رقم محفظة التحويل:</span>
                        <div className="flex items-center gap-2 font-mono font-bold text-white">
                          <span>{settings.VODAFONE_CASH_NUMBER || '01001234567'}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(settings.VODAFONE_CASH_NUMBER || '01001234567', 'vodafone')}
                            className="p-1 text-primary-400 hover:text-white"
                          >
                            {copiedKey === 'vodafone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-border">
                        <span className="text-zinc-400">اسم صاحب المحفظة:</span>
                        <span className="font-bold text-white">{settings.VODAFONE_CASH_NAME || 'أكاديمية قمم التعليمية'}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {settings.VODAFONE_CASH_INSTRUCTIONS || 'قم بتحويل المبلغ لرقم المحفظة، ثم أدخل رقم المحفظة المحول منها ورقم العملية وصورة الإيصال.'}
                    </p>
                  </div>
                )}

                {/* Proof Fields */}
                <div className="space-y-4 pt-2 border-t border-border">
                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        رقم المعاملة / العملية (Transaction ID) *
                      </label>
                      <input
                        type="text"
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="مثال: IP-984321 أو 2026849"
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs font-mono focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        رقم الهاتف / الحساب المحول منه
                      </label>
                      <input
                        type="text"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder="01012345678"
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <FileUploadInput
                    label="صورة أو لقطة شاشة إيصال التحويل (Proof Screenshot) *"
                    folder="payments"
                    accept="image/*"
                    currentValue={screenshotUrl}
                    onUploadComplete={(url) => setScreenshotUrl(url)}
                    helperText="اختر صورة إيصال التحويل من جهازك أو التقط لقطة شاشة من تطبيق إنستاباي أو المحفظة"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-primary-900/40 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'جاري إرسال الطلب...' : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        تأكيد إرسال طلب التحويل والدفع ({formatPrice(finalAmount)})
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Right 1 Column: Order Summary Card */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-surface border border-border space-y-6 sticky top-28 shadow-xl">
          <h3 className="text-sm font-bold text-white border-b border-border pb-3">ملخص الطلب</h3>

          <div className="flex items-start gap-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
              <img
                src={item.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                {itemType === 'COURSE' ? 'كورس تدريبي' : 'دبلومة شاملة'}
              </span>
              <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">{item.title}</h4>
            </div>
          </div>

          <div className="space-y-2.5 text-xs pt-2 border-t border-border">
            <div className="flex items-center justify-between text-zinc-400">
              <span>السعر الأصلي:</span>
              <span className="text-white font-bold">{formatPrice(item.price)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-emerald-400">
                <span>خصم الكوبون ({appliedCoupon?.code}):</span>
                <span className="font-bold">- {formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border/80 text-sm font-bold">
              <span className="text-white">المبلغ النهائي للدفع:</span>
              <span className="text-primary-400 text-lg font-black">{formatPrice(finalAmount)}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-raised border border-border/60 text-[11px] text-zinc-400 space-y-1.5">
            <p className="font-bold text-zinc-300">ملاحظة أمنية هامة:</p>
            <p className="leading-relaxed">
              يتم التحقق من المعاملات المالية يدوياً ومطابقتها من قبل الإدارة لضمان حقوق الطلاب والمنصة. بمجرد التأكيد، يتم فتح المحتوى آلياً بحسابك.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}