'use client';

import React, { useState, useRef } from 'react';
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
  Play,
  Pause,
  ShieldCheck,
  Award,
  Zap,
  Radio,
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
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <section className="hidden md:flex flex-col justify-center items-center min-h-[calc(100vh-3rem)] pt-24 sm:pt-28 pb-16 relative">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center text-right">
          
          {/* =========================================================================
              RIGHT COLUMN (Col Span 7): HEADLINE, SUBTITLE & 4 ACTION PILLARS
             ========================================================================= */}
          <div className="lg:col-span-7 space-y-6">
            
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
            <div className="space-y-3.5">
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[54px] font-black text-slate-950 dark:text-white leading-[1.2] tracking-tight">
                {settings.HERO_TITLE || 'بوابتك الذكية لاحتراف'} <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-500 bg-clip-text text-transparent">
                  {settings.HERO_TITLE_HIGHLIGHT || 'البرمجة وهندسة النظم والذكاء الاصطناعي'}
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed font-medium">
                {settings.HERO_SUBTITLE || `${cleanPlatformName} — مسارات تدريبية هندسية متكاملة، دبلومات برمجية معتمدة، ومشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.`}
              </p>
            </div>

            {/* 4 Premium Action Pillars (2x2 Balanced Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              
              {/* 1. Diploma Button */}
              <a href="#trending-diploma" className="shimmer-border-wrapper group w-full block">
                <div className="shimmer-beam-gold" />
                <div className="shimmer-button-content px-4 py-3 text-xs lg:text-[13px] font-black text-amber-950 dark:text-amber-300 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 dark:from-amber-950/70 dark:via-zinc-900 dark:to-amber-950/70 group-hover:opacity-95 flex items-center justify-center gap-2 rounded-2xl shadow-lg border border-amber-400 dark:border-amber-500/50">
                  <Flame className="w-4 h-4 text-amber-700 dark:text-amber-400 animate-bounce shrink-0" />
                  <span className="whitespace-nowrap truncate">{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً (خصم 51%)'}</span>
                </div>
              </a>

              {/* 2. Digital Notes & Books Marketplace */}
              <Link
                href="/books"
                prefetch={true}
                className="group flex items-center justify-center gap-2 px-4 py-3 text-xs lg:text-[13px] font-black bg-emerald-100/90 text-emerald-950 border-2 border-emerald-400 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-500/60 hover:bg-emerald-200 dark:hover:bg-emerald-900/90 transition-all rounded-2xl shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:scale-105 backdrop-blur-md"
              >
                <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="whitespace-nowrap truncate">{settings.HERO_BTN_BOOKS || 'سوق المذكرات والكتب (خصم 50%)'}</span>
              </Link>

              {/* 3. Expert Instructor Button */}
              <Link
                href="/instructors/join?track=expert"
                prefetch={true}
                className="group flex items-center justify-center gap-2 px-4 py-3 text-xs lg:text-[13px] font-black bg-purple-100/90 text-purple-950 border-2 border-purple-400 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-500/60 hover:bg-purple-200 dark:hover:bg-purple-900/90 transition-all rounded-2xl shadow-md shadow-purple-500/10 hover:shadow-purple-500/25 hover:scale-105 backdrop-blur-md"
              >
                <Video className="w-4 h-4 text-purple-700 dark:text-purple-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="whitespace-nowrap truncate">
                  {settings.HERO_BTN_EXPERT
                    ? settings.HERO_BTN_EXPERT.replace(/14\s*يوماً|14\s*يوم/g, `${settings.INSTRUCTOR_TRIAL_DAYS || '14'} يوماً`)
                    : `انضم كـ مدرس (${settings.INSTRUCTOR_TRIAL_DAYS || '14'} يوماً مجاناً)`}
                </span>
              </Link>

              {/* 4. Student Instructor Button */}
              <Link
                href="/instructors/join?track=student"
                prefetch={true}
                className="group flex items-center justify-center gap-2 px-4 py-3 text-xs lg:text-[13px] font-black bg-amber-100/90 text-amber-950 border-2 border-amber-400 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-500/60 hover:bg-amber-200 dark:hover:bg-amber-900/90 transition-all rounded-2xl shadow-md shadow-amber-500/10 hover:shadow-amber-500/25 hover:scale-105 backdrop-blur-md"
              >
                <GraduationCap className="w-4.5 h-4.5 text-amber-700 dark:text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="whitespace-nowrap truncate">
                  {settings.HERO_BTN_STUDENT
                    ? settings.HERO_BTN_STUDENT.replace(/30\s*يوماً|30\s*يوم/g, `${settings.STUDENT_TRIAL_DAYS || '14'} يوماً`)
                    : `اشترك كمحاضر طالب (منحة مجانية)`}
                </span>
              </Link>

            </div>

            {/* Quick Contact Bar */}
            {hasAnySocial && whatsappUrl && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-bold">تواصل فوري:</span>
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
              LEFT COLUMN (Col Span 5): CHROMATIC RGB MOTION ART CARD (Feel It All Around)
             ========================================================================= */}
          <div className="lg:col-span-5 relative group">
            {/* Ambient Aura Glow behind the card */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/30 via-purple-600/40 to-rose-500/30 rounded-[36px] blur-2xl opacity-75 group-hover:opacity-100 transition duration-700 -z-10" />

            <div className="relative rounded-[32px] overflow-hidden bg-black border-2 border-purple-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
              
              {/* Top Floating Glass Badges */}
              <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-1.5 pointer-events-auto">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/40 text-[10.5px] font-black flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>Next-Gen Visual Motion AI</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9.5px] font-black">
                    4K 60FPS
                  </span>
                </div>

                <button
                  type="button"
                  onClick={togglePlay}
                  className="pointer-events-auto p-2 rounded-xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              </div>

              {/* Video Player */}
              <div className="relative aspect-square w-full overflow-hidden flex items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  src="https://cdn.recent.design/items/nog55iz/0/v0.mp4"
                  poster="https://cdn.recent.design/items/nog55iz/0/poster/1200.webp"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover select-none pointer-events-none filter contrast-125 brightness-105"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                {/* Bottom Overlay Card Content */}
                <div className="absolute bottom-4 inset-x-4 z-20 space-y-1.5 text-right">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 text-[9.5px] font-black uppercase">
                      Future Ready 2026
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-white drop-shadow-md">
                      أحدث معايير التدريب والإنتاج البرمجي
                    </h3>
                  </div>
                  <p className="text-[11px] text-zinc-300 font-medium leading-relaxed drop-shadow-sm line-clamp-2">
                    شيدرز وأنيميشن الذكاء الاصطناعي، هندسة النظم الحديثة، وتطبيقات عملية متقدمة.
                  </p>
                </div>
              </div>

              {/* Bottom 4 Feature Tickers */}
              <div className="p-2.5 bg-black/90 border-t border-purple-500/20 grid grid-cols-2 gap-2 text-center text-[10.5px]">
                <div className="p-1.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center gap-1.5 text-zinc-300 font-bold">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>Portfolio واقعي</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center gap-1.5 text-zinc-300 font-bold">
                  <Award className="w-3 h-3 text-purple-400" />
                  <span>شهادات بالـ QR</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center gap-1.5 text-zinc-300 font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>حماية DRM</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center gap-1.5 text-zinc-300 font-bold">
                  <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
                  <span>بث مباشر HD</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}