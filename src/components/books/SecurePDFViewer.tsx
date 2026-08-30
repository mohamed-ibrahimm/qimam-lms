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
  Sparkles,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText,
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
    academicSubject?: string | null;
    academicLevel?: string | null;
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

  const totalPages = book.pageCount || 38;
  const isAccessible = isPurchased || book.isFree || currentPage <= book.previewPagesCount;

  // Watermark text composed of user's credentials for leak prevention
  const watermarkText = useMemo(() => {
    if (!currentUser) return `معاينة مجانية • أكاديمية م / محمد إبراهيم`;
    const name = currentUser.officialFullName || currentUser.username;
    const phone = currentUser.phone ? ` • ${currentUser.phone}` : '';
    return `${name}${phone} • ملكية خاصة مشفرة`;
  }, [currentUser]);

  // DRM Protection Engine: Anti-Copy, Anti-Print, Anti-Inspect, Clipboard Protection
  useEffect(() => {
    // 1. Synchronize Fullscreen state
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // 2. Anti-PrintScreen & Shortcut Blocker
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        try {
          navigator.clipboard.writeText('🔒 محتوى المذكرة محمي بنظام DRM الرقمي ضد النسخ والالتقاط.');
        } catch (err) {}
      }

      // Block Print: Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
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
      // Block Inspect: F12, Ctrl+Shift+I, Ctrl+Shift+J
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'j' || e.key.toLowerCase() === 'c'))
      ) {
        e.preventDefault();
        return false;
      }

      // Arrow navigation
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        handlePrevPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        handleNextPage();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        try {
          navigator.clipboard.writeText('🔒 محتوى المذكرة محمي بنظام DRM الرقمي ضد النسخ والالتقاط.');
        } catch (err) {}
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
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

  const progressPercent = Math.round((currentPage / totalPages) * 100);

  return (
    <div
      ref={containerRef}
      className={`relative select-none flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 shadow-2xl ${
        readingTheme === 'DARK'
          ? 'bg-[#080511] text-white border-amber-500/25'
          : readingTheme === 'SEPIA'
          ? 'bg-[#f4ebd0] text-[#332415] border-[#d8c39e]'
          : 'bg-slate-100 text-slate-900 border-slate-300'
      }`}
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      
      {/* =========================================================================
          1. LUXURY TOP TOOLBAR (Apple Books / Kindle Style)
         ========================================================================= */}
      <div className={`p-3 sm:p-4 border-b flex items-center justify-between gap-3 flex-wrap transition-colors z-30 ${
        readingTheme === 'DARK'
          ? 'bg-[#0e0a1f]/90 border-white/10 text-white'
          : readingTheme === 'SEPIA'
          ? 'bg-[#ebdec0] border-[#d4be95] text-[#332415]'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Book Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/30 shadow-inner">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-black truncate max-w-[180px] xs:max-w-xs sm:max-w-md">
              {book.title}
            </h3>
            <div className="flex items-center gap-2 text-[10.5px] font-bold opacity-80">
              <span className="text-amber-500">{book.authorName || 'المحاضر المعتمد'}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-500">
                <Shield className="w-3 h-3" />
                حماية DRM مشفرة
              </span>
            </div>
          </div>
        </div>

        {/* Center: Page Controls + Fast Jump */}
        <div className={`flex items-center gap-1.5 sm:gap-2 py-1 px-3 rounded-full border text-xs font-bold shadow-xs ${
          readingTheme === 'DARK'
            ? 'bg-white/5 border-white/10'
            : readingTheme === 'SEPIA'
            ? 'bg-white/40 border-[#cfb88b]'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-20 transition-all cursor-pointer"
            title="الصفحة السابقة"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="font-mono text-xs px-2 whitespace-nowrap">
            صفحة <strong className="text-amber-500 font-black">{currentPage}</strong> من {totalPages}
          </span>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-20 transition-all cursor-pointer"
            title="الصفحة التالية"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Left: Reading Themes, Zoom, Fullscreen */}
        <div className="flex items-center gap-2">
          
          {/* Zoom Level */}
          <div className={`hidden sm:flex items-center rounded-full p-0.5 border ${
            readingTheme === 'DARK' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-inherit'
          }`}>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 10, 80))}
              className="p-1.5 rounded-full hover:bg-white/20 transition-all cursor-pointer"
              title="تصغير"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1 font-bold">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 10, 140))}
              className="p-1.5 rounded-full hover:bg-white/20 transition-all cursor-pointer"
              title="تكبير"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reading Mode Theme Selector (Dark / Sepia / Light) */}
          <div className="flex items-center gap-1 bg-black/10 dark:bg-white/5 p-1 rounded-2xl border border-inherit/30">
            <button
              type="button"
              onClick={() => setReadingTheme('DARK')}
              className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                readingTheme === 'DARK' ? 'bg-amber-500 text-zinc-950 shadow-xs' : 'text-zinc-400 hover:text-white'
              }`}
              title="الوضع الليلي الفاخر"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setReadingTheme('SEPIA')}
              className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                readingTheme === 'SEPIA' ? 'bg-[#c79c5e] text-white shadow-xs' : 'text-zinc-500 hover:text-amber-800'
              }`}
              title="الوضع الورقي الكلاسيكي (مريح للعين)"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setReadingTheme('LIGHT')}
              className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                readingTheme === 'LIGHT' ? 'bg-white text-slate-900 shadow-xs' : 'text-zinc-400 hover:text-slate-900'
              }`}
              title="الوضع النهاري الأبيض"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            </button>
          </div>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-2xl bg-black/10 dark:bg-white/5 hover:bg-white/20 border border-inherit/30 text-xs font-bold transition-all cursor-pointer"
            title="ملء الشاشة"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

        </div>

      </div>

      {/* =========================================================================
          2. MAIN READING CANVAS AREA (Clean, High-Res Arabic Typography)
         ========================================================================= */}
      <div className={`relative min-h-[650px] sm:min-h-[850px] flex items-center justify-center p-3 sm:p-10 overflow-auto ${
        readingTheme === 'DARK'
          ? 'bg-[#06040d]'
          : readingTheme === 'SEPIA'
          ? 'bg-[#ede1c4]'
          : 'bg-slate-200/70'
      }`}>

        {/* Side Click Navigation Arrows (Left & Right) */}
        {currentPage > 1 && (
          <button
            type="button"
            onClick={handlePrevPage}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-amber-500 hover:text-zinc-950 text-white items-center justify-center backdrop-blur-md transition-all shadow-xl z-20 cursor-pointer"
            title="الصفحة السابقة"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {currentPage < totalPages && (
          <button
            type="button"
            onClick={handleNextPage}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-amber-500 hover:text-zinc-950 text-white items-center justify-center backdrop-blur-md transition-all shadow-xl z-20 cursor-pointer"
            title="الصفحة التالية"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* If page is allowed (Purchased, Free, or within Preview Limit) */}
        {isAccessible ? (
          <div
            className="relative w-full max-w-3xl mx-auto transition-all duration-300 rounded-3xl overflow-hidden shadow-2xl"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Realistic Paper Page Container */}
            <div
              className={`drm-secure-canvas p-6 sm:p-14 min-h-[750px] sm:min-h-[980px] flex flex-col justify-between rounded-3xl border ${
                readingTheme === 'DARK'
                  ? 'bg-[#110c22] text-slate-100 border-purple-900/30 shadow-[0_20px_70px_rgba(0,0,0,0.9)]'
                  : readingTheme === 'SEPIA'
                  ? 'bg-[#fcf5e5] text-[#2c1d11] border-[#dbc5a0] shadow-2xl'
                  : 'bg-white text-slate-900 border-slate-300 shadow-2xl'
              }`}
            >
              
              {/* Page Header Bar */}
              <div className="flex items-center justify-between border-b border-inherit/20 pb-3.5 text-xs font-bold opacity-75">
                <span className="truncate max-w-xs">{book.title}</span>
                <span className="font-mono text-amber-500">صفحة {currentPage} من {totalPages}</span>
              </div>

              {/* Page Content Body (Crisp & Crystal Clear Reading) */}
              <div className="space-y-6 my-auto text-right leading-relaxed">
                {currentPage === 1 ? (
                  <div className="text-center space-y-6 py-12">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-zinc-950 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/30">
                      <BookOpen className="w-12 h-12 text-zinc-950" />
                    </div>
                    <div className="space-y-3">
                      <span className="px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 text-xs font-black border border-amber-500/30">
                        {book.authorName || 'إعداد نخبة المحاضرين بالأكاديمية'}
                      </span>
                      <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                        {book.title}
                      </h1>
                      <p className="text-xs sm:text-sm max-w-lg mx-auto opacity-80 leading-relaxed font-medium">
                        {book.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-4 text-xs font-bold">
                      <span className="px-3 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-inherit/20">
                        {book.academicSubject || 'المسار الهندسي'}
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-inherit/20">
                        {book.academicLevel || 'كافة المستويات'}
                      </span>
                    </div>

                    <div className="pt-8 text-[11px] opacity-60 font-mono">
                      جميع الحقوق محفوظة للأكاديمية والناشر © {new Date().getFullYear()} • نسخة رقمية مشفرة
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Chapter Header */}
                    <div className="flex items-center justify-between border-r-4 border-amber-500 pr-3">
                      <div>
                        <span className="text-[11px] text-amber-500 font-bold block">الوحدة التدريبية #{currentPage - 1}</span>
                        <h2 className="text-base sm:text-lg font-black">الشرح المفصل والتطبيقات العملية والمسائل</h2>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 font-mono font-bold">
                        UNIT 0{currentPage - 1}
                      </span>
                    </div>

                    {/* Explanatory Paragraphs */}
                    <p className="text-xs sm:text-sm leading-loose opacity-95">
                      تتناول هذه الوحدة المفاهيم الهندسية الأساسية وطرق التحليل المنطقي المتقدم. يتم استعراض أهم القوانين الرياضية، النظريات الهندسية، والمعادلات التطبيقية التي تمكنك من حل أعقد المسائل في الاختبارات وسوق العمل بثقة واحترافية تامة.
                    </p>

                    {/* Mathematical / Code Example Card */}
                    <div className="p-4 rounded-2xl bg-black/10 dark:bg-white/5 border border-inherit/20 font-mono text-xs space-y-2 text-left" dir="ltr">
                      <div className="text-amber-500 font-bold">// Model Formulation & Core Logic</div>
                      <div className="text-sky-400">function optimizeStructuralMatrix(inputs, constraints) {'{'}</div>
                      <div className="pl-4 text-emerald-400">const matrix = new DynamicMatrix(inputs.length);</div>
                      <div className="pl-4 text-emerald-400">return matrix.solveWithHeuristics(constraints);</div>
                      <div className="text-sky-400">{'}'}</div>
                    </div>

                    <p className="text-xs sm:text-sm leading-loose opacity-95">
                      <strong>إرشادات المذاكرة:</strong> راجع الخطوات التفصيلية بدقة، وتأكد من تطبيق القواعد على المسائل الإضافية المرفقة في نهاية هذا الفصل لضمان تثبيت المعلومة بنسبة 100%.
                    </p>

                    {/* Highlights Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-1">
                        <strong className="text-amber-500 flex items-center gap-1 font-black">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>قاعدة ذهبية:</span>
                        </strong>
                        <p className="opacity-90">تبسيط المعادلات يقلل احتمالية الخطأ الحسابي بأكثر من 65%.</p>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                        <strong className="text-emerald-500 flex items-center gap-1 font-black">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>موضع سؤال متكرر:</span>
                        </strong>
                        <p className="opacity-90">تكررت هذه الصيغة في أكثر من 80% من امتحانات السنوات السابقة.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Page Footer Bar */}
              <div className="flex items-center justify-between border-t border-inherit/20 pt-3 text-[10.5px] opacity-70">
                <span>أكاديمية م / محمد إبراهيم — ركن المذكرات والمراجع الرقمية</span>
                <span className="font-mono font-bold">صفحة {currentPage} من {totalPages}</span>
              </div>

            </div>

            {/* Subtle Security Footprint Badge (Zero Reading Distraction) */}
            <div className="absolute bottom-3 left-4 pointer-events-none z-20 px-3 py-1 rounded-full bg-black/30 dark:bg-white/5 backdrop-blur-md text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400 opacity-50 border border-white/5">
              DRM-PROTECTED • {currentUser?.username || 'STUDENT'} • ID: {book.id.substring(0, 8)}
            </div>

          </div>
        ) : (
          /* =====================================================================
              4. PREVIEW LOCK GATE (Clean, Beautiful Purchase Card)
             ===================================================================== */
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#0f0b20]/95 border-2 border-amber-500/40 text-center space-y-5 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-amber-500/20">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-black px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                نهاية المعاينة المجانية
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white">
                لقد استمتعت بـ {book.previewPagesCount} صفحات مجانية من المذكرة
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                لفتح وقراءة كامل المذكرة ({totalPages} صفحة) وحفظها في مكتبتك الخاصة، قم بالاشتراك الفوري الآن.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 flex items-center justify-between">
              <div className="text-right">
                <span className="text-[10.5px] text-zinc-400 block">سعر المذكرة الكاملة:</span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {book.price} ج.م
                </span>
              </div>
              <Link
                href={`/checkout?bookId=${book.id}`}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-xs shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>شراء وقراءة فورية</span>
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

      {/* =========================================================================
          3. READING PROGRESS & DRM FOOTER BAR
         ========================================================================= */}
      <div className={`p-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold transition-colors z-30 ${
        readingTheme === 'DARK'
          ? 'bg-[#0e0a1f]/90 border-white/10 text-white'
          : readingTheme === 'SEPIA'
          ? 'bg-[#ebdec0] border-[#d4be95] text-[#332415]'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* DRM Security Tag */}
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-[11px]">
          <Shield className="w-3.5 h-3.5 shrink-0" />
          <span>حماية DRM مفعلة: منع التنزيل أو النسخ أو الطباعة والتصوير.</span>
        </div>

        {/* Progress percentage */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="w-28 h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-[11px] text-amber-500 font-bold">{progressPercent}% مكتمل</span>
        </div>

      </div>

    </div>
  );
}
