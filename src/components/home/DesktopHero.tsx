import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Video,
  MessageCircle,
  Headphones,
  Mail,
  Facebook,
  Send,
  Youtube,
  Linkedin,
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
    <section className="hidden md:flex flex-col justify-center items-center min-h-[calc(100vh-5.5rem)] pt-16 pb-20 lg:pt-24 lg:pb-28 relative">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center my-auto w-full">
        
        {/* Promotional Dynamic Rotating Shimmer Banner */}
        {settings.BANNER_ENABLED !== 'false' && (
          <div className="mb-8 inline-block max-w-full px-2">
            <a href="#trending-diploma" className="shimmer-border-wrapper group inline-block max-w-full">
              <div className="shimmer-beam-gold" />
              <div className="shimmer-button-content px-6 py-2.5 text-xs text-slate-800 dark:text-zinc-200 flex items-center gap-3 flex-nowrap justify-center">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-amber-400 animate-pulse" />
                  <span className="text-blue-700 dark:text-amber-300 font-black">{settings.HERO_BADGE || 'جديد!'}</span>
                </div>
                <div className="h-3.5 w-px bg-slate-300 dark:bg-amber-500/40 shrink-0" />
                <span className="group-hover:text-blue-700 dark:group-hover:text-amber-200 transition-colors font-semibold text-xs leading-normal">
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
            <div className="dynamic-drift-1 absolute -top-10 right-1/4 w-[420px] h-[300px] bg-amber-400/25 dark:bg-amber-500/15 rounded-full blur-[110px]" />
            <div className="dynamic-drift-2 absolute -bottom-10 left-1/4 w-[460px] h-[320px] bg-blue-500/25 dark:bg-purple-600/15 rounded-full blur-[120px]" />
            <div className="dynamic-drift-3 absolute top-1/4 left-1/2 -translate-x-1/2 w-[380px] h-[280px] bg-indigo-400/20 dark:bg-yellow-500/10 rounded-full blur-[100px]" />
          </div>

          <h1 className="font-black tracking-tight mb-5 max-w-4xl mx-auto">
            <span className="text-slate-900 dark:text-white block font-black text-3xl sm:text-4xl lg:text-[3.25rem] leading-[1.22] mb-2.5">
              {settings.HERO_TITLE || 'نحو مستقبل برمجي وهندسي احترافي'}
            </span>
            <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 dark:from-amber-300 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-transparent block font-black text-xl sm:text-2xl lg:text-[2.2rem] leading-snug">
              {(settings.PLATFORM_TAGLINE && !settings.PLATFORM_TAGLINE.includes('?')) ? settings.PLATFORM_TAGLINE : 'دبلومات تطبيقية ومشاريع واقعية تؤهلك لسوق العمل'}
            </span>
          </h1>
        </div>

        <p className="text-base lg:text-xl text-slate-600 dark:text-zinc-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal px-2">
          {settings.HERO_SUBTITLE || `${cleanPlatformName} — مسارات تدريبية هندسية متكاملة، دبلومات برمجية معتمدة، ومشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.`}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-5 w-full mx-auto px-2">
          <a href="#trending-diploma" className="shimmer-border-wrapper group">
            <div className="shimmer-beam-gold" />
            <div className="shimmer-button-content px-9 py-4 text-base font-black text-white dark:text-amber-300 group-hover:opacity-95 flex items-center justify-center gap-2.5">
              <Flame className="w-5 h-5 text-amber-400 animate-bounce shrink-0" />
              <span className="whitespace-nowrap">{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً (خصم 51%)'}</span>
              <ArrowLeft className="w-5 h-5 text-white dark:text-amber-400 group-hover:-translate-x-1.5 transition-transform duration-300 shrink-0" />
            </div>
          </a>

          <Link
            href="/instructors/join?track=expert"
            prefetch={true}
            className="group flex items-center justify-center gap-2 px-6 py-4 text-sm lg:text-base font-black text-slate-800 hover:text-purple-700 dark:text-zinc-200 dark:hover:text-white transition-all rounded-full border border-purple-300/90 hover:border-purple-500 bg-white/95 hover:bg-white dark:border-purple-800/80 dark:bg-[#16122d]/80 dark:hover:border-purple-600 dark:hover:bg-[#1c163b] shadow-sm hover:shadow-md backdrop-blur-md"
          >
            <Video className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="whitespace-nowrap">{settings.HERO_BTN_EXPERT || 'انضم كـ مدرس أو دكتور جامعي (0% عمولة)'}</span>
          </Link>

          <Link
            href="/instructors/join?track=student"
            prefetch={true}
            className="group flex items-center justify-center gap-2 px-6 py-4 text-sm lg:text-base font-black text-amber-950 dark:text-amber-300 transition-all rounded-full border-2 border-amber-500/70 hover:border-amber-400 bg-amber-500/15 hover:bg-amber-500/25 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 shadow-md hover:shadow-amber-500/20 hover:scale-105 backdrop-blur-md"
          >
            <GraduationCap className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
            <span className="whitespace-nowrap">{settings.HERO_BTN_STUDENT || 'اشترك كمحاضر طالب (شهر كامل مجاناً)'}</span>
          </Link>
        </div>

        {hasAnySocial && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-8 pb-2">
            <span className="text-sm text-slate-500 dark:text-zinc-400 font-semibold ml-1">تواصل مباشر وسريع:</span>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-sm font-bold transition-all hover:scale-105 shadow-xs"
                title="محادثة واتساب مباشرة"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>واتساب الأكاديمية</span>
              </a>
            )}
            <Link
              href="/support"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 text-sm font-bold transition-all hover:scale-105 shadow-xs"
              title="الدعم الفني والمساعدة"
            >
              <Headphones className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>الدعم الفني</span>
            </Link>
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 text-sm font-semibold transition-all hover:scale-105 shadow-xs"
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-blue-600/10 dark:hover:bg-blue-600/20 text-indigo-700 dark:text-blue-400 border border-indigo-200 dark:border-blue-500/30 text-sm font-semibold transition-all hover:scale-105 shadow-xs"
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 text-sm font-semibold transition-all hover:scale-105 shadow-xs"
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 text-sm font-semibold transition-all hover:scale-105 shadow-xs"
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-blue-700 dark:text-indigo-300 border border-blue-200 dark:border-indigo-500/30 text-sm font-semibold transition-all hover:scale-105 shadow-xs"
                title="حساب لينكد إن"
              >
                <Linkedin className="w-4 h-4 text-blue-600 dark:text-indigo-400" />
                <span>لينكد إن</span>
              </a>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
