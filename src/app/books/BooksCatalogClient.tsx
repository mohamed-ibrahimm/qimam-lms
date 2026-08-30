'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Sparkles,
  Shield,
  Star,
  CheckCircle,
  ShoppingBag,
  Eye,
  SlidersHorizontal,
  GraduationCap,
  Layers,
  FileText,
  Lock,
  Tag,
  ArrowRight,
  Flame,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  Crown,
  User,
} from 'lucide-react';

interface BookItem {
  id: string;
  title: string;
  slug: string;
  coverImage?: string | null;
  fileUrl: string;
  description: string;
  shortDescription?: string | null;
  pageCount: number;
  previewPagesCount: number;
  price: number;
  compareAtPrice?: number | null;
  isFree: boolean;
  authorName?: string | null;
  academicSubject?: string | null;
  academicLevel?: string | null;
  category: string;
  salesCount: number;
  viewsCount: number;
  rating: number;
  instructor?: {
    id: string;
    officialFullName: string;
    firstName: string;
    lastName?: string | null;
    avatarUrl?: string | null;
    isStudentInstructor: boolean;
    studentUniversity?: string | null;
    studentFaculty?: string | null;
    role?: string;
  } | null;
}

interface Props {
  initialBooks: BookItem[];
  purchasedBookIds: string[];
  currentUser: {
    id: string;
    officialFullName: string;
    phone?: string | null;
    username: string;
  } | null;
}

