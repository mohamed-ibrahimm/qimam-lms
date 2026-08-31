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

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    let trimmed = inputLink.trim();
    if (!trimmed) {
      setErrorMsg('يرجى لصق رابط البث المباشر أو كود الغرفة');
      return;
    }

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
      
      {/* 1. HERO HEADER: DIRECT LINK JOIN FOR STUDENTS */}
      <div className="p-6 sm:p-10 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl relative overflow-hidden space-y-6">
        <div className="space-y-2.5 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold mx-auto">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <Radio className="w-3.5 h-3.5" />
            <span>قاعات البث المباشر التفاعلية</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            الدخول إلى قاعة البث المباشر
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
            البثوث متاحة للطلاب عبر الرابط المباشر. الصق الرابط أو كود الغرفة الذي أرسله لك المحاضر وادخل القاعة فوراً.
          </p>
        </div>

        {/* Quick Join Input Box */}
        <form onSubmit={handleJoin} className="max-w-2xl mx-auto space-y-3 pt-1">
          <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-2 rounded-xl bg-zinc-900 border border-zinc-700 focus-within:border-amber-500 transition-all">
            <div className="relative flex-1 flex items-center">
              <LinkIcon className="w-4 h-4 text-zinc-400 absolute right-3.5 pointer-events-none" />
              <input
                type="text"
                value={inputLink}
                onChange={(e) => setInputLink(e.target.value)}
                placeholder="الصق رابط البث هنا (مثال: https://.../live/math-101 أو كود الغرفة)..."
                className="w-full h-11 pr-10 pl-4 bg-transparent text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none text-right font-medium"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>دخول البث الآن</span>
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 font-medium text-center">
              {errorMsg}
            </p>
          )}

          <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-400 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>دخول مباشر عبر الرابط</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>دقة عالية 1080p</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
              <span>مشاركة الشاشة وكويزات تفاعلية</span>
            </span>
          </div>
        </form>

        {/* Instructor Launch Live Banner */}
        {isInstructorOrAdmin && (
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 text-right">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  أنت محاضر معتمد: ابدأ البث وانسخ الرابط لطلابك
                </h4>
                <p className="text-[11px] text-zinc-400">
                  يمكنك إطلاق قاعة البث فوراً ومشاركة الرابط على مجموعات الطلاب.
                </p>
              </div>
            </div>

            <Link
              href="/live/instant-room"
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-rose-400" />
              <span>بدء البث المباشر</span>
            </Link>
          </div>
        )}
      </div>

      {/* 2. INSTRUCTOR SAAS LIVE ADDON EXPLANATION */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-md space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                دليل خدمة البث المباشر للطلاب والمحاضرين
              </h3>
              <p className="text-[11px] text-zinc-400">
                نظام مرن يتيح للطلاب الحضور المجاني وللمحاضرين التحكم الكامل في جلساتهم.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>للطلاب (حضور مجاني عبر الرابط)</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11.5px]">
              الطالب لا يدفع أي رسوم للبث المباشر. يقوم المحاضر بإرسال رابط الغرفة أو كود البث، فيقوم الطالب بلصقه والدخول فوراً للمحاضرة.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>للمحاضرين (باقة البث والأستوديو)</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11.5px]">
              المحاضر يشترك في باقة البث والأستوديو للاستفادة من سيرفرات البث عالي السرعة، مشاركة الشاشة، كويزات تفاعلية، وفتح المايك للنقاش الصوتي.
            </p>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE OPEN SESSIONS */}
      {sessions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-white">
                قاعات البثوث النشطة حالياً
              </h3>
            </div>
            <span className="text-xs text-zinc-500 font-mono">
              {sessions.length} قاعة متاحة
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all shadow-md flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10.5px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      <span>مباشر الآن ({session.viewerCount} حاضر)</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(session.roomId)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] font-medium border border-zinc-800 transition-colors cursor-pointer"
                      title="نسخ رابط الغرفة"
                    >
                      {copiedId === session.roomId ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-zinc-400" />
                          <span>نسخ الرابط</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-amber-400 font-semibold block">
                      {session.courseTitle}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {session.topic}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {session.instructor.name[0] || 'م'}
                    </div>
                    <span className="font-medium truncate">{session.instructor.name}</span>
                  </div>
                </div>

                <Link
                  href={`/live/${session.roomId}`}
                  className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs border border-zinc-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5 text-rose-400" />
                  <span>دخول القاعة</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}