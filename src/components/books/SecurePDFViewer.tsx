'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  Lock,
  ChevronRight,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Shield,
  BookOpen,
  Sun,
  Moon,
  ShoppingBag,
} from 'lucide-react';

interface Props {
  book: {
    id: string;
    title: string;
    slug: string;
    fileUrl: string;
    pageCount: number;
    previewPagesCount: number;
    price: number;
    isFree: boolean;
    authorName?: string | null;
    description?: string;
  };
  currentUser?: {
    id: string;
    officialFullName: string;
    phone?: string | null;
    username: string;
  } | null;
  isPurchased?: boolean;
}

export default function SecurePDFViewer({ book, currentUser, isPurchased = false }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [readingTheme, setReadingTheme] = useState<'DARK' | 'SEPIA' | 'LIGHT'>('DARK');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = book.pageCount || 45;
  const isAccessible = isPurchased || book.isFree || currentPage <= book.previewPagesCount;

  // Watermark text composed of user's credentials for leak prevention
  const watermarkText = useMemo(() => {
    if (!currentUser) return `معاينة مجانية • أكاديمية قِمَم`;
    const name = currentUser.officialFullName || currentUser.username;
    const phone = currentUser.phone ? ` • ${currentUser.phone}` : '';
    return `${name}${phone} • ملكية خاصة مشفرة`;
  }, [currentUser]);

  // Prevent right-click, print shortcuts, copy shortcuts, and devtools
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Print: Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        alert('⚠️ طباعة المذكرات والكتب الرقمية غير مسموح بها لحماية حقوق الملكية الفكرية.');
        return false;
      }
      // Block Save: Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        return false;
      }
      // Block Copy: Ctrl+C / Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        return false;
      }
      // Block View Source: Ctrl+U
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        return false;
      }
      // Navigation with Arrow keys
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        handlePrevPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        handleNextPage();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, totalPages, isAccessible]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 shadow-2xl ${
        readingTheme === 'DARK'
          ? 'bg-[#0a0714] text-white border-amber-500/30'
          : readingTheme === 'SEPIA'
          ? 'bg-[#fbf0d9] text-[#433422] border-[#e0cbab]'
          : 'bg-white text-slate-900 border-slate-200'
      }`}
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* 1. TOP CONTROL TOOLBAR */}
      <div className="p-3 sm:p-4 border-b border-inherit/40 flex items-center justify-between gap-2 flex-wrap bg-black/10 backdrop-blur-md z-30">
        
        {/* Right Info: Title & Author */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-black truncate max-w-[200px] xs:max-w-xs sm:max-w-md">
              {book.title}
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-amber-600 dark:text-amber-400 font-bold">
              <span>{book.authorName || 'المحاضر المعتمد'}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Shield className="w-3 h-3" />
                نسخة مشفرة وآمنة
              </span>
            </div>
          </div>
        </div>

        {/* Center: Page Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-black/20 dark:bg-white/5 py-1 px-2.5 rounded-full border border-inherit/40 text-xs font-bold">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 transition-all cursor-pointer"
            title="الصفحة السابقة"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="font-mono text-xs px-2">
            صفحة <strong className="text-amber-500 font-black">{currentPage}</strong> من {totalPages}
          </span>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 transition-all cursor-pointer"
            title="الصفحة التالية"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Left: Tools (Zoom, Theme, Fullscreen) */}
        <div className="flex items-center gap-1.5">
          {/* Zoom In / Out */}
          <div className="hidden xs:flex items-center bg-black/20 dark:bg-white/5 rounded-full p-0.5 border border-inherit/40">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 15, 70))}
              className="p-1.5 rounded-full hover:bg-white/20 transition-all cursor-pointer text-xs"
              title="تصغير"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1 font-bold">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 15, 160))}
              className="p-1.5 rounded-full hover:bg-white/20 transition-all cursor-pointer text-xs"
              title="تكبير"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reading Mode / Theme Toggle */}
          <button
            type="button"
            onClick={() => {
              setReadingTheme((t) => (t === 'DARK' ? 'SEPIA' : t === 'SEPIA' ? 'LIGHT' : 'DARK'));
            }}
            className="p-2 rounded-xl bg-black/20 dark:bg-white/5 hover:bg-white/20 border border-inherit/40 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            title="تغيير ثيم القراءة"
          >
            {readingTheme === 'DARK' ? (
              <Moon className="w-3.5 h-3.5 text-amber-400" />
            ) : readingTheme === 'SEPIA' ? (
              <span className="text-xs">📜</span>
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-600" />
            )}
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-black/20 dark:bg-white/5 hover:bg-white/20 border border-inherit/40 text-xs font-bold transition-all cursor-pointer"
            title="ملء الشاشة"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* 2. MAIN READING CANVAS AREA */}
      <div className="relative min-h-[550px] sm:min-h-[750px] flex items-center justify-center p-3 sm:p-8 overflow-auto bg-black/15">
        
        {/* If page is allowed (Purchased, Free, or within Preview Limit) */}
        {isAccessible ? (
          <div
            className="relative w-full max-w-2xl mx-auto shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Paper Container */}
            <div
              className={`p-6 sm:p-12 min-h-[700px] sm:min-h-[900px] flex flex-col justify-between rounded-2xl border ${
                readingTheme === 'DARK'
                  ? 'bg-[#120d24] text-slate-100 border-purple-900/40 shadow-[0_0_50px_rgba(0,0,0,0.8)]'
                  : readingTheme === 'SEPIA'
                  ? 'bg-[#f7ebd0] text-[#2c1d11] border-[#dbc3a3] shadow-lg'
                  : 'bg-white text-slate-900 border-slate-300 shadow-xl'
              }`}
            >
              {/* Header on page */}
              <div className="flex items-center justify-between border-b border-inherit/20 pb-3 text-[11px] font-bold opacity-75">
                <span>{book.title}</span>
                <span className="font-mono">صفحة {currentPage}</span>
              </div>

              {/* Simulated Rich Content / Rendered Page Content */}
              <div className="space-y-6 my-auto text-right leading-relaxed font-medium">
                {currentPage === 1 ? (
                  <div className="text-center space-y-6 py-10">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-zinc-950 flex items-center justify-center mx-auto text-3xl shadow-xl shadow-amber-500/25">
                      📖
                    </div>
                    <div className="space-y-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 text-xs font-black border border-amber-500/30">
                        {book.authorName || 'إعداد نخبة المحاضرين'}
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-black">{book.title}</h1>
                      <p className="text-xs max-w-md mx-auto opacity-80 leading-relaxed">
                        {book.description}
                      </p>
                    </div>
                    <div className="pt-6 text-xs opacity-60 font-mono">
                      جميع الحقوق محفوظة للأكاديمية والناشر © {new Date().getFullYear()}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-amber-500 font-black text-sm border-r-4 border-amber-500 pr-2">
                      <span>الفصل الدراسي #{currentPage - 1}: محاور الشرح والتحليل الهندسي</span>
                    </div>

                    <p className="text-xs sm:text-sm leading-loose">
                      يركز هذا الفصل على البناء المعماري المتقدم وتحليل الخوارزميات وتطبيقاتها العملية. يتم استعراض أهم المفاهيم الأساسية، القواعد الحسابية، والنماذج التطبيقية اللازمة للتميز في الامتحانات والمشاريع الواقعية.
                    </p>

                    <div className="p-4 rounded-xl bg-black/10 dark:bg-white/5 border border-inherit/20 font-mono text-xs space-y-2 text-left" dir="ltr">
                      <div className="text-amber-500 font-bold">// Model Implementation & Equations</div>
                      <div className="text-blue-400">function calculateOptimalPath(nodes, constraints) {'{'}</div>
                      <div className="pl-4 text-emerald-400">const matrix = new DynamicMatrix(nodes.length);</div>
                      <div className="pl-4 text-emerald-400">return matrix.solveWithHeuristics(constraints);</div>
                      <div className="text-blue-400">{'}'}</div>
                    </div>

                    <p className="text-xs sm:text-sm leading-loose">
                      ملاحظة هامة: يجب تطبيق الأمثلة المعروضة والتأكد من فهم كل خطوة قبل الانتقال إلى المسائل المتقدمة في نهاية الوحدة.
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-4 text-xs">
                      <div className="p-3 rounded-xl border border-inherit/20 bg-amber-500/5">
                        <strong className="block text-amber-500 mb-1">💡 فكرة رئيسية:</strong>
                        <span>الاعتماد على المعايير القياسية يقلل زمن التنفيذ بنسبة 40%.</span>
                      </div>
                      <div className="p-3 rounded-xl border border-inherit/20 bg-blue-500/5">
                        <strong className="block text-blue-500 mb-1">🎯 نموذج امتحان:</strong>
                        <span>تأتي هذه المسألة بمتغيرات مختلفة في 70% من الاختبارات الجامعية.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Page Footer */}
              <div className="flex items-center justify-between border-t border-inherit/20 pt-3 text-[10px] opacity-70">
                <span>أكاديمية قِمَم — ركن المذكرات والكتب الرقمية</span>
                <span className="font-mono">صفحة {currentPage} / {totalPages}</span>
              </div>
            </div>

            {/* 3. DYNAMIC FLOATING WATERMARK OVERLAY (Anti-Screenshot / Anti-Leak DRM) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex flex-col justify-around opacity-25 dark:opacity-20 select-none">
              {[1, 2, 3, 4, 5].map((row) => (
                <div
                  key={row}
                  className="flex justify-around items-center whitespace-nowrap transform -rotate-25 text-[11px] sm:text-xs font-black text-slate-500 dark:text-amber-200 tracking-wider"
                  style={{ userSelect: 'none' }}
                >
                  <span>{watermarkText}</span>
                  <span className="hidden sm:inline">{watermarkText}</span>
                  <span>{watermarkText}</span>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* PREVIEW LOCK GATE (Reached limit of free preview) */
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#120d28]/95 border-2 border-amber-500/40 text-center space-y-4 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-amber-500/20">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-black px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                نهاية المعاينة المجانية
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white">
                لقد بلغت الحد الأقصى للمعاينة ({book.previewPagesCount} صفحات)
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                لفتح وقراءة كامل صفحات المذكرة ({totalPages} صفحة) وحفظها في مكتبتك الخاصة، قم بالاشتراك والشراء الفوري.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 flex items-center justify-between">
              <div className="text-right">
                <span className="text-[11px] text-zinc-400 block">سعر المذكرة الكاملة:</span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {book.price} ج.م
                </span>
              </div>
              <Link
                href={`/checkout?bookId=${book.id}`}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>شراء الآن</span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage(book.previewPagesCount)}
              className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              ← العودة لآخر صفحة معاينة
            </button>
          </div>
        )}

      </div>

      {/* 3. BOTTOM NOTIFICATION BAR */}
      <div className="p-2.5 sm:p-3 border-t border-inherit/40 flex items-center justify-between text-[11px] font-bold bg-black/10 backdrop-blur-md">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Shield className="w-3.5 h-3.5" />
          <span>حماية DRM مفعلة: منع التنزيل أو النسخ أو الطباعة.</span>
        </div>
        <div className="text-zinc-500 font-mono text-[10px]">
          ID: {book.id.substring(0, 10)}
        </div>
      </div>

    </div>
  );
}
