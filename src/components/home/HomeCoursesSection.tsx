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
  CheckCircle,
} from 'lucide-react';

interface HomeCoursesSectionProps {
  initialCourses: any[];
  categories: any[];
}

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
    <section id="all-courses" className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-amber-500/10 border border-blue-200 dark:border-amber-500/25 text-blue-700 dark:text-amber-300 text-xs font-black shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400 animate-pulse" />
              <span>منظومة التدريب المتكاملة لعام 2026</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              جميع كورسات ومسارات المنصة
            </h2>
            
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              اختر مسارك التعليمي من بين أقوى الكورسات العملية الموجهة لسوق العمل، بمشاريع إنتاجية كاملة ودعم هندسي متواصل.
            </p>
          </div>

          {/* Quick link to full catalog */}
          <Link
            href="/courses"
            prefetch={true}
            className="group self-start md:self-end shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-bold text-xs sm:text-sm border border-slate-200 dark:border-zinc-700/80 transition-all shadow-xs"
          >
            <span>عرض في صفحة مستقلة</span>
            <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Interactive Category Filter Tabs */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-right">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-2 shadow-xs cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white dark:from-amber-500 dark:to-yellow-500 dark:text-zinc-950 shadow-md scale-105'
                  : 'bg-white/80 hover:bg-slate-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
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
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-2 shadow-xs cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white dark:from-amber-500 dark:to-yellow-500 dark:text-zinc-950 shadow-md scale-105'
                      : 'bg-white/80 hover:bg-slate-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800'
                  }`}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 dark:bg-black/20 text-white dark:text-zinc-950'
                      : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Dynamic Glassmorphic Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredCourses.map((course) => {
            const CatIcon = getCategoryIcon(course.category?.slug);

            return (
              <div
                key={course.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-white/90 dark:bg-gradient-to-b dark:from-zinc-900/90 dark:via-zinc-900/50 dark:to-zinc-950/90 backdrop-blur-2xl border border-slate-200/90 dark:border-zinc-800/90 hover:border-blue-500/50 dark:hover:border-amber-500/50 shadow-lg shadow-slate-900/5 dark:shadow-black/70 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
              >
                {/* Ambient colorful card corner flare */}
                <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-blue-500/10 dark:bg-amber-500/10 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                {/* Card Top / Media Section */}
                <div className="p-3 sm:p-3.5 space-y-3.5">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-950 border border-slate-200/70 dark:border-zinc-800/80 shadow-inner">
                    <img
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'}
                      alt={course.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />

                    {/* Gradient Vignette over image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                    {/* Top Floating Glass Badges */}
                    <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between pointer-events-none">
                      {course.category ? (
                        <span className="px-3 py-1 rounded-full text-[10.5px] font-black bg-black/65 backdrop-blur-md text-amber-300 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-md">
                          <CatIcon className="w-3 h-3 text-amber-400" />
                          <span>{course.category.name}</span>
                        </span>
                      ) : <div />}

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/80 backdrop-blur-md text-white border border-emerald-400/40 flex items-center gap-1 shadow-sm">
                        <CheckCircle className="w-3 h-3" />
                        <span>معتمد</span>
                      </span>
                    </div>

                    {/* Bottom Metadata inside Image */}
                    <div className="absolute bottom-2.5 right-2.5 left-2.5 flex items-center justify-between text-[11px] text-white/90 pointer-events-none font-semibold">
                      <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{formatDuration(course.durationHours)}</span>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-400/20 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>4.9</span>
                      </div>

                      <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                        <Layers className="w-3 h-3 text-sky-400" />
                        <span>{course._count?.sections || 3} وحدات</span>
                      </div>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="px-1.5 space-y-2 text-right">
                    <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    
                    <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {course.shortDescription || course.description || 'كورس تطبيقي متخصص لنقلك لمستوى الاحتراف وبناء مشاريع واقعية.'}
                    </p>

                    {/* Instructor Info */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-amber-500 dark:to-yellow-400 p-[1.5px] shrink-0">
                        <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center text-[10px] font-black text-blue-600 dark:text-amber-400">
                          {course.instructor?.officialFullName?.[0] || 'م'}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 truncate">
                        {course.instructor?.officialFullName || 'م / محمد إبراهيم'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Glass Footer & CTA */}
                <div className="p-3.5 sm:p-4 bg-slate-50/80 dark:bg-zinc-950/70 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-3 mt-2 rounded-b-3xl">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 block leading-none mb-1">
                      رسوم الاشتراك
                    </span>
                    <span className="text-base sm:text-lg font-black text-blue-700 dark:text-amber-400 tracking-tight">
                      {formatPrice(course.price)}
                    </span>
                  </div>

                  <Link
                    href={`/courses/${course.slug}`}
                    prefetch={true}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white dark:from-amber-500 dark:via-yellow-500 dark:to-amber-500 dark:hover:from-amber-400 dark:hover:to-yellow-400 dark:text-zinc-950"
                  >
                    <span>تفاصيل الكورس</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
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
