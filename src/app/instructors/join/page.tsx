'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  Check,
  Layers,
  GraduationCap,
  Building,
  DollarSign,
  Compass,
  SlidersHorizontal,
  FileCheck,
  Calendar,
  BookOpen,
  ChevronLeft,
  Info
} from 'lucide-react';

export default function InstructorJoinPage() {
  const searchParams = useSearchParams();
  const trackParam = searchParams.get('track');

  const [activeTrack, setActiveTrack] = useState<'all' | 'expert' | 'student'>(
    trackParam === 'student' ? 'student' : trackParam === 'expert' ? 'expert' : 'all'
  );

  useEffect(() => {
    if (trackParam === 'student') setActiveTrack('student');
    else if (trackParam === 'expert') setActiveTrack('expert');
  }, [trackParam]);

  // Dynamic Revenue Calculator
  const [studentCount, setStudentCount] = useState(80);
  const [coursePrice, setCoursePrice] = useState(350);

  const totalRevenue = studentCount * coursePrice;
  const traditionalCut = Math.round(totalRevenue * 0.40); // 40% traditional cut
  const netEarnings = totalRevenue;

  const features = [
    {
      number: '01',
      title: 'نموذج 0% عمولة على المبيعات',
      description: 'تحتفظ بكامل عوائد دوراتك التدريبية بنسبة 100%. لا نقتطع أي نسبة مئوية من مبيعاتك نهائياً، فالجهد جهدك والعائد بالكامل لك.',
      icon: Percent,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      borderCol: 'border-emerald-500/30',
      iconCol: 'text-emerald-400',
    },
    {
      number: '02',
      title: 'تحصيل فوري ومباشر عبر InstaPay والمحافظ',
      description: 'يقوم الطلاب بتحويل قيمة الكورس مباشرة إلى حسابك الشخصي في إنستاباي أو فودافون كاش دون وسيط، وتتحكم بالقبول بضغطة زر واحدة.',
      icon: Smartphone,
      gradient: 'from-indigo-500/20 to-purple-500/10',
      borderCol: 'border-indigo-500/30',
      iconCol: 'text-indigo-400',
    },
    {
      number: '03',
      title: 'حماية متقدمة للمحتوى المرئي (فيديوهات حتى 1GB)',
      description: 'تشفير فائق للمقاطع يمنع التحميل أو تصوير الشاشة، مع إمكانية رفع مقاطع عالية الوضوح بسعة تصل إلى 1024 ميجابايت ومشغل سينمائي متكيف.',
      icon: ShieldCheck,
      gradient: 'from-sky-500/20 to-blue-500/10',
      borderCol: 'border-sky-500/30',
      iconCol: 'text-sky-400',
    },
    {
      number: '04',
      title: 'امتحانات إجبارية لكل درس وامتحان نهائي معتمد',
      description: 'اربط كل درس باختبار إجباري يمنع التخطي إلا بالاجتياز، مع إمكانية تفعيل امتحان شامل في نهاية الكورس يُخرج شهادة إتمام موثقة برمز تحقق رقمي.',
      icon: Award,
      gradient: 'from-amber-500/20 to-yellow-500/10',
      borderCol: 'border-amber-500/30',
      iconCol: 'text-amber-400',
    },
    {
      number: '05',
      title: 'كوبونات خصم وحملات ترويجية مخصصة',
      description: 'لوحة متكاملة لإنشاء وتوليد أكواد الخصم الترويجية لطلابك، مع تحديد نسب الخصم وعدد مرات الاستخدام وتواريخ الصلاحية لزيادة سرعة الالتحاق.',
      icon: Zap,
      gradient: 'from-rose-500/20 to-pink-500/10',
      borderCol: 'border-rose-500/30',
      iconCol: 'text-rose-400',
    },
    {
      number: '06',
      title: 'استوديو تدريس سحابي وإحصائيات متقدمة',
      description: 'لوحة تحكم ذكية تتيح لك متابعة تفاعل طلابك، نسب الإكمال، وتقييمات الدروس، مع إمكانية التواصل والرد على استفسارات الطلاب مباشرة.',
      icon: Layers,
      gradient: 'from-violet-500/20 to-indigo-500/10',
      borderCol: 'border-violet-500/30',
      iconCol: 'text-violet-400',
    },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 dark:bg-[#0c0f1d] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Subtle, Calming Dynamic Ambient Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="dynamic-drift-1 absolute top-[5%] right-[10%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="dynamic-drift-2 absolute top-[35%] left-[5%] w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-700/10 rounded-full blur-[160px]" />
        <div className="dynamic-drift-3 absolute bottom-[10%] right-[20%] w-[550px] h-[550px] bg-amber-500/5 dark:bg-amber-600/10 rounded-full blur-[150px]" />
      </div>

      {/* =========================================================================
          1. HERO & TRACK NAVIGATION
         ========================================================================= */}
      <section className="max-w-5xl mx-auto text-center pt-4 pb-12 space-y-6">
        
        {/* Track Segmented Switcher (Calm, Dynamic, No Emojis) */}
        <div className="inline-flex p-1.5 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 shadow-lg backdrop-blur-xl gap-1.5 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => setActiveTrack('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTrack === 'all'
                ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>عرض كل المسارات</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTrack('expert')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTrack === 'expert'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>مسار المدرسين والدكاترة الجامعيين (14 يوماً مجاناً)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTrack('student')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTrack === 'student'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/30'
                : 'text-slate-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>مسار المحاضر الطالب (شهر كامل مجاناً)</span>
          </button>
        </div>

        {/* Dynamic Tag */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              {activeTrack === 'student'
                ? 'منحة تمكين وإطلاق طلبة الجامعات والمعاهد'
                : activeTrack === 'expert'
                ? 'برنامج السحابة الأكاديمية للمدرسين والأساتذة الجامعيين'
                : 'المنصة السحابية المتكاملة للتعليم الجامعي والأكاديمي'}
            </span>
          </div>
        </div>

        {/* Main Headline (Clean typography, calm colors, no emojis) */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {activeTrack === 'student' ? (
            <>
              اشرح لزملائك وأطلق أول كورس لك مع{' '}
              <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                شهر كامل مجاناً
              </span>
            </>
          ) : (
            <>
              درّس لطلابك واحتفظ بـ{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-300 bg-clip-text text-transparent">
                كامل عوائد مبيعاتك
              </span>{' '}
              مباشرة
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed">
          {activeTrack === 'student'
            ? 'إذا كنت طالباً جامعياً وتريد تقديم الشروحات والمناهج لزملائك، نوفر لك منحة 30 يوماً مجاناً بالكامل مع باقة اشتراك مدعومة بعد انتهاء الشهر بموجب كارنيه الكلية.'
            : 'استوديو تدريس سحابي متكامل يمنح المدرسين والدكاترة الجامعيين استقلالية تامة، مع تحويل أرباحك فورياً إلى حسابك الشخصي عبر إنستاباي والمحافظ بدون اقتطاع أي عمولة.'}
        </p>

        {/* =========================================================================
            DUAL TRACK HERO CARDS (THE CORE DIFFERENTIATION)
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 text-right">
          
          {/* Card 1: Teachers & University Professors */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden ${
              activeTrack === 'expert' || activeTrack === 'all'
                ? 'bg-white dark:bg-gradient-to-b dark:from-[#151936] dark:to-[#0f1226] border-indigo-500/40 shadow-xl shadow-indigo-950/30 ring-1 ring-indigo-500/30'
                : 'bg-white/60 dark:bg-zinc-900/40 border-slate-200 dark:border-zinc-800 opacity-60'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-xs font-bold inline-flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-500" />
                  للمدرسين والدكاترة الجامعيين
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">تفعيل فوري بدون مستندات</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  انضم كـ مدرس أو دكتور جامعي
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                  مخصص للأساتذة والمحاضرين الذين يرغبون في بناء استوديو تعليمي سحابي مستقل لدفعاتهم مع سيطرة كاملة على المحتوى والأسعار.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/50 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-indigo-200">
                  <span>الفترة التجريبية:</span>
                  <span className="text-indigo-600 dark:text-indigo-300 font-black">14 يوماً مجاناً بالكامل</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-indigo-200">
                  <span>عمولة المبيعات:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black">0% (الأرباح لك 100%)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-indigo-200">
                  <span>التحصيل المالي:</span>
                  <span className="text-slate-900 dark:text-white">InstaPay وفودافون كاش مباشرة</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-indigo-200">
                  <span>الفئة المستهدفة:</span>
                  <span className="text-slate-900 dark:text-white">المدرسون والأساتذة والدكاترة الجامعيون</span>
                </div>
              </div>
            </div>

            <Link
              href="/register?role=instructor&track=expert"
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs text-center shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>بدء تجربة المدرس أو الدكتور الجامعي (14 يوماً مجاناً)</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Student Instructors */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden ${
              activeTrack === 'student' || activeTrack === 'all'
                ? 'bg-white dark:bg-gradient-to-b dark:from-[#251b10] dark:to-[#13101d] border-amber-500/70 shadow-xl shadow-amber-950/20 ring-1 ring-amber-500/40'
                : 'bg-white/60 dark:bg-zinc-900/40 border-slate-200 dark:border-zinc-800 opacity-60'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold inline-flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                  لطلبة الكليات والمعاهد
                </span>
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">توثيق بكارنيه الكلية</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  اشترك كـ محاضر طالب جامعي
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                  لكل طالب بالكلية يريد شرح الكورسات لزملائه؛ نمنحك شهر كامل مجاناً وشارة "طالب معتمد" مع باقة اشتراك مخفضة ومدعومة.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800/50 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-amber-200">
                  <span>المنحة التجريبية:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-black">شهر كامل مجاناً (30 يوماً بالكامل)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-amber-200">
                  <span>سعر الباقة بعد الشهر:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black">120 ج.م شهرياً (خصم 60% مدعوم)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-amber-200">
                  <span>شرط الاستحقاق:</span>
                  <span className="text-slate-900 dark:text-white">كارنيه كلية ساري (حتى سن 22 سنة)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-amber-200">
                  <span>إذا كان السن أكبر من 22:</span>
                  <span className="text-slate-500 dark:text-zinc-400">الاشتراك متاح في باقة المدرسين العادية</span>
                </div>
              </div>
            </div>

            <Link
              href="/register?role=instructor&track=student"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs text-center shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>اشترك كـ محاضر طالب (شهر كامل مجاناً)</span>
              <ArrowLeft className="w-4 h-4 text-zinc-950" />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. DYNAMIC LIVE REVENUE CALCULATOR (CALM & ENGAGING)
         ========================================================================= */}
      <section className="max-w-4xl mx-auto py-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-[#131833] dark:to-[#0d1024] border border-slate-200 dark:border-indigo-900/40 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400">حاسبة العوائد التفاعلية</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              كم ستحقق من أرباح مع نموذج 0% عمولة؟
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              حرك المؤشرات لتكتشف الفارق بين منصة قمم والمنصات التقليدية التي تقتطع 30% إلى 50% من أرباحك.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>عدد الطلاب المتوقع:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{studentCount} طالب</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>متوسط سعر الكورس:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{coursePrice} ج.م</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0e122b] border border-slate-200 dark:border-indigo-900/50 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">صافي أرباحك في منصتنا (100% لك):</span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {netEarnings.toLocaleString('en-US')} <span className="text-sm font-bold text-slate-500 dark:text-zinc-400">ج.م</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>عمولة المنصات التقليدية (40%):</span>
                  <span className="text-rose-500 font-bold line-through">-{traditionalCut.toLocaleString('en-US')} ج.م</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
                  <span>وفرت مع قمم:</span>
                  <span>+{traditionalCut.toLocaleString('en-US')} ج.م كاملة في جيبك</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. COMPARISON TABLE: أي المسارين يناسبك؟
         ========================================================================= */}
      <section className="max-w-4xl mx-auto py-8">
        <div className="text-center space-y-1 mb-6">
          <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400">دليل الاختيار الأكاديمي</span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            مقارنة واضحة: أي المسارين أنسب لك؟
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            صممنا باقات مخصصة تناسب الأساتذة والدكاترة، وباقات مدعومة للطلبة.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100 dark:bg-zinc-850 border-b border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-bold">
              <tr>
                <th className="p-4 sm:p-5">الميزة والوجه المقارن</th>
                <th className="p-4 sm:p-5 text-indigo-700 dark:text-indigo-300">مسار المدرس أو الدكتور الجامعي</th>
                <th className="p-4 sm:p-5 text-amber-700 dark:text-amber-300">مسار المحاضر الطالب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-slate-700 dark:text-zinc-300">
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">الفئة المستهدفة</td>
                <td className="p-4">المدرسون، الدكاترة، والأساتذة من كافة الأعمار</td>
                <td className="p-4 font-bold text-amber-600 dark:text-amber-300">طلبة الجامعات والمعاهد (حتى سن 22 سنة)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">فترة التجربة المجانية</td>
                <td className="p-4">14 يوماً مجاناً بالكامل</td>
                <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">شهر كامل (30 يوماً مجاناً)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">قيمة الاشتراك بعد التجربة</td>
                <td className="p-4">290 ج.م شهرياً أو 1,499 ج.م سنوياً</td>
                <td className="p-4 font-bold text-amber-600 dark:text-amber-400">120 ج.م شهرياً فقط (مدعوم بنسبة 60%)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">المستندات المطلوبة</td>
                <td className="p-4 text-emerald-600 dark:text-emerald-400 font-medium">لا توجد أي مستندات (تفعيل فوري)</td>
                <td className="p-4">كارنيه الكلية للعام الدراسي للتحقق من السن والقيد</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">نسبة عمولة المنصة</td>
                <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold">0% عمولة نهائياً</td>
                <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold">0% عمولة نهائياً</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">تحصيل الأرباح</td>
                <td className="p-4">تحويل فوري إلى InstaPay وفودافون كاش</td>
                <td className="p-4">تحويل فوري إلى InstaPay وفودافون كاش</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">الشارة الأكاديمية</td>
                <td className="p-4 text-indigo-600 dark:text-indigo-300 font-bold">محاضر معتمد</td>
                <td className="p-4 text-amber-600 dark:text-amber-400 font-bold">طالب محاضر معتمد</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================================
          4. CORE ADVANTAGES (BEAUTIFULLY ORGANIZED)
         ========================================================================= */}
      <section className="max-w-6xl mx-auto py-10">
        <div className="text-center space-y-1 mb-10">
          <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400">مميزات المنصة السحابية</span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            بنية تحتية متكاملة لنجاح المدرس، الدكتور، والمحاضر الطالب
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto">
            ميزات حصرية تمنحك الأفضلية التقنية والمالية على أي منصة تعليمية أخرى.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon;

            return (
              <div
                key={feat.number}
                className={`p-6 rounded-3xl bg-white dark:bg-[#12162f] border ${feat.borderCol} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-right space-y-4`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 flex items-center justify-center ${feat.iconCol}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-zinc-500">
                      {feat.number}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>متاح للمسارين</span>
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400">نشط في حسابك</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          5. PRICING PLANS (4 CLEAR CARDS - NO EMOJIS)
         ========================================================================= */}
      <section className="max-w-6xl mx-auto py-10">
        <div className="text-center space-y-1 mb-10">
          <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400">باقات الاشتراك السحابية</span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            اختر الباقة الأنسب لمسارك التعليمي
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            جميع الباقات تشمل فترات تجريبية مجانية مع حفظ كامل بيانات دوراتك وطلابك.
          </p>
        </div>

        {/* Explicit Rule Banner */}
        <div className="max-w-3xl mx-auto mb-8 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-right">
            <span className="font-bold text-slate-900 dark:text-white block">ملاحظة تنظيمية هامة بشأن الاشتراكات:</span>
            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed">
              إذا كان عمر المحاضر <strong>أكبر من 22 سنة</strong>، فإنه يشترك في <strong>باقة المدرسين والدكاترة العادية</strong> (الاشتراك الشهري 290 ج.م أو السنوي 1,499 ج.م). أما <strong>باقة المحاضر الطالب (120 ج.م)</strong> فهي منحة مخصصة لطلبة الجامعات والمعاهد حتى سن 22 سنة بإثبات كارنيه الكلية.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch text-right">
          
          {/* Plan 1: Regular Monthly Plan */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-md flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-slate-900 dark:text-white">الباقة العادية - شهري</h3>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                  مرونة شهرية
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                سداد شهري مرن للمدرسين والدكاترة مع إمكانية الترقية أو الإلغاء في أي وقت.
              </p>
              
              <div className="py-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">290</span>
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">ج.م / شهرياً</span>
                </div>
                <div className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">متاح لكافة الأعمار</div>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 dark:text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> 14 يوماً تجربة مجانية في البداية</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> كورسات وطلاب غير محدود</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> 0% عمولة على المبيعات</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> تحويل فوري لأرباحك عبر إنستاباي</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor&track=expert"
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-zinc-800 hover:bg-slate-800 dark:hover:bg-zinc-700 text-white font-bold text-xs text-center transition-all cursor-pointer"
            >
              الاشتراك الشهري (290 ج.م)
            </Link>
          </div>

          {/* Plan 2: Regular Annual Plan (Featured) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border-2 border-indigo-500/60 shadow-xl flex flex-col justify-between space-y-5 relative">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-slate-900 dark:text-white">الباقة العادية - سنوي</h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                  وفر شهرين
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                الخيار الأمثل للمدرسين والأساتذة لتحقيق أعلى استقرار وأفضل عائد استثماري.
              </p>
              
              <div className="py-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">1,499</span>
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">ج.م / سنوياً</span>
                </div>
                <div className="text-[11px] text-slate-400 dark:text-zinc-500 line-through mt-0.5">بدلاً من 3,500 ج.م</div>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 dark:text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> 14 يوماً تجربة مجانية أولاً</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> عدد كورسات وطلاب غير محدود</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> 0% عمولة نهائياً على المبيعات</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> أولوية في الدعم الفني المخصص</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor&track=expert"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs text-center transition-all cursor-pointer shadow-md"
            >
              الاشتراك السنوي الشامل
            </Link>
          </div>

          {/* Plan 3: Student-Instructor Plan */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-[#251a10] dark:to-[#14101e] border-2 border-amber-500/80 shadow-xl flex flex-col justify-between space-y-5 relative">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-slate-900 dark:text-white">باقة المحاضر الطالب</h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-black">
                  شهر مجاناً
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                مخصصة لطلبة الجامعات والمعاهد لتقديم الشروحات لزملائهم بسعر رمزي مدعوم.
              </p>
              
              <div className="py-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-600 dark:text-amber-400">120</span>
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">ج.م / شهرياً</span>
                </div>
                <div className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">بإثبات كارنيه الكلية (سن 22 فأقل)</div>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 dark:text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0" /> 30 يوماً تجربة مجانية أولاً</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0" /> رفع ونشر الكورسات والدروس</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0" /> شارة طالب محاضر معتمد</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0" /> مخصص لسن 22 سنة فأقل</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor&track=student"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs text-center transition-all shadow-md cursor-pointer"
            >
              اشترك كمحاضر طالب (120 ج.م)
            </Link>
          </div>

          {/* Plan 4: Academic 14-day Trial */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-md flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-slate-900 dark:text-white">التجربة الأكاديمية</h3>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[10px] font-bold">
                  مجانية
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                مخصصة لتجربة المنصة ورفع المناهج والدروس الأولية دون أي التزام مسبق.
              </p>
              
              <div className="py-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">0</span>
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 mr-1">ج.م / 14 يوماً</span>
                <div className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">بدون بطاقة ائتمان</div>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 dark:text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> تجربة كاملة لمدة 14 يوماً</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> رفع ونشر الكورسات</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> ربط بيانات إنستاباي والمحافظ</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor&track=expert"
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white font-bold text-xs text-center transition-all cursor-pointer"
            >
              بدء الـ 14 يوماً مجاناً
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. FINAL CALL TO ACTION
         ========================================================================= */}
      <section className="max-w-4xl mx-auto py-10 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-[#151a38] dark:to-[#0e1124] border border-slate-200 dark:border-indigo-900/50 shadow-2xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <GraduationCap className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              ابدأ رحلتك التدريبية معنا اليوم
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 max-w-lg mx-auto leading-relaxed">
              سواء كنت مدرساً أو دكتوراً جامعياً، أو طالباً جامعياً طموحاً؛ المنصة توفر لك كل ما تحتاجه للنجاح واستقبال الطلاب مباشرة.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/register?role=instructor&track=expert"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building className="w-4 h-4" />
              <span>انضم كمدرس أو دكتور جامعي (14 يوماً مجاناً)</span>
            </Link>

            <Link
              href="/register?role=instructor&track=student"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-zinc-950" />
              <span>اشترك كمحاضر طالب (30 يوماً مجاناً)</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
