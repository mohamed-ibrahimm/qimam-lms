import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import {
  HelpCircle,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupportPage() {
  const user = await getCurrentUser();

  let tickets: any[] = [];
  if (user) {
    try {
      tickets = await prisma.supportTicket.findMany({
        where: user.role === 'ADMIN' ? {} : { userId: user.id },
        orderBy: { updatedAt: 'desc' },
        include: {
          user: { select: { officialFullName: true, email: true } },
          _count: { select: { messages: true } }
        }
      });
    } catch (e) {
      console.error('Failed to fetch support tickets:', e);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary-400" />
            مركز المساعدة وتذاكر الدعم الفني
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            تابع استفساراتك ومشكلاتك التقنية والمالية مع فريق الدعم المتخصص
          </p>
        </div>

        {user && (
          <Link
            href="/support/new"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-primary-900/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>فتح تذكرة دعم جديدة</span>
          </Link>
        )}
      </div>

      {!user ? (
        <div className="p-12 text-center rounded-3xl bg-surface border border-border space-y-4">
          <HelpCircle className="w-12 h-12 text-zinc-600 mx-auto" />
          <p className="text-sm font-bold text-white">يرجى تسجيل الدخول لعرض تذاكر الدعم الخاصة بك</p>
          <Link
            href="/login?callbackUrl=/support"
            className="inline-block px-6 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-bold"
          >
            تسجيل الدخول
          </Link>
        </div>
      ) : tickets.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-surface border border-border space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-white">لا توجد لديك تذاكر دعم مفتوحة</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            إذا واجهتك أي مشكلة في الدفع أو تشغيل الدروس أو الشهادات، يمكنك فتح تذكرة جديدة وسنرد عليك فوراً.
          </p>
          <Link
            href="/support/new"
            className="inline-block px-6 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-bold"
          >
            فتح تذكرة الآن
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((t) => (
            <Link
              key={t.id}
              href={`/support/${t.id}`}
              className="p-5 rounded-2xl bg-surface border border-border hover:border-primary-600/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 block group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-primary-400 bg-primary-950 px-2 py-0.5 rounded border border-primary-900">
                    {t.ticketNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      t.status === 'OPEN'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : t.status === 'IN_PROGRESS'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {t.status === 'OPEN' ? 'مفتوحة' : t.status === 'IN_PROGRESS' ? 'قيد المتابعة' : 'مغلقة ومحلولة'}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {t.category === 'BILLING' ? 'المدفوعات' : t.category === 'TECHNICAL' ? 'مشكلة تقنية' : 'محتوى الكورسات'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors">
                  {t.subject}
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs text-zinc-500 self-end sm:self-auto">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t._count.messages} ردود</span>
                </span>
                <span>{formatDate(t.updatedAt)}</span>
                <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-primary-400 group-hover:-translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}