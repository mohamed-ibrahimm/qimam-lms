import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Video,
  FileText,
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
    <section className="hidden md:flex flex-col justify-center items-center min-h-[calc(100vh-4.5rem)] pt-6 sm:pt-8 lg:pt-10 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center my-auto w-full space-y-6 lg:space-y-7">
        
        {/* Promotional Dynamic Rotating Shimmer Banner */}
        {settings.BANNER_ENABLED !== 'false' && (
          <div className="inline-block max-w-full px-2">
            <a href="#trending-diploma" className="shimmer-border-wrapper group inline-block max-w-full">
              <div className="shimmer-beam-gold" />
              <div className="shimmer-button-content px-5 py-2 text-xs text-slate-800 dark:text-zinc-200 flex items-center gap-2.5 flex-nowrap justify-center">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400 animate-pulse" />
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

        {/* Headlines with balanced scale and 2 clean lines */}
        <div className="space-y-3 max-w-5xl mx-auto px-2">
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[50px] font-black text-slate-950 dark:text-white leading-[1.25] tracking-tight">
            {settings.HERO_TITLE || 'بوابتك الذكية لاحتراف'} <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-500 bg-clip-text text-transparent">
              {settings.HERO_TITLE_HIGHLIGHT || 'البرمجة وهندسة النظم والذكاء الاصطناعي'}
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed font-normal pt-1">
            {settings.HERO_SUBTITLE || `${cleanPlatformName} — مسارات تدريبية هندسية متكاملة، دبلومات برمجية معتمدة، ومشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.`}
          </p>
        </div>

        {/* 4 Premium Action Pillars on a Single Unified Horizontal Row */}
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-2.5 lg:gap-3.5 w-full mx-auto px-1 max-w-[1360px] pt-1">
          
          {/* 1. Diploma Button (Shimmer Molten Gold - Perfectly Centered) */}
          <a href="#trending-diploma" className="shimmer-border-wrapper group shrink-0">
            <div className="shimmer-beam-gold" />
            <div className="shimmer-button-content px-4 lg:px-5 py-2.5 lg:py-3 text-xs lg:text-[13px] font-black text-white dark:text-amber-300 group-hover:opacity-95 flex items-center justify-center gap-2 rounded-full shadow-lg">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce shrink-0" />
              <span className="whitespace-nowrap">{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً (خصم 51%)'}</span>
            </div>
          </a>

          {/* 2. Digital Notes & Books Marketplace (Emerald Glow) */}
          <Link
            href="/books"
            prefetch={true}
            className="group flex items-center justify-center gap-1.5 px-4 lg:px-5 py-2.5 lg:py-3 text-xs lg:text-[13px] font-black text-emerald-900 dark:text-emerald-300 transition-all rounded-full border-2 border-emerald-500/80 hover:border-emerald-400 bg-gradient-to-r from-emerald-500/15 via-teal-500/20 to-emerald-500/15 hover:from-emerald-500/25 hover:to-teal-500/30 shadow-md shadow-emerald-500/15 hover:shadow-emerald-500/30 hover:scale-105 backdrop-blur-md shrink-0"
          >
            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="whitespace-nowrap">{settings.HERO_BTN_BOOKS || 'سوق المذكرات والكتب (خصم 50% ومعاينة)'}</span>
          </Link>

          {/* 3. Expert Instructor Button (Royal Purple Glow) */}
          <Link
            href="/instructors/join?track=expert"
            prefetch={true}
            className="group flex items-center justify-center gap-1.5 px-4 lg:px-5 py-2.5 lg:py-3 text-xs lg:text-[13px] font-black text-purple-900 dark:text-purple-300 transition-all rounded-full border-2 border-purple-500/80 hover:border-purple-400 bg-gradient-to-r from-purple-600/15 via-indigo-600/20 to-purple-600/15 hover:from-purple-600/25 hover:to-indigo-600/30 shadow-md shadow-purple-500/15 hover:shadow-purple-500/30 hover:scale-105 backdrop-blur-md shrink-0"
          >
            <Video className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="whitespace-nowrap">{settings.HERO_BTN_EXPERT || 'انضم كـ مدرس أو دكتور (14 يوماً مجاناً • 0% عمولة)'}</span>
          </Link>

          {/* 4. Student Instructor Button (Molten Amber Glow) */}
          <Link
            href="/instructors/join?track=student"
            prefetch={true}
            className="group flex items-center justify-center gap-1.5 px-4 lg:px-5 py-2.5 lg:py-3 text-xs lg:text-[13px] font-black text-amber-950 dark:text-amber-300 transition-all rounded-full border-2 border-amber-500/80 hover:border-amber-400 bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 hover:from-amber-500/25 hover:to-yellow-500/30 shadow-md shadow-amber-500/15 hover:shadow-amber-500/30 hover:scale-105 backdrop-blur-md shrink-0"
          >
            <GraduationCap className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
            <span className="whitespace-nowrap">{settings.HERO_BTN_STUDENT || 'اشترك كمحاضر طالب (منحة 30 يوماً مجاناً)'}</span>
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
