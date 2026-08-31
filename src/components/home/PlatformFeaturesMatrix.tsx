'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  Laptop,
  PlaySquare,
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  Zap,
  TrendingUp,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Flame,
  Star,
  GraduationCap,
  Layers,
  FileText,
  BadgePercent,
  Compass,
  Crown,
} from 'lucide-react';

interface PlatformFeaturesMatrixProps {
  platformName?: string;
  whatsappUrl?: string | null;
}

export default function PlatformFeaturesMatrix({
  platformName = 'أكاديمية م / محمد إبراهيم',
  whatsappUrl,
}: PlatformFeaturesMatrixProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'STUDY' | 'RESOURCES' | 'CAREER' | 'INSTRUCTORS'>('ALL');

  // Key highlight feature cards
  const coreFeatures = [
    {
      id: 'ai-tutor',
      category: 'STUDY',
      title: 'مساعد ذكي فوري AI Tutor 24/7',
      description: 'مساعد ذكاء اصطناعي مدمج داخل كل مشغل فيديو، يشرح الأكواد المعقدة، ويصحح الأخطاء البرمجية لحظياً دون انتظار.',
      icon: Bot,
      accentColor: 'from-amber-500 to-yellow-400',
      badge: 'حصري وجديد',
      badgeColor: 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
      bgGlow: 'hover:shadow-amber-500/20',
      borderGlow: 'hover:border-amber-500/50',
    },
    {
      id: 'real-projects',
      category: 'STUDY',
      title: 'مشاريع إنتاج برمجية لسوق العمل',
      description: 'لا نكتفي بالنظري؛ ستقوم ببناء أنظمة وتطبيقات ويب وسحابية كاملة من الصفر ورفعها على بيئة الإنتاج السحابية لتعزيز ملف أعمالك.',
      icon: Laptop,
      accentColor: 'from-blue-500 to-indigo-500',
      badge: 'تأهيل عملي',
      badgeColor: 'bg-blue-100 text-blue-950 border-blue-300 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30',
      bgGlow: 'hover:shadow-blue-500/20',
      borderGlow: 'hover:border-blue-500/50',
    },
    {
      id: 'notes-marketplace',
      category: 'RESOURCES',
      title: 'سوق المذكرات وبنوك الأسئلة الرقمية',
      description: 'مكتبة هندسية متكاملة تحتوي على ملخصات جامعية، كتب إلكترونية، ونماذج امتحانات محلولة مع ميزة المعاينة المجانية قبل الشراء.',
      icon: BookOpen,
      accentColor: 'from-emerald-500 to-teal-400',
      badge: 'معاينة مجانية',
      badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
      bgGlow: 'hover:shadow-emerald-500/20',
      borderGlow: 'hover:border-emerald-500/50',
    },
    {
      id: 'verified-certificates',
      category: 'CAREER',
      title: 'شهادات تخرج معتمدة برمز QR رقمي',
      description: 'شهادات إتمام مهنية رسمية مشفرة برمز QR للتحقق اللحظي عبر الإنترنت لتقديمها للشركات العالمية وإضافتها على LinkedIn.',
      icon: Award,
      accentColor: 'from-purple-500 to-pink-500',
      badge: 'تحقق فوري',
      badgeColor: 'bg-purple-100 text-purple-950 border-purple-300 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30',
      bgGlow: 'hover:shadow-purple-500/20',
      borderGlow: 'hover:border-purple-500/50',
    },
    {
      id: 'smart-video-player',
      category: 'STUDY',
      title: 'مشغل فيديو تفاعلي ذكي فائق السرعة',
      description: 'سيرفرات فيديو فائقة السرعة تدعم جودات متعددة، التحكم في سرعة العرض، تسجيل الملاحظات الزمنية، وبطاقات التلخيص السريع.',
      icon: PlaySquare,
      accentColor: 'from-sky-500 to-cyan-400',
      badge: 'أداء فائق',
      badgeColor: 'bg-sky-100 text-sky-950 border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30',
      bgGlow: 'hover:shadow-sky-500/20',
      borderGlow: 'hover:border-sky-500/50',
    },
    {
      id: 'instructor-empowerment',
      category: 'INSTRUCTORS',
      title: 'منظومة دعم المحاضرين والطلاب المتميزين',
      description: 'فرصة للمحاضرين والطلاب المتميزين لنشر دوراتهم ومذكراتهم وتحقيق دخل حقيقي مع منحة 14 يوماً مجاناً و 0% عمولة في البداية.',
      icon: Users,
      accentColor: 'from-rose-500 to-orange-400',
      badge: '0% عمولة',
      badgeColor: 'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30',
      bgGlow: 'hover:shadow-rose-500/20',
      borderGlow: 'hover:border-rose-500/50',
    },
  ];

  // Comprehensive Comparison Table Data
  const comparisonRows = [
    {
      feature: 'تطبيق عملي ومشاريع برمجية واقعية',
      description: 'بناء مشاريع إنتاج كاملة ترفع على السحابة (GitHub & Cloud Hosting)',
      us: '100% مشاريع واقعية جاهزة لسوق العمل',
      others: 'شروحات نظرية وتمارين بسيطة فقط',
      usHighlight: true,
    },
    {
      feature: 'مساعد ذكي فوري AI Assistant داخل المشغل',
      description: 'مساعد ذكاء اصطناعي تفاعلي يشرح ويفحص الأكواد 24 ساعة يومياً',
      us: 'متاح فوري ومجاني داخل كل درس',
      others: 'غير متوفر أو انتظار أيام للرد',
      usHighlight: true,
    },
    {
      feature: 'شهادات معتمدة مع رابط ورمز QR للتحقق الدولي',
      description: 'شهادات إتمام مهنية يمكن لأي شركة في العالم فحص صحتها بضغطة زر',
      us: 'نظام توثيق رقمي فوري QR Verification',
      others: 'ملفات PDF تقليدية سهلة التزييف',
      usHighlight: true,
    },
    {
      feature: 'سوق متكامل للمذكرات وبنوك الأسئلة المحلولة',
      description: 'ملخصات هندسية مركزة للمراجعة السريعة وحلول امتحانات سابقة',
      us: 'متاح مع ميزة المعاينة المجانية',
      others: 'محتوى فيديو فقط دون مذكرات منظمة',
      usHighlight: true,
    },
    {
      feature: 'تحديثات مستمرة لأحدث تقنيات 2026',
      description: 'تحديث المناهج البرمجية ومواكبة Next.js, AI, Python, TypeScript',
      us: 'محدثة باستمرار دون أي رسوم إضافية',
      others: 'دورات قديمة مسجلة منذ سنوات',
      usHighlight: true,
    },
    {
      feature: 'دعم فني مباشر وتواصل هندسي مع المحاضر',
      description: 'تواصل سريع عبر الواتساب والمجتمعات الهندسية المغلقة للمساعدة في أي عائق',
      us: 'دعم سريع ومباشر على مدار الساعة',
      others: 'تواصل بطيء عبر البريد فقط',
      usHighlight: true,
    },
    {
      feature: 'تسجيل الملاحظات وبطاقات الاستذكار السريع (Flashcards)',
      description: 'أدوات ذكية داخل كل درس لترسيخ المعلومات والمراجعة قبل المقابلات',
      us: 'مدمجة تلقائياً مع ملخص كل درس',
      others: 'غير متوفرة',
      usHighlight: true,
    },
  ];

  const filteredFeatures = activeTab === 'ALL' 
    ? coreFeatures 
    : coreFeatures.filter(f => f.category === activeTab);

  return (
    <section id="features-matrix" className="px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative overflow-hidden">
      
      {/* Background Radiant Glow Accents */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse,_rgba(245,158,11,0.12),_rgba(124,58,237,0.08)_50%,_transparent_75%)] dark:bg-[radial-gradient(ellipse,_rgba(245,158,11,0.08),_rgba(124,58,237,0.05)_50%,_transparent_75%)] blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(20,184,166,0.1),_transparent_70%)] blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        {/* =====================================================================
            1. SECTION HEADER
           ===================================================================== */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-indigo-50 dark:bg-amber-500/15 border border-indigo-200/90 dark:border-amber-500/30 text-indigo-900 dark:text-amber-300 text-xs sm:text-sm font-black shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-amber-400 animate-pulse" />
            <span>المنظومة التعليمية الهندسية الأكثر تكاملاً 2026</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            لماذا تختار <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-500 bg-clip-text text-transparent">{platformName}</span>؟
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-700 dark:text-zinc-300 leading-relaxed max-w-2xl mx-auto font-semibold">
            صممنا المنصة لتمنحك تجربة تعليمية فائقة تجمع بين التدريب العملي، الذكاء الاصطناعي، والمذكرات الاحترافية لنقلك من البداية حتى الاحتراف وسوق العمل.
          </p>
        </div>

        {/* =====================================================================
            2. INTERACTIVE CATEGORY TABS
           ===================================================================== */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { id: 'ALL', label: 'كافة المميزات', icon: Sparkles },
            { id: 'STUDY', label: 'التعلم والتطبيق العملي', icon: Laptop },
            { id: 'RESOURCES', label: 'المذكرات والمكتبة الرقمية', icon: BookOpen },
            { id: 'CAREER', label: 'الشهادات وسوق العمل', icon: Award },
            { id: 'INSTRUCTORS', label: 'المحاضرون والناشرون', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 shadow-lg shadow-amber-500/25 scale-105 border border-amber-400'
                    : 'bg-white dark:bg-zinc-900/60 text-slate-800 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white border border-slate-300 dark:border-zinc-800/80 hover:border-amber-500/60 shadow-sm'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-950' : 'text-amber-500 dark:text-amber-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =====================================================================
            3. LUXURY FEATURE CARDS GRID
           ===================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className={`group relative rounded-3xl p-7 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-2xl ${feat.bgGlow} ${feat.borderGlow} flex flex-col justify-between overflow-hidden`}
              >
                {/* Top Subtle Ambient Flare */}
                <div className={`absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r ${feat.accentColor} opacity-80 group-hover:opacity-100 transition-opacity`} />
                
                <div className="space-y-4">
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between gap-3">
                    <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${feat.accentColor} p-0.5 shadow-md group-hover:scale-110 transition-transform`}>
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black border ${feat.badgeColor}`}>
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-950 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                      {feat.description}
                    </p>
                  </div>
                </div>

                {/* Bottom decorative highlight */}
                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between text-xs font-black text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                    مشمول ومفعّل بالكامل
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>

        {/* =====================================================================
            4. COMPARISON MATRIX TABLE (جدول المقارنة الحصري)
           ===================================================================== */}
        <div className="space-y-6 pt-6">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
              جدول المقارنة الحصري: <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">نحن مقابل الآخرين</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 font-medium">
              اكتشف لماذا يثق بنا آلاف المهندسين والطلاب كوجهتهم الأولى لاحتراف البرمجة والذكاء الاصطناعي
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 backdrop-blur-2xl shadow-xl shadow-slate-200/50 dark:shadow-2xl overflow-hidden">
            
            {/* Desktop Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800/80 bg-slate-100/80 dark:bg-zinc-900/60">
                    <th className="py-5 px-6 text-sm font-black text-slate-950 dark:text-zinc-200 w-2/5">
                      الميزة الهندسية / المعيار
                    </th>
                    <th className="py-5 px-6 text-sm font-black text-amber-950 dark:text-amber-400 w-2/5 bg-amber-500/15 border-x border-amber-300 dark:border-amber-500/20">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-500 dark:text-amber-400 fill-amber-400" />
                        <span>{platformName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 font-black">الخيار الأفضل</span>
                      </div>
                    </th>
                    <th className="py-5 px-6 text-sm font-black text-slate-600 dark:text-zinc-400 w-1/5">
                      المنصات والدورات الأخرى
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200/80 dark:divide-zinc-800/50 text-xs sm:text-sm">
                  {comparisonRows.map((row, idx) => (
                    <tr 
                      key={idx} 
                      className="hover:bg-slate-50 dark:hover:bg-zinc-900/30 transition-colors"
                    >
                      {/* Feature Title & Description */}
                      <td className="py-4.5 px-6">
                        <div className="font-black text-slate-950 dark:text-zinc-100 text-sm">
                          {row.feature}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5 font-medium">
                          {row.description}
                        </div>
                      </td>

                      {/* Our Platform Cell (Highlighted with Gold Glow) */}
                      <td className="py-4.5 px-6 bg-amber-500/10 dark:bg-amber-500/[0.04] border-x border-amber-200 dark:border-amber-500/20 font-bold text-slate-950 dark:text-amber-300">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0 fill-emerald-500/20" />
                          <span>{row.us}</span>
                        </div>
                      </td>

                      {/* Other Platforms Cell */}
                      <td className="py-4.5 px-6 text-slate-600 dark:text-zinc-400">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
                          <span>{row.others}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>

        </div>

        {/* =====================================================================
            5. HIGH-CONVERSION CTA BANNER
           ===================================================================== */}
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-amber-500/30 bg-gradient-to-r from-slate-950 via-zinc-900 to-slate-950 text-white shadow-2xl text-center sm:text-right flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Radiant Corner Bloom */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-black">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>ابدأ رحلتك الهندسية الآن واستفد من الخصم الاستثنائي</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              جاهز لبناء مستقبلك البرمجي مع أقوى نخبة من المهندسين؟
            </h3>
            
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
              انضم إلى آلاف الطلاب واستفد من مسارات عملية، مذكرات متكاملة، ودعم فني وهندسي مباشر يضمن لك الوصول لسوق العمل بثقة.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
            <Link
              href="/courses"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-zinc-950" />
              <span>تصفح الكورسات والدبلومات</span>
              <ArrowLeft className="w-4 h-4 text-zinc-950" />
            </Link>

            <Link
              href="/books"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-black text-sm border border-zinc-700 hover:border-amber-400 transition-all text-center flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>سوق المذكرات والكتب</span>
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
}

