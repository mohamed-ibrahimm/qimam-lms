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

interface DesktopHeroProps {
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

export default function DesktopHero({
  settings,
  cleanPlatformName,
  whatsappUrl,
  contactEmail,
  facebookUrl,
  telegramUrl,
  youtubeUrl,
  linkedinUrl,
  hasAnySocial,
}: DesktopHeroProps) {
  return (
    <section className="pt-2 pb-16 sm:pt-10 sm:pb-20 lg:pt-16 lg:pb-24 relative overflow-hidden">
      
      {/* 
        ========================================================================
        Top Glowing Golden Atmosphere:
        Eliminates the dark void between the navbar and the banner, giving a
        warm, radiant golden flow across the top.
        ========================================================================
      */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[320px] pointer-events-none -z-10 overflow-visible">
        <div className="w-full h-full bg-gradient-to-b from-amber-500/25 via-yellow-500/15 to-transparent rounded-full blur-[85px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Promotional Dynamic Rotating Shimmer Banner */}
        {settings.BANNER_ENABLED !== 'false' && (
          <div className="mb-8 sm:mb-10 inline-block max-w-full px-2">
            <a href="#trending-diploma" className="shimmer-border-wrapper group inline-block max-w-full">
              <div className="shimmer-beam-gold" />
              <div className="shimmer-button-content px-4 sm:px-6 py-2 sm:py-2.5 text-xs text-slate-800 dark:text-zinc-200 flex items-center gap-2 sm:gap-3 flex-nowrap justify-center max-w-full">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-500 dark:text-amber-400 animate-pulse" />
                  <span className="text-amber-600 dark:text-amber-300 font-black text-xs">{settings.HERO_BADGE || 'جديد!'}</span>
                </div>
                <div className="h-3.5 w-px bg-amber-400/40 shrink-0" />
                <span className="group-hover:text-amber-500 dark:group-hover:text-amber-200 transition-colors font-bold text-[11px] sm:text-xs leading-normal whitespace-nowrap">
                  {settings.BANNER_TEXT ? settings.BANNER_TEXT.replace('استثنائي ', '').replace(' والدبلومات', '') : 'خصم 50% لفترة محدودة على المسارات الهندسية'}
                </span>
                <ArrowLeft className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 group-hover:-translate-x-1 transition-transform shrink-0" />
              </div>
            </a>
          </div>
        )}

        {/* Glowing Dynamic Moving Orbs & Expanded Hero Headline */}
        <div className="relative px-2 mb-6 sm:mb-8">
          {/* Dynamic Animated Floating Glowing Orbs behind the Headline */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[380px] pointer-events-none -z-10 overflow-visible">
            <div className="dynamic-drift-1 absolute -top-10 right-1/4 w-[340px] sm:w-[440px] h-[260px] sm:h-[320px] bg-amber-400/25 dark:bg-amber-500/18 rounded-full blur-[90px] sm:blur-[110px]" />
            <div className="dynamic-drift-2 absolute -bottom-10 left-1/4 w-[360px] sm:w-[480px] h-[270px] sm:h-[340px] bg-yellow-500/22 dark:bg-yellow-400/15 rounded-full blur-[100px] sm:blur-[120px]" />
            <div className="dynamic-drift-3 absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[400px] h-[240px] sm:h-[300px] bg-amber-600/18 dark:bg-amber-500/12 rounded-full blur-[80px] sm:blur-[100px]" />
          </div>

          <h1 className="font-black tracking-tight max-w-5xl mx-auto">
            <span className="text-white block font-black text-[29px] xs:text-[34px] sm:text-5xl lg:text-6xl leading-[1.2] mb-3 tracking-tight">
              {settings.HERO_TITLE || 'نحو مستقبل برمجي وهندسي احترافي'}
            </span>
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent block font-black text-[18px] xs:text-[22px] sm:text-3xl lg:text-4xl leading-snug">
              {(settings.PLATFORM_TAGLINE && !settings.PLATFORM_TAGLINE.includes('?')) ? settings.PLATFORM_TAGLINE : 'دبلومات تطبيقية ومشاريع واقعية تؤهلك لسوق العمل'}
            </span>
          </h1>
        </div>

        {/* Spacious, balanced subtitle */}
        <p className="text-xs xs:text-sm sm:text-base lg:text-xl text-zinc-300 max-w-2xl sm:max-w-3xl mx-auto mb-10 sm:mb-14 leading-relaxed font-normal px-3">
          {settings.HERO_SUBTITLE || `${cleanPlatformName} — مسارات تدريبية هندسية متكاملة، دبلومات برمجية معتمدة، ومشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.`}
        </p>

        {/* Action Buttons (Pushed Down with Generous Breathing Room) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full max-w-sm sm:max-w-none mx-auto px-2 mb-12 sm:mb-16">
          <a href="#trending-diploma" className="shimmer-border-wrapper group w-full sm:w-auto">
            <div className="shimmer-beam-gold" />
            <div className="shimmer-button-content w-full sm:w-auto px-6 sm:px-9 py-4 text-sm sm:text-base font-black text-white dark:text-amber-300 group-hover:opacity-95 flex items-center justify-center gap-2.5">
              <Flame className="w-5 h-5 text-amber-400 animate-bounce shrink-0" />
              <span className="whitespace-nowrap">{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً (خصم 51%)'}</span>
              <ArrowLeft className="w-5 h-5 text-white dark:text-amber-400 group-hover:-translate-x-1.5 transition-transform duration-300 shrink-0" />
            </div>
          </a>

          <Link
            href="/courses"
            className="group flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 sm:px-8 py-4 text-sm sm:text-base font-black text-zinc-200 hover:text-white transition-all rounded-full border border-zinc-700/80 bg-zinc-900/70 hover:bg-zinc-800/90 hover:border-zinc-600 shadow-sm hover:shadow-md backdrop-blur-md"
          >
            <BookOpen className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="whitespace-nowrap">{settings.HERO_CTA_PRIMARY || 'تصفح دليل الكورسات'}</span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300 shrink-0" />
          </Link>
        </div>

        {/* Quick Contacts (Pushed Down Comfortably) */}
        {hasAnySocial && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-6 sm:pt-8 pb-4">
            <span className="text-xs sm:text-sm text-zinc-400 font-semibold ml-1">تواصل مباشر وسريع:</span>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold transition-all hover:scale-105 shadow-xs"
                title="محادثة واتساب مباشرة"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>واتساب الأكاديمية</span>
              </a>
            )}
            <Link
              href="/support"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-amber-950/60 hover:bg-amber-900/70 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold transition-all hover:scale-105 shadow-xs"
              title="الدعم الفني والمساعدة"
            >
              <Headphones className="w-4 h-4 text-amber-400" />
              <span>الدعم الفني</span>
            </Link>
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-xs"
                title="راسلنا عبر البريد"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                <span>جيميل</span>
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-xs"
                title="صفحة الفيسبوك الرسمية"
              >
                <Facebook className="w-4 h-4 text-indigo-400" />
                <span>فيسبوك</span>
              </a>
            )}
            {telegramUrl && (
              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-sky-950/60 border border-sky-500/40 text-sky-300 text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-xs"
                title="قناة التيليجرام"
              >
                <Send className="w-4 h-4 text-sky-400" />
                <span>تيليجرام</span>
              </a>
            )}
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-xs"
                title="قناة اليوتيوب"
              >
                <Youtube className="w-4 h-4 text-red-400" />
                <span>يوتيوب</span>
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-xs"
                title="حساب لينكد إن"
              >
                <Linkedin className="w-4 h-4 text-blue-400" />
                <span>لينكد إن</span>
              </a>
            )}
          </div>
        )}

        {/* Accreditation & Location Badges */}
        <div className="mt-8 sm:mt-12 flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm text-zinc-400 pt-2 w-full max-w-3xl px-2 pb-4">
            <div className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md shadow-xs">
              <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-400 shrink-0" />
              <span className="whitespace-nowrap font-medium text-zinc-300">مصر — القاهرة & أونلاين بالعالم العربي</span>
            </div>
            <div className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md shadow-xs">
              <ShieldCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-400 shrink-0" />
              <span className="text-zinc-200 font-semibold whitespace-nowrap">إشراف {cleanPlatformName}</span>
            </div>
            <div className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md shadow-xs">
              <Award className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-400 shrink-0" />
              <span className="text-zinc-200 font-semibold whitespace-nowrap">شهادات تخرج رقمية معتمدة برمز QR</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
