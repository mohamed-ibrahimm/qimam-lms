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
  DollarSign,
  Compass,
  SlidersHorizontal,
  Flame,
  ShieldAlert
} from 'lucide-react';

export default function InstructorJoinPage() {
  const [studentCount, setStudentCount] = useState(60);
  const [coursePrice, setCoursePrice] = useState(400);

  const totalRevenue = studentCount * coursePrice;
  const platformFeeWithOtherPlatforms = totalRevenue * 0.40;
  const platformProfitOurPlatform = totalRevenue;

  const features = [
    {
      number: '01',
      title: 'نموذج 0% عمولة على المبيعات',
      description: 'تحتفظ بكامل إيرادات دوراتك التدريبية بنسبة 100%. نحن لا نقتطع أي نسبة مئوية من مبيعاتك إطلاقاً، فالجهد جهدك والعائد بالكامل لك.',
      icon: Percent,
      gradient: 'from-emerald-400 via-teal-500 to-emerald-600',
      glow: 'from-emerald-500/40 via-teal-500/20 to-transparent',
      textCol: 'text-emerald-600 dark:text-emerald-400',
      shadow: 'group-hover:shadow-emerald-500/30',
      dot: 'bg-emerald-500 shadow-emerald-400/80',
    },
    {
      number: '02',
      title: 'تحصيل فوري عبر InstaPay والمحافظ',
      description: 'يضع الطلاب إيصال التحويل البنكي أو المحفظة الإلكترونية مباشرة لحسابك الشخصي، وتوافق على التحاق الطالب بضغطة زر واحدة وتستلم أموالك لحظياً.',
      icon: Smartphone,
      gradient: 'from-purple-400 via-indigo-500 to-purple-600',
      glow: 'from-purple-500/40 via-indigo-500/20 to-transparent',
      textCol: 'text-purple-600 dark:text-purple-400',
      shadow: 'group-hover:shadow-purple-500/30',
      dot: 'bg-purple-500 shadow-purple-400/80',
    },
    {
      number: '03',
      title: 'حماية متقدمة للمحتوى المرئي',
      description: 'تشفير فائق للمقاطع يمنع التحميل أو السرقة، مع مشغل سينمائي متكيف الجودة يضمن تشغيلاً فائق السرعة على جميع الهواتف والأجهزة دون تقطيع.',
      icon: ShieldCheck,
      gradient: 'from-amber-400 via-yellow-500 to-amber-600',
      glow: 'from-amber-500/40 via-yellow-500/20 to-transparent',
      textCol: 'text-amber-600 dark:text-amber-400',
      shadow: 'group-hover:shadow-amber-500/30',
      dot: 'bg-amber-500 shadow-amber-400/80',
    },
    {
      number: '04',
      title: 'شهادات تخرج رقمية معتمدة برمز تحقق',
      description: 'إصدار تلقائي لشهادات إتمام الدورات تحمل اسمك وشعارك مع رمز QR Code رسمي لفحص التوثيق الإلكتروني، مما يرفع ثقة الطلاب وإقبالهم على دوراتك.',
      icon: Award,
      gradient: 'from-cyan-400 via-sky-500 to-blue-600',
      glow: 'from-cyan-500/40 via-sky-500/20 to-transparent',
      textCol: 'text-cyan-600 dark:text-cyan-400',
      shadow: 'group-hover:shadow-cyan-500/30',
      dot: 'bg-cyan-500 shadow-cyan-400/80',
    },
    {
      number: '05',
      title: 'كوبونات خصم وحملات ترويجية',
      description: 'لوحة متكاملة لإنشاء وتوليد أكواد الخصم الترويجية لطلابك ومتابعيك، مع تحديد نسب الخصم ومرات الاستخدام وتواريخ الصلاحية لزيادة سرعة الشراء.',
      icon: Zap,
      gradient: 'from-rose-400 via-pink-500 to-rose-600',
      glow: 'from-rose-500/40 via-pink-500/20 to-transparent',
      textCol: 'text-rose-600 dark:text-rose-400',
      shadow: 'group-hover:shadow-rose-500/30',
      dot: 'bg-rose-500 shadow-rose-400/80',
    },
    {
      number: '06',
      title: 'لوحة تحكم وتحليلات أكاديمية شاملة',
      description: 'استوديو تدريس ذكي يتيح لك متابعة تقدم طلابك، نسب الإكمال، تقييمات الدروس، مع إمكانية التواصل والدردشة المباشرة مع الطلاب والإجابة على استفساراتهم.',
      icon: Layers,
      gradient: 'from-indigo-400 via-blue-500 to-indigo-600',
      glow: 'from-indigo-500/40 via-blue-500/20 to-transparent',
      textCol: 'text-indigo-600 dark:text-indigo-400',
      shadow: 'group-hover:shadow-indigo-500/30',
      dot: 'bg-indigo-500 shadow-indigo-400/80',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Ambient Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="dynamic-drift-1 absolute top-[4%] right-[15%] w-[550px] h-[550px] bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="dynamic-drift-2 absolute top-[40%] left-[10%] w-[600px] h-[600px] bg-indigo-500/15 dark:bg-purple-600/15 rounded-full blur-[150px]" />
        <div className="dynamic-drift-3 absolute bottom-[8%] right-[25%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[130px]" />
      </div>

      {/* =========================================================================
          1. HERO SECTION - CLASSIC LUXURY WITH DYNAMIC BADGES
         ========================================================================= */}
      <section className="max-w-4xl mx-auto text-center pt-8 pb-16 space-y-6">
        
        {/* Dynamic Prestige Tag with Orbit Halo */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-black shadow-xs relative group">
          <div className="relative flex items-center justify-center">
            <span className="absolute -inset-1 rounded-full bg-amber-400/40 blur-xs animate-ping opacity-60" />
            <GraduationCap className="w-4 h-4 text-amber-500 shrink-0 relative z-10" />
          </div>
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

        {/* 14-Day Free Trial Banner with Dynamic Ring Badge */}
        <div className="max-w-2xl mx-auto p-5 rounded-3xl bg-white/95 dark:bg-gradient-to-b dark:from-[#171233]/95 dark:to-[#100c24]/95 border border-slate-200 dark:border-amber-500/30 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-5 text-right relative overflow-hidden group">
          
          {/* Top Specular Reflection Highlight */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            {/* Dynamic Animated Icon Pod */}
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-amber-500/40 via-yellow-400/20 to-transparent blur-md opacity-75 group-hover:scale-125 transition-transform duration-500 animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl p-[2px] bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-md">
                <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#1a143b] flex items-center justify-center">
                  <BadgeCheck className="w-7 h-7 text-amber-500 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/80 animate-ping opacity-75" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">فترة تجريبية مجانية لمدة 14 يوماً</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">بدون بطاقة</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">ابدأ رفع دوراتك واستقبل أول طالب لتجربة كافة المميزات بحرية كاملة.</p>
            </div>
          </div>

          <Link
            href="/register?role=instructor"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-zinc-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer relative z-10"
          >
            <span>بدء التجربة المجانية</span>
            <ArrowLeft className="w-4 h-4 text-zinc-950" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          2. CORE ADVANTAGES - UPGRADED SHAPES & DYNAMIC ICON PODS
         ========================================================================= */}
      <section className="max-w-6xl mx-auto py-10">
        <div className="text-center space-y-2 mb-14">
          <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            مميزات الشراكة الأكاديمية
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            بنية تحتية متكاملة مصممة لنجاح المدرب المحترف
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto">
            ميزات حصرية تمنحك الأفضلية التقنية والمالية على أي منصة تعليمية أخرى في المنطقة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {features.map((feat) => {
            const Icon = feat.icon;

            return (
              <div
                key={feat.number}
                className="group relative rounded-3xl bg-white/95 dark:bg-gradient-to-b dark:from-[#171233]/95 dark:to-[#0f0b22]/95 border border-slate-200/90 dark:border-purple-800/40 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-amber-500/60 flex flex-col justify-between overflow-hidden text-right"
              >
                {/* Specular Edge Highlight */}
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                {/* Faded Background Watermark Icon */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-500">
                  <Icon className="w-full h-full text-slate-900 dark:text-white" />
                </div>

                <div className="space-y-4 relative z-10">
                  
                  {/* Top Bar: Dynamic Icon Pod + Geometric Number Tag */}
                  <div className="flex items-center justify-between">
                    
                    {/* The Dynamic Multilayered Glowing Icon Pod */}
                    <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                      {/* Ambient breathing halo */}
                      <div className={`absolute -inset-1.5 rounded-2xl bg-gradient-to-tr ${feat.glow} blur-md opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 animate-pulse`} />
                      
                      {/* Gradient border container */}
                      <div className={`relative w-14 h-14 rounded-2xl p-[1.5px] bg-gradient-to-br ${feat.gradient} shadow-md ${feat.shadow} transition-all duration-300`}>
                        <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#191338] flex items-center justify-center transition-transform duration-300 group-hover:scale-[0.96]">
                          <Icon className={`w-6 h-6 ${feat.textCol} group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300`} />
                        </div>
                      </div>

                      {/* Dynamic Beacon Dot */}
                      <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${feat.dot} animate-ping opacity-75`} />
                      <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${feat.dot}`} />
                    </div>

                    {/* Classic Monospace Index Pill */}
                    <span className="text-xs font-mono font-black px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-white/5">
                      {feat.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                    {feat.description}
                  </p>
                </div>

                {/* Bottom Active Subtle Bar */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-purple-900/30 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-zinc-400 relative z-10">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>ميزة مفعلة تلقائياً</span>
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
                    تفاصيل &larr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          3. INTERACTIVE FINANCIAL COMPARISON WITH RADIAL GLOWS
         ========================================================================= */}
      <section className="max-w-4xl mx-auto py-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-white/95 dark:bg-gradient-to-b dark:from-[#171233]/95 dark:to-[#100c24]/95 border border-slate-200 dark:border-purple-800/40 shadow-2xl space-y-8 relative overflow-hidden group">
          
          {/* Top Border Reflection */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent pointer-events-none" />

          {/* Header Area */}
          <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black shadow-xs">
              <div className="relative flex items-center justify-center">
                <span className="absolute -inset-1 rounded-full bg-emerald-400/40 blur-xs animate-ping opacity-60" />
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0 relative z-10" />
              </div>
              <span>مقارنة العوائد المالية التفاعلية</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
              احسب الفارق الحقيقي في أرباحك الصافية
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-lg mx-auto">
              مقارنة واقعية بين نموذج الأكاديمية بنسبة 0% عمولة وبين المنصات التقليدية التي تقتطع 40% من عوائدك.
            </p>
          </div>

          {/* Sliders & Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2 relative z-10">
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

            {/* Results Pod */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#1a143b] border border-slate-200 dark:border-purple-800/40 space-y-4 text-center shadow-lg">
              <div>
                <span className="text-xs text-slate-500 dark:text-zinc-400 block mb-1">صافي عوائدك في أكاديميتنا (100% لك):</span>
                <div className="text-2xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                  {platformProfitOurPlatform.toLocaleString()} ج.م
                </div>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold block mt-0.5">تحويل فوري إلى حسابك دون أي وسطاء ماليين</span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-between text-xs text-slate-500 dark:text-zinc-400">
                <span>عوائدك على المنصات الأخرى (خصم 40%):</span>
                <span className="line-through text-rose-600 dark:text-rose-400 font-bold">
                  {(totalRevenue - platformFeeWithOtherPlatforms).toLocaleString()} ج.م
                </span>
              </div>
              
              <div className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-500/15 p-2.5 rounded-xl border border-amber-500/30 flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>وفرت لنفسك: {platformFeeWithOtherPlatforms.toLocaleString()} ج.م من الاقتطاعات</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CLASSIC PRICING TIERS - REFINED LUXURY SHAPES
         ========================================================================= */}
      <section className="max-w-5xl mx-auto py-12 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            خطط الاشتراك الأكاديمي
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            اختر الخطة المناسبة لحجم نشاطك التدريبي
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            جميع الباقات تشمل فترة تجريبية مجانية لمدة 14 يوماً مع دعم فني مستمر.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Plan 1: Trial */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-gradient-to-b dark:from-[#171233]/95 dark:to-[#100c24]/95 border border-slate-200 dark:border-purple-900/40 shadow-lg flex flex-col justify-between space-y-6 text-right">
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

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> تجربة كاملة لمدة 14 يوماً</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> رفع ونشر الكورسات والدروس</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> ربط بيانات InstaPay والمحافظ</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 0% عمولة على المبيعات</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor"
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white font-bold text-xs text-center transition-all cursor-pointer shadow-xs"
            >
              بدء الـ 14 يوماً مجاناً
            </Link>
          </div>

          {/* Plan 2: Yearly (Flagship) with Glowing Gold Halo */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-gradient-to-b dark:from-[#1b153d]/95 dark:to-[#120d2b]/95 border-2 border-amber-500 shadow-2xl shadow-amber-500/20 flex flex-col justify-between space-y-6 relative -translate-y-2 text-right">
            
            {/* Top Specular Edge */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent pointer-events-none" />

            <div className="absolute -top-3.5 right-1/2 translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 text-xs font-black shadow-md whitespace-nowrap">
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
                الخيار الأمثل للمدربين المحترفين لتحقيق أعلى استقرار وأفضل عائد استثماري.
              </p>
              
              <div className="py-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-amber-600 dark:text-amber-400">1,499</span>
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">ج.م / سنوياً</span>
                </div>
                <div className="text-[11px] text-slate-400 dark:text-zinc-500 line-through mt-0.5">بدلاً من 3,999 ج.م</div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-800 dark:text-zinc-200 font-medium">
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
          <div className="p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-gradient-to-b dark:from-[#171233]/95 dark:to-[#100c24]/95 border border-slate-200 dark:border-purple-900/40 shadow-lg flex flex-col justify-between space-y-6 text-right">
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

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-zinc-300 font-medium">
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

      {/* =========================================================================
          5. FINAL CALL TO ACTION WITH RADIATING DYNAMIC HALOS
         ========================================================================= */}
      <section className="max-w-4xl mx-auto py-12 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-white/95 dark:bg-gradient-to-b dark:from-[#171233]/95 dark:to-[#100c24]/95 border border-slate-200 dark:border-purple-800/40 shadow-2xl space-y-6 relative overflow-hidden group">
          
          {/* Dynamic Concentric Radiating Rings around Icon */}
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div className="absolute -inset-3 rounded-3xl bg-amber-500/20 blur-lg animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl p-[2px] bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-xl shadow-amber-500/25">
              <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#1a143b] flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-amber-500 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/80 animate-ping opacity-75" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            انضم الآن وابدأ تدريس طلابك باحترافية
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 max-w-lg mx-auto leading-relaxed">
            أنشئ حساب المحاضر الخاص بك خلال دقيقة واحدة، واستفد من 14 يوماً تجربة مجانية كاملة للمنصة بدون أي رسوم.
          </p>

          <Link
            href="/register?role=instructor"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>إنشاء حساب محاضر وبدء التجربة المجانية</span>
            <ArrowLeft className="w-4 h-4 text-zinc-950" />
          </Link>
        </div>
      </section>
    </div>
  );
}
