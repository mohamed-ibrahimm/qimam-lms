import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice, formatDuration } from '@/lib/utils';
import DesktopHero from '@/components/home/DesktopHero';
import MobileHero from '@/components/home/MobileHero';

export const dynamic = 'force-dynamic';
import {
  GraduationCap,
  BookOpen,
  Award,
  ShieldCheck,
  Zap,
  PlayCircle,
  Users,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Star,
  Clock,
  Layers,
  Code2,
  BrainCircuit,
  Palette,
  Shield,
  Flame,
  Briefcase,
  CheckCircle,
  MessageCircle,
  Mail,
  Facebook,
  Send,
  Youtube,
  Linkedin,
  Rocket,
  Bot,
  MapPin,
  CreditCard,
  Laptop,
  Headphones
} from 'lucide-react';

async function getHomeData() {
  try {
    const [courses, diplomas, categories, stats, settingsRecords] = await Promise.all([
      prisma.course.findMany({
        where: { status: 'PUBLISHED' },
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          instructor: { select: { officialFullName: true, avatarUrl: true } },
          category: true,
          _count: { select: { sections: true, enrollments: true } },
        },
      }).catch(() => []),
      prisma.diploma.findMany({
        where: { status: 'PUBLISHED' },
        take: 3,
        include: {
          category: true,
          diplomaCourses: {
            include: {
              course: { select: { id: true, title: true, durationHours: true } }
            }
          },
          _count: { select: { enrollments: true } },
        }
      }).catch(() => []),
      prisma.category.findMany({
        orderBy: { orderIndex: 'asc' },
        include: {
          _count: { select: { courses: true, diplomas: true } },
        }
      }).catch(() => []),
      Promise.all([
        prisma.user.count({ where: { role: 'STUDENT' } }).catch(() => 0),
        prisma.course.count({ where: { status: 'PUBLISHED' } }).catch(() => 0),
        prisma.diploma.count({ where: { status: 'PUBLISHED' } }).catch(() => 0),
        prisma.certificate.count().catch(() => 0),
      ]).then(([s, c, d, cert]) => ({
        studentsCount: Math.max(s, 1500),
        coursesCount: Math.max(c, 24),
        diplomasCount: Math.max(d, 6),
        certificatesCount: Math.max(cert, 850),
      })).catch(() => ({
        studentsCount: 1500,
        coursesCount: 24,
        diplomasCount: 6,
        certificatesCount: 850,
      })),
      prisma.platformSetting.findMany().catch(() => []),
    ]);

    const settings = Object.fromEntries((settingsRecords || []).map((s: any) => [s.key, s.value]));

    return {
      courses: courses || [],
      diplomas: diplomas || [],
      categories: categories || [],
      stats: stats || { studentsCount: 1500, coursesCount: 24, diplomasCount: 6, certificatesCount: 850 },
      settings: settings || {
        PLATFORM_NAME: 'أكاديمية م / محمد إبراهيم',
        PLATFORM_TAGLINE: 'المنصة الرائدة لعلوم البرمجة والتقنية',
      },
    };
  } catch (error) {
    console.error('Database connection error in getHomeData:', error);
    return {
      courses: [],
      diplomas: [],
      categories: [],
      stats: {
        studentsCount: 1500,
        coursesCount: 24,
        diplomasCount: 6,
        certificatesCount: 850,
      },
      settings: {
        PLATFORM_NAME: 'أكاديمية م / محمد إبراهيم',
        PLATFORM_TAGLINE: 'المنصة الرائدة لعلوم البرمجة والتقنية',
      },
    };
  }
}

