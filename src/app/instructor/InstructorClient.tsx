'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FileUploadInput from '@/components/FileUploadInput';
import { formatPrice, formatDuration } from '@/lib/utils';
import InstructorSidebarClient, { InstructorTabType } from '@/components/instructor/InstructorSidebarClient';
import StudentVerificationModal from '@/components/instructor/StudentVerificationModal';
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Plus,
  PlayCircle,
  Clock,
  TrendingUp,
  MessageSquare,
  Trash2,
  AlertTriangle,
  X,
  ExternalLink,
  CheckCircle2,
  CreditCard,
  Tag,
  Receipt,
  Sparkles,
  Copy,
  Check,
  Star,
  ShieldCheck,
  Wallet,
  ArrowLeft,
  ArrowRight,
  Eye,
  RefreshCw,
  FileText,
  CheckCircle,
  ArrowUpRight,
  BarChart3,
  SlidersHorizontal,
} from 'lucide-react';

interface InstructorClientProps {
  user: any;
  initialCourses: any[];
  totalStudents: number;
  subscriptionState: any;
  initialCoupons: any[];
  initialPayments: any[];
  platformSettings: Record<string, string>;
}

export default function InstructorClient({
  user,
  initialCourses,
  totalStudents,
  subscriptionState,
  initialCoupons,
  initialPayments,
  platformSettings,
}: InstructorClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<InstructorTabType>('overview');
  const [courses, setCourses] = useState<any[]>(initialCourses);
  const [coupons, setCoupons] = useState<any[]>(initialCoupons || []);
  const [payments, setPayments] = useState<any[]>(initialPayments || []);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAddModal(false);
        setShowRenewModal(false);
        setDeletingCourse(null);
        setViewingScreenshot(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Course Delete State
  const [deletingCourse, setDeletingCourse] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Student Verification Modal State
  const [showStudentVerifModal, setShowStudentVerifModal] = useState(false);

  // New Course Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    shortDescription: '',
    description: '',
    thumbnail: '',
    price: 900,
    durationHours: 20,
    level: 'BEGINNER',
  });

  // Payment Settings Form State
  const [paymentSettings, setPaymentSettings] = useState({
    instapayAddress: user.instapayAddress || '',
    instapayName: user.instapayName || user.officialFullName || '',
    vodafoneCashNumber: user.vodafoneCashNumber || '',
    paymentInstructions: user.paymentInstructions || '',
    phone: user.phone || '',
  });
  const [isSavingPayments, setIsSavingPayments] = useState(false);

  // Coupon Creation Form State
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    maxUses: 100,
    validUntil: '',
  });
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);

  // Order Approval State
  const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(null);
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);

  // Subscription Renewal Modal State
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewPlan, setRenewPlan] = useState<'MONTHLY' | 'ANNUAL' | 'STUDENT_PRO'>('MONTHLY');
  const [renewMethod, setRenewMethod] = useState<'INSTAPAY' | 'VODAFONE_CASH'>('INSTAPAY');
  const [renewTxId, setRenewTxId] = useState('');
  const [renewScreenshot, setRenewScreenshot] = useState('');
  const [isSubmittingRenew, setIsSubmittingRenew] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDeleteCourse = async () => {
    if (!deletingCourse || isDeleting) return;
    setIsDeleting(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/courses?id=${deletingCourse.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.id !== deletingCourse.id));
        setMessage({ type: 'success', text: data.message || 'تم حذف الكورس بنجاح.' });
        setDeletingCourse(null);
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل حذف الكورس' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء الاتصال بالخادم' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title.trim()) {
      setModalError('يرجى كتابة عنوان الكورس أولاً');
      return;
    }
    if (isCreating) return;
    setIsCreating(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse),
      });
      const data = await res.json();
      if (res.ok) {
        setCourses((prev) => [
          {
            ...data.course,
            instructor: { officialFullName: user.officialFullName },
            _count: { sections: 0, enrollments: 0 },
            sections: [],
          },
          ...prev,
        ]);
        setMessage({ type: 'success', text: 'تم إنشاء الكورس الجديد بنجاح!' });
        setShowAddModal(false);
        setModalError(null);
        setNewCourse({
          title: '',
          shortDescription: '',
          description: '',
          thumbnail: '',
          price: 900,
          durationHours: 20,
          level: 'BEGINNER',
        });
        router.refresh();
      } else {
        const err = data.error || 'فشل إنشاء الكورس';
        setModalError(err);
        setMessage({ type: 'error', text: err });
      }
    } catch (e) {
      const err = 'حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة ثانية';
      setModalError(err);
      setMessage({ type: 'error', text: err });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPayments(true);
    setMessage(null);
    try {
      const res = await fetch('/api/instructor/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentSettings),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'تم حفظ وتحديث بيانات استلام أرباحك بنجاح! سيتم توجيه تحويلات الطلاب إلى حساباتك مباشرة.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل حفظ الإعدادات' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ الإعدادات' });
    } finally {
      setIsSavingPayments(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;
    setIsCreatingCoupon(true);
    setMessage(null);
    try {
      const res = await fetch('/api/instructor/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon),
      });
      const data = await res.json();
      if (res.ok) {
        setCoupons((prev) => [data.coupon, ...prev]);
        setMessage({ type: 'success', text: 'تم إنشاء كود الخصم بنجاح! يمكنك الآن نشره لطلابك.' });
        setNewCoupon({
          code: '',
          discountType: 'PERCENTAGE',
          discountValue: 20,
          maxUses: 100,
          validUntil: '',
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل إنشاء الكوبون' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء إنشاء الكوبون' });
    } finally {
      setIsCreatingCoupon(false);
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا الكوبون؟')) return;
    try {
      const res = await fetch(`/api/instructor/coupons?id=${couponId}`, { method: 'DELETE' });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== couponId));
        setMessage({ type: 'success', text: 'تم حذف الكوبون بنجاح' });
      }
    } catch (e) {}
  };

  const handleOrderAction = async (paymentId: string, action: 'APPROVE' | 'REJECT') => {
    setProcessingPaymentId(paymentId);
    try {
      const res = await fetch('/api/instructor/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, action }),
      });
      const data = await res.json();
      if (res.ok) {
        setPayments((prev) =>
          prev.map((p) => (p.id === paymentId ? { ...p, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : p))
        );
        setMessage({
          type: 'success',
          text: action === 'APPROVE' ? 'تم تأكيد الإيصال وتفعيل الكورس للطالب فورياً!' : 'تم رفض الإيصال وإشعار الطالب.',
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل تنفيذ الإجراء' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء معالجة الطلب' });
    } finally {
      setProcessingPaymentId(null);
    }
  };

  const handleSubmitRenewal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRenew(true);
    try {
      const res = await fetch('/api/instructor/subscription/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: renewPlan,
          paymentMethod: renewMethod,
          transactionId: renewTxId,
          screenshotUrl: renewScreenshot,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message || 'تم إرسال طلب تجديد الاشتراك بنجاح للإدارة!' });
        setShowRenewModal(false);
        setRenewTxId('');
        setRenewScreenshot('');
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل إرسال طلب التجديد' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء إرسال الطلب' });
    } finally {
      setIsSubmittingRenew(false);
    }
  };

  // Subscription Banner Computation
  const isTrial = subscriptionState?.status === 'TRIAL';
  const isExpired = subscriptionState?.status === 'EXPIRED';
  const isActivePaid = subscriptionState?.status === 'ACTIVE';

  const totalEarnedRevenue = payments
    .filter((p) => p.status === 'APPROVED')
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingPaymentsCount = payments.filter((p) => p.status === 'PENDING').length;
  const totalLessonsCount = courses.reduce((acc, c) => {
    return acc + (c.sections || []).reduce((sAcc: number, s: any) => sAcc + (s.lessons?.length || 0), 0);
  }, 0);

  return (
    <div className="min-h-screen relative flex flex-col md:flex-row">
      {/* Dynamic Ambient Mesh in Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="dynamic-drift-1 absolute top-[5%] right-[15%] w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[130px]" />
        <div className="dynamic-drift-2 absolute bottom-[10%] right-[40%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="dynamic-drift-3 absolute top-[35%] left-[5%] w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="dynamic-drift-4 absolute bottom-[25%] left-[25%] w-[480px] h-[480px] bg-emerald-500/10 rounded-full blur-[125px]" />
      </div>

      {/* Instructor Persistent Luxury Sidebar */}
      <InstructorSidebarClient
        instructorName={user.officialFullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'محاضر قمم'}
        instructorEmail={user.email}
        subscriptionPlan={user.subscriptionPlan || 'FREE_TRIAL'}
        coursesCount={courses.length}
        pendingOrdersCount={pendingPaymentsCount}
        couponsCount={coupons.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewCourseClick={() => {
          if (isExpired) {
            setMessage({ type: 'error', text: 'انتهت الفترة التجريبية، يرجى تجديد الاشتراك أولاً لإضافة دورات جديدة' });
            return;
          }
          setModalError(null);
          setShowAddModal(true);
        }}
        publicProfileSlug={user.username || user.id}
      />

      {/* Main Studio View Area matching Admin Layout */}
      <main className="flex-1 p-3 sm:p-6 md:p-8 max-w-7xl relative z-10 w-full min-w-0 space-y-6">
        {/* Studio Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
              <Link href="/" className="hover:text-amber-500 transition-colors">الرئيسية</Link>
              <span>/</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">استوديو المحاضر السحابي</span>
              <span>/</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {activeTab === 'overview' && 'نظرة عامة والتحليلات'}
                {activeTab === 'courses' && 'دوراتي التدريبية'}
                {activeTab === 'orders' && 'طلبات وإيصالات الطلاب'}
                {activeTab === 'payments' && 'بيانات استلام أرباحي'}
                {activeTab === 'coupons' && 'كوبونات الخصم'}
                {activeTab === 'subscription' && 'باقة اشتراك الاستوديو'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-amber-500" />
              <span>أكاديمية المحاضر: {user.officialFullName}</span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                if (isExpired) {
                  setMessage({ type: 'error', text: 'انتهت الفترة التجريبية، يرجى تجديد الاشتراك أولاً لإضافة دورات جديدة' });
                  return;
                }
                setModalError(null);
                setShowAddModal(true);
              }}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة كورس جديد</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('payments')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold border border-slate-200 dark:border-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline">بيانات أرباحي</span>
            </button>

            {!user.isStudentInstructor ? (
              <button
                type="button"
                onClick={() => setShowStudentVerifModal(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>اشترك كمحاضر طالب (30 يوم مجاناً) 🎓</span>
              </button>
            ) : (
              <span className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>محاضر طالب معتمد 🎓</span>
              </span>
            )}
          </div>
        </div>

        {/* Subscription Status Callout Banner */}
        {user.role !== 'ADMIN' && (
          <div
            className={`p-4 sm:p-5 rounded-3xl border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
              isExpired
                ? 'bg-rose-950/40 border-rose-800/80 shadow-rose-950/30 text-rose-200'
                : isTrial
                ? 'bg-gradient-to-r from-amber-950/50 via-yellow-950/30 to-amber-950/50 border-amber-500/40 shadow-amber-950/20 text-amber-200'
                : 'bg-emerald-950/40 border-emerald-800/80 shadow-emerald-950/30 text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isExpired
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : isTrial
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                }`}
              >
                {isExpired ? <AlertTriangle className="w-5 h-5" /> : isTrial ? <Clock className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-black text-white">
                    {isExpired
                      ? 'انتهت الفترة التجريبية وتوقفت مبيعات كورساتك مؤقتاً'
                      : isTrial
                      ? `أنت الآن في الفترة التجريبية المجانية (متبقي ${subscriptionState?.daysRemaining || 0} يوم)`
                      : `اشتراكك السحابي نشط (متبقي ${subscriptionState?.daysRemaining || 0} يوم)`}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                      isExpired
                        ? 'bg-rose-900/60 border-rose-700 text-rose-300'
                        : isTrial
                        ? 'bg-amber-900/60 border-amber-600 text-amber-300'
                        : 'bg-emerald-900/60 border-emerald-600 text-emerald-300'
                    }`}
                  >
                    {isExpired ? 'اشتراك منتهي' : isTrial ? '14 يوماً مجاناً' : 'مشترك معتمد'}
                  </span>
                </div>
                <p className="text-xs text-zinc-300">
                  {isExpired
                    ? 'يرجى تجديد اشتراكك (الشهري أو السنوي) لإعادة فتح استقبال طلبات الطلاب على كورساتك فورياً.'
                    : isTrial
                    ? 'يمكنك خلال هذه الفترة رفع دوراتك وتعيين حسابات InstaPay وفودافون كاش لطلابك مجاناً.'
                    : 'جميع كورساتك نشطة وتستقبل طلبات الشراء ويتم تحويل مبالغ الطلاب على حساباتك مباشرة.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRenewModal(true)}
              className={`px-5 py-2.5 rounded-xl font-black text-xs shrink-0 shadow-lg flex items-center gap-2 transition-all hover:scale-105 cursor-pointer ${
                isExpired
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-rose-950/50'
                  : isTrial
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 shadow-amber-950/40'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{isExpired ? 'تجديد الاشتراك الآن' : 'ترقية أو تجديد الباقة'}</span>
            </button>
          </div>
        )}

        {/* Student Special Grant Callout (30 days free for students aged <= 23) */}
        {!user.isStudentInstructor && user.role !== 'ADMIN' && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-950/70 via-indigo-950/40 to-zinc-900 border-2 border-purple-500/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white">هل أنت طالب جامعي وتريد الشرح لزملائك؟ (سن 23 سنة فأقل) 🎓</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 font-black text-[10px]">منحة حصرية</span>
                </div>
                <p className="text-xs text-zinc-300">
                  ارفع كارنيه كليتك واحصل فورياً على <strong>شهر كامل مجاناً (30 يوماً تجريبية)</strong> وباقة اشتراك مدعومة بعد انتهاء الشهر.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowStudentVerifModal(true)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-zinc-950 font-black text-xs shadow-lg shadow-amber-950/40 transition-all hover:scale-105 shrink-0 cursor-pointer"
            >
              توثيق الكارنيه وتفعيل شهر مجاناً 🚀
            </button>
          </div>
        )}

        {/* Alert Messages */}
        {message && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-2 shadow-md ${
              message.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-200'
                : 'bg-rose-950/80 border border-rose-700 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-zinc-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 0: OVERVIEW (نظرة عامة والتحليلات) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat 1: Students */}
              <div className="p-5 rounded-3xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-purple-900/40 shadow-xl shadow-slate-900/5 backdrop-blur-xl space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                  <span className="text-xs font-bold">إجمالي الطلاب المسجلين</span>
                  <div className="p-2 rounded-xl bg-purple-500/15 text-purple-700 dark:text-purple-300">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {totalStudents} <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">طالب</span>
                </p>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                  <span>عبر {courses.length} دورة تدريبية</span>
                </div>
              </div>

              {/* Stat 2: Active Courses */}
              <div className="p-5 rounded-3xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-purple-900/40 shadow-xl shadow-slate-900/5 backdrop-blur-xl space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                  <span className="text-xs font-bold">الدورات التدريبية</span>
                  <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {courses.length} <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">دورة</span>
                </p>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                  <span>تتضمن {totalLessonsCount} درساً ومحاضرة</span>
                </div>
              </div>

              {/* Stat 3: Direct Revenue */}
              <div className="p-5 rounded-3xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-purple-900/40 shadow-xl shadow-slate-900/5 backdrop-blur-xl space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                  <span className="text-xs font-bold">أرباحك المباشرة المحققة</span>
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
                  {formatPrice(totalEarnedRevenue)}
                </p>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400/90 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>تحويلات مباشرة لحسابك 100%</span>
                </div>
              </div>

              {/* Stat 4: SaaS Plan */}
              <div className="p-5 rounded-3xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-purple-900/40 shadow-xl shadow-slate-900/5 backdrop-blur-xl space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                  <span className="text-xs font-bold">اشتراك استوديو المحاضر</span>
                  <div className="p-2 rounded-xl bg-blue-500/15 text-blue-700 dark:text-blue-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isExpired ? 'منتهي' : isTrial ? `${subscriptionState?.daysRemaining || 0} يوم` : 'نشط معتمد'}
                </p>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center justify-between">
                  <span>{isTrial ? 'فترة تجريبية مجانية' : 'باقة SaaS Pro'}</span>
                  <button
                    type="button"
                    onClick={() => setShowRenewModal(true)}
                    className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                  >
                    {isExpired ? 'تجديد الآن' : 'ترقية/تجديد'}
                  </button>
                </div>
              </div>
            </div>

            {/* Fast Action Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (isExpired) {
                    setMessage({ type: 'error', text: 'انتهت الفترة التجريبية، يرجى تجديد الاشتراك أولاً لإضافة دورات جديدة' });
                    return;
                  }
                  setShowAddModal(true);
                }}
                className="p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-right transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-slate-900 dark:text-white block">إضافة كورس جديد</span>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">رفع فيديوهات ومناهج تعليمية</span>
                </div>
                <Plus className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className="p-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-right transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-slate-900 dark:text-white block">
                    طلبات الطلاب {pendingPaymentsCount > 0 && `(${pendingPaymentsCount} معلق)`}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">مراجعة وتأكيد الإيصالات</span>
                </div>
                <Receipt className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('payments')}
                className="p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-right transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-slate-900 dark:text-white block">بيانات استلام أرباحي</span>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">InstaPay وفودافون كاش</span>
                </div>
                <CreditCard className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('coupons')}
                className="p-4 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-right transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-slate-900 dark:text-white block">كوبونات وأكواد الخصم</span>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">{coupons.length} كوبون نشط</span>
                </div>
                <Tag className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Pending Student Orders Callout (if any) */}
            {pendingPaymentsCount > 0 && (
              <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      يوجد لديك {pendingPaymentsCount} طلب تحويل معلق بانتظار مراجعتك وتأكيدك!
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      قام الطلاب برفع إيصالات التحويل بانتظار اعتمادك ليتم فتح محتوى الكورس لهم تلقائياً.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shrink-0 transition-all cursor-pointer"
                >
                  مراجعة الطلبات الآن
                </button>
              </div>
            )}

            {/* Recent Student Payments & Courses Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders Box */}
              <div className="p-5 rounded-3xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-purple-900/40 shadow-xl shadow-slate-900/5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">أحدث طلبات وتحويلات الطلاب</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>عرض الكل ({payments.length})</span>
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>

                {payments.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 dark:text-zinc-500 text-xs">
                    لا توجد طلبات دفع مسجلة حتى الآن.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {payments.slice(0, 5).map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <p className="font-black text-slate-900 dark:text-white truncate">
                            {p.user?.officialFullName || p.user?.firstName || 'طالب'}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                            {p.order?.course?.title || 'كورس'}
                          </p>
                        </div>
                        <div className="text-left shrink-0 space-y-0.5">
                          <span className="font-black text-amber-600 dark:text-amber-400 font-mono block">
                            {formatPrice(p.amount)}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full block text-center ${
                            p.status === 'APPROVED'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                              : p.status === 'REJECTED'
                              ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                              : 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                          }`}>
                            {p.status === 'APPROVED' ? 'مقبول' : p.status === 'REJECTED' ? 'مرفوض' : 'معلق'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Courses Overview Box */}
              <div className="p-5 rounded-3xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-purple-900/40 shadow-xl shadow-slate-900/5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">دوراتك التدريبية</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('courses')}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>إدارة الكورسات ({courses.length})</span>
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>

                {courses.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 dark:text-zinc-500 text-xs">
                    لم تقم بإضافة أي كورسات بعد. اضغط على إضافة كورس للبدء.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {courses.slice(0, 5).map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <p className="font-black text-slate-900 dark:text-white truncate">{c.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                            {c._count?.sections || 0} وحدات • {c._count?.enrollments || 0} مشترك
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-black text-slate-900 dark:text-white font-mono">
                            {formatPrice(c.price)}
                          </span>
                          <Link
                            href={`/instructor/courses/${c.id}/curriculum`}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 font-bold text-[11px] transition-colors"
                          >
                            تعديل المنهاج
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* TAB 1: COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-500/15 via-indigo-500/5 to-white/90 dark:from-surface dark:to-surface border border-blue-500/30 shadow-lg shadow-blue-900/5 backdrop-blur-xl space-y-2 hover:-translate-y-1 transition-all">
              <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">الدورات التدريبية النشطة</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{courses.length}</p>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-purple-500/15 via-fuchsia-500/5 to-white/90 dark:from-surface dark:to-surface border border-purple-500/30 shadow-lg shadow-purple-900/5 backdrop-blur-xl space-y-2 hover:-translate-y-1 transition-all">
              <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">إجمالي الطلاب في دوراتك</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{totalStudents} طالب</p>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-teal-500/5 to-white/90 dark:from-surface dark:to-surface border border-emerald-500/30 shadow-lg shadow-emerald-900/5 backdrop-blur-xl space-y-2 hover:-translate-y-1 transition-all">
              <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">التقييم العام للمحاضر</span>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight flex items-center gap-1.5">
                <span>4.9 / 5.0</span>
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
              </p>
            </div>
          </div>

          {/* Courses List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">الدورات التي تقدمها ({courses.length})</h2>
              <span className="text-xs text-zinc-400">يمكنك إدارة المنهج، رفع الفيديوهات، ومتابعة الطلاب</span>
            </div>

            {courses.length === 0 ? (
              <div className="p-12 rounded-3xl bg-surface border border-border text-center space-y-4">
                <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
                <h3 className="text-base font-bold text-white">لا توجد لديك دورات حالياً</h3>
                <p className="text-xs text-zinc-400">قم بإضافة أول دورة تدريبية لك في الأكاديمية خلال فترتك التجريبية</p>
                <button
                  type="button"
                  onClick={() => {
                    setModalError(null);
                    setShowAddModal(true);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-zinc-950 font-black text-xs inline-flex items-center gap-2 shadow-lg shadow-amber-950/40"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة كورس جديد</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="p-6 rounded-3xl bg-surface border border-border space-y-4 shadow-lg hover:border-primary-600/50 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                            {course.status === 'PUBLISHED' ? 'منشور للطلاب' : 'مسودة'}
                          </span>
                          <h3 className="text-base font-bold text-white leading-snug">{course.title}</h3>
                        </div>
                        <span className="text-base font-black text-primary-300 shrink-0">
                          {formatPrice(course.price)}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-surface-raised border border-border/80 text-xs text-zinc-400 flex items-center justify-between">
                        <span>{course._count?.sections || 0} وحدات تعليمية</span>
                        <span>{course._count?.enrollments || 0} طالب مشترك</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                      <Link
                        href={`/instructor/courses/${course.id}/curriculum`}
                        className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-center text-xs font-bold shadow-md shadow-primary-950/50 transition-all"
                      >
                        إدارة المحتوى والدروس والفيديوهات
                      </Link>

                      <Link
                        href={`/courses/${course.slug}`}
                        target="_blank"
                        className="p-2.5 rounded-xl bg-surface-raised hover:bg-surface-card border border-border text-zinc-300 hover:text-white transition-colors"
                        title="معاينة الكورس كما يراه الطالب"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setDeletingCourse(course)}
                        className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/80 text-rose-400 hover:text-rose-200 transition-colors"
                        title="حذف الكورس"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DIRECT PAYMENT SETTINGS */}
      {activeTab === 'payments' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-6 max-w-3xl">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              إعدادات استلام أموالك مباشرة من الطلاب
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              عند قيام أي طالب بشراء كورساتك، ستظهر له هذه البيانات في صفحة الدفع ليقوم بالتحويل لحساباتك فورياً دون وسيط.
            </p>
          </div>

          <form onSubmit={handleSavePaymentSettings} className="space-y-5">
            {/* InstaPay Setup */}
            <div className="p-5 rounded-2xl bg-surface-raised border border-border/80 space-y-4">
              <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                بيانات حساب إنستاباي (InstaPay IPN):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">عنوان الدفع اللحظي (IPA / إنستاباي):</label>
                  <input
                    type="text"
                    value={paymentSettings.instapayAddress}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, instapayAddress: e.target.value })}
                    placeholder="مثال: coach.ali@instapay"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-primary-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">اسم صاحب الحساب المعتمد:</label>
                  <input
                    type="text"
                    value={paymentSettings.instapayName}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, instapayName: e.target.value })}
                    placeholder="الاسم كما يظهر بتطبيق البنك / إنستاباي"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Vodafone Cash Setup */}
            <div className="p-5 rounded-2xl bg-surface-raised border border-border/80 space-y-4">
              <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                رقم محفظة فودافون كاش / المحافظ الذكية:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">رقم المحفظة لتحويل الطلاب:</label>
                  <input
                    type="tel"
                    value={paymentSettings.vodafoneCashNumber}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, vodafoneCashNumber: e.target.value })}
                    placeholder="مثال: 01012345678"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-primary-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">رقم الواتساب للتواصل والدعم:</label>
                  <input
                    type="tel"
                    value={paymentSettings.phone}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, phone: e.target.value })}
                    placeholder="مثال: 01555791568"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-primary-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Custom Payment Instructions */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400">تعليمات التحويل التي ستظهر للطالب عند الدفع:</label>
              <textarea
                rows={3}
                value={paymentSettings.paymentInstructions}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, paymentInstructions: e.target.value })}
                placeholder="مثال: يرجى كتابة اسمك في وصف التحويل ورفع لقطة الشاشة ورقم العملية لتفعيل الكورس فورياً."
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingPayments}
              className="px-8 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-black text-xs shadow-lg shadow-primary-950/50 transition-all hover:scale-105 disabled:opacity-50"
            >
              {isSavingPayments ? 'جاري حفظ الإعدادات...' : 'حفظ بيانات استلام الأرباح'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: STUDENT ORDERS & APPROVALS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">طلبات التحويل وإيصالات الطلاب ({payments.length})</h2>
            <span className="text-xs text-zinc-400">راجع إيصال الطالب واضغط على تأكيد لفتح الكورس له فورياً</span>
          </div>

          {payments.length === 0 ? (
            <div className="p-12 rounded-3xl bg-surface border border-border text-center space-y-3">
              <Receipt className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">لا توجد طلبات انضمام حالياً</h3>
              <p className="text-xs text-zinc-400">ستظهر هنا أي طلبات دفع جديدة من الطلاب لكورساتك</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-border bg-surface">
              <table className="w-full text-right text-xs">
                <thead className="bg-surface-raised border-b border-border text-zinc-400 font-bold">
                  <tr>
                    <th className="p-3.5">الطالب</th>
                    <th className="p-3.5">الكورس</th>
                    <th className="p-3.5">المبلغ</th>
                    <th className="p-3.5">وسيلة الدفع</th>
                    <th className="p-3.5">رقم المعاملة والإيصال</th>
                    <th className="p-3.5">الحالة</th>
                    <th className="p-3.5 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-raised/50 transition-colors">
                      <td className="p-3.5 font-bold text-white">
                        <div>{p.user?.officialFullName || p.user?.firstName}</div>
                        <div className="text-[11px] text-zinc-500 font-normal">{p.user?.email}</div>
                      </td>
                      <td className="p-3.5 text-zinc-300 font-medium">{p.order?.course?.title || 'كورس'}</td>
                      <td className="p-3.5 font-black text-emerald-400">{formatPrice(p.amount)}</td>
                      <td className="p-3.5 text-zinc-300">
                        <span className="px-2 py-0.5 rounded bg-surface-raised border border-border text-[10px] font-bold">
                          {p.paymentMethod === 'INSTAPAY' ? 'إنستاباي' : 'فودافون كاش'}
                        </span>
                      </td>
                      <td className="p-3.5 text-zinc-300">
                        <div className="font-mono text-[11px]">{p.transactionId || 'بدون رقم معاملة'}</div>
                        {p.screenshotUrl && (
                          <button
                            type="button"
                            onClick={() => setViewingScreenshot(p.screenshotUrl)}
                            className="text-[11px] text-amber-500 hover:text-amber-400 font-bold mt-0.5 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>معاينة الإيصال</span>
                            <Eye className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            p.status === 'APPROVED'
                              ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
                              : p.status === 'REJECTED'
                              ? 'bg-rose-950 border-rose-800 text-rose-300'
                              : 'bg-amber-950 border-amber-800 text-amber-300'
                          }`}
                        >
                          {p.status === 'APPROVED' ? 'تم التفعيل' : p.status === 'REJECTED' ? 'مرفوض' : 'قيد المراجعة'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        {p.status === 'PENDING' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              disabled={processingPaymentId === p.id}
                              onClick={() => handleOrderAction(p.id, 'APPROVE')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm disabled:opacity-50 transition-all"
                            >
                              تأكيد وفتح الكورس
                            </button>
                            <button
                              type="button"
                              disabled={processingPaymentId === p.id}
                              onClick={() => handleOrderAction(p.id, 'REJECT')}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-[11px] transition-all"
                            >
                              رفض
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-zinc-500">تم حسم الطلب</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SUBSCRIPTION (باقة اشتراك الاستوديو) */}
      {activeTab === 'subscription' && (
        <div className="space-y-6 max-w-4xl">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-purple-900/40 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-500">نظام الاشتراكات السحابية للمحاضرين</span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>تفاصيل باقة اشتراك استوديو المحاضر (SaaS)</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  امتلك أكاديميتك الخاصة دون أي نسبة استقطاع من مبيعاتك مع أحدث تقنيات التعليم الرقمي.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowRenewModal(true)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
              >
                {isExpired ? 'تجديد الاشتراك الآن' : 'ترقية أو تجديد الباقة'}
              </button>
            </div>

            {/* Current Status Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 space-y-1">
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-bold">نوع الباقة الحالية</span>
                <p className="text-base font-black text-slate-900 dark:text-white">
                  {user.subscriptionPlan === 'FREE_TRIAL' ? 'فترة تجريبية مجانية (14 يوماً)' : user.subscriptionPlan || 'باقة المحاضر Pro'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 space-y-1">
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-bold">حالة الحساب</span>
                <p className={`text-base font-black ${
                  isExpired ? 'text-rose-500' : isTrial ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {isExpired ? 'منتهي الصلاحية' : isTrial ? `تجريبي (متبقي ${subscriptionState?.daysRemaining || 0} يوم)` : 'نشط ومعتمد'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 space-y-1">
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-bold">نسبة عمولة المنصة</span>
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  0% (أرباحك 100% لك)
                </p>
              </div>
            </div>

            {/* Included Features */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">ما تتضمنه باقة المحاضر المحترف:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-zinc-300">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>استقبال تحويلات الطلاب على InstaPay وفودافون كاش بدون وسيط</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>رفع الفيديوهات السحابية وحمايتها ضد التحميل والتسجيل</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>بنك أسئلة واختبارات تفاعلية وتصحيح تلقائي وإصدار شهادات</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>إنشاء كوبونات وأكواد خصم ترويجية غير محدودة لكورساتك</span>
                </div>
              </div>
            </div>

            {/* Plans Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl border-2 border-slate-200 dark:border-zinc-800 space-y-3">
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">الباقة الشهرية</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">290</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-bold">ج.م / شهرياً</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400">تجديد مرن شهر بشهر مع الحفاظ على كافة دوراتك وبيانات طلابك.</p>
                <button
                  type="button"
                  onClick={() => {
                    setRenewPlan('MONTHLY');
                    setShowRenewModal(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-bold text-slate-900 dark:text-white transition-colors cursor-pointer"
                >
                  اختيار الباقة الشهرية
                </button>
              </div>

              <div className="p-5 rounded-2xl border-2 border-amber-500 bg-amber-500/5 dark:bg-amber-500/10 space-y-3 relative">
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black">
                  الأكثر توفيراً (وفر شهرين)
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">الباقة السنوية (12 شهر)</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">2,900</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-bold">ج.م / سنوياً</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400">راحة بال لعام كامل بدون قلق بشأن تجديد الاشتراكات مع دعم فني متقدم.</p>
                <button
                  type="button"
                  onClick={() => {
                    setRenewPlan('ANNUAL');
                    setShowRenewModal(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-md shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
                >
                  اختيار الباقة السنوية الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-400" />
              إنشاء كود خصم جديد لطلابك
            </h2>
            <p className="text-xs text-zinc-400">
              الكوبونات التي تنشئها هنا تطبق حصرياً على كورساتك الخاصة ولا تنطبق على كورسات المحاضرين الآخرين.
            </p>

            <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">كود الخصم (مثال: SUMMER30):</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  placeholder="CODE20"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs font-mono font-bold uppercase focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400">نسبة الخصم (%):</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={newCoupon.discountValue}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400">أقصى عدد استخدامات:</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newCoupon.maxUses}
                  onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: parseInt(e.target.value) || 100 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isCreatingCoupon}
                  className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-black text-xs shadow-md shadow-primary-950/50 transition-all hover:scale-105 disabled:opacity-50"
                >
                  {isCreatingCoupon ? 'جاري الإنشاء...' : 'إضافة الكوبون'}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">كوبونات الخصم النشطة ({coupons.length})</h3>
            {coupons.length === 0 ? (
              <p className="text-xs text-zinc-500">لم تقم بإنشاء أي كوبونات حتى الآن.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-surface border border-border space-y-2 relative group">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg bg-primary-950 border border-primary-800 text-primary-300 font-mono font-black text-sm">
                        {c.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(c.id)}
                        className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                        title="حذف الكوبون"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-zinc-300">
                      خصم: <span className="font-bold text-white">{c.discountValue}%</span>
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      مرات الاستخدام: {c._count?.usages || c.usedCount || 0} من أصل {c.maxUses}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      </main>

      {/* RENEWAL / UPGRADE MODAL */}
      {showRenewModal && mounted && createPortal(
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full rounded-3xl bg-surface border border-border p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 my-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="space-y-0.5">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  تجديد أو ترقية اشتراك الأكاديمية
                </h3>
                <p className="text-xs text-zinc-400">اختر باقة الاشتراك وقم بالتحويل لإدارة المنصة لتفعيل حسابك</p>
              </div>
              <button onClick={() => setShowRenewModal(false)} className="text-zinc-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plan Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setRenewPlan('STUDENT_PRO')}
                className={`p-3.5 rounded-2xl border text-right transition-all space-y-1 relative ${
                  renewPlan === 'STUDENT_PRO'
                    ? 'bg-purple-950/70 border-purple-500 shadow-md ring-1 ring-purple-500'
                    : 'bg-surface-raised border-border text-zinc-400'
                }`}
              >
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black inline-block mb-1">
                  🎓 للطلبة (سن 23 فأقل)
                </span>
                <span className="text-xs font-bold text-white block">باقة المحاضر الطالب</span>
                <span className="text-lg font-black text-purple-300 block">120 ج.م</span>
                <span className="text-[10px] text-zinc-400 block">دعم خاص للجامعيين</span>
              </button>

              <button
                type="button"
                onClick={() => setRenewPlan('MONTHLY')}
                className={`p-3.5 rounded-2xl border text-right transition-all space-y-1 ${
                  renewPlan === 'MONTHLY'
                    ? 'bg-primary-950/60 border-primary-500 shadow-md ring-1 ring-primary-500'
                    : 'bg-surface-raised border-border text-zinc-400'
                }`}
              >
                <span className="text-xs font-bold text-white block">اشتراك شهري محترف</span>
                <span className="text-lg font-black text-primary-300 block">290 ج.م</span>
                <span className="text-[10px] text-zinc-400 block">مرونة شهرية عامة</span>
              </button>

              <button
                type="button"
                onClick={() => setRenewPlan('ANNUAL')}
                className={`p-3.5 rounded-2xl border text-right transition-all space-y-1 relative ${
                  renewPlan === 'ANNUAL'
                    ? 'bg-primary-950/60 border-primary-500 shadow-md ring-1 ring-primary-500'
                    : 'bg-surface-raised border-border text-zinc-400'
                }`}
              >
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                  وفر شهرين!
                </span>
                <span className="text-xs font-bold text-white block">اشتراك سنوي شامل</span>
                <span className="text-lg font-black text-emerald-400 block">2,900 ج.م</span>
                <span className="text-[10px] text-zinc-400 block">العام الأكثر توفيراً</span>
              </button>
            </div>

            {/* Admin Payment Accounts Box */}
            <div className="p-4 rounded-2xl bg-surface-raised border border-border space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">حساب إنستاباي الإدارة:</span>
                <div className="flex items-center gap-1.5 font-mono text-amber-300 font-bold">
                  <span>{platformSettings['INSTAPAY_ACCOUNT'] || 'qimam.edu@instapay'}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(platformSettings['INSTAPAY_ACCOUNT'] || 'qimam.edu@instapay', 'instapay')}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    {copiedKey === 'instapay' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">محفظة فودافون كاش الإدارة:</span>
                <div className="flex items-center gap-1.5 font-mono text-rose-300 font-bold">
                  <span>{platformSettings['VODAFONE_CASH_NUMBER'] || '01555791568'}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(platformSettings['VODAFONE_CASH_NUMBER'] || '01555791568', 'vodafone')}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    {copiedKey === 'vodafone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitRenewal} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300">طريقة التحويل التي استخدمتها:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRenewMethod('INSTAPAY')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      renewMethod === 'INSTAPAY'
                        ? 'bg-purple-900/50 border-purple-500 text-white'
                        : 'bg-surface-raised border-border text-zinc-400'
                    }`}
                  >
                    إنستاباي
                  </button>
                  <button
                    type="button"
                    onClick={() => setRenewMethod('VODAFONE_CASH')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      renewMethod === 'VODAFONE_CASH'
                        ? 'bg-rose-900/50 border-rose-500 text-white'
                        : 'bg-surface-raised border-border text-zinc-400'
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
                  value={renewTxId}
                  onChange={(e) => setRenewTxId(e.target.value)}
                  placeholder="رقم العملية من التطبيق"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300">صورة أو لقطة شاشة لإيصال التحويل:</label>
                <FileUploadInput
                  label="صورة أو لقطة شاشة لإيصال التحويل"
                  accept="image/*"
                  currentValue={renewScreenshot}
                  onUploadComplete={(url: string) => setRenewScreenshot(url)}
                  folder="payments"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRenewModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-card border border-border text-zinc-300 text-xs font-bold transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRenew}
                  className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-black shadow-md disabled:opacity-50 transition-all hover:scale-105"
                >
                  {isSubmittingRenew ? 'جاري الإرسال...' : 'تأكيد وإرسال الإيصال للإدارة'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* SCREENSHOT MODAL */}
      {viewingScreenshot && mounted && createPortal(
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full rounded-3xl bg-surface border border-border p-4 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-bold text-white">إيصال تحويل الطالب</span>
              <button onClick={() => setViewingScreenshot(null)} className="text-zinc-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto rounded-2xl">
              <img src={viewingScreenshot} alt="إيصال التحويل" className="w-full h-auto object-contain rounded-xl" />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* NEW COURSE MODAL */}
      {showAddModal && mounted && createPortal(
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full rounded-3xl bg-surface border border-border p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="space-y-0.5">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary-400" />
                  إنشاء كورس تدريبي جديد
                </h3>
                <p className="text-xs text-zinc-400">ستتمكن بعد الإنشاء من إضافة الفيديوهات والاختبارات والمرفقات</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-bold">عنوان الكورس:</label>
                <input
                  type="text"
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="مثال: دبلومة تطوير الواجهات الأمامية بـ React و Next.js"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-bold">وصف تسويقي مختصر:</label>
                <input
                  type="text"
                  value={newCourse.shortDescription}
                  onChange={(e) => setNewCourse({ ...newCourse, shortDescription: e.target.value })}
                  placeholder="جملة موجزة تشرح الفائدة الكبرى من الكورس"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-bold">صورة الغلاف (Thumbnail):</label>
                <FileUploadInput
                  label="صورة الغلاف (Thumbnail)"
                  accept="image/*"
                  currentValue={newCourse.thumbnail}
                  onUploadComplete={(url: string) => setNewCourse((prev) => ({ ...prev, thumbnail: url }))}
                  folder="thumbnails"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-300 font-bold">سعر الكورس (ج.م):</label>
                  <input
                    type="number"
                    min="0"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-300 font-bold">المدة المتوقعة (ساعات):</label>
                  <input
                    type="number"
                    min="1"
                    value={newCourse.durationHours}
                    onChange={(e) => setNewCourse({ ...newCourse, durationHours: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-card border border-border text-zinc-300 text-xs font-bold transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-black shadow-md disabled:opacity-50 transition-all hover:scale-105"
                >
                  {isCreating ? 'جاري الإنشاء...' : 'إنشاء الكورس الآن'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* COURSE DELETE CONFIRMATION MODAL */}
      {deletingCourse && mounted && createPortal(
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-surface border border-rose-900/50 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-white">تأكيد حذف الكورس</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف كورس <span className="text-white font-bold">"{deletingCourse.title}"</span>؟
                سيتم حذف كافة الدروس والملفات والاختبارات المرتبطة به.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCourse(null)}
                className="flex-1 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-card border border-border text-zinc-300 text-xs font-bold"
              >
                تراجع
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteCourse}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md disabled:opacity-50"
              >
                {isDeleting ? 'جاري الحذف...' : 'نعم، احذف الكورس'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* STUDENT INSTRUCTOR VERIFICATION MODAL */}
      <StudentVerificationModal
        isOpen={showStudentVerifModal}
        onClose={() => setShowStudentVerifModal(false)}
        currentUser={user}
        onSuccess={() => {
          setMessage({
            type: 'success',
            text: 'تم إرسال طلب التوثيق وتفعيل شهر مجاناً (30 يوماً) في استوديو الأكاديمية بنجاح!',
          });
          router.refresh();
        }}
      />
    </div>
  );
}
