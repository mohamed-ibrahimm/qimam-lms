'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Sparkles, CheckCircle2, ShieldCheck, Copy, Check } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    maxUses: 100,
    perUserLimit: 1,
    minOrderAmount: 0,
    count: 1,
  });

  const loadCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('تم توليد الكوبون بنجاح!');
        setFormData({ ...formData, code: '' });
        loadCoupons();
      } else {
        setMessage(data.error || 'فشل إنشاء الكوبون');
      }
    } catch (e) {
      setMessage('حدث خطأ في الاتصال');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Tag className="w-7 h-7 text-primary-400" />
            إدارة وتوليد كوبونات الخصم الذكية
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            توليد كوبونات بنسب مئوية أو مبالغ ثابتة أو كوبونات مجانية 100% مع توليد أكواد عشوائية ذكية
          </p>
        </div>
      </div>

      {/* Generator Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xl space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          توليد كوبون جديد (GENERATE COUPON)
        </h3>

        {message && (
          <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-300 text-xs font-bold">
            {message}
          </div>
        )}

        <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              كود الكوبون (اتركه فارغاً للتوليد العشوائي)
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="مثال: SAVE-7KX92P"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs font-mono uppercase focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">نوع الخصم</label>
            <select
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
            >
              <option value="PERCENTAGE">نسبة مئوية (%)</option>
              <option value="FIXED">مبلغ خصم ثابت (ج.م)</option>
              <option value="FREE_100">كوبون مجاني 100% (Free 100%)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">قيمة الخصم (% أو ج.م)</label>
            <input
              type="number"
              required
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">الحد الأقصى للاستخدام (مرات)</label>
            <input
              type="number"
              value={formData.maxUses}
              onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">الحد لكل طالب (مرة)</label>
            <input
              type="number"
              value={formData.perUserLimit}
              onChange={(e) => setFormData({ ...formData, perUserLimit: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={generating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-primary-900/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generating ? 'جاري التوليد...' : 'توليد الكوبون (GENERATE)'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Coupons Table */}
      <div className="rounded-3xl bg-surface border border-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-raised/60 text-zinc-400">
                <th className="p-4">كود الكوبون</th>
                <th className="p-4">نوع وقيمة الخصم</th>
                <th className="p-4">الاستخدامات المنجزة</th>
                <th className="p-4">الحد الأقصى</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">تاريخ الإنشاء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-surface-raised/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-mono font-bold text-primary-300">
                      <span>{c.code}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(c.code)}
                        className="text-zinc-500 hover:text-white"
                      >
                        {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>

                  <td className="p-4 font-bold text-white">
                    {c.discountType === 'PERCENTAGE'
                      ? `${c.discountValue}% خصم`
                      : c.discountType === 'FIXED'
                      ? `${c.discountValue} ج.م خصم ثابت`
                      : 'مجاني 100%'}
                  </td>

                  <td className="p-4 font-mono font-bold text-zinc-300">{c.usedCount} مرات</td>
                  <td className="p-4 text-zinc-400">{c.maxUses} مرة</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                      نشط وساري
                    </span>
                  </td>
                  <td className="p-4 text-zinc-500">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}