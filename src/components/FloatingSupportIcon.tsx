'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Headphones } from 'lucide-react';

export default function FloatingSupportIcon() {
  const pathname = usePathname();

  // Don't show in learning classroom or admin panel
  if (pathname.startsWith('/learn') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <Link
      href="/support"
      className="fixed bottom-5 right-4 sm:right-6 z-40 group flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      title="الدعم الفني المباشر"
      aria-label="تواصل مع فريق الدعم الفني"
    >
      <div className="relative flex items-center justify-center">
        {/* Pulsing Aura Blur */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-500/40 to-blue-600/40 blur-sm group-hover:blur-md transition-all animate-pulse pointer-events-none" />
        
        {/* Main Circular Button */}
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-indigo-500 to-amber-300 shadow-xl shadow-amber-500/15 group-hover:shadow-amber-500/35">
          <div className="w-full h-full rounded-full bg-[#0c0918] flex items-center justify-center border border-amber-400/30 backdrop-blur-xl transition-colors group-hover:bg-[#161030]">
            <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Live Active Status Green Beacon */}
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#0c0918]" />
        </span>

        {/* Floating Tooltip Label (Desktop only) */}
        <span className="hidden lg:block absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-[#0c0918]/95 border border-amber-500/30 text-amber-300 text-xs font-bold whitespace-nowrap shadow-2xl opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none">
          الدعم الفني 🎧
        </span>
      </div>
    </Link>
  );
}
