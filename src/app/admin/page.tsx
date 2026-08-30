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
  DollarSign,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  let studentsCount = 0;
  let coursesCount = 0;
  let diplomasCount = 0;
  let pendingPaymentsCount = 0;
  let approvedPayments: any[] = [];
  let recentOrders: any[] = [];
  let recentAudits: any[] = [];

  try {
    const res = await Promise.all([
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
    studentsCount = res[0];
    coursesCount = res[1];
    diplomasCount = res[2];
    pendingPaymentsCount = res[3];
    approvedPayments = res[4];
    recentOrders = res[5];
    recentAudits = res[6];
  } catch (e) {
    console.error('Failed to fetch admin overview stats:', e);
  }

  const totalRevenue = approvedPayments.reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header (Clean, Gold Glow, Lifted Up) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-amber-500/20">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-[1.75rem] font-black tracking-tight leading-tight">
            <span className="text-slate-900 dark:text-white">نظرة عامة والتحليلات </span>
            <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 dark:from-amber-300 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-transparent">
              الأكاديمية
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">
            متابعة فورية للمبيعات، الطلاب، المدفوعات، وسير المنصة
          </p>
        </div>

        {pendingPaymentsCount > 0 && (
          <Link
            href="/admin/payments"
            className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/15 to-orange-500/20 border border-amber-400/80 text-amber-900 dark:text-amber-300 text-xs font-black flex items-center gap-2 animate-pulse shadow-sm"
          >
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>يوجد ({pendingPaymentsCount}) مدفوعات بانتظار المراجعة!</span>
          </Link>
        )}
      </div>

      {/* KPI Stats Grid - Multi-Color Frosted Luxury Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Revenue Card */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#16122d]/90 border border-emerald-500/30 dark:border-emerald-500/30 shadow-lg shadow-emerald-900/5 backdrop-blur-xl space-y-1.5 hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">إجمالي الإيرادات</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{formatPrice(totalRevenue)}</p>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            مدفوعات مؤكدة ومعتمدة
          </span>
        </div>

        {/* Students Card */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#16122d]/90 border border-blue-500/30 dark:border-blue-500/30 shadow-lg shadow-blue-900/5 backdrop-blur-xl space-y-1.5 hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">الطلاب المسجلين</span>
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{studentsCount}</p>
          <span className="text-[11px] text-blue-700 dark:text-zinc-400 font-bold">حسابات نشطة بالمنصة</span>
        </div>

        {/* Courses & Diplomas Card */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#16122d]/90 border border-purple-500/30 dark:border-purple-500/30 shadow-lg shadow-purple-900/5 backdrop-blur-xl space-y-1.5 hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">الكورسات والدبلومات</span>
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{coursesCount + diplomasCount}</p>
          <span className="text-[11px] text-purple-700 dark:text-purple-300 font-bold">{coursesCount} كورس • {diplomasCount} دبلومة</span>
        </div>

        {/* Pending Review Card */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#16122d]/90 border border-amber-500/40 dark:border-amber-500/40 shadow-lg shadow-amber-900/5 backdrop-blur-xl space-y-1.5 hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">بانتظار المراجعة</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center shadow-md shadow-amber-500/20">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">{pendingPaymentsCount}</p>
          {pendingPaymentsCount > 0 ? (
            <Link href="/admin/payments" className="text-[11px] text-amber-700 dark:text-amber-400 font-black hover:underline block">
              الانتقال للمراجعة ←
            </Link>
          ) : (
            <span className="text-[11px] text-slate-400 dark:text-zinc-500">لا توجد طلبات معلقة</span>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#16122d]/90 border border-slate-200 dark:border-amber-500/20 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>أحدث طلبات الاشتراك والمدفوعات</span>
          </h3>
          <Link href="/admin/payments" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
            عرض كافة العمليات ←
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400">
                <th className="pb-2.5 pr-2">رقم الطلب</th>
                <th className="pb-2.5">الطالب</th>
                <th className="pb-2.5">المقرر التدريبي</th>
                <th className="pb-2.5">المبلغ</th>
                <th className="pb-2.5">وسيلة الدفع</th>
                <th className="pb-2.5">الحالة</th>
                <th className="pb-2.5">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
              {recentOrders.map((order) => {
                const isApproved = order.payment?.status === 'APPROVED' || order.status === 'COMPLETED';
                const isPending = order.payment?.status === 'PENDING';

                return (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="py-2.5 pr-2 font-mono font-bold text-slate-700 dark:text-zinc-300">{order.orderNumber}</td>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{order.user.officialFullName}</td>
                    <td className="py-2.5 text-slate-700 dark:text-zinc-300">{order.course?.title || order.diploma?.title}</td>
                    <td className="py-2.5 font-black text-emerald-600 dark:text-emerald-400">{formatPrice(order.finalAmount)}</td>
                    <td className="py-2.5 text-slate-600 dark:text-zinc-400">
                      {order.payment?.paymentMethod === 'INSTAPAY'
                        ? 'إنستاباي'
                        : order.payment?.paymentMethod === 'VODAFONE_CASH'
                        ? 'فودافون كاش'
                        : order.payment?.paymentMethod || 'يدوي'}
                    </td>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isApproved
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : isPending
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                      }`}>
                        {isApproved ? 'معتمد' : isPending ? 'قيد المراجعة' : 'ملغي'}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-500 dark:text-zinc-400 text-[11px] font-mono">{formatDate(order.createdAt)}</td>
                  </tr>
                );
              })}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-500 dark:text-zinc-400">
                    لا توجد طلبات مدفوعات مسجلة حتى الآن.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}