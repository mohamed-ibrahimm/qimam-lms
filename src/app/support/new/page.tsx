'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HelpCircle, Send, ShieldAlert } from 'lucide-react';

export default function NewTicketPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: '',
    category: 'GENERAL',
    priority: 'MEDIUM',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim() || loading) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'فشل إرسال التذكرة');
      } else {
        router.push(`/support/${data.ticket.id}`);
      }
    } catch (e) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div>
        <Link href="/support" className="text-xs text-zinc-400 hover:text-white mb-2 block">
          ← العودة لتذاكر الدعم
        </Link>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary-400" />
          فتح تذكرة دعم فني جديدة
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          اشرح استفسارك أو مشكلتك وسيقوم فريق الدعم بالرد عليك ومتابعتها.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-surface border border-border shadow-xl space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1">عنوان التذكرة *</label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="مثال: مشكلة في تفعيل الاشتراك عبر فودافون كاش"
            className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">القسم / التصنيف</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
            >
              <option value="GENERAL">عام</option>
              <option value="BILLING">المدفوعات والتحويل المالي</option>
              <option value="COURSE_CONTENT">محتوى الكورسات والاختبارات</option>
              <option value="TECHNICAL">مشكلة تقنية في المنصة</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">درجة الأهمية</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
            >
              <option value="LOW">عادية</option>
              <option value="MEDIUM">متوسطة</option>
              <option value="HIGH">عالية</option>
              <option value="URGENT">طارئة</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1">تفاصيل الرسالة أو المشكلة *</label>
          <textarea
            rows={5}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="اشرح المشكلة بالتفصيل مع ذكر أي أرقام عمليات أو تفاصيل لازمة..."
            className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-primary-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{loading ? 'جاري إرسال التذكرة...' : 'إرسال التذكرة لفريق الدعم'}</span>
        </button>
      </form>
    </div>
  );
}