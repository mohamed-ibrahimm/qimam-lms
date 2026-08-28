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
        - Genuine Dynamic Rotating Laser Beam (shimmer-beam-gold) on banner & button.
        - Headline wide in a single unbroken line ("نحو مستقبل برمجي وهندسي احترافي").
        - Action buttons pushed down near the bottom fold with generous room.
        - Ends cleanly before section 2 (contacts & badges).
        ======================================================================== 
      */}
      <section className="min-h-[calc(100svh-4.5rem)] flex flex-col justify-between pt-2 pb-12 px-3 text-center relative overflow-hidden">
        
        {/* Dynamic Animated Multi-Color Atmospheric Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm h-[420px] pointer-events-none -z-10 overflow-visible">
          <div className="dynamic-drift-1 absolute -top-10 right-1/6 w-[320px] h-[240px] bg-amber-400/25 dark:bg-amber-500/18 rounded-full blur-[85px]" />
          <div className="dynamic-drift-2 absolute -bottom-10 left-1/6 w-[340px] h-[260px] bg-blue-500/22 dark:bg-purple-600/18 rounded-full blur-[95px]" />
          <div className="dynamic-drift-3 absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[220px] bg-indigo-400/18 dark:bg-yellow-500/12 rounded-full blur-[80px]" />
        </div>

        {/* TOP SECTION: Lifted Banner with Genuine Dynamic Rotating Gold Laser Beam */}
        <div className="w-full flex justify-center pt-1 mb-2">
          {settings.BANNER_ENABLED !== 'false' && (
            <div className="inline-block max-w-full px-1">
              <a href="#trending-diploma" className="shimmer-border-wrapper group inline-block max-w-full">
                <div className="shimmer-beam-gold" />
                <div className="shimmer-button-content px-4 py-2 text-xs text-slate-100 flex items-center gap-2 flex-nowrap justify-center shadow-lg shadow-amber-500/15">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span className="text-amber-300 font-black text-xs">{settings.HERO_BADGE || 'جديد!'}</span>
                  </div>
                  <div className="h-3.5 w-px bg-amber-400/40 shrink-0" />
                  <span className="font-semibold text-xs text-zinc-100 group-hover:text-amber-200 transition-colors whitespace-nowrap">
                    {settings.BANNER_TEXT || 'خصم استثنائي 50% لفترة محدودة على المسارات الهندسية'}
                  </span>
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-1 transition-transform shrink-0" />
                </div>
              </a>
            </div>
          )}
        </div>

        {/* MIDDLE SECTION: Big, Wide, Unbroken Headline ("وسع الكلام") */}
        <div className="w-full max-w-xl mx-auto flex flex-col items-center my-auto px-1">
          <div className="w-full mb-3">
            <h1 className="font-black tracking-tight w-full">
              <span className="text-white block font-black text-[20px] xs:text-[22px] sm:text-[26px] leading-tight tracking-normal whitespace-nowrap">
                {settings.HERO_TITLE || 'نحو مستقبل برمجي وهندسي احترافي'}
              </span>
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent block font-black text-[15px] xs:text-[17px] sm:text-xl leading-snug mt-2 max-w-sm mx-auto">
                {(settings.PLATFORM_TAGLINE && !settings.PLATFORM_TAGLINE.includes('?'))
                  ? settings.PLATFORM_TAGLINE
                  : 'دبلومات تطبيقية ومشاريع واقعية تؤهلك لسوق العمل'}
              </span>
            </h1>
          </div>

          <p className="text-xs xs:text-sm sm:text-base text-zinc-300 max-w-md mx-auto leading-relaxed font-normal px-2">
            {settings.HERO_SUBTITLE ||
              `${cleanPlatformName} — مسارات تدريبية هندسية متكاملة، دبلومات برمجية معتمدة، ومشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.`}
          </p>
        </div>

        {/* BOTTOM SECTION: Buttons pushed down near bottom fold with Genuine Rotating Laser Shimmer */}
        <div className="w-full max-w-md mx-auto mt-6 sm:mt-8 px-2 flex flex-col gap-3.5">
          {/* Primary Diploma Button with Rotating Gold Shimmer Beam */}
          <a href="#trending-diploma" className="w-full shimmer-border-wrapper group">
            <div className="shimmer-beam-gold" />
            <div className="shimmer-button-content w-full px-7 py-4 text-sm xs:text-base font-black text-white dark:text-amber-300 group-hover:opacity-95 flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/15">
              <Flame className="w-4 h-4 xs:w-5 xs:h-5 text-amber-400 animate-bounce shrink-0" />
              <span className="whitespace-nowrap">{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً (خصم 51%)'}</span>
              <ArrowLeft className="w-4 h-4 xs:w-5 xs:h-5 text-white dark:text-amber-400 group-hover:-translate-x-1.5 transition-transform duration-300 shrink-0" />
            </div>
          </a>

          {/* Secondary Guide Button */}
          <Link
            href="/courses"
            className="w-full group flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white font-bold text-sm xs:text-base border border-zinc-700 shadow-md backdrop-blur-md active:scale-[0.98] transition-all"
          >
            <BookOpen className="w-4 h-4 xs:w-5 xs:h-5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="whitespace-nowrap">{settings.HERO_CTA_PRIMARY || 'تصفح دليل الكورسات'}</span>
            <ArrowLeft className="w-4 h-4 xs:w-5 xs:h-5 text-zinc-400 group-hover:-translate-x-1 transition-transform duration-300 shrink-0" />
          </Link>
        </div>

      </section>

      {/* 
        ========================================================================
        PAGE 2 (BELOW THE FOLD ON MOBILE):
        Dedicated section for Quick Contacts and Official Accreditation Badges.
        Only visible when the user scrolls down!
        ======================================================================== 
      */}
      <section className="py-12 px-4 border-t border-zinc-800/80 bg-zinc-950/60 space-y-8 text-center">
        
        {/* Quick Contacts Bar */}
        {hasAnySocial && (
          <div className="space-y-4 max-w-sm mx-auto">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">تواصل مباشر وسريع مع الأكاديمية</p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-xs active:scale-95 transition-all"
                  title="محادثة واتساب مباشرة"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>واتساب الأكاديمية</span>
                </a>
              )}
              <Link
                href="/support"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-xs active:scale-95 transition-all"
                title="الدعم الفني والمساعدة"
              >
                <Headphones className="w-4 h-4 text-amber-400 shrink-0" />
                <span>الدعم الفني</span>
              </Link>
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-300 text-xs font-semibold shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>جيميل</span>
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 text-xs font-semibold shadow-xs"
                >
                  <Facebook className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>فيسبوك</span>
                </a>
              )}
              {telegramUrl && (
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-sky-950/70 border border-sky-500/40 text-sky-300 text-xs font-semibold shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>تيليجرام</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Accreditation & Location Badges */}
        <div className="space-y-2.5 max-w-sm mx-auto pt-2">
          <div className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 shadow-xs">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">مصر — القاهرة & أونلاين بالعالم العربي</span>
          </div>
          <div className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-200 font-semibold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>إشراف {cleanPlatformName}</span>
          </div>
          <div className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-200 font-semibold shadow-xs">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>شهادات تخرج رقمية معتمدة برمز QR</span>
          </div>
        </div>

      </section>
    </div>
  );
}
