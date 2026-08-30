'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  UserCheck,
  Calendar,
  Layers,
  GraduationCap,
  Award,
  AlertCircle
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
  const [activeTab, setActiveTab] = useState<'READER' | 'ABOUT'>('READER');

  const discount = book.compareAtPrice && book.compareAtPrice > book.price
    ? Math.round(((book.compareAtPrice - book.price) / book.compareAtPrice) * 100)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* 1. BREADCRUMBS */}
      <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
        <Link href="/" className="hover:text-white transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/books" className="hover:text-white transition-colors">
          المكتبة والمذكرات
        </Link>
        <span>/</span>
        <span className="text-amber-500 truncate max-w-xs">{book.title}</span>
      </div>

      {/* 2. TOP SUMMARY BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
              {book.category}
            </span>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
              {book.academicSubject}
            </span>
            {book.academicLevel && (
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                {book.academicLevel}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
            {book.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            {book.description}
          </p>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 flex-wrap pt-2 text-xs font-bold text-slate-600 dark:text-zinc-400">
            <span className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-500" />
              {book.rating.toFixed(1)} تقييم الطلاب
            </span>
            <span>•</span>
            <span>{book.pageCount} صفحة</span>
            <span>•</span>
            <span>{book.salesCount} طالب مشترك</span>
            <span>•</span>
            <span className="text-emerald-500 flex items-center gap-1 font-bold">
              <Shield className="w-3.5 h-3.5" />
              حماية رقمية نشطة
            </span>
          </div>
        </div>

        {/* Purchase Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 block font-bold">سعر المذكرة:</span>
              {book.isFree || book.price === 0 ? (
                <span className="text-2xl font-black text-emerald-500 font-mono">
                  مجاناً
                </span>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-400 font-mono">
                    {book.price} ج.م
                  </span>
                  {book.compareAtPrice && (
                    <span className="text-xs line-through text-zinc-400 font-mono">
                      {book.compareAtPrice} ج.م
                    </span>
                  )}
                </div>
              )}
            </div>

            {discount && (
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-rose-600 text-white shadow-md">
                وفّر {discount}%
              </span>
            )}
          </div>

          {/* Ownership Status or CTA */}
          {isPurchased ? (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black flex items-center gap-2">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>المذكرة مفعلة ومتاحة بالكامل في حسابك!</span>
            </div>
          ) : book.isFree ? (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black flex items-center gap-2">
              <Sparkles className="w-5 h-5 shrink-0" />
              <span>هذه المذكرة مجانية بالكامل لجميع الطلاب!</span>
            </div>
          ) : (
            <Link
              href={`/checkout?bookId=${book.id}`}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>شراء المذكرة الآن ({book.price} ج.م)</span>
            </Link>
          )}

          {/* Value props */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-slate-600 dark:text-zinc-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>معاينة مجانية لأول {book.previewPagesCount} صفحات بدون دفع</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>وصول دائم مدى الحياة من حسابك</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>قراءة مريحة مع أوضاع الإضاءة والقراءة الليلية</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. SECURE IN-BROWSER PDF READER (Main Feature) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {isPurchased || book.isFree ? 'قارئ المذكرة الكاملة' : `المعاينة التفاعلية (${book.previewPagesCount} صفحات مجانية)`}
            </h2>
          </div>

          <span className="text-xs text-amber-500 font-bold flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            DRM مشفر ضد التحميل والتسريب
          </span>
        </div>

        {/* The Secure PDF Viewer */}
        <SecurePDFViewer
          book={book}
          currentUser={currentUser}
          isPurchased={isPurchased}
        />
      </div>

      {/* 4. AUTHOR / INSTRUCTOR CARD */}
      {book.instructor && (
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-[2px] shrink-0">
            <div className="w-full h-full rounded-2xl bg-zinc-950 flex items-center justify-center text-amber-400 font-black text-lg overflow-hidden">
              {book.instructor.avatarUrl ? (
                <img src={book.instructor.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                {book.authorName || book.instructor.officialFullName}
              </h4>
              {book.instructor.isStudentInstructor && (
                <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  محاضر طالب معتمد
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
              {book.instructor.bio || 'محاضر ومعد مذكرات معتمد على المنصة.'}
            </p>
          </div>
        </div>
      )}

      {/* 5. RELATED BOOKS */}
      {relatedBooks.length > 0 && (
        <div className="space-y-4 pt-6">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            مذكرات وكتب أخرى قد تهمك
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedBooks.map((rel) => (
              <Link
                key={rel.id}
                href={`/books/${rel.slug}`}
                className="group p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-amber-500/50 transition-all flex items-center gap-3 shadow-xs"
              >
                <div className="w-12 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-amber-500 font-bold block">{rel.category}</span>
                  <h5 className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">
                    {rel.title}
                  </h5>
                  <span className="text-[11px] font-mono text-slate-700 dark:text-zinc-300 font-bold">
                    {rel.isFree ? 'مجاناً' : `${rel.price} ج.م`}
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
