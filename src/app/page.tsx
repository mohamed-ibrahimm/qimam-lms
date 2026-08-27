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
  Linkedin
} from 'lucide-react';

async function getHomeData() {
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
    }),
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
    }),
    prisma.category.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: { select: { courses: true, diplomas: true } },
      }
    }),
    {
      studentsCount: await prisma.user.count({ where: { role: 'STUDENT' } }),
      coursesCount: await prisma.course.count({ where: { status: 'PUBLISHED' } }),
      diplomasCount: await prisma.diploma.count({ where: { status: 'PUBLISHED' } }),
      certificatesCount: await prisma.certificate.count(),
    },
    prisma.platformSetting.findMany(),
  ]);

  const settings = Object.fromEntries(settingsRecords.map((s) => [s.key, s.value]));

  return { courses, diplomas, categories, stats, settings };
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
    <div className="relative overflow-hidden pb-24">
      {/* Background Smooth Diffused Glow with Liquid Gold and Sapphire */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-gradient-to-tr from-amber-500/15 via-blue-600/15 to-amber-500/10 blur-[150px] rounded-full animate-ambient-drift" />
        <div className="absolute top-[450px] right-0 w-[500px] h-[500px] bg-amber-500/[0.08] blur-[160px] rounded-full animate-float-gentle" />
        <div className="absolute top-[1200px] left-0 w-[550px] h-[550px] bg-blue-600/[0.08] blur-[160px] rounded-full animate-float-reverse" />
      </div>

      {/* Main Content Sections Stack (Clean Spacing, No Dead Gaps) */}
      <div className="relative z-10 space-y-16 md:space-y-24">

        {/* =========================================================================
            1. HERO SECTION (Majestic Centered Gold & Royal Sapphire Masterpiece)
           ========================================================================= */}
        <section className="pt-4 pb-8 md:pt-8 md:pb-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
            
            {/* Live Status Pill with Golden Pulsing Glow */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-lg shadow-amber-950/30 animate-gold-glow">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>الدفعة الهندسية الذهبية 2026 متاحة الآن • انضم لأكثر من 18,500 طالب ومطور</span>
            </div>

            {/* Monumental Headline with Shimmering Liquid Gold */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-extrabold tracking-normal text-white leading-[1.36] md:leading-[1.3] text-balance">
                احترف هندسة البرمجيات والذكاء الاصطناعي <br />
                <span className="text-gold-luxury font-black">بأعلى المعايير العالمية</span>
                <span className="block mt-2 text-slate-100 text-2xl sm:text-4xl lg:text-[38px] font-bold">وابنِ مسارك المهني الحقيقي</span>
              </h1>
              <p className="text-sm sm:text-lg text-slate-300 leading-[1.85] max-w-2xl mx-auto">
                منصة تدريبية هندسية متكاملة تنقلك من البدايات إلى سوق العمل والشركات الكبرى من خلال مشروعات إنتاج فعلية، مشغل فيديو آمن فائق السرعة، ومساعد ذكاء اصطناعي تفاعلي يرافقك في كل سطر كود.
              </p>
            </div>

            {/* Centered Micro Value Props Chips with Gold Accents */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-amber-400/20 hover:border-amber-400/40 transition-colors shadow-sm">
                <CheckCircle className="w-4 h-4 text-amber-400" />
                <span>مشاريع عملية 100% لسوق العمل</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-blue-400/20 hover:border-blue-400/40 transition-colors shadow-sm">
                <Award className="w-4 h-4 text-blue-400" />
                <span>شهادات معتمدة مع كود QR فوري</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-amber-400/20 hover:border-amber-400/40 transition-colors shadow-sm">
                <BrainCircuit className="w-4 h-4 text-amber-400" />
                <span>مساعد ذكي ومتابعة برمجية مستمرة</span>
              </div>
            </div>

            {/* Quick Reach & Social Contact Row (Only shows enabled channels from Admin Settings) */}
            {hasAnySocial && (
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 pb-1">
                <span className="text-xs text-slate-400 font-semibold ml-1">تواصل مباشر وسريع:</span>
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all hover:scale-105 shadow-sm group"
                    title="محادثة واتساب مباشرة"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20 group-hover:scale-110 transition-transform" />
                    <span>واتساب</span>
                  </a>
                )}
                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] text-xs font-bold transition-all hover:scale-105 shadow-sm group"
                    title="مراسلة عبر الجيميل"
                  >
                    <Mail className="w-4 h-4 text-slate-300 group-hover:scale-110 transition-transform" />
                    <span>جيميل</span>
                  </a>
                )}
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all hover:scale-105 shadow-sm group"
                    title="صفحة الفيسبوك"
                  >
                    <Facebook className="w-4 h-4 text-blue-400 fill-blue-400/20 group-hover:scale-110 transition-transform" />
                    <span>فيسبوك</span>
                  </a>
                )}
                {telegramUrl && (
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold transition-all hover:scale-105 shadow-sm group"
                    title="قناة التليجرام"
                  >
                    <Send className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                    <span>تليجرام</span>
                  </a>
                )}
                {youtubeUrl && (
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold transition-all hover:scale-105 shadow-sm group"
                    title="قناة اليوتيوب"
                  >
                    <Youtube className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                    <span>يوتيوب</span>
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all hover:scale-105 shadow-md shadow-indigo-950/30 group"
                    title="لينكد إن"
                  >
                    <Linkedin className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span>لينكد إن</span>
                  </a>
                )}
              </div>
            )}

            {/* Centered Action Buttons (Browse Courses: Purple, Trending Diploma: Imperial Gold) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/courses"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-black text-sm shadow-xl shadow-purple-950/60 hover:scale-[1.03] transition-all flex items-center justify-center gap-2.5 border border-purple-400/40 group"
              >
                <BookOpen className="w-4 h-4 text-purple-200 group-hover:scale-110 transition-transform" />
                <span>تصفح الكورسات والدبلومات</span>
              </Link>

              <a
                href="#trending-diploma"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-stone-950 font-black text-sm shadow-xl shadow-amber-950/60 hover:scale-[1.03] transition-all flex items-center justify-center gap-2.5 border border-yellow-200/70 animate-gold-glow group"
              >
                <Flame className="w-4 h-4 text-stone-950 animate-bounce" />
                <span>الدبلومة الأكثر طلباً (خصم 51%)</span>
              </a>

              <Link
                href="/verify"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/[0.03] hover:bg-purple-500/15 hover:border-purple-400/40 text-slate-200 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 border border-white/[0.08]"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>التحقق من الشهادات</span>
              </Link>
            </div>

            {/* Centered Social Proof */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-white/[0.08] max-w-xl mx-auto">
              <div className="flex items-center -space-x-3 space-x-reverse">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                  alt="Student"
                  className="w-9 h-9 rounded-full border-2 border-zinc-950 object-cover ring-2 ring-indigo-500/50"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                  alt="Student"
                  className="w-9 h-9 rounded-full border-2 border-zinc-950 object-cover ring-2 ring-cyan-500/50"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
                  alt="Student"
                  className="w-9 h-9 rounded-full border-2 border-zinc-950 object-cover ring-2 ring-purple-500/50"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
                  alt="Student"
                  className="w-9 h-9 rounded-full border-2 border-zinc-950 object-cover ring-2 ring-emerald-500/50"
                />
              </div>
              <div className="text-center sm:text-right">
                <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-bold text-white mr-1">4.98 / 5</span>
                  <span className="text-[11px] text-zinc-400">(من +5,200 مراجعة معتمدة)</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  خريجونا يعملون في كبرى الشركات التقنية ومنصات العمل الحر العالمية
                </p>
              </div>
            </div>

            {/* Key Metrics Counter Strip (Minimalist, Seamless & Clean) */}
            <div className="pt-6 max-w-3xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 rounded-2xl bg-white/[0.02] border border-amber-400/20 shadow-lg shadow-amber-950/20 backdrop-blur-sm">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-amber-400">+{stats.studentsCount > 0 ? stats.studentsCount : '1,500'}</span>
                  <p className="text-xs text-slate-400 mt-1">طالب وخريج معتمد</p>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-blue-400">+{stats.coursesCount > 0 ? stats.coursesCount : '24'}</span>
                  <p className="text-xs text-slate-400 mt-1">كورس هندسي متخصص</p>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-yellow-300">+{stats.diplomasCount > 0 ? stats.diplomasCount : '6'}</span>
                  <p className="text-xs text-slate-400 mt-1">دبلومات مهنية شاملة</p>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400">94%</span>
                  <p className="text-xs text-slate-400 mt-1">نسبة التوظيف بسوق العمل</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            DYNAMIC LIVE RUNNING TICKER (شريط متحرك ديناميكي حي فخم)
           ========================================================================= */}
        <div className="w-full overflow-hidden py-3 bg-gradient-to-r from-amber-500/10 via-blue-500/5 to-amber-500/10 border-y border-amber-400/25 backdrop-blur-md relative">
          <div className="animate-marquee-scroll flex items-center gap-10 whitespace-nowrap text-xs font-bold text-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-amber-300">⚡ الدفعة الهندسية الذهبية لعام 2026 مفتوحة الآن</span>
            </div>
            <span className="text-amber-500/50">✦</span>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              <span>شهادات رقمية معتمدة قابلة للتحقق الفوري عبر رمز QR</span>
            </div>
            <span className="text-amber-500/50">✦</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">94% نسبة توظيف الخريجين في سوق العمل والشركات الكبرى</span>
            </div>
            <span className="text-amber-500/50">✦</span>
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-amber-400" />
              <span>مساعد ذكاء اصطناعي ومتابعة كود تفاعلية على مدار الساعة</span>
            </div>
            <span className="text-amber-500/50">✦</span>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span className="text-amber-300">خصم استثنائي 51% على الدبلومة الأكثر طلباً</span>
            </div>
            <span className="text-amber-500/50">✦</span>
            {/* Seamless repetition for infinite loop */}
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-amber-300">⚡ الدفعة الهندسية الذهبية لعام 2026 مفتوحة الآن</span>
            </div>
            <span className="text-amber-500/50">✦</span>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              <span>شهادات رقمية معتمدة قابلة للتحقق الفوري عبر رمز QR</span>
            </div>
            <span className="text-amber-500/50">✦</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">94% نسبة توظيف الخريجين في سوق العمل والشركات الكبرى</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. TRENDING BESTSELLER SPOTLIGHT (الدبلومة الأكثر مبيعاً والأعلى طلباً)
           ========================================================================= */}
        {trendingDiploma && (
          <section id="trending-diploma" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
            <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-r from-amber-400 via-purple-600 to-amber-400 shadow-2xl shadow-purple-950/40 animate-gold-glow">
              <div className="rounded-[23px] bg-[#0e0c18] p-6 sm:p-10 border border-white/[0.08] relative overflow-hidden">
                
                {/* Header Pill */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/[0.08] pb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-md shadow-amber-950/30">
                    <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                    <span>الدبلومة الأكثر مبيعاً والأعلى طلباً لعام 2026 (TRENDING #1)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-bold bg-amber-500/15 border border-amber-400/30 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>خصم استثنائي 51% متاح لـ 5 مقاعد فقط</span>
                  </div>
                </div>

                {/* Main Diploma Spotlight Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Visual / Thumbnail with Play Badge (5 cols) */}
                  <div className="lg:col-span-5 relative">
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-zinc-900 border border-purple-500/40 shadow-xl group">
                      <img
                        src={trendingDiploma.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'}
                        alt={trendingDiploma.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Play trailer overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-stone-950 flex items-center justify-center shadow-xl shadow-amber-950/70 group-hover:scale-110 transition-transform">
                          <PlayCircle className="w-8 h-8 fill-stone-950 text-amber-400" />
                        </div>
                      </div>

                      <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-white">
                        <span className="px-2 py-0.5 rounded bg-black/80 border border-amber-400/30 text-amber-300 font-bold flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>مسار معتمد بالكامل</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-purple-950/90 border border-purple-500/50 text-purple-300 font-bold">
                          {trendingDiploma.diplomaCourses.length} كورسات مدمجة
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details and Features (7 cols) */}
                  <div className="lg:col-span-7 space-y-5 text-right">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center text-amber-400 text-xs">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <Star className="w-4 h-4 fill-amber-400" />
                          <Star className="w-4 h-4 fill-amber-400" />
                          <Star className="w-4 h-4 fill-amber-400" />
                          <Star className="w-4 h-4 fill-amber-400" />
                        </div>
                        <span className="text-xs font-bold text-amber-300">4.99 / 5</span>
                        <span className="text-xs text-zinc-400">(850+ طالب خريج معتمد)</span>
                      </div>
                      <h3 className="text-xl sm:text-3xl font-black text-white leading-snug">
                        {trendingDiploma.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                        {trendingDiploma.shortDescription || trendingDiploma.description}
                      </p>
                    </div>

                    {/* Bullet Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>12 مشروع إنتاج واقعي متكامل لسوق العمل</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>مشغل آمن مع حماية العلامة المائية ضد التسريب</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>مساعد ذكاء اصطناعي فوري للمراجعة في كل درس</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>شهادة تخرج رقمية معتمدة دولياً برمز QR</span>
                      </div>
                    </div>

                    {/* Price & Purchase CTA */}
                    <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] text-zinc-400 block">سعر الاشتراك بالخصم الحصري:</span>
                        <div className="flex items-baseline gap-3">
                          <span className="text-2xl sm:text-3xl font-black text-amber-400">
                            {formatPrice(trendingDiploma.price)}
                          </span>
                          {trendingDiploma.compareAtPrice && (
                            <span className="text-sm text-zinc-500 line-through">
                              {formatPrice(trendingDiploma.compareAtPrice)}
                            </span>
                          )}
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            وفر 51%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/diplomas/${trendingDiploma.slug}`}
                          className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-stone-950 font-black text-sm transition-all shadow-xl shadow-amber-950/60 hover:scale-105 flex items-center gap-2 border border-yellow-200/70 animate-gold-glow"
                        >
                          <Flame className="w-4 h-4 text-stone-950 animate-bounce" />
                          <span>سجل الآن في الدبلومة الأكثر مبيعاً</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            3. THE 4-STEP ROADMAP (مسار التعلم الأسطوري المبتكر)
           ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-[#0d1020] to-[#070912] border border-white/[0.08] shadow-2xl relative overflow-hidden">
            <div className="text-center space-y-2 mb-10">
              <span className="text-xs font-bold text-cyan-400">منهجية التعليم المتقدمة</span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                مسار التعلم الأسطوري في الأكاديمية
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
                خطة مدروسة مصممة لنقلك خطوة بخطوة من المفاهيم الأساسية إلى احتراف سوق العمل التقني العالمي.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative z-10 text-right">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2.5 hover:border-indigo-500/40 transition-colors">
                <span className="text-3xl font-black text-indigo-400/50">01</span>
                <h4 className="text-base font-bold text-white">التأسيس المعماري</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  فهم عميق للهندسة والأساسيات بدون تعقيد، مع شرح عملي مباشر للكود ونماذج البيانات.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2.5 hover:border-cyan-500/40 transition-colors">
                <span className="text-3xl font-black text-cyan-400/50">02</span>
                <h4 className="text-base font-bold text-white">مشاريع إنتاج واقعية</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  بناء تطبيقات حقيقية تشمل بوابات الدفع، قواعد البيانات المتقدمة، وحماية الأمان.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2.5 hover:border-purple-500/40 transition-colors">
                <span className="text-3xl font-black text-purple-400/50">03</span>
                <h4 className="text-base font-bold text-white">المراجعة والذكاء الاصطناعي</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  تفاعل فوري مع المساعد الذكي والمحاضر في كل درس لحل التحديات وتثبيت المعلومات.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2.5 hover:border-emerald-500/40 transition-colors">
                <span className="text-3xl font-black text-emerald-400/50">04</span>
                <h4 className="text-base font-bold text-white">الاعتماد وسوق العمل</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  اختبار تقييمي شامل، شهادة رقمية موثقة بـ QR، وبناء سيرة ذاتية وبورتفوليو احترافي.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. DIPLOMAS MASTER SHOWCASE (المسارات الهندسية الشاملة)
           ========================================================================= */}
        {diplomas.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0f1426] via-[#0a0d18] to-[#070912] border border-indigo-500/30 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-cyan-300 text-xs font-bold">
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                    <span>المسارات الهندسية الشاملة (Master Diplomas)</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white">
                    دبلومات النخبة الكبرى
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                    حزم تعليمية مكثفة ومرتبة تنقلك من الصفر للاحتراف الكامل مع مشاريع تخرج ضخمة واختبار شامل وشهادة معتمدة.
                  </p>
                </div>
                <Link
                  href="/diplomas"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-950/40 flex items-center gap-2 shrink-0"
                >
                  <span>عرض جميع الدبلومات</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                {diplomas.map((diploma) => (
                  <div
                    key={diploma.id}
                    className="glass-gold-card rounded-2xl p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="relative h-48 rounded-xl overflow-hidden bg-zinc-900 border border-white/[0.06]">
                        <img
                          src={diploma.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'}
                          alt={diploma.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[11px] font-bold flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          <span>دبلومة معتمدة</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
                          {diploma.title}
                        </h3>
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {diploma.shortDescription || diploma.description}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                        <p className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          <span>تشمل {diploma.diplomaCourses.length} كورسات تخصصية مترابطة:</span>
                        </p>
                        <ul className="text-[11px] text-zinc-300 space-y-1.5 pr-2">
                          {diploma.diplomaCourses.slice(0, 3).map((dc) => (
                            <li key={dc.id} className="flex items-center gap-2 truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                              <span className="truncate">{dc.course.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-5 mt-4 border-t border-white/[0.08] flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-zinc-400">سعر الدبلومة الشاملة</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-cyan-300">{formatPrice(diploma.price)}</span>
                          {diploma.compareAtPrice && (
                            <span className="text-xs text-zinc-500 line-through">
                              {formatPrice(diploma.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/diplomas/${diploma.slug}`}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-950/40"
                      >
                        التفاصيل والتسجيل
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            5. FEATURED COURSES SECTION (Luxury Glass Cards)
           ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>دورات تدريبية مكثفة</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">الكورسات البرمجية الرائدة</h2>
            </div>
            <Link
              href="/courses"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
            >
              <span>عرض دليل الكورسات كاملاً</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="glass-luxury-card rounded-2xl p-5 flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="relative h-44 rounded-xl overflow-hidden bg-zinc-900 border border-white/[0.06]">
                    <img
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    {course.category && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-bold text-zinc-200 border border-white/10">
                        {course.category.name}
                      </span>
                    )}
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-indigo-950/90 border border-indigo-500/40 text-cyan-300 text-[10px] font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>4.9</span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span className="flex items-center gap-1 text-zinc-300">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {formatDuration(course.durationHours)}
                      </span>
                      <span>•</span>
                      <span>{course._count.sections} وحدات تعليمية</span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {course.shortDescription || course.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-xs text-zinc-300">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px] shrink-0">
                      <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                        {course.instructor.avatarUrl ? (
                          <img src={course.instructor.avatarUrl} alt={course.instructor.officialFullName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{course.instructor.officialFullName[0]}</span>
                        )}
                      </div>
                    </div>
                    <span className="truncate">{course.instructor.officialFullName}</span>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-zinc-400">سعر الاشتراك</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-black text-white">{formatPrice(course.price)}</span>
                      {course.compareAtPrice && (
                        <span className="text-xs text-zinc-500 line-through">
                          {formatPrice(course.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/courses/${course.slug}`}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-gradient-to-r hover:from-indigo-600 hover:to-cyan-600 hover:text-white text-zinc-200 border border-white/[0.08] hover:border-cyan-400 text-xs font-bold transition-all"
                  >
                    عرض الكورس
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            6. CATEGORIES GRID (Curated Career Tracks)
           ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-cyan-400">مسارات التعلم والتخصص</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">اختر مجالك وابدأ التميز</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/courses?category=${cat.slug}`}
                className="p-5 rounded-2xl glass-luxury-card group space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <p className="text-[11px] font-semibold text-cyan-400/90 pt-1">
                  {cat._count.courses} كورسات • {cat._count.diplomas} دبلومات
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* =========================================================================
            7. HALL OF FAME & GRADUATES (لوحة الشرف وآراء الخريجين)
           ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-bold text-cyan-400">قصص نجاح وإشادات حقيقية</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">خريجون يقودون التحول الرقمي</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-luxury-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                "الدبلومة غيرت مساري المهني بالكامل! الشرح كان معمارياً وعملياً على مشاريع إنتاج حقيقية وليست مجرد أكواد نظرية. حصلت على وظيفة مطور برمجيات بعد تخرجي بشهرين."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                <div className="w-8 h-8 rounded-full bg-indigo-900/80 border border-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                  أ
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">أحمد حسام</h5>
                  <p className="text-[10px] text-zinc-400">مهندس برمجيات • خريج دبلوم Next.js</p>
                </div>
              </div>
            </div>

            <div className="glass-luxury-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                "أفضل تجربة تعليمية رقمية في الوطن العربي بلا منازع. مشغل الفيديو فائق السرعة، ومساعد الذكاء الاصطناعي داخل الدروس كان يجيب عن استفساراتي في ثوانٍ!"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                <div className="w-8 h-8 rounded-full bg-purple-900/80 border border-purple-500 flex items-center justify-center font-bold text-xs text-white">
                  م
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">مريم الكردي</h5>
                  <p className="text-[10px] text-zinc-400">مطور واجهات ومصممة UI/UX</p>
                </div>
              </div>
            </div>

            <div className="glass-luxury-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                "الشهادة الرقمية المعتمدة مع رمز الـ QR سهلت عليّ إثبات مهاراتي لعملاء الفريلانس الدوليين. الدفع عبر إنستاباي وفودافون كاش جعل الاشتراك فائق السهولة."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                <div className="w-8 h-8 rounded-full bg-cyan-900/80 border border-cyan-500 flex items-center justify-center font-bold text-xs text-white">
                  خ
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">خالد عبد الله</h5>
                  <p className="text-[10px] text-zinc-400">مستقل معتمد (Top Rated Freelancer)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. CALL TO ACTION BANNER (Grand Quiet Luxury Finish)
           ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-16 rounded-3xl bg-gradient-to-b from-[#140f25] via-[#0d0a1a] to-[#080710] border border-purple-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-950/60 to-amber-950/40 border border-amber-400/30 text-amber-300 text-xs font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>ابدأ رحلتك الهندسية الآن</span>
            </div>
            <h2 className="text-2xl sm:text-5xl font-black text-white max-w-2xl mx-auto leading-tight">
              جاهز للانتقال بمهاراتك إلى مستوى الاحتراف العالمي؟
            </h2>
            <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              انضم الآن لآلاف المهندسين والطلاب، وابدأ دراسة كورسات ودبلومات مبنية خصيصاً لتجهيزك لسوق العمل الحديث.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-black text-sm transition-all shadow-xl shadow-purple-950/60 hover:scale-105 border border-purple-400/40"
              >
                إنشاء حساب جديد مجاناً
              </Link>
              <Link
                href="/courses"
                className="px-8 py-4 rounded-xl bg-white/[0.03] hover:bg-amber-500/10 hover:border-amber-400/40 text-amber-300 hover:text-white font-bold text-sm transition-all border border-white/[0.08]"
              >
                تصفح الكورسات المتاحة
              </Link>
            </div>
          </div>
        </section>

      </div>

      {/* Floating Instant WhatsApp Button (Shows when WHATSAPP_NUMBER is configured in Admin Settings) */}
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xl shadow-emerald-950/90 border border-emerald-400/50 hover:scale-105 transition-all group"
          title="تحدث مباشرة مع الإدارة عبر الواتساب"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
          <MessageCircle className="w-4 h-4 text-white -mr-3.5" />
          <span className="hidden sm:inline">واتساب سريع</span>
        </a>
      )}

    </div>
  );
}