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
        MOBILE HERO (RE-ARCHITECTED LIKE COMPUTER):
        - Saudi National Tech Font: IBM Plex Sans Arabic.
        - Perfectly fitted, non-overflowing promotional banner.
        - Vibrant colorful atmospheric glow (Amber, Royal Purple, Indigo, Cyan).
        - Massive, wide, authoritative headline filling the screen.
        - Action buttons positioned gracefully at the bottom of the first fold.
        ======================================================================== 
      */}
      <section className="min-h-[calc(100svh-4.5rem)] flex flex-col justify-between pt-1 pb-6 px-4 text-center relative overflow-hidden">
        
        {/* Dynamic Multi-Color Background Lighting (Rich Atmospheric Glows) */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Top-Right Golden Amber Glow */}
          <div className="absolute -top-16 -right-16 w-[360px] h-[360px] bg-amber-500/30 rounded-full blur-[95px]" />
          {/* Center-Left Vibrant Purple/Indigo Glow */}
          <div className="absolute top-1/4 -left-20 w-[340px] h-[340px] bg-purple-600/30 rounded-full blur-[100px]" />
          {/* Bottom-Center Deep Blue/Cyan Glow */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[380px] h-[280px] bg-blue-600/22 rounded-full blur-[110px]" />
          {/* Core Warm Glow right behind the headline */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[240px] bg-amber-400/20 rounded-full blur-[75px]" />
        </div>

        {/* 1. TOP: Perfectly Fitted, Non-Overflowing Banner ("ظبط الشريط") */}
        <div className="w-full flex justify-center px-2 pt-1 mb-2">
          {settings.BANNER_ENABLED !== 'false' && (
            <a
              href="#trending-diploma"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12111a]/95 border border-amber-400/60 shadow-[0_0_18px_rgba(245,158,11,0.3)] text-slate-100 active:scale-95 transition-transform max-w-full"
            >
              <div className="flex items-center gap-1 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-amber-300 font-extrabold text-xs">{settings.HERO_BADGE || 'جديد!'}</span>
              </div>
              <div className="h-3 w-px bg-amber-400/40 shrink-0" />
              <span className="font-bold text-[10.5px] xs:text-[11.5px] text-zinc-100 whitespace-nowrap">
                {settings.BANNER_TEXT || 'خصم استثنائي 50% لفترة محدودة على المسارات'}
              </span>
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </a>
          )}
        </div>

        {/* 2. MIDDLE: Large, Authoritative Saudi Typography ("كبر الفونت ووسع الكلام") */}
        <div className="w-full max-w-lg mx-auto flex flex-col items-center my-auto px-1">
          <div className="w-full mb-3">
            <h1 className="font-extrabold tracking-tight w-full">
              <span className="text-white block font-extrabold text-[27px] xs:text-[31px] sm:text-4xl leading-[1.25] mb-2 tracking-tight">
                {settings.HERO_TITLE || 'نحو مستقبل برمجي وهندسي احترافي'}
              </span>
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent block font-bold text-[17px] xs:text-[20px] sm:text-2xl leading-snug">
                {(settings.PLATFORM_TAGLINE && !settings.PLATFORM_TAGLINE.includes('?'))
                  ? settings.PLATFORM_TAGLINE
                  : 'دبلومات تطبيقية ومشاريع واقعية تؤهلك لسوق العمل'}
              </span>
            </h1>
          </div>

          <p className="text-xs xs:text-sm text-zinc-300 max-w-sm mx-auto leading-relaxed font-normal px-2">
            {settings.HERO_SUBTITLE ||
              `${cleanPlatformName} — مسارات تدريبية هندسية متكاملة، دبلومات برمجية معتمدة، ومشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.`}
          </p>
        </div>

        {/* 3. BOTTOM: Action Buttons Pushed Gracefully to Bottom of Fold */}
        <div className="w-full max-w-sm mx-auto flex flex-col gap-3.5 pb-2 px-1">
          {/* Primary Diploma Button with Golden Neon Glow */}
          <a
            href="#trending-diploma"
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-gradient-to-b from-[#1c1a24] to-[#0e0d13] text-amber-300 font-extrabold text-sm xs:text-base border-2 border-amber-400/90 shadow-[0_0_28px_rgba(245,158,11,0.45)] active:scale-[0.98] transition-all group"
          >
            <Flame className="w-5 h-5 text-amber-400 animate-bounce shrink-0" />
            <span className="whitespace-nowrap">{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً (خصم 51%)'}</span>
            <ArrowLeft className="w-5 h-5 text-amber-400 group-hover:-translate-x-1.5 transition-transform duration-300 shrink-0" />
          </a>

          {/* Secondary Guide Button */}
          <Link
            href="/courses"
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white font-bold text-sm xs:text-base border border-zinc-700 shadow-md backdrop-blur-md active:scale-[0.98] transition-all group"
          >
            <BookOpen className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="whitespace-nowrap">{settings.HERO_CTA_PRIMARY || 'تصفح دليل الكورسات'}</span>
            <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:-translate-x-1 transition-transform duration-300 shrink-0" />
          </Link>
        </div>

      </section>

      {/* 
        ========================================================================
        PAGE 2 (BELOW THE FOLD ON MOBILE):
        Spacious, dedicated section for Quick Contacts and Official Accreditation Badges.
        Only visible when the user scrolls down!
        ======================================================================== 
      */}
      <section className="py-14 px-4 border-t border-zinc-800/80 bg-zinc-950/80 space-y-8 text-center">
        
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
