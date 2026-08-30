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
  Star,
  Check,
  Layers,
  GraduationCap,
  BadgeCheck,
  DollarSign,
  Compass,
  SlidersHorizontal,
  Flame,
  ShieldAlert,
  FileCheck,
  Calendar,
  Building
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

  const [studentCount, setStudentCount] = useState(60);
  const [coursePrice, setCoursePrice] = useState(400);

  const totalRevenue = studentCount * coursePrice;
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
      title: 'حماية متقدمة للمحتوى المرئي (فيديوهات حتى 1GB)',
      description: 'تشفير فائق للمقاطع يمنع التحميل أو السرقة، مع إمكانية رفع فيديوهات عالية الجودة بحجم يصل إلى 1024 ميجابايت ومشغل سينمائي متكيف.',
      icon: ShieldCheck,
      gradient: 'from-amber-400 via-yellow-500 to-amber-600',
      glow: 'from-amber-500/40 via-yellow-500/20 to-transparent',
      textCol: 'text-amber-600 dark:text-amber-400',
      shadow: 'group-hover:shadow-amber-500/30',
      dot: 'bg-amber-500 shadow-amber-400/80',
    },
    {
      number: '04',
      title: 'امتحانات إجبارية لكل درس وامتحان نهائي معتمد',
      description: 'اربط كل درس باختبار إجباري يمنع التخطي إلا بالنجاح، مع إمكانية تفعيل امتحان شامل في نهاية الكورس يُخرج شهادة إتمام موثقة برمز تحقق QR.',
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
      title: 'استوديو تدريس سحابي وإحصائيات مباشرة',
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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="dynamic-drift-1 absolute top-[4%] right-[15%] w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="dynamic-drift-2 absolute top-[40%] left-[10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px]" />
        <div className="dynamic-drift-3 absolute bottom-[8%] right-[25%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px]" />
      </div>

      {/* =========================================================================
          1. HERO SECTION & TRACK SELECTION
         ========================================================================= */}
      <section className="max-w-5xl mx-auto text-center pt-4 pb-12 space-y-6">
        
        {/* Track Segmented Switcher */}
        <div className="inline-flex p-1.5 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 shadow-xl backdrop-blur-xl gap-1.5 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => setActiveTrack('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTrack === 'all'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>عرض كل المسارات</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTrack('expert')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTrack === 'expert'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-purple-400" />
            <span>مسار المحاضر الخبير / الدكتور (14 يوماً مجاناً)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTrack('student')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTrack === 'student'
                ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-zinc-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-400'
                : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
            <span>مسار المحاضر الطالب (سن 23 فأقل - 30 يوماً مجاناً 🎓)</span>
          </button>
        </div>

        {/* Dynamic Pre-heading Tag */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-black shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {activeTrack === 'student'
                ? 'منحة تمكين وإطلاق أوائل وطلبة الجامعات والمعاهد (سن 23 سنة فأقل)'
                : activeTrack === 'expert'
                ? 'برنامج شراكة المحاضرين، الأساتذة، والخبراء المعتمدين'
                : 'منصة التدريس السحابية الأولى الداعمة للخبراء والطلبة على حد سواء'}
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {activeTrack === 'student' ? (
            <>
              اشرح لزملائك وأطلق أول كورس لك مع{' '}
              <span className="bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                شهر كامل مجاناً
              </span>
            </>
          ) : (
            <>
              درّس لآلاف الطلاب واحتفظ بـ{' '}
              <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-400 bg-clip-text text-transparent">
                كامل عوائد مبيعاتك
              </span>{' '}
              مباشرة
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-slate-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed font-medium">
          {activeTrack === 'student'
            ? 'إذا كنت طالباً بالكلية (سن 23 سنة فأقل) وتريد شرح المناهج أو المهارات البرمجية والهندسية لزملائك، نوفر لك منحة 30 يوماً مجاناً بالكامل + باقة اشتراك مدعومة ومخفضة بعد الشهر مع توثيق بكارنيه الكلية.'
            : 'استوديو تدريس سحابي متكامل يمنحك السيطرة التامة على محتواك، أسعارك، وطلابك، مع تحويل فوري لأرباحك عبر InstaPay والمحافظ الإلكترونية بدون اقتطاع أي عمولة على الإطلاق.'}
        </p>

        {/* =========================================================================
            DUAL TRACK CALLOUT CARDS (THE CORE FEATURE REQUEST)
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 text-right">
          
          {/* Track Card 1: Senior / Pro Instructor */}
          <div
            className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-5 relative overflow-hidden group ${
              activeTrack === 'expert' || activeTrack === 'all'
                ? 'bg-white/95 dark:bg-gradient-to-b dark:from-[#1b143a] dark:to-[#120d2b] border-purple-500/50 shadow-2xl shadow-purple-950/40 ring-1 ring-purple-500/40'
                : 'bg-white/60 dark:bg-zinc-900/40 border-zinc-800 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-black inline-flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-purple-400" />
                  للمدرسين، الدكاترة والخبراء
                </span>
                <span className="text-[11px] font-bold text-zinc-400">تفعيل فوري بدون أوراق</span>
              </div>

              <h3 className="text-xl font-black text-white">انضم كـ محاضر خبير / دكتور</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                مخصص للأساتذة والمحترفين الذين لديهم كورسات ويريدون منصة سحابية خاصة بهم وبناء علامتهم التدريبية المستقلة.
              </p>

              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-purple-200">
                  <span>الفترة التجريبية:</span>
                  <span className="text-amber-300 font-black">14 يوماً مجاناً بالكامل</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-purple-200">
                  <span>عمولة المبيعات:</span>
                  <span className="text-emerald-400 font-black">0% (الأرباح لك 100%)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-purple-200">
                  <span>طرق التحصيل:</span>
                  <span className="text-white">InstaPay وفودافون كاش مباشرة</span>
                </div>
              </div>
            </div>

            <Link
              href="/register?role=instructor&track=expert"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs text-center shadow-lg shadow-purple-950/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>بدء تجربة المحاضر الخبير (14 يوماً مجاناً) 💼</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Track Card 2: Student-Instructor (Grant 30 Days Free) */}
          <div
            className={`p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between space-y-5 relative overflow-hidden group ${
              activeTrack === 'student' || activeTrack === 'all'
                ? 'bg-gradient-to-b from-[#2a1c0d]/95 via-[#1b143a]/95 to-[#120d2b]/95 border-amber-500 shadow-2xl shadow-amber-500/20 ring-2 ring-amber-500/50'
                : 'bg-white/60 dark:bg-zinc-900/40 border-zinc-800 opacity-60'
            }`}
          >
            {/* Top Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 text-[11px] font-black shadow-md whitespace-nowrap">
              منحة تمكين خاصة لسن 23 سنة فأقل 🎁
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black inline-flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  لطلبة الجامعات والكليات
                </span>
                <span className="text-[11px] font-bold text-amber-400">توثيق بكارنيه الكلية</span>
              </div>

              <h3 className="text-xl font-black text-white">اشترك كـ محاضر طالب جامعي 🎓</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                لكل طالب متميز يريد شرح الكورسات والسكاشن لزملائه؛ نمنحك شهر كامل مجاناً وشارة "طالب معتمد" مع باقة اشتراك مخفضة ومدعومة.
              </p>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                  <span>المنحة التجريبية:</span>
                  <span className="text-yellow-300 font-black">شهر كامل مجاناً (30 يوماً 🎁)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                  <span>سعر الباقة بعد الشهر:</span>
                  <span className="text-emerald-400 font-black">120 ج.م فقط (خصم 60% مدعوم)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                  <span>شرط الاستحقاق:</span>
                  <span className="text-white">كارنيه كلية ساري + سن 23 فأقل</span>
                </div>
              </div>
            </div>

            <Link
              href="/register?role=instructor&track=student"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs text-center shadow-xl shadow-amber-950/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>اشترك كـ محاضر طالب (شهر كامل مجاناً) 🎓</span>
              <ArrowLeft className="w-4 h-4 text-zinc-950" />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. DETAILED COMPARISON: أي المسارين يناسبك؟
         ========================================================================= */}
      <section className="max-w-4xl mx-auto py-8">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
            دليل الاختيار
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            مقارنة واضحة: أي المسارين أنسب لك؟
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            صممنا باقات مرنة تناسب الخبراء وأصحاب المراكز، وباقات مدعومة للشباب وطلبة الجامعات.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/90 shadow-2xl">
          <table className="w-full text-right text-xs">
            <thead className="bg-zinc-850 border-b border-zinc-800 text-zinc-300 font-bold">
              <tr>
                <th className="p-4 sm:p-5">الميزة والوجه المقارن</th>
                <th className="p-4 sm:p-5 text-purple-300">مسار المحاضر الخبير / الدكتور 💼</th>
                <th className="p-4 sm:p-5 text-amber-300">مسار المحاضر الطالب (سن 23) 🎓</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              <tr>
                <td className="p-4 font-bold text-white">الفئة المستهدفة</td>
                <td className="p-4">المدرسون، الدكاترة، وخبراء سوق العمل الحر</td>
                <td className="p-4 font-bold text-amber-300">طلبة الجامعات والمعاهد (سن 23 سنة فأقل)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">فترة التجربة المجانية</td>
                <td className="p-4">14 يوماً مجاناً بالكامل</td>
                <td className="p-4 font-black text-emerald-400">شهر كامل (30 يوماً مجاناً 🎁)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">قيمة الاشتراك بعد التجربة</td>
                <td className="p-4">290 ج.م شهرياً أو 1,499 ج.م سنوياً</td>
                <td className="p-4 font-black text-amber-300">120 ج.م شهرياً فقط (مدعوم بنسبة 60%)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">المستندات المطلوبة</td>
                <td className="p-4 text-emerald-400">لا توجد أي مستندات (تفعيل فوري)</td>
                <td className="p-4">كارنيه الكلية للعام الدراسي + إثبات السن</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">نسبة عمولة المنصة</td>
                <td className="p-4 text-emerald-400 font-bold">0% عمولة نهائياً</td>
                <td className="p-4 text-emerald-400 font-bold">0% عمولة نهائياً</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">تحصيل الأرباح</td>
                <td className="p-4">تحويل فوري إلى InstaPay والمحافظ</td>
                <td className="p-4">تحويل فوري إلى InstaPay والمحافظ</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">الشارة الأكاديمية</td>
                <td className="p-4 text-purple-300 font-bold">محاضر خبير معتمد ⭐</td>
                <td className="p-4 text-amber-300 font-bold">طالب محاضر معتمد 🎓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================================
          3. CORE ADVANTAGES
         ========================================================================= */}
      <section className="max-w-6xl mx-auto py-12">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
            مميزات الاستوديو السحابي
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            بنية تحتية متكاملة لنجاح المحاضر المحترف والمحاضر الطالب
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
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                      <div className={`absolute -inset-1.5 rounded-2xl bg-gradient-to-tr ${feat.glow} blur-md opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 animate-pulse`} />
                      <div className={`relative w-14 h-14 rounded-2xl p-[1.5px] bg-gradient-to-br ${feat.gradient} shadow-md ${feat.shadow} transition-all duration-300`}>
                        <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#191338] flex items-center justify-center transition-transform duration-300 group-hover:scale-[0.96]">
                          <Icon className={`w-6 h-6 ${feat.textCol} group-hover:scale-110 transition-transform duration-300`} />
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-black px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-white/5">
                      {feat.number}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors leading-snug">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-purple-900/30 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-zinc-400 relative z-10">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>متاح لكلا المسارين</span>
                  </span>
                  <span className="text-amber-500 font-bold">نشط في حسابك</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          4. ALL PRICING PLANS (INCLUDING STUDENT PLAN)
         ========================================================================= */}
      <section className="max-w-6xl mx-auto py-12">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
            باقات الاشتراك السحابية (SaaS)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            اختر الباقة الأنسب لمسارك التعليمي
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            جميع الباقات تشمل فترات تجريبية مجانية ودعماً فنياً على مدار الساعة بدون أي التزام مسبق.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch text-right">
          
          {/* Plan 1: Student-Instructor Plan (FLAGSHIP FOR STUDENTS) */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#281a0e]/95 to-[#150f28]/95 border-2 border-amber-500 shadow-2xl shadow-amber-500/20 flex flex-col justify-between space-y-6 relative group">
            <div className="absolute -top-3.5 right-1/2 translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 text-[10px] font-black shadow-md whitespace-nowrap">
              منحة الطلاب (سن 23 فأقل) 🎓
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-white">باقة المحاضر الطالب</h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black">
                  شهر مجاناً
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                مخصصة لطلبة الجامعات والمعاهد لتقديم الشروحات لزملائهم بأسعار رمزية مدعومة.
              </p>
              
              <div className="py-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-400">120</span>
                  <span className="text-xs font-bold text-zinc-400">ج.م / شهرياً</span>
                </div>
                <div className="text-[11px] text-zinc-500 line-through mt-0.5">بدلاً من 350 ج.م (خصم 60%)</div>
              </div>

              <ul className="space-y-2 text-xs text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> <span className="font-bold text-white">30 يوماً تجربة مجانية أولاً</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> رفع ونشر الكورسات والدروس</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> شارة "طالب محاضر معتمد"</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> 0% عمولة على المبيعات</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> تحصيل مباشر عبر InstaPay</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> شهادات إتمام وامتحانات للطلاب</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor&track=student"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-zinc-950 font-black text-xs text-center transition-all shadow-md shadow-amber-950/40 cursor-pointer"
            >
              اشترك كمحاضر طالب (شهر مجاناً) 🎓
            </Link>
          </div>

          {/* Plan 2: Senior Trial (14 days) */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-white">فترة التجربة الأكاديمية</h3>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 text-[10px] font-black">
                  مجانية
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                مخصصة لتجربة المنصة ورفع المناهج والدروس الأولية دون أي التزام.
              </p>
              
              <div className="py-2">
                <span className="text-3xl font-black text-white">0</span>
                <span className="text-xs font-bold text-zinc-400 mr-1">ج.م / 14 يوماً</span>
              </div>

              <ul className="space-y-2 text-xs text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> تجربة كاملة لمدة 14 يوماً</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> رفع ونشر الكورسات والدروس</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> ربط بيانات InstaPay والمحافظ</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 0% عمولة على المبيعات</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor&track=expert"
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs text-center transition-all cursor-pointer"
            >
              بدء الـ 14 يوماً مجاناً 💼
            </Link>
          </div>

          {/* Plan 3: Senior Annual */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-purple-800/60 shadow-xl flex flex-col justify-between space-y-6 relative">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-white">الاشتراك السنوي الشامل</h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                  وفر شهرين
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                الخيار الأمثل للمدربين والأساتذة لتحقيق أعلى استقرار وأفضل عائد استثماري.
              </p>
              
              <div className="py-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-400">1,499</span>
                  <span className="text-xs font-bold text-zinc-400">ج.م / سنوياً</span>
                </div>
                <div className="text-[11px] text-zinc-500 line-through mt-0.5">بدلاً من 3,500 ج.م</div>
              </div>

              <ul className="space-y-2 text-xs text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> 14 يوماً تجربة مجانية أولاً</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> كورسات وطلاب غير محدود</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> 0% عمولة نهائياً على المبيعات</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> إبراز الدورات بالصفحة الرئيسية</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> أولوية في الدعم الفني</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor&track=expert"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs text-center transition-all cursor-pointer shadow-md"
            >
              الاشتراك السنوي المحترف
            </Link>
          </div>

          {/* Plan 4: Senior Monthly */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-white">الاشتراك الشهري المحترف</h3>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 text-[10px] font-black">
                  مرونة شهرية
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                سداد شهري مرن للخبراء والمراكز مع إمكانية الترقية أو الإلغاء في أي وقت.
              </p>
              
              <div className="py-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">290</span>
                  <span className="text-xs font-bold text-zinc-400">ج.م / شهرياً</span>
                </div>
                <div className="text-[11px] text-zinc-500 line-through mt-0.5">بدلاً من 500 ج.م</div>
              </div>

              <ul className="space-y-2 text-xs text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 14 يوماً تجربة مجانية في البداية</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> عدد كورسات وطلاب غير محدود</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 0% عمولة على المبيعات</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> تحويل فوري لأرباحك عبر InstaPay</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor&track=expert"
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs text-center transition-all cursor-pointer"
            >
              الاشتراك الشهري المرن
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. FINAL CALL TO ACTION
         ========================================================================= */}
      <section className="max-w-4xl mx-auto py-12 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-white/95 dark:bg-gradient-to-b dark:from-[#171233]/95 dark:to-[#100c24]/95 border border-slate-200 dark:border-purple-800/40 shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div className="absolute -inset-3 rounded-3xl bg-amber-500/20 blur-lg animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl p-[2px] bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-xl shadow-amber-500/25">
              <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#1a143b] flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-amber-500" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            ابدأ رحلتك التدريبية معنا اليوم
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 max-w-lg mx-auto leading-relaxed">
            سواء كنت محاضراً خبيراً أو طالباً جامعياً طموحاً؛ منصة قمم توفر لك كل ما تحتاجه للنجاح واستقبال الطلاب مباشرة.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/register?role=instructor&track=student"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 text-zinc-950 font-black text-xs shadow-xl shadow-amber-950/40 transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-zinc-950" />
              <span>اشترك كمحاضر طالب (30 يوماً مجاناً) 🎓</span>
            </Link>

            <Link
              href="/register?role=instructor&track=expert"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-black text-xs shadow-xl shadow-purple-950/40 transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>انضم كمحاضر خبير (14 يوماً مجاناً) 💼</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
