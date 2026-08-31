'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Play,
  Pause,
  Maximize2,
  ShieldCheck,
  Award,
  Zap,
  Flame,
  Radio,
} from 'lucide-react';

export default function FeelItMotionHero() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
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
    <div className="w-full max-w-5xl mx-auto px-4 py-8 relative">
      {/* Outer Glow Halo */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-purple-600/30 to-rose-500/20 rounded-[36px] blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

      {/* Main Motion Art Card */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative rounded-[32px] overflow-hidden bg-black/90 border-2 border-purple-500/30 dark:border-purple-500/40 shadow-2xl shadow-purple-950/60 backdrop-blur-2xl transition-all duration-500"
      >
        {/* Top Floating Badges */}
        <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-6 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/40 text-[11px] font-black flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Next-Gen Visual Motion AI</span>
            </span>
            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black">
              4K 60FPS
            </span>
          </div>

          <button
            type="button"
            onClick={togglePlay}
            className="pointer-events-auto p-2.5 rounded-2xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer"
            title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-amber-400" />}
          </button>
        </div>

        {/* Video Canvas Container */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden flex items-center justify-center bg-black">
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

          {/* Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60 pointer-events-none" />

          {/* Center Brand Glass Overlay on Hover */}
          <div className="absolute bottom-6 sm:bottom-8 inset-x-6 sm:inset-x-8 z-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-1.5 text-right">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 text-[10px] font-black uppercase">
                  Future Ready 2026
                </span>
                <h3 className="text-base sm:text-xl font-black text-white drop-shadow-md">
                  رحلتك الهندسية نحو احتراف الذكاء الاصطناعي والبرمجة
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 font-medium max-w-xl drop-shadow-sm">
                مناهج متقدمة تجمع بين شيدرز الأنيميشن، هندسة النظم الحديثة، والإنتاج البرمجي المتقدم.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <a
                href="#all-courses"
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-zinc-950 font-black text-xs shadow-xl shadow-amber-500/25 hover:scale-105 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>استكشف المسارات الهندسية</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Feature Pill Ticker */}
        <div className="p-3 sm:p-4 bg-black/80 border-t border-purple-500/20 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 text-center">
          <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center gap-2 text-xs text-zinc-300 font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>مشاريع Portfolio قوية</span>
          </div>

          <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center gap-2 text-xs text-zinc-300 font-bold">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>شهادات معتمدة بالـ QR</span>
          </div>

          <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center gap-2 text-xs text-zinc-300 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>حماية DRM ضد القرصنة</span>
          </div>

          <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center gap-2 text-xs text-zinc-300 font-bold">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>بثوث حية تفاعلية HD</span>
          </div>
        </div>
      </div>
    </div>
  );
}