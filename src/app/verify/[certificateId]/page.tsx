import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import QRCode from 'qrcode';
import {
  ShieldCheck,
  Award,
  Calendar,
  Clock,
  Printer,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import PrintCertificateButton from './PrintCertificateButton';

interface Props {
  params: { certificateId: string };
}

export default async function CertificateVerificationPage({ params }: Props) {
  const certId = params.certificateId.trim().toUpperCase();

  const certificate = await prisma.certificate.findFirst({
    where: {
      OR: [
        { certificateNumber: certId },
        { id: certId }
      ]
    },
    include: {
      course: { select: { title: true, slug: true, durationHours: true } },
      diploma: { select: { title: true, slug: true, durationHours: true } },
      template: true,
    }
  });

  if (!certificate) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white">الشهادة غير موجودة أو غير مسجلة</h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          لم يتم العثور على أي شهادة مسجلة برقم <strong className="text-rose-400 font-mono">{params.certificateId}</strong>. يرجى التأكد من كتابة الكود بشكل صحيح.
        </p>
        <Link
          href="/verify"
          className="inline-block px-6 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-bold"
        >
          البحث عن شهادة أخرى
        </Link>
      </div>
    );
  }

  // Generate QR Code data URL
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/${certificate.certificateNumber}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    width: 200,
    margin: 1,
    color: { dark: '#1e1b4b', light: '#ffffff' }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Verification Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>وثيقة رسمية موثقة ومعتمدة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            التحقق من شهادة التخرج الرسمية
          </h1>
        </div>

        <PrintCertificateButton />
      </div>

      {/* The Printable Master Certificate Card */}
      <div
        id="printable-certificate"
        className="p-8 sm:p-14 rounded-3xl bg-[#0d0c15] border-4 border-[#fbbf24]/50 shadow-2xl relative overflow-hidden space-y-8 select-none"
      >
        {/* Certificate Watermark Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/20 via-transparent to-amber-950/20 pointer-events-none" />

        {/* Certificate Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 via-primary-500 to-amber-400 p-[2px]">
              <div className="w-full h-full bg-[#09090b] rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-black text-white">أكاديمية قِـمَـم للتعليم والتدريب</h2>
              <p className="text-[11px] text-[#fbbf24] font-semibold">Qimam Academy of Technology & Engineering</p>
            </div>
          </div>

          <div className="text-left font-mono text-xs">
            <span className="text-zinc-500 block text-[10px]">كود التحقق الرقمي:</span>
            <span className="font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800/80">
              {certificate.certificateNumber}
            </span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="text-center space-y-4 py-4 relative z-10">
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#fbbf24] uppercase">
            شهادة إتمام معتمدة • Certificate of Completion
          </p>

          <p className="text-xs sm:text-sm text-zinc-400">تشهد إدارة الأكاديمية بأن الطالب / المهندس:</p>

          {/* Student Official Name */}
          <h2 className="text-2xl sm:text-4xl font-black text-white py-2 gradient-text tracking-wide">
            {certificate.studentOfficialName}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
            قد أتم بنجاح كافة متطلبات الدورة التدريبية والمشاريع العملية والاختبارات التقييمية لمقرر:
          </p>

          {/* Course / Diploma Title */}
          <div className="p-3.5 px-6 rounded-2xl bg-surface-card border border-primary-800/50 inline-block shadow-lg">
            <h3 className="text-base sm:text-xl font-black text-primary-300">
              {certificate.title}
            </h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>إجمالي الساعات: <strong>{certificate.totalHours} ساعة تدريبية</strong></span>
            </span>
            {certificate.grade && (
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>التقدير العام: <strong className="text-emerald-300">{certificate.grade}</strong></span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary-400" />
              <span>تاريخ المنح: <strong>{formatDate(certificate.issuedAt)}</strong></span>
            </span>
          </div>
        </div>

        {/* Certificate Footer (QR Code & Signatures) */}
        <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-1.5 bg-white rounded-xl shadow-md shrink-0">
              <img src={qrDataUrl} alt="QR Code" className="w-20 h-20" />
            </div>
            <div className="text-right text-[11px] text-zinc-400 space-y-0.5">
              <p className="font-bold text-white">رمز التحقق الذكي (QR Code)</p>
              <p>امسح الرمز للتأكد من السجل الرقمي</p>
              <p className="text-[10px] text-primary-400">verify/{certificate.certificateNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-8 text-center text-xs">
            <div className="space-y-1">
              <p className="font-serif italic text-amber-300 text-sm tracking-wider font-bold">
                {certificate.instructorName || 'م. محمد طارق'}
              </p>
              <div className="w-28 h-0.5 bg-zinc-700 mx-auto" />
              <p className="text-[10px] text-zinc-500">المحاضر المعتمد</p>
            </div>

            <div className="space-y-1">
              <p className="font-serif italic text-amber-300 text-sm tracking-wider font-bold">
                د. عبد الرحمن خالد
              </p>
              <div className="w-28 h-0.5 bg-zinc-700 mx-auto" />
              <p className="text-[10px] text-zinc-500">رئيس مجلس الإدارة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}