'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  Layers,
  Star,
  Flame,
  Sparkles,
  Award,
  Users,
  Percent,
  CheckCircle2,
  SlidersHorizontal,
  ArrowLeft,
  X,
  GraduationCap,
  BadgeCheck,
  Zap,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { formatPrice, formatDuration } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  description: string;
  shortDescription: string | null;
  categoryId: string | null;
  level: string;
  durationHours: number;
  price: number;
  compareAtPrice: number | null;
  isFree: boolean;
  status: string;
  certificateEnabled: boolean;
  hasFinalExam: boolean;
  instructor: {
    officialFullName: string;
    avatarUrl: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  _count: {
    sections: number;
    enrollments: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  orderIndex?: number;
}

interface Props {
  initialCourses: Course[];
  categories: Category[];
  initialCategory?: string;
  initialQuery?: string;
}

export default function CoursesCatalogClient({
  initialCourses,
  categories,
  initialCategory = '',
  initialQuery = '',
}: Props) {
  // State
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<'ALL' | 'DISCOUNTED' | 'FREE' | 'PAID'>('ALL');
  const [selectedDuration, setSelectedDuration] = useState<'ALL' | 'SHORT' | 'LONG'>('ALL');
  const [onlyCertified, setOnlyCertified] = useState(false);
  const [sortBy, setSortBy] = useState<'POPULAR' | 'NEWEST' | 'RATING' | 'PRICE_LOW' | 'PRICE_HIGH'>('POPULAR');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Top Featured / Trending & Hot Deals Courses
  const featuredCourses = useMemo(() => {
    return [...initialCourses]
      .filter((c) => (c.compareAtPrice && c.compareAtPrice > c.price) || c._count.enrollments > 0 || c.price >= 800)
      .slice(0, 3);
  }, [initialCourses]);

  // Filtered & Sorted Courses
  const filteredCourses = useMemo(() => {
    return initialCourses.filter((course) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = course.title.toLowerCase().includes(q);
        const matchDesc = (course.description || '').toLowerCase().includes(q);
        const matchInstructor = course.instructor.officialFullName.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchInstructor) return false;
      }

      // Category
      if (selectedCategory && course.category?.slug !== selectedCategory) {
        return false;
      }

      // Level
      if (selectedLevel !== 'ALL' && course.level !== selectedLevel) {
        return false;
      }

      // Price & Deals
      if (selectedPriceFilter === 'DISCOUNTED' && (!course.compareAtPrice || course.compareAtPrice <= course.price)) {
        return false;
      }
      if (selectedPriceFilter === 'FREE' && (!course.isFree && course.price > 0)) {
        return false;
      }
      if (selectedPriceFilter === 'PAID' && (course.isFree || course.price === 0)) {
        return false;
      }

      // Certified
      if (onlyCertified && !course.certificateEnabled) {
        return false;
      }

      // Duration
      if (selectedDuration === 'SHORT' && course.durationHours >= 15) {
        return false;
      }
      if (selectedDuration === 'LONG' && course.durationHours < 15) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'POPULAR') {
        return (b._count.enrollments || 0) - (a._count.enrollments || 0);
      }
      if (sortBy === 'PRICE_LOW') {
        return a.price - b.price;
      }
      if (sortBy === 'PRICE_HIGH') {
        return b.price - a.price;
      }
      if (sortBy === 'RATING') {
        return (b.compareAtPrice || 0) - (a.compareAtPrice || 0);
      }
      return 0;
    });
  }, [
    initialCourses,
    searchQuery,
    selectedCategory,
    selectedLevel,
    selectedPriceFilter,
    onlyCertified,
    selectedDuration,
    sortBy,
  ]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedLevel('ALL');
    setSelectedPriceFilter('ALL');
    setSelectedDuration('ALL');
    setOnlyCertified(false);
    setSortBy('POPULAR');
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedCategory ||
    selectedLevel !== 'ALL' ||
    selectedPriceFilter !== 'ALL' ||
    selectedDuration !== 'ALL' ||
    onlyCertified
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. TOP HERO: FEATURED & TRENDING / HOT DEALS SHOWCASE */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#16102e] via-[#100c22] to-[#090714] border border-amber-500/30 shadow-2xl shadow-purple-950/50 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top Title & Badge */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>عروض حصرية والكورسات الأكثر طلباً في سوق العمل</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                دليل الكورسات والدبلومات التدريبية
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl font-medium leading-relaxed">
                تصفح أقوى الدورات البرمجية والتقنية المطابقة لاحتياجات سوق العمل العربي والدولي من الصفر وحتى الاحتراف مع م / محمد إبراهيم.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
                <span className="block text-lg font-black text-amber-400">{initialCourses.length}</span>
                <span className="text-[11px] font-bold text-zinc-400">كورس ودبلومة</span>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
                <span className="block text-lg font-black text-emerald-400">100%</span>
                <span className="text-[11px] font-bold text-zinc-400">تطبيق عملي</span>
              </div>
            </div>
          </div>

          {/* 3 Featured Cards Highlight */}
          {featuredCourses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {featuredCourses.map((course, idx) => {
                const discountPercent = course.compareAtPrice && course.compareAtPrice > course.price
                  ? Math.round(((course.compareAtPrice - course.price) / course.compareAtPrice) * 100)
                  : null;

                return (
                  <div
                    key={course.id}
                    className="relative group rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-amber-500/20 hover:border-amber-400/50 p-4 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Image Preview & Badges */}
                      <div className="relative h-32 rounded-xl overflow-hidden bg-zinc-950">
                        <img
                          src={course.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        {/* Top Badges */}
                        <div className="absolute top-2 right-2 flex items-center gap-1.5">
                          {idx === 0 ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-zinc-950 font-black text-[10px] flex items-center gap-1 shadow-md">
                              <Flame className="w-3 h-3" />
                              الأكثر طلباً
                            </span>
                          ) : discountPercent ? (
                            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-black text-[10px] flex items-center gap-1 shadow-md">
                              <Percent className="w-3 h-3" />
                              خصم {discountPercent}%
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-black text-[10px]">
                              مميز
                            </span>
                          )}
                        </div>

                        {/* Category badge */}
                        {course.category && (
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-bold text-zinc-200">
                            {course.category.name}
                          </span>
                        )}
                      </div>

                      {/* Title & Short info */}
                      <div>
                        <h3 className="text-sm font-black text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-zinc-400 line-clamp-1 mt-1">
                          {course.shortDescription || course.description}
                        </p>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-medium">
                        <span className="flex items-center gap-1 text-amber-400">
                          <Clock className="w-3 h-3" />
                          {formatDuration(course.durationHours)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          {course._count.sections} وحدات
                        </span>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-black text-amber-400">{formatPrice(course.price)}</span>
                          {course.compareAtPrice && (
                            <span className="text-[11px] text-zinc-500 line-through">
                              {formatPrice(course.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/courses/${course.slug}`}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition-all flex items-center gap-1 cursor-pointer shadow-md shadow-amber-500/20"
                      >
                        <span>التفاصيل</span>
                        <ArrowLeft className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Filter Pills (Top Horizontal Quick Picks) */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
            <span className="text-xs font-bold text-zinc-400">عرض سريع:</span>
            
            <button
              type="button"
              onClick={() => { setSelectedPriceFilter('ALL'); setSelectedCategory(''); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPriceFilter === 'ALL' && !selectedCategory
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              جميع الكورسات ({initialCourses.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedPriceFilter('DISCOUNTED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedPriceFilter === 'DISCOUNTED'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-white/5 text-rose-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>عروض وتخفيضات خاصة</span>
            </button>

            <button
              type="button"
              onClick={() => setSortBy('POPULAR')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                sortBy === 'POPULAR' && selectedPriceFilter !== 'DISCOUNTED'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white/5 text-purple-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>الأكثر طلباً ورواجاً</span>
            </button>

            <button
              type="button"
              onClick={() => setOnlyCertified(!onlyCertified)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                onlyCertified
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-white/5 text-emerald-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>شهادات معتمدة</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: SIDEBAR + COURSES CATALOG */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* ===================== SIDEBAR ===================== */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Mobile Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden w-full h-11 rounded-2xl bg-[#15102a] border border-purple-900/60 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>تصفية الكورسات المتقدمة</span>
          </button>

          {/* Sidebar Container */}
          <div className={`${mobileFilterOpen ? 'block' : 'hidden'} lg:block space-y-6`}>
            
            {/* Filter Group: Categories */}
            <div className="p-5 rounded-3xl bg-[#120e24]/90 border border-purple-900/50 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>تصنيف المجال</span>
                </h3>
                {selectedCategory && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('')}
                    className="text-[11px] text-amber-400 font-bold hover:underline cursor-pointer"
                  >
                    إلغاء
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-right flex items-center justify-between transition-all cursor-pointer ${
                    !selectedCategory
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>جميع المجالات</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-zinc-400 font-mono">
                    {initialCourses.length}
                  </span>
                </button>

                {categories.map((cat) => {
                  const count = initialCourses.filter((c) => c.category?.slug === cat.slug).length;
                  const isSelected = selectedCategory === cat.slug;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-right flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-zinc-400 font-mono">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Group: Level */}
            <div className="p-5 rounded-3xl bg-[#120e24]/90 border border-purple-900/50 shadow-xl space-y-3">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span>المستوى التدريبي</span>
              </h3>

              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'ALL', label: 'الكل' },
                  { id: 'BEGINNER', label: 'مبتدئ' },
                  { id: 'INTERMEDIATE', label: 'متوسط' },
                  { id: 'ADVANCED', label: 'متقدم' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                      selectedLevel === lvl.id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Group: Deals & Price */}
            <div className="p-5 rounded-3xl bg-[#120e24]/90 border border-purple-900/50 shadow-xl space-y-3">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-400" />
                <span>السعر والعروض</span>
              </h3>

              <div className="space-y-1.5">
                {[
                  { id: 'ALL', label: 'جميع الأسعار' },
                  { id: 'DISCOUNTED', label: 'عروض وتخفيضات سارية' },
                  { id: 'FREE', label: 'كورسات مجانية 100%' },
                  { id: 'PAID', label: 'دورات مدفوعة متقدمة' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedPriceFilter(item.id as any)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-right flex items-center justify-between transition-all cursor-pointer ${
                      selectedPriceFilter === item.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedPriceFilter === item.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Smart Innovation Card 1: AI Advisor */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-indigo-700/50 shadow-xl space-y-3 relative overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-white">محتار تختار كورس إيه؟</h4>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  تواصل مباشرة مع فريق الاستشارات الأكاديمية لاختيار المسار المناسب لمستواك وهدفك الوظيفي.
                </p>
              </div>
              <a
                href="https://wa.me/201012345678"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>استشارة مجانية بالواتساب</span>
              </a>
            </div>

            {/* Sidebar Smart Innovation Card 2: 100% Guarantee */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <BadgeCheck className="w-4 h-4" />
                <span>ضمان الجودة والأمان 100%</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                جميع دورات المنصة تشمل مشاريع تطبيقية حقيقية وشهادة إتمام معتمدة بكود تحقق رقمي.
              </p>
            </div>
          </div>
        </aside>

        {/* ===================== MAIN CATALOG ===================== */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Top Search & Filter Bar */}
          <div className="p-4 rounded-3xl bg-[#120e24]/90 border border-purple-900/50 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن اسم الكورس، التقنية، أو المحاضر..."
                className="w-full h-11 pr-10 pl-9 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 text-xs font-medium focus:outline-none focus:border-amber-400 focus:bg-white/[0.08] transition-all"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort & Count Controls */}
            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
              <span className="text-xs font-bold text-zinc-400 whitespace-nowrap">
                عرض <span className="text-amber-400 font-black">{filteredCourses.length}</span> دورة
              </span>

              {/* Sort Select */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-11 px-3 pl-8 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-amber-400 cursor-pointer appearance-none"
                >
                  <option value="POPULAR" className="bg-[#120e24] text-white">الأكثر طلباً ورواجاً</option>
                  <option value="NEWEST" className="bg-[#120e24] text-white">الأحدث إضافتاً</option>
                  <option value="PRICE_LOW" className="bg-[#120e24] text-white">السعر: من الأقل للأعلى</option>
                  <option value="PRICE_HIGH" className="bg-[#120e24] text-white">السعر: من الأعلى للأقل</option>
                </select>
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-zinc-400 font-bold">الفلاتر النشطة:</span>

              {selectedCategory && (
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-bold">
                  {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                  <button type="button" onClick={() => setSelectedCategory('')} className="hover:text-white cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedLevel !== 'ALL' && (
                <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 font-bold">
                  مستوى: {selectedLevel}
                  <button type="button" onClick={() => setSelectedLevel('ALL')} className="hover:text-white cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedPriceFilter !== 'ALL' && (
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-bold">
                  {selectedPriceFilter === 'DISCOUNTED' ? 'عروض وتخفيضات' : selectedPriceFilter === 'FREE' ? 'مجاني' : 'مدفوع'}
                  <button type="button" onClick={() => setSelectedPriceFilter('ALL')} className="hover:text-white cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer mr-2"
              >
                إلغاء جميع الفلاتر
              </button>
            </div>
          )}

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-[#120e24]/90 border border-purple-900/50 space-y-4 p-8">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-white">لم يتم العثور على كورسات مطابقة</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                جرب البحث بكلمات أخرى، أو تغيير خيارات التصفية لعرض الدورات التدريبية المتاحة.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
              >
                إعادة ضبط البحث والفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const discountPercent = course.compareAtPrice && course.compareAtPrice > course.price
                  ? Math.round(((course.compareAtPrice - course.price) / course.compareAtPrice) * 100)
                  : null;

                const levelLabel =
                  course.level === 'BEGINNER' ? 'مبتدئ' :
                  course.level === 'INTERMEDIATE' ? 'متوسط' :
                  course.level === 'ADVANCED' ? 'متقدم' : 'شامل لجميع المستويات';

                return (
                  <div
                    key={course.id}
                    className="group rounded-3xl bg-[#120e24]/95 hover:bg-[#16122d] border border-purple-900/50 hover:border-amber-500/40 p-4 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-purple-950/50"
                  >
                    <div className="space-y-3.5">
                      {/* Thumbnail & Floating Badges */}
                      <div className="relative h-44 rounded-2xl overflow-hidden bg-zinc-950">
                        <img
                          src={course.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 right-2.5 flex flex-wrap items-center gap-1.5">
                          {course.category && (
                            <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-bold text-zinc-200 border border-white/10">
                              {course.category.name}
                            </span>
                          )}

                          {discountPercent && (
                            <span className="px-2 py-1 rounded-lg bg-rose-600 text-white font-black text-[10px] flex items-center gap-1 shadow-md">
                              <Percent className="w-3 h-3" />
                              خصم {discountPercent}%
                            </span>
                          )}
                        </div>

                        {/* Bottom Floating Badge */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-md bg-purple-950/90 backdrop-blur-md text-[10px] font-bold text-purple-300 border border-purple-700/60">
                            {levelLabel}
                          </span>

                          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>4.9</span>
                          </span>
                        </div>
                      </div>

                      {/* Meta chips */}
                      <div className="flex items-center gap-3 text-xs text-zinc-400 font-medium">
                        <span className="flex items-center gap-1 text-amber-400">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(course.durationHours)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" />
                          {course._count.sections} وحدات
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {course._count.enrollments} طالب
                        </span>
                      </div>

                      {/* Title & Short Description */}
                      <div className="space-y-1.5">
                        <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
                          {course.title}
                        </h3>

                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {course.shortDescription || course.description}
                        </p>
                      </div>

                      {/* Instructor Info */}
                      <div className="flex items-center gap-2.5 pt-1">
                        {course.instructor.avatarUrl ? (
                          <img
                            src={course.instructor.avatarUrl}
                            alt={course.instructor.officialFullName}
                            className="w-7 h-7 rounded-full object-cover border border-purple-500/40"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-xs font-black text-white">
                            {course.instructor.officialFullName[0]}
                          </div>
                        )}
                        <div className="truncate">
                          <span className="block text-xs font-bold text-zinc-300 truncate">
                            {course.instructor.officialFullName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price & CTA Button */}
                    <div className="pt-4 mt-4 border-t border-purple-900/40 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 block">سعر الاشتراك</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-black text-white">
                            {course.isFree || course.price === 0 ? 'مجاناً' : formatPrice(course.price)}
                          </span>
                          {course.compareAtPrice && course.compareAtPrice > course.price && (
                            <span className="text-xs text-zinc-500 line-through font-bold">
                              {formatPrice(course.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/courses/${course.slug}`}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-zinc-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>تفاصيل الكورس</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
