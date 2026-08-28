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
  BookOpen
} from 'lucide-react';

interface FooterProps {
  initialSettings?: Record<string, string>;
}

export default function Footer({ initialSettings }: FooterProps) {
  const platformName = initialSettings?.['PLATFORM_NAME'] || 'أكاديمية م / محمد إبراهيم';
  const platformTagline = initialSettings?.['PLATFORM_TAGLINE'] || 'بوابتك الاحترافية لاحتراف البرمجة والذكاء الاصطناعي والتصميم ومشاريع الإنتاج الفعلية.';

  let whatsappUrl = '';
  if (initialSettings?.['WHATSAPP_NUMBER']) {
    const clean = initialSettings['WHATSAPP_NUMBER'].replace(/[^0-9]/g, '');
    const formatted = clean.startsWith('0') ? '2' + clean : clean;
    whatsappUrl = `https://wa.me/${formatted}`;
  }

  const contactEmail = initialSettings?.['CONTACT_EMAIL'] ? `mailto:${initialSettings['CONTACT_EMAIL']}` : '';
  const facebookUrl = initialSettings?.['FACEBOOK_URL'] || '';
  const telegramUrl = initialSettings?.['TELEGRAM_URL'] || '';
  const youtubeUrl = initialSettings?.['YOUTUBE_URL'] || '';
  const linkedinUrl = initialSettings?.['LINKEDIN_URL'] || '';

  return (
    <footer className="w-full bg-[#080710] border-t border-white/[0.06] mt-20 pt-16 pb-12 text-slate-400 relative">
      {/* Top subtle purple/gold accent edge */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/25 via-purple-500/25 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-amber-400 p-[2px] shadow-lg shadow-purple-950/50">
              <div className="w-full h-full bg-[#0c0918] rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{platformName}</h3>
              <p className="text-[11px] text-amber-300 font-medium">التميز الأكاديمي والمهني المعتمد</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            {platformTagline}
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-bold">
              <Award className="w-3.5 h-3.5" />
              شهادات معتمدة بكود تحقق رقمي
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4 border-b border-white/[0.08] pb-2 inline-block">
            روابط سريعة
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/courses" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400/70" />
                <span>الدورات التدريبية</span>
              </Link>
            </li>
            <li>
              <Link href="/diplomas" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400/70" />
                <span>الدبلومات الشاملة</span>
              </Link>
            </li>
            <li>
              <Link href="/verify" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400/70" />
                <span>التحقق من صحة الشهادات</span>
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-amber-300 transition-colors">
                مركز المساعدة والدعم
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-amber-300 transition-colors">
                الشروط وسياسة الاستخدام
              </Link>
            </li>
          </ul>
        </div>

        {/* Featured Paths */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4 border-b border-white/[0.08] pb-2 inline-block">
            المسارات التخصصية
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>مسار Full-Stack Next.js 15 & Node.js</li>
            <li>مسار الذكاء الاصطناعي وهندسة الأوامر</li>
            <li>مسار تصميم واجهات المستخدم UI/UX وتطبيقات الموبايل</li>
            <li>مسار DevOps وهندسة البنية التحتية السحابية</li>
            <li>مسار الأمن السيبراني واختبار الاختراق</li>
          </ul>
        </div>

        {/* Direct Channels */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4 border-b border-white/[0.08] pb-2 inline-block">
            قنوات التواصل المباشرة
          </h4>
          <div className="space-y-3 text-xs">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>الدعم الفني عبر واتساب (فوري)</span>
              </a>
            )}

            {telegramUrl && (
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>قناة التليجرام الرسمية</span>
              </a>
            )}

            {contactEmail && (
              <a
                href={contactEmail}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0 text-amber-400" />
                <span>البريد الإلكتروني للإدارة</span>
              </a>
            )}

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-blue-600/30 text-slate-300 hover:text-blue-400 flex items-center justify-center transition-colors border border-white/[0.08]"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-red-600/30 text-slate-300 hover:text-red-400 flex items-center justify-center transition-colors border border-white/[0.08]"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-sky-600/30 text-slate-300 hover:text-sky-400 flex items-center justify-center transition-colors border border-white/[0.08]"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>جميع الحقوق محفوظة © {new Date().getFullYear()} {platformName}. صُممت المنصة بأحدث معايير الأمان وتطوير البرمجيات الحديثة.</p>
        <p className="flex items-center gap-1 text-slate-400">
          <span>بإشراف وقيادة</span>
          <strong className="text-amber-400 font-bold">{platformName}</strong>
        </p>
      </div>
    </footer>
  );
}