'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react';

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  optionsJson: string;
  points: number;
}

interface QuizModalProps {
  quiz: {
    id: string;
    title: string;
    description?: string | null;
    timeLimitMinutes: number;
    passingScorePercent: number;
    questions: Question[];
  };
  isOpen: boolean;
  onClose: () => void;
  onPassed?: () => void;
}

export default function QuizModal({ quiz, isOpen, onClose, onPassed }: QuizModalProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimitMinutes * 60);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || result) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, result]);

  if (!isOpen || !mounted) return null;

  const handleOptionSelect = (questionId: string, optionId: string, questionType: string) => {
    if (result) return; // Prevent change after grading

    if (questionType === 'MULTIPLE_CHOICE' || questionType === 'TRUE_FALSE') {
      setAnswers({ ...answers, [questionId]: optionId });
    } else if (questionType === 'MULTIPLE_ANSWERS') {
      const currentSelected: string[] = answers[questionId] || [];
      const updated = currentSelected.includes(optionId)
        ? currentSelected.filter((id) => id !== optionId)
        : [...currentSelected, optionId];
      setAnswers({ ...answers, [questionId]: updated });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          answers,
          timeSpentSeconds: quiz.timeLimitMinutes * 60 - timeRemaining,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'فشل إرسال الاختبار');
      } else {
        setResult(data);
        if (data.isPassed && onPassed) {
          onPassed();
        }
      }
    } catch (e) {
      setError('حدث خطأ أثناء رصد النتيجة');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setResult(null);
    setTimeRemaining(quiz.timeLimitMinutes * 60);
    setError('');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] w-screen h-[100dvh] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl p-5 sm:p-8 space-y-6 my-auto max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-primary-400">اختبار تقييمي فوري</span>
            <h2 className="text-xl font-bold text-white">{quiz.title}</h2>
            {quiz.description && <p className="text-xs text-zinc-400">{quiz.description}</p>}
          </div>

          <div className="flex items-center gap-3">
            {!result && (
              <div className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timeRemaining)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-surface-raised text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Banner */}
        {result && (
          <div
            className={`p-6 rounded-2xl border text-center space-y-3 ${
              result.isPassed
                ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                : 'bg-rose-950/40 border-rose-700 text-rose-300'
            }`}
          >
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-black/40 text-2xl">
              {result.isPassed ? '🎉' : '⚠️'}
            </div>
            <h3 className="text-lg font-black text-white">
              {result.isPassed ? 'تم اجتياز التقييم بنجاح 🎉' : 'للأسف لم تحقق درجة النجاح المطلوبة'}
            </h3>
            {result.isPassed && result.motivationalMessage && (
              <div className="inline-block px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-sm font-black shadow-lg">
                {result.motivationalMessage}
              </div>
            )}
            <p className="text-sm font-bold">
              الدرجة المحققة: {result.score} من {result.totalPoints} ({result.percentage}%) • درجة النجاح: {quiz.passingScorePercent}%
            </p>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {quiz.questions.map((q, index) => {
            const options: { id: string; text: string }[] = JSON.parse(q.optionsJson);
            const questionResult = result?.questionResults?.find((r: any) => r.questionId === q.id);

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl bg-surface-raised border transition-all ${
                  questionResult
                    ? questionResult.isCorrect
                      ? 'border-emerald-800/80 bg-emerald-950/10'
                      : 'border-rose-800/80 bg-rose-950/10'
                    : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h4 className="text-sm font-bold text-white flex items-start gap-2">
                    <span className="w-5 h-5 rounded-md bg-primary-950 text-primary-300 text-xs flex items-center justify-center shrink-0 mt-0.5 border border-primary-800">
                      {index + 1}
                    </span>
                    <span>{q.questionText}</span>
                  </h4>
                  <span className="text-[11px] text-zinc-500 shrink-0">
                    ({q.points} {q.points > 1 ? 'درجات' : 'درجة'})
                  </span>
                </div>

                {/* Options List */}
                <div className="space-y-2 pt-1">
                  {options.map((opt) => {
                    const isSelected =
                      q.questionType === 'MULTIPLE_ANSWERS'
                        ? (answers[q.id] || []).includes(opt.id)
                        : answers[q.id] === opt.id;

                    const isCorrectAnswer = questionResult?.correctAnswers?.includes(opt.id);

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleOptionSelect(q.id, opt.id, q.questionType)}
                        className={`w-full text-right p-3 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                          isSelected
                            ? 'bg-primary-950/80 border-primary-600 text-white'
                            : 'bg-surface-card border-border/80 text-zinc-300 hover:bg-surface-raised'
                        } ${
                          result && isCorrectAnswer
                            ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200'
                            : ''
                        }`}
                      >
                        <span>{opt.text}</span>
                        <div
                          className={`w-4 h-4 rounded-${
                            q.questionType === 'MULTIPLE_ANSWERS' ? 'md' : 'full'
                          } border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-primary-600 border-primary-400' : 'border-zinc-600'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on result */}
                {questionResult && questionResult.explanation && (
                  <div className="mt-3 p-3 rounded-xl bg-surface-card border border-border/60 text-xs text-zinc-400">
                    <p className="font-bold text-zinc-300 mb-0.5">الشرح والتوضيح:</p>
                    <p>{questionResult.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          {result ? (
            <div className="flex items-center gap-3 w-full justify-between">
              <button
                type="button"
                onClick={handleRetake}
                className="px-5 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-card border border-border text-white text-xs font-bold flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                إعادة المحاولة
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold"
              >
                إغلاق و متابعة الدرس
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-end w-full gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-surface-raised text-zinc-300 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-primary-900/30 transition-all disabled:opacity-50"
              >
                {submitting ? 'جاري الرصد والتقييم...' : 'تسليم الإجابات وإنهاء الاختبار'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}