'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Headphones } from 'lucide-react';

export default function FloatingSupportWidget() {
  const pathname = usePathname();

  // Don't show in focused learning classroom or admin pages
  if (pathname.startsWith('/learn') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <aside aria-label="الدعم الفني المباشر">
      <Link
        href="/support"
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white/95 dark:bg-zinc-900/95 border border-indigo-200/90 dark:border-indigo-500/40 shadow-xl shadow-indigo-500/15 dark:shadow-indigo-950/50 hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-105 transition-all backdrop-blur-xl"
        title="تواصل مع فريق الدعم الفني للأكاديمية"
      >
        {/* Dynamic Multi-Color Rotating Halo Behind Icon */}
        <div className="relative flex items-center justify-center shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30 relative">
            <Headphones className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            {/* Live Green Online Beacon */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 shadow-xs animate-pulse" />
          </div>
        </div>

        {/* Text Container */}
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold leading-none">
              متواجدون للمساعدة
            </span>
          </div>
          <span className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-amber-300 transition-colors leading-tight mt-0.5 whitespace-nowrap">
            الدعم الفني 🎧
          </span>
        </div>
      </Link>
    </aside>
  );
}
