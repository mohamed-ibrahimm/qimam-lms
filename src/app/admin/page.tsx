import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  Users,
  CreditCard,
  BookOpen,
  Award,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowLeft,
  DollarSign
} from 'lucide-react';

export default async function AdminOverviewPage() {
  const [
    studentsCount,
    coursesCount,
    diplomasCount,
    pendingPaymentsCount,
    approvedPayments,
    recentOrders,
    recentAudits
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.course.count(),
    prisma.diploma.count(),
    prisma.payment.count({ where: { status: 'PENDING' } }),
    prisma.payment.findMany({ where: { status: 'APPROVED' }, select: { amount: true } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { officialFullName: true, email: true } },
        course: { select: { title: true } },
        diploma: { select: { title: true } },
        payment: true,
      }
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { officialFullName: true } } }
    })
  ]);

  const totalRevenue = approvedPayments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">نظرة عامة والتحليلات الأكاديمية</h1>
          <p className="text-xs text-zinc-400 mt-1">متابعة فورية للمبيعات، الطلاب، المدفوعات، وسير المنصة</p>
        </div>

        {pendingPaymentsCount > 0 && (
          <Link
            href="/admin/payments"
            className="px-4 py-2 rounded-xl bg-amber-950/80 border border-amber-700 text-amber-300 text-xs font-bold flex items-center gap-2 animate-pulse"
          >
            <AlertCircle className="w-4 h-4" />
            <span>يوجد ({pendingPaymentsCount}) مدفوعات بانتظار المراجعة!</span>
          </Link>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">إجمالي الإيرادات</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{formatPrice(totalRevenue)}</p>
          <span className="text-[10px] text-emerald-400">مدفوعات مؤكدة ومعتمدة</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">الطلاب المسجلين</span>
            <div className="w-7 h-7 rounded-lg bg-primary-950 text-primary-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{studentsCount}</p>
          <span className="text-[10px] text-zinc-500">حسابات نشطة بالمنصة</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">الكورسات والدبلومات</span>
            <div className="w-7 h-7 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{coursesCount + diplomasCount}</p>
          <span className="text-[10px] text-purple-300">{coursesCount} كورس • {diplomasCount} دبلومة</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">بانتظار المراجعة</span>
            <div className="w-7 h-7 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{pendingPaymentsCount}</p>
          <Link href="/admin/payments" className="text-[10px] text-amber-400 font-bold hover:underline block">
            الانتقال للمراجعة ←
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">أحدث طلبات الاشتراك والمدفوعات</h3>
          <Link href="/admin/payments" className="text-xs text-primary-400 hover:underline">
            عرض كافة العمليات
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-border/80 text-zinc-400">
                <th className="pb-3 pr-2">رقم الطلب</th>
                <th className="pb-3">الطالب</th>
                <th className="pb-3">المقرر التدريبي</th>
                <th className="pb-3">المبلغ</th>
                <th className="pb-3">وسيلة الدفع</th>
                <th className="pb-3">الحالة</th>
                <th className="pb-3">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {recentOrders.map((order) => {
                const isApproved = order.payment?.status === 'APPROVED' || order.status === 'COMPLETED';
                const isPending = order.payment?.status === 'PENDING';

                return (
                  <tr key={order.id} className="hover:bg-surface-raised/40 transition-colors">
                    <td className="py-3 pr-2 font-mono font-bold text-zinc-300">{order.orderNumber}</td>
                    <td className="py-3 font-bold text-white">{order.user.officialFullName}</td>
                    <td className="py-3 text-zinc-300">{order.course?.title || order.diploma?.title}</td>
                    <td className="py-3 font-bold text-primary-300">{formatPrice(order.finalAmount)}</td>
                    <td className="py-3 text-zinc-400">
                      {order.payment?.paymentMethod === 'INSTAPAY'
                        ? 'إنستاباي'
                        : order.payment?.paymentMethod === 'VODAFONE_CASH'
                        ? 'فودافون كاش'
                        : 'كوبون 100%'}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isApproved
                            ? 'bg-emerald-950 text-emerald-300'
                            : isPending
                            ? 'bg-amber-950 text-amber-300'
                            : 'bg-rose-950 text-rose-300'
                        }`}
                      >
                        {isApproved ? 'معتمد' : isPending ? 'معلق' : 'مرفوض'}
                      </span>
                    </td>
                    <td className="py-3 text-zinc-500">{formatDate(order.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}