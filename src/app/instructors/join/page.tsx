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
  Info,
  FileText
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

  // Dynamic Settings from Admin Panel
  const [platformSettings, setPlatformSettings] = useState({
    monthlyPrice: '290',
    annualPrice: '1499',
    studentPrice: '120',
    studentMaxAge: '22',
    studentTrialDays: '30',
    instructorTrialDays: '14',
    commissionPercent: '0',
    joinPageTitle: '',
    joinPageSubtitle: '',
    expertCardTitle: 'انضم كـ مدرس أو دكتور جامعي',
    expertCardDesc: 'مخصص للأساتذة والمحاضرين الذين يرغبون في بناء استوديو تعليمي سحابي مستقل لدفعاتهم مع سيطرة كاملة على المحتوى والأسعار.',
    studentCardTitle: 'اشترك كـ محاضر طالب',
    studentCardDesc: 'لكل طالب بالكلية أو المدرسة يريد شرح المواد لزملائه؛ نمنحك شهر كامل مجاناً وشارة "طالب معتمد" مع باقة اشتراك مدعومة ومخفضة.',
    studentProofText: 'كارنيه، جدول دراسي، أو إثبات قيد',
  });

  useEffect(() => {
    const fetchSettings = () => {
      fetch('/api/settings', { cache: 'no-store' })
        .then((r) => r.json())
        .then((data) => {
          if (data) {
            const map = data.settings || {};
            setPlatformSettings({
              monthlyPrice: data.instructorPriceMonthly || map.INSTRUCTOR_PRICE_MONTHLY || '290',
              annualPrice: data.instructorPriceAnnual || map.INSTRUCTOR_PRICE_ANNUAL || '1499',
              studentPrice: data.instructorPriceStudent || map.INSTRUCTOR_PRICE_STUDENT || '120',
              studentMaxAge: data.studentMaxAge || map.STUDENT_MAX_AGE || '22',
              studentTrialDays: data.studentTrialDays || map.STUDENT_TRIAL_DAYS || '30',
              instructorTrialDays: data.instructorTrialDays || map.INSTRUCTOR_TRIAL_DAYS || '14',
              commissionPercent: data.platformCommissionPercent || map.PLATFORM_COMMISSION_PERCENT || '0',
              joinPageTitle: map.JOIN_PAGE_TITLE || '',
              joinPageSubtitle: map.JOIN_PAGE_SUBTITLE || '',
              expertCardTitle: map.JOIN_EXPERT_CARD_TITLE || 'انضم كـ مدرس أو دكتور جامعي',
              expertCardDesc: map.JOIN_EXPERT_CARD_DESC || 'مخصص للأساتذة والمحاضرين الذين يرغبون في بناء استوديو تعليمي سحابي مستقل لدفعاتهم مع سيطرة كاملة على المحتوى والأسعار.',
              studentCardTitle: map.JOIN_STUDENT_CARD_TITLE || 'اشترك كـ محاضر طالب',
              studentCardDesc: map.JOIN_STUDENT_CARD_DESC || 'لكل طالب بالكلية أو المدرسة يريد شرح المواد لزملائه؛ نمنحك شهر كامل مجاناً وشارة "طالب معتمد" مع باقة اشتراك مدعومة ومخفضة.',
              studentProofText: map.JOIN_STUDENT_PROOF_TEXT || 'كارنيه، جدول دراسي، أو إثبات قيد',
            });
          }
        })
        .catch(() => {});
    };

    fetchSettings();
    window.addEventListener('platform-settings-updated', fetchSettings);
    return () => window.removeEventListener('platform-settings-updated', fetchSettings);
  }, []);

  // Dynamic Revenue Calculator
  const [studentCount, setStudentCount] = useState(80);
  const [coursePrice, setCoursePrice] = useState(350);

  const totalRevenue = studentCount * coursePrice;
  const traditionalCut = Math.round(totalRevenue * 0.40); // 40% traditional cut
  const netEarnings = totalRevenue;

  const features = [
    {
      number: '01',
      title: `نموذج ${platformSettings.commissionPercent}% عمولة على المبيعات`,
      description: `تحتفظ بكامل عوائد دوراتك التدريبية بنسبة 100%. لا نقتطع أي نسبة مئوية من مبيعاتك نهائياً، فالجهد جهدك والعائد بالكامل لك.`,
      icon: Percent,
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderCol: 'border-emerald-500/30 hover:border-emerald-500/60',
      iconCol: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      accentGlow: 'group-hover:shadow-emerald-500/20',
    },
    {
      number: '02',
      title: 'تحصيل فوري ومباشر عبر InstaPay والمحافظ',
      description: 'يقوم الطلاب بتحويل قيمة الكورس مباشرة إلى حسابك الشخصي في إنستاباي أو فودافون كاش دون وسيط، وتتحكم بالقبول بضغطة زر واحدة.',
      icon: Smartphone,
      gradient: 'from-indigo-500/20 via-purple-500/10 to-transparent',
      borderCol: 'border-indigo-500/30 hover:border-indigo-500/60',
      iconCol: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      accentGlow: 'group-hover:shadow-indigo-500/20',
    },
    {
      number: '03',
      title: 'حماية متقدمة للمحتوى المرئي (فيديوهات حتى 1GB)',
      description: 'تشفير فائق للمقاطع يمنع التحميل أو تصوير الشاشة، مع إمكانية رفع مقاطع عالية الوضوح بسعة تصل إلى 1024 ميجابايت ومشغل سينمائي متكيف.',
      icon: ShieldCheck,
      gradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
      borderCol: 'border-sky-500/30 hover:border-sky-500/60',
      iconCol: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      accentGlow: 'group-hover:shadow-sky-500/20',
    },
    {
      number: '04',
      title: 'امتحانات إجبارية لكل درس وامتحان نهائي معتمد',
      description: 'اربط كل درس باختبار إجباري يمنع التخطي إلا بالاجتياز، مع إمكانية تفعيل امتحان شامل في نهاية الكورس يُخرج شهادة إتمام موثقة برمز تحقق رقمي.',
      icon: Award,
      gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      borderCol: 'border-amber-500/30 hover:border-amber-500/60',
      iconCol: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      accentGlow: 'group-hover:shadow-amber-500/20',
    },
    {
      number: '05',
      title: 'كوبونات خصم وحملات ترويجية مخصصة',
      description: 'لوحة متكاملة لإنشاء وتوليد أكواد الخصم الترويجية لطلابك، مع تحديد نسب الخصم وعدد مرات الاستخدام وتواريخ الصلاحية لزيادة سرعة الالتحاق.',
      icon: Zap,
      gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
      borderCol: 'border-rose-500/30 hover:border-rose-500/60',
      iconCol: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      accentGlow: 'group-hover:shadow-rose-500/20',
    },
    {
      number: '06',
      title: 'استوديو تدريس سحابي وإحصائيات متقدمة',
      description: 'لوحة تحكم ذكية تتيح لك متابعة تفاعل طلابك، نسب الإكمال، وتقييمات الدروس، مع إمكانية التواصل والرد على استفسارات الطلاب مباشرة.',
      icon: Layers,
      gradient: 'from-violet-500/20 via-indigo-500/10 to-transparent',
      borderCol: 'border-violet-500/30 hover:border-violet-500/60',
      iconCol: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
      accentGlow: 'group-hover:shadow-violet-500/20',
    },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#090d19] text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      
      {/* =========================================================================
          SOPHISTICATED DYNAMIC AMBIENT DRIFT ORBS (CALM, ELEGANT BREAKING COLORS)
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="dynamic-drift-1 absolute -top-[10%] right-[12%] w-[650px] h-[650px] bg-gradient-to-br from-indigo-600/15 via-blue-600/10 to-transparent rounded-full blur-[140px]" />
        <div className="dynamic-drift-2 absolute top-[30%] -left-[5%] w-[700px] h-[700px] bg-gradient-to-tr from-purple-600/12 via-violet-600/8 to-transparent rounded-full blur-[160px]" />
        <div className="dynamic-drift-3 absolute bottom-[5%] right-[15%] w-[600px] h-[600px] bg-gradient-to-br from-amber-500/8 via-teal-500/6 to-transparent rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      </div>

      {/* =========================================================================
          1. HERO & TRACK NAVIGATION
         ========================================================================= */}
      <section className="max-w-5xl mx-auto text-center pt-4 pb-12 space-y-6">
        
        {/* Track Segmented Switcher (Calm, Dynamic, Pure SVG) */}
        <div className="inline-flex p-1.5 rounded-2xl bg-[#11162b]/90 border border-indigo-900/40 shadow-2xl backdrop-blur-xl gap-1.5 flex-wrap justify-center ring-1 ring-white/5">
          <button
            type="button"
            onClick={() => setActiveTrack('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTrack === 'all'
                ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                : 'text-zinc-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>عرض كل المسارات</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTrack('expert')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTrack === 'expert'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500/50'
                : 'text-zinc-400 hover:text-indigo-300 hover:bg-slate-800/50'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-indigo-400" />
            <span>مسار المدرسين والدكاترة الجامعيين ({platformSettings.instructorTrialDays} يوماً مجاناً)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTrack('student')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTrack === 'student'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/30 border border-amber-400'
                : 'text-zinc-400 hover:text-amber-300 hover:bg-slate-800/50'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>مسار المحاضر الطالب ({platformSettings.studentTrialDays} يوماً مجاناً)</span>
          </button>
        </div>

        {/* Dynamic Tag */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              {activeTrack === 'student'
                ? 'منحة تمكين وإطلاق طلبة الكليات والمدارس والمعاهد'
                : activeTrack === 'expert'
                ? 'برنامج السحابة الأكاديمية للمدرسين والأساتذة الجامعيين'
                : 'المنصة السحابية المتكاملة للتعليم الجامعي والأكاديمي'}
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          {platformSettings.joinPageTitle ? (
            platformSettings.joinPageTitle
          ) : activeTrack === 'student' ? (
            <>
              اشرح لزملائك وأطلق أول كورس لك مع{' '}
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                {platformSettings.studentTrialDays} يوماً مجاناً
              </span>
            </>
          ) : (
            <>
              درّس لطلابك واحتفظ بـ{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                كامل عوائد مبيعاتك ({100 - Number(platformSettings.commissionPercent)}%)
              </span>{' '}
              مباشرة
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base lg:text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed">
          {platformSettings.joinPageSubtitle ? (
            platformSettings.joinPageSubtitle
          ) : activeTrack === 'student'
            ? `إذا كنت طالباً بالكلية أو المدرسة وتريد تقديم الشروحات والمناهج لزملائك؛ نوفر لك منحة ${platformSettings.studentTrialDays} يوماً مجاناً بالكامل مع باقة اشتراك مدعومة (${platformSettings.studentPrice} ج.م) بإثبات دراسي بسيط (${platformSettings.studentProofText}) دون الحاجة لبطاقة شخصية.`
            : 'استوديو تدريس سحابي متكامل يمنح المدرسين والدكاترة الجامعيين استقلالية تامة، مع تحويل أرباحك فورياً إلى حسابك الشخصي عبر إنستاباي والمحافظ بدون اقتطاع أي عمولة.'}
        </p>

        {/* =========================================================================
            DUAL TRACK HERO CARDS (ATTRACTIVE, CALM, HIGH CONTRAST)
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-right">
          
          {/* Card 1: Teachers & University Professors */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group ${
              activeTrack === 'expert' || activeTrack === 'all'
                ? 'bg-gradient-to-b from-[#141a38]/90 via-[#0f142b]/90 to-[#0a0d1e]/90 border-indigo-500/40 shadow-2xl shadow-indigo-950/40 ring-1 ring-indigo-500/30'
                : 'bg-[#101426]/50 border-zinc-800/70 opacity-60'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-bold inline-flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-400" />
                  للمدرسين والدكاترة الجامعيين
                </span>
                <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  تفعيل فوري بدون مستندات
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-white">
                  {platformSettings.expertCardTitle}
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {platformSettings.expertCardDesc}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-200">
                  <span>الفترة التجريبية:</span>
                  <span className="text-indigo-300 font-black">{platformSettings.instructorTrialDays} يوماً مجاناً بالكامل</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-indigo-200">
                  <span>عمولة المبيعات:</span>
                  <span className="text-emerald-400 font-black">{platformSettings.commissionPercent}% (الأرباح لك 100%)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-indigo-200">
                  <span>التحصيل المالي:</span>
                  <span className="text-white">InstaPay وفودافون كاش مباشرة</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-indigo-200">
                  <span>المستندات المطلوبة:</span>
                  <span className="text-emerald-400 font-bold">لا يُطلب أي مستند (بدء مباشر)</span>
                </div>
              </div>
            </div>

            <Link
              href="/register?role=instructor&track=expert"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs text-center shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>بدء تجربة المدرس أو الدكتور ({platformSettings.instructorTrialDays} يوماً مجاناً)</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Student Instructors */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group ${
              activeTrack === 'student' || activeTrack === 'all'
                ? 'bg-gradient-to-b from-[#211a10]/95 via-[#15121c]/95 to-[#0e0b16]/95 border-amber-500/60 shadow-2xl shadow-amber-950/30 ring-1 ring-amber-500/40'
                : 'bg-[#101426]/50 border-zinc-800/70 opacity-60'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold inline-flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  لطلبة الكليات والمدارس
                </span>
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  إثبات دراسي ميسر
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-white">
                  {platformSettings.studentCardTitle}
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {platformSettings.studentCardDesc}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                  <span>المنحة التجريبية:</span>
                  <span className="text-amber-400 font-black">{platformSettings.studentTrialDays} يوماً مجاناً بالكامل</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                  <span>سعر الباقة بعد التجربة:</span>
                  <span className="text-emerald-400 font-black">{platformSettings.studentPrice} ج.م شهرياً</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                  <span>إثبات الدراسة المطلوب:</span>
                  <span className="text-white">{platformSettings.studentProofText}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                  <span>البطاقة الشخصية:</span>
                  <span className="text-emerald-400 font-bold">لا يُطلب بطاقة شخصية نهائياً</span>
                </div>
              </div>
            </div>

            <Link
              href="/register?role=instructor&track=student"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-xs text-center shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>اشترك كـ محاضر طالب ({platformSettings.studentTrialDays} يوماً مجاناً)</span>
              <ArrowLeft className="w-4 h-4 text-zinc-950" />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. DYNAMIC LIVE REVENUE CALCULATOR (CALM & ENGAGING)
         ========================================================================= */}
      <section className="max-w-4xl mx-auto py-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#131836] via-[#0e1329] to-[#090d1f] border border-indigo-500/25 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-indigo-400">حاسبة العوائد التفاعلية</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              كم ستحقق من أرباح مع نموذج {platformSettings.commissionPercent}% عمولة؟
            </h2>
            <p className="text-xs text-zinc-400">
              حرك المؤشرات لتكتشف الفارق بين منصة قمم والمنصات التقليدية التي تقتطع 30% إلى 50% من أرباحك.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>عدد الطلاب المتوقع:</span>
                  <span className="text-indigo-400 font-mono text-sm">{studentCount} طالب</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>متوسط سعر الكورس:</span>
                  <span className="text-indigo-400 font-mono text-sm">{coursePrice} ج.م</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#090d1e] border border-indigo-900/50 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-medium text-zinc-400">صافي أرباحك في منصتنا (100% لك):</span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono drop-shadow-[0_0_15px_rgba(52,211,153,0.25)]">
                  {netEarnings.toLocaleString('en-US')} <span className="text-sm font-bold text-zinc-400">ج.م</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>عمولة المنصات التقليدية (40%):</span>
                  <span className="text-rose-400 font-bold line-through">-{traditionalCut.toLocaleString('en-US')} ج.م</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400">
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
          <span className="text-xs font-bold text-indigo-400">دليل الاختيار الأكاديمي</span>
          <h2 className="text-2xl font-black text-white">
            مقارنة واضحة: أي المسارين أنسب لك؟
          </h2>
          <p className="text-xs text-zinc-400">
            صممنا باقات مخصصة تناسب الأساتذة والدكاترة، وباقات مدعومة للطلبة.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-[#0f1326] shadow-2xl">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#141b3a] border-b border-zinc-800 text-zinc-300 font-bold">
              <tr>
                <th className="p-4 sm:p-5">الميزة والوجه المقارن</th>
                <th className="p-4 sm:p-5 text-indigo-300">مسار المدرس أو الدكتور الجامعي</th>
                <th className="p-4 sm:p-5 text-amber-300">مسار المحاضر الطالب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              <tr>
                <td className="p-4 font-bold text-white">الفئة المستهدفة</td>
                <td className="p-4">المدرسون، الدكاترة، والأساتذة من كافة الأعمار</td>
                <td className="p-4 font-bold text-amber-300">طلبة الكليات والمدارس والمعاهد (حتى سن {platformSettings.studentMaxAge} سنة)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">فترة التجربة المجانية</td>
                <td className="p-4">{platformSettings.instructorTrialDays} يوماً مجاناً بالكامل</td>
                <td className="p-4 font-bold text-emerald-400">{platformSettings.studentTrialDays} يوماً مجاناً بالكامل</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">قيمة الاشتراك بعد التجربة</td>
                <td className="p-4">{platformSettings.monthlyPrice} ج.م شهرياً أو {platformSettings.annualPrice} ج.م سنوياً</td>
                <td className="p-4 font-bold text-amber-400">{platformSettings.studentPrice} ج.م شهرياً فقط</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">المستندات المطلوبة</td>
                <td className="p-4 text-emerald-400 font-medium">لا توجد أي مستندات (تفعيل فوري)</td>
                <td className="p-4 text-emerald-400 font-medium">{platformSettings.studentProofText} - بدون بطاقة شخصية</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">نسبة عمولة المنصة</td>
                <td className="p-4 text-emerald-400 font-bold">{platformSettings.commissionPercent}% عمولة نهائياً</td>
                <td className="p-4 text-emerald-400 font-bold">{platformSettings.commissionPercent}% عمولة نهائياً</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">تحصيل الأرباح</td>
                <td className="p-4">تحويل فوري إلى InstaPay وفودافون كاش</td>
                <td className="p-4">تحويل فوري إلى InstaPay وفودافون كاش</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">الشارة الأكاديمية</td>
                <td className="p-4 text-indigo-300 font-bold">محاضر معتمد</td>
                <td className="p-4 text-amber-400 font-bold">طالب محاضر معتمد</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================================
          4. CORE ADVANTAGES (DYNAMIC GLOWING CARDS)
         ========================================================================= */}
      <section className="max-w-6xl mx-auto py-10">
        <div className="text-center space-y-1 mb-10">
          <span className="text-xs font-bold text-indigo-400">مميزات المنصة السحابية</span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            بنية تحتية متكاملة لنجاح المدرس، الدكتور، والمحاضر الطالب
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            ميزات حصرية تمنحك الأفضلية التقنية والمالية على أي منصة تعليمية أخرى.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon;

            return (
              <div
                key={feat.number}
                className={`p-6 rounded-3xl bg-[#101428] border ${feat.borderCol} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-right space-y-4 group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${feat.iconCol}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-500">
                      {feat.number}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-bold text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>متاح للمسارين</span>
                  </span>
                  <span className="text-indigo-400">نشط في حسابك</span>
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
          <span className="text-xs font-bold text-indigo-400">باقات الاشتراك السحابية</span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            اختر الباقة الأنسب لمسارك التعليمي
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            جميع الباقات تشمل فترات تجريبية مجانية مع حفظ كامل بيانات دوراتك وطلابك.
          </p>
        </div>

        {/* Explicit Rule Banner */}
        <div className="max-w-3xl mx-auto mb-8 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-right">
            <span className="font-bold text-white block">ملاحظة تنظيمية هامة بشأن الاشتراكات:</span>
            <p className="text-zinc-300 leading-relaxed">
              إذا كان عمر المحاضر <strong>أكبر من {platformSettings.studentMaxAge} سنة</strong>، فإنه يشترك في <strong>باقة المدرسين والدكاترة العادية</strong> (الاشتراك الشهري {platformSettings.monthlyPrice} ج.م أو السنوي {platformSettings.annualPrice} ج.م). أما <strong>باقة المحاضر الطالب ({platformSettings.studentPrice} ج.م)</strong> فهي منحة مخصصة لطلبة الكليات والمدارس حتى سن {platformSettings.studentMaxAge} سنة بإثبات دراسي ({platformSettings.studentProofText}) دون الحاجة لبطاقة شخصية.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch text-right">
          
          {/* Plan 1: Regular Monthly Plan */}
          <div className="p-6 rounded-3xl bg-[#0f1426] border border-zinc-800 shadow-md flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-white">الباقة العادية - شهري</h3>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 text-[10px] font-bold">
                  مرونة شهرية
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                سداد شهري مرن للمدرسين والدكاترة مع إمكانية الترقية أو الإلغاء في أي وقت.
              </p>
              
              <div className="py-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{platformSettings.monthlyPrice}</span>
                  <span className="text-xs font-bold text-zinc-400">ج.م / شهرياً</span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">متاح لكافة الأعمار</div>
              </div>

              <ul className="space-y-2 text-xs text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {platformSettings.instructorTrialDays} يوماً تجربة مجانية في البداية</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> كورسات وطلاب غير محدود</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {platformSettings.commissionPercent}% عمولة على المبيعات</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> تحويل فوري لأرباحك عبر إنستاباي</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor&track=expert"
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs text-center transition-all cursor-pointer"
            >
              الاشتراك الشهري ({platformSettings.monthlyPrice} ج.م)
            </Link>
          </div>

          {/* Plan 2: Regular Annual Plan (Featured) */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#161d3d] to-[#0f142b] border-2 border-indigo-500/60 shadow-xl shadow-indigo-950/40 flex flex-col justify-between space-y-5 relative">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-white">الباقة العادية - سنوي</h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                  وفر شهرين
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                الخيار الأمثل للمدرسين والأساتذة لتحقيق أعلى استقرار وأفضل عائد استثماري.
              </p>
              
              <div className="py-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-indigo-400">{platformSettings.annualPrice}</span>
                  <span className="text-xs font-bold text-zinc-400">ج.م / سنوياً</span>
                </div>
                <div className="text-[11px] text-zinc-500 line-through mt-0.5">بدلاً من 3,500 ج.م</div>
              </div>

              <ul className="space-y-2 text-xs text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> {platformSettings.instructorTrialDays} يوماً تجربة مجانية أولاً</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> عدد كورسات وطلاب غير محدود</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> {platformSettings.commissionPercent}% عمولة نهائياً على المبيعات</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> أولوية في الدعم الفني المخصص</li>
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
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#211a10] to-[#120f18] border-2 border-amber-500/70 shadow-xl shadow-amber-950/30 flex flex-col justify-between space-y-5 relative">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-white">باقة المحاضر الطالب</h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black">
                  {platformSettings.studentTrialDays} يوم مجاناً
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                مخصصة لطلبة الكليات والمدارس لتقديم الشروحات لزملائهم بسعر رمزي مدعوم.
              </p>
              
              <div className="py-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-400">{platformSettings.studentPrice}</span>
                  <span className="text-xs font-bold text-zinc-400">ج.م / شهرياً</span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">بإثبات دراسي ({platformSettings.studentProofText}) - سن {platformSettings.studentMaxAge} فأقل</div>
              </div>

              <ul className="space-y-2 text-xs text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {platformSettings.studentTrialDays} يوماً تجربة مجانية أولاً</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> رفع ونشر الكورسات والدروس</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> شارة طالب محاضر معتمد</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> مخصص لسن {platformSettings.studentMaxAge} سنة فأقل</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor&track=student"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs text-center transition-all shadow-md cursor-pointer"
            >
              اشترك كمحاضر طالب ({platformSettings.studentPrice} ج.م)
            </Link>
          </div>

          {/* Plan 4: Academic Trial */}
          <div className="p-6 rounded-3xl bg-[#0f1426] border border-zinc-800 shadow-md flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-white">التجربة الأكاديمية</h3>
                <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-[10px] font-bold">
                  مجانية
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                مخصصة لتجربة المنصة ورفع المناهج والدروس الأولية دون أي التزام مسبق.
              </p>
              
              <div className="py-2">
                <span className="text-3xl font-black text-white">0</span>
                <span className="text-xs font-bold text-zinc-400 mr-1">ج.م / {platformSettings.instructorTrialDays} يوماً</span>
                <div className="text-[11px] text-zinc-500 mt-0.5">بدون بطاقة ائتمان</div>
              </div>

              <ul className="space-y-2 text-xs text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> تجربة كاملة لمدة {platformSettings.instructorTrialDays} يوماً</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> رفع ونشر الكورسات</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> ربط بيانات إنستاباي والمحافظ</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor&track=expert"
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs text-center transition-all cursor-pointer"
            >
              بدء الـ {platformSettings.instructorTrialDays} يوماً مجاناً
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. FINAL CALL TO ACTION
         ========================================================================= */}
      <section className="max-w-4xl mx-auto py-10 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#141a38] via-[#0f142b] to-[#0a0d1e] border border-indigo-900/50 shadow-2xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
            <GraduationCap className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              ابدأ رحلتك التدريبية معنا اليوم
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
              سواء كنت مدرساً أو دكتوراً جامعياً، أو طالباً طموحاً؛ المنصة توفر لك كل ما تحتاجه للنجاح واستقبال الطلاب مباشرة.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/register?role=instructor&track=expert"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building className="w-4 h-4" />
              <span>انضم كمدرس أو دكتور ({platformSettings.instructorTrialDays} يوماً مجاناً)</span>
            </Link>

            <Link
              href="/register?role=instructor&track=student"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-zinc-950" />
              <span>اشترك كمحاضر طالب ({platformSettings.studentTrialDays} يوماً مجاناً)</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