export default function BooksCatalogClient({
  initialBooks,
  purchasedBookIds,
  currentUser,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [priceFilter, setPriceFilter] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');

  const categories = useMemo(() => [
    { id: 'ALL', name: 'كافة الأقسام والمذكرات', icon: Layers, count: initialBooks.length },
    { id: 'ملخصات', name: 'ملخصات وشروحات مركزة', icon: FileText, count: initialBooks.filter(b => b.category === 'ملخصات').length },
    { id: 'كتب ومراجع', name: 'كتب ومراجع إلكترونية', icon: BookOpen, count: initialBooks.filter(b => b.category === 'كتب ومراجع').length },
    { id: 'بنك أسئلة', name: 'بنوك أسئلة وامتحانات محلولة', icon: GraduationCap, count: initialBooks.filter(b => b.category === 'بنك أسئلة').length },
  ], [initialBooks]);

  // Spotlight top 3 trending notes
  const spotlightBooks = useMemo(() => {
    return [...initialBooks].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 3);
  }, [initialBooks]);

  const filteredBooks = useMemo(() => {
    return initialBooks.filter((book) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = book.title.toLowerCase().includes(query);
        const matchAuthor = (book.authorName || '').toLowerCase().includes(query);
        const matchSubject = (book.academicSubject || '').toLowerCase().includes(query);
        const matchDesc = (book.description || '').toLowerCase().includes(query);
        if (!matchTitle && !matchAuthor && !matchSubject && !matchDesc) return false;
      }

      // Category
      if (selectedCategory !== 'ALL' && book.category !== selectedCategory) {
        return false;
      }

      // Price
      if (priceFilter === 'FREE' && !book.isFree && book.price > 0) return false;
      if (priceFilter === 'PAID' && (book.isFree || book.price === 0)) return false;

      return true;
    });
  }, [initialBooks, searchQuery, selectedCategory, priceFilter]);

  // Fallback high-quality avatars for authors
  const getAuthorAvatar = (book: BookItem) => {
    if (book.instructor?.avatarUrl && book.instructor.avatarUrl.trim()) {
      return book.instructor.avatarUrl;
    }
    return null;
  };

  return (
    <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 space-y-10 sm:space-y-14">
      
      {/* =========================================================================
          1. CENTERED WORLD-CLASS HERO BANNER (Full-width, Symmetrical Glassmorphism)
         ========================================================================= */}
      <div className="relative rounded-[36px] overflow-hidden p-8 sm:p-14 md:p-16 border border-amber-500/30 bg-gradient-to-br from-[#0c081e] via-[#140e2b] to-[#0a0618] shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-center">
        
        {/* Dynamic Glowing Ambiance */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-amber-500/15 via-purple-600/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-5">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/10">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>★ سوق ومكتبة المذكرات والمراجع الرقمية المشفرة</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.2] tracking-tight">
            ملخصات دراسية، كتب تخصصية، <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              وبنوك أسئلة باحترافية كاملة
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-300 leading-relaxed max-w-3xl mx-auto font-normal">
            تصفح واشترِ أقوى المذكرات والكتب المعدة بواسطة نخبة المحاضرين والطلاب المتفوقين، واقرأها من أي جهاز مع حماية مشددة بنظام DRM ومعاينة مجانية لأولى الصفحات.
          </p>

          {/* 4 Centerpiece Value Pillars */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-3 text-xs sm:text-sm font-bold text-zinc-200">
            <div className="px-4 py-2 rounded-2xl bg-black/40 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 shadow-xs">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>حماية رقمية مشفرة 100% DRM</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-black/40 border border-amber-500/30 text-amber-400 flex items-center gap-2 shadow-xs">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>معاينة مجانية لكافة المذكرات</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-black/40 border border-blue-500/30 text-blue-400 flex items-center gap-2 shadow-xs">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>حفظ دائم في مكتبتك الخاصة</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-black/40 border border-purple-500/30 text-purple-400 flex items-center gap-2 shadow-xs">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>تقييم 4.9/5 من مئات الطلاب</span>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          2. SPOTLIGHT: TOP 3 BEST-SELLING & TRENDING NOTES (قسم الأقوى مبيعاً)
         ========================================================================= */}
      {spotlightBooks.length > 0 && !searchQuery.trim() && selectedCategory === 'ALL' && priceFilter === 'ALL' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-zinc-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                <Flame className="w-5 h-5 text-zinc-950 animate-bounce" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  المذكرات الأكثر طلباً ومبيعاً هذا الأسبوع
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  المذكرات الأعلى تقييماً وإقبالاً من طلاب الجامعات والمهندسين
                </p>
              </div>
            </div>

            <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 self-start sm:self-auto">
              🔥 إقبال استثنائي
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spotlightBooks.map((book, idx) => {
              const isPurchased = purchasedBookIds.includes(book.id);
              const authorAvatar = getAuthorAvatar(book);
              const badgeColors = idx === 0
                ? 'from-amber-500 to-yellow-400 text-zinc-950'
                : idx === 1
                ? 'from-emerald-500 to-teal-400 text-zinc-950'
                : 'from-purple-600 to-indigo-500 text-white';

              return (
                <div
                  key={book.id}
                  className="group relative rounded-3xl bg-white dark:bg-[#120d26] border-2 border-amber-500/40 hover:border-amber-400 shadow-xl hover:shadow-2xl hover:shadow-amber-500/15 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Rank Flag */}
                  <div className="absolute top-3.5 right-3.5 z-20">
                    <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${badgeColors} text-[11px] font-black shadow-lg flex items-center gap-1`}>
                      <Crown className="w-3.5 h-3.5" />
                      <span>#{idx + 1} الأكثر مبيعاً</span>
                    </span>
                  </div>

                  {/* Cover Header */}
                  <div className="relative h-48 sm:h-52 w-full bg-slate-950 overflow-hidden">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-950 to-indigo-950">
                        <BookOpen className="w-14 h-14 text-amber-400" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs font-bold text-white">
                      <span className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-[11px]">
                        📄 {book.pageCount} صفحة
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-zinc-950 font-black text-[11px]">
                        👁️ معاينة {book.previewPagesCount} صفحات
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      {/* Category & Subject Tag */}
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 text-[10.5px]">
                          {book.category}
                        </span>
                        <span className="text-zinc-500 text-[11px] font-mono">
                          👥 {book.salesCount} طالب اشترى
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-black text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-500 transition-colors">
                        {book.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {book.shortDescription || book.description}
                      </p>
                    </div>

                    {/* INSTRUCTOR AVATAR & NAME (The requested visual feature) */}
                    <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-[1.5px] shrink-0 shadow-md">
                          <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden flex items-center justify-center text-xs font-black text-amber-300">
                            {authorAvatar ? (
                              <img src={authorAvatar} alt={book.authorName || ''} className="w-full h-full object-cover" />
                            ) : (
                              <span>{book.authorName?.[0] || 'م'}</span>
                            )}
                          </div>
                        </div>
                        <div className="min-w-0 text-right">
                          <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                            {book.authorName || 'المحاضر المعتمد'}
                          </span>
                          <span className="text-[10px] text-zinc-500 block truncate">
                            {book.academicSubject || 'عضو هيئة التدريس'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-black text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{book.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                      <div>
                        {book.isFree || book.price === 0 ? (
                          <span className="text-base font-black text-emerald-500 font-mono">مجاناً 🎁</span>
                        ) : (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-black text-slate-900 dark:text-amber-400 font-mono">
                              {book.price} ج.م
                            </span>
                            {book.compareAtPrice && (
                              <span className="text-xs line-through text-zinc-400 font-mono">
                                {book.compareAtPrice}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/books/${book.slug}`}
                          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-amber-500 hover:text-zinc-950 font-black text-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>معاينة</span>
                        </Link>

                        {isPurchased ? (
                          <Link
                            href={`/books/${book.slug}`}
                            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center gap-1 shadow-md"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>مكتبتك</span>
                          </Link>
                        ) : (
                          <Link
                            href={`/checkout?bookId=${book.id}`}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-xs flex items-center gap-1 shadow-md shadow-amber-500/25 hover:scale-105 transition-all"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>شراء</span>
                          </Link>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          3. SEARCH & LIVE CATEGORY FILTER TABS
         ========================================================================= */}
      <div className="space-y-5 pt-2">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المذكرة، المحاضر، المادة الدراسية (مثال: هندسة البرمجيات، هياكل البيانات، الرياضيات)..."
              className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-amber-500 transition-all shadow-xs"
            />
          </div>

          {/* Price Filter Pill Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-2xl border border-slate-200 dark:border-zinc-800 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setPriceFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                priceFilter === 'ALL'
                  ? 'bg-amber-500 text-zinc-950 font-black shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-white'
              }`}
            >
              كافة الأسعار
            </button>
            <button
              type="button"
              onClick={() => setPriceFilter('PAID')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                priceFilter === 'PAID'
                  ? 'bg-amber-500 text-zinc-950 font-black shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-white'
              }`}
            >
              مدفوعة 💎
            </button>
            <button
              type="button"
              onClick={() => setPriceFilter('FREE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                priceFilter === 'FREE'
                  ? 'bg-emerald-500 text-white font-black shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-white'
              }`}
            >
              مجانية 🎁
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isSelected ? 'bg-zinc-950/20 text-zinc-950' : 'bg-black/10 dark:bg-white/10'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          4. MAIN EXPANSIVE BOOKS CATALOG GRID (With Instructor Avatar & 3D Cover)
         ========================================================================= */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-bold border-b border-slate-200 dark:border-zinc-800 pb-3">
          <span>يتم عرض {filteredBooks.length} مذكرة وكتاب دراسي</span>
          <span>🛡️ كافة الملفات مشفرة ومحمية بالكامل</span>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredBooks.map((book) => {
              const isPurchased = purchasedBookIds.includes(book.id);
              const discount = book.compareAtPrice && book.compareAtPrice > book.price
                ? Math.round(((book.compareAtPrice - book.price) / book.compareAtPrice) * 100)
                : null;
              const authorAvatar = getAuthorAvatar(book);

              return (
                <div
                  key={book.id}
                  className="group relative flex flex-col rounded-3xl bg-white dark:bg-[#110d24] border border-slate-200 dark:border-zinc-800/90 hover:border-amber-500/60 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 overflow-hidden justify-between"
                >
                  {/* Cover Section */}
                  <div className="relative h-48 sm:h-52 w-full bg-slate-950 overflow-hidden">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-950 text-white">
                        <BookOpen className="w-12 h-12 text-amber-400" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Category Pill Top-Right */}
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                        {book.category}
                      </span>
                    </div>

                    {/* Discount Badge Top-Left */}
                    {discount && (
                      <div className="absolute top-3 left-3">
                        <span className="text-[10.5px] font-black px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-md">
                          خصم {discount}%
                        </span>
                      </div>
                    )}

                    {/* Bottom Stats: Pages & Preview Limit */}
                    <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-[11px] font-bold text-white">
                      <span className="px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs font-mono">
                        📄 {book.pageCount} صفحة
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-zinc-950 font-black text-[10.5px]">
                        👁️ معاينة {book.previewPagesCount} صفحات
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                    
                    <div className="space-y-2">
                      {/* Subject / Level */}
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-bold">
                        <span className="text-amber-600 dark:text-amber-400 font-black">{book.academicSubject || 'تخصص عام'}</span>
                        <span className="text-zinc-500 text-[10.5px]">{book.academicLevel}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-500 transition-colors">
                        {book.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {book.shortDescription || book.description}
                      </p>
                    </div>

                    {/* INSTRUCTOR AVATAR & NAME (The requested visual feature) */}
                    <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-[1.5px] shrink-0 shadow-xs">
                          <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden flex items-center justify-center text-[10px] font-black text-amber-300">
                            {authorAvatar ? (
                              <img src={authorAvatar} alt={book.authorName || ''} className="w-full h-full object-cover" />
                            ) : (
                              <span>{book.authorName?.[0] || 'م'}</span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-black text-slate-800 dark:text-zinc-200 truncate">
                          {book.authorName || 'المحاضر'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{book.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Price & Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                      {/* Price */}
                      <div>
                        {book.isFree || book.price === 0 ? (
                          <span className="text-sm font-black text-emerald-500 font-mono">
                            مجاناً 🎁
                          </span>
                        ) : (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-slate-900 dark:text-amber-400 font-mono">
                              {book.price} ج.م
                            </span>
                            {book.compareAtPrice && (
                              <span className="text-xs line-through text-zinc-400 font-mono">
                                {book.compareAtPrice}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* CTAs */}
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/books/${book.slug}`}
                          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-white hover:bg-amber-500 hover:text-zinc-950 transition-all font-bold text-xs flex items-center gap-1"
                          title="معاينة وقراءة"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>معاينة</span>
                        </Link>

                        {isPurchased ? (
                          <Link
                            href={`/books/${book.slug}`}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center gap-1 shadow-md shadow-emerald-600/20"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>في مكتبتك</span>
                          </Link>
                        ) : book.isFree ? (
                          <Link
                            href={`/books/${book.slug}`}
                            className="px-3.5 py-2 rounded-xl bg-emerald-500 text-white font-black text-xs flex items-center gap-1 shadow-md"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>قراءة الآن</span>
                          </Link>
                        ) : (
                          <Link
                            href={`/checkout?bookId=${book.id}`}
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-xs flex items-center gap-1 shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>شراء</span>
                          </Link>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              لا توجد مذكرات مطابقة لخيارات البحث الحالية
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              جرب تغيير كلمات البحث أو اختيار تصنيف مختلف من القائمة أعلاه.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setPriceFilter('ALL');
              }}
              className="px-5 py-2 rounded-2xl bg-amber-500 text-zinc-950 font-black text-xs shadow-md cursor-pointer"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
