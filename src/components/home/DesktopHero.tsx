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
    <section className="hidden md:flex flex-col justify-center items-center py-16 sm:py-20 relative max-w-[1280px] mx-auto px-4 lg:px-8">
      <div className="text-center w-full space-y-6">
        
        {/* Promotional Banner */}
        {settings.BANNER_ENABLED !== 'false' && (
          <div className="inline-block max-w-full">
            <a
              href="#trending-diploma"
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface-secondary border border-border hover:border-accent text-xs text-text-primary transition-colors group"
            >
              <span className="font-bold text-accent">{settings.HERO_BADGE || 'جديد!'}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                {settings.BANNER_TEXT || 'خصم استثنائي 50% لفترة محدودة على جميع المسارات الهندسية'}
              </span>
              <ArrowLeft className="w-3.5 h-3.5 text-text-muted group-hover:-translate-x-0.5 transition-transform" />
            </a>
          </div>
        )}

        {/* Headlines */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-[1.25] tracking-tight">
            {settings.HERO_TITLE || 'بوابتك الذكية لاحتراف'}{' '}
            <span className="text-accent">
              {settings.HERO_TITLE_HIGHLIGHT || 'البرمجة وهندسة النظم والذكاء الاصطناعي'}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-text-secondary max-w-3xl mx-auto leading-relaxed font-normal">
            {settings.HERO_SUBTITLE || `${cleanPlatformName} — مسارات تدريبية هندسية متكاملة، دبلومات برمجية معتمدة، ومشاريع إنتاج واقعية تؤهلك لسوق العمل بثقة واحتراف.`}
          </p>
        </div>

        {/* 4 Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full mx-auto pt-2">
          
          {/* 1. Diploma Button */}
          <a
            href="#trending-diploma"
            className="h-10 px-5 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-strong transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span className="whitespace-nowrap">{settings.FEATURED_DIPLOMA_BADGE || 'الدبلومة الأكثر طلباً (خصم 51%)'}</span>
          </a>

          {/* 2. Digital Notes & Books Marketplace */}
          <Link
            href="/books"
            prefetch={true}
            className="h-10 px-5 text-xs font-semibold rounded-xl bg-surface border border-border hover:border-accent text-text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-accent" />
            <span className="whitespace-nowrap">{settings.HERO_BTN_BOOKS || 'سوق المذكرات والكتب (خصم 50% ومعاينة)'}</span>
          </Link>

          {/* 3. Expert Instructor Button */}
          <Link
            href="/instructors/join?track=expert"
            prefetch={true}
            className="h-10 px-5 text-xs font-semibold rounded-xl bg-surface border border-border hover:border-accent text-text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Video className="w-4 h-4 text-accent" />
            <span className="whitespace-nowrap">
              {settings.HERO_BTN_EXPERT
                ? settings.HERO_BTN_EXPERT.replace(/14\s*يوماً|14\s*يوم/g, `${settings.INSTRUCTOR_TRIAL_DAYS || '14'} يوماً`)
                : `انضم كـ مدرس أو دكتور (${settings.INSTRUCTOR_TRIAL_DAYS || '14'} يوماً مجاناً • 0% عمولة)`}
            </span>
          </Link>

          {/* 4. Student Instructor Button */}
          <Link
            href="/instructors/join?track=student"
            prefetch={true}
            className="h-10 px-5 text-xs font-semibold rounded-xl bg-surface border border-border hover:border-accent text-text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-accent" />
            <span className="whitespace-nowrap">
              {settings.HERO_BTN_STUDENT
                ? settings.HERO_BTN_STUDENT.replace(/30\s*يوماً|30\s*يوم/g, `${settings.STUDENT_TRIAL_DAYS || '14'} يوماً`)
                : `اشترك كمحاضر طالب (منحة ${settings.STUDENT_TRIAL_DAYS || '14'} يوماً مجاناً)`}
            </span>
          </Link>

        </div>

        {/* Social Links */}
        {hasAnySocial && (
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6 text-xs text-text-muted">
            <span className="font-semibold text-text-secondary">تواصل مباشر وسريع:</span>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-text-primary transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-accent" />
                <span>واتساب الدعم</span>
              </a>
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-1.5 hover:text-text-primary transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-accent" />
                <span>البريد الإلكتروني</span>
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-text-primary transition-colors"
              >
                <Facebook className="w-3.5 h-3.5 text-accent" />
                <span>فيسبوك</span>
              </a>
            )}
            {telegramUrl && (
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-text-primary transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-accent" />
                <span>تيليجرام</span>
              </a>
            )}
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-text-primary transition-colors"
              >
                <Youtube className="w-3.5 h-3.5 text-accent" />
                <span>يوتيوب</span>
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-text-primary transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-accent" />
                <span>لينكد إن</span>
              </a>
            )}
          </div>
        )}

      </div>
    </section>
  );
}