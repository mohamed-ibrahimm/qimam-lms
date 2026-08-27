import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice, formatDuration } from '@/lib/utils';

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
  Laptop
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
        prisma.user.count({ where: { role: 'STUDENT' } }).catch(() => 1500),
        prisma.course.count({ where: { status: 'PUBLISHED' } }).catch(() => 24),
        prisma.diploma.count({ where: { status: 'PUBLISHED' } }).catch(() => 6),
        prisma.certificate.count().catch(() => 850),
      ]).then(([s, c, d, cert]) => ({
        studentsCount: s,
        coursesCount: c,
        diplomasCount: d,
        certificatesCount: cert,
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

  // Social & Quick Contact URL computations
  const rawWhatsapp = settings.WHATSAPP_NUMBER ? settings.WHATSAPP_NUMBER.replace(/[^0-9]/g, '') : '';
  const formattedWhatsapp = rawWhatsapp ? (rawWhatsapp.startsWith('0') ? '2' + rawWhatsapp : rawWhatsapp) : '';
  const whatsappUrl = formattedWhatsapp ? `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن تفاصيل الكورسات والدبلومات')}` : null;
  const contactEmail = settings.CONTACT_EMAIL || null;
  const facebookUrl = settings.FACEBOOK_URL || null;
  const telegramUrl = settings.TELEGRAM_URL || null;
  const youtubeUrl = settings.YOUTUBE_URL || null;
  const linkedinUrl = settings.LINKEDIN_URL || null;
  const hasAnySocial = Boolean(whatsappUrl || contactEmail || facebookUrl || telegramUrl || youtubeUrl || linkedinUrl);

  return (
    <div className="relative overflow-hidden pb-24 bg-zinc-950 text-zinc-100">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/[0.04] rounded-full blur-[140px]" />
        <div className="absolute top-2/3 right-0 w-[500px] h-[500px] bg-purple-600/[0.04] blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 space-y-20 md:space-y-28">

        <section className="pt-6 pb-8 md:pt-14 md:pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-950/40 via-zinc-900/80 to-amber-950/40 border border-amber-500/40 mb-8 shadow-sm">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs text-amber-300 font-bold">جديد!</span>
              </div>
              <div className="h-4 w-px bg-amber-500/40" />
              <a href="#trending-diploma" className="flex items-center gap-2 group text-xs text-zinc-300 hover:text-amber-300 transition-colors">
                <span>خصم استثنائي 51% على الدبلومة الأكثر طلباً</span>
                <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-1 transition-transform" />
              </a>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              <span className="text-zinc-100 block mb-2">نحول شغفك البرمجي</span>
              <span className="bg-gradient-to-r from-zinc-400 via-zinc-100 to-amber-300 bg-clip-text text-transparent">
                إلى مسيرة مهنية هندسية متكاملة
              </span>
            </h1>

            <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
              أكاديمية المهندس محمد إبراهيم — نقدم مسارات تدريبية هندسية متكاملة، دبلومات برمجية شاملة، مشاريع إنتاج واقعية مطابقة لسوق العمل، ومساعد ذكاء اصطناعي تفاعلي يرافقك خطوة بخطوة.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#trending-diploma" className="shimmer-border-wrapper group">
                <div className="shimmer-beam-gold" />
                <div className="shimmer-button-content px-8 py-3.5 text-sm font-bold text-amber-300 group-hover:text-amber-200">
                  <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>الدبلومة الأكثر طلباً (خصم 51%)</span>
                  <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1.5 transition-transform duration-300" />
                </div>
              </a>

              <Link
                href="/courses"
                className="group flex items-center gap-2 px-7 py-3.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors rounded-full border border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
              >
                <Sparkles className="w-4 h-4 text-zinc-400 group-hover:text-amber-300 transition-colors" />
                <span>تصفح دليل الكورسات</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {hasAnySocial && (
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-8 pb-1">
                <span className="text-xs text-zinc-500 font-medium ml-1">تواصل مباشر وسريع:</span>
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all hover:scale-105"
                    title="محادثة واتساب مباشرة"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>واتساب</span>
                  </a>
                )}
                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold transition-all hover:scale-105"
                    title="مراسلة عبر الجيميل"
                  >
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span>جيميل</span>
                  </a>
                )}
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all hover:scale-105"
                    title="صفحة الفيسبوك"
                  >
                    <Facebook className="w-3.5 h-3.5 text-blue-400" />
                    <span>فيسبوك</span>
                  </a>
                )}
                {telegramUrl && (
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold transition-all hover:scale-105"
                    title="قناة التليجرام"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>تليجرام</span>
                  </a>
                )}
                {youtubeUrl && (
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold transition-all hover:scale-105"
                    title="قناة اليوتيوب"
                  >
                    <Youtube className="w-3.5 h-3.5 text-red-400" />
                    <span>يوتيوب</span>
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all hover:scale-105"
                    title="لينكد إن"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>لينكد إن</span>
                  </a>
                )}
              </div>
            )}

            <div className="mt-10 flex flex-col items-center">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-500 pt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span>مصر — القاهرة & أونلاين بالعالم العربي</span>
                </div>
                <div className="h-4 w-px bg-zinc-800 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-300">إشراف م. محمد إبراهيم</span>
                </div>
                <div className="h-4 w-px bg-zinc-800 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">شهادات تخرج رقمية معتمدة برمز QR</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section className="px-4 sm:px-6 py-20 bg-zinc-900/20 border-y border-zinc-800/40">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">إنجازات الأكاديمية</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-100 mb-3">أرقام تتحدث عن نفسها</h2>
              <p className="text-zinc-500 max-w-lg mx-auto text-sm">نفخر بثقة طلابنا وخريجينا في مصر والوطن العربي ونسعى دائماً لتقديم أفضل تجربة تدريب هندسي</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-900/80 transition-all duration-300 group text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <p className="font-display text-3xl md:text-4xl font-bold text-zinc-100 mb-1 group-hover:text-amber-300 transition-colors">+{stats.studentsCount}</p>
                  <p className="text-sm font-medium text-zinc-400 mb-1">طالب وخريج</p>
                  <p className="text-xs text-zinc-600">في مصر والعالم العربي</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-900/80 transition-all duration-300 group text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <p className="font-display text-3xl md:text-4xl font-bold text-zinc-100 mb-1 group-hover:text-amber-300 transition-colors">+{stats.coursesCount}</p>
                  <p className="text-sm font-medium text-zinc-400 mb-1">كورس هندسي</p>
                  <p className="text-xs text-zinc-600">محدثة ومبنية لسوق العمل</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-900/80 transition-all duration-300 group text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <p className="font-display text-3xl md:text-4xl font-bold text-zinc-100 mb-1 group-hover:text-amber-300 transition-colors">+{stats.diplomasCount}</p>
                  <p className="text-sm font-medium text-zinc-400 mb-1">دبلومات مهنية</p>
                  <p className="text-xs text-zinc-600">تأهيل وظيفي شامل</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-900/80 transition-all duration-300 group text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <p className="font-display text-3xl md:text-4xl font-bold text-emerald-400 mb-1 group-hover:text-emerald-300 transition-colors">94%</p>
                  <p className="text-sm font-medium text-zinc-400 mb-1">نسبة التوظيف</p>
                  <p className="text-xs text-zinc-600">في الشركات والعمل الحر</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {trendingDiploma && (
          <section id="trending-diploma" className="px-4 sm:px-6 py-8 relative overflow-hidden scroll-mt-24">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]" />
            </div>

            <div className="max-w-5xl mx-auto relative">
              <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-zinc-900/80 to-zinc-950 overflow-hidden shadow-2xl p-8 md:p-12">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>الدبلومة الهندسية الأكثر طلباً ومبيعاً لعام 2026 (TRENDING #1)</span>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-5">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-100 leading-tight">
                      {trendingDiploma.title}
                      <span className="block mt-1 bg-gradient-to-l from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                        خصم استثنائي 51% لفترة محدودة
                      </span>
                    </h2>
                    <p className="text-zinc-400 leading-relaxed text-sm max-w-lg">
                      {trendingDiploma.shortDescription || trendingDiploma.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/60 text-zinc-400 text-xs">
                        <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center">1</span>
                        12 مشروع إنتاج واقعي
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/60 text-zinc-400 text-xs">
                        <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center">2</span>
                        مشغل آمن بعلامة مائية
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/60 text-zinc-400 text-xs">
                        <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center">3</span>
                        شهادة معتمدة بـ QR
                      </span>
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-6">
                      <div>
                        <span className="text-[11px] text-zinc-500 block">سعر الاشتراك بالخصم الحصري:</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-amber-300">{formatPrice(trendingDiploma.price)}</span>
                          {trendingDiploma.compareAtPrice && (
                            <span className="text-sm text-zinc-500 line-through">
                              {formatPrice(trendingDiploma.compareAtPrice)}
                            </span>
                          )}
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            وفر 51%
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/diplomas/${trendingDiploma.slug}`}
                        className="shimmer-border-wrapper group"
                      >
                        <div className="shimmer-beam-gold" />
                        <div className="shimmer-button-content px-8 py-3.5 text-sm font-bold text-amber-300 group-hover:text-amber-200">
                          <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                          <span>سجل الآن في الدبلومة الأكثر طلباً</span>
                          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1.5 transition-transform" />
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 relative">
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-zinc-900 border border-zinc-800 shadow-2xl group">
                      <img
                        src={trendingDiploma.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'}
                        alt={trendingDiploma.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-zinc-900/90 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <PlayCircle className="w-7 h-7" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs">
                        <span className="px-2.5 py-1 rounded bg-black/80 border border-amber-500/30 text-amber-300 font-bold">
                          {trendingDiploma.diplomaCourses?.length || 4} كورسات مدمجة
                        </span>
                        <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold">
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

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-3">
                <div className="p-6 md:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-amber-400" />
                      </div>
                      <p className="font-semibold text-zinc-100">منظومة الدبلومات الهندسية الشاملة</p>
                    </div>
                    <p className="text-zinc-500 text-sm mb-5">
                      مسارات تعليمية متسلسلة تبدأ من الأساسيات حتى بناء أنظمة معقدة، مع اختبارات تفاعلية، ومشاريع تخرج حقيقية.
                    </p>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-xs text-zinc-500">لوحة تقدم الطالب</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-zinc-900/50 rounded-lg p-2.5 text-center">
                          <p className="text-zinc-500 text-xs mb-1">الطلاب النشطون</p>
                          <span className="text-zinc-100 font-semibold text-sm">+{stats.studentsCount}</span>
                        </div>
                        <div className="bg-zinc-900/50 rounded-lg p-2.5 text-center">
                          <p className="text-zinc-500 text-xs mb-1">نسبة الإكمال</p>
                          <span className="text-emerald-400 font-semibold text-sm">92%</span>
                        </div>
                        <div className="bg-zinc-900/50 rounded-lg p-2.5 text-center">
                          <p className="text-zinc-500 text-xs mb-1">المشاريع المنجزة</p>
                          <span className="text-amber-400 font-semibold text-sm">+2,400</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500 w-24">إكمال المسار</span>
                          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-l from-amber-500 to-yellow-400 rounded-full" style={{ width: '78%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/diplomas"
                    className="mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors w-full border border-zinc-700"
                  >
                    <span>استكشف الدبلومات الشاملة</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-zinc-900/50 to-purple-950/20 border border-zinc-800/50 hover:border-purple-700/50 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center">
                        <BrainCircuit className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-100">مساعد ذكاء اصطناعي</p>
                        <span className="text-[10px] text-purple-400">متاح 24/7 داخل كل درس</span>
                      </div>
                    </div>
                    <p className="text-zinc-500 text-sm mb-5">
                      اطرح أي سؤال برمجي أثناء مشاهدة الدرس، واطلب شرح الأكواد أو تصحيح الأخطاء فورياً.
                    </p>

                    <div className="space-y-2.5 mb-4">
                      <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-xs text-zinc-300">
                        <span className="text-purple-400 font-bold block mb-1">🤖 الذكاء الاصطناعي:</span>
                        "لقد قمت بإصلاح الخطأ في الـ async function، إليك الكود الصحيح وطريقة استخدامه..."
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/courses"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-medium text-xs transition-colors w-full"
                  >
                    <span>جرّب التجربة التفاعلية</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="p-6 md:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      </div>
                      <p className="font-semibold text-zinc-100">شهادات تخرج برمز QR</p>
                    </div>
                    <p className="text-zinc-500 text-sm mb-5">
                      شهادات رقمية موثقة يمكن لأي جهة توظيف أو عميل التحقق من صحتها بنقرة واحدة عبر الرابط الرسمي.
                    </p>
                  </div>

                  <Link
                    href="/verify"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors w-full border border-zinc-700"
                  >
                    <span>فحص وتوثيق الشهادات</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="p-6 md:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-900/30 border border-blue-500/30 flex items-center justify-center">
                        <Code2 className="w-5 h-5 text-blue-400" />
                      </div>
                      <p className="font-semibold text-zinc-100">مشاريع إنتاج حقيقية للـ Portfolio</p>
                    </div>
                    <p className="text-zinc-500 text-sm mb-5">
                      تبني مشاريع متكاملة تشمل بوابات الدفع، قواعد البيانات، أنظمة الأمان، والذكاء الاصطناعي لتضعها في سيرتك الذاتية بثقة.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-xs bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">منصات تعليمية</span>
                      <span className="px-3 py-1 rounded-full text-xs bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">متاجر إلكترونية متقدمة</span>
                      <span className="px-3 py-1 rounded-full text-xs bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">تطبيقات ذكاء اصطناعي</span>
                      <span className="px-3 py-1 rounded-full text-xs bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">أنظمة إدارة SaaS</span>
                    </div>
                  </div>

                  <Link
                    href="/courses"
                    className="mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors w-full border border-zinc-700"
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
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xl border border-emerald-400/50 hover:scale-105 transition-all group"
          title="تحدث مباشرة مع الإدارة عبر الواتساب"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <MessageCircle className="w-4 h-4 text-white -mr-1" />
          <span className="hidden sm:inline">واتساب مباشر</span>
        </a>
      )}

    </div>
  );
}