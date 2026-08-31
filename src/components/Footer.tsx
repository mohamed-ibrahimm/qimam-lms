import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Mail,
  Phone,
  MessageCircle,
  Send,
  Youtube,
  Facebook,
  Linkedin,
  Twitter,
  ShieldCheck,
  Award,
  BookOpen,
  CreditCard,
  Smartphone,
  Zap,
  Wallet,
  Building2,
} from 'lucide-react';

interface FooterProps {
  initialSettings?: Record<string, string>;
}

export default function Footer({ initialSettings }: FooterProps) {
  const platformName = (initialSettings?.['PLATFORM_NAME'] || 'أكاديمية م / محمد إبراهيم').replace(/سنجر/g, '').trim() || 'أكاديمية م / محمد إبراهيم';
  const platformTagline = initialSettings?.['PLATFORM_TAGLINE'] || 'بوابتك الاحترافية لاحتراف البرمجة والذكاء الاصطناعي والتصميم ومشاريع الإنتاج الفعلية.';

  const rawWhatsApp = initialSettings?.['WHATSAPP_NUMBER'] || initialSettings?.['CONTACT_WHATSAPP'] || initialSettings?.['CONTACT_PHONE'] || '';
  const safeWhatsApp = (rawWhatsApp && !rawWhatsApp.includes('1001234567')) ? rawWhatsApp : '01555791568';
  const whatsappNum = safeWhatsApp.replace(/[^0-9]/g, '');
  let formattedWhatsapp = whatsappNum;
  if (formattedWhatsapp.startsWith('002')) {
    formattedWhatsapp = formattedWhatsapp.slice(2);
  } else if (formattedWhatsapp.startsWith('0')) {
    formattedWhatsapp = '2' + formattedWhatsapp;
  } else if (formattedWhatsapp.length === 10 && formattedWhatsapp.startsWith('1')) {
    formattedWhatsapp = '20' + formattedWhatsapp;
  }
  const whatsappUrl = `https://wa.me/${formattedWhatsapp}`;

  const contactEmail = initialSettings?.['CONTACT_EMAIL'] ? `mailto:${initialSettings['CONTACT_EMAIL']}` : '';
  const facebookUrl = initialSettings?.['FACEBOOK_URL'] || '';
  const telegramUrl = initialSettings?.['TELEGRAM_URL'] || '';
  const youtubeUrl = initialSettings?.['YOUTUBE_URL'] || '';
  const linkedinUrl = initialSettings?.['LINKEDIN_URL'] || '';

  return (
    <footer className="w-full bg-surface border-t border-border mt-16 pt-12 pb-10 text-text-secondary relative">
      
      {/* 5-Column Master Footer Grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* 1. Brand Information */}
        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-secondary border border-border flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">{platformName}</h3>
              <p className="text-[11px] text-accent font-medium">التميز الأكاديمي والمهني المعتمد</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-text-secondary">
            {platformTagline}
          </p>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-secondary border border-border text-text-secondary text-[11px] font-medium">
              <Award className="w-3.5 h-3.5 text-accent" />
              <span>شهادات معتمدة بكود تحقق رقمي</span>
            </span>
          </div>
        </div>

        {/* 2. Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-text-primary mb-3 border-b border-border pb-1.5 inline-block">
            روابط سريعة
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/courses" className="hover:text-accent transition-colors flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-text-muted" />
                <span>الدورات التدريبية</span>
              </Link>
            </li>
            <li>
              <Link href="/diplomas" className="hover:text-accent transition-colors flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-text-muted" />
                <span>الدبلومات الشاملة</span>
              </Link>
            </li>
            <li>
              <Link href="/verify" className="hover:text-accent transition-colors flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-text-muted" />
                <span>التحقق من صحة الشهادات</span>
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-accent transition-colors flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                <span>مركز المساعدة والدعم</span>
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-accent transition-colors flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                <span>الشروط وسياسة الاستخدام</span>
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-accent transition-colors flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                <span>سياسة الخصوصية والأمان</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* 3. Specialized Paths */}
        <div>
          <h4 className="text-xs font-bold text-text-primary mb-3 border-b border-border pb-1.5 inline-block">
            المسارات التخصصية
          </h4>
          <ul className="space-y-2 text-xs text-text-secondary">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Full-Stack Next.js 15 & Node.js</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>الذكاء الاصطناعي وهندسة الأوامر</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>تصميم الواجهات UI/UX والموبايل</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>DevOps والبنية التحتية السحابية</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>الأمن السيبراني واختبار الاختراق</span>
            </li>
          </ul>
        </div>

        {/* 4. Payment Methods Box */}
        <div>
          <h4 className="text-xs font-bold text-text-primary mb-3 border-b border-border pb-1.5 inline-block">
            طرق الدفع المعتمدة
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
              <Zap className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>InstaPay (إنستاباي فوري)</span>
            </li>
            <li className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
              <Smartphone className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>فودافون كاش & أورنج كاش</span>
            </li>
            <li className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
              <CreditCard className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>بطاقات Visa & Mastercard</span>
            </li>
            <li className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>كارت ميزة الوطني المحلي</span>
            </li>
            <li className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
              <Wallet className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>فوري Pay والمحافظ الذكية</span>
            </li>
            <li className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
              <Building2 className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>تحويل بنكي مباشر آمن 100%</span>
            </li>
          </ul>
        </div>

        {/* 5. Direct Channels */}
        <div>
          <h4 className="text-xs font-bold text-text-primary mb-3 border-b border-border pb-1.5 inline-block">
            قنوات التواصل المباشرة
          </h4>
          <div className="space-y-2.5 text-xs">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-text-primary hover:text-accent transition-colors font-medium bg-surface-secondary p-2 rounded-lg border border-border"
              >
                <MessageCircle className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>الدعم الفني عبر واتساب (فوري)</span>
              </a>
            )}

            {telegramUrl && (
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>قناة التليجرام الرسمية</span>
              </a>
            )}

            {contactEmail && (
              <a
                href={contactEmail}
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>البريد الإلكتروني للإدارة</span>
              </a>
            )}

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-surface-secondary hover:bg-surface text-text-secondary hover:text-accent flex items-center justify-center transition-colors border border-border"
                  title="Facebook"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              )}
              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-surface-secondary hover:bg-surface text-text-secondary hover:text-accent flex items-center justify-center transition-colors border border-border"
                  title="YouTube"
                >
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-surface-secondary hover:bg-surface text-text-secondary hover:text-accent flex items-center justify-center transition-colors border border-border"
                  title="LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-text-muted">
        <p>جميع الحقوق محفوظة © {new Date().getFullYear()} {platformName}.</p>
        <p className="flex items-center gap-1 text-text-secondary">
          <span>بإشراف وقيادة</span>
          <strong className="text-text-primary font-bold">{platformName}</strong>
        </p>
      </div>
    </footer>
  );
}