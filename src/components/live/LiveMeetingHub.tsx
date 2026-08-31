'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Video,
  Radio,
  Link as LinkIcon,
  Users,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  Plus,
  Play,
  Share2,
  Award,
} from 'lucide-react';

interface LiveMeetingHubProps {
  currentUser: any;
  platformName: string;
}

export default function LiveMeetingHub({ currentUser, platformName }: LiveMeetingHubProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'join' | 'host'>('join');

  // Join Form State
  const [meetingInput, setMeetingInput] = useState('');
  const [displayName, setDisplayName] = useState(currentUser?.officialFullName || currentUser?.firstName || '');
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [joinError, setJoinError] = useState('');

  // Host Form State
  const [hostTopic, setHostTopic] = useState('');
  const [isCreatingHost, setIsCreatingHost] = useState(false);

  const isInstructorOrAdmin = currentUser?.role === 'INSTRUCTOR' || currentUser?.role === 'ADMIN';

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');

    let trimmed = meetingInput.trim();
    if (!trimmed) {
      setJoinError('يرجى إدخال معرّف القاعة أو لصق الرابط');
      return;
    }

    // Extract ID if full link was pasted
    if (trimmed.includes('/live/')) {
      const parts = trimmed.split('/live/');
      trimmed = parts[1]?.split('?')[0]?.split('#')[0] || '';
    } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      try {
        const url = new URL(trimmed);
        const segments = url.pathname.split('/').filter(Boolean);
        trimmed = segments[segments.length - 1] || '';
      } catch (e) {}
    }

    if (!trimmed) {
      setJoinError('الرابط أو معرّف القاعة غير صالح');
      return;
    }

    // Build URL query params
    const params = new URLSearchParams();
    if (displayName) params.set('name', displayName);
    if (micMuted) params.set('mute', '1');
    if (cameraOff) params.set('camOff', '1');

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    router.push(`/live/${encodeURIComponent(trimmed)}${queryStr}`);
  };

  const handleStartInstantMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingHost(true);
    // Generate clean room ID (e.g. room-xxx)
    const randomCode = Math.random().toString(36).substring(2, 8);
    const roomId = hostTopic
      ? `${hostTopic.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${randomCode}`
      : `session-${randomCode}`;

    router.push(`/live/${encodeURIComponent(roomId)}`);
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center text-right px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2.5 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-black mx-auto">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <Radio className="w-3.5 h-3.5" />
          <span>قاعات البث المباشر والاجتماعات الافتراضية</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          غرفة الاجتماعات والمحاضرات الحية
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
          انضم فوراً إلى محاضرتك باستخدام الرابط أو معرّف القاعة، أو ابدأ قاعة بث جديدة لطلابك.
        </p>
      </div>

      {/* Main Zoom-Style Card */}
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0e0c18] border-2 border-slate-200 dark:border-amber-500/30 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        {/* Ambient Top Flare */}
        <div className="absolute top-0 right-1/4 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Tab Switcher: Join vs Host */}
        <div className="flex p-1.5 rounded-2xl bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'join'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LinkIcon className="w-4 h-4 text-amber-500" />
            <span>الانضمام لمحاضرة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('host')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'host'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Video className="w-4 h-4 text-rose-500" />
            <span>بدء اجتماع جديد (المحاضر)</span>
          </button>
        </div>

        {/* TAB 1: JOIN MEETING */}
        {activeTab === 'join' && (
          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                معرّف القاعة أو رابط المحاضرة (Meeting ID or Link):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={meetingInput}
                  onChange={(e) => setMeetingInput(e.target.value)}
                  placeholder="مثال: math-101 أو الصق الرابط كاملاً..."
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 text-right font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                اسمك المعروض داخل القاعة:
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="أدخل اسمك أو لقبك..."
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 text-right font-medium"
              />
            </div>

            {/* Audio / Video Quick Preferences */}
            <div className="pt-1 flex items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMicMuted(!micMuted)}
                className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  micMuted
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-600 dark:text-rose-400 font-bold'
                    : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300'
                }`}
              >
                {micMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-500" />}
                <span>{micMuted ? 'المايك مكتوم' : 'المايك مفعل'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCameraOff(!cameraOff)}
                className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  cameraOff
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-600 dark:text-rose-400 font-bold'
                    : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300'
                }`}
              >
                {cameraOff ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5 text-emerald-500" />}
                <span>{cameraOff ? 'الكاميرا مغلقة' : 'الكاميرا مفعلة'}</span>
              </button>
            </div>

            {joinError && (
              <p className="text-xs text-rose-500 font-bold text-center pt-1">
                {joinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer mt-2"
            >
              <Radio className="w-4 h-4" />
              <span>دخول القاعة الآن 🚀</span>
            </button>
          </form>
        )}

        {/* TAB 2: HOST / START MEETING */}
        {activeTab === 'host' && (
          <form onSubmit={handleStartInstantMeeting} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                موضوع أو عنوان الجلسة (اختياري):
              </label>
              <input
                type="text"
                value={hostTopic}
                onChange={(e) => setHostTopic(e.target.value)}
                placeholder="مثال: مراجعة هندسة البرمجيات أو حل كويز..."
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 text-right font-medium"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <span className="font-bold block">ميزات استوديو البث للمحاضر:</span>
              <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed">
                بمجرد الضغط على بدء البث، ستدخل إلى قاعة 1080p متكاملة مع إمكانية مشاركة الشاشة، كويزات تفاعلية، ونسخ رابط الدعوة بنقرة واحدة لطلابه على واتساب أو تيليجرام.
              </p>
            </div>

            <button
              type="submit"
              disabled={isCreatingHost}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 hover:from-rose-500 hover:to-red-400 text-white font-black text-sm shadow-xl shadow-rose-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50 mt-2"
            >
              {isCreatingHost ? (
                <span>جاري إنشاء القاعة...</span>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  <span>بدء البث المباشر الفوري 🎙️</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>

      {/* 3 Value Pillars at Bottom (Zoom/Meet Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-center">
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 space-y-1.5 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">دقة فائقة 1080p</h4>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">بث فائق السرعة مع مشاركة شاشة خالية من التقطيع</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 space-y-1.5 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Users className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">تفاعل ونقاش صوتي</h4>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">رفع اليد وفتح المايك للنقاش ومسابقات كويزات حية</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 space-y-1.5 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">اتصال مشفر وآمن</h4>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">غرف WebRTC محمية مع علامات مائية لمنع التسريب</p>
        </div>
      </div>

    </div>
  );
}