'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Star, Sparkles, MessageSquare, CheckCircle2, Lock } from 'lucide-react';

interface ForcedReviewModalProps {
  courseId: string;
  courseTitle: string;
  isOpen: boolean;
  onSubmitted: () => void;
}

export default function ForcedReviewModal({
  courseId,
  courseTitle,
  isOpen,
  onSubmitted,
}: ForcedReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      setError('يرجى اختيار عدد النجوم لتقييم الكورس');
      return;
    }
    if (!comment.trim()) {
      setError('يرجى مشاركة رأيك بكلمات بسيطة لدعم تطوير المنهج');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'فشل إرسال التقييم');
      } else {
        onSubmitted();
      }
    } catch (e) {
      setError('حدث خطأ في الاتصال، يرجى المحاولة ثانية');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] w-screen h-[100dvh] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-900 border border-amber-500/40 shadow-2xl p-6 sm:p-8 space-y-6 my-auto animate-in zoom-in-95 duration-200">
        {/* Header with Lock Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
            <Star className="w-7 h-7 fill-amber-400 text-amber-400" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-bold">
            تقييم جودة المنهج التدريبي
          </span>
          <h2 className="text-xl font-black text-white">ما هو تقييمك لمحتوى الكورس حتى الآن؟</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            لقد أتممت الدرسين الأول والثاني من كورس <strong className="text-white">"{courseTitle}"</strong> بنجاح! نود معرفة انطباعك لمواصلة فتح باقي الدروس المتقدمة لك.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Selector */}
          <div className="flex flex-col items-center justify-center gap-2 py-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    aria-label={`${star} نجوم`}
                  >
                    <Star
                      className={`w-9 h-9 transition-colors ${
                        active
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-700 hover:text-zinc-500'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-bold text-amber-300">
              {rating === 5 && 'ممتاز جداً - محتوى احترافي '}
              {rating === 4 && 'جيد جداً - شرح متميز '}
              {rating === 3 && 'جيد '}
              {rating === 2 && 'مقبول '}
              {rating === 1 && 'يحتاج تحسين '}
            </span>
          </div>

          {/* Comment Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 block">
              رأيك الصادق وملاحظاتك (إلزامي لفتح باقي الدروس):
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب تجربتك مع الشرح، التطبيق العملي، وملاحظاتك للمحاضر..."
              className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-xs text-white placeholder-zinc-500 outline-none transition-colors resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm shadow-xl shadow-amber-950/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            {submitting ? (
              <span>جاري حفظ التقييم وفتح باقي الدروس...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>إرسال التقييم ومتابعة باقي المنهج </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
