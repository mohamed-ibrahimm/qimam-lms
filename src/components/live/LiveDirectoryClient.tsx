'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Radio,
  Link as LinkIcon,
  Video,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Users,
  Copy,
  Check,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export interface LiveSessionItem {
  id: string;
  roomId: string;
  courseId: string;
  courseTitle: string;
  topic: string;
  status: 'LIVE_NOW' | 'SCHEDULED';
  viewerCount: number;
  instructor: {
    id: string;
    name: string;
    avatar?: string | null;
    isStudentInstructor?: boolean;
    university?: string | null;
  };
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
  const router = useRouter();
  const [inputLink, setInputLink] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isInstructorOrAdmin = currentUser?.role === 'INSTRUCTOR' || currentUser?.role === 'ADMIN';

  // Handle direct join by link or code
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    let trimmed = inputLink.trim();
    if (!trimmed) {
      setErrorMsg('يرجى لصق رابط البث المباشر أو كود الغرفة');
      return;
    }

    // Extract room ID if user pasted full URL (e.g. https://domain.com/live/my-room)
    if (trimmed.includes('/live/')) {
      const parts = trimmed.split('/live/');
      trimmed = parts[1]?.split('?')[0]?.split('#')[0] || '';
    } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      try {
        const url = new URL(trimmed);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        trimmed = pathSegments[pathSegments.length - 1] || '';
      } catch (e) {}
    }

    if (!trimmed) {
      setErrorMsg('الرابط غير صحيح، يرجى التأكد من رابط البث');
      return;
    }

    // Navigate to room
    router.push(`/live/${encodeURIComponent(trimmed)}`);
  };

  const handleCopyLink = (roomId: string) => {
    const fullUrl = `${window.location.origin}/live/${roomId}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(roomId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen relative text-right pb-24 space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* =========================================================================
          1. HERO HEADER: DIRECT LINK JOIN FOR STUDENTS
         ========================================================================= */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-rose-950/40 via-purple-950/20 to-black/80 border-2 border-rose-500/30 shadow-[0_20px_60px_rgba(244,63,94,0.15)] backdrop-blur-2xl relative overflow-hidden space-y-6">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/15 rounded-full blur-[110px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black mx-auto">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <Radio className="w-3.5 h-3.5" />
            <span>قاعة البث المباشر التفاعلية (Live Classroom)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            ادخل قاعة البث المباشر عبر رابط المحاضر 🎙️
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
            البثوث مجانية للطلاب عبر الرابط المباشر. الصق الرابط الذي أرسله لك المحاضر وادخل القاعة فوراً للمشاركة بالصوت والشاشة وحل الكويزات.
          </p>
        </div>

        {/* Quick Join Input Box */}
        <form onSubmit={handleJoin} className="max-w-2xl mx-auto space-y-3 pt-2">
          <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-2 rounded-2xl sm:rounded-full bg-slate-900/90 border-2 border-rose-500/40 shadow-2xl focus-within:border-amber-400 transition-all">
            <div className="relative flex-1 flex items-center">
              <LinkIcon className="w-4 h-4 text-rose-400 absolute right-4 pointer-events-none" />
              <input
                type="text"
                value={inputLink}
                onChange={(e) => setInputLink(e.target.value)}
                placeholder="الصق رابط البث هنا (مثال: https://.../live/math-101 أو كود الغرفة)..."
                className="w-full h-11 sm:h-12 pr-11 pl-4 bg-transparent text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none text-right font-medium"
              />
            </div>

            <button
              type="submit"
              className="px-7 py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>دخول البث الآن 🚀</span>
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 font-bold text-center animate-bounce">
              ⚠️ {errorMsg}
            </p>
          )}

          <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-400 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>دخول مباشر بدون قيود للطلاب</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>جودة 1080p عالية الدقة</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>شات وكويزات تفاعلية</span>
            </span>
          </div>
        </form>

        {/* Instructor Launch Live Banner */}
        {isInstructorOrAdmin && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 text-right">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white">
                  أنت محاضر معتمد: افتح قاعة البث وانسخ الرابط لطلابك
                </h4>
                <p className="text-[11px] text-zinc-300">
                  يمكنك إطلاق البث فوراً ومشاركة الرابط على مجموعات الواتساب والتيليجرام.
                </p>
              </div>
            </div>

            <Link
              href="/live/instant-room"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-md flex items-center gap-1.5 shrink-0 transition-all hover:scale-105 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>بدء البث المباشر (Start Live)</span>
            </Link>
          </div>
        )}
      </div>

      {/* =========================================================================
          2. INSTRUCTOR SAAS LIVE ADDON EXPLANATION CARD (FOR PROSPECTIVE INSTRUCTORS)
         ========================================================================= */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0c0918]/90 border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                كيف تعمل ميزة البث المباشر في المنصة؟ (دليل المحاضرين والطلاب)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                حل متكامل يمنح المحاضر الحرية والتحكم الكامل بدون أي عوائق على الطلاب.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* For Students */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black">
              <CheckCircle2 className="w-4 h-4" />
              <span>للطلاب (مجاني تماماً عبر الرابط)</span>
            </div>
            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[11.5px]">
              الطالب لا يدفع أي اشتراك للبث المباشر. يكتفي المحاضر بإرسال رابط الغرفة (أو كود البث)، فيقوم الطالب بلصقه والدخول فوراً للمحاضرة بالصوت والشاشة والكويزات.
            </p>
          </div>

          {/* For Instructors */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black">
              <Sparkles className="w-4 h-4" />
              <span>للمحاضرين (إضافة باقة البث Live Addon)</span>
            </div>
            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[11.5px]">
              المحاضر يدفع رسماً إضافياً بسيطاً على باقته الشهرية (مثل +150 ج.م/شهر) لفتح سيرفرات WebRTC عالية السرعة، وبث غير محدود بدقة 1080p، ومسابقات Kahoot الحية.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. ACTIVE OPEN SESSIONS (FOR EASY 1-CLICK ACCESS)
         ========================================================================= */}
      {sessions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                قاعات البثوث المتاحة الآن (انضمام بضغطة واحدة)
              </h3>
            </div>
            <span className="text-xs text-zinc-500 font-mono">
              {sessions.length} قاعة نشطة
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#0c0918] border border-slate-200 dark:border-white/10 hover:border-amber-500/40 transition-all shadow-md flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30 text-[10.5px] font-black">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      <span>مباشر الآن ({session.viewerCount} طالب)</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(session.roomId)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-zinc-300 text-[10px] font-bold transition-all cursor-pointer"
                      title="نسخ رابط الغرفة لمشاركته"
                    >
                      {copiedId === session.roomId ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>تم نسخ الرابط!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-500 dark:text-zinc-400" />
                          <span>نسخ الرابط</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block">
                      {session.courseTitle}
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                      {session.topic}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px] font-black shrink-0">
                      {session.instructor.name[0] || 'م'}
                    </div>
                    <span className="font-bold truncate">{session.instructor.name}</span>
                  </div>
                </div>

                <Link
                  href={`/live/${session.roomId}`}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>دخول القاعة الآن 🚀</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}