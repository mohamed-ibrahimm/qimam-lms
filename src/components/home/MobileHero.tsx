import React from 'react';
import Link from 'next/link';
import {
  Award,
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
  whatsappUrl,
  contactEmail,
  facebookUrl,
  telegramUrl,
  youtubeUrl,
  linkedinUrl,
  hasAnySocial,
}: MobileHeroProps) {
  return (
    <div className="md:hidden flex flex-col w-full text-right py-8 px-4 space-y-6">
      
      {/* 1. TOP: Promotional Announcement */}
      {settings.BANNER_ENABLED !== 'false' && (
        <div className="w-full max-w-sm mx-auto">
          <a
            href="#trending-diploma"
            className="w-full flex items-center justify-between gap-2 px-3.5 py-1.5 rounded-full bg-surface-secondary border border-border text-xs text-text-primary group"
          >
            <span className="font-bold text-accent text-[11px]">{settings.HERO_BADGE || 'جديد!'}</span>
            <span className="truncate font-medium text-text-secondary text-[11px]">
              {settings.BANNER_TEXT || 'خصم استثنائي 50% لفترة محدودة على جميع المسارات'}
            </span>
            <ArrowLeft className="w-3 h-3 text-text-muted shrink-0 group-hover:-translate-x-0.5 transition-transform" />
          </a>
        </div>
      )}

      {/* 2. CENTER: Headline & Subtitle */}
      <div className="text-center space-y-2.5">
        <h1 className="font-bold tracking-tight text-center">
          <span className="text-text-primary block text-2xl sm:text-3xl leading-tight">
            {settings.HERO_TITLE || 'بوابتك الذكية لاحتراف'}
          </span>
          <span className="block text-xl sm:text-2xl text-accent font-bold leading-snug mt-1">
            {settings.HERO_TITLE_HIGHLIGHT || 'البرمجة وهندسة النظم والذكاء الاصطناعي'}
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-normal max-w-sm mx-auto">
          {settings.HERO_SUBTITLE || `${cleanPlatformName} — مسارات تدريبية هندسية متكاملة، دبلومات برمجية معتمدة، ومشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.`}
        </p>
      </div>

      {/* 3. Action Buttons (Stacked Vertically for Touch) */}
      <div className="flex flex-col gap-2.5 w-full max-w-sm mx-auto">
        
        {/* 1. Featured Diploma Button */}
        <a
          href="#trending-diploma"
          className="w-full h-11 px-4 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-strong transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Award className="w-4 h-4" />
          <span>{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً (خصم 51%)'}</span>
        </a>

        {/* 2. Digital Notes & Books Marketplace */}
        <Link
          href="/books"
          prefetch={true}
          className="w-full h-11 px-4 text-xs font-semibold rounded-xl bg-surface border border-border hover:border-accent text-text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4 text-accent" />
          <span>{settings.HERO_BTN_BOOKS || 'سوق المذكرات والكتب (خصم 50% ومعاينة)'}</span>
        </Link>

        {/* 3. Expert Instructor Button */}
        <Link
          href="/instructors/join?track=expert"
          prefetch={true}
          className="w-full h-11 px-4 text-xs font-semibold rounded-xl bg-surface border border-border hover:border-accent text-text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Video className="w-4 h-4 text-accent" />
          <span>
            {settings.HERO_BTN_EXPERT
              ? settings.HERO_BTN_EXPERT.replace(/14\s*يوماً|14\s*يوم/g, `${settings.INSTRUCTOR_TRIAL_DAYS || '14'} يوماً`)
              : `انضم كـ مدرس أو دكتور (${settings.INSTRUCTOR_TRIAL_DAYS || '14'} يوماً مجاناً • 0% عمولة)`}
          </span>
        </Link>

        {/* 4. Student Instructor Button */}
        <Link
          href="/instructors/join?track=student"
          prefetch={true}
          className="w-full h-11 px-4 text-xs font-semibold rounded-xl bg-surface border border-border hover:border-accent text-text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <GraduationCap className="w-4 h-4 text-accent" />
          <span>
            {settings.HERO_BTN_STUDENT
              ? settings.HERO_BTN_STUDENT.replace(/30\s*يوماً|30\s*يوم/g, `${settings.STUDENT_TRIAL_DAYS || '14'} يوماً`)
              : `اشترك كمحاضر طالب (منحة ${settings.STUDENT_TRIAL_DAYS || '14'} يوماً مجاناً)`}
          </span>
        </Link>

      </div>

      {/* 4. Social Links */}
      {hasAnySocial && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs text-text-muted">
          <span className="font-semibold text-text-secondary">تواصل مباشر:</span>
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-text-primary transition-colors">
              <MessageCircle className="w-3.5 h-3.5 text-accent" />
              <span>واتساب</span>
            </a>
          )}
          {contactEmail && (
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-1 hover:text-text-primary transition-colors">
              <Mail className="w-3.5 h-3.5 text-accent" />
              <span>الإيميل</span>
            </a>
          )}
          {telegramUrl && (
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-text-primary transition-colors">
              <Send className="w-3.5 h-3.5 text-accent" />
              <span>تيليجرام</span>
            </a>
          )}
        </div>
      )}

    </div>
  );
}