'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import QuizModal from '@/components/QuizModal';
import ForcedReviewModal from '@/components/ForcedReviewModal';
import { formatSeconds, formatDate } from '@/lib/utils';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  PlayCircle,
  FileText,
  HelpCircle,
  Sparkles,
  MessageSquare,
  Send,
  Plus,
  Clock,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  Download,
  RotateCcw,
  Check,
  Unlock
} from 'lucide-react';

interface ClassroomClientProps {
  course: any;
  activeLesson: any;
  user: any;
  isEnrolled: boolean;
  initialNotes: any[];
  initialHasReviewed?: boolean;
  forceReviewEnabled?: boolean;
}

export default function ClassroomClient({
  course,
  activeLesson,
  user,
  isEnrolled,
  initialNotes,
  initialHasReviewed = false,
  forceReviewEnabled = true,
}: ClassroomClientProps) {
  const router = useRouter();

  const [hasReviewed, setHasReviewed] = useState(initialHasReviewed);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'notes' | 'ai' | 'resources'>('summary');
  const [notes, setNotes] = useState<any[]>(initialNotes);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // AI Chat state
  const [aiMessages, setAiMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: `مرحباً بك يا ${user?.firstName || 'طالبنا العزيز'}! أنا مساعدك الذكي في درس "${activeLesson.title}". اسألني أي سؤال حول محتوى الدرس، الكود البرمجي، أو التلخيص وسأجيبك فوراً! `
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Flashcards flip state
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // Quiz Modal State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [issuedCertificate, setIssuedCertificate] = useState<any>(null);

  // Lesson Progress State
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    return course.sections
      .flatMap((s: any) => s.lessons)
      .filter((l: any) => l.progresses?.[0]?.isCompleted)
      .map((l: any) => l.id);
  });

  // Check forced review trigger: after finishing 2nd lesson
  useEffect(() => {
    if (forceReviewEnabled && !hasReviewed && completedLessonIds.length >= 2) {
      setIsReviewModalOpen(true);
    }
  }, [completedLessonIds, hasReviewed, forceReviewEnabled]);

  const summary = activeLesson.summary;
  const keyPoints: string[] = summary?.keyPointsJson ? JSON.parse(summary.keyPointsJson) : [];
  const definitions: { term: string; definition: string }[] = summary?.definitionsJson ? JSON.parse(summary.definitionsJson) : [];
  const flashcards: { question: string; answer: string }[] = summary?.flashcardsJson ? JSON.parse(summary.flashcardsJson) : [];
  const resources: { title: string; url: string; type: string; size: string }[] = activeLesson.resourcesJson ? JSON.parse(activeLesson.resourcesJson) : [];

  const allLessons = course.sections.flatMap((s: any) => s.lessons);
  const progressPercent = allLessons.length > 0 ? Math.round((completedLessonIds.length / allLessons.length) * 100) : 0;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || savingNote) return;
    setSavingNote(true);

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: activeLesson.id,
          timestampSeconds: 0,
          content: newNoteContent,
        })
      });
      const data = await res.json();
      if (data.note) {
        setNotes([data.note, ...notes]);
        setNewNoteContent('');
      }
    } catch (e) {
    } finally {
      setSavingNote(false);
    }
  };

  const handleSendAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userText = aiInput.trim();
    setAiMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setAiInput('');
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: activeLesson.id,
          message: userText,
        })
      });
      const data = await res.json();
      setAiMessages((prev) => [...prev, { sender: 'ai', text: data.reply || 'أنا جاهز للإجابة على استفساراتك!' }]);
    } catch (e) {
      setAiMessages((prev) => [...prev, { sender: 'ai', text: 'حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleLessonPassed = (result?: any) => {
    if (!completedLessonIds.includes(activeLesson.id)) {
      setCompletedLessonIds((prev) => [...prev, activeLesson.id]);
    }
    if (result?.certificate) {
      setIssuedCertificate(result.certificate);
    }
    router.refresh();
  };

  const toggleCardFlip = (index: number) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Focused Learning Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/"
            className="text-xs font-bold text-zinc-400 hover:text-amber-300 flex items-center gap-1 shrink-0 transition-colors p-1"
            title="العودة للرئيسية"
          >
            <span>الرئيسية</span>
          </Link>
          <span className="text-zinc-700 shrink-0">/</span>
          <Link
            href={`/courses/${course.slug}`}
            className="text-xs font-bold text-zinc-400 hover:text-amber-300 flex items-center gap-1 shrink-0 transition-colors p-1"
            title="العودة لصفحة الكورس"
          >
            <span className="hidden xs:inline">صفحة الكورس</span>
            <span className="xs:hidden">رجوع</span>
          </Link>
          <span className="text-zinc-700 shrink-0">|</span>
          <span className="text-xs font-bold text-white truncate max-w-[130px] xs:max-w-[220px] sm:max-w-md">
            {course.title}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="text-[11px] text-zinc-400 hidden sm:inline">إنجازك في الكورس:</span>
          <div className="w-16 xs:w-24 sm:w-28 h-2 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/60">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-amber-400">{progressPercent}%</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content Area (Video & Tabs) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Free Preview Banner if not enrolled */}
          {!isEnrolled && activeLesson.isFreePreview && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-zinc-900 to-amber-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/40">
                  <Unlock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white">أنت تشاهد هذا الدرس كمعاينة مجانية (Free Preview) </h4>
                  <p className="text-[11px] text-zinc-400">سجل الآن واشترك في الكورس لفتح كافة المحاضرات والمشاريع والشهادة المعتمدة.</p>
                </div>
              </div>

              <Link
                href={`/checkout?courseId=${course.id}`}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-xs shadow-md transition-all self-start sm:self-center shrink-0"
              >
                الاشتراك في المسار كاملاً
              </Link>
            </div>
          )}

          {/* Video Player */}
          {activeLesson.videoUrl ? (
            <VideoPlayer
              videoUrl={activeLesson.videoUrl}
              lessonId={activeLesson.id}
              courseSlug={course.slug}
              isFreePreview={activeLesson.isFreePreview}
              isEnrolled={isEnrolled}
              userWatermark={
                user ? { username: user.username, email: user.email } : undefined
              }
              onProgressUpdate={(watched, total, percent, completed) => {
                if (completed && !completedLessonIds.includes(activeLesson.id)) {
                  setCompletedLessonIds((prev) => [...prev, activeLesson.id]);
                }
              }}
            />
          ) : (
            <div className="w-full aspect-video rounded-3xl bg-surface border border-border flex items-center justify-center p-8 text-center text-zinc-400">
              <div>
                <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">درس قراءة ومحتوى كتابي</p>
                <p className="text-xs text-zinc-500 mt-1">يرجى قراءة الملخص والملاحظات والمصادر المرفقة أدناه.</p>
              </div>
            </div>
          )}

          {/* Lesson Title & Action Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-border">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-primary-400">
                {activeLesson.section?.title || 'الوحدة التعليمية'}
              </span>
              <h1 className="text-lg font-black text-white">{activeLesson.title}</h1>
              {activeLesson.description && (
                <p className="text-xs text-zinc-400">{activeLesson.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeLesson.quiz && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveQuiz(activeLesson.quiz);
                    setIsQuizOpen(true);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
                    completedLessonIds.includes(activeLesson.id)
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/40'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-purple-200" />
                  <span>{completedLessonIds.includes(activeLesson.id) ? 'إعادة حل الاختبار' : 'بدء اختبار الدرس'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Mandatory Quiz Status Banner */}
          {activeLesson.quiz && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                completedLessonIds.includes(activeLesson.id)
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                  : 'bg-gradient-to-r from-purple-950 via-purple-900/40 to-zinc-900 border-2 border-purple-500 shadow-xl'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      completedLessonIds.includes(activeLesson.id)
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                    }`}
                  >
                    {completedLessonIds.includes(activeLesson.id) ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-white">
                      {completedLessonIds.includes(activeLesson.id)
                        ? 'تم اجتياز اختبار هذا الدرس بنجاح! تم فتح الدرس التالي '
                        : 'اختبار الدرس إجباري لفتح المحاضرة التالية '}
                    </h3>
                    <p className="text-[11px] text-zinc-300 mt-0.5">
                      {completedLessonIds.includes(activeLesson.id)
                        ? 'أحسنت! يمكنك الآن الانتقال للدرس التالي، أو إعادة الاختبار للمراجعة.'
                        : `يجب الحصول على ${activeLesson.quiz.passingScorePercent}% كحد أدنى لاجتياز الدرس والانتقال للمحاضرة التالية.`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveQuiz(activeLesson.quiz);
                    setIsQuizOpen(true);
                  }}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black shadow-md transition-all hover:scale-105 shrink-0 cursor-pointer ${
                    completedLessonIds.includes(activeLesson.id)
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 text-white shadow-purple-950/50'
                  }`}
                >
                  {completedLessonIds.includes(activeLesson.id) ? 'إعادة حل الاختبار' : 'بدء اختبار الدرس الآن '}
                </button>
              </div>
            </div>
          )}

          {/* Certificate Awarded Top Banner */}
          {issuedCertificate && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border border-amber-500/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-black text-white"> مبارك! تم إصدار شهادتك المعتمدة للكورس!</h4>
                  <p className="text-xs text-zinc-300">
                    رقم الشهادة: <span className="font-mono text-amber-300 font-bold">{issuedCertificate.certificateNumber}</span>
                  </p>
                </div>
              </div>
              <a
                href={issuedCertificate.verificationUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-md shrink-0"
              >
                معاينة وتحميل الشهادة PDF 
              </a>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="border-b border-border flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'summary'
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-900/30'
                  : 'bg-surface text-zinc-400 hover:text-white hover:bg-surface-raised'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>الملخص والمفاهيم</span>
            </button>

            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'flashcards'
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-900/30'
                  : 'bg-surface text-zinc-400 hover:text-white hover:bg-surface-raised'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>بطاقات المراجعة (Flashcards)</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'notes'
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-900/30'
                  : 'bg-surface text-zinc-400 hover:text-white hover:bg-surface-raised'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>ملاحظاتي ({notes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'ai'
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-900/30'
                  : 'bg-surface text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-900/40'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>المساعد الذكي (AI)</span>
            </button>

            {resources.length > 0 && (
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'resources'
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-900/30'
                    : 'bg-surface text-zinc-400 hover:text-white hover:bg-surface-raised'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>المرفقات ({resources.length})</span>
              </button>
            )}
          </div>

          {/* Tab Content 1: Summary */}
          {activeTab === 'summary' && (
            <div className="p-6 rounded-3xl bg-surface border border-border space-y-6">
              {summary ? (
                <>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary-400" />
                      ملخص الدرس
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed bg-surface-raised/60 p-4 rounded-2xl border border-border/80">
                      {summary.summaryText}
                    </p>
                  </div>

                  {keyPoints.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        النقاط الجوهرية (Key Takeaways)
                      </h3>
                      <ul className="space-y-2">
                        {keyPoints.map((kp, i) => (
                          <li
                            key={i}
                            className="text-xs text-zinc-300 flex items-start gap-2.5 bg-surface-raised/40 p-3 rounded-xl border border-border/60"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                            <span className="leading-relaxed">{kp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {definitions.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-white">المصطلحات والمفاهيم الأساسية</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {definitions.map((d, i) => (
                          <div key={i} className="p-3.5 rounded-xl bg-surface-raised border border-border space-y-1">
                            <span className="text-xs font-bold text-primary-300">{d.term}</span>
                            <p className="text-[11px] text-zinc-400 leading-relaxed">{d.definition}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-zinc-400 text-center py-6">
                  لا يوجد ملخص مخصص لهذا الدرس حالياً. يمكنك استخدام المساعد الذكي لتوليد ملخص فوري!
                </p>
              )}
            </div>
          )}

          {/* Tab Content 2: Flashcards */}
          {activeTab === 'flashcards' && (
            <div className="p-6 rounded-3xl bg-surface border border-border space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  بطاقات المراجعة السريعة (اضغط على البطاقة لإظهار الإجابة)
                </h3>
                <p className="text-xs text-zinc-400">
                  طريقة فعالة لتثبيت المفاهيم واختبار فهمك السريع قبل الاختبار التقييمي.
                </p>
              </div>

              {flashcards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {flashcards.map((card, i) => {
                    const isFlipped = Boolean(flippedCards[i]);
                    return (
                      <div
                        key={i}
                        onClick={() => toggleCardFlip(i)}
                        className={`p-6 rounded-2xl border cursor-pointer min-h-[140px] flex flex-col justify-between transition-all select-none ${
                          isFlipped
                            ? 'bg-purple-950/50 border-purple-700 text-purple-100 shadow-lg shadow-purple-950/50'
                            : 'bg-surface-raised border-border text-zinc-200 hover:border-primary-500'
                        }`}
                      >
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 text-primary-300 border border-primary-900 inline-block">
                            {isFlipped ? 'الإجابة ' : 'السؤال '}
                          </span>
                          <p className="text-xs font-semibold leading-relaxed">
                            {isFlipped ? card.answer : card.question}
                          </p>
                        </div>
                        <span className="text-[10px] text-zinc-500 self-end mt-2">
                          {isFlipped ? 'اضغط للعودة للسؤال' : 'اضغط لإظهار الإجابة'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 text-center py-8">
                  لا توجد بطاقات تعليمية مجهزة لهذا الدرس.
                </p>
              )}
            </div>
          )}

          {/* Tab Content 3: Notes */}
          {activeTab === 'notes' && (
            <div className="p-6 rounded-3xl bg-surface border border-border space-y-6">
              <form onSubmit={handleAddNote} className="space-y-3">
                <label className="block text-xs font-bold text-white">إضافة ملاحظة جديدة لهذا الدرس:</label>
                <textarea
                  rows={3}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="اكتب ملاحظتك الشخصية أو نقطة هامة تريد تذكرها..."
                  className="w-full px-4 py-3 rounded-2xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingNote || !newNoteContent.trim()}
                    className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{savingNote ? 'جاري الحفظ...' : 'حفظ الملاحظة'}</span>
                  </button>
                </div>
              </form>

              <div className="space-y-3 pt-4 border-t border-border">
                <h4 className="text-xs font-bold text-zinc-400">ملاحظاتك السابقة ({notes.length}):</h4>
                {notes.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">لم تكتب أي ملاحظات لهذا الدرس بعد.</p>
                ) : (
                  notes.map((n) => (
                    <div key={n.id} className="p-3.5 rounded-xl bg-surface-raised border border-border/80 space-y-1">
                      <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap">{n.content}</p>
                      <span className="text-[10px] text-zinc-500 block">{formatDate(n.createdAt)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab Content 4: AI Assistant */}
          {activeTab === 'ai' && (
            <div className="p-6 rounded-3xl bg-surface border border-purple-800/40 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-primary-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">المساعد الذكي للدرس (AI Tutor)</h3>
                  <p className="text-[10px] text-zinc-400">يجيب على أسئلتك ويشرح المفاهيم المعقدة في هذا الدرس</p>
                </div>
              </div>

              {/* Chat messages */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {aiMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                      msg.sender === 'user'
                        ? 'bg-primary-600 text-white mr-auto text-left'
                        : 'bg-surface-raised border border-border text-zinc-200 ml-auto text-right'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))}
                {aiLoading && (
                  <div className="p-3 rounded-2xl bg-surface-raised border border-border text-xs text-zinc-400 animate-pulse ml-auto">
                    المساعد الذكي يكتب الإجابة... 
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendAi} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="اسأل المساعد الذكي عن أي جزئية في هذا الدرس..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  disabled={aiLoading || !aiInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال</span>
                </button>
              </form>
            </div>
          )}

          {/* Tab Content 5: Resources */}
          {activeTab === 'resources' && (
            <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
              <h3 className="text-sm font-bold text-white">الملفات والمصادر المرفقة بالدرس:</h3>
              <div className="space-y-2">
                {resources.map((r, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-surface-raised border border-border flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary-400" />
                      <span className="font-bold text-white">{r.title}</span>
                      <span className="text-zinc-500 text-[10px]">({r.size})</span>
                    </div>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-lg bg-primary-600/20 text-primary-300 hover:bg-primary-600 hover:text-white font-bold transition-colors"
                    >
                      تحميل الملف
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar (Curriculum Tree & Final Exam) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-5 rounded-3xl bg-surface border border-border space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary-400" />
                محتويات المنهج
              </h3>
              <span className="text-xs text-zinc-400 font-mono">
                {completedLessonIds.length} / {allLessons.length}
              </span>
            </div>

            {/* Sections List */}
            <div className="space-y-4">
              {course.sections.map((sec: any, sIdx: number) => (
                <div key={sec.id} className="space-y-1.5">
                  <p className="text-xs font-bold text-primary-300 px-1">
                    {sIdx + 1}. {sec.title}
                  </p>

                  <div className="space-y-1">
                    {sec.lessons.map((lesson: any) => {
                      const isActive = lesson.id === activeLesson.id;
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      const lessonGlobalIndex = allLessons.findIndex((l: any) => l.id === lesson.id);
                      const isLocked = !isEnrolled
                        ? !lesson.isFreePreview
                        : lessonGlobalIndex > 0 && !completedLessonIds.includes(allLessons[lessonGlobalIndex - 1].id);

                      if (isLocked) {
                        return (
                          <div
                            key={lesson.id}
                            className="p-2.5 px-3 rounded-xl text-xs flex items-center justify-between bg-surface-raised/40 text-zinc-600 border border-border/40 cursor-not-allowed select-none opacity-60"
                            title="يجب اجتياز الدرس السابق واختباره لفتح هذا الدرس"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Lock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                              <span className="truncate">{lesson.title}</span>
                            </div>
                            <span className="text-[10px] text-amber-500/80 font-bold">مقفل </span>
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={lesson.id}
                          href={`/learn/${course.slug}/${lesson.slug}`}
                          className={`p-2.5 px-3 rounded-xl text-xs flex items-center justify-between transition-all ${
                            isActive
                              ? 'bg-primary-600 text-white font-bold shadow-md shadow-primary-900/30'
                              : 'bg-surface-raised text-zinc-300 hover:bg-surface-card hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <PlayCircle className="w-4 h-4 text-zinc-500 shrink-0" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className="text-[10px] opacity-75 shrink-0 mr-2">
                            {lesson.durationMinutes} د
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Final Exam Launcher */}
            {course.finalExam && (
              <div className="pt-4 border-t border-border space-y-2">
                {completedLessonIds.length < allLessons.length ? (
                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-900/40 text-center space-y-1">
                    <div className="text-xs text-zinc-400 flex items-center justify-center gap-1.5 font-bold">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>الامتحان النهائي مقفل</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">
                      يجب اجتياز جميع دروس الكورس ({completedLessonIds.length}/{allLessons.length}) لفتح الامتحان والشهادة.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveQuiz(course.finalExam);
                      setIsQuizOpen(true);
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-yellow-300" />
                    <span>بدء الامتحان النهائي وإصدار الشهادة </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          onPassed={handleLessonPassed}
        />
      )}

      {/* Forced Review Modal */}
      <ForcedReviewModal
        courseId={course.id}
        courseTitle={course.title}
        isOpen={isReviewModalOpen}
        onSubmitted={() => {
          setHasReviewed(true);
          setIsReviewModalOpen(false);
        }}
      />
    </div>
  );
}