'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Video,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Award,
  Users,
  Clock,
  Percent,
  TrendingUp,
  Smartphone,
  Star,
  Check,
  Layers,
  GraduationCap,
  BadgeCheck,
  DollarSign
} from 'lucide-react';

export default function InstructorJoinPage() {
  const [studentCount, setStudentCount] = useState(60);
  const [coursePrice, setCoursePrice] = useState(400);

  const totalRevenue = studentCount * coursePrice;
  const platformFeeWithOtherPlatforms = totalRevenue * 0.40;
  const platformProfitOurPlatform = totalRevenue;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="dynamic-drift-1 absolute top-[4%] right-[15%] w-[500px] h-[500px] bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="dynamic-drift-2 absolute top-[40%] left-[10%] w-[550px] h-[550px] bg-indigo-500/15 dark:bg-purple-600/15 rounded-full blur-[150px]" />
        <div className="dynamic-drift-3 absolute bottom-[8%] right-[25%] w-[450px] h-[450px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[130px]" />
      </div>

      {/* 1. HERO SECTION - CLASSIC LUXURY */}
      <section className="max-w-4xl mx-auto text-center pt-8 pb-16 space-y-6">
        
        {/* Prestige Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-black shadow-xs">
          <GraduationCap className="w-4 h-4 text-amber-500" />
          <span>برنامج شراكة المحاضرين والخبراء المعتمدين</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-tight">
          درّس لآلاف الطلاب واحتفظ بـ{' '}
          <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-400 bg-clip-text text-transparent">
            كامل عوائد مبيعاتك
          </span>{' '}
          مباشرة
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-slate-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed font-medium">
          استوديو تعليمي سحابي متكامل يمنحك السيطرة الكاملة على محتواك، أسعارك، وطلابك، مع تحويل فوري لعوائدك عبر InstaPay والمحافظ البنكية بدون أي اقتطاعات.
        </p>

        {/* 14-Day Free Trial Classical Banner */}
        <div className="max-w-xl mx-auto p-5 rounded-2xl bg-white/95 dark:bg-[#15102a]/95 border border-slate-200 dark:border-amber-500/30 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-right">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-lg shrink-0">
              <BadgeCheck className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 dark:text-white">فترة تجريبية مجانية لمدة 14 يوماً</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">بدون بطاقة</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">ابدأ رفع دوراتك وتجربة كافة المزايا دون أي التزام مالي.</p>
            </div>
          </div>
          <Link
            href="/register?role=instructor"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-zinc-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>بدء التجربة المجانية</span>
            <ArrowLeft className="w-4 h-4 text-zinc-950" />
          </Link>
        </div>
      </section>

      {/* 2. CORE ADVANTAGES - CLASSIC GRID */}
      <section className="max-w-6xl mx-auto py-10">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            مميزات الشراكة الأكاديمية
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            بنية تحتية متكاملة مصممة لنجاح المدرب المحترف
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-white/95 dark:bg-[#140f29]/95 border border-slate-200 dark:border-purple-900/40 shadow-lg space-y-3.5 hover:border-amber-500/50 transition-all">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Percent className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">نموذج 0% عمولة على المبيعات</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              تحتفظ بكامل إيرادات دوراتك التدريبية بنسبة 100%. لا نقتطع أي نسبة مئوية من مبيعاتك إطلاقاً.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/95 dark:bg-[#140f29]/95 border border-slate-200 dark:border-purple-900/40 shadow-lg space-y-3.5 hover:border-amber-500/50 transition-all">
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">تحصيل مباشر عبر InstaPay والمحافظ</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              يصلك إشعار التحويل البنكي أو المحفظة الإلكترونية فوراً، وتوافق على التحاق الطالب بضغطة زر واحدة.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/95 dark:bg-[#140f29]/95 border border-slate-200 dark:border-purple-900/40 shadow-lg space-y-3.5 hover:border-amber-500/50 transition-all">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">حماية متقدمة للمحتوى المرئي</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              تشفير متطور للفيديوهات لمنع التحميل غير المصرح به، مع تجربة مشاهدة عالية الدقة متوافقة مع كافة الشاشات.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/95 dark:bg-[#140f29]/95 border border-slate-200 dark:border-purple-900/40 shadow-lg space-y-3.5 hover:border-amber-500/50 transition-all">
            <div className="w-11 h-11 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">شهادات رقمية معتمدة برمز تحقق</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              إصدار تلقائي لشهادات إتمام الدورات تحمل اسمك وشعارك مع رمز QR رسمي للتحقق الإلكتروني الفوري.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/95 dark:bg-[#140f29]/95 border border-slate-200 dark:border-purple-900/40 shadow-lg space-y-3.5 hover:border-amber-500/50 transition-all">
            <div className="w-11 h-11 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">كوبونات خصم وحملات ترويجية</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              إمكانية توليد أكواد ترويجية مخصصة لطلابك ومتابعيك مع تحديد صلاحيات الاستخدام وتواريخ الانتهاء.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/95 dark:bg-[#140f29]/95 border border-slate-200 dark:border-purple-900/40 shadow-lg space-y-3.5 hover:border-amber-500/50 transition-all">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">لوحة تحكم وتحليلات أكاديمية</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              إحصائيات دقيقة عن تقدم الطلاب، نسب الإكمال، تقييمات الدروس، مع إمكانية التواصل المباشر مع المسجلين.
            </p>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE FINANCIAL COMPARISON */}
      <section className="max-w-4xl mx-auto py-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#140f29]/95 border border-slate-200 dark:border-purple-800/40 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>مقارنة العوائد المالية التفاعلية</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
              احسب الفارق الحقيقي في أرباحك الصافية
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
              مقارنة واقعية بين نموذج الأكاديمية بنسبة 0% عمولة وبين المنصات التقليدية التي تقتطع 40% من عوائدك.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-zinc-300 mb-2">
                  <span>عدد الطلاب المتوقع:</span>
                  <span className="text-amber-600 dark:text-amber-400 text-sm font-black">{studentCount} طالب</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-zinc-300 mb-2">
                  <span>متوسط سعر الكورس:</span>
                  <span className="text-amber-600 dark:text-amber-400 text-sm font-black">{coursePrice} ج.م</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#1a1438] border border-slate-200 dark:border-white/10 space-y-4 text-center">
              <div>
                <span className="text-xs text-slate-500 dark:text-zinc-400 block mb-1">صافي عوائدك في أكاديميتنا (100% لك):</span>
                <div className="text-2xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                  {platformProfitOurPlatform.toLocaleString()} ج.م
                </div>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold block mt-0.5">تحويل مباشر إلى حسابك دون وساطة مالية</span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-between text-xs text-slate-500 dark:text-zinc-400">
                <span>عوائدك على المنصات الأخرى (خصم 40%):</span>
                <span className="line-through text-rose-600 dark:text-rose-400 font-bold">
                  {(totalRevenue - platformFeeWithOtherPlatforms).toLocaleString()} ج.م
                </span>
              </div>
              
              <div className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-500/15 p-2.5 rounded-xl border border-amber-500/30">
                وفرت لنفسك: {platformFeeWithOtherPlatforms.toLocaleString()} ج.م من الاقتطاعات
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CLASSIC PRICING TIERS */}
      <section className="max-w-5xl mx-auto py-12 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            خطط الاشتراك الأكاديمي
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            اختر الخطة المناسبة لحجم نشاطك التدريبي
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            جميع الباقات تشمل فترة تجريبية مجانية لمدة 14 يوماً مع دعم فني مستمر.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Plan 1: Trial */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white/95 dark:bg-[#140f29]/95 border border-slate-200 dark:border-purple-900/40 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">فترة التجربة الأكاديمية</h3>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/15 text-blue-700 dark:text-blue-300 text-xs font-black">
                  مجانية
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                مخصصة لتجربة المنصة ورفع المناهج والدروس الأولية دون أي التزام.
              </p>
              
              <div className="py-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">0</span>
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 mr-1">ج.م / 14 يوماً</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 dark:text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> تجربة كاملة لمدة 14 يوماً</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> رفع ونشر الكورسات والدروس</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> ربط بيانات InstaPay والمحافظ</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 0% عمولة على المبيعات</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor"
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white font-bold text-xs text-center transition-all cursor-pointer"
            >
              بدء الـ 14 يوماً مجاناً
            </Link>
          </div>

          {/* Plan 2: Yearly (Flagship) */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white/95 dark:bg-[#181335]/95 border-2 border-amber-500 shadow-2xl shadow-amber-500/15 flex flex-col justify-between space-y-6 relative -translate-y-2">
            <div className="absolute -top-3 right-1/2 translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 text-xs font-black shadow-md whitespace-nowrap">
              الخيار الأكثر توفيراً
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">الاشتراك السنوي الشامل</h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-[10px] font-black">
                  شهرين إضافيين مجاناً
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                الخيار المثالي للمدربين المحترفين لتحقيق أعلى استقرار وأفضل عائد استثماري.
              </p>
              
              <div className="py-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-amber-600 dark:text-amber-400">1,499</span>
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">ج.م / سنوياً</span>
                </div>
                <div className="text-[11px] text-slate-400 dark:text-zinc-500 line-through mt-0.5">بدلاً من 3,999 ج.م</div>
              </div>

              <ul className="space-y-2 text-xs text-slate-800 dark:text-zinc-200 font-medium">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0" /> <span className="font-bold text-slate-900 dark:text-white">14 يوماً تجربة مجانية أولاً</span></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0" /> عدد كورسات وطلاب غير محدود</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0" /> 0% عمولة نهائياً على كافة مبيعاتك</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0" /> إبراز الدورات في الصفحة الرئيسية للمنصة</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0" /> نظام كوبونات خصم متقدم لطلابك</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0" /> أولوية في الدعم الفني والمساعدة الأكاديمية</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-zinc-950 font-black text-xs text-center transition-all shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 cursor-pointer"
            >
              الاشتراك السنوي مع التجربة المجانية
            </Link>
          </div>

          {/* Plan 3: Monthly */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white/95 dark:bg-[#140f29]/95 border border-slate-200 dark:border-purple-900/40 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">الاشتراك الشهري</h3>
                <span className="px-2.5 py-0.5 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 text-xs font-black">
                  مرونة شهرية
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                سداد شهري مرن مع إمكانية الترقية أو الإلغاء في أي وقت بدون التزامات طويلة.
              </p>
              
              <div className="py-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">299</span>
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">ج.م / شهرياً</span>
                </div>
                <div className="text-[11px] text-slate-400 dark:text-zinc-500 line-through mt-0.5">بدلاً من 599 ج.م</div>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 dark:text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 14 يوماً تجربة مجانية في البداية</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> عدد كورسات وطلاب غير محدود</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 0% عمولة على المبيعات</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> تحويل فوري لأرباحك عبر InstaPay</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> شهادات إتمام معتمدة لطلابك</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs text-center transition-all shadow-sm cursor-pointer"
            >
              الاشتراك الشهري
            </Link>
          </div>

        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="max-w-4xl mx-auto py-12 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-white/95 dark:bg-[#140f29]/95 border border-slate-200 dark:border-purple-800/40 shadow-2xl space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            انضم الآن وابدأ تدريس طلابك باحترافية
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 max-w-lg mx-auto leading-relaxed">
            أنشئ حساب المحاضر الخاص بك خلال دقيقة واحدة، واستفد من 14 يوماً تجربة مجانية كاملة للمنصة بدون أي رسوم.
          </p>

          <Link
            href="/register?role=instructor"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>إنشاء حساب محاضر وبدء التجربة المجانية</span>
            <ArrowLeft className="w-4 h-4 text-zinc-950" />
          </Link>
        </div>
      </section>
    </div>
  );
}
