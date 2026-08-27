'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FileUploadInput from '@/components/FileUploadInput';
import { formatPrice, formatDuration } from '@/lib/utils';
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Plus,
  PlayCircle,
  Clock,
  TrendingUp,
  MessageSquare,
  Trash2,
  AlertTriangle,
  X,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

interface InstructorClientProps {
  user: any;
  initialCourses: any[];
  totalStudents: number;
}

export default function InstructorClient({
  user,
  initialCourses,
  totalStudents,
}: InstructorClientProps) {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>(initialCourses);
  const [deletingCourse, setDeletingCourse] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // New Course Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    shortDescription: '',
    description: '',
    thumbnail: '',
    price: 900,
    durationHours: 20,
    level: 'BEGINNER',
  });

  const handleDeleteCourse = async () => {
    if (!deletingCourse || isDeleting) return;

    setIsDeleting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/courses?id=${deletingCourse.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.id !== deletingCourse.id));
        setMessage({ type: 'success', text: data.message || 'تم حذف الكورس بنجاح.' });
        setDeletingCourse(null);
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل حذف الكورس' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء الاتصال بالخادم' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title.trim() || isCreating) return;

    setIsCreating(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse),
      });

      const data = await res.json();
      if (res.ok && data.course) {
        setCourses((prev) => [
          {
            ...data.course,
            instructor: { officialFullName: user.officialFullName },
            _count: { sections: 0, enrollments: 0 },
            sections: [],
          },
          ...prev,
        ]);
        setMessage({ type: 'success', text: 'تم إنشاء الكورس الجديد بنجاح!' });
        setShowAddModal(false);
        setNewCourse({
          title: '',
          shortDescription: '',
          description: '',
          price: 900,
          durationHours: 20,
          level: 'BEGINNER',
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل إنشاء الكورس' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال' });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-1">
          <span className="text-xs font-bold text-purple-400">استوديو المحاضر المعتمد</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-primary-400" />
            لوحة المعلم: {user.officialFullName}
          </h1>
          <p className="text-xs text-zinc-400">
            إدارة دوراتك التدريبية، إضافة دورات جديدة، حذف وتعديل الكورسات، ومتابعة أداء الطلاب
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-primary-900/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة كورس جديد</span>
          </button>

          <Link
            href="/chat"
            className="px-4 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-card border border-border text-white font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-primary-400" />
            <span>محادثات الطلاب</span>
          </Link>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/70 border border-rose-800 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
          <span className="text-xs text-zinc-400">الدورات التدريبية النشطة</span>
          <p className="text-2xl font-black text-white">{courses.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
          <span className="text-xs text-zinc-400">إجمالي الطلاب في دوراتك</span>
          <p className="text-2xl font-black text-white">{totalStudents} طالب</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
          <span className="text-xs text-zinc-400">التقييم العام للمحاضر</span>
          <p className="text-2xl font-black text-emerald-400">4.9 / 5.0 ⭐</p>
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">الدورات التي تقدمها ({courses.length})</h2>
          <span className="text-xs text-zinc-400">يمكنك معاينة، دخول، أو حذف أي دورة تدريبية</span>
        </div>

        {courses.length === 0 ? (
          <div className="p-12 rounded-3xl bg-surface border border-border text-center space-y-4">
            <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-white">لا توجد لديك دورات حالياً</h3>
            <p className="text-xs text-zinc-400">قم بإضافة أول دورة تدريبية لك في الأكاديمية</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-xs inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة كورس جديد</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-6 rounded-3xl bg-surface border border-border space-y-4 shadow-lg hover:border-primary-600/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                        {course.status === 'PUBLISHED' ? 'منشور للطلاب' : 'مسودة'}
                      </span>
                      <h3 className="text-base font-bold text-white leading-snug">{course.title}</h3>
                    </div>
                    <span className="text-base font-black text-primary-300 shrink-0">
                      {formatPrice(course.price)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-raised border border-border/80 text-xs text-zinc-400 flex items-center justify-between">
                    <span>{course._count?.sections || 0} وحدات تعليمية</span>
                    <span>{course._count?.enrollments || 0} طالب مسجل</span>
                    <span>{formatDuration(course.durationHours)}</span>
                  </div>
                </div>

                {/* Card Actions Bottom Row */}
                <div className="flex items-center justify-between pt-3 border-t border-border/80 gap-2">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="text-xs font-bold text-primary-400 hover:underline flex items-center gap-1"
                    >
                      <span>معاينة صفحة الكورس</span>
                      <span>←</span>
                    </Link>

                    <Link
                      href={`/learn/${course.slug}/${course.sections?.[0]?.lessons?.[0]?.slug || ''}`}
                      className="px-3.5 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs transition-colors"
                    >
                      دخول قاعة الدرس
                    </Link>
                  </div>

                  {/* Red Delete Course Button */}
                  <button
                    type="button"
                    onClick={() => setDeletingCourse(course)}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 hover:scale-105"
                    title="حذف الكورس نهائياً"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف الكورس</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal (via Portal) */}
      {mounted && deletingCourse && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-surface border border-rose-900/60 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">تأكيد حذف الكورس نهائياً ⚠️</h3>
                  <span className="text-[11px] text-rose-400 font-semibold">إجراء لا يمكن التراجع عنه</span>
                </div>
              </div>
              <button
                onClick={() => !isDeleting && setDeletingCourse(null)}
                className="p-1 rounded-lg bg-surface-raised text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-zinc-300 leading-relaxed bg-surface-raised/60 p-4 rounded-2xl border border-border/80">
              <p>
                هل أنت متأكد من رغبتك في حذف كورس: <br />
                <strong className="text-white text-sm block mt-1">"{deletingCourse.title}"</strong>
              </p>
              <p className="text-zinc-400 text-[11px] pt-1">
                سيتم حذف كافة الوحدات والدروس والفيديوهات والملخصات والاختبارات التقييمية المرتبطة بهذا الكورس من قاعدة البيانات بالكامل.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingCourse(null)}
                className="px-5 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-card border border-border text-xs font-bold text-zinc-300 hover:text-white transition-colors"
              >
                إلغاء وتراجع
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteCourse}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-950/50 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'جاري الحذف...' : 'نعم، احذف الكورس نهائياً'}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Add New Course Modal (via Portal) */}
      {mounted && showAddModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary-400" />
                <span>إضافة كورس تدريبي جديد</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg bg-surface-raised text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">عنوان الكورس *</label>
                <input
                  type="text"
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="مثال: دورة احتراف React 19 و Next.js 15"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">نبذة تسويقية قصيرة</label>
                <input
                  type="text"
                  value={newCourse.shortDescription}
                  onChange={(e) => setNewCourse({ ...newCourse, shortDescription: e.target.value })}
                  placeholder="وصف مختصر يظهر في بطاقات الكورس"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <FileUploadInput
                label="صورة غلاف الكورس (Thumbnail)"
                folder="thumbnails"
                accept="image/*"
                currentValue={newCourse.thumbnail}
                onUploadComplete={(url) => setNewCourse({ ...newCourse, thumbnail: url })}
                helperText="ارفع صورة عالية الجودة للكورس من جهازك أو هاتفك"
              />

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">الوصف التفصيلي للكورس *</label>
                <textarea
                  rows={3}
                  required
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="اشرح محاور الدورة والمشاريع العملية المستهدفة..."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">السعر (ج.م)</label>
                  <input
                    type="number"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">الساعات</label>
                  <input
                    type="number"
                    value={newCourse.durationHours}
                    onChange={(e) => setNewCourse({ ...newCourse, durationHours: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">المستوى</label>
                  <select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                  >
                    <option value="BEGINNER">مبتدئ</option>
                    <option value="INTERMEDIATE">متوسط</option>
                    <option value="ADVANCED">متقدم</option>
                    <option value="ALL">كافة المستويات</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-surface-raised text-xs font-bold text-zinc-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newCourse.title.trim()}
                  className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreating ? 'جاري الإنشاء...' : 'نشر الكورس الآن'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}