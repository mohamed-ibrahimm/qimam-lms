'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Shield,
  Star,
  CheckCircle,
  ShoppingBag,
  Eye,
  Lock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Calendar,
  Layers,
  GraduationCap,
  Award,
  AlertCircle,
  FileText,
  CheckCircle2,
  User,
  Flame,
  Clock,
  Share2,
  Bookmark,
  ExternalLink,
  BookMarked,
  Download,
  Info,
} from 'lucide-react';
import SecurePDFViewer from '@/components/books/SecurePDFViewer';

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
    bio?: string | null;
    isStudentInstructor: boolean;
    studentUniversity?: string | null;
    studentFaculty?: string | null;
  };
}

interface Props {
  book: BookItem;
  isPurchased: boolean;
  relatedBooks: BookItem[];
  currentUser: {
    id: string;
    officialFullName: string;
    phone?: string | null;
    username: string;
  } | null;
}

export default function BookDetailClient({
  book,
  isPurchased,
  relatedBooks,
  currentUser,
}: Props) {
  const [activeTab, setActiveTab] = useState<'READER' | 'CONTENTS' | 'AUTHOR' | 'SECURITY'>('READER');
  const [copiedLink, setCopiedLink] = useState(false);

  const discount = book.compareAtPrice && book.compareAtPrice > book.price
    ? Math.round(((book.compareAtPrice - book.price) / book.compareAtPrice) * 100)
    : (book.isFree || book.price === 0 ? 100 : null);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getAuthorAvatar = () => {
    if (book.instructor?.avatarUrl && book.instructor.avatarUrl.trim()) {
      return book.instructor.avatarUrl;
    }
    const name = book.authorName || '';
    if (name.includes('إبراهيم')) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
    if (name.includes('طارق')) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
    if (name.includes('عبد الرحمن')) return 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400';
    if (name.includes('أحمد')) return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400';
    return null;
  };

  const authorAvatar = getAuthorAvatar();

  return (
    <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 space-y-10 sm:space-y-12">
      
      {/* =========================================================================
          1. BREADCRUMBS & TOP QUICK BAR
         ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-amber-500 transition-colors flex items-center gap-1">
            <span>الرئيسية</span>
          </Link>
          <span>/</span>
          <Link href="/books" className="hover:text-amber-500 transition-colors flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>المكتبة والمذكرات الرقمية</span>
          </Link>
          <span>/</span>
          <span className="text-amber-600 dark:text-amber-400 truncate max-w-[200px] sm:max-w-xs font-black">
            {book.title}
          </span>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-slate-700 dark:text-zinc-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'تم نسخ الرابط!' : 'مشاركة المذكرة'}</span>
        </button>
      </div>

      {/* =========================================================================
          2. GRAND MASTERCLASS HERO STAGE (3D Cover, Author Card, & Purchase Box)
         ========================================================================= */}
      <div className="relative rounded-[36px] overflow-hidden p-6 sm:p-10 lg:p-12 border-2 border-slate-200/80 dark:border-amber-500/30 bg-white dark:bg-gradient-to-br dark:from-[#0c081e] dark:via-[#140e2b] dark:to-[#0a0618] shadow-xl dark:shadow-[0_25px_70px_rgba(0,0,0,0.8)]">
        
        {/* Dynamic Glowing Ambiance */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[350px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* =========================================================
              LEFT: 3D REALISTIC BOOK COVER (Col 1-4)
             ========================================================= */}
          <div className="lg:col-span-4 flex flex-col items-center space-y-5">
            
            {/* 3D Realistic Cover */}
            <div className="group relative w-full max-w-[320px] aspect-[3/4] rounded-3xl overflow-hidden bg-slate-950 border-2 border-amber-500/40 shadow-2xl shadow-purple-950/30 transition-transform duration-500 hover:scale-[1.02]">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 p-6 text-center text-white space-y-4">
                  <BookOpen className="w-16 h-16 text-amber-400" />
                  <span className="text-sm font-black">{book.title}</span>
                </div>
              )}

              {/* Glossy Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {/* Top Category Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-400 text-xs font-black border border-amber-500/40 shadow-lg">
                  {book.category}
                </span>
              </div>

              {/* Top Discount Tag */}
              {discount && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black shadow-lg">
                    وفّر {discount}%
                  </span>
                </div>
              )}

              {/* Bottom HD Pages Ribbon */}
              <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-xs font-bold text-white z-10">
                <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md font-mono border border-white/10">
                  {book.pageCount} صفحة HD
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-500 text-zinc-950 font-black shadow-md">
                  معاينة {book.previewPagesCount} صفحات
                </span>
              </div>
            </div>

            {/* DRM Security Trust Chip */}
            <div className="w-full max-w-[320px] p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-black flex items-center justify-center gap-2 text-center shadow-xs">
              <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>نسخة مشفرة ومحمية بنظام DRM Shield</span>
            </div>

          </div>

          {/* =========================================================
              CENTER: METADATA & HEADLINE & VALUE PILLARS (Col 5-8)
             ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Category & Subject Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-black">
              <span className="px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                {book.category}
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700">
                {book.academicSubject || 'التأهيل الهندسي والوظيفي'}
              </span>
              {book.academicLevel && (
                <span className="px-3.5 py-1.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                  {book.academicLevel}
                </span>
              )}
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-slate-900 dark:text-white leading-[1.2] tracking-tight">
              {book.title}
            </h1>

            {/* Subtitle Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed font-medium">
              {book.shortDescription || book.description}
            </p>

            {/* INSTRUCTOR / AUTHOR PROFILE CARD (The requested luxury element) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-[2px] shrink-0 shadow-md">
                  <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden flex items-center justify-center text-sm font-black text-amber-300">
                    {authorAvatar ? (
                      <img src={authorAvatar} alt={book.authorName || ''} className="w-full h-full object-cover" />
                    ) : (
                      <span>{book.authorName?.[0] || 'م'}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-black border-2 border-zinc-950">
                    ✓
                  </div>
                </div>

                <div className="min-w-0 text-right space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-black text-slate-900 dark:text-white truncate block">
                      {book.authorName || book.instructor?.officialFullName || 'المحاضر المعتمد'}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                      مؤلف موثق
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">
                    {book.instructor?.bio || book.academicSubject || 'عضو هيئة التدريس بالأكاديمية'}
                  </p>
                </div>
              </div>

              <div className="text-left shrink-0">
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 block font-bold">التقييم العام</span>
                <span className="text-sm font-black text-amber-600 dark:text-amber-400 flex items-center gap-1 font-mono">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  {book.rating.toFixed(1)} / 5.0
                </span>
              </div>
            </div>

            {/* 4 Value Pillars Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-center text-xs font-bold">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200">
                <span className="text-zinc-400 text-[10px] block">المشتركون</span>
                <span className="text-sm font-black font-mono text-slate-900 dark:text-amber-400">+{book.salesCount} طالب</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200">
                <span className="text-zinc-400 text-[10px] block">عدد الصفحات</span>
                <span className="text-sm font-black font-mono text-slate-900 dark:text-amber-400">{book.pageCount} ص HD</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200">
                <span className="text-zinc-400 text-[10px] block">المعاينة المجانية</span>
                <span className="text-sm font-black font-mono text-slate-900 dark:text-emerald-400">{book.previewPagesCount} صفحات</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200">
                <span className="text-zinc-400 text-[10px] block">نظام الحماية</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">100% DRM</span>
              </div>
            </div>

          </div>

          {/* =========================================================
              RIGHT: FLOATING PURCHASE / ACCESS CARD (Col 9-12)
             ========================================================= */}
          <div className="lg:col-span-3 space-y-4">
            
            <div className="p-6 sm:p-7 rounded-[32px] bg-slate-50 dark:bg-[#120d28] border-2 border-amber-500/40 shadow-2xl space-y-5 text-right">
              
              {/* Pricing Box */}
              <div className="space-y-1">
                <span className="text-xs text-slate-500 dark:text-zinc-400 block font-bold">سعر المذكرة الكاملة:</span>
                {book.isFree || book.price === 0 ? (
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-emerald-500 font-mono">
                      مجاناً
                    </span>
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40">
                      هدية مجانية 100%
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-amber-400 font-mono">
                        {book.price} ج.م
                      </span>
                      {book.compareAtPrice && (
                        <span className="text-sm line-through text-zinc-400 font-mono">
                          {book.compareAtPrice} ج.م
                        </span>
                      )}
                    </div>
                    {discount && (
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-rose-600 text-white shadow-sm">
                        وفّر {discount}%
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Status Banner or CTA */}
              {isPurchased ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-black flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
                    <span>المذكرة مفعلة ومتاحة بالكامل في مكتبتك!</span>
                  </div>

                  <a
                    href="#reader-stage"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>الانتقال إلى القارئ وقراءة المذكرة</span>
                  </a>
                </div>
              ) : book.isFree || book.price === 0 ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-black flex items-center gap-2">
                    <Sparkles className="w-5 h-5 shrink-0 text-emerald-500" />
                    <span>هذه المذكرة مجانية بالكامل لجميع الطلاب!</span>
                  </div>

                  <a
                    href="#reader-stage"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>قراءة المذكرة كاملة الآن مجاناً</span>
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href={`/checkout?bookId=${book.id}`}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>شراء المذكرة الآن ({book.price} ج.م)</span>
                  </Link>

                  <a
                    href="#reader-stage"
                    className="w-full py-3 rounded-2xl bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-bold text-xs flex items-center justify-center gap-2 transition-all text-center"
                  >
                    <Eye className="w-4 h-4 text-amber-500" />
                    <span>معاينة {book.previewPagesCount} صفحات مجاناً بدون دفع</span>
                  </a>
                </div>
              )}

              {/* Guarantees List */}
              <div className="space-y-2.5 pt-3 border-t border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400 font-bold">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>معاينة فورية مجانية لأول {book.previewPagesCount} صفحات</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>حفظ دائم في مكتبتك وحسابك مدى الحياة</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>قراءة تفاعلية مع الوضع الليلي وSepia والزوم</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>حماية مشددة ضد التصوير والتسريب بالـ DRM</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =========================================================================
          3. INTERACTIVE TABS BAR (Reader vs Contents vs Author vs Security)
         ========================================================================= */}
      <div id="reader-stage" className="space-y-6 scroll-mt-24">
        
        {/* Tabs Bar */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab('READER')}
            className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'READER'
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
                : 'bg-white dark:bg-[#130e28] text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isPurchased || book.isFree ? 'قارئ المذكرة الكاملة' : `المعاينة التفاعلية (${book.previewPagesCount} صفحات)`}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CONTENTS')}
            className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'CONTENTS'
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
                : 'bg-white dark:bg-[#130e28] text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>فهرس ومحتويات المذكرة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AUTHOR')}
            className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'AUTHOR'
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
                : 'bg-white dark:bg-[#130e28] text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>عن المحاضر والمؤلف</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SECURITY')}
            className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'SECURITY'
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
                : 'bg-white dark:bg-[#130e28] text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>نظام الحماية DRM</span>
          </button>
        </div>

        {/* =========================================================
            TAB 1: SECURE PDF VIEWER
           ========================================================= */}
        {activeTab === 'READER' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600 dark:text-zinc-400 px-1">
              <span className="flex items-center gap-2 text-slate-900 dark:text-white font-black">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>القارئ التفاعلي عالي الدقة HD</span>
              </span>
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span>المحتوى مشفر ومحمي من التحميل والنسخ</span>
              </span>
            </div>

            {/* The PDF Reader Component */}
            <SecurePDFViewer
              book={book}
              currentUser={currentUser}
              isPurchased={isPurchased}
            />
          </div>
        )}

        {/* =========================================================
            TAB 2: DETAILED CONTENTS
           ========================================================= */}
        {activeTab === 'CONTENTS' && (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#120d28] border border-slate-200 dark:border-zinc-800 space-y-6 text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-black">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  الفهرس والمحاور الدراسية التفصيلية
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  نظرة شاملة على الموضوعات التي تغطيها هذه المذكرة
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
              <h4 className="text-sm font-black text-amber-600 dark:text-amber-400">الوصف الكامل للمذكرة:</h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
                {book.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {Array.from({ length: Math.min(book.pageCount, 6) }).map((_, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono font-bold flex items-center justify-center text-xs">
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      الوحدة {idx + 1}: تطبيقات وشروحات تفصيلية للمسائل
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    ص {idx * 4 + 1} - {(idx + 1) * 4}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: ABOUT AUTHOR
           ========================================================= */}
        {activeTab === 'AUTHOR' && (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#120d28] border border-slate-200 dark:border-zinc-800 space-y-6 text-right">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-[2px] shrink-0 shadow-lg">
                <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden flex items-center justify-center text-lg font-black text-amber-300">
                  {authorAvatar ? (
                    <img src={authorAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{book.authorName?.[0] || 'م'}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-center sm:text-right flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {book.authorName || book.instructor?.officialFullName || 'المحاضر المعتمد'}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 text-xs font-black border border-blue-500/30">
                    ✓ موثق رسمي
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-2xl font-medium">
                  {book.instructor?.bio || `محاضر ومتخصص في إعداد المذكرات والمراجع العلمية والهندسية بالأكاديمية.`}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs font-bold text-zinc-400">
                  <span>التخصص: <strong className="text-slate-900 dark:text-white">{book.academicSubject || 'هندسي'}</strong></span>
                  <span>•</span>
                  <span>المستوى: <strong className="text-slate-900 dark:text-white">{book.academicLevel || 'جامعي'}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: SECURITY & DRM
           ========================================================= */}
        {activeTab === 'SECURITY' && (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#120d28] border border-slate-200 dark:border-zinc-800 space-y-6 text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-black">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  ضمان الحماية الرقمية المشفرة (DRM Protection)
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  كيف تضمن المنصة حقوق المؤلف وحماية تجربة الطالب
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 space-y-2">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  <span>حظر التحميل والنسخ التلقائي</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  الملفات لا تُحمّل كـ PDF خام على الجهاز وإنما تُعرض عبر قارئ مشفر آمن يمنع استخراج النصوص أو إعادة النشر.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 space-y-2">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span>علامة مائية أمنية ذكية</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  تظهر بيانات الطالب المشفرة ديناميكياً على الصفحات كعلامة مائية غير مزعجة لمنع تصوير الشاشة وتسريب المحتوى.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          4. RELATED BOOKS & NOTES CAROUSEL
         ========================================================================= */}
      {relatedBooks.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                مذكرات ومراجع أخرى موصى بها
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                مذكرات دراسية متميزة في نفس المجال والمسار الأكاديمي
              </p>
            </div>

            <Link
              href="/books"
              className="text-xs font-black text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>عرض كافة المذكرات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBooks.map((rel) => (
              <Link
                key={rel.id}
                href={`/books/${rel.slug}`}
                className="group relative rounded-3xl bg-white dark:bg-[#110d24] border border-slate-200 dark:border-zinc-800 hover:border-amber-500/60 shadow-lg hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 rounded-2xl bg-slate-950 overflow-hidden shrink-0 border border-amber-500/30 shadow-md">
                    {rel.coverImage ? (
                      <img src={rel.coverImage} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-amber-400">
                        <BookOpen className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300">
                      {rel.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-500 transition-colors">
                      {rel.title}
                    </h4>
                    <span className="text-[11px] text-zinc-400 block truncate">
                      {rel.authorName || 'المحاضر المعتمد'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-amber-400 font-mono font-black">
                    {rel.isFree || rel.price === 0 ? 'مجاناً' : `${rel.price} ج.م`}
                  </span>
                  <span className="text-amber-500 group-hover:-translate-x-1 transition-transform flex items-center gap-1 font-black text-[11px]">
                    <span>قراءة الآن</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
