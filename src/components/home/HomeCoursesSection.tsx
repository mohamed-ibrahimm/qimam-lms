'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatPrice, formatDuration } from '@/lib/utils';
import {
  Clock,
  Layers,
  Star,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Code2,
  BrainCircuit,
  Palette,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Flame,
  Award,
  UserCheck,
} from 'lucide-react';

interface HomeCoursesSectionProps {
  initialCourses: any[];
  categories: any[];
}

const THEME_STYLES = [
  {
    name: 'blue',
    topBar: 'from-blue-500 via-cyan-400 to-indigo-500',
    aura: 'from-blue-500/20 via-cyan-500/5 to-transparent',
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    badgeLight: 'bg-blue-50 text-blue-700 border-blue-200',
    glowBorder: 'hover:border-blue-500/60 hover:shadow-[0_0_35px_rgba(59,130,246,0.2)]',
    titleHover: 'group-hover:text-blue-500 dark:group-hover:text-blue-400',
    priceColor: 'text-blue-600 dark:text-blue-400',
    btn: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-500 hover:to-indigo-600',
    btnDark: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white shadow-blue-500/30',
    tagBg: 'bg-blue-500/10 text-blue-300 border-blue-500/20 dark:bg-blue-950/50 dark:text-blue-300',
    tagLight: 'bg-blue-50 text-blue-700 border-blue-200/80',
    avatarRing: 'from-blue-500 to-cyan-400',
    fallbackImg: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    badgeText: '🔥 الأكثر طلباً',
  },
  {
    name: 'purple',
    topBar: 'from-purple-500 via-fuchsia-400 to-violet-600',
    aura: 'from-purple-500/20 via-fuchsia-500/5 to-transparent',
    badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    badgeLight: 'bg-purple-50 text-purple-700 border-purple-200',
    glowBorder: 'hover:border-purple-500/60 hover:shadow-[0_0_35px_rgba(168,85,247,0.2)]',
    titleHover: 'group-hover:text-purple-500 dark:group-hover:text-purple-400',
    priceColor: 'text-purple-600 dark:text-purple-400',
    btn: 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-700 text-white shadow-purple-500/25 hover:shadow-purple-500/40 hover:from-purple-500 hover:to-fuchsia-600',
    btnDark: 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600 text-white shadow-purple-500/30',
    tagBg: 'bg-purple-500/10 text-purple-300 border-purple-500/20 dark:bg-purple-950/50 dark:text-purple-300',
    tagLight: 'bg-purple-50 text-purple-700 border-purple-200/80',
    avatarRing: 'from-purple-500 to-pink-500',
    fallbackImg: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800',
    badgeText: '⚡ ذكاء اصطناعي',
  },
  {
    name: 'amber',
    topBar: 'from-amber-500 via-yellow-400 to-orange-500',
    aura: 'from-amber-500/20 via-yellow-500/5 to-transparent',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    badgeLight: 'bg-amber-50 text-amber-700 border-amber-200',
    glowBorder: 'hover:border-amber-500/60 hover:shadow-[0_0_35px_rgba(245,158,11,0.2)]',
    titleHover: 'group-hover:text-amber-500 dark:group-hover:text-amber-400',
    priceColor: 'text-amber-600 dark:text-amber-400',
    btn: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-zinc-950 font-black shadow-amber-500/25 hover:shadow-amber-500/40 hover:from-amber-400 hover:to-yellow-400',
    btnDark: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-zinc-950 font-black shadow-amber-500/30',
    tagBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20 dark:bg-amber-950/50 dark:text-amber-300',
    tagLight: 'bg-amber-50 text-amber-700 border-amber-200/80',
    avatarRing: 'from-amber-400 to-orange-400',
    fallbackImg: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    badgeText: '💎 دبلومة معتمدة',
  },
  {
    name: 'emerald',
    topBar: 'from-emerald-500 via-teal-400 to-green-600',
    aura: 'from-emerald-500/20 via-teal-500/5 to-transparent',
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    badgeLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    glowBorder: 'hover:border-emerald-500/60 hover:shadow-[0_0_35px_rgba(16,185,129,0.2)]',
    titleHover: 'group-hover:text-emerald-500 dark:group-hover:text-emerald-400',
    priceColor: 'text-emerald-600 dark:text-emerald-400',
    btn: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-500 hover:to-teal-600',
    btnDark: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-emerald-500/30',
    tagBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 dark:bg-emerald-950/50 dark:text-emerald-300',
    tagLight: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    avatarRing: 'from-emerald-400 to-teal-400',
    fallbackImg: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    badgeText: '🚀 مسار تطبيقي',
  },
  {
    name: 'rose',
    topBar: 'from-rose-500 via-pink-400 to-rose-600',
    aura: 'from-rose-500/20 via-pink-500/5 to-transparent',
    badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    badgeLight: 'bg-rose-50 text-rose-700 border-rose-200',
    glowBorder: 'hover:border-rose-500/60 hover:shadow-[0_0_35px_rgba(244,63,94,0.2)]',
    titleHover: 'group-hover:text-rose-500 dark:group-hover:text-rose-400',
    priceColor: 'text-rose-600 dark:text-rose-400',
    btn: 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white shadow-rose-500/25 hover:shadow-rose-500/40 hover:from-rose-500 hover:to-pink-600',
    btnDark: 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-rose-500/30',
    tagBg: 'bg-rose-500/10 text-rose-300 border-rose-500/20 dark:bg-rose-950/50 dark:text-rose-300',
    tagLight: 'bg-rose-50 text-rose-700 border-rose-200/80',
    avatarRing: 'from-rose-400 to-pink-400',
    fallbackImg: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    badgeText: '✨ واجهات وتجربة مستخدم',
  },
];

