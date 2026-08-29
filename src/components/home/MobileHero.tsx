import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Headphones,
  Mail,
  Facebook,
  Send,
  Youtube,
  Linkedin,
} from 'lucide-react';

interface MobileHeroProps {
  settings: Record<string, string>;
  cleanPlatformName: string;
  trendingDiploma: any;
  whatsappUrl: string | null;
  contactEmail: string | null;
  facebookUrl: string | null;
  telegramUrl: string | null;
  youtubeUrl: string | null;
  linkedinUrl: string | null;
  hasAnySocial: boolean;
}

export default function MobileHero({
  settings,
  cleanPlatformName,
  whatsappUrl,
  contactEmail,
  facebookUrl,
  telegramUrl,
  youtubeUrl,
  linkedinUrl,
  hasAnySocial,
}: MobileHeroProps) {
  return (
    <div className="block md:hidden !mt-0">
      {/* 
        ========================================================================
        SCREEN 1: THE FIRST FOLD (الشاشة الأولى بالكامل)
        - Light Mode: Crisp royal blue & indigo accents breaking the white canvas.
        - Dark Mode: Warm amber & molten gold dynamic ambiance.
        - Bottom: Anchored action buttons at the bottom of the fold.
        ========================================================================
      */}
      <section className="min-h-[calc(100svh-4.5rem)] flex flex-col justify-center items-center gap-6 sm:gap-8 pt-10 sm:pt-12 pb-16 px-4 text-center relative overflow-hidden">
        
        {/* 1. TOP: Dynamic Shimmer Banner (نزل للأسفل براحة عن الهيدر) */}
        <div className="w-full flex justify-center pt-2 px-1 shrink-0">
          {settings.BANNER_ENABLED !== 'false' && (
            <a href="#trending-diploma" className="shimmer-border-wrapper group inline-block max-w-full">
              <div className="shimmer-beam-gold dark:block hidden" />
              <div className="shimmer-beam-blue dark:hidden block" />
              <div className="shimmer-button-content px-4 py-2 text-xs text-slate-800 dark:text-zinc-200 flex items-center gap-2 flex-nowrap justify-center max-w-full">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-amber-400 animate-pulse" />
                  <span className="text-blue-700 dark:text-amber-300 font-black text-xs">{settings.HERO_BADGE || 'جديد!'}</span>
                </div>
                <div className="h-3.5 w-px bg-slate-300 dark:bg-amber-500/40 shrink-0" />
                <span className="group-hover:text-blue-700 dark:group-hover:text-amber-200 transition-colors font-bold text-xs leading-normal whitespace-nowrap">
                  {settings.BANNER_TEXT ? settings.BANNER_TEXT.replace('استثنائي ', '').replace(' والدبلومات', '') : 'خصم 50% لفترة محدودة على المسارات الهندسية'}
                </span>
                <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform shrink-0" />
              </div>
            </a>
          )}
        </div>

        {/* 2. MIDDLE: Headline with Color-Broken Atmosphere in Light Mode, Warm Gold in Dark Mode */}
        <div className="w-full max-w-lg mx-auto flex flex-col items-center px-2 py-2 relative shrink-0">
          
          {/* Background Atmospheric Halo: Soft Sky Blue & Violet in Light Mode, Warm Amber Gold in Dark Mode */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] xs:w-[360px] h-[260px] pointer-events-none -z-10 overflow-visible">
            <div className="dynamic-drift-1 absolute -top-4 right-1/4 w-[220px] h-[160px] bg-blue-500/15 dark:bg-amber-400/20 rounded-full blur-[80px]" />
            <div className="dynamic-drift-2 absolute -bottom-4 left-1/4 w-[240px] h-[170px] bg-indigo-500/12 dark:bg-yellow-400/18 rounded-full blur-[85px]" />
            <div className="dynamic-drift-3 absolute top-1/4 left-1/2 -translate-x-1/2 w-[200px] h-[150px] bg-sky-400/14 dark:bg-amber-500/16 rounded-full blur-[75px]" />
            <div className="dynamic-drift-4 absolute -top-8 left-1/3 w-[230px] h-[170px] bg-violet-400/12 dark:bg-yellow-300/12 rounded-full blur-[80px]" />
          </div>

          <h1 className="font-black tracking-tight w-full mb-3 [text-wrap:balance]">
            <span className="text-slate-950 dark:text-white block font-black text-[30px] xs:text-[36px] sm:text-4xl leading-[1.25] mb-2 tracking-tight">
              {settings.HERO_TITLE || 'نحو مستقبل برمجي وهندسي احترافي'}
            </span>
            {/* Tagline: Bold Royal Blue & Indigo in Light Mode, Molten Gold in Dark Mode */}
            <span className="block font-black text-[19px] xs:text-[23px] sm:text-2xl leading-snug bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 dark:from-amber-300 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-transparent">
              {(settings.PLATFORM_TAGLINE && !settings.PLATFORM_TAGLINE.includes('?'))
                ? settings.PLATFORM_TAGLINE
                : 'بوابتك الاحترافية لاحتراف البرمجة والذكاء الاصطناعي والتصميم'}
            </span>
          </h1>

          <p className="text-xs xs:text-sm text-slate-700 dark:text-zinc-300 max-w-sm mx-auto leading-relaxed font-medium px-2">
            {settings.HERO_SUBTITLE ||
              `${cleanPlatformName} — مسارات تدريبية هندسية متكاملة، دبلومات برمجية معتمدة، ومشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.`}
          </p>
        </div>

        {/* 3. BOTTOM: Action Buttons with Dark/Light Mode Precision */}
        <div className="w-full max-w-sm mx-auto flex flex-col gap-3 pb-4 px-2 shrink-0">
          {/* Button 1: Diploma (Royal Indigo in Light Mode, Molten Gold in Dark Mode) */}
          <a href="#trending-diploma" className="shimmer-border-wrapper group w-full">
            <div className="shimmer-beam-gold dark:block hidden" />
            <div className="shimmer-beam-blue dark:hidden block" />
            <div className="shimmer-button-content w-full px-5 py-3.5 text-sm xs:text-base font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:bg-none dark:text-amber-300 group-hover:opacity-95 flex items-center justify-center gap-2.5 rounded-2xl shadow-lg">
              <Flame className="w-5 h-5 text-amber-300 dark:text-amber-400 animate-bounce shrink-0" />
              <span className="whitespace-nowrap">{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً (خصم 51%)'}</span>
              <ArrowLeft className="w-4.5 h-4.5 text-white dark:text-amber-400 group-hover:-translate-x-1.5 transition-transform duration-300 shrink-0" />
            </div>
          </a>

          {/* Button 2: Join as Instructor */}
          <Link
            href="/instructors/join"
            prefetch={true}
            className="group flex items-center justify-center gap-2.5 w-full py-3.5 px-5 text-sm xs:text-base font-black text-slate-800 hover:text-purple-700 dark:text-zinc-200 dark:hover:text-white transition-all rounded-2xl border border-purple-300/90 hover:border-purple-500 bg-white hover:bg-slate-50 dark:border-purple-800/80 dark:bg-[#16122d]/90 dark:hover:border-purple-600 dark:hover:bg-[#1c163b] shadow-sm hover:shadow-md backdrop-blur-md active:scale-[0.98]"
          >
            <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="whitespace-nowrap">انضم كـ محاضر (0% عمولة)</span>
            <ArrowLeft className="w-4.5 h-4.5 group-hover:-translate-x-1 transition-transform duration-300 shrink-0" />
          </Link>
        </div>

      </section>

      {/* 
        ========================================================================
        SCREEN 2: BELOW THE FOLD
        Dedicated, spacious section for Quick Contacts and Official Badges.
        ========================================================================
      */}
      <section className="pt-12 pb-16 px-4 border-t border-slate-200/80 dark:border-zinc-800/60 bg-slate-100/60 dark:bg-zinc-950/50 space-y-7 text-center">
        
        {/* Quick Contacts */}
        {hasAnySocial && (
          <div className="space-y-3.5 max-w-sm mx-auto">
            <span className="text-xs text-slate-600 dark:text-zinc-400 font-semibold block">تواصل مباشر وسريع مع الأكاديمية:</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-xs font-bold transition-all hover:scale-105 shadow-xs"
                  title="محادثة واتساب مباشرة"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>واتساب الأكاديمية</span>
                </a>
              )}
              <Link
                href="/support"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-blue-700 dark:text-amber-300 border border-blue-200 dark:border-amber-500/30 text-xs font-bold transition-all hover:scale-105 shadow-xs"
                title="الدعم الفني والمساعدة"
              >
                <Headphones className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400 shrink-0" />
                <span>الدعم الفني</span>
              </Link>
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-indigo-700 dark:text-blue-300 border border-indigo-200 dark:border-blue-500/30 text-xs font-semibold transition-all hover:scale-105 shadow-xs"
                  title="راسلنا عبر البريد"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600 dark:text-blue-400 shrink-0" />
                  <span>جيميل</span>
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-sky-50 hover:bg-sky-100 dark:bg-blue-600/10 dark:hover:bg-blue-600/20 text-sky-700 dark:text-blue-400 border border-sky-200 dark:border-blue-500/30 text-xs font-semibold transition-all hover:scale-105 shadow-xs"
                  title="صفحة الفيسبوك الرسمية"
                >
                  <Facebook className="w-3.5 h-3.5 text-sky-600 dark:text-blue-400 shrink-0" />
                  <span>فيسبوك</span>
                </a>
              )}
              {telegramUrl && (
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cyan-50 hover:bg-cyan-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-cyan-700 dark:text-sky-300 border border-cyan-200 dark:border-sky-500/30 text-xs font-semibold transition-all hover:scale-105 shadow-xs"
                  title="قناة التيليجرام"
                >
                  <Send className="w-3.5 h-3.5 text-cyan-600 dark:text-sky-400 shrink-0" />
                  <span>تيليجرام</span>
                </a>
              )}
            </div>
          </div>
        )}

      </section>
    </div>
  );
}
