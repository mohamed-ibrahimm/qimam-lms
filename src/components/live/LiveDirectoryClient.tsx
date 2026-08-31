'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Radio,
  Lock,
  Unlock,
  Users,
  Sparkles,
  Clock,
  Video,
  Play,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  ShieldCheck,
  Award,
  GraduationCap,
  MessageSquare,
  Hand,
  Flame,
  ArrowLeft,
  ChevronLeft,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export interface LiveSessionItem {
  id: string;
  roomId: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  courseDiscountPrice?: number | null;
  courseCategory?: string;
  courseThumbnail?: string | null;
  topic: string;
  status: 'LIVE_NOW' | 'SCHEDULED';
  scheduledFor?: string;
  viewerCount: number;
  instructor: {
    id: string;
    name: string;
    avatar?: string | null;
    isStudentInstructor?: boolean;
    university?: string | null;
  };
  isEnrolled: boolean;
}

interface LiveDirectoryClientProps {
  sessions: LiveSessionItem[];
  currentUser: any;
  platformName: string;
}

export default function LiveDirectoryClient({
  sessions,
  currentUser,
  platformName,
}: LiveDirectoryClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'live'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isInstructorOrAdmin = currentUser?.role === 'INSTRUCTOR' || currentUser?.role === 'ADMIN';

  // Filter sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      // Tab filter
      if (activeTab === 'my' && !s.isEnrolled) return false;
      if (activeTab === 'live' && s.status !== 'LIVE_NOW') return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          s.courseTitle.toLowerCase().includes(q) ||
          s.topic.toLowerCase().includes(q) ||
          s.instructor.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [sessions, activeTab, searchQuery]);

  const liveCount = sessions.filter((s) => s.status === 'LIVE_NOW').length;
  const enrolledCount = sessions.filter((s) => s.isEnrolled).length;

  return (
    <div className="min-h-screen relative text-right pb-24 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* =========================================================================
          1. TOP HERO HEADER WITH LIVE STREAM PULSE
         ========================================================================= */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-rose-950/40 via-purple-950/20 to-black/60 border-2 border-rose-500/30 shadow-[0_20px_60px_rgba(244,63,94,0.15)] backdrop-blur-2xl relative overflow-hidden space-y-6">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/15 rounded-full blur-[110px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <Radio className="w-3.5 h-3.5" />
              <span>قاعات البث المباشر التفاعلي (Interactive Live Studio)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              شاهد البثوث المباشرة وتفاعل مع محاضريك بالصوت والشاشة 🎙️
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
              محاضرات حية بجودة 1080p، مشاركة الشاشة، كويزات سريعة تفاعلية، إمكانية رفع اليد وفتح المايك للنقاش المباشر.
            </p>
          </div>

          {/* Instructor / Admin CTA to Launch Room */}
          {isInstructorOrAdmin && (
            <div className="shrink-0 w-full md:w-auto">
              <Link
                href="/live/instant-room"
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-yellow-400 text-white font-black text-xs sm:text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 hover:scale-105 transition-all cursor-pointer"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>إطلاق بث مباشر جديد لطلابك (Go Live) 🚀</span>
              </Link>
            </div>
          )}
        </div>

        {/* Live Metrics Bar */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">البثوث النشطة الآن</span>
              <span className="font-black text-rose-300 font-mono text-sm">🔴 {liveCount} بث مباشر</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">دوراتي المؤهل لحضورها</span>
              <span className="font-black text-amber-300 font-mono text-sm">{enrolledCount} دورة متاحة</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">كويزات ومسابقات حية</span>
              <span className="font-black text-purple-300 text-sm">Kahoot & Scores 🏆</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">حماية البث ومشاركتها</span>
              <span className="font-black text-emerald-300 text-sm">Dynamic Watermark 🔒</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. FILTER TABS & SEARCH BAR
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-zinc-900/90 border border-slate-200 dark:border-white/10 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            كافة البثوث ({sessions.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('live')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'live'
                ? 'bg-rose-600 text-white shadow-md font-black'
                : 'text-slate-600 dark:text-zinc-400 hover:text-rose-500'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span>مباشر الآن ({liveCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'my'
                ? 'bg-purple-600 text-white shadow-md font-black'
                : 'text-slate-600 dark:text-zinc-400 hover:text-purple-400'
            }`}
          >
            بثوث دوراتي المشترك بها ({enrolledCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن كورس، موضوع، أو محاضر..."
            className="w-full h-11 pr-10 pl-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* =========================================================================
          3. SESSIONS GRID (UNLOCKED VS LOCKED SMART EXPERIENCE)
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => {
          const isLive = session.status === 'LIVE_NOW';
          const isEnrolled = session.isEnrolled;

          return (
            <div
              key={session.id}
              className={`group relative rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                isEnrolled
                  ? 'bg-white/95 dark:bg-[#0e0a1f]/95 border-amber-500/40 hover:border-amber-400 shadow-xl shadow-amber-500/10 hover:-translate-y-1'
                  : 'bg-white/80 dark:bg-[#0c0918]/80 border-slate-200 dark:border-white/10 hover:border-purple-500/40 shadow-md'
              }`}
            >
              {/* Top Status Header */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  {isLive ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-black">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span>🔴 بث مباشر الآن</span>
                      <span className="font-mono text-zinc-300">({session.viewerCount} طالب)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>⏰ جلسة مجدولة قادمة</span>
                    </div>
                  )}

                  {/* Enrollment Status Pill */}
                  {isEnrolled ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-black flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>مشترك بالكورس</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[10px] font-black flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-500" />
                      <span>للمشتركين فقط</span>
                    </span>
                  )}
                </div>

                {/* Course Title & Topic */}
                <div className="space-y-1.5">
                  <span className="text-[10.5px] font-bold text-amber-600 dark:text-amber-400 block truncate">
                    {session.courseCategory || 'مسار هندسي معتمد'} • {session.courseTitle}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-500 transition-colors">
                    {session.topic}
                  </h3>
                </div>

                {/* Instructor Info Card */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 p-[1.5px] shrink-0">
                      <div className="w-full h-full rounded-full bg-[#08070e] flex items-center justify-center text-xs font-black text-amber-400">
                        {session.instructor.name[0] || 'م'}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-slate-900 dark:text-white block truncate">
                        {session.instructor.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 block truncate">
                        {session.instructor.isStudentInstructor ? `طالب معتمد • ${session.instructor.university || 'جامعة معتمدة'}` : 'محاضر وخبير معتمد'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500">
                    HD 1080p
                  </span>
                </div>
              </div>

              {/* Bottom Action Area (Smart Access) */}
              <div className="p-5 pt-0">
                {isEnrolled ? (
                  /* UNLOCKED: Direct Enter Room */
                  <Link
                    href={`/live/${session.roomId}`}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Radio className="w-4 h-4 animate-pulse text-zinc-950" />
                    <span>دخول البث المباشر الآن (متاح لك) 🚀</span>
                  </Link>
                ) : (
                  /* LOCKED: Subscribe to Course to Unlock */
                  <div className="space-y-2">
                    <Link
                      href={`/courses/${session.courseId}`}
                      className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-purple-900/50 dark:hover:bg-purple-900/80 text-white font-black text-xs sm:text-sm border border-purple-500/40 shadow-md flex items-center justify-between px-4 transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span>اشترك لفتح وحضور البث 🔓</span>
                      </div>
                      <span className="font-mono text-amber-300 font-black text-xs">
                        {formatPrice(session.courseDiscountPrice || session.coursePrice)}
                      </span>
                    </Link>
                    <p className="text-[10px] text-center text-slate-500 dark:text-zinc-400">
                      تحويل مباشر 100% عبر فودافون كاش أو إنستاباي
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSessions.length === 0 && (
        <div className="p-12 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-center space-y-3">
          <Radio className="w-8 h-8 text-zinc-400 mx-auto animate-pulse" />
          <h3 className="text-base font-black text-slate-800 dark:text-white">لا توجد بثوث تطابق بحثك حالياً</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
            تابع هذه الصفحة بانتظام لحضور المحاضرات الحية التي يطلقها المحاضرون على مدار اليوم.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveTab('all');
              setSearchQuery('');
            }}
            className="text-xs text-amber-500 font-black hover:underline cursor-pointer"
          >
            عرض كافة البثوث المتاحة
          </button>
        </div>
      )}

    </div>
  );
}