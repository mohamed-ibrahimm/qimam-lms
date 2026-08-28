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
    <section className="pt-4 pb-12 sm:pt-10 sm:pb-16 lg:pt-16 lg:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Promotional Dynamic Rotating Shimmer Banner */}
        {settings.BANNER_ENABLED !== 'false' && (
          <div className="mb-6 sm:mb-8 inline-block max-w-full px-2">
            <a href="#trending-diploma" className="shimmer-border-wrapper group inline-block max-w-full">
              <div className="shimmer-beam-gold" />
              <div className="shimmer-button-content px-4 sm:px-6 py-2 sm:py-2.5 text-xs text-slate-800 dark:text-zinc-200 flex items-center gap-2 sm:gap-3 flex-nowrap justify-center max-w-full">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-600 dark:text-amber-400 animate-pulse" />
                  <span className="text-blue-700 dark:text-amber-300 font-black text-xs">{settings.HERO_BADGE || 'جديد!'}</span>
                </div>
                <div className="h-3.5 w-px bg-slate-300 dark:bg-amber-500/40 shrink-0" />
                <span className="group-hover:text-blue-700 dark:group-hover:text-amber-200 transition-colors font-semibold text-[11px] sm:text-xs leading-normal whitespace-nowrap truncate max-w-[240px] sm:max-w-none">
                  {settings.BANNER_TEXT || 'خصم استثنائي 50% لفترة محدودة على جميع المسارات الهندسية'}
                </span>
                <ArrowLeft className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform shrink-0" />
              </div>
            </a>
          </div>
        )}

        {/* Glowing Dynamic Moving Orbs & Hero Headline */}
        <div className="relative px-2">
          {/* Dynamic Animated Floating Glowing Orbs behind the Headline */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[360px] pointer-events-none -z-10 overflow-visible">
            <div className="dynamic-drift-1 absolute -top-10 right-1/4 w-[320px] sm:w-[420px] h-[240px] sm:h-[300px] bg-amber-400/25 dark:bg-amber-500/15 rounded-full blur-[90px] sm:blur-[110px]" />
            <div className="dynamic-drift-2 absolute -bottom-10 left-1/4 w-[340px] sm:w-[460px] h-[250px] sm:h-[320px] bg-blue-500/25 dark:bg-purple-600/15 rounded-full blur-[100px] sm:blur-[120px]" />
            <div className="dynamic-drift-3 absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[380px] h-[220px] sm:h-[280px] bg-indigo-400/20 dark:bg-yellow-500/10 rounded-full blur-[80px] sm:blur-[100px]" />
          </div>

          <h1 className="font-black tracking-tight mb-4 sm:mb-6 max-w-5xl mx-auto">
            <span className="text-slate-900 dark:text-white block font-black text-2xl xs:text-3xl sm:text-5xl lg:text-6xl leading-[1.2] mb-2 sm:mb-3">
              {settings.HERO_TITLE || 'نحو مستقبل برمجي وهندسي احترافي'}
            </span>
            <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 dark:from-amber-300 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-transparent block font-black text-base xs:text-lg sm:text-2xl lg:text-4xl leading-snug">
              {(settings.PLATFORM_TAGLINE && !settings.PLATFORM_TAGLINE.includes('?')) ? settings.PLATFORM_TAGLINE : 'دبلومات تطبيقية ومشاريع واقعية تؤهلك لسوق العمل'}
            </span>
          </h1>
        </div>

        <p className="text-xs xs:text-sm sm:text-base lg:text-xl text-slate-600 dark:text-zinc-300 max-w-3xl mx-auto mb-7 sm:mb-10 leading-relaxed font-normal px-2">
          {settings.HERO_SUBTITLE || `${cleanPlatformName} — مسارات تدريبية هندسية متكاملة، دبلومات برمجية معتمدة، ومشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.`}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full max-w-sm sm:max-w-none mx-auto px-2">
          <a href="#trending-diploma" className="shimmer-border-wrapper group w-full sm:w-auto">
            <div className="shimmer-beam-gold" />
            <div className="shimmer-button-content w-full sm:w-auto px-6 sm:px-9 py-3.5 sm:py-4 text-sm sm:text-base font-black text-white dark:text-amber-300 group-hover:opacity-95 flex items-center justify-center gap-2.5">
              <Flame className="w-5 h-5 text-amber-400 animate-bounce shrink-0" />
              <span className="whitespace-nowrap">{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً (خصم 51%)'}</span>
              <ArrowLeft className="w-5 h-5 text-white dark:text-amber-400 group-hover:-translate-x-1.5 transition-transform duration-300 shrink-0" />
            </div>
          </a>

          <Link
            href="/courses"
            className="group flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-black text-slate-800 hover:text-blue-700 dark:text-zinc-200 dark:hover:text-white transition-all rounded-full border border-slate-300/90 hover:border-blue-500 bg-white/95 hover:bg-white dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 shadow-sm hover:shadow-md backdrop-blur-md"
          >
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="whitespace-nowrap">{settings.HERO_CTA_PRIMARY || 'تصفح دليل الكورسات'}</span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300 shrink-0" />
          </Link>
        </div>

        {hasAnySocial && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-6 sm:pt-8 pb-2">
            <span className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-semibold ml-1">تواصل مباشر وسريع:</span>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-xs sm:text-sm font-bold transition-all hover:scale-105 shadow-xs"
                title="محادثة واتساب مباشرة"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>واتساب الأكاديمية</span>
              </a>
            )}
            <Link
              href="/support"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 text-xs sm:text-sm font-bold transition-all hover:scale-105 shadow-xs"
              title="الدعم الفني والمساعدة"
            >
              <Headphones className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>الدعم الفني</span>
            </Link>
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-xs"
                title="راسلنا عبر البريد"
              >
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>جيميل</span>
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-blue-600/10 dark:hover:bg-blue-600/20 text-indigo-700 dark:text-blue-400 border border-indigo-200 dark:border-blue-500/30 text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-xs"
                title="صفحة الفيسبوك الرسمية"
              >
                <Facebook className="w-4 h-4 text-indigo-600 dark:text-blue-400" />
                <span>فيسبوك</span>
              </a>
            )}
            {telegramUrl && (
              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-xs"
                title="قناة التيليجرام"
              >
                <Send className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>تيليجرام</span>
              </a>
            )}
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-xs"
                title="قناة اليوتيوب"
              >
                <Youtube className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span>يوتيوب</span>
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-blue-700 dark:text-indigo-300 border border-blue-200 dark:border-indigo-500/30 text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-xs"
                title="حساب لينكد إن"
              >
                <Linkedin className="w-4 h-4 text-blue-600 dark:text-indigo-400" />
                <span>لينكد إن</span>
              </a>
            )}
          </div>
        )}

        <div className="mt-8 sm:mt-12 flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 pt-2 w-full max-w-3xl px-2 pb-4">
            <div className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/90 dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800/80 backdrop-blur-md shadow-xs">
              <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-600 dark:text-amber-400 shrink-0" />
              <span className="whitespace-nowrap font-medium text-slate-700 dark:text-zinc-300">مصر — القاهرة & أونلاين بالعالم العربي</span>
            </div>
            <div className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/90 dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800/80 backdrop-blur-md shadow-xs">
              <ShieldCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-600 dark:text-amber-400 shrink-0" />
              <span className="text-slate-800 dark:text-zinc-200 font-semibold whitespace-nowrap">إشراف {cleanPlatformName}</span>
            </div>
            <div className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/90 dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800/80 backdrop-blur-md shadow-xs">
              <Award className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-600 dark:text-amber-400 shrink-0" />
              <span className="text-slate-800 dark:text-zinc-200 font-semibold whitespace-nowrap">شهادات تخرج رقمية معتمدة برمز QR</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