export default function HomeCoursesSection({
  initialCourses = [],
  categories = [],
}: HomeCoursesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Filter courses based on selected category tab
  const filteredCourses = useMemo(() => {
    if (selectedCategory === 'ALL') return initialCourses;
    return initialCourses.filter(
      (c) => c.categoryId === selectedCategory || c.category?.id === selectedCategory || c.category?.slug === selectedCategory
    );
  }, [selectedCategory, initialCourses]);

  const getCategoryIcon = (slug?: string) => {
    if (!slug) return BookOpen;
    if (slug.includes('ai') || slug.includes('data')) return BrainCircuit;
    if (slug.includes('ui') || slug.includes('design')) return Palette;
    return Code2;
  };

  return (
    <section id="all-courses" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* =========================================================================
            1. SECTION HEADER (Futuristic, Symmetrical, High Impact)
           ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-amber-500/10 border border-blue-200/80 dark:border-amber-500/25 text-blue-700 dark:text-amber-300 text-xs font-black shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-amber-400 animate-pulse" />
            <span>دليل كافة مسارات وكورسات المنصة المعتمدة</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            جميع كورسات ومسارات المنصة
          </h2>
          
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            اختر مسارك الهندسي لتتعلم بأحدث أساليب الإنتاج والتطوير، مع شروحات عملية مباشرة، ومشاريع تخرج متكاملة، ودعم هندسي متواصل.
          </p>
        </div>

        {/* =========================================================================
            2. DYNAMIC INTERACTIVE CATEGORY FILTER TABS (Centered)
           ========================================================================= */}
        {categories.length > 0 && (
          <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-2 scrollbar-none px-2">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all whitespace-nowrap shrink-0 flex items-center gap-2 shadow-xs cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white dark:from-amber-500 dark:to-yellow-500 dark:text-zinc-950 shadow-md scale-105 ring-2 ring-blue-500/30 dark:ring-amber-500/40'
                  : 'bg-white/90 hover:bg-slate-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/90 dark:border-zinc-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>كافة الكورسات ({initialCourses.length})</span>
            </button>

            {categories.map((cat) => {
              const CatIcon = getCategoryIcon(cat.slug);
              const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
              const count = initialCourses.filter(
                (c) => c.categoryId === cat.id || c.category?.id === cat.id || c.category?.slug === cat.slug
              ).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all whitespace-nowrap shrink-0 flex items-center gap-2 shadow-xs cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white dark:from-amber-500 dark:to-yellow-500 dark:text-zinc-950 shadow-md scale-105 ring-2 ring-blue-500/30 dark:ring-amber-500/40'
                      : 'bg-white/90 hover:bg-slate-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/90 dark:border-zinc-800'
                  }`}
                >
                  <CatIcon className="w-4 h-4" />
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 dark:bg-black/20 text-white dark:text-zinc-950'
                      : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            3. LUXURY GLASSMORPHIC CARDS GRID (Harmonized, Centered, Symmetrical)
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
          {filteredCourses.map((course, idx) => {
            const theme = THEME_STYLES[idx % THEME_STYLES.length];
            const CatIcon = getCategoryIcon(course.category?.slug);
            const imageSrc = course.thumbnail && !course.thumbnail.includes('1787933474229') && !course.thumbnail.includes('1787916336074')
              ? course.thumbnail
              : theme.fallbackImg;

            // Fake attractive original price for discount feeling
            const originalPrice = Math.round((course.price * 1.55) / 50) * 50;

            // Normalized description for consistent look
            const cleanDescription = course.shortDescription && course.shortDescription.length > 10 && !course.shortDescription.includes('سسس')
              ? course.shortDescription
              : (course.description && course.description.length > 10 && !course.description.includes('سسس')
                  ? course.description
                  : 'مسار تطبيقي مكثف يركز على إتقان أحدث المعايير البرمجية وبناء مشاريع واقعية لسوق العمل.');

            return (
              <div
                key={course.id}
                className={`group relative flex flex-col justify-between rounded-3xl bg-white/95 dark:bg-zinc-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-zinc-800/90 ${theme.glowBorder} shadow-xl shadow-slate-900/5 dark:shadow-black/70 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
              >
                {/* 1. Dynamic Top 3px Luminous Beam */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${theme.topBar}`} />

                {/* 2. Ambient Colorful Glow in Dark & Light Modes */}
                <div className={`absolute -top-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br ${theme.aura} blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none`} />

                {/* 3. Card Upper Section (Image & Badges) */}
                <div className="p-4 sm:p-5 space-y-4">
                  
                  {/* Image Frame */}
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 shadow-md">
                    <img
                      src={imageSrc}
                      alt={course.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />

                    {/* Dark gradient vignette over image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                    {/* Top Floating Glass Badges */}
                    <div className="absolute top-3 right-3 left-3 flex items-center justify-between pointer-events-none">
                      {course.category ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-black bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-md">
                          <CatIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span>{course.category.name}</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[11px] font-black bg-black/70 backdrop-blur-md text-sky-300 border border-sky-500/30 flex items-center gap-1.5 shadow-md">
                          <Code2 className="w-3.5 h-3.5 text-sky-400" />
                          <span>مسار هندسي</span>
                        </span>
                      )}

                      <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-500/90 backdrop-blur-md text-white border border-emerald-400/40 flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>معتمد</span>
                      </span>
                    </div>

                    {/* Bottom Metadata bar floating over image */}
                    <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-[11px] text-white/95 pointer-events-none font-bold">
                      <div className="flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{formatDuration(course.durationHours)}</span>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-400/30 backdrop-blur-md text-amber-300 px-3 py-1 rounded-full border border-amber-400/40">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>4.9</span>
                      </div>

                      <div className="flex items-center gap-1 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{course._count?.sections || 2} وحدات</span>
                      </div>
                    </div>
                  </div>

                  {/* Course Content Details (Centered & Harmonized) */}
                  <div className="space-y-3.5 text-center">
                    
                    {/* Badge Pill Centered */}
                    <div className="flex items-center justify-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-black border ${theme.tagBg} dark:${theme.tagBg} flex items-center gap-1.5 shadow-xs`}>
                        <Zap className="w-3.5 h-3.5" />
                        <span>{theme.badgeText}</span>
                      </span>
                    </div>

                    {/* Title (Consistent height & centered for perfect visual symmetry) */}
                    <h3 className={`font-black text-lg sm:text-xl text-slate-900 dark:text-white ${theme.titleHover} transition-colors line-clamp-2 leading-snug min-h-[56px] flex items-center justify-center`}>
                      {course.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed min-h-[40px] px-1">
                      {cleanDescription}
                    </p>

                    {/* =========================================================================
                        PROMINENT INSTRUCTOR BOX (Large, Prestigious, Beautiful)
                       ========================================================================= */}
                    <div className="p-3 rounded-2xl bg-slate-100/90 dark:bg-zinc-800/60 border border-slate-200/90 dark:border-zinc-700/60 flex items-center justify-center gap-3.5 shadow-xs">
                      {/* Big Avatar */}
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${theme.avatarRing} p-[2px] shrink-0 shadow-md`}>
                        <div className="w-full h-full rounded-full bg-slate-900 dark:bg-zinc-950 flex items-center justify-center text-sm font-black text-white dark:text-white">
                          {course.instructor?.officialFullName?.[0] || 'م'}
                        </div>
                      </div>
                      
                      {/* Name & Title */}
                      <div className="text-right">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-zinc-100 block leading-tight">
                            {course.instructor?.officialFullName || 'م / محمد إبراهيم'}
                          </span>
                          <UserCheck className="w-4 h-4 text-blue-600 dark:text-amber-400 shrink-0" />
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-semibold block mt-0.5">
                          محاضر معتمد بالأكاديمية
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* =========================================================================
                    4. LUXURY CENTERED PRICING & FULL-WIDTH BUTTON (السعر في النص ومنسق الدنيا)
                   ========================================================================= */}
                <div className="p-5 bg-slate-50/95 dark:bg-zinc-950/85 border-t border-slate-200/90 dark:border-zinc-800/90 flex flex-col items-center gap-3.5 rounded-b-3xl text-center">
                  
                  {/* Centered Pricing with Savings Badge */}
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 dark:text-zinc-500 line-through font-bold">
                        {formatPrice(originalPrice)}
                      </span>
                      <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-black border border-emerald-500/30">
                        وفر 35%
                      </span>
                    </div>
                    
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-2xl sm:text-3xl font-black ${theme.priceColor} tracking-tight`}>
                        {formatPrice(course.price)}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium">
                      شامل الوصول الكامل، التحديثات والشهادة
                    </span>
                  </div>

                  {/* Full-Width Luxury Action Button */}
                  <Link
                    href={`/courses/${course.slug}`}
                    prefetch={true}
                    className={`w-full py-3 sm:py-3.5 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98 ${theme.btn} dark:${theme.btnDark}`}
                  >
                    <span>عرض الكورس والاشتراك</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

        {/* If no courses found for category */}
        {filteredCourses.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-400 dark:text-zinc-600" />
            <p className="font-bold text-sm">لا توجد كورسات في هذا التخصص حالياً</p>
          </div>
        )}

      </div>
    </section>
  );
}
