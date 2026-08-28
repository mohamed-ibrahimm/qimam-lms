import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  ArrowLeft,
  BookOpen,
  MessageCircle,
  Headphones,
  Mail,
  Facebook,
  Send,
  Youtube,
  Linkedin,
  MapPin,
  ShieldCheck,
  Award,
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
    <div className="block md:hidden">
      {/* 
        ========================================================================
        SCREEN 1: THE FIRST FOLD (الشاشة الأولى بالكامل)
        - Top: Dynamic Shimmer Banner ("خصم 50% زي بتاعت الكمبيوتر بالظبط")
        - Middle: Large, commanding text with dynamic flowing gold animation and softened background aura ("هتخفف لون الاصفر ده وتعمل دينامك في الكلام")
        - Bottom: Diploma button with dynamic gold laser shimmer ("زي بتاعت الكمبيوتر بالظبط") + Course guide button
        ========================================================================
      */}
      <section className="min-h-[calc(100svh-5rem)] flex flex-col justify-between pt-1 pb-4 px-4 text-center relative overflow-hidden">
        
        {/* 1. TOP: Dynamic Shimmer Banner (Exact Computer Style) */}
        <div className="w-full flex justify-center pt-1 px-2">
          {settings.BANNER_ENABLED !== 'false' && (
            <a href="#trending-diploma" className="shimmer-border-wrapper group inline-block max-w-full">
              <div className="shimmer-beam-gold" />
              <div className="shimmer-button-content px-4 py-2 text-xs text-slate-800 dark:text-zinc-200 flex items-center gap-2 flex-nowrap justify-center max-w-full">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400 animate-pulse" />
                  <span className="text-blue-700 dark:text-amber-300 font-black text-xs">{settings.HERO_BADGE || 'جديد!'}</span>
                </div>
                <div className="h-3 w-px bg-slate-300 dark:bg-amber-500/40 shrink-0" />
                <span className="group-hover:text-blue-700 dark:group-hover:text-amber-200 transition-colors font-semibold text-[11px] xs:text-xs leading-normal whitespace-nowrap">
                  {settings.BANNER_TEXT ? settings.BANNER_TEXT.replace('استثنائي ', '').replace(' والدبلومات', '') : 'خصم 50% لفترة محدودة على المسارات الهندسية'}
                </span>
                <ArrowLeft className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform shrink-0" />
              </div>
            </a>
          )}
        </div>

        {/* 2. MIDDLE: Headline with Softened Yellow Background Halo and Dynamic Shimmering Words */}
        <div className="w-full max-w-lg mx-auto flex flex-col items-center my-auto px-1 py-4 relative">
          
          {/* Softened Background Halo behind text (خففنا لون الأصفر المباشر ليكون ناعم وراقي) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] xs:w-[340px] h-[240px] pointer-events-none -z-10 overflow-visible">
            <div className="dynamic-drift-1 absolute -top-4 right-1/4 w-[240px] h-[180px] bg-amber-400/12 dark:bg-amber-500/9 rounded-full blur-[90px]" />
            <div className="dynamic-drift-2 absolute -bottom-4 left-1/4 w-[260px] h-[190px] bg-yellow-400/10 dark:bg-yellow-500/7 rounded-full blur-[95px]" />
            <div className="dynamic-drift-3 absolute top-1/4 left-1/2 -translate-x-1/2 w-[220px] h-[160px] bg-amber-500/8 dark:bg-amber-600/6 rounded-full blur-[80px]" />
          </div>

          <h1 className="font-black tracking-tight w-full mb-3.5 [text-wrap:balance]">
            <span className="text-slate-900 dark:text-white block font-black text-[31px] xs:text-[36px] sm:text-4xl leading-[1.18] mb-2.5 tracking-tight">
              {settings.HERO_TITLE || 'نحو مستقبل برمجي وهندسي احترافي'}
            </span>
            {/* Dynamic Gold Shimmering Text ("وتعمل دنيامك فى الكلام بقي") */}
            <span className="animate-gold-text-shimmer block font-black text-[18.5px] xs:text-[22px] sm:text-2xl leading-snug">
              {(settings.PLATFORM_TAGLINE && !settings.PLATFORM_TAGLINE.includes('?'))
                ? settings.PLATFORM_TAGLINE
                : 'بوابتك الاحترافية لاحتراف البرمجة والذكاء الاصطناعي والتصميم'}
            </span>
          </h1>

          <p className="text-xs xs:text-[13.5px] text-slate-600 dark:text-zinc-300 max-w-sm mx-auto leading-relaxed font-normal px-2">
            {settings.HERO_SUBTITLE ||
              `${cleanPlatformName} — مسارات تدريبية هندسية متكاملة، دبلومات برمجية معتمدة، ومشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.`}
          </p>
        </div>

        {/* 3. BOTTOM: Action Buttons with Dynamic Gold Laser Sweep (Exact Computer Style) */}
        <div className="w-full max-w-sm mx-auto flex flex-col gap-3 pb-2 px-1">
          {/* Button 1: Diploma (With Computer Dynamic Shimmer Beam) */}
          <a href="#trending-diploma" className="shimmer-border-wrapper group w-full">
            <div className="shimmer-beam-gold" />
            <div className="shimmer-button-content w-full px-6 py-3.5 text-sm xs:text-base font-black text-white dark:text-amber-300 group-hover:opacity-95 flex items-center justify-center gap-2.5">
              <Flame className="w-5 h-5 text-amber-400 animate-bounce shrink-0" />
              <span className="whitespace-nowrap">{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً (خصم 51%)'}</span>
              <ArrowLeft className="w-5 h-5 text-white dark:text-amber-400 group-hover:-translate-x-1.5 transition-transform duration-300 shrink-0" />
            </div>
          </a>

          {/* Button 2: Course Guide */}
          <Link
            href="/courses"
            className="group flex items-center justify-center gap-2.5 w-full py-3.5 px-6 text-sm xs:text-base font-black text-slate-800 hover:text-blue-700 dark:text-zinc-200 dark:hover:text-white transition-all rounded-full border border-slate-300 hover:border-blue-500 bg-white hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 shadow-sm hover:shadow-md backdrop-blur-md active:scale-[0.98]"
          >
            <BookOpen className="w-5 h-5 text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="whitespace-nowrap">{settings.HERO_CTA_PRIMARY || 'تصفح دليل الكورسات'}</span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300 shrink-0" />
          </Link>
        </div>

      </section>

      {/* 
        ========================================================================
        SCREEN 2: BELOW THE FOLD
        Dedicated, spacious section for Quick Contacts and Official Badges.
        ========================================================================
      */}
      <section className="pt-12 pb-16 px-4 border-t border-slate-200/60 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-950/50 space-y-7 text-center">
        
        {/* Quick Contacts */}
        {hasAnySocial && (
          <div className="space-y-3.5 max-w-sm mx-auto">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block">تواصل مباشر وسريع مع الأكاديمية:</span>
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 text-xs font-bold transition-all hover:scale-105 shadow-xs"
                title="الدعم الفني والمساعدة"
              >
                <Headphones className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>الدعم الفني</span>
              </Link>
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold transition-all hover:scale-105 shadow-xs"
                  title="راسلنا عبر البريد"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>جيميل</span>
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-blue-600/10 dark:hover:bg-blue-600/20 text-indigo-700 dark:text-blue-400 border border-indigo-200 dark:border-blue-500/30 text-xs font-semibold transition-all hover:scale-105 shadow-xs"
                  title="صفحة الفيسبوك الرسمية"
                >
                  <Facebook className="w-3.5 h-3.5 text-indigo-600 dark:text-blue-400 shrink-0" />
                  <span>فيسبوك</span>
                </a>
              )}
              {telegramUrl && (
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 text-xs font-semibold transition-all hover:scale-105 shadow-xs"
                  title="قناة التيليجرام"
                >
                  <Send className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>تيليجرام</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Accreditation & Location Badges */}
        <div className="space-y-2.5 max-w-sm mx-auto pt-2">
          <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-white/90 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-300 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400 shrink-0" />
            <span className="whitespace-nowrap font-medium">مصر — القاهرة & أونلاين بالعالم العربي</span>
          </div>
          <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-white/90 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-xs text-slate-800 dark:text-zinc-200 font-semibold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400 shrink-0" />
            <span>إشراف {cleanPlatformName}</span>
          </div>
          <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-white/90 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-xs text-slate-800 dark:text-zinc-200 font-semibold shadow-xs">
            <Award className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400 shrink-0" />
            <span>شهادات تخرج رقمية معتمدة برمز QR</span>
          </div>
        </div>

      </section>
    </div>
  );
}
