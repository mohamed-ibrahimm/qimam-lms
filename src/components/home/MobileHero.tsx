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
  ShieldCheck,
  Award,
  Users,
  Code2,
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
    <section className="block md:hidden pt-2 pb-10 px-4 text-center relative overflow-hidden">
      
      {/* Dynamic Golden Atmosphere (Works in Dark & Light modes) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm h-[380px] pointer-events-none -z-10 overflow-visible">
        <div className="absolute top-0 right-1/6 w-[280px] h-[220px] bg-amber-500/15 dark:bg-amber-400/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-1/6 w-[300px] h-[240px] bg-yellow-500/15 dark:bg-yellow-400/15 rounded-full blur-[85px]" />
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col items-center space-y-4">
        
        {/* 1. Promotional Pill Banner */}
        {settings.BANNER_ENABLED !== 'false' && (
          <a
            href="#trending-diploma"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 dark:border-amber-400/40 text-amber-700 dark:text-amber-300 active:scale-95 transition-all shadow-xs"
          >
            <div className="flex items-center gap-1 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 animate-pulse" />
              <span className="font-extrabold text-[11px] bg-amber-500/20 dark:bg-amber-400/20 px-1.5 py-0.5 rounded-md">جديد!</span>
            </div>
            <span className="font-bold text-[11px] sm:text-xs">
              {settings.BANNER_TEXT ? settings.BANNER_TEXT.replace('استثنائي ', '').replace(' والدبلومات', '') : 'خصم 50% لفترة محدودة على المسارات الهندسية'}
            </span>
            <ArrowLeft className="w-3 h-3 text-amber-500 dark:text-amber-400 shrink-0" />
          </a>
        )}

        {/* 2. Bold, Symmetrical, Authoritative Headline */}
        <div className="w-full pt-1">
          <h1 className="font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.2]">
            <span className="block text-[28px] xs:text-[32px] sm:text-4xl font-extrabold mb-1">
              نحو مستقبل برمجي
            </span>
            <span className="block text-[28px] xs:text-[32px] sm:text-4xl font-extrabold bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-transparent">
              وهندسي احترافي
            </span>
          </h1>

          <p className="text-xs xs:text-sm text-slate-600 dark:text-zinc-300 font-medium mt-2.5 max-w-xs mx-auto leading-relaxed">
            {settings.PLATFORM_TAGLINE || 'دبلومات تطبيقية ومشاريع واقعية تؤهلك لسوق العمل باحترافية وثقة.'}
          </p>
        </div>

        {/* 3. High-Converting Mobile Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 pt-1">
          {/* Primary Diploma CTA Card */}
          <a
            href="#trending-diploma"
            className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-3 text-right">
              <div className="w-10 h-10 rounded-xl bg-zinc-950/15 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-zinc-950 animate-bounce" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm xs:text-base font-black leading-tight">
                  {settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً في سوق العمل'}
                </span>
                <span className="text-[11px] font-bold text-zinc-900/80 leading-tight mt-0.5">
                  خصم استثنائي 51% لفترة محدودة
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-950/15 flex items-center justify-center shrink-0 group-hover:-translate-x-1 transition-transform">
              <ArrowLeft className="w-4 h-4 text-zinc-950" />
            </div>
          </a>

          {/* Secondary Course Guide Button */}
          <Link
            href="/courses"
            className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-white/90 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-xs group"
          >
            <div className="flex items-center gap-2.5 text-right">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-xs xs:text-sm font-bold">
                {settings.HERO_CTA_PRIMARY || 'تصفح جميع الكورسات والمسارات'}
              </span>
            </div>
            <ArrowLeft className="w-4 h-4 text-slate-400 dark:text-zinc-500 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4. Trust Stats Micro-Grid */}
        <div className="grid grid-cols-3 gap-2 w-full pt-1">
          <div className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-white/70 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-zinc-800/80 text-center shadow-2xs">
            <span className="text-sm font-black text-amber-600 dark:text-amber-400">+1,500</span>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold mt-0.5">طالب وخريج</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-white/70 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-zinc-800/80 text-center shadow-2xs">
            <span className="text-sm font-black text-amber-600 dark:text-amber-400">100%</span>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold mt-0.5">تطبيقات عملية</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-white/70 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-zinc-800/80 text-center shadow-2xs">
            <span className="text-sm font-black text-amber-600 dark:text-amber-400">معتمدة</span>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold mt-0.5">برمز QR دولي</span>
          </div>
        </div>

        {/* 5. Direct Quick Contact Channels */}
        {hasAnySocial && (
          <div className="w-full flex items-center justify-center gap-2 pt-1">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold active:scale-95 transition-all shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>واتساب الأكاديمية</span>
              </a>
            )}
            <Link
              href="/support"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold active:scale-95 transition-all shadow-2xs"
            >
              <Headphones className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>الدعم الفني</span>
            </Link>
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold active:scale-95 transition-all shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>جيميل</span>
              </a>
            )}
          </div>
        )}

        {/* 6. Accreditation Badge */}
        <div className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100/80 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 text-[11px] text-slate-600 dark:text-zinc-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>إشراف {cleanPlatformName} • القاهرة & أونلاين بالعالم العربي</span>
        </div>

      </div>

    </section>
  );
}
