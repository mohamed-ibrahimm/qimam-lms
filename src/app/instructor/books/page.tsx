import React from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Sparkles,
  Shield,
  Eye,
  ShoppingBag,
  TrendingUp,
  Star,
  ArrowRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function InstructorBooksPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    redirect('/login?callbackUrl=/instructor/books');
  }

  const books = await prisma.digitalBook.findMany({
    where: user.role === 'ADMIN' ? {} : { instructorId: user.id },
    include: {
      purchases: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalSales = books.reduce((sum, b) => sum + (b.salesCount || 0), 0);
  const totalRevenue = books.reduce((sum, b) => sum + ((b.salesCount || 0) * (b.price || 0)), 0);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-amber-500 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>استوديو المحاضر • ركن المذكرات الرقمية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            إدارة المذكرات والكتب الرقمية
          </h1>
          <p className="text-xs text-slate-600 dark:text-zinc-400">
            انشر مذكراتك المحمية وحدد أسعارها وتابع مبيعاتك وأرباحك اللحظية.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/instructor/books/new"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>نشر مذكرة / كتاب جديد</span>
          </Link>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-bold">
            <span>إجمالي المذكرات المنشورة</span>
            <BookOpen className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {books.length} مذكرة
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-bold">
            <span>إجمالي عدد المشتركين</span>
            <ShoppingBag className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {totalSales} طالب
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-bold">
            <span>إجمالي الإيرادات التقديرية</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-amber-500 font-mono">
            {totalRevenue.toLocaleString()} ج.م
          </div>
        </div>
      </div>

      {/* 3. BOOKS LIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">
          قائمة مذكراتك المنشورة
        </h2>

        {books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-md space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      {book.category}
                    </span>
                    <span className="text-xs font-mono font-black text-emerald-500">
                      {book.isFree ? 'مجانية' : `${book.price} ج.م`}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2">
                    {book.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
                    {book.shortDescription || book.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold text-zinc-400">
                  <span>👥 {book.salesCount} مبيعة</span>
                  <span>📄 {book.pageCount} صفحة</span>
                  <Link
                    href={`/books/${book.slug}`}
                    className="text-amber-500 hover:text-amber-400 flex items-center gap-1 font-black"
                  >
                    <span>معاينة</span>
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto text-2xl">
              ✍️
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              لم تقم بنشر أي مذكرات أو كتب حتى الآن
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              ابدأ الآن برفع مذكراتك وملخصاتك بصيغة PDF وتحديد سعرها لبدء تحقيق أرباح مباشرة.
            </p>
            <div className="pt-2">
              <Link
                href="/instructor/books/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-zinc-950 font-black text-xs shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>رفع أول مذكرة الآن</span>
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
