import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import {
  Shield,
  Eye,
  Lock,
  Database,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  let title = 'سياسة الخصوصية وأمان البيانات';
  let platformName = 'أكاديمية م / محمد إبراهيم';
  try {
    const settings = await prisma.platformSetting.findMany();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    if (map['PLATFORM_NAME']) platformName = map['PLATFORM_NAME'].replace(/سنجر/g, '').trim() || platformName;
  } catch (e) {}

  return {
    title: `${title} | ${platformName}`,
    description: `سياسة الخصوصية وحماية بيانات المستخدمين والطلاب في ${platformName}.`,
    alternates: { canonical: '/privacy' },
  };
}

export default async function PrivacyPage() {
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>حماية وسرية البيانات المشفرة</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
          سياسة الخصوصية وأمان البيانات
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          نلتزم في {platformName} بحماية خصوصيتك وسرية بياناتك الأكاديمية والشخصية بأعلى معايير التشفير والأمان العالمية.
        </p>

        <p className="text-[11px] text-emerald-400/80 font-mono">
          آخر تحديث: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Policy Details */}
      <div className="space-y-6">
        
        {/* 1. البيانات التي نجمعها */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#110d24] border border-slate-200 dark:border-zinc-800/80 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">1. ما هي البيانات التي نجمعها؟</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">بيانات الحساب والاشتراك والشهادات</p>
            </div>
          </div>
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed pr-2">
            <p>• <strong>البيانات الشخصية الأساسية</strong>: الاسم الرسمي، البريد الإلكتروني، رقم الهاتف، والجامعة/التخصص (في حالة المحاضرين الطلاب).</p>
            <p>• <strong>البيانات الأكاديمية</strong>: سجل التقدم في الدروس، نتائج الاختبارات والواجبات، والشهادات الصادرة.</p>
            <p>• <strong>بيانات المعاملات المالية</strong>: إيصالات التحويل وأرقام العمليات المؤكدة (لا نحتفظ ببيانات البطاقات البنكية الحساسة حيث تُعالج عبر بوابات مشفرة معتمدة).</p>
          </div>
        </section>

        {/* 2. كيف نستخدم بياناتك */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#110d24] border border-slate-200 dark:border-zinc-800/80 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">2. كيف نستخدم ونوظف بياناتك؟</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">أغراض تقديم الخدمة وتوثيق الشهادات</p>
            </div>
          </div>
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed pr-2">
            <p>• توفير الوصول السلس للكورسات والمذكرات الرقمية وتتبع نسب الإنجاز.</p>
            <p>• إصدار وتوثيق شهادات التخرج الرسمية وتوليد رموز الاستجابة السريعة (QR Codes) للتحقق العام من مصداقية وثائق الطلاب.</p>
            <p>• إرسال الإشعارات الأكاديمية والتحديثات الهامة حول الكورسات والدبلومات المسجل بها.</p>
          </div>
        </section>

        {/* 3. أمان وتشفير البيانات */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#110d24] border border-slate-200 dark:border-zinc-800/80 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">3. أمان وتشفير البيانات</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">تشفير SSL/TLS وجدران الحماية</p>
            </div>
          </div>
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed pr-2">
            <p>• نطبق أعلى بروتوكولات الأمان مع تشفير كامل لكافة الاتصالات والبيانات عبر بروتوكول HTTPS/TLS.</p>
            <p>• كلمات المرور تُخزن بتشفير هاش غير قابل للعكس (Bcrypt Salted Hashing).</p>
            <p>• لا نقوم إطلاقاً ببيع أو تأجير بيانات أي مستخدم لأي أطراف ثالثة لأغراض دعائية أو تسويقية.</p>
          </div>
        </section>

        {/* 4. حقوق المستخدم والتواصل */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">4. حقوقك والتواصل مع مسؤول الخصوصية</h2>
              <p className="text-xs text-slate-400">تعديل البيانات وإدارتها</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            يحق لك في أي وقت مراجعة أو تعديل بيانات ملفك الشخصي عبر لوحة التحكم. لأي استفسار حول سياسة الخصوصية، يرجى مراسلتنا على{' '}
            <a href={`mailto:${contactEmail}`} className="text-amber-400 font-mono underline font-bold">{contactEmail}</a>.
          </p>
        </section>

      </div>

      {/* Back to Home Button */}
      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <span>العودة للصفحة الرئيسية</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
