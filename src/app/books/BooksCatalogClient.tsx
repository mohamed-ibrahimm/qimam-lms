'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  ArrowRight
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
    avatarUrl?: string | null;
    isStudentInstructor: boolean;
  };
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
    { id: 'ALL', name: 'كافة الأقسام والمذكرات', icon: Layers },
    { id: 'ملخصات', name: 'ملخصات وشروحات مركزة', icon: FileText },
    { id: 'كتب ومراجع', name: 'كتب ومراجع إلكترونية', icon: BookOpen },
    { id: 'بنك أسئلة', name: 'بنوك أسئلة وامتحانات محلولة', icon: GraduationCap },
  ], []);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
      
      {/* 1. HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-12 border border-amber-500/30 bg-gradient-to-br from-[#0e0a20] via-[#150f2e] to-[#0b0818] shadow-2xl">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>★ مكتبة وسوق المذكرات والكتب الرقمية المحمية</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            ملخصات دراسية، كتب تخصصية، وبنوك أسئلة باحترافية كاملة
          </h1>

          <p className="text-xs sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
            تصفح واشترِ أقوى المذكرات والكتب المعدة بواسطة نخبة المحاضرين والطلاب المتفوقين، واقرأها من أي جهاز مع حماية مشددة ومعاينة مجانية لأولى الصفحات.
          </p>

          {/* Quick Badges */}
          <div className="flex items-center gap-4 pt-2 flex-wrap text-xs font-bold text-zinc-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Shield className="w-4 h-4" />
              حماية رقمية مشفرة DRM
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <Eye className="w-4 h-4" />
              معاينة مجانية قبل الشراء
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <BookOpen className="w-4 h-4" />
              حفظ فوري في مكتبتك الخاصة
            </span>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المذكرة، المحاضر، المادة الدراسية (مثال: هندسة البرمجيات، هياكل البيانات)..."
              className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-amber-500 transition-all shadow-xs"
            />
          </div>

          {/* Price Filter Pill Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-900 p-1 rounded-2xl border border-slate-200 dark:border-zinc-800 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setPriceFilter('ALL')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                priceFilter === 'ALL'
                  ? 'bg-amber-500 text-zinc-950 font-black shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-white'
              }`}
            >
              الكل
            </button>
            <button
              type="button"
              onClick={() => setPriceFilter('PAID')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                priceFilter === 'PAID'
                  ? 'bg-amber-500 text-zinc-950 font-black shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-white'
              }`}
            >
              مذكرات مدفوعة
            </button>
            <button
              type="button"
              onClick={() => setPriceFilter('FREE')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                priceFilter === 'FREE'
                  ? 'bg-emerald-500 text-white font-black shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-white'
              }`}
            >
              مجانية 🎁
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. BOOKS GRID */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
            const isPurchased = purchasedBookIds.includes(book.id);
            const discount = book.compareAtPrice && book.compareAtPrice > book.price
              ? Math.round(((book.compareAtPrice - book.price) / book.compareAtPrice) * 100)
              : null;

            return (
              <div
                key={book.id}
                className="group relative flex flex-col rounded-3xl bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 hover:border-amber-500/50 shadow-md hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 overflow-hidden"
              >
                {/* Cover Image with Overlay Badges */}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Category Pill Top-Right */}
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-400 border border-amber-500/30">
                      {book.category}
                    </span>
                  </div>

                  {/* Discount Badge Top-Left */}
                  {discount && (
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-md">
                        خصم {discount}%
                      </span>
                    </div>
                  )}

                  {/* Bottom Stats: Pages & Preview Limit */}
                  <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-[11px] font-bold text-white">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs font-mono">
                      📄 {book.pageCount} صفحة
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-zinc-950 font-black">
                      👁️ معاينة {book.previewPagesCount} صفحات
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    {/* Subject / Level */}
                    <div className="flex items-center justify-between text-[10.5px] text-zinc-400 font-bold">
                      <span className="text-amber-600 dark:text-amber-400">{book.academicSubject || 'تخصص عام'}</span>
                      <span>{book.academicLevel}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-500 transition-colors">
                      {book.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-[11.5px] text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {book.shortDescription || book.description}
                    </p>
                  </div>

                  {/* Author & Rating */}
                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px] font-black shrink-0">
                        ✍️
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 truncate">
                        {book.authorName || 'المحاضر'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-amber-500" />
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
                            <span className="text-[10px] line-through text-zinc-400 font-mono">
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
                        className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-white hover:bg-amber-500 hover:text-zinc-950 transition-all font-bold text-xs flex items-center gap-1"
                        title="معاينة وقراءة"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">معاينة</span>
                      </Link>

                      {isPurchased ? (
                        <Link
                          href={`/books/${book.slug}`}
                          className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center gap-1 shadow-md shadow-emerald-600/20"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>في مكتبتك</span>
                        </Link>
                      ) : book.isFree ? (
                        <Link
                          href={`/books/${book.slug}`}
                          className="px-3 py-2 rounded-xl bg-emerald-500 text-white font-black text-xs flex items-center gap-1 shadow-md"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>قراءة الآن</span>
                        </Link>
                      ) : (
                        <Link
                          href={`/checkout?bookId=${book.id}`}
                          className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-xs flex items-center gap-1 shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
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
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold">
            📚
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">لم يتم العثور على مذكرات مطابقة</h3>
          <p className="text-xs text-zinc-400">
            جرب البحث بكلمات أخرى أو اختر قسماً آخر من الأقسام المتاحة.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setPriceFilter('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 text-xs font-bold"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      )}

    </div>
  );
}
