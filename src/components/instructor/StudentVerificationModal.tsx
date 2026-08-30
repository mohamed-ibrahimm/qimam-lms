'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import FileUploadInput from '@/components/FileUploadInput';
import {
  GraduationCap,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X,
  Calendar,
  Building,
  BookOpen,
  FileCheck,
  Send,
  Loader2
} from 'lucide-react';

interface StudentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: any;
  onSuccess?: () => void;
}

export default function StudentVerificationModal({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}: StudentVerificationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [university, setUniversity] = useState(currentUser?.studentUniversity || '');
  const [faculty, setFaculty] = useState(currentUser?.studentFaculty || '');
  const [studyYear, setStudyYear] = useState(currentUser?.studentStudyYear || 'الفرقة الثالثة');
  const [birthDate, setBirthDate] = useState(
    currentUser?.studentBirthDate
      ? new Date(currentUser.studentBirthDate).toISOString().split('T')[0]
      : '2003-05-15'
  );
  const [studentIdCardUrl, setStudentIdCardUrl] = useState(currentUser?.studentIdCardUrl || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Live Age Calculation
  const calculateAge = (dateStr: string) => {
    if (!dateStr) return null;
    const b = new Date(dateStr);
    if (isNaN(b.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - b.getFullYear();
    const m = today.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
    return age;
  };

  const currentAge = calculateAge(birthDate);
  const isAgeValid = currentAge !== null && currentAge >= 16 && currentAge <= 22;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!isAgeValid) {
      setError('هذه المنحة مخصصة حصرياً للطلاب حتى سن 22 سنة فقط. إذا كان عمرك أكبر من ذلك، يمكنك الاشتراك في إحدى باقات المدرسين والدكاترة العادية.');
      return;
    }

    if (!studentIdCardUrl) {
      setError('يرجى رفع صورة تثبت قيدك الدراسي حالياً (كارنيه الكلية أو المدرسة، جدول المحاضرات أو الحصص، أو إثبات قيد).');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/instructor/student-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          university,
          faculty,
          studyYear,
          birthDate,
          studentIdCardUrl,
          nationalIdUrl: null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'فشل إرسال طلب التوثيق');
      } else {
        setSuccessMessage(data.message || 'تم تفعيل شهر كامل (30 يوماً مجاناً) بنجاح!');
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setError('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 bg-zinc-900/95 shrink-0 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black inline-flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              منحة تمكين طلبة الجامعات (سن 22 سنة فأقل)
            </span>
            <h3 className="text-base font-black text-white">توثيق هوية طالب جامعي وتفعيل شهر كامل مجاناً</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {successMessage ? (
          <div className="p-6 sm:p-8 space-y-5 text-center my-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-white">تهانينا! تم تفعيل شهر كامل مجاناً</h3>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-md mx-auto">
                {successMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-lg shadow-amber-950/40"
            >
              الذهاب إلى استوديو المحاضر الآن
            </button>
          </div>
        ) : (
          <form id="studentVerifForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {/* Offer highlight notice */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 leading-relaxed">
                <span className="font-black text-white block">مميزات باقة الطالب الصاعد:</span>
                <span>فترة تجريبية 30 يوماً مجاناً بالكامل + اشتراك شهري مدعوم ومخفض بعد انتهاء الشهر + شارة "طالب معتمد" لكسب ثقة زملائك.</span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* University / School & Faculty / Stage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">الجامعة أو المدرسة *</label>
                <input
                  type="text"
                  required
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="مثال: جامعة القاهرة / مدرسة المتفوقين أو الثانوية"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">الكلية أو المرحلة والتخصص *</label>
                <input
                  type="text"
                  required
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  placeholder="مثال: حاسبات ومعلومات / ثانوية عامة / لغات"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Study Year / Grade & Date of Birth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">الفرقة أو الصف الدراسي الحالي *</label>
                <select
                  value={studyYear}
                  onChange={(e) => setStudyYear(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="الفرقة الأولى (جامعة)">الفرقة الأولى (جامعة)</option>
                  <option value="الفرقة الثانية (جامعة)">الفرقة الثانية (جامعة)</option>
                  <option value="الفرقة الثالثة (جامعة)">الفرقة الثالثة (جامعة)</option>
                  <option value="الفرقة الرابعة (جامعة)">الفرقة الرابعة (جامعة)</option>
                  <option value="الفرقة الخامسة أو امتياز">الفرقة الخامسة أو امتياز</option>
                  <option value="المرحلة الثانوية - الصف الثالث">المرحلة الثانوية - الصف الثالث</option>
                  <option value="المرحلة الثانوية - الصف الثاني">المرحلة الثانوية - الصف الثاني</option>
                  <option value="المرحلة الثانوية - الصف الأول">المرحلة الثانوية - الصف الأول</option>
                  <option value="طالب بمعهد فني أو تكنولوجي">طالب بمعهد فني أو تكنولوجي</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  تاريخ الميلاد (شرط السن: حتى 22 سنة) *
                </label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
                {currentAge !== null && (
                  <span className={`text-[11px] font-bold mt-1 block ${
                    isAgeValid ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {isAgeValid
                      ? `عمرك المحسوب: ${currentAge} سنة (مؤهل لمنحة الطلاب)`
                      : `عمرك المحسوب: ${currentAge} سنة (يتجاوز شرط الحد الأقصى 22 سنة - يجب الاشتراك في باقة المدرسين والدكاترة العادية)`}
                  </span>
                )}
              </div>
            </div>

            {/* Student Proof Document Upload (Card, Schedule, or Enrollment Proof) */}
            <div>
              <FileUploadInput
                label="مستند إثبات الدراسة الحالي (كارنيه، جدول المحاضرات/الحصص، أو إثبات قيد) *"
                folder="student_proofs"
                accept="image/*,application/pdf"
                currentValue={studentIdCardUrl}
                onUploadComplete={(url) => setStudentIdCardUrl(url)}
                helperText="ارفع صورة واضحة تثبت قيدك الدراسي الحالي (كارنيه الكلية أو المدرسة، جدول المحاضرات/الحصص، إيصال سداد، أو إثبات قيد)"
              />
            </div>
          </form>
        )}

        {/* Sticky Footer */}
        {!successMessage && (
          <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900/95 shrink-0 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              form="studentVerifForm"
              disabled={submitting || !isAgeValid || !studentIdCardUrl}
              className="px-7 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-950/40 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الإرسال والتفعيل...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>تأكيد البيانات وتفعيل شهر مجاناً 🚀</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
