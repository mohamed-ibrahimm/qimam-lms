'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  User,
  LogIn,
  Flame,
  ThumbsUp,
} from 'lucide-react';

interface ReviewUser {
  id: string;
  firstName?: string;
  lastName?: string;
  officialFullName?: string;
  avatarUrl?: string | null;
}

export interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
  user?: ReviewUser | null;
}

interface ItemReviewsSectionProps {
  courseId?: string;
  diplomaId?: string;
  bookId?: string;
  itemTitle?: string;
  initialReviews?: ReviewItem[];
  currentUser?: {
    id: string;
    officialFullName?: string;
    firstName?: string;
    avatarUrl?: string | null;
  } | null;
}

const RATING_LABELS: Record<number, string> = {
  1: 'ضعيف - يحتاج تحسين',
  2: 'مقبول - محتوى متوسط',
  3: 'جيد - مفيد وواضح',
  4: 'جيد جداً - أنصح به بشدة',
  5: 'ممتاز واستثنائي  - يستحق 5 نجوم',
};

export default function ItemReviewsSection({
  courseId,
  diplomaId,
  bookId,
  itemTitle = 'المحتوى',
  initialReviews = [],
  currentUser = null,
}: ItemReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reviewsCount = reviews.length;
  const avgRating = reviewsCount > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviewsCount).toFixed(1)
    : '5.0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (comment.trim().length < 3) {
      setErrorMessage('يرجى كتابة تعليق لا يقل عن 3 أحرف');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          diplomaId,
          bookId,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل إرسال التقييم');
      }

      setSuccessMessage(data.message || 'تم نشر تعليقك وتقييمك بنجاح! ');
      setComment('');

      // Optimistic review update
      if (data.review) {
        setReviews((prev) => {
          const filtered = prev.filter((r) => r.id !== data.review.id && r.user?.id !== currentUser.id);
          return [data.review, ...filtered];
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ أثناء إرسال التقييم');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'ط';
    const clean = name.replace(/م\s*\/\s*|د\s*\/\s*/g, '').trim();
    return clean[0] || 'ط';
  };

  const formatDate = (dateVal: string | Date) => {
    try {
      const d = new Date(dateVal);
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'مؤخراً';
    }
  };

  return (
    <section className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-zinc-900/80 border border-slate-200/90 dark:border-zinc-800/80 shadow-xl space-y-8 text-right">
      
      {/* Header with Average Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-300 text-xs font-bold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>آراء وتجارب الطلاب المشتركين</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            التقييمات والتعليقات ({reviewsCount})
          </h2>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-950/60 px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shrink-0">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(Number(avgRating))
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300 dark:text-zinc-700'
                }`}
              />
            ))}
          </div>
          <span className="text-base font-black text-slate-900 dark:text-white font-mono">
            {avgRating} <span className="text-xs text-slate-400 dark:text-zinc-500 font-sans font-normal">من 5</span>
          </span>
        </div>
      </div>

      {/* Review Submission Form / Guest Prompt */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 rounded-2xl bg-slate-50/90 dark:bg-zinc-950/70 border border-slate-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-amber-500 dark:to-yellow-400 flex items-center justify-center text-xs font-black text-white">
                {getInitials(currentUser.officialFullName || currentUser.firstName)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {currentUser.officialFullName || currentUser.firstName || 'أنت'}
                </p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  طالب معتمد
                </span>
              </div>
            </div>

            {/* Interactive Stars */}
            <div className="flex items-center gap-1 direction-ltr" dir="ltr">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                        : 'text-slate-300 dark:text-zinc-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Rating description helper */}
          <div className="text-left text-[11px] text-amber-600 dark:text-amber-400 font-bold" dir="ltr">
            {RATING_LABELS[hoverRating || rating]}
          </div>

          {/* Comment Textarea */}
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`شارك تجربتك ورأيك في ${itemTitle}، وما هي أكثر النقاط التي استفدت منها...`}
              rows={3}
              maxLength={500}
              className="w-full p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none shadow-xs"
            />
            <span className="absolute bottom-2.5 left-3 text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
              {comment.length}/500
            </span>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || comment.trim().length < 3}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-500 dark:to-yellow-500 hover:from-blue-500 hover:to-indigo-500 dark:hover:from-amber-400 dark:hover:to-yellow-400 text-white dark:text-zinc-950 text-xs sm:text-sm font-black shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              {submitting ? (
                <span>جاري النشر...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>نشر تقييمي وتعليقي</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Guest prompt to login */
        <div className="p-6 rounded-2xl bg-slate-50/90 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-amber-500/10 border border-blue-200 dark:border-amber-500/25 flex items-center justify-center mx-auto text-blue-600 dark:text-amber-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            هل درست هذا المحتوى أو اطلعت عليه؟
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            سجل دخولك الآن لتتمكن من كتابة تعليقك وإضافة تقييمك لمساعدة زملائك الطلاب!
          </p>
          <div className="pt-1">
            <Link
              href={`/login?callbackUrl=${typeof window !== 'undefined' ? encodeURIComponent(window.location.pathname) : ''}`}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 text-xs font-black shadow-md transition-all hover:scale-105"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول لإضافة تعليق وتقييم</span>
            </Link>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-zinc-500 text-xs space-y-1">
            <p>لا توجد تعليقات حتى الآن.</p>
            <p className="text-[11px]">كن أول من يكتب تقييماً بعد الاستفادة من المحتوى!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {reviews.map((rev) => {
              const reviewerName = rev.user?.officialFullName || rev.user?.firstName || 'طالب بأكاديمية محمد إبراهيم';
              return (
                <div key={rev.id} className="py-4 space-y-2 first:pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-xs font-bold text-slate-800 dark:text-zinc-200">
                        {getInitials(reviewerName)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            {reviewerName}
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                            طالب موثق
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                          {formatDate(rev.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed pr-11">
                    {rev.comment}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </section>
  );
}
