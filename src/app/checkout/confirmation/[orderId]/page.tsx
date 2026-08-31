import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  BookOpen,
  ArrowLeft,
  FileText,
  AlertCircle
} from 'lucide-react';

interface Props {
  params: { orderId: string };
}

export default async function OrderConfirmationPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      course: true,
      diploma: true,
      payment: true,
      coupon: true,
    }
  });

  if (!order || order.userId !== user.id) {
    notFound();
  }

  const isApproved = order.payment?.status === 'APPROVED' || order.status === 'COMPLETED';
  const isPending = order.payment?.status === 'PENDING';
  const isRejected = order.payment?.status === 'REJECTED';

  const itemTitle = order.course?.title || order.diploma?.title || 'المحتوى التدريبي';

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Status Icon */}
      <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl shadow-2xl border bg-surface-raised">
        {isApproved ? '' : isPending ? '' : ''}
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {isApproved
            ? 'تم تأكيد طلبك والاشتراك بنجاح!'
            : isPending
            ? 'طلبك قيد المراجعة والتحقق المالي'
            : 'تعذر التحقق من عملية الدفع'}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          {isApproved
            ? `تم تفعيل اشتراكك في ${itemTitle} بنجاح. يمكنك الآن البدء في مشاهدة الدروس.`
            : isPending
            ? 'لقد استلمنا بيانات التحويل المالي ورقم العملية. يقوم فريق الإدارة حالياً بمطابقة الإيصال وسيتم فتح المحتوى تلقائياً بحسابك خلال دقائق.'
            : 'للأسف لم نتمكن من مطابقة بيانات التحويل. يرجى التواصل مع فريق الدعم الفني لمساعدتك.'}
        </p>
      </div>

      {/* Order Details Receipt Box */}
      <div className="p-6 rounded-3xl bg-surface border border-border text-right space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-white border-b border-border pb-3 flex items-center justify-between">
          <span>تفاصيل المعاملة</span>
          <span className="font-mono text-zinc-400">رقم الطلب: {order.orderNumber}</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-zinc-400">المقرر المطلوب:</span>
            <span className="font-bold text-white">{itemTitle}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-zinc-400">المبلغ المدفوع:</span>
            <span className="font-bold text-primary-400">{formatPrice(order.finalAmount)}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-zinc-400">وسيلة الدفع:</span>
            <span className="font-bold text-white">
              {order.payment?.paymentMethod === 'INSTAPAY'
                ? 'إنستاباي (InstaPay)'
                : order.payment?.paymentMethod === 'VODAFONE_CASH'
                ? 'فودافون كاش'
                : 'كوبون مجاني 100%'}
            </span>
          </div>

          {order.payment?.transactionId && (
            <div className="flex justify-between py-1 border-b border-border/40 font-mono">
              <span className="text-zinc-400">رقم المعاملة (TXN ID):</span>
              <span className="font-bold text-zinc-200">{order.payment.transactionId}</span>
            </div>
          )}

          <div className="flex justify-between py-1">
            <span className="text-zinc-400">حالة المعاملة:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                isApproved
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : isPending
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {isApproved ? 'معتمد ومفعل' : isPending ? 'قيد التدقيق من الإدارة' : 'مرفوض'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all shadow-lg"
        >
          الانتقال إلى لوحة دراستي
        </Link>
        <Link
          href="/support"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface-raised hover:bg-surface-card border border-border text-zinc-200 text-xs font-bold transition-all"
        >
          تواصل مع الدعم الفني
        </Link>
      </div>
    </div>
  );
}