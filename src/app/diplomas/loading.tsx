import React from 'react';

export default function DiplomasLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="w-64 h-8 rounded-lg bg-slate-200 dark:bg-zinc-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-amber-400/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
        <div className="w-96 max-w-full h-4 rounded bg-slate-200 dark:bg-zinc-800/80 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-amber-400/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>

      {/* Diplomas Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 p-5 space-y-4 shadow-sm relative overflow-hidden"
          >
            <div className="w-full h-52 rounded-xl bg-slate-200 dark:bg-zinc-800" />
            <div className="w-24 h-4 rounded-full bg-slate-200 dark:bg-zinc-800" />
            <div className="w-4/5 h-6 rounded bg-slate-200 dark:bg-zinc-800" />
            <div className="w-full h-4 rounded bg-slate-200 dark:bg-zinc-800/80" />
            <div className="w-2/3 h-4 rounded bg-slate-200 dark:bg-zinc-800/80" />
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="w-28 h-5 rounded bg-slate-200 dark:bg-zinc-800" />
              <div className="w-24 h-10 rounded-full bg-slate-200 dark:bg-zinc-800" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-amber-400/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
        ))}
      </div>
    </div>
  );
}
