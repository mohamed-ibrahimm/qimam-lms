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
import { prisma } from '@/lib/prisma';

export default async function Footer() {
  let platformName = 'أكاديمية قِمَم';
  let platformTagline = 'المنصة العربية الأولى المتخصصة في بناء وتأهيل الكوادر البرمجية والهندسية لسوق العمل بأعلى المعايير الاحترافية ومشاريع الإنتاج الفعلية.';
  let whatsappUrl = '';
  let contactEmail = '';
  let facebookUrl = '';
  let telegramUrl = '';
  let youtubeUrl = '';
  let linkedinUrl = '';

  try {
    const settings = await prisma.platformSetting.findMany();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    if (map['PLATFORM_NAME']) platformName = map['PLATFORM_NAME'];
    if (map['PLATFORM_TAGLINE']) platformTagline = map['PLATFORM_TAGLINE'];
    
    if (map['WHATSAPP_NUMBER']) {
      const clean = map['WHATSAPP_NUMBER'].replace(/[^0-9]/g, '');
      const formatted = clean.startsWith('0') ? '2' + clean : clean;
      whatsappUrl = `https://wa.me/${formatted}`;
    }
    if (map['CONTACT_EMAIL']) contactEmail = `mailto:${map['CONTACT_EMAIL']}`;
    if (map['FACEBOOK_URL']) facebookUrl = map['FACEBOOK_URL'];
    if (map['TELEGRAM_URL']) telegramUrl = map['TELEGRAM_URL'];
    if (map['YOUTUBE_URL']) youtubeUrl = map['YOUTUBE_URL'];
    if (map['LINKEDIN_URL']) linkedinUrl = map['LINKEDIN_URL'];
  } catch (e) {}

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
            <span className="text-lg sm:text-xl font-black text-white">
              {platformName}
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {platformTagline}
          </p>
          <div className="flex items-center gap-2.5 pt-2 flex-wrap">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/40 transition-all text-emerald-400"
                title="واتساب"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            )}
            {contactEmail && (
              <a
                href={contactEmail}
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 transition-all text-rose-400"
                title="البريد الإلكتروني / جيميل"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/40 transition-all text-blue-400"
                title="فيسبوك"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {telegramUrl && (
              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/40 transition-all text-sky-400"
                title="تليجرام"
              >
                <Send className="w-4 h-4" />
              </a>
            )}
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 transition-all text-red-400"
                title="يوتيوب"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/40 transition-all text-indigo-400"
                title="لينكد إن"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white">روابط سريعة</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/courses" className="hover:text-primary-400 transition-colors">
                تصفح الكورسات المتاحة
              </Link>
            </li>
            <li>
              <Link href="/diplomas" className="hover:text-primary-400 transition-colors">
                الدبلومات الشاملة المعتمدة
              </Link>
            </li>
            <li>
              <Link href="/verify" className="hover:text-primary-400 transition-colors">
                التحقق من صحة الشهادات بالـ QR
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-primary-400 transition-colors">
                مركز المساعدة وتذاكر الدعم
              </Link>
            </li>
          </ul>
        </div>

        {/* Payment Gateways Info */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white">طرق الدفع والتحويل</h4>
          <p className="text-xs leading-relaxed">
            ندعم التحويل المالي المباشر عبر المحافظ الإلكترونية وشبكة المدفوعات اللحظية المصرية:
          </p>
          <div className="space-y-2 pt-1">
            <div className="p-2.5 rounded-lg bg-surface-raised border border-border flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-semibold text-zinc-200">إنستاباي (InstaPay IPN)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-raised border border-border flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-xs font-semibold text-zinc-200">فودافون كاش (Vodafone Cash)</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white">تواصل معنا</h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary-400" />
              <span>support@qimam.edu</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary-400" />
              <span dir="ltr">+20 100 123 4567</span>
            </div>
            <div className="pt-2 text-[11px] text-zinc-500">
              ساعات العمل: يومياً من 9:00 ص حتى 10:00 م بتوقيت القاهرة
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-border/40 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <p>© {new Date().getFullYear()} {platformName}. جميع الحقوق محفوظة.</p>
        <p className="flex items-center gap-1 text-[11px]">
          تم التطوير بأعلى معايير الأمان والتصميم العربي الأصيل
        </p>
      </div>
    </footer>
  );
}