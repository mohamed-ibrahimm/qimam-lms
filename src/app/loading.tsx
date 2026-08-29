import React from 'react';

export default function RootLoading() {
  return (
    <div className="w-full min-h-[65vh] flex flex-col items-center justify-center px-4 py-12 animate-pulse">
      {/* Central luxury shimmering emblem */}
      <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-zinc-800/80 border border-slate-300/80 dark:border-amber-500/20 flex items-center justify-center shadow-lg relative overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-amber-400/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Shimmering placeholder lines */}
      <div className="w-48 h-5 rounded-full bg-slate-200 dark:bg-zinc-800 mb-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-amber-400/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>
      <div className="w-72 h-3.5 rounded-full bg-slate-200 dark:bg-zinc-850 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-amber-400/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Grid of luxury card skeletons */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 p-4 space-y-4 shadow-sm relative overflow-hidden"
          >
            <div className="w-full h-44 rounded-xl bg-slate-200 dark:bg-zinc-800" />
            <div className="w-3/4 h-5 rounded bg-slate-200 dark:bg-zinc-800" />
            <div className="w-1/2 h-3.5 rounded bg-slate-200 dark:bg-zinc-800" />
            <div className="w-full h-10 rounded-xl bg-slate-200 dark:bg-zinc-800 mt-2" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-amber-400/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
        ))}
      </div>
    </div>
  );
}
