'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  MessageSquare,
  Users,
  Hand,
  Trophy,
  Sparkles,
  X,
  Send,
  Radio,
  Crown,
  Play,
  ShieldCheck,
  Award,
  Copy,
  Check,
  Share2,
  Settings,
  MoreVertical,
  Maximize2,
  Volume2,
  VolumeX,
  HelpCircle,
  Clock,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface LiveRoomClientProps {
  sessionId: string;
  initialSession: {
    id: string;
    title: string;
    description?: string;
    instructorName: string;
    isInstructor: boolean;
    currentUser: {
      id: string;
      name: string;
      phone?: string;
      email: string;
    };
  };
}

export default function LiveRoomClient({ sessionId, initialSession }: LiveRoomClientProps) {
  const isInstructor = initialSession.isInstructor;
  const user = initialSession.currentUser;

  // Media Controls
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(145);
  const [copiedLink, setCopiedLink] = useState(false);

  // Side Drawer & View
  const [activeSidePanel, setActiveSidePanel] = useState<'chat' | 'quiz' | 'hands' | 'participants' | null>('chat');

  // Video Refs
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const userCamRef = useRef<HTMLVideoElement>(null);

  // Chat Messages
  const [messages, setMessages] = useState<Array<{ id: string; user: string; text: string; time: string; isInstructor?: boolean }>>([
    { id: '1', user: initialSession.instructorName, text: 'مرحباً بكم جميعاً في القاعة التفاعلية! سنبدأ الشرح وحل التطبيقات العملية الآن.', time: '07:01', isInstructor: true },
    { id: '2', user: 'أحمد محمود', text: 'مساء الخير يا بشمهندس، الصوت والصورة واضحة جداً بدقة 1080p.', time: '07:02' },
    { id: '3', user: 'سارة خالد', text: 'جاهزين للكويز والمراجعة إن شاء الله.', time: '07:03' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Hand Raising & Mic Permissions
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [raisedHandsList, setRaisedHandsList] = useState<Array<{ id: string; name: string; time: string; hasMicPermission?: boolean }>>([
    { id: 'u1', name: 'أحمد علي', time: 'منذ دقيقتين' },
    { id: 'u2', name: 'مريم السيد', time: 'الآن' },
  ]);

  // Participants List
  const [participants, setParticipants] = useState<Array<{ id: string; name: string; isInstructor?: boolean; isMicOn?: boolean }>>([
    { id: 'inst', name: initialSession.instructorName, isInstructor: true, isMicOn: true },
    { id: 'p1', name: 'أحمد محمود', isMicOn: false },
    { id: 'p2', name: 'سارة خالد', isMicOn: false },
    { id: 'p3', name: 'عمر إبراهيم', isMicOn: false },
    { id: 'p4', name: user.name, isMicOn: false },
  ]);

  // Interactive Flash Quiz (Kahoot Style)
  const [activeQuiz, setActiveQuiz] = useState<{ id: string; question: string; options: string[]; correctIndex: number; timeLeft: number; isActive: boolean; } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'سارة خالد', score: 980 },
    { rank: 2, name: 'أحمد محمود', score: 870 },
    { rank: 3, name: user.name, score: 0 },
  ]);

  // Timer for session
  useEffect(() => {
    const timer = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Timer for recording
  useEffect(() => {
    let int: any;
    if (isRecording) int = setInterval(() => setRecordingSeconds((p) => p + 1), 1000);
    return () => clearInterval(int);
  }, [isRecording]);

  // Quiz Timer Countdown
  useEffect(() => {
    if (activeQuiz && activeQuiz.isActive && activeQuiz.timeLeft > 0) {
      const t = setInterval(() => {
        setActiveQuiz((prev) => {
          if (!prev) return null;
          if (prev.timeLeft <= 1) {
            clearInterval(t);
            setShowLeaderboard(true);
            return { ...prev, timeLeft: 0, isActive: false };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
      return () => clearInterval(t);
    }
  }, [activeQuiz]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Screen Share Toggle
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (mainVideoRef.current && mainVideoRef.current.srcObject) {
        const stream = mainVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        mainVideoRef.current.srcObject = null;
      }
      setIsScreenSharing(false);
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
          if (mainVideoRef.current) {
            mainVideoRef.current.srcObject = stream;
            mainVideoRef.current.play();
          }
          setIsScreenSharing(true);
          stream.getVideoTracks()[0].onended = () => setIsScreenSharing(false);
        } else {
          alert('مشاركة الشاشة غير مدعومة في هذا المتصفح.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Camera Toggle
  const handleToggleCamera = async () => {
    if (isCameraOn) {
      if (userCamRef.current && userCamRef.current.srcObject) {
        const stream = userCamRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        userCamRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: isMicOn });
          if (userCamRef.current) {
            userCamRef.current.srcObject = stream;
            userCamRef.current.play();
          }
          setIsCameraOn(true);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), user: user.name, text: inputMessage.trim(), time: timeStr, isInstructor },
    ]);
    setInputMessage('');
  };

  const handleLaunchQuiz = () => {
    setActiveQuiz({
      id: Date.now().toString(),
      question: 'ما هو الترتيب الصحيح لدورة حياة المكون في React (Component Lifecycle)؟',
      options: ['Mounting ➜ Updating ➜ Unmounting', 'Updating ➜ Mounting ➜ Rendering', 'Rendering ➜ Catching ➜ Destroying', 'Initialization ➜ Loading ➜ Caching'],
      correctIndex: 0,
      timeLeft: 25,
      isActive: true,
    });
    setQuizAnswered(false);
    setSelectedAnswer(null);
    setShowLeaderboard(false);
  };

  const handleAnswerQuiz = (idx: number) => {
    if (quizAnswered || !activeQuiz) return;
    setSelectedAnswer(idx);
    setQuizAnswered(true);
    if (idx === activeQuiz.correctIndex) {
      const earned = Math.round(activeQuiz.timeLeft * 40);
      setQuizScore((p) => p + earned);
      setLeaderboard((prev) =>
        prev
          .map((item) => (item.name === user.name ? { ...item, score: item.score + earned } : item))
          .sort((a, b) => b.score - a.score)
          .map((item, i) => ({ ...item, rank: i + 1 }))
      );
    }
  };

  const handleCopyInviteLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#07060c] text-white flex flex-col overflow-hidden font-sans select-none text-right">
      
      {/* =========================================================================
          1. TOP HEADER (EXECUTIVE MEETING BAR)
         ========================================================================= */}
      <header className="h-14 px-3 sm:px-5 bg-[#0e0c1a] border-b border-white/[0.08] flex items-center justify-between shrink-0 z-30">
        
        {/* Right side: Title & Live indicator */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={isInstructor ? '/instructor' : '/live'}
            className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="الخروج إلى القائمة"
          >
            <X className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-black tracking-wider uppercase flex items-center gap-1 font-mono">
              <span>LIVE</span>
              <span>{formatTimer(sessionSeconds)}</span>
            </span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="hidden sm:block truncate">
            <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs md:max-w-md">
              {initialSession.title || 'قاعة البث المباشر والمحاضرة التفاعلية'}
            </h1>
            <p className="text-[10px] text-zinc-400">
              المحاضر: <span className="text-amber-400 font-bold">{initialSession.instructorName}</span>
            </p>
          </div>
        </div>

        {/* Left side: Quick actions & Counters */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* 1-Click Copy Invite Link */}
          <button
            type="button"
            onClick={handleCopyInviteLink}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer shrink-0"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden xs:inline">{copiedLink ? 'تم نسخ الرابط!' : 'نسخ رابط الدعوة'}</span>
          </button>

          {/* Recording Badge */}
          {isRecording && (
            <div className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>REC {formatTimer(recordingSeconds)}</span>
            </div>
          )}

          {/* Instructor Cloud Recording Button */}
          {isInstructor && (
            <button
              onClick={() => setIsRecording(!isRecording)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-zinc-200 flex items-center gap-1.5 cursor-pointer hidden md:flex"
            >
              <Radio className="w-3.5 h-3.5 text-rose-400" />
              <span>{isRecording ? 'إيقاف التسجيل' : 'تسجيل سحابي'}</span>
            </button>
          )}

          {/* Participants Pill */}
          <button
            onClick={() => setActiveSidePanel(activeSidePanel === 'participants' ? null : 'participants')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-zinc-300 transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>{participants.length} حاضر</span>
          </button>

        </div>
      </header>

      {/* =========================================================================
          2. MAIN STAGE & COLLAPSIBLE SIDEBAR
         ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Main Video Stage */}
        <main className="flex-1 bg-black flex flex-col items-center justify-center relative overflow-hidden p-2 sm:p-4">
          <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0c0a18] border border-white/10 flex items-center justify-center shadow-2xl">
            
            {/* Screen Share Video Track */}
            <video
              ref={mainVideoRef}
              className={`w-full h-full object-contain ${isScreenSharing ? 'block' : 'hidden'}`}
              autoPlay
              playsInline
              muted
            />

            {/* Screen Share Header Pill */}
            {isScreenSharing && (
              <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-xs text-white flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>شاشة المحاضر • 1080p 60fps</span>
              </div>
            )}

            {/* Waiting / Audio Stage Placeholder */}
            {!isScreenSharing && (
              <div className="text-center space-y-5 p-6 relative z-10 max-w-lg mx-auto">
                <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                  {/* Glowing Sound Wave Ring */}
                  <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping opacity-50" />
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-purple-600 to-indigo-600 p-[2px] shadow-2xl">
                    <div className="w-full h-full bg-[#0d0a1c] rounded-full flex items-center justify-center text-3xl font-black text-amber-400">
                      {initialSession.instructorName[0] || 'م'}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {initialSession.instructorName}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {isInstructor
                      ? 'أنت المحاضر في هذه القاعة. ابدأ بمشاركة شاشتك بدقة 1080p أو تشغيل الكاميرا لبدء الشرح للطلاب.'
                      : 'المحاضر متواجد الآن داخل القاعة. الشرح ومشاركة الشاشة ستبدأ بعد قليل.'}
                  </p>
                </div>

                {isInstructor && (
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleToggleScreenShare}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                    >
                      <Monitor className="w-4 h-4" />
                      <span>بدء مشاركة الشاشة (Screen Share)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleCamera}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>تشغيل الكاميرا</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Picture-in-Picture User Camera */}
            <div
              className={`absolute bottom-4 left-4 w-44 sm:w-56 aspect-video rounded-2xl overflow-hidden bg-[#16122d] border-2 border-purple-500/60 shadow-2xl z-20 ${
                isCameraOn ? 'block' : 'hidden'
              }`}
            >
              <video ref={userCamRef} className="w-full h-full object-cover" autoPlay playsInline muted />
              <div className="absolute bottom-1.5 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white flex items-center gap-1">
                <span>{isInstructor ? 'المحاضر' : user.name}</span>
              </div>
            </div>

            {/* Anti-Leak Floating Security Watermark */}
            <div className="absolute top-1/3 right-1/4 pointer-events-none opacity-20 text-[11px] font-mono text-white select-none z-10 animate-pulse">
              {user.name} • {user.phone || user.email} • IP: PROTECTED
            </div>

            {/* Active Quiz Popup Modal (Kahoot Style) */}
            {activeQuiz && activeQuiz.isActive && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 flex items-center justify-center p-4">
                <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#120f26] border-2 border-amber-500/50 shadow-2xl space-y-6 text-center animate-in zoom-in-95">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wider">سؤال حي تفاعلي Flash Quiz</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-sm font-black text-amber-300 font-mono">
                      {activeQuiz.timeLeft}
                    </div>
                  </div>

                  <h3 className="text-base sm:text-xl font-bold text-white leading-snug">
                    {activeQuiz.question}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {activeQuiz.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswerQuiz(idx)}
                        disabled={quizAnswered || isInstructor}
                        className={`p-4 rounded-2xl border text-right font-bold text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${
                          quizAnswered
                            ? idx === activeQuiz.correctIndex
                              ? 'bg-emerald-600 text-white border-emerald-400 scale-[1.02]'
                              : selectedAnswer === idx
                              ? 'bg-rose-600 text-white border-rose-400'
                              : 'bg-white/5 opacity-40'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-400'
                        }`}
                      >
                        <span>{option}</span>
                        <span className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center text-xs font-mono">
                          {idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>

                  {quizAnswered && (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300">
                      {selectedAnswer === activeQuiz.correctIndex
                        ? '🎉 إجابة صحيحة وسريعة! تم احتساب النقاط.'
                        : '❌ إجابة خاطئة، ركز في السؤال القادم!'}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quiz Leaderboard Podium */}
            {showLeaderboard && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 flex items-center justify-center p-4">
                <div className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-[#120f26] border-2 border-amber-500/50 shadow-2xl space-y-5 text-center">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-400" />
                      <h4 className="text-base font-bold text-white">لوحة الشرف الحية (Top Performers)</h4>
                    </div>
                    <button
                      onClick={() => setShowLeaderboard(false)}
                      className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-right">
                    {leaderboard.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl border bg-white/5 border-white/10 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-amber-500 text-zinc-950 font-black flex items-center justify-center text-xs">
                            {item.rank === 1 ? '👑' : item.rank}
                          </div>
                          <span className="font-bold text-xs sm:text-sm">{item.name}</span>
                        </div>
                        <span className="font-mono text-xs font-black text-amber-400">
                          {item.score} نقطة
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowLeaderboard(false)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs shadow-lg cursor-pointer"
                  >
                    العودة للقاعة
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>

        {/* Collapsible Sidebar */}
        {activeSidePanel && (
          <aside className="w-80 sm:w-88 bg-[#0c0a1a] border-r border-white/10 flex flex-col shrink-0 z-20">
            
            {/* Sidebar Tabs */}
            <div className="h-12 border-b border-white/10 flex items-center justify-between px-2 bg-[#080712]">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveSidePanel('chat')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSidePanel === 'chat' ? 'bg-purple-600 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  الشات
                </button>

                <button
                  onClick={() => setActiveSidePanel('quiz')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSidePanel === 'quiz' ? 'bg-amber-500 text-zinc-950 font-black shadow-xs' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  الكويز الحي
                </button>

                <button
                  onClick={() => setActiveSidePanel('hands')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSidePanel === 'hands' ? 'bg-blue-600 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  المايك (${raisedHandsList.length})
                </button>

                <button
                  onClick={() => setActiveSidePanel('participants')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSidePanel === 'participants' ? 'bg-zinc-700 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  الحضور
                </button>
              </div>

              <button
                onClick={() => setActiveSidePanel(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TAB: CHAT */}
            {activeSidePanel === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-2xl text-xs space-y-1 ${
                        msg.isInstructor
                          ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200'
                          : 'bg-white/5 border border-white/5 text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold">
                        <span className={msg.isInstructor ? 'text-amber-400 font-black' : 'text-zinc-300'}>
                          {msg.user} {msg.isInstructor && '(المحاضر 👑)'}
                        </span>
                        <span className="font-mono">{msg.time}</span>
                      </div>
                      <p className="leading-relaxed font-normal">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-[#080712] flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="اكتب رسالتك في المحادثة..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB: QUIZ */}
            {activeSidePanel === 'quiz' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-6 text-right">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>الكويزات الحية التفاعلية</span>
                  </h4>
                  <p className="text-xs text-zinc-400">
                    شارك في الأسئلة السريعة على الشاشة واجمع النقاط للوصول للوحة الشرف.
                  </p>
                </div>

                {isInstructor ? (
                  <button
                    onClick={handleLaunchQuiz}
                    className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4 text-zinc-950" />
                    <span>إطلاق كويز تفاعلي سريع للطلاب (Flash Quiz)</span>
                  </button>
                ) : (
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                    <Award className="w-8 h-8 text-amber-400 mx-auto" />
                    <div className="text-xs font-bold text-white">رصيدك في الكويز الحالي</div>
                    <div className="text-3xl font-black text-amber-400 font-mono">{quizScore} نقطة</div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: HANDS & MIC REQUESTS */}
            {activeSidePanel === 'hands' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-5 text-right">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Hand className="w-4 h-4 text-blue-400" />
                    <span>طلبات المايك والنقاش الصوتي</span>
                  </h4>
                  <p className="text-xs text-zinc-400">
                    يمكن للطلاب رفع اليد لطلب المايك ومناقشة المحاضر صوتياً.
                  </p>
                </div>

                {!isInstructor && (
                  <button
                    onClick={() => setHasRaisedHand(!hasRaisedHand)}
                    className={`w-full py-3 rounded-2xl text-xs font-bold shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2 ${
                      hasRaisedHand
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    <Hand className="w-4 h-4" />
                    <span>{hasRaisedHand ? 'إنزال اليد' : 'رفع اليد لطلب المايك ✋'}</span>
                  </button>
                )}

                <div className="space-y-2 pt-2">
                  {raisedHandsList.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{item.name}</div>
                        <div className="text-[10px] text-zinc-400">{item.time}</div>
                      </div>

                      {isInstructor && (
                        <button
                          onClick={() =>
                            setRaisedHandsList((p) =>
                              p.map((h) => (h.id === item.id ? { ...h, hasMicPermission: !h.hasMicPermission } : h))
                            )
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            item.hasMicPermission
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white/10 hover:bg-white/20 text-zinc-200'
                          }`}
                        >
                          {item.hasMicPermission ? 'المايك مفتوح' : 'فتح المايك 🎙️'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PARTICIPANTS */}
            {activeSidePanel === 'participants' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-4 text-right">
                <h4 className="text-sm font-bold text-white">
                  المشاركون في القاعة (${participants.length})
                </h4>

                <div className="space-y-2">
                  {participants.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 text-amber-400 flex items-center justify-center text-xs font-bold">
                          {p.name[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.isInstructor && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">
                                المحاضر
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-zinc-400">
                        {p.isMicOn ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </aside>
        )}
      </div>

      {/* =========================================================================
          3. BOTTOM CONTROLS BAR (ZOOM / GOOGLE MEET STYLE DOCK)
         ========================================================================= */}
      <footer className="h-20 bg-[#0e0c1a] border-t border-white/[0.08] px-4 sm:px-8 flex items-center justify-between shrink-0 z-30">
        
        {/* Left corner: Room ID indicator */}
        <div className="hidden lg:flex items-center gap-2 w-1/4 text-xs text-zinc-400 font-medium">
          <span>معرّف الجلسة:</span>
          <span className="font-mono text-purple-400 font-bold">#${sessionId.slice(0, 8)}</span>
        </div>

        {/* Center: Main Floating Controls */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-1 lg:flex-initial">
          
          {/* Mic */}
          <button
            type="button"
            onClick={() => setIsMicOn(!isMicOn)}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all cursor-pointer ${
              isMicOn
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
            title={isMicOn ? 'كتم المايك' : 'تشغيل المايك'}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera */}
          <button
            type="button"
            onClick={handleToggleCamera}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all cursor-pointer ${
              isCameraOn
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
            title={isCameraOn ? 'إغلاق الكاميرا' : 'تشغيل الكاميرا'}
          >
            {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Screen Share (Instructor only) */}
          {isInstructor && (
            <button
              type="button"
              onClick={handleToggleScreenShare}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                isScreenSharing
                  ? 'bg-amber-500 text-zinc-950 font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={isScreenSharing ? 'إيقاف مشاركة الشاشة' : 'مشاركة الشاشة'}
            >
              {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            </button>
          )}

          {/* Raise Hand (Student) */}
          {!isInstructor && (
            <button
              type="button"
              onClick={() => setHasRaisedHand(!hasRaisedHand)}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                hasRaisedHand
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="رفع اليد"
            >
              <Hand className="w-5 h-5" />
            </button>
          )}

          {/* Leave Meeting (Red Pill) */}
          <Link
            href={isInstructor ? '/instructor' : '/live'}
            className="px-5 h-11 sm:h-12 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-rose-600/25"
          >
            <span>مغادرة القاعة</span>
          </Link>

        </div>

        {/* Right Corner: Side Panel Toggles */}
        <div className="flex items-center justify-end gap-2 w-auto lg:w-1/4">
          <button
            type="button"
            onClick={() => setActiveSidePanel(activeSidePanel === 'chat' ? null : 'chat')}
            className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer ${
              activeSidePanel === 'chat'
                ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
            }`}
            title="المحادثة"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSidePanel(activeSidePanel === 'quiz' ? null : 'quiz')}
            className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer ${
              activeSidePanel === 'quiz'
                ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold shadow-md'
                : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
            }`}
            title="الكويزات الحية"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

      </footer>

    </div>
  );
}
