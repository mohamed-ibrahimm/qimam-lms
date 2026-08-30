import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import {
  ShieldCheck,
  FileText,
  Lock,
  Award,
  CreditCard,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  let title = 'شروط وسياسة الاستخدام';
  let platformName = 'أكاديمية م / محمد إبراهيم';
  try {
    const settings = await prisma.platformSetting.findMany();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    if (map['PLATFORM_NAME']) platformName = map['PLATFORM_NAME'].replace(/سنجر/g, '').trim() || platformName;
  } catch (e) {}

  return {
    title: `${title} | ${platformName}`,
    description: `الشروط والأحكام الرسمية وسياسة استخدام الخدمات التعليمية والمذكرات الرقمية والشهادات المعتمدة في ${platformName}.`,
    alternates: { canonical: '/terms' },
  };
}

export default async function TermsPage() {
  let platformName = 'أكاديمية م / محمد إبراهيم';
  let contactEmail = 'support@qimam.academy';

  try {
    const settings = await prisma.platformSetting.findMany();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    if (map['PLATFORM_NAME']) platformName = map['PLATFORM_NAME'].replace(/سنجر/g, '').trim() || platformName;
    if (map['CONTACT_EMAIL']) contactEmail = map['CONTACT_EMAIL'];
  } catch (e) {}

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 text-right">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-slate-950/80 border border-slate-800 p-8 sm:p-12 overflow-hidden text-center shadow-2xl backdrop-blur-xl space-y-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>وثيقة الشروط والسياسات الرسمية</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
          شروط وسياسة الاستخدام
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          أهلاً بك في {platformName}. تحكم هذه الوثيقة شروط استخدامك للمنصة، الكورسات التدريبية، مكتبة المذكرات الرقمية، والشهادات المعتمدة.
        </p>

        <p className="text-[11px] text-amber-400/80 font-mono">
          آخر تحديث: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Sections Grid */}
      <div className="space-y-6">
        
        {/* 1. الملكية الفكرية وحماية المحتوى */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#110d24] border border-slate-200 dark:border-zinc-800/80 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">1. الملكية الفكرية وحماية المحتوى (DRM Protection)</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">حماية الكورسات والمذكرات الرقمية والعلامات المائية</p>
            </div>
          </div>
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed pr-2">
            <p>• جميع مقاطع الفيديو، الشروحات، الأكواد البرمجية، والمذكرات الرقمية المنشورة على {platformName} هي ملكية فكرية حصرية ومحمية بموجب قوانين حماية حقوق المؤلف الدولية والمحلية.</p>
            <p>• يُحظر تماماً تصوير الشاشة، إعادة نشر، توزيع، أو بيع أي محتوى بدون تصريح كتابي مسبق من إدارة الأكاديمية.</p>
            <p>• تخضع كافة ملفات الكتب والمذكرات لنظام حماية DRM متطور يطبع بيانات الطالب (الاسم ورقم الهاتف) كعلامة مائية أمنية ديناميكية لمنع التسريب.</p>
          </div>
        </section>

        {/* 2. شروط التسجيل والحساب */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#110d24] border border-slate-200 dark:border-zinc-800/80 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">2. شروط التسجيل وأمان الحساب</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">مسؤولية البيانات والوصول الفردي</p>
            </div>
          </div>
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed pr-2">
            <p>• يجب على كل مستخدم تقديم معلومات دقيقة وصحيحة (الاسم الرسمي الكامل كما يُطلب للشهادات ورقم الهاتف الشخصي).</p>
            <p>• الحساب شخصي وغير قابل للمشاركة؛ يحق للمنصة تجميد أي حساب يُكتشف فيه تسجيل دخول متزامن غير مصرح به أو مشاركة لكلمات المرور.</p>
          </div>
        </section>

        {/* 3. المدفوعات والاشتراكات */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#110d24] border border-slate-200 dark:border-zinc-800/80 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">3. الرسوم والمدفوعات وسياسة الاسترجاع</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">بوابات الدفع الإلكتروني وتأكيد الاشتراكات</p>
            </div>
          </div>
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed pr-2">
            <p>• تُسدد الرسوم بالجنيه المصري أو ما يعادله من خلال بوابات الدفع المعتمدة (InstaPay، المحافظ الإلكترونية، البطاقات الائتمانية، كارت ميزة).</p>
            <p>• يتم تفعيل الاشتراك فور تأكيد عملية الدفع ومراجعة الإيصال تلقائياً أو يدوياً عبر لوحة الإدارة.</p>
            <p>• نظراً للطبيعة الرقمية والفورية للمحتوى والشهادات، لا يُقبل الاسترجاع بعد بدء مشاهدة أكثر من 15% من الدورة أو تنزيل المذكرات الرقمية كاملة.</p>
          </div>
        </section>

        {/* 4. الشهادات المعتمدة والتحقق الرقمي */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#110d24] border border-slate-200 dark:border-zinc-800/80 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">4. الشهادات المعتمدة والتحقق الرقمي</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">معايير منح الشهادات والتوثيق برمز QR</p>
            </div>
          </div>
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed pr-2">
            <p>• تُمنح شهادة التخرج الرسمية للطالب بعد إكمال نسبة المشاهدة المقررة واجتياز الاختبار النهائي بنجاح.</p>
            <p>• تتضمن كل شهادة كود تحقق فريد ورمز استجابة سريعة (QR Code) يمكن الرجوع إليه والتحقق من صحته في أي وقت عبر صفحة <Link href="/verify" className="text-amber-400 hover:underline font-bold">التحقق من صحة الشهادات</Link>.</p>
          </div>
        </section>

        {/* 5. الدعم الفني والتواصل */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">5. الدعم الفني والتواصل</h2>
              <p className="text-xs text-slate-400">طرق الاستفسار والمساعدة المباشرة</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            لأي استفسارات حول الشروط والسياسات أو للإبلاغ عن مشكلة، يرجى التواصل مع فريق الدعم عبر البريد الإلكتروني{' '}
            <a href={`mailto:${contactEmail}`} className="text-amber-400 font-mono underline font-bold">{contactEmail}</a> أو عبر صفحة <Link href="/support" className="text-amber-400 hover:underline font-bold">مركز المساعدة والدعم</Link>.
          </p>
        </section>

      </div>

      {/* Back to Home Button */}
      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <span>العودة للصفحة الرئيسية</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
