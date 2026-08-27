'use client';

import React, { useState, useEffect } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Eye,
  Search,
  Filter,
  ShieldCheck,
  AlertCircle,
  X
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadPayments = async () => {
    try {
      const res = await fetch('/api/admin/payments');
      const data = await res.json();
      setPayments(data.payments || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleAction = async (paymentId: string, action: 'APPROVE' | 'REJECT', notes?: string) => {
    setProcessingId(paymentId);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          action,
          adminNotes: notes || (action === 'APPROVE' ? 'تم تأكيد التحويل المالي من الإدارة' : 'لم يتم تأكيد وصول المبلغ'),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        loadPayments();
      } else {
        setMessage({ type: 'error', text: data.error || 'فشلت العملية' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال' });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.user?.officialFullName?.toLowerCase().includes(q);
      const matchEmail = p.user?.email?.toLowerCase().includes(q);
      const matchTxn = p.transactionId?.toLowerCase().includes(q);
      const matchOrder = p.order?.orderNumber?.toLowerCase().includes(q);
      return matchName || matchEmail || matchTxn || matchOrder;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-primary-400" />
            تدقيق وإدارة المدفوعات والتحويلات المالية
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            مراجعة إيصالات InstaPay وفودافون كاش وتأكيد أو رفض المعاملات لفتح المقررات
          </p>
        </div>

        <button
          onClick={loadPayments}
          className="px-4 py-2 rounded-xl bg-surface-raised hover:bg-surface-card border border-border text-xs font-bold text-white transition-colors"
        >
          تحديث البيانات 🔄
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-800 text-rose-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 bg-surface p-1.5 rounded-2xl border border-border">
          {[
            { id: 'PENDING', label: 'المعلقة (بانتظار التأكيد)', count: payments.filter((p) => p.status === 'PENDING').length },
            { id: 'APPROVED', label: 'المعتمدة', count: payments.filter((p) => p.status === 'APPROVED').length },
            { id: 'REJECTED', label: 'المرفوضة', count: payments.filter((p) => p.status === 'REJECTED').length },
            { id: 'ALL', label: 'الكل', count: payments.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStatus === tab.id
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-900/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث برقم المعاملة، الاسم، أو البريد..."
            className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-surface border border-border text-white text-xs focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-3xl bg-surface border border-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-raised/60 text-zinc-400">
                <th className="p-4">رقم الطلب / المعاملة</th>
                <th className="p-4">الطالب</th>
                <th className="p-4">المقرر المطلوب</th>
                <th className="p-4">المبلغ</th>
                <th className="p-4">وسيلة الدفع</th>
                <th className="p-4">إيصال الدفع</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-500">
                    جاري تحميل العمليات...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-zinc-500">
                    لا توجد معاملات مطابقة للفلتر المحدد
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const isPending = p.status === 'PENDING';
                  const isApproved = p.status === 'APPROVED';
                  const isRejected = p.status === 'REJECTED';
                  const itemTitle = p.order?.course?.title || p.order?.diploma?.title || '-';

                  return (
                    <tr key={p.id} className="hover:bg-surface-raised/30 transition-colors">
                      <td className="p-4 space-y-0.5">
                        <span className="font-mono font-bold text-white block">{p.order?.orderNumber}</span>
                        {p.transactionId && (
                          <span className="font-mono text-[10px] text-zinc-400 block">
                            TXN: {p.transactionId}
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-500 block">{formatDate(p.createdAt)}</span>
                      </td>

                      <td className="p-4 space-y-0.5">
                        <span className="font-bold text-white block">{p.user?.officialFullName}</span>
                        <span className="text-[10px] text-zinc-400 block">{p.user?.email}</span>
                        {p.senderPhone && (
                          <span className="text-[10px] text-primary-400 block font-mono">{p.senderPhone}</span>
                        )}
                      </td>

                      <td className="p-4 max-w-xs truncate text-zinc-300">
                        {itemTitle}
                      </td>

                      <td className="p-4 font-black text-primary-300 text-sm">
                        {formatPrice(p.amount)}
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md bg-surface-raised border border-border font-semibold text-zinc-200 text-[11px]">
                          {p.paymentMethod === 'INSTAPAY'
                            ? 'إنستاباي'
                            : p.paymentMethod === 'VODAFONE_CASH'
                            ? 'فودافون كاش'
                            : 'كوبون 100%'}
                        </span>
                      </td>

                      <td className="p-4">
                        {p.screenshotUrl ? (
                          <button
                            type="button"
                            onClick={() => setSelectedScreenshot(p.screenshotUrl)}
                            className="px-2.5 py-1 rounded-lg bg-purple-950 text-purple-300 border border-purple-800 text-[11px] font-bold flex items-center gap-1 hover:bg-purple-900"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>معاينة الإيصال</span>
                          </button>
                        ) : (
                          <span className="text-zinc-600 text-[10px]">-</span>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isApproved
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : isPending
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {isApproved ? 'معتمد ومفعل' : isPending ? 'بانتظار المراجعة' : 'مرفوض'}
                        </span>
                      </td>

                      <td className="p-4">
                        {isPending ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              disabled={processingId === p.id}
                              onClick={() => handleAction(p.id, 'APPROVE')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all disabled:opacity-50"
                              title="تأكيد التحويل وفتح الكورس فوراً"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>قبول وتفعيل</span>
                            </button>

                            <button
                              type="button"
                              disabled={processingId === p.id}
                              onClick={() => {
                                const reason = prompt('يرجى كتابة سبب رفض المعاملة:');
                                if (reason !== null) handleAction(p.id, 'REJECT', reason);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs flex items-center gap-1 transition-all disabled:opacity-50"
                              title="رفض المعاملة"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>رفض</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-500 text-center block">تم اتخاذ إجراء</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-xl w-full bg-surface border border-border rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-white">صورة إيصال التحويل المالي</h3>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="p-1 rounded-lg bg-surface-raised text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded-2xl bg-black flex items-center justify-center">
              <img
                src={selectedScreenshot}
                alt="Proof Screenshot"
                className="max-h-[65vh] w-auto object-contain rounded-xl"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="px-5 py-2 rounded-xl bg-surface-raised text-xs font-bold text-white"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}