'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      }}
      className={`px-2.5 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700/80 bg-white dark:bg-zinc-900/90 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-amber-300 transition-all flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer ${className}`}
      title={theme === 'DARK' ? 'الوضع الحالي: ليلي — اضغط للتحويل للنهاري' : 'الوضع الحالي: نهاري — اضغط للتحويل لليلي'}
      aria-label="تبديل المظهر"
    >
      {theme === 'DARK' ? (
        <>
          <Moon className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[11px] font-bold text-zinc-300">ليلي</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[11px] font-bold text-zinc-800">نهاري</span>
        </>
      )}
    </button>
  );
}
