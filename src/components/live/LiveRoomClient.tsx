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

  const [copiedLink, setCopiedLink] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const [activeSidePanel, setActiveSidePanel] = useState<'chat' | 'quiz' | 'hands' | null>('chat');
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const userCamRef = useRef<HTMLVideoElement>(null);

  const [messages, setMessages] = useState<Array<{ id: string; user: string; text: string; time: string; isInstructor?: boolean }>>([
    { id: '1', user: initialSession.instructorName, text: 'مرحباً بكم جميعاً في البث المباشر التفاعلي! سنبدأ الشرح بعد قليل.', time: 'الآن', isInstructor: true },
    { id: '2', user: 'أحمد محمود', text: 'الصوت والصورة واضحة جداً يا هندسة.', time: 'الآن' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [raisedHandsList, setRaisedHandsList] = useState<Array<{ id: string; name: string; time: string; hasMicPermission?: boolean }>>([
    { id: 'u1', name: 'أحمد علي', time: 'منذ 2 دقيقة' },
  ]);

  const [activeQuiz, setActiveQuiz] = useState<{ id: string; question: string; options: string[]; correctIndex: number; timeLeft: number; isActive: boolean; } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'سارة خالد', score: 950 },
    { rank: 2, name: 'أحمد علي', score: 870 },
    { rank: 3, name: user.name, score: 0 },
  ]);

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

  useEffect(() => {
    let int: any;
    if (isRecording) int = setInterval(() => setRecordingSeconds((p) => p + 1), 1000);
    return () => clearInterval(int);
  }, [isRecording]);

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), user: user.name, text: inputMessage.trim(), time: 'الآن', isInstructor }]);
    setInputMessage('');
  };

  const handleLaunchQuiz = () => {
    setActiveQuiz({ id: Date.now().toString(), question: 'ما هو الـ Hook الأساسي لإدارة الـ State في React؟', options: ['useEffect', 'useState', 'useMemo', 'useContext'], correctIndex: 1, timeLeft: 25, isActive: true });
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
      setLeaderboard((prev) => prev.map((item) => item.name === user.name ? { ...item, score: item.score + earned } : item).sort((a, b) => b.score - a.score).map((item, i) => ({ ...item, rank: i + 1 })));
    }
  };

  return (
    <div className="h-screen w-screen bg-[#08070e] text-white flex flex-col overflow-hidden font-sans select-none">
      {/* Top Header */}
      <header className="h-14 px-4 bg-[#0d0a1a] border-b border-purple-900/40 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link href={isInstructor ? '/instructor' : '/courses'} className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white">
            <X className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span></span>
            <span className="px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-black uppercase">بث مباشر LIVE</span>
          </div>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <div className="hidden sm:block">
            <h1 className="text-xs sm:text-sm font-black text-white truncate max-w-xs md:max-w-md">{initialSession.title}</h1>
            <p className="text-[10px] text-zinc-400">المحاضر: <span className="text-amber-400 font-bold">{initialSession.instructorName}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          {/* Copy Invite Link Button */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                navigator.clipboard.writeText(window.location.href);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2500);
              }
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 flex items-center gap-1.5 shadow-md shadow-amber-500/25 hover:scale-105 transition-all cursor-pointer shrink-0"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-zinc-950" /> : <Copy className="w-3.5 h-3.5 text-zinc-950" />}
            <span>{copiedLink ? 'تم نسخ الرابط للطلاب! 📋' : '🔗 نسخ رابط دعوة الطلاب'}</span>
          </button>

          {isRecording && <div className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold animate-pulse">REC {Math.floor(recordingSeconds/60)}:{recordingSeconds%60}</div>}
          {isInstructor && <button onClick={() => setIsRecording(!isRecording)} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 cursor-pointer"><Radio className="w-3.5 h-3.5" /><span>{isRecording ? 'إيقاف التسجيل' : 'تسجيل سحابي'}</span></button>}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300"><Users className="w-3.5 h-3.5 text-amber-400" /><span>34 طالب</span></div>
        </div>
      </header>

      {/* Main Canvas + Side Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 bg-black flex flex-col items-center justify-center relative overflow-hidden p-2 sm:p-4">
          <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0c0918] border border-purple-900/30 flex items-center justify-center shadow-2xl">
            <video ref={mainVideoRef} className={`w-full h-full object-contain ${isScreenSharing ? 'block' : 'hidden'}`} autoPlay playsInline muted />
            {!isScreenSharing && (
              <div className="text-center space-y-4 p-6 relative z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-purple-600 to-indigo-600 p-1 mx-auto shadow-2xl animate-pulse">
                  <div className="w-full h-full bg-[#08070e] rounded-full flex items-center justify-center text-3xl font-black text-amber-400">{initialSession.instructorName[0] || 'م'}</div>
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-xl sm:text-2xl font-black text-white">{initialSession.instructorName}</h2>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">{isInstructor ? 'أنت في غرفة البث المباشر. اضغط مشاركة الشاشة أو الكاميرا لبدء الشرح.' : 'المحاضر متواجد الآن في الغرفة. سيبدأ البث بعد قليل.'}</p>
                </div>
                {isInstructor && <button onClick={handleToggleScreenShare} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 mx-auto cursor-pointer"><Monitor className="w-4 h-4 text-zinc-950" /><span>مشاركة الشاشة HD (Screen Share)</span></button>}
              </div>
            )}
            <div className={`absolute bottom-4 left-4 w-40 sm:w-56 aspect-video rounded-2xl overflow-hidden bg-[#16122d] border-2 border-purple-500/60 shadow-2xl z-20 ${isCameraOn ? 'block' : 'hidden'}`}>
              <video ref={userCamRef} className="w-full h-full object-cover" autoPlay playsInline muted />
              <div className="absolute bottom-1.5 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white">{isInstructor ? 'المحاضر' : user.name}</div>
            </div>
            <div className="absolute top-1/3 right-1/4 pointer-events-none opacity-20 text-[11px] font-mono text-white select-none z-10 animate-pulse">{user.name} • {user.phone || user.email} • IP: PROTECTED</div>
            {activeQuiz && activeQuiz.isActive && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 flex items-center justify-center p-4">
                <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#130f28] border-2 border-amber-500/50 shadow-2xl space-y-6 text-center animate-in zoom-in-95">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-400 animate-spin" /><span className="text-xs font-black text-amber-400 uppercase">سؤال حي تفاعلي Flash Quiz</span></div>
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-sm font-black text-amber-300 font-mono">{activeQuiz.timeLeft}</div>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white leading-snug">{activeQuiz.question}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {activeQuiz.options.map((option, idx) => (
                      <button key={idx} onClick={() => handleAnswerQuiz(idx)} disabled={quizAnswered || isInstructor} className={`p-4 rounded-2xl border text-right font-black text-sm transition-all flex items-center justify-between cursor-pointer ${quizAnswered ? (idx === activeQuiz.correctIndex ? 'bg-emerald-600 text-white border-emerald-400 scale-[1.02]' : selectedAnswer === idx ? 'bg-rose-600 text-white border-rose-400' : 'bg-white/5 opacity-40') : 'bg-white/5 border-white/10 hover:bg-white/10'}`}><span>{option}</span><span className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center text-xs font-mono">{idx + 1}</span></button>
                    ))}
                  </div>
                  {quizAnswered && <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300">{selectedAnswer === activeQuiz.correctIndex ? '🎉 إجابة صحيحة وسريعة! تم احتساب النقاط.' : '❌ إجابة خاطئة، حظ أفضل في السؤال القادم!'}</div>}
                </div>
              </div>
            )}
            {showLeaderboard && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 flex items-center justify-center p-4">
                <div className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-[#130f28] border-2 border-amber-500/50 shadow-2xl space-y-5 text-center">
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-400" /><h4 className="text-base font-black text-white">لوحة الشرف الحية (Top Performers)</h4></div><button onClick={() => setShowLeaderboard(false)} className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400"><X className="w-4 h-4" /></button></div>
                  <div className="space-y-2 text-right">
                    {leaderboard.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-2xl border bg-white/5 border-white/10 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-amber-500 text-zinc-950 font-black flex items-center justify-center text-xs">{item.rank === 1 ? '👑' : item.rank}</div><span className="font-bold text-xs sm:text-sm">{item.name}</span></div><span className="font-mono text-xs font-black text-amber-400">{item.score} نقطة</span></div>
                    ))}
                  </div>
                  <button onClick={() => setShowLeaderboard(false)} className="w-full py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-black text-xs shadow-lg cursor-pointer">العودة للبث المباشر</button>
                </div>
              </div>
            )}
          </div>
        </main>

        {activeSidePanel && (
          <aside className="w-80 sm:w-88 bg-[#0d0a1a] border-r border-purple-900/40 flex flex-col shrink-0 z-20">
            <div className="h-12 border-b border-purple-900/30 flex items-center justify-between px-2 bg-[#090714]">
              <div className="flex items-center gap-1">
                <button onClick={() => setActiveSidePanel('chat')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${activeSidePanel === 'chat' ? 'bg-purple-600 text-white' : 'text-zinc-400'}`}>الشات</button>
                <button onClick={() => setActiveSidePanel('quiz')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${activeSidePanel === 'quiz' ? 'bg-amber-500 text-zinc-950 font-black' : 'text-zinc-400'}`}>الكويز الحي</button>
                <button onClick={() => setActiveSidePanel('hands')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${activeSidePanel === 'hands' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>المايك ({raisedHandsList.length})</button>
              </div>
              <button onClick={() => setActiveSidePanel(null)} className="p-1.5 rounded-lg text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            {activeSidePanel === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-3 rounded-2xl text-xs bg-white/5 border border-white/5 text-zinc-200"><div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold"><span className={msg.isInstructor ? 'text-amber-400 font-black' : 'text-zinc-300'}>{msg.user} {msg.isInstructor && '(المحاضر 👑)'}</span><span>{msg.time}</span></div><p className="leading-relaxed font-medium mt-1">{msg.text}</p></div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="p-3 border-t border-purple-900/30 bg-[#090714] flex gap-2">
                  <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="اكتب رسالتك للمحاضر والطلاب..." className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500" />
                  <button type="submit" className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer"><Send className="w-4 h-4" /></button>
                </form>
              </div>
            )}
            {activeSidePanel === 'quiz' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-6 text-right">
                <h4 className="text-sm font-black text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400" /><span>الكويزات الحية التفاعلية</span></h4>
                {isInstructor ? (
                  <button onClick={handleLaunchQuiz} className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer"><Sparkles className="w-4 h-4 text-zinc-950" /><span>إطلاق كويز سريع للطلاب (Flash Quiz)</span></button>
                ) : (
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2"><Award className="w-8 h-8 text-amber-400 mx-auto" /><div className="text-xs font-black text-white">رصيدك في الكويز</div><div className="text-2xl font-black text-amber-400 font-mono">{quizScore} نقطة</div></div>
                )}
              </div>
            )}
            {activeSidePanel === 'hands' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-5 text-right">
                <h4 className="text-sm font-black text-white flex items-center gap-2"><Hand className="w-4 h-4 text-blue-400" /><span>طلبات المايك والنقاش الصوتي</span></h4>
                {!isInstructor && <button onClick={() => setHasRaisedHand(!hasRaisedHand)} className="w-full py-3 rounded-2xl text-xs font-black bg-blue-600 text-white shadow-lg cursor-pointer">{hasRaisedHand ? 'إنزال اليد' : 'رفع اليد لطلب المايك ✋'}</button>}
                <div className="space-y-2">
                  {raisedHandsList.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"><div><div className="text-xs font-black text-white">{item.name}</div><div className="text-[10px] text-zinc-400">{item.time}</div></div>{isInstructor && <button onClick={() => setRaisedHandsList(p => p.map(h => h.id === item.id ? {...h, hasMicPermission: !h.hasMicPermission} : h))} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-zinc-200">{item.hasMicPermission ? 'المايك مفتوح' : 'فتح المايك 🎙️'}</button>}</div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <footer className="h-20 bg-[#0d0a1a] border-t border-purple-900/40 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="hidden md:flex items-center gap-3 w-1/4 text-xs text-zinc-300 font-bold">غرفة بث: <span className="font-mono text-purple-400">#LIVE-{sessionId.slice(0, 6)}</span></div>
        <div className="flex items-center justify-center gap-3 flex-1 md:flex-initial">
          <button onClick={() => setIsMicOn(!isMicOn)} className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isMicOn ? 'bg-white/10 text-white' : 'bg-rose-600 text-white'}`}>{isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}</button>
          <button onClick={handleToggleCamera} className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isCameraOn ? 'bg-white/10 text-white' : 'bg-rose-600 text-white'}`}>{isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}</button>
          {isInstructor && <button onClick={handleToggleScreenShare} className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isScreenSharing ? 'bg-amber-500 text-zinc-950 font-black' : 'bg-white/10 text-white'}`}>{isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}</button>}
          <Link href={isInstructor ? '/instructor' : '/courses'} className="px-5 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center justify-center">مغادرة الغرفة</Link>
        </div>
        <div className="hidden md:flex items-center justify-end gap-2 w-1/4">
          <button onClick={() => setActiveSidePanel(activeSidePanel === 'chat' ? null : 'chat')} className={`p-3 rounded-2xl border ${activeSidePanel === 'chat' ? 'bg-purple-600 text-white' : 'bg-white/5 text-zinc-300'}`}><MessageSquare className="w-4 h-4" /></button>
          <button onClick={() => setActiveSidePanel(activeSidePanel === 'quiz' ? null : 'quiz')} className={`p-3 rounded-2xl border ${activeSidePanel === 'quiz' ? 'bg-amber-500 text-zinc-950' : 'bg-white/5 text-zinc-300'}`}><Sparkles className="w-4 h-4" /></button>
        </div>
      </footer>
    </div>
  );
}
