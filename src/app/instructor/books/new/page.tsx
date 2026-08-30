'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  Upload,
  Sparkles,
  Shield,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import FileUploadInput from '@/components/FileUploadInput';

export default function NewBookPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [pageCount, setPageCount] = useState('40');
  const [previewPagesCount, setPreviewPagesCount] = useState('4');
  const [price, setPrice] = useState('50');
  const [compareAtPrice, setCompareAtPrice] = useState('90');
  const [isFree, setIsFree] = useState(false);
  const [category, setCategory] = useState('ملخصات');
  const [academicSubject, setAcademicSubject] = useState('');
  const [academicLevel, setAcademicLevel] = useState('الفرقة الأولى');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('يرجى ملء عنوان ووصف المذكرة');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/instructor/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          shortDescription,
          coverImage,
          fileUrl: fileUrl || '/uploads/sample_notes.pdf',
          pageCount: Number(pageCount) || 30,
          previewPagesCount: Number(previewPagesCount) || 3,
          price: isFree ? 0 : Number(price) || 0,
          compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
          isFree,
          category,
          academicSubject,
          academicLevel,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'فشل حفظ ونشر المذكرة');
      } else {
        router.push(`/books/${data.book.slug}`);
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 pb-16">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
        <Link href="/instructor/books" className="hover:text-white transition-colors">
          ← إدارة المذكرات
        </Link>
        <span>/</span>
        <span className="text-amber-500">نشر مذكرة جديدة</span>
      </div>

      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl space-y-8">
        
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نشر مذكرة رقمية مشفرة</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            إضافة مذكرة أو كتاب دراسي جديد
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            سيتم حماية ملفك تلقائياً بنظام DRM ولن يتمكن أي مستخدم من تحميله أو طباعته.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
              1. البيانات الأساسية للمذكرة
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                عنوان المذكرة / الكتاب *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: الملخص الذهبي في هندسة البرمجيات وتصميم النظم"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                  نوع المحتوى
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                >
                  <option value="ملخصات">ملخصات وشروحات</option>
                  <option value="كتب ومراجع">كتب ومراجع كاملة</option>
                  <option value="بنك أسئلة">بنوك أسئلة وامتحانات</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                  المادة / المسار
                </label>
                <input
                  type="text"
                  value={academicSubject}
                  onChange={(e) => setAcademicSubject(e.target.value)}
                  placeholder="مثال: هندسة البرمجيات"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                  الفرقة / المستوى الدراسي
                </label>
                <input
                  type="text"
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value)}
                  placeholder="مثال: الفرقة الثالثة والرابعة"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                نبذة مختصرة (تظهر في الكارت)
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="ملخص مكثف لأهم المفاهيم مع أمثلة عملية محلولة..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                الوصف التفصيلي والفهرس *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اشرح محاور المذكرة بالتفصيل وما يستفيده الطالب من شرائها..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* 2. File Upload & Security */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              2. رفع ملف الـ PDF وصورة الغلاف
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FileUploadInput
                  label="صورة غلاف المذكرة (اختياري)"
                  accept="image/*"
                  folder="book_covers"
                  currentValue={coverImage}
                  onUploadComplete={(url) => setCoverImage(url)}
                  helperText="صورة جذابة للغلاف (PNG / JPG)"
                />
              </div>

              <div>
                <FileUploadInput
                  label="ملف المذكرة (PDF) *"
                  accept="application/pdf"
                  folder="protected_books"
                  currentValue={fileUrl}
                  onUploadComplete={(url) => setFileUrl(url)}
                  helperText="ملف الـ PDF المحمي والمشفر"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                  إجمالي عدد صفحات المذكرة
                </label>
                <input
                  type="number"
                  min={1}
                  value={pageCount}
                  onChange={(e) => setPageCount(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                  عدد صفحات المعاينة المجانية للطلاب
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={previewPagesCount}
                  onChange={(e) => setPreviewPagesCount(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Pricing */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              3. خيارات التسعير والاشتراك
            </h3>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700">
              <input
                type="checkbox"
                id="isFreeCheck"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="isFreeCheck" className="text-xs font-bold text-slate-800 dark:text-zinc-200 cursor-pointer">
                إتاحة هذه المذكرة مجاناً 100% لجميع الطلاب (كهدية جذب)
              </label>
            </div>

            {!isFree && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                    سعر البيع للطالب (ج.م) *
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="مثال: 50"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                    السعر قبل الخصم (ج.م - اختياري)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="مثال: 90"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/25 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{loading ? 'جارٍ النشر والتشفير...' : 'حفظ ونشر المذكرة في المتجر الآن'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
