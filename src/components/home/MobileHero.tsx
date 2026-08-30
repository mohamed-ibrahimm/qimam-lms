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
  trendingDiploma,
  whatsappUrl,
  contactEmail,
  facebookUrl,
  telegramUrl,
  youtubeUrl,
  linkedinUrl,
  hasAnySocial,
}: MobileHeroProps) {
  return (
    <div className="md:hidden flex flex-col w-full min-h-screen text-right">
      
      {/* 
        ========================================================================
        SCREEN 1: ABOVE THE FOLD
        Dedicated full-screen showcase. Contains exclusively Headline + CTAs.
        ========================================================================
      */}
      <section className="h-[100dvh] min-h-[600px] flex flex-col justify-between pt-16 px-4 relative">
        
        {/* Soft spherical golden & purple ambient glow matching desktop and instructor view */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-gradient-to-tr from-amber-500/16 via-purple-600/12 to-indigo-600/14 rounded-full blur-[80px] pointer-events-none -z-10" />

        {/* 1. TOP: Dynamic Promotional Shimmer Announcement */}
        {settings.BANNER_ENABLED !== 'false' && (
          <div className="pt-2 px-1 w-full shrink-0 max-w-sm mx-auto">
            <a href="#trending-diploma" className="shimmer-border-wrapper group w-full block">
              <div className="shimmer-beam-gold dark:block hidden" />
              <div className="shimmer-beam-blue dark:hidden block" />
              <div className="shimmer-button-content w-full px-3.5 py-2 text-[11px] text-slate-800 dark:text-zinc-200 flex items-center justify-between gap-1.5 rounded-full">
                <div className="flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400 animate-pulse" />
                  <span className="text-blue-700 dark:text-amber-300 font-black">{settings.HERO_BADGE || 'جديد!'}</span>
                </div>
                <span className="truncate group-hover:text-blue-700 dark:group-hover:text-amber-200 transition-colors font-semibold text-[10.5px]">
                  {settings.BANNER_TEXT || 'خصم 50% لفترة محدودة على جميع المسارات'}
                </span>
                <ArrowLeft className="w-3 h-3 text-blue-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform shrink-0" />
              </div>
            </a>
          </div>
        )}

        {/* 2. CENTER: Large, Broad, Spacious Headline & Subtitle */}
        <div className="flex-1 flex flex-col justify-center items-center text-center my-auto px-2 py-2 space-y-3 shrink-0 relative">

          <h1 className="font-black tracking-tight w-full mb-1 text-center space-y-1.5">
            <span className="text-slate-950 dark:text-white block font-black text-[27px] xs:text-[33px] sm:text-4xl leading-[1.22] tracking-tight">
              {settings.HERO_TITLE || 'بوابتك الذكية لاحتراف'}
            </span>
            <span className="block font-black text-[19px] xs:text-[23px] sm:text-2xl leading-snug bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-500 bg-clip-text text-transparent">
              {settings.HERO_TITLE_HIGHLIGHT || 'البرمجة وهندسة النظم والذكاء الاصطناعي'}
            </span>
          </h1>

          <p className="text-xs xs:text-sm text-slate-700 dark:text-zinc-200 max-w-[360px] xs:max-w-md mx-auto leading-relaxed font-medium px-1 mt-1">
            {settings.HERO_SUBTITLE || 'أكاديمية م / محمد ابراهيم — مسارات تدريبية هندسية متكاملة، دبلومات برمجية معتمدة، ومشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.'}
          </p>
        </div>

        {/* 3. BOTTOM: 4 Action Buttons with clearance above floating icons */}
        <div className="w-full max-w-[340px] xs:max-w-sm mx-auto flex flex-col gap-2.5 pb-[78px] sm:pb-8 px-1.5 shrink-0 mt-auto">
          
          {/* Button 1: Diploma */}
          <a href="#trending-diploma" className="shimmer-border-wrapper group w-full">
            <div className="shimmer-beam-gold dark:block hidden" />
            <div className="shimmer-beam-blue dark:hidden block" />
            <div className="shimmer-button-content w-full px-4 py-2.5 xs:py-3 text-xs xs:text-sm font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:bg-none dark:text-amber-300 group-hover:opacity-95 flex items-center justify-center gap-2 rounded-2xl shadow-lg">
              <Flame className="w-4 h-4 text-amber-300 dark:text-amber-400 animate-bounce shrink-0" />
              <span className="whitespace-nowrap">{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً في سوق العمل'}</span>
            </div>
          </a>

          {/* Button 2: Digital Notes & Books Marketplace */}
          <Link
            href="/books"
            prefetch={true}
            className="group flex items-center justify-center gap-2 w-full py-2.5 xs:py-3 px-3.5 text-xs xs:text-sm font-black text-emerald-950 dark:text-emerald-300 transition-all rounded-2xl border-2 border-emerald-500/80 hover:border-emerald-400 bg-gradient-to-r from-emerald-500/15 via-teal-500/20 to-emerald-500/15 shadow-md shadow-emerald-500/10 backdrop-blur-md active:scale-[0.98]"
          >
            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="whitespace-nowrap">{settings.HERO_BTN_BOOKS || 'سوق المذكرات والكتب (خصم 50% ومعاينة)'}</span>
          </Link>

          {/* Button 3: Join as Expert Instructor */}
          <Link
            href="/instructors/join?track=expert"
            prefetch={true}
            className="group flex items-center justify-center gap-2 w-full py-2.5 xs:py-3 px-3.5 text-xs xs:text-sm font-black text-purple-900 dark:text-purple-300 transition-all rounded-2xl border-2 border-purple-500/80 hover:border-purple-400 bg-gradient-to-r from-purple-600/15 via-indigo-600/20 to-purple-600/15 shadow-md shadow-purple-500/10 backdrop-blur-md active:scale-[0.98]"
          >
            <Video className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="whitespace-nowrap">
              {settings.HERO_BTN_EXPERT
                ? settings.HERO_BTN_EXPERT.replace(/14\s*يوماً|14\s*يوم/g, `${settings.INSTRUCTOR_TRIAL_DAYS || '14'} يوماً`)
                : `انضم كـ مدرس أو دكتور (${settings.INSTRUCTOR_TRIAL_DAYS || '14'} يوماً مجاناً • 0% عمولة)`}
            </span>
          </Link>

          {/* Button 4: Join as Student Instructor */}
          <Link
            href="/instructors/join?track=student"
            prefetch={true}
            className="group flex items-center justify-center gap-2 w-full py-2.5 xs:py-3 px-3.5 text-xs xs:text-sm font-black text-amber-950 dark:text-amber-300 transition-all rounded-2xl border-2 border-amber-500/80 hover:border-amber-400 bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 shadow-md shadow-amber-500/10 backdrop-blur-md active:scale-[0.98]"
          >
            <GraduationCap className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
            <span className="whitespace-nowrap">
              {settings.HERO_BTN_STUDENT
                ? settings.HERO_BTN_STUDENT.replace(/30\s*يوماً|30\s*يوم/g, `${settings.STUDENT_TRIAL_DAYS || '14'} يوماً`)
                : `اشترك كمحاضر طالب (منحة ${settings.STUDENT_TRIAL_DAYS || '14'} يوماً مجاناً)`}
            </span>
          </Link>
        </div>

      </section>

      {/* 
        ========================================================================
        SCREEN 2: BELOW THE FOLD
        Dedicated, spacious section for Quick Contacts and Official Badges.
        ========================================================================
      */}
      <section className="pt-16 pb-20 px-4 bg-slate-100/40 dark:bg-zinc-950/40 space-y-7 text-center">
        
        {/* Quick Contacts */}
        {hasAnySocial && (
          <div className="space-y-4 max-w-sm mx-auto">
            <span className="text-sm text-slate-700 dark:text-zinc-300 font-bold block">تواصل مباشر وسريع مع الأكاديمية:</span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/40 text-xs font-bold transition-all shadow-xs"
                  title="محادثة واتساب مباشرة"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>واتساب الأكاديمية</span>
                </a>
              )}
              <Link
                href="/support"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-500/40 text-xs font-bold transition-all shadow-xs"
                title="الدعم الفني والمساعدة"
              >
                <Headphones className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>الدعم الفني</span>
              </Link>
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/15 dark:hover:bg-blue-500/25 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-500/40 text-xs font-semibold transition-all shadow-xs"
                  title="راسلنا عبر البريد"
                >
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>جيميل</span>
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-blue-600/15 dark:hover:bg-blue-600/25 text-indigo-800 dark:text-blue-200 border border-indigo-300 dark:border-blue-500/40 text-xs font-semibold transition-all shadow-xs"
                  title="صفحة الفيسبوك الرسمية"
                >
                  <Facebook className="w-4 h-4 text-indigo-600 dark:text-blue-400 shrink-0" />
                  <span>فيسبوك</span>
                </a>
              )}
              {telegramUrl && (
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/15 dark:hover:bg-sky-500/25 text-sky-800 dark:text-sky-200 border border-sky-300 dark:border-sky-500/40 text-xs font-semibold transition-all shadow-xs"
                  title="قناة التيليجرام"
                >
                  <Send className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
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
