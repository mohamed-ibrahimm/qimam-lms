'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  ArrowLeft,
  GraduationCap,
  Video,
  FileText,
  MessageCircle,
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
  hasAnySocial,
}: DesktopHeroProps) {
  return (
    <section className="hidden md:flex flex-col justify-center items-center min-h-[calc(100vh-2rem)] pt-20 sm:pt-24 lg:pt-28 pb-16 relative overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* =========================================================================
              RIGHT SIDE (Col Span 7 / 8): HEADLINES, DESCRIPTION & 4 ACTION BUTTONS
             ========================================================================= */}
          <div className="lg:col-span-7 xl:col-span-8 text-right space-y-6 z-10">
            
            {/* Promotional Shimmer Announcement */}
            {settings.BANNER_ENABLED !== 'false' && (
              <div className="inline-block max-w-full">
                <a href="#trending-diploma" className="shimmer-border-wrapper group inline-block max-w-full">
                  <div className="shimmer-beam-gold" />
                  <div className="shimmer-button-content px-5 py-2 text-xs lg:text-sm text-slate-800 dark:text-zinc-200 flex items-center gap-2.5 flex-nowrap">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-amber-400 animate-pulse" />
                      <span className="text-blue-700 dark:text-amber-300 font-black">{settings.HERO_BADGE || 'جديد!'}</span>
                    </div>
                    <div className="h-4 w-px bg-slate-300 dark:bg-amber-500/40 shrink-0" />
                    <span className="group-hover:text-blue-700 dark:group-hover:text-amber-200 transition-colors font-bold text-xs lg:text-sm leading-normal">
                      {settings.BANNER_TEXT || 'خصم استثنائي 50% لفترة محدودة على جميع المسارات الهندسية'}
                    </span>
                    <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-amber-400 group-hover:-translate-x-1.5 transition-transform shrink-0" />
                  </div>
                </a>
              </div>
            )}

            {/* Main Grand Headlines */}
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[54px] font-black text-slate-950 dark:text-white leading-[1.2] tracking-tight">
                {settings.HERO_TITLE || 'بوابتك الذكية لاحتراف'} <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-500 bg-clip-text text-transparent">
                  {settings.HERO_TITLE_HIGHLIGHT || 'البرمجة وهندسة النظم والذكاء الاصطناعي'}
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed font-medium pt-1">
                {settings.HERO_SUBTITLE || `${cleanPlatformName} — مسارات تدريبية هندسية متكاملة، دبلومات برمجية معتمدة، ومشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.`}
              </p>
            </div>

            {/* 4 Premium Action Pillars (Full Clean Row / Balanced Wrap) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              
              {/* 1. Diploma Button */}
              <a href="#trending-diploma" className="shimmer-border-wrapper group shrink-0">
                <div className="shimmer-beam-gold" />
                <div className="shimmer-button-content px-5 py-3 text-xs lg:text-[13.5px] font-black text-amber-950 dark:text-amber-300 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 dark:from-amber-950/70 dark:via-zinc-900 dark:to-amber-950/70 group-hover:opacity-95 flex items-center justify-center gap-2 rounded-full shadow-lg border border-amber-400 dark:border-amber-500/50">
                  <Flame className="w-4 h-4 text-amber-700 dark:text-amber-400 animate-bounce shrink-0" />
                  <span className="whitespace-nowrap">{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً (خصم 51%)'}</span>
                </div>
              </a>

              {/* 2. Digital Notes & Books Marketplace */}
              <Link
                href="/books"
                prefetch={true}
                className="group flex items-center justify-center gap-2 px-5 py-3 text-xs lg:text-[13.5px] font-black bg-emerald-100/90 text-emerald-950 border-2 border-emerald-400 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-500/60 hover:bg-emerald-200 dark:hover:bg-emerald-900/90 transition-all rounded-full shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:scale-105 backdrop-blur-md shrink-0"
              >
                <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="whitespace-nowrap">{settings.HERO_BTN_BOOKS || 'سوق المذكرات والكتب (خصم 50%)'}</span>
              </Link>

              {/* 3. Expert Instructor Button */}
              <Link
                href="/instructors/join?track=expert"
                prefetch={true}
                className="group flex items-center justify-center gap-2 px-5 py-3 text-xs lg:text-[13.5px] font-black bg-purple-100/90 text-purple-950 border-2 border-purple-400 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-500/60 hover:bg-purple-200 dark:hover:bg-purple-900/90 transition-all rounded-full shadow-md shadow-purple-500/10 hover:shadow-purple-500/25 hover:scale-105 backdrop-blur-md shrink-0"
              >
                <Video className="w-4 h-4 text-purple-700 dark:text-purple-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="whitespace-nowrap">
                  {settings.HERO_BTN_EXPERT
                    ? settings.HERO_BTN_EXPERT.replace(/14\s*يوماً|14\s*يوم/g, `${settings.INSTRUCTOR_TRIAL_DAYS || '14'} يوماً`)
                    : `انضم كـ مدرس (${settings.INSTRUCTOR_TRIAL_DAYS || '14'} يوماً مجاناً)`}
                </span>
              </Link>

              {/* 4. Student Instructor Button */}
              <Link
                href="/instructors/join?track=student"
                prefetch={true}
                className="group flex items-center justify-center gap-2 px-5 py-3 text-xs lg:text-[13.5px] font-black bg-amber-100/90 text-amber-950 border-2 border-amber-400 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-500/60 hover:bg-amber-200 dark:hover:bg-amber-900/90 transition-all rounded-full shadow-md shadow-amber-500/10 hover:shadow-amber-500/25 hover:scale-105 backdrop-blur-md shrink-0"
              >
                <GraduationCap className="w-4.5 h-4.5 text-amber-700 dark:text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="whitespace-nowrap">
                  {settings.HERO_BTN_STUDENT
                    ? settings.HERO_BTN_STUDENT.replace(/30\s*يوماً|30\s*يوم/g, `${settings.STUDENT_TRIAL_DAYS || '14'} يوماً`)
                    : `اشترك كمحاضر طالب (منحة مجانية)`}
                </span>
              </Link>

            </div>

            {/* Quick Contact Bar */}
            {hasAnySocial && whatsappUrl && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-bold">تواصل مباشر وسريع:</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all hover:scale-105"
                  title="محادثة واتساب مباشرة"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span>واتساب الأكاديمية</span>
                </a>
              </div>
            )}

          </div>

          {/* =========================================================================
              LEFT SIDE (Col Span 5 / 4): PURE CHROMATIC MOTION ANIMATION (No Text / Pure Art)
             ========================================================================= */}
          <div className="lg:col-span-5 xl:col-span-4 flex items-center justify-center relative pointer-events-none select-none">
            {/* Ambient Radial Glow behind the animation */}
            <div className="absolute w-72 h-72 lg:w-96 lg:h-96 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none -z-10" />
            
            {/* Pure Video Animation with Smooth Dark Blend and Soft Circular Vignette */}
            <div className="relative w-full max-w-[340px] xl:max-w-[400px] aspect-square flex items-center justify-center">
              <video
                src="https://cdn.recent.design/items/nog55iz/0/v0.mp4"
                poster="https://cdn.recent.design/items/nog55iz/0/poster/1200.webp"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain pointer-events-none filter contrast-125 brightness-110 drop-shadow-[0_0_40px_rgba(245,158,11,0.25)] rounded-3xl"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}