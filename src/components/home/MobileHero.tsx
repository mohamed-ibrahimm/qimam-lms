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
        Clean, spacious, authoritative.
        Ends cleanly at the action buttons with generous breathing room.
        Zero yellow artifact leakage, zero broken line-wraps.
        ======================================================================== 
      */}
      <section className="min-h-[88vh] flex flex-col justify-center pt-4 pb-14 px-4 text-center relative overflow-hidden">
        
        {/* Dynamic Animated Atmospheric Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm h-[360px] pointer-events-none -z-10 overflow-visible">
          <div className="dynamic-drift-1 absolute -top-12 right-1/6 w-[280px] h-[200px] bg-amber-400/20 dark:bg-amber-500/15 rounded-full blur-[80px]" />
          <div className="dynamic-drift-2 absolute -bottom-12 left-1/6 w-[300px] h-[220px] bg-blue-500/20 dark:bg-purple-600/15 rounded-full blur-[90px]" />
          <div className="dynamic-drift-3 absolute top-1/4 left-1/2 -translate-x-1/2 w-[260px] h-[190px] bg-indigo-400/15 dark:bg-yellow-500/10 rounded-full blur-[75px]" />
        </div>

        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          
          {/* 1. Promotional Flowing Gold Shimmer Banner (Zero artifact leakage) */}
          {settings.BANNER_ENABLED !== 'false' && (
            <div className="mb-6 inline-block max-w-full px-1">
              <a href="#trending-diploma" className="shimmer-border-flow group inline-block max-w-full">
                <div className="px-4 py-2 rounded-full bg-[#111116] dark:bg-[#0c0c10] text-xs text-slate-200 flex items-center gap-2 flex-nowrap justify-center">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span className="text-amber-300 font-black">{settings.HERO_BADGE || 'جديد!'}</span>
                  </div>
                  <div className="h-3.5 w-px bg-amber-500/40 shrink-0" />
                  <span className="font-semibold text-xs text-slate-200 group-hover:text-amber-200 transition-colors whitespace-nowrap">
                    {settings.BANNER_TEXT || 'خصم استثنائي 50% لفترة محدودة على المسارات'}
                  </span>
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-1 transition-transform shrink-0" />
                </div>
              </a>
            </div>
          )}

          {/* 2. Hero Headline (Wide, authoritative, un-broken) */}
          <div className="w-full px-2 mb-4">
            <h1 className="font-black tracking-tight">
              <span className="text-white block font-black text-[22px] xs:text-[24px] sm:text-2xl leading-[1.28] mb-2 tracking-tight">
                {settings.HERO_TITLE || 'نحو مستقبل برمجي وهندسي احترافي'}
              </span>
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent block font-black text-[16px] xs:text-[18px] sm:text-xl leading-snug">
                {(settings.PLATFORM_TAGLINE && !settings.PLATFORM_TAGLINE.includes('?'))
                  ? settings.PLATFORM_TAGLINE
                  : 'دبلومات تطبيقية ومشاريع واقعية تؤهلك لسوق العمل'}
              </span>
            </h1>
          </div>

          {/* 3. Subtitle */}
          <p className="text-xs xs:text-sm text-zinc-300 max-w-sm mx-auto mb-8 leading-relaxed font-normal px-2">
            {settings.HERO_SUBTITLE ||
              `${cleanPlatformName} — مسارات تدريبية هندسية متكاملة، دبلومات برمجية معتمدة، ومشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.`}
          </p>

          {/* 4. Action Buttons (Liquid gold flow + glass guide button) */}
          <div className="flex flex-col gap-3.5 w-full max-w-sm mx-auto px-2">
            {/* Primary Diploma Button with Liquid Gold Border Flow */}
            <a href="#trending-diploma" className="w-full shimmer-border-flow group">
              <div className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-[#111116] dark:bg-[#0c0c10] text-amber-300 font-black text-sm transition-colors group-hover:bg-[#181822]">
                <Flame className="w-4 h-4 text-amber-400 animate-bounce shrink-0" />
                <span className="whitespace-nowrap">{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً (خصم 51%)'}</span>
                <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1.5 transition-transform duration-300 shrink-0" />
              </div>
            </a>

            {/* Secondary Guide Button */}
            <Link
              href="/courses"
              className="w-full group flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white font-bold text-sm border border-zinc-700 shadow-md backdrop-blur-md active:scale-[0.98] transition-all"
            >
              <BookOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="whitespace-nowrap">{settings.HERO_CTA_PRIMARY || 'تصفح دليل الكورسات'}</span>
              <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:-translate-x-1 transition-transform duration-300 shrink-0" />
            </Link>
          </div>

        </div>

      </section>

      {/* 
        ========================================================================
        PAGE 2 (BELOW THE FOLD ON MOBILE):
        Spacious, dedicated section for Contacts and Official Badges.
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
