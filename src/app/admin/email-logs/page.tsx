import React from 'react';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { Mail, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default async function EmailLogsPage() {
  const emails = await prisma.emailLog.findMany({
    orderBy: { sentAt: 'desc' },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Mail className="w-7 h-7 text-primary-400" />
            سجلات البريد الإلكتروني وإشعارات أولياء الأمور
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            متابعة الرسائل الصادرة، إشعارات نتائج الاختبارات المرسلة لأولياء الأمور، ورسائل تفعيل الحسابات
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-surface border border-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-raised/60 text-zinc-400">
                <th className="p-4">المستلم</th>
                <th className="p-4">عنوان الرسالة</th>
                <th className="p-4">نوع القالب</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {emails.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    لا توجد رسائل مسجلة بعد
                  </td>
                </tr>
              ) : (
                emails.map((e) => (
                  <tr key={e.id} className="hover:bg-surface-raised/30 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-white block">{e.recipientName || e.recipientEmail}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{e.recipientEmail}</span>
                    </td>
                    <td className="p-4 font-bold text-zinc-200">{e.subject}</td>
                    <td className="p-4 font-mono text-[10px] text-primary-300">{e.templateType}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          e.status === 'SENT'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {e.status === 'SENT' ? 'تم الإرسال بنجاح' : 'فشل'}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-500">{formatDate(e.sentAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}