import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ShieldCheck, Search, Award, CheckCircle2, QrCode } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VerifySearchPage() {
  let latestCertificates: any[] = [];
  try {
    latestCertificates = await prisma.certificate.findMany({
      where: { isValid: true },
      take: 4,
      orderBy: { issuedAt: 'desc' },
    });
  } catch (e) {
    console.error('Failed to fetch latest certificates:', e);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12 text-center">
      {/* Header */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-800 flex items-center justify-center mx-auto text-primary-400">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">التحقق من صحة الشهادات الرقمية</h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          أدخل كود الشهادة أو امسح رمز الاستجابة السريعة (QR Code) للتأكد الفوري من مصداقية وصحة وثيقة التخرج الصادرة من أكاديمية قِمَم.
        </p>
      </div>

      {/* Search Input Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border max-w-xl mx-auto shadow-2xl space-y-4">
        <form action="/verify" method="GET" className="space-y-3">
          <div className="relative">
            <input
              type="text"
              name="certId"
              required
              placeholder="مثال: QIMAM-CERT-2026-8942"
              className="w-full px-5 py-4 rounded-2xl bg-surface-raised border border-border text-white text-sm font-mono text-center focus:outline-none focus:border-primary-500 uppercase"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-primary-900/40 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>فحص والتحقق من الشهادة</span>
          </button>
        </form>
      </div>

      {/* Recent Sample Verified Certificates */}
      <div className="space-y-4 pt-6 border-t border-border/80 text-right">
        <h3 className="text-xs font-bold text-zinc-400">شهادات تم التحقق منها مؤخراً (للتجربة السريعة):</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {latestCertificates.map((cert) => (
            <Link
              key={cert.id}
              href={`/verify/${cert.certificateNumber}`}
              className="p-4 rounded-2xl bg-surface border border-border hover:border-primary-500/60 transition-all flex items-center justify-between text-xs group"
            >
              <div className="space-y-1 truncate pr-2">
                <p className="font-bold text-white group-hover:text-primary-300 transition-colors truncate">
                  {cert.studentOfficialName}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">{cert.title}</p>
                <span className="text-[10px] font-mono text-primary-400 block">{cert.certificateNumber}</span>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-[10px] font-bold shrink-0">
                سارية وموثقة
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}