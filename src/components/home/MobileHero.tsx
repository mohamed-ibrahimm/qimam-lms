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
    <section className="block md:hidden pt-3 pb-14 px-4 text-center relative overflow-hidden">
      
      {/* Pure Dynamic Moving Golden Atmospheric Aura (Matching Desktop) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-[420px] pointer-events-none -z-10 overflow-visible">
        <div className="dynamic-drift-1 absolute -top-8 right-1/6 w-[340px] h-[250px] bg-amber-500/25 dark:bg-amber-400/20 rounded-full blur-[85px]" />
        <div className="dynamic-drift-2 absolute -bottom-8 left-1/6 w-[360px] h-[270px] bg-yellow-500/22 dark:bg-yellow-400/18 rounded-full blur-[90px]" />
        <div className="dynamic-drift-3 absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[220px] bg-amber-600/18 dark:bg-amber-500/14 rounded-full blur-[75px]" />
      </div>

      <div className="w-full max-w-lg mx-auto flex flex-col items-center">
        
        {/* 1. Promotional Banner (Clean, centered, zero-overflow, zero-leak) */}
        {settings.BANNER_ENABLED !== 'false' && (
          <div className="w-full flex justify-center mb-5 px-3">
            <a
              href="#trending-diploma"
              className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#14141e]/95 border border-amber-400/50 shadow-md shadow-amber-500/10 text-slate-100 active:scale-95 transition-transform max-w-[340px]"
            >
              <div className="flex items-center gap-1 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-amber-300 font-extrabold text-xs">{settings.HERO_BADGE || 'جديد!'}</span>
              </div>
              <div className="h-3 w-px bg-amber-400/40 shrink-0" />
              <span className="font-bold text-xs text-zinc-100 whitespace-nowrap truncate">
                {settings.BANNER_TEXT ? settings.BANNER_TEXT.replace('استثنائي ', '').replace(' والدبلومات', '') : 'خصم 50% لفترة محدودة على المسارات الهندسية'}
              </span>
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </a>
          </div>
        )}

        {/* 2. Big, Wide, Authoritative Headline (IBM Plex Sans Arabic Saudi Typography) */}
        <div className="w-full px-2 mb-3">
          <h1 className="font-extrabold tracking-tight w-full">
            <span className="text-white block font-extrabold text-[27px] xs:text-[31px] sm:text-4xl leading-[1.25] mb-2 tracking-tight">
              {settings.HERO_TITLE || 'نحو مستقبل برمجي وهندسي احترافي'}
            </span>
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent block font-bold text-[17px] xs:text-[20px] sm:text-2xl leading-snug">
              {(settings.PLATFORM_TAGLINE && !settings.PLATFORM_TAGLINE.includes('?'))
                ? settings.PLATFORM_TAGLINE
                : 'دبلومات تطبيقية ومشاريع واقعية تؤهلك لسوق العمل'}
            </span>
          </h1>
        </div>

        {/* 3. Subtitle (Tight, natural spacing with zero giant empty gaps) */}
        <p className="text-xs xs:text-sm text-zinc-300 max-w-md mx-auto mb-6 leading-relaxed font-normal px-2">
          {settings.HERO_SUBTITLE ||
            `${cleanPlatformName} — مسارات تدريبية هندسية متكاملة، دبلومات برمجية معتمدة، ومشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.`}
        </p>

        {/* 4. Action Buttons (Directly below description with natural spacing) */}
        <div className="w-full max-w-sm mx-auto flex flex-col gap-3.5 mb-7 px-1">
          {/* Primary Diploma Button with Glowing Golden Border */}
          <a
            href="#trending-diploma"
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-gradient-to-b from-[#1c1a24] to-[#0e0d13] text-amber-300 font-extrabold text-sm xs:text-base border-2 border-amber-400/90 shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-[0.98] transition-all group"
          >
            <Flame className="w-5 h-5 text-amber-400 animate-bounce shrink-0" />
            <span className="whitespace-nowrap">{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً (خصم 51%)'}</span>
            <ArrowLeft className="w-5 h-5 text-amber-400 group-hover:-translate-x-1.5 transition-transform duration-300 shrink-0" />
          </a>

          {/* Secondary Guide Button */}
          <Link
            href="/courses"
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white font-bold text-sm xs:text-base border border-zinc-700 shadow-md backdrop-blur-md active:scale-[0.98] transition-all group"
          >
            <BookOpen className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="whitespace-nowrap">{settings.HERO_CTA_PRIMARY || 'تصفح دليل الكورسات'}</span>
            <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:-translate-x-1 transition-transform duration-300 shrink-0" />
          </Link>
        </div>

        {/* 5. Quick Contacts (Integrated smoothly without giant gaps) */}
        {hasAnySocial && (
          <div className="w-full pt-4 pb-3 border-t border-zinc-800/60 max-w-sm mx-auto">
            <p className="text-xs font-bold text-zinc-400 mb-2.5">تواصل مباشر وسريع مع الأكاديمية:</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-xs active:scale-95 transition-transform"
                  title="محادثة واتساب مباشرة"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>واتساب الأكاديمية</span>
                </a>
              )}
              <Link
                href="/support"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-xs active:scale-95 transition-transform"
                title="الدعم الفني والمساعدة"
              >
                <Headphones className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>الدعم الفني</span>
              </Link>
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-300 text-xs font-semibold shadow-xs"
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 text-xs font-semibold shadow-xs"
                >
                  <Facebook className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>فيسبوك</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* 6. Accreditation & Location Badges */}
        <div className="w-full flex flex-col items-center gap-2 max-w-sm mx-auto pt-2">
          <div className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-medium">مصر — القاهرة & أونلاين بالعالم العربي</span>
          </div>
          <div className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-200 font-semibold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>إشراف {cleanPlatformName}</span>
          </div>
          <div className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-200 font-semibold shadow-xs">
            <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>شهادات تخرج رقمية معتمدة برمز QR</span>
          </div>
        </div>

      </div>

    </section>
  );
}