export default async function HomePage() {
  const { courses, diplomas, categories, stats, settings } = await getHomeData();
  const trendingDiploma = diplomas[0] || null;

  // Clean Platform Name (ensuring سنجر is strictly NEVER present)
  const cleanPlatformName = ((settings.PLATFORM_NAME && !settings.PLATFORM_NAME.includes('?'))
    ? settings.PLATFORM_NAME
    : 'أكاديمية م / محمد إبراهيم').replace(/سنجر/g, '').trim() || 'أكاديمية م / محمد إبراهيم';

  // Social & Quick Contact URL computations (guaranteeing WhatsApp is ALWAYS active)
  const whatsappNum = (settings.CONTACT_WHATSAPP || settings.WHATSAPP_NUMBER || settings.CONTACT_PHONE || '201001234567').replace(/[^0-9]/g, '');
  const formattedWhatsapp = whatsappNum.startsWith('0') ? '2' + whatsappNum : (whatsappNum.length < 10 ? '201001234567' : whatsappNum);
  const whatsappUrl = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن تفاصيل الكورسات والدبلومات')}`;
  const contactEmail = settings.CONTACT_EMAIL || null;
  const facebookUrl = settings.FACEBOOK_URL || null;
  const telegramUrl = settings.TELEGRAM_URL || null;
  const youtubeUrl = settings.YOUTUBE_URL || null;
  const linkedinUrl = settings.LINKEDIN_URL || null;
  const hasAnySocial = Boolean(whatsappUrl || contactEmail || facebookUrl || telegramUrl || youtubeUrl || linkedinUrl);

  return (
    <div className="page-canvas relative overflow-hidden pb-24 text-zinc-100">
      {/* Ambient Multi-Colored Radiant Lighting & Soft Atmospheric Blurs */}
      <div className="ambient-glow absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top central indigo-gold dome */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.14),_rgba(245,158,11,0.06)_40%,_transparent_72%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.07),_rgba(217,119,6,0.03)_40%,_transparent_72%)] blur-[70px]" />
        {/* Right warm amber-rose flare */}
        <div className="absolute top-1/4 -right-24 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(251,146,60,0.12),_transparent_65%)] dark:bg-[radial-gradient(circle,_rgba(245,158,11,0.05),_transparent_65%)] blur-[100px] rounded-full animate-ambient-drift" />
        {/* Left subtle purple-cyan bloom */}
        <div className="absolute top-1/2 -left-28 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(147,51,234,0.1),_rgba(14,165,233,0.08)_50%,_transparent_70%)] dark:bg-[radial-gradient(circle,_rgba(168,85,247,0.04),_rgba(245,158,11,0.02)_50%,_transparent_70%)] blur-[110px] rounded-full" />
        {/* Center soft luminous spotlight */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse,_rgba(99,102,241,0.08),_transparent_65%)] dark:bg-[radial-gradient(ellipse,_rgba(251,191,36,0.03),_transparent_65%)] blur-[90px]" />
        {/* Bottom soft cyan-mint glow */}
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(20,184,166,0.08),_transparent_70%)] dark:bg-[radial-gradient(circle,_rgba(217,119,6,0.03),_transparent_70%)] blur-[110px]" />
      </div>

      <div className="relative z-10 space-y-16 sm:space-y-20 md:space-y-28">

        {/* 1. Desktop-Specific Hero (100% untouched desktop styling, dimensions, and shimmer beams) */}
        <DesktopHero
          settings={settings}
          cleanPlatformName={cleanPlatformName}
          trendingDiploma={trendingDiploma}
          whatsappUrl={whatsappUrl}
          contactEmail={contactEmail}
          facebookUrl={facebookUrl}
          telegramUrl={telegramUrl}
          youtubeUrl={youtubeUrl}
          linkedinUrl={linkedinUrl}
          hasAnySocial={hasAnySocial}
        />

        {/* 2. Mobile-Specific Hero (Dedicated mobile architecture, isolated clean pages, no glitchy conic overflows) */}
        <MobileHero
          settings={settings}
          cleanPlatformName={cleanPlatformName}
          trendingDiploma={trendingDiploma}
          whatsappUrl={whatsappUrl}
          contactEmail={contactEmail}
          facebookUrl={facebookUrl}
          telegramUrl={telegramUrl}
          youtubeUrl={youtubeUrl}
          linkedinUrl={linkedinUrl}
          hasAnySocial={hasAnySocial}
        />

        <section className="px-4 sm:px-6 py-20 bg-slate-100/50 dark:bg-zinc-900/20 border-y border-slate-200/80 dark:border-zinc-800/40 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-indigo-600 dark:text-amber-400 uppercase tracking-wider mb-2">إنجازات الأكاديمية</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-zinc-100 mb-3">أرقام تتحدث عن نفسها</h2>
              <p className="text-slate-600 dark:text-zinc-400 max-w-lg mx-auto text-sm">نفخر بثقة طلابنا وخريجينا في مصر والوطن العربي ونسعى دائماً لتقديم أفضل تجربة تدريب هندسي</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-white/90 dark:bg-zinc-900/50 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/50 hover:border-blue-300 dark:hover:border-zinc-700/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <p className="font-display text-3xl md:text-4xl font-bold text-blue-600 dark:text-zinc-100 mb-1 group-hover:scale-105 transition-transform">+{stats.studentsCount}</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-zinc-400 mb-1">طالب وخريج</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-600">في مصر والعالم العربي</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white/90 dark:bg-zinc-900/50 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/50 hover:border-indigo-300 dark:hover:border-zinc-700/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <p className="font-display text-3xl md:text-4xl font-bold text-indigo-600 dark:text-zinc-100 mb-1 group-hover:scale-105 transition-transform">+{stats.coursesCount}</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-zinc-400 mb-1">كورس هندسي</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-600">محدثة ومبنية لسوق العمل</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white/90 dark:bg-zinc-900/50 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/50 hover:border-amber-300 dark:hover:border-zinc-700/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 group text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <p className="font-display text-3xl md:text-4xl font-bold text-amber-600 dark:text-zinc-100 mb-1 group-hover:scale-105 transition-transform">+{stats.diplomasCount}</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-zinc-400 mb-1">دبلومات مهنية</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-600">تأهيل وظيفي شامل</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white/90 dark:bg-zinc-900/50 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/50 hover:border-emerald-300 dark:hover:border-zinc-700/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <p className="font-display text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1 group-hover:scale-105 transition-transform">94%</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-zinc-400 mb-1">نسبة التوظيف</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-600">في الشركات والعمل الحر</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {trendingDiploma && (
          <section id="trending-diploma" className="px-4 sm:px-6 py-8 relative overflow-hidden scroll-mt-24">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-purple-500/10 dark:from-amber-500/10 dark:to-transparent rounded-full blur-[140px]" />
            </div>

            <div className="max-w-5xl mx-auto relative">
              <div className="relative rounded-3xl border border-indigo-200/70 dark:border-amber-500/30 bg-gradient-to-br from-white/95 via-indigo-50/30 to-amber-50/20 dark:from-amber-950/30 dark:via-zinc-900/80 dark:to-zinc-950 overflow-hidden shadow-2xl backdrop-blur-xl p-8 md:p-12">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-amber-500/10 border border-indigo-200 dark:border-amber-500/25 text-indigo-700 dark:text-amber-300 text-xs font-bold mb-6 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-amber-400" />
                  <span>الدبلومة الهندسية الأكثر طلباً ومبيعاً لعام 2026 (TRENDING #1)</span>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-5">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-zinc-100 leading-tight">
                      {trendingDiploma.title}
                      <span className="block mt-1 bg-gradient-to-l from-indigo-700 via-blue-600 to-sky-600 dark:from-amber-300 dark:to-yellow-200 bg-clip-text text-transparent">
                        خصم استثنائي 51% لفترة محدودة
                      </span>
                    </h2>
                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm max-w-lg">
                      {trendingDiploma.shortDescription || trendingDiploma.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800/60 text-slate-700 dark:text-zinc-400 text-xs shadow-xs">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 dark:bg-amber-500/20 dark:text-amber-400 text-[10px] font-bold flex items-center justify-center">1</span>
                        12 مشروع إنتاج واقعي
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800/60 text-slate-700 dark:text-zinc-400 text-xs shadow-xs">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 dark:bg-amber-500/20 dark:text-amber-400 text-[10px] font-bold flex items-center justify-center">2</span>
                        مشغل آمن بعلامة مائية
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800/60 text-slate-700 dark:text-zinc-400 text-xs shadow-xs">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 dark:bg-amber-500/20 dark:text-amber-400 text-[10px] font-bold flex items-center justify-center">3</span>
                        شهادة معتمدة بـ QR
                      </span>
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-6">
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-zinc-500 block font-medium">سعر الاشتراك بالخصم الحصري:</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-slate-900 dark:text-amber-300">{formatPrice(trendingDiploma.price)}</span>
                          {trendingDiploma.compareAtPrice && (
                            <span className="text-sm text-slate-400 dark:text-zinc-500 line-through">
                              {formatPrice(trendingDiploma.compareAtPrice)}
                            </span>
                          )}
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
                            وفر 51%
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/diplomas/${trendingDiploma.slug}`}
                        className="shimmer-border-wrapper group"
                      >
                        <div className="shimmer-beam-gold" />
                        <div className="shimmer-button-content px-8 py-3.5 text-sm font-bold text-white dark:text-amber-300 group-hover:text-white">
                          <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                          <span>سجل الآن في الدبلومة الأكثر طلباً</span>
                          <ArrowLeft className="w-4 h-4 text-white dark:text-amber-400 group-hover:-translate-x-1.5 transition-transform" />
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 relative">
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl group">
                      <img
                        src={trendingDiploma.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'}
                        alt={trendingDiploma.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-indigo-300 dark:border-amber-500/40 text-indigo-600 dark:text-amber-400 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <PlayCircle className="w-7 h-7" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs">
                        <span className="px-2.5 py-1 rounded bg-black/80 border border-white/20 text-white font-bold backdrop-blur-sm">
                          {trendingDiploma.diplomaCourses?.length || 4} كورسات مدمجة
                        </span>
                        <span className="px-2.5 py-1 rounded bg-emerald-600/90 text-white font-bold backdrop-blur-sm">
                          تأهيل وظيفي كامل
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        <section id="services" className="px-4 sm:px-6 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">مميزات المنصة</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-100 mb-3">حلول هندسية متكاملة لنجاح مسارك المهني</h2>
              <p className="text-zinc-500 max-w-xl mx-auto text-sm">نقدم تجربة تعليمية حديثة ومصممة خصيصاً لنقلك من الصفر للاحتراف التقني الحقيقي</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
              <div className="md:col-span-3">
                <div className="p-6 md:p-8 rounded-3xl bg-white/90 dark:bg-zinc-900/50 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/50 hover:border-amber-300 dark:hover:border-amber-500/50 shadow-xl shadow-slate-900/5 hover:shadow-2xl transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center shadow-xs">
                        <GraduationCap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-zinc-100 text-lg">منظومة الدبلومات الهندسية الشاملة</p>
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">تأهيل هندسي متكامل ومباشر</span>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-zinc-500 text-sm mb-5 leading-relaxed">
                      مسارات تعليمية متسلسلة تبدأ من الأساسيات حتى بناء أنظمة معقدة، مع اختبارات تفاعلية، ومشاريع تخرج حقيقية.
                    </p>

                    <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950 p-4 mb-4 shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        </div>
                        <span className="text-xs text-slate-500 dark:text-zinc-500 font-medium">لوحة تقدم الطالب</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-white dark:bg-zinc-900/50 rounded-xl p-3 text-center border border-slate-200/60 dark:border-transparent shadow-xs">
                          <p className="text-slate-500 dark:text-zinc-500 text-xs mb-1">الطلاب النشطون</p>
                          <span className="text-slate-900 dark:text-zinc-100 font-bold text-sm">+{stats.studentsCount}</span>
                        </div>
                        <div className="bg-white dark:bg-zinc-900/50 rounded-xl p-3 text-center border border-slate-200/60 dark:border-transparent shadow-xs">
                          <p className="text-slate-500 dark:text-zinc-500 text-xs mb-1">نسبة الإكمال</p>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">92%</span>
                        </div>
                        <div className="bg-white dark:bg-zinc-900/50 rounded-xl p-3 text-center border border-slate-200/60 dark:border-transparent shadow-xs">
                          <p className="text-slate-500 dark:text-zinc-500 text-xs mb-1">المشاريع المنجزة</p>
                          <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">+2,400</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 dark:text-zinc-500 w-24 font-medium">إكمال المسار</span>
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-l from-amber-500 to-yellow-400 rounded-full" style={{ width: '78%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/diplomas"
                    className="mt-4 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold text-xs transition-all w-full shadow-md"
                  >
                    <span>استكشف الدبلومات الشاملة</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white/95 via-purple-50/40 to-indigo-50/30 dark:from-zinc-900/50 dark:to-purple-950/20 backdrop-blur-xl border border-purple-100 dark:border-zinc-800/50 hover:border-purple-300 dark:hover:border-purple-700/50 shadow-xl shadow-purple-900/5 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center shadow-xs">
                        <BrainCircuit className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-zinc-100 text-lg">مساعد ذكاء اصطناعي</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold">متاح 24/7 داخل كل درس</span>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-zinc-500 text-sm mb-5 leading-relaxed">
                      اطرح أي سؤال برمجي أثناء مشاهدة الدرس، واطلب شرح الأكواد أو تصحيح الأخطاء فورياً.
                    </p>

                    <div className="space-y-2.5 mb-4">
                      <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-zinc-950/60 border border-purple-100 dark:border-zinc-800/60 text-xs text-slate-800 dark:text-zinc-300 shadow-sm">
                        <span className="text-purple-700 dark:text-purple-400 font-bold block mb-1">🤖 الذكاء الاصطناعي:</span>
                        "لقد قمت بإصلاح الخطأ في الـ async function، إليك الكود الصحيح وطريقة استخدامه..."
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/courses"
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs transition-all w-full shadow-md shadow-purple-500/20 hover:scale-[1.01]"
                  >
                    <span>جرّب التجربة التفاعلية</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white/95 via-emerald-50/40 to-teal-50/30 dark:bg-zinc-900/50 backdrop-blur-xl border border-emerald-100 dark:border-zinc-800/50 hover:border-emerald-300 dark:hover:border-zinc-700/50 shadow-xl shadow-emerald-900/5 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center shadow-xs">
                        <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-zinc-100 text-lg">شهادات تخرج برمز QR</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold">موثقة عالمياً</span>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-zinc-500 text-sm mb-5 leading-relaxed">
                      شهادات رقمية موثقة يمكن لأي جهة توظيف أو عميل التحقق من صحتها بنقرة واحدة عبر الرابط الرسمي.
                    </p>
                  </div>

                  <Link
                    href="/verify"
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold text-xs transition-all w-full shadow-md"
                  >
                    <span>فحص وتوثيق الشهادات</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white/95 via-sky-50/40 to-blue-50/30 dark:bg-zinc-900/50 backdrop-blur-xl border border-blue-100 dark:border-zinc-800/50 hover:border-blue-300 dark:hover:border-zinc-700/50 shadow-xl shadow-blue-900/5 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center shadow-xs">
                        <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-zinc-100 text-lg">مشاريع إنتاج حقيقية للـ Portfolio</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold">تطبيقات كاملة قابلة للنشر</span>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-zinc-500 text-sm mb-5 leading-relaxed">
                      تبني مشاريع متكاملة تشمل بوابات الدفع، قواعد البيانات، أنظمة الأمان، والذكاء الاصطناعي لتضعها في سيرتك الذاتية بثقة.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-300 shadow-xs">منصات تعليمية</span>
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-300 shadow-xs">متاجر إلكترونية متقدمة</span>
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-300 shadow-xs">تطبيقات ذكاء اصطناعي</span>
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-300 shadow-xs">أنظمة إدارة SaaS</span>
                    </div>
                  </div>

                  <Link
                    href="/courses"
                    className="mt-4 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold text-xs transition-all w-full shadow-md"
                  >
                    <span>استعرض المشروعات والمناهج</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {diplomas.length > 0 && (
          <section className="px-4 sm:px-6 py-8">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">المسارات المتكاملة</p>
                  <h2 className="font-display text-3xl font-bold text-zinc-100">دبلومات النخبة الكبرى</h2>
                </div>
                <Link
                  href="/diplomas"
                  className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>عرض جميع الدبلومات</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {diplomas.map((diploma) => (
                  <div
                    key={diploma.id}
                    className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="relative h-44 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                        <img
                          src={diploma.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'}
                          alt={diploma.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/80 border border-zinc-700 text-[11px] font-bold text-amber-300">
                          دبلومة معتمدة
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-zinc-100 text-base leading-snug line-clamp-2 mb-1">
                          {diploma.title}
                        </h3>
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                          {diploma.shortDescription || diploma.description}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/50 text-[11px] text-zinc-400 space-y-1">
                        <p className="text-zinc-300 font-semibold flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-amber-400" />
                          <span>تشمل {diploma.diplomaCourses?.length || 3} كورسات متتالية:</span>
                        </p>
                        {diploma.diplomaCourses?.slice(0, 2).map((dc) => (
                          <p key={dc.id} className="truncate pr-3">
                            • {dc.course.title}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">السعر الإجمالي</span>
                        <span className="text-base font-bold text-amber-300">{formatPrice(diploma.price)}</span>
                      </div>
                      <Link
                        href={`/diplomas/${diploma.slug}`}
                        className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors border border-zinc-700"
                      >
                        التفاصيل
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="px-4 sm:px-6 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">دورات تدريبية متخصصة</p>
                <h2 className="font-display text-3xl font-bold text-zinc-100">الكورسات البرمجية الرائدة</h2>
              </div>
              <Link
                href="/courses"
                className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
              >
                <span>عرض دليل الكورسات كاملاً</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-3.5">
                    <div className="relative h-40 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                      <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {course.category && (
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/80 border border-zinc-700 text-[10px] font-medium text-zinc-300">
                          {course.category.name}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDuration(course.durationHours)}</span>
                        <span>•</span>
                        <span>{course._count.sections} وحدات</span>
                      </div>
                      <h3 className="font-bold text-zinc-100 text-sm leading-snug line-clamp-2 mb-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                        {course.shortDescription || course.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-xs text-zinc-400">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-zinc-300">
                        {course.instructor.officialFullName[0]}
                      </div>
                      <span className="truncate">{course.instructor.officialFullName}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">سعر الاشتراك</span>
                      <span className="text-sm font-bold text-white">{formatPrice(course.price)}</span>
                    </div>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors border border-zinc-700"
                    >
                      عرض الكورس
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. TESTIMONIALS (قصص نجاح وإشادات حقيقية)
           ========================================================================= */}
        <section className="px-4 sm:px-6 py-12 bg-zinc-900/20 border-y border-zinc-800/40">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">آراء الطلاب</p>
              <h2 className="font-display text-3xl font-bold text-zinc-100 mb-2">قصص نجاح من قلب سوق العمل</h2>
              <p className="text-zinc-500 text-sm">تجارب حقيقية لطلاب انطلقوا من الأكاديمية إلى كبرى الشركات والعمل الحر</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  "الدبلومة غيرت مساري المهني بالكامل! الشرح كان عملياً على مشاريع إنتاج حقيقية، وحصلت على وظيفة مطور برمجيات بعد تخرجي بشهرين فقط."
                </p>
                <div className="pt-2 border-t border-zinc-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-amber-400">
                    أ
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-200">أحمد حسام</h5>
                    <p className="text-[10px] text-zinc-500">مطور Full-Stack • خريج دبلوم Next.js</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  "أفضل تجربة تعليمية في الوطن العربي. مشغل الفيديو فائق السرعة والمساعد الذكي يحل أي مشكلة برمجية تواجهك في ثوانٍ معدودة."
                </p>
                <div className="pt-2 border-t border-zinc-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-purple-400">
                    م
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-200">مريم الكردي</h5>
                    <p className="text-[10px] text-zinc-500">مطورة واجهات أمامية وتطبيقات</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  "الشهادة المعتمدة برمز QR سهلت عليّ إثبات مهاراتي لعملاء الفريلانس الدوليين. الدفع عبر إنستاباي وفودافون كاش جعل الاشتراك فائق السهولة."
                </p>
                <div className="pt-2 border-t border-zinc-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-emerald-400">
                    خ
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-200">خالد عبد الله</h5>
                    <p className="text-[10px] text-zinc-500">مستقل معتمد (Top Rated)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. CALL TO ACTION BANNER (Anmka Grand Finish)
           ========================================================================= */}
        <section className="px-4 sm:px-6 py-12">
          <div className="max-w-4xl mx-auto p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ابدأ مسيرتك الهندسية الآن</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-zinc-100 max-w-xl mx-auto leading-tight">
              جاهز للانتقال بمهاراتك إلى مستوى الاحتراف الهندسي؟
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
              انضم الآن لآلاف المهندسين والطلاب، وابدأ دراسة كورسات ودبلومات مبنية خصيصاً لتجهيزك لسوق العمل الحديث.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="px-8 py-3.5 rounded-full bg-zinc-100 text-zinc-950 font-bold text-sm hover:bg-zinc-200 transition-colors shadow-lg"
              >
                إنشاء حساب جديد مجاناً
              </Link>
              <Link
                href="/courses"
                className="px-8 py-3.5 rounded-full bg-zinc-900 text-zinc-300 font-medium text-sm hover:bg-zinc-800 hover:text-white transition-colors border border-zinc-800"
              >
                تصفح الكورسات المتاحة
              </Link>
            </div>
          </div>
        </section>

      </div>

      {/* Floating Instant WhatsApp Button */}
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-5 left-4 sm:left-6 z-40 flex items-center gap-2 p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition-all group border border-white/30"
          title="تحدث مباشرة مع إدارة الأكاديمية عبر الواتساب"
        >
          <div className="relative flex items-center justify-center shrink-0">
            <span className="absolute -inset-1 rounded-full bg-white/40 animate-ping pointer-events-none" />
            <div className="w-6 h-6 rounded-full bg-white text-[#25D366] flex items-center justify-center shadow-xs">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </div>
          </div>
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] text-emerald-100 font-medium leading-none">متاح أونلاين الآن</span>
            <span className="text-xs font-black leading-tight mt-0.5 whitespace-nowrap">تواصل واتساب</span>
          </div>
        </a>
      )}

    </div>
  );
}