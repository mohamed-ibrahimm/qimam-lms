'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { HelpCircle, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.ticketId as string;

  const [ticket, setTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadTicket = async () => {
    try {
      const res = await fetch(`/api/support?id=${ticketId}`);
      const data = await res.json();
      setTicket(data.ticket);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch('/api/support', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          message: replyText.trim(),
        })
      });
      if (res.ok) {
        setReplyText('');
        loadTicket();
      }
    } catch (e) {
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    await fetch('/api/support', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, status: 'CLOSED' })
    });
    loadTicket();
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-zinc-400">جاري تحميل التذكرة...</div>;
  }

  if (!ticket) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-rose-400">التذكرة غير موجودة</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div>
        <Link href="/support" className="text-xs text-zinc-400 hover:text-white mb-2 block">
          ← العودة لكل التذاكر
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-primary-400">{ticket.ticketNumber}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  ticket.status === 'OPEN'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                {ticket.status === 'OPEN' ? 'مفتوحة' : 'مغلقة'}
              </span>
            </div>
            <h1 className="text-xl font-black text-white">{ticket.subject}</h1>
          </div>

          {ticket.status === 'OPEN' && (
            <button
              onClick={handleCloseTicket}
              className="px-4 py-2 rounded-xl bg-surface-raised hover:bg-surface-card border border-border text-xs text-zinc-300 hover:text-white transition-colors"
            >
              إغلاق التذكرة
            </button>
          )}
        </div>
      </div>

      {/* Messages List */}
      <div className="p-6 rounded-3xl bg-surface border border-border space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-white border-b border-border pb-3">سجل المحادثة والردود:</h3>

        <div className="space-y-4">
          {ticket.messages.map((m: any) => (
            <div key={m.id} className="p-4 rounded-2xl bg-surface-raised border border-border space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">
                  {m.sender?.officialFullName} • <span className="text-primary-400 font-normal">{m.senderRole === 'ADMIN' ? 'فريق الدعم (الإدارة)' : 'صاحب التذكرة'}</span>
                </span>
                <span className="text-[10px] text-zinc-500">{formatDate(m.createdAt)}</span>
              </div>
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>

        {/* Reply Box */}
        {ticket.status === 'OPEN' && (
          <form onSubmit={handleSendReply} className="pt-4 border-t border-border space-y-3">
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="اكتب ردك أو استفسارك الإضافي هنا..."
              className="w-full px-4 py-3 rounded-2xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sending || !replyText.trim()}
                className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? 'جاري الإرسال...' : 'إرسال الرد'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}