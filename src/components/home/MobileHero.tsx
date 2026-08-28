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
        PAGE 1 (FIRST FOLD ON MOBILE):
        Exact desktop luxury styling & dynamic rotating effects, sized for mobile.
        Ends cleanly at the action buttons ("تصفح دليل الكورسات") with zero empty gap.
        ======================================================================== 
      */}
      <section className="pt-3 pb-8 px-4 text-center relative overflow-hidden">
        
        {/* Dynamic Animated Floating Glowing Orbs (Atmosphere) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm h-[340px] pointer-events-none -z-10 overflow-visible">
          <div className="dynamic-drift-1 absolute -top-10 right-1/6 w-[260px] h-[190px] bg-amber-400/20 dark:bg-amber-500/15 rounded-full blur-[75px]" />
          <div className="dynamic-drift-2 absolute -bottom-10 left-1/6 w-[280px] h-[210px] bg-blue-500/20 dark:bg-purple-600/15 rounded-full blur-[85px]" />
          <div className="dynamic-drift-3 absolute top-1/4 left-1/2 -translate-x-1/2 w-[240px] h-[180px] bg-indigo-400/15 dark:bg-yellow-500/10 rounded-full blur-[70px]" />
        </div>

        <div className="max-w-md mx-auto flex flex-col items-center">
          
          {/* 1. Promotional Dynamic Rotating Shimmer Banner */}
          {settings.BANNER_ENABLED !== 'false' && (
            <div className="mb-4 inline-block max-w-full px-1">
              <a href="#trending-diploma" className="shimmer-border-wrapper group inline-block max-w-full">
                <div className="shimmer-beam-gold" />
                <div className="shimmer-button-content px-3.5 py-1.5 text-xs text-slate-800 dark:text-zinc-200 flex items-center gap-2 flex-nowrap justify-center">
                  <div className="flex items-center gap-1 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400 animate-pulse" />
                    <span className="text-blue-700 dark:text-amber-300 font-black">{settings.HERO_BADGE || 'جديد!'}</span>
                  </div>
                  <div className="h-3 w-px bg-slate-300 dark:bg-amber-500/40 shrink-0" />
                  <span className="group-hover:text-blue-700 dark:group-hover:text-amber-200 transition-colors font-semibold text-[11px] xs:text-xs leading-normal whitespace-nowrap">
                    {settings.BANNER_TEXT || 'خصم استثنائي 50% لفترة محدودة على المسارات الهندسية'}
                  </span>
                  <ArrowLeft className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform shrink-0" />
                </div>
              </a>
            </div>
          )}

          {/* 2. Hero Headline (Big, wide, bold, authoritative) */}
          <div className="relative px-1 mb-3 w-full">
            <h1 className="font-black tracking-tight">
              <span className="text-slate-900 dark:text-white block font-black text-[25px] xs:text-[27px] leading-[1.22] mb-1.5">
                {settings.HERO_TITLE || 'نحو مستقبل برمجي وهندسي احترافي'}
              </span>
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 dark:from-amber-300 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-transparent block font-black text-[17px] xs:text-[19px] leading-snug">
                {(settings.PLATFORM_TAGLINE && !settings.PLATFORM_TAGLINE.includes('?'))
                  ? settings.PLATFORM_TAGLINE
                  : 'دبلومات تطبيقية ومشاريع واقعية تؤهلك لسوق العمل'}
              </span>
            </h1>
          </div>

          {/* 3. Subtitle */}
          <p className="text-xs xs:text-sm text-slate-600 dark:text-zinc-300 max-w-md mx-auto mb-5 leading-relaxed font-normal px-2">
            {settings.HERO_SUBTITLE ||
              `${cleanPlatformName} — مسارات تدريبية هندسية متكاملة، دبلومات برمجية معتمدة، ومشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.`}
          </p>

          {/* 4. Action Buttons (Desktop shimmer & glass aesthetic, wide and comfortable) */}
          <div className="flex flex-col gap-3.5 w-full max-w-sm mx-auto px-2">
            {/* Primary Diploma Button with Golden Shimmer Beam */}
            <a href="#trending-diploma" className="w-full shimmer-border-wrapper group">
              <div className="shimmer-beam-gold" />
              <div className="shimmer-button-content w-full px-7 py-3.5 text-sm font-black text-white dark:text-amber-300 group-hover:opacity-95 flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/10">
                <Flame className="w-4 h-4 text-amber-400 animate-bounce shrink-0" />
                <span className="whitespace-nowrap">{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً (خصم 51%)'}</span>
                <ArrowLeft className="w-4 h-4 text-white dark:text-amber-400 group-hover:-translate-x-1.5 transition-transform duration-300 shrink-0" />
              </div>
            </a>

            {/* Secondary Guide Button */}
            <Link
              href="/courses"
              className="w-full group flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-black text-slate-800 hover:text-blue-700 dark:text-zinc-200 dark:hover:text-white transition-all rounded-full border border-slate-300/90 hover:border-blue-500 bg-white/95 hover:bg-white dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 shadow-sm backdrop-blur-md"
            >
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="whitespace-nowrap">{settings.HERO_CTA_PRIMARY || 'تصفح دليل الكورسات'}</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300 shrink-0" />
            </Link>
          </div>

        </div>

      </section>

      {/* 
        ========================================================================
        PAGE 2 (BELOW THE FOLD ON MOBILE):
        Quick contacts and badges clearly laid out when scrolling!
        ======================================================================== 
      */}
      <section className="py-8 px-4 border-t border-slate-200/80 dark:border-zinc-800/60 bg-slate-100/50 dark:bg-zinc-950/40 space-y-6 text-center">
        
        {/* Quick Contacts Bar */}
        {hasAnySocial && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">تواصل مباشر وسريع مع الأكاديمية:</p>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm mx-auto">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-xs font-bold transition-all shadow-xs"
                  title="محادثة واتساب مباشرة"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>واتساب الأكاديمية</span>
                </a>
              )}
              <Link
                href="/support"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 text-xs font-bold transition-all shadow-xs"
                title="الدعم الفني والمساعدة"
              >
                <Headphones className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>الدعم الفني</span>
              </Link>
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold shadow-xs"
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-blue-600/10 dark:hover:bg-blue-600/20 text-indigo-700 dark:text-blue-400 border border-indigo-200 dark:border-blue-500/30 text-xs font-semibold shadow-xs"
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 text-xs font-semibold shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>تيليجرام</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Accreditation & Location Badges */}
        <div className="flex flex-col items-center gap-2 max-w-sm mx-auto pt-2">
          <div className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-white/90 dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800/80 text-xs text-slate-700 dark:text-zinc-300 shadow-xs backdrop-blur-md">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-amber-400 shrink-0" />
            <span className="font-medium">مصر — القاهرة & أونلاين بالعالم العربي</span>
          </div>
          <div className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-white/90 dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800/80 text-xs text-slate-800 dark:text-zinc-200 font-semibold shadow-xs backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-amber-400 shrink-0" />
            <span>إشراف {cleanPlatformName}</span>
          </div>
          <div className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-white/90 dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800/80 text-xs text-slate-800 dark:text-zinc-200 font-semibold shadow-xs backdrop-blur-md">
            <Award className="w-4 h-4 text-blue-600 dark:text-amber-400 shrink-0" />
            <span>شهادات تخرج رقمية معتمدة برمز QR</span>
          </div>
        </div>

      </section>
    </div>
  );
}
