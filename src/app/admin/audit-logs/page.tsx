import React from 'react';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { ShieldAlert, User, Activity, Clock } from 'lucide-react';

export default async function AuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      user: { select: { officialFullName: true, email: true, role: true } }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-primary-400" />
            سجلات الأمان والتدقيق (Audit Logs)
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            سجل غير قابل للتعديل لكافة الإجراءات الحساسة: عمليات الدخول، قبول المدفوعات، منح الوصول، وتوليد الشهادات
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-surface border border-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-raised/60 text-zinc-400">
                <th className="p-4">نوع الإجراء</th>
                <th className="p-4">المستخدم</th>
                <th className="p-4">الكيان / الهدف</th>
                <th className="p-4">التفاصيل</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">التاريخ والتوقيت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-raised/30 transition-colors">
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md bg-purple-950 text-purple-300 border border-purple-800 font-mono text-[10px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{log.user?.officialFullName || 'النظام'}</span>
                    <span className="text-[10px] text-zinc-400">{log.user?.email || '-'}</span>
                  </td>
                  <td className="p-4 text-zinc-300 font-mono text-[11px]">{log.entity}</td>
                  <td className="p-4 text-zinc-400 max-w-xs truncate font-mono text-[10px]">
                    {log.detailsJson || '-'}
                  </td>
                  <td className="p-4 text-zinc-500 font-mono">{log.ipAddress || '127.0.0.1'}</td>
                  <td className="p-4 text-zinc-500">{formatDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}