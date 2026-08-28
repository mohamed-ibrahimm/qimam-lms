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
        PAGE 1 (FIRST FOLD ON MOBILE):
        Ends cleanly right after the 2 action buttons ("تصفح دليل الكورسات")!
        Zero glitchy dynamic overflows, zero broken CSS wings.
        ======================================================================== 
      */}
      <section className="min-h-[calc(100svh-4.25rem)] flex flex-col justify-between pt-2 pb-6 px-4 text-center">
        
        {/* Top Spacer for balanced vertical centering */}
        <div className="flex-1 flex flex-col justify-center">
          
          {/* 1. Promotional Clean Banner (No broken rotating border) */}
          {settings.BANNER_ENABLED !== 'false' && (
            <div className="mb-4 inline-block">
              <a
                href="#trending-diploma"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 border border-amber-400/40 text-amber-300 text-[11px] font-bold shadow-xs active:scale-95 transition-transform"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
                <span className="text-amber-400 font-black shrink-0">{settings.HERO_BADGE || 'جديد!'}</span>
                <span className="h-3 w-px bg-amber-400/30 shrink-0" />
                <span className="font-semibold">{settings.BANNER_TEXT || 'خصم استثنائي 50% لفترة محدودة'}</span>
                <ArrowLeft className="w-3 h-3 text-amber-400 shrink-0" />
              </a>
            </div>
          )}

          {/* 2. Hero Headline (Flows without orphaned words) */}
          <div className="space-y-2 mb-4">
            <h1 className="text-[21px] xs:text-[23px] font-black text-white leading-tight tracking-tight">
              {settings.HERO_TITLE || 'نحو مستقبل برمجي وهندسي احترافي'}
            </h1>
            <p className="text-[15px] xs:text-[17px] font-black bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent leading-snug">
              {(settings.PLATFORM_TAGLINE && !settings.PLATFORM_TAGLINE.includes('?'))
                ? settings.PLATFORM_TAGLINE
                : 'دبلومات تطبيقية ومشاريع واقعية تؤهلك لسوق العمل'}
            </p>
          </div>

          {/* 3. Short, Clean Subtitle */}
          <p className="text-xs text-zinc-300 leading-relaxed font-normal max-w-sm mx-auto mb-6 px-1">
            {settings.HERO_SUBTITLE ||
              `${cleanPlatformName} — مسارات تدريبية هندسية ودبلومات برمجية شاملة مع مشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.`}
          </p>

          {/* 4. Action Buttons (Clean, native luxury gradients - NO glitchy conic overflow) */}
          <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
            {/* Primary Diploma Button */}
            <a
              href="#trending-diploma"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 active:from-amber-400 active:to-yellow-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 active:scale-[0.98] transition-all border border-amber-300/80"
            >
              <Flame className="w-4 h-4 text-amber-950 animate-bounce shrink-0" />
              <span className="whitespace-nowrap font-black">{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً (خصم 51%)'}</span>
              <ArrowLeft className="w-4 h-4 text-slate-950 shrink-0" />
            </a>

            {/* Secondary Courses Guide Button */}
            <Link
              href="/courses"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-zinc-900/90 active:bg-zinc-800 text-white font-bold text-sm border border-zinc-700 shadow-md active:scale-[0.98] transition-all backdrop-blur-md"
            >
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="whitespace-nowrap">{settings.HERO_CTA_PRIMARY || 'تصفح دليل الكورسات'}</span>
              <ArrowLeft className="w-4 h-4 text-zinc-400 shrink-0" />
            </Link>
          </div>

        </div>

      </section>

      {/* 
        ========================================================================
        PAGE 2 (BELOW THE FOLD ON MOBILE):
        The user scrolls to see the contacts and badges cleanly arranged!
        ======================================================================== 
      */}
      <section className="py-8 px-4 border-t border-zinc-800/60 bg-zinc-950/40 space-y-6 text-center">
        
        {/* Quick Contacts Bar */}
        {hasAnySocial && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-zinc-400">تواصل مباشر وسريع مع الأكاديمية:</p>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm mx-auto">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-xs active:scale-95 transition-transform"
                  title="محادثة واتساب مباشرة"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>واتساب الأكاديمية</span>
                </a>
              )}
              <Link
                href="/support"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-xs active:scale-95 transition-transform"
                title="الدعم الفني والمساعدة"
              >
                <Headphones className="w-4 h-4 text-amber-400 shrink-0" />
                <span>الدعم الفني</span>
              </Link>
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-950/70 border border-blue-500/40 text-blue-300 text-xs font-semibold shadow-xs"
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 text-xs font-semibold shadow-xs"
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-950/70 border border-sky-500/40 text-sky-300 text-xs font-semibold shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>تيليجرام</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Accreditation & Location Badges */}
        <div className="flex flex-col items-center gap-2 max-w-sm mx-auto pt-2">
          <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 shadow-xs">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">مصر — القاهرة & أونلاين بالعالم العربي</span>
          </div>
          <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold text-zinc-200">إشراف {cleanPlatformName}</span>
          </div>
          <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 shadow-xs">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold text-zinc-200">شهادات تخرج رقمية معتمدة برمز QR</span>
          </div>
        </div>

      </section>
    </div>
  );
}
