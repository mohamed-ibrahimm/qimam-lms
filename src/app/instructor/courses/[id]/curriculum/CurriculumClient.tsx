'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FileUploadInput from '@/components/FileUploadInput';
import { formatDuration } from '@/lib/utils';
import {
  GraduationCap,
  BookOpen,
  Plus,
  PlayCircle,
  Clock,
  Trash2,
  Edit,
  AlertTriangle,
  X,
  ExternalLink,
  CheckCircle2,
  Lock,
  Unlock,
  Eye,
  FileText,
  Video,
  Layers,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Save,
  Check
} from 'lucide-react';

interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  slug: string;
  description: string | null;
  durationMinutes: number;
  isFreePreview: boolean;
  videoUrl: string | null;
  videoProvider: string;
  pdfUrl: string | null;
  orderIndex: number;
}

interface Section {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  orderIndex: number;
  lessons: Lesson[];
}

interface CurriculumClientProps {
  user: any;
  course: any;
  initialSections: Section[];
}

export default function CurriculumClient({
  user,
  course,
  initialSections,
}: CurriculumClientProps) {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Section Modal State
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [sectionForm, setSectionForm] = useState({ title: '', description: '' });
  const [isSavingSection, setIsSavingSection] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);

  // Lesson Modal State
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState<string>('');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    durationMinutes: 15,
    isFreePreview: false,
    videoUrl: '',
    videoProvider: 'DIRECT',
    pdfUrl: '',
    sourceType: 'UPLOAD', // 'UPLOAD' or 'URL'
  });
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);

  // Quick Video Preview Modal
  const [previewingVideoUrl, setPreviewingVideoUrl] = useState<{ title: string; url: string } | null>(null);

  // Deletion Modal State
  const [deletingItem, setDeletingItem] = useState<{ type: 'SECTION' | 'LESSON'; id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate statistics
  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalMinutes = sections.reduce((acc, s) => acc + s.lessons.reduce((lAcc, l) => lAcc + (l.durationMinutes || 0), 0), 0);
  const freePreviewCount = sections.reduce((acc, s) => acc + s.lessons.filter((l) => l.isFreePreview).length, 0);

  // Open Section Modal
  const handleOpenAddSection = () => {
    setEditingSection(null);
    setSectionForm({ title: '', description: '' });
    setSectionError(null);
    setShowSectionModal(true);
  };

  const handleOpenEditSection = (section: Section) => {
    setEditingSection(section);
    setSectionForm({ title: section.title, description: section.description || '' });
    setSectionError(null);
    setShowSectionModal(true);
  };

  // Save Section
  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionForm.title.trim() || isSavingSection) return;

    setIsSavingSection(true);
    setSectionError(null);

    try {
      if (editingSection) {
        // Update Section
        const res = await fetch(`/api/instructor/courses/${course.id}/curriculum`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            type: 'SECTION',
            sectionId: editingSection.id,
            title: sectionForm.title.trim(),
            description: sectionForm.description.trim() || null,
          }),
        });

        const data = await res.json();
        if (res.ok && data.section) {
          setSections((prev) =>
            prev.map((s) => (s.id === editingSection.id ? { ...s, title: data.section.title, description: data.section.description } : s))
          );
          setShowSectionModal(false);
          setMessage({ type: 'success', text: 'تم تحديث بيانات الوحدة التعليمية بنجاح!' });
        } else {
          setSectionError(data.error || 'فشل تحديث الوحدة');
        }
      } else {
        // Create Section
        const res = await fetch(`/api/instructor/courses/${course.id}/curriculum`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            type: 'SECTION',
            title: sectionForm.title.trim(),
            description: sectionForm.description.trim() || null,
          }),
        });

        const data = await res.json();
        if (res.ok && data.section) {
          setSections((prev) => [...prev, { ...data.section, lessons: [] }]);
          setShowSectionModal(false);
          setMessage({ type: 'success', text: 'تم إضافة الوحدة التعليمية الجديدة بنجاح!' });
        } else {
          setSectionError(data.error || 'فشل إضافة الوحدة');
        }
      }
    } catch (err: any) {
      setSectionError('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setIsSavingSection(false);
    }
  };

  // Open Lesson Modal
  const handleOpenAddLesson = (sectionId: string) => {
    setTargetSectionId(sectionId);
    setEditingLesson(null);
    setLessonForm({
      title: '',
      description: '',
      durationMinutes: 15,
      isFreePreview: false,
      videoUrl: '',
      videoProvider: 'DIRECT',
      pdfUrl: '',
      sourceType: 'UPLOAD',
    });
    setLessonError(null);
    setShowLessonModal(true);
  };

  const handleOpenEditLesson = (lesson: Lesson, sectionId: string) => {
    setTargetSectionId(sectionId);
    setEditingLesson(lesson);
    const isExternal = lesson.videoUrl && (lesson.videoUrl.includes('youtube.com') || lesson.videoUrl.includes('youtu.be') || lesson.videoUrl.includes('vimeo.com'));
    setLessonForm({
      title: lesson.title,
      description: lesson.description || '',
      durationMinutes: lesson.durationMinutes || 15,
      isFreePreview: Boolean(lesson.isFreePreview),
      videoUrl: lesson.videoUrl || '',
      videoProvider: lesson.videoProvider || 'DIRECT',
      pdfUrl: lesson.pdfUrl || '',
      sourceType: isExternal ? 'URL' : 'UPLOAD',
    });
    setLessonError(null);
    setShowLessonModal(true);
  };

  // Save Lesson
  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title.trim() || isSavingLesson) return;

    setIsSavingLesson(true);
    setLessonError(null);

    try {
      if (editingLesson) {
        // Update Lesson
        const res = await fetch(`/api/instructor/courses/${course.id}/curriculum`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            type: 'LESSON',
            lessonId: editingLesson.id,
            title: lessonForm.title.trim(),
            description: lessonForm.description.trim() || null,
            durationMinutes: lessonForm.durationMinutes,
            isFreePreview: lessonForm.isFreePreview,
            videoUrl: lessonForm.videoUrl.trim() || null,
            videoProvider: lessonForm.videoProvider,
            pdfUrl: lessonForm.pdfUrl.trim() || null,
          }),
        });

        const data = await res.json();
        if (res.ok && data.lesson) {
          setSections((prev) =>
            prev.map((s) =>
              s.id === targetSectionId
                ? {
                    ...s,
                    lessons: s.lessons.map((l) => (l.id === editingLesson.id ? { ...l, ...data.lesson } : l)),
                  }
                : s
            )
          );
          setShowLessonModal(false);
          setMessage({ type: 'success', text: 'تم تحديث الدرس وبيانات الفيديو بنجاح!' });
        } else {
          setLessonError(data.error || 'فشل تحديث الدرس');
        }
      } else {
        // Create Lesson
        const res = await fetch(`/api/instructor/courses/${course.id}/curriculum`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            type: 'LESSON',
            sectionId: targetSectionId,
            title: lessonForm.title.trim(),
            description: lessonForm.description.trim() || null,
            durationMinutes: lessonForm.durationMinutes,
            isFreePreview: lessonForm.isFreePreview,
            videoUrl: lessonForm.videoUrl.trim() || null,
            videoProvider: lessonForm.videoProvider,
            pdfUrl: lessonForm.pdfUrl.trim() || null,
          }),
        });

        const data = await res.json();
        if (res.ok && data.lesson) {
          setSections((prev) =>
            prev.map((s) =>
              s.id === targetSectionId
                ? {
                    ...s,
                    lessons: [...s.lessons, data.lesson],
                  }
                : s
            )
          );
          setShowLessonModal(false);
          setMessage({ type: 'success', text: 'تم إضافة الدرس ونشر الفيديو بنجاح!' });
        } else {
          setLessonError(data.error || 'فشل إضافة الدرس');
        }
      }
    } catch (err: any) {
      setLessonError('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setIsSavingLesson(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingItem || isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/instructor/courses/${course.id}/curriculum?type=${deletingItem.type}&id=${deletingItem.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await res.json();
      if (res.ok) {
        if (deletingItem.type === 'SECTION') {
          setSections((prev) => prev.filter((s) => s.id !== deletingItem.id));
        } else {
          setSections((prev) =>
            prev.map((s) => ({
              ...s,
              lessons: s.lessons.filter((l) => l.id !== deletingItem.id),
            }))
          );
        }
        setMessage({ type: 'success', text: data.message || 'تم الحذف بنجاح' });
        setDeletingItem(null);
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل الحذف' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء الحذف' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <Link href="/" className="text-zinc-400 hover:text-amber-300 transition-colors font-medium">
            الرئيسية
          </Link>
          <span className="text-zinc-600">/</span>
          <Link href="/instructor" className="text-zinc-400 hover:text-amber-300 transition-colors font-medium">
            استوديو المحاضر
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400 truncate max-w-xs">{course.title}</span>
          <span className="text-zinc-600">/</span>
          <span className="text-amber-300 font-bold">إدارة المنهج والفيديوهات 🎬</span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href={`/courses/${course.slug}`}
            target="_blank"
            className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold border border-zinc-700 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>معاينة صفحة الكورس</span>
          </Link>

          <Link
            href={`/learn/${course.slug}`}
            target="_blank"
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>دخول قاعة الدرس</span>
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black">
              استوديو رفع الفيديوهات
            </span>
            <span className="text-xs text-zinc-400">كود الكورس: #{course.id.slice(-6)}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug">
            {course.title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            ارفع فيديوهات محاضراتك تدريجياً، نظّم الوحدات والدروس، وحدد المقاطع المتاحة كمعاينة مجانية لجذب الطلاب، وأرفق ملفات التلخيص.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddSection}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs shadow-xl shadow-amber-950/50 flex items-center gap-2 transition-all hover:scale-105 shrink-0 relative z-10"
        >
          <Plus className="w-5 h-5 text-zinc-950 stroke-[3]" />
          <span>+ إضافة وحدة تعليمية جديدة</span>
        </button>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-2 shadow-lg ${
            message.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/80 border border-rose-800 text-rose-300'
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

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>الوحدات الدراسية</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{sections.length} وحدات</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>إجمالي الدروس</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{totalLessons} درس</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>إجمالي مدة الشرح</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">
            {Math.floor(totalMinutes / 60)} س و {totalMinutes % 60} د
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>معاينة مجانية مفتوحة</span>
            <Unlock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">{freePreviewCount} دروس</p>
        </div>
      </div>

      {/* Sections and Lessons */}
      <div className="space-y-6">
        {sections.length === 0 ? (
          <div className="p-12 rounded-3xl bg-zinc-900/60 border-2 border-dashed border-zinc-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Layers className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">لا توجد وحدات تعليمية بعد</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                ابدأ بإنشاء الوحدة الأولى (مثل: الوحدة الأولى: مقدمة وتأسيس)، ثم ارفع الفيديوهات بداخلها تدريجياً.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddSection}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black text-xs shadow-lg shadow-amber-950/40 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ إضافة الوحدة الأولى الآن</span>
            </button>
          </div>
        ) : (
          sections.map((section, sIndex) => (
            <div
              key={section.id}
              className="rounded-3xl bg-zinc-900/90 border border-zinc-800 overflow-hidden shadow-xl"
            >
              {/* Section Header */}
              <div className="p-5 sm:p-6 bg-zinc-800/60 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-black text-sm flex items-center justify-center shrink-0">
                    {sIndex + 1}
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">{section.title}</h2>
                    {section.description && (
                      <p className="text-xs text-zinc-400 mt-0.5">{section.description}</p>
                    )}
                    <span className="text-[11px] text-zinc-500 block mt-0.5">
                      يحتوي على {section.lessons.length} درس • إجمالي {section.lessons.reduce((a, b) => a + (b.durationMinutes || 0), 0)} دقيقة
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleOpenAddLesson(section.id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ إضافة فيديو / درس</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditSection(section)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
                    title="تعديل اسم الوحدة"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingItem({ type: 'SECTION', id: section.id, title: section.title })}
                    className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/60 transition-colors"
                    title="حذف الوحدة بالكامل"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lessons List under Section */}
              <div className="divide-y divide-zinc-800/60">
                {section.lessons.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <p className="text-xs text-zinc-400">هذه الوحدة لا تحتوي على أي دروس حتى الآن.</p>
                    <button
                      type="button"
                      onClick={() => handleOpenAddLesson(section.id)}
                      className="text-xs text-amber-400 hover:underline font-bold"
                    >
                      + اضغط هنا لإضافة المحاضرة الأولى
                    </button>
                  </div>
                ) : (
                  section.lessons.map((lesson, lIndex) => (
                    <div
                      key={lesson.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* Lesson info */}
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs font-mono font-bold shrink-0 mt-0.5 sm:mt-0">
                          {sIndex + 1}.{lIndex + 1}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-white truncate">{lesson.title}</h3>

                            {/* Free Preview Badge */}
                            {lesson.isFreePreview ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] font-black flex items-center gap-1">
                                <Unlock className="w-3 h-3 text-emerald-400" />
                                <span>معاينة مجانية مفتوحة</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-semibold flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5 text-zinc-500" />
                                <span>مقفل للمشتركين</span>
                              </span>
                            )}

                            {/* Video Status Badge */}
                            {lesson.videoUrl ? (
                              <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[10px] font-semibold flex items-center gap-1">
                                <Video className="w-2.5 h-2.5 text-cyan-400" />
                                <span>فيديو جاهز</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-800 text-amber-300 text-[10px] font-semibold flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                                <span>لم يُرفع فيديو</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-zinc-400" />
                              {lesson.durationMinutes} دقيقة
                            </span>
                            {lesson.pdfUrl && (
                              <span className="flex items-center gap-1 text-purple-400">
                                <FileText className="w-3 h-3" />
                                ملخص PDF متاح
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {lesson.videoUrl && (
                          <button
                            type="button"
                            onClick={() => setPreviewingVideoUrl({ title: lesson.title, url: lesson.videoUrl! })}
                            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 flex items-center gap-1.5 transition-colors"
                          >
                            <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
                            <span>معاينة الفيديو 🎬</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenEditLesson(lesson, section.id)}
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 flex items-center gap-1 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5 text-zinc-400" />
                          <span>تعديل</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingItem({ type: 'LESSON', id: lesson.id, title: lesson.title })}
                          className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/60 transition-colors"
                          title="حذف الدرس"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ======================================================== */}
      {/* 1. Add / Edit Section Modal */}
      {/* ======================================================== */}
      {showSectionModal && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          style={{ zIndex: 999999 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowSectionModal(false); }}
        >
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-700">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>{editingSection ? 'تعديل الوحدة التعليمية' : 'إضافة وحدة تعليمية جديدة'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSectionModal(false)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-4">
              {sectionError && (
                <div className="p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{sectionError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">عنوان الوحدة *</label>
                <input
                  type="text"
                  required
                  value={sectionForm.title}
                  onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                  placeholder="مثال: الوحدة الأولى: التأسيس وهياكل البيانات"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">وصف مختصر للوحدة (اختياري)</label>
                <textarea
                  rows={2}
                  value={sectionForm.description}
                  onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                  placeholder="اشرح الهدف من هذه الوحدة التعليمية..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-700">
                <button
                  type="button"
                  onClick={() => setShowSectionModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSavingSection || !sectionForm.title.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-950/40 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSection ? 'جاري الحفظ...' : editingSection ? 'حفظ التعديلات' : 'إنشاء الوحدة'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. Add / Edit Lesson & Video Modal */}
      {/* ======================================================== */}
      {showLessonModal && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
          style={{ zIndex: 999999 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowLessonModal(false); }}
        >
          <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-700">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-400" />
                <span>{editingLesson ? 'تعديل المحاضرة والفيديو' : 'إضافة محاضرة / فيديو جديد'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLessonModal(false)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4">
              {lessonError && (
                <div className="p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{lessonError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">عنوان الدرس / المحاضرة *</label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="مثال: المحاضرة 1: تثبيت Node.js وإعداد المشروع"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Duration and Free Preview Toggle Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-850 border border-zinc-800">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">مدة الفيديو (بالدقائق)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={lessonForm.durationMinutes}
                      onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs focus:outline-none focus:border-amber-500 pl-8"
                    />
                    <Clock className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Free Preview Switch */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">إتاحة كمعاينة مجانية</label>
                  <label
                    onClick={() => setLessonForm({ ...lessonForm, isFreePreview: !lessonForm.isFreePreview })}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer select-none transition-colors ${
                      lessonForm.isFreePreview
                        ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold">
                      {lessonForm.isFreePreview ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-zinc-500" />}
                      <span>{lessonForm.isFreePreview ? 'معاينة مجانية مفتوحة' : 'مقفل للمشتركين فقط'}</span>
                    </div>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      lessonForm.isFreePreview ? 'bg-emerald-500 text-black' : 'bg-zinc-700 text-zinc-400'
                    }`}>
                      {lessonForm.isFreePreview ? '✓' : '✕'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Video Source Selection */}
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-850 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Video className="w-4 h-4" />
                    <span>مصدر ملف الفيديو</span>
                  </label>
                  <div className="flex items-center gap-1 bg-zinc-800 p-1 rounded-xl border border-zinc-700 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setLessonForm({ ...lessonForm, sourceType: 'UPLOAD' })}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                        lessonForm.sourceType === 'UPLOAD'
                          ? 'bg-amber-500 text-black'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      رفع ملف فيديو من الجهاز
                    </button>
                    <button
                      type="button"
                      onClick={() => setLessonForm({ ...lessonForm, sourceType: 'URL' })}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                        lessonForm.sourceType === 'URL'
                          ? 'bg-amber-500 text-black'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      رابط فيديو مباشر أو Embed
                    </button>
                  </div>
                </div>

                {lessonForm.sourceType === 'UPLOAD' ? (
                  <FileUploadInput
                    label="اختر ملف فيديو من هاتفك أو حاسوبك (MP4 / WebM / MOV)"
                    folder="videos"
                    accept="video/mp4,video/webm,video/quicktime,video/*"
                    currentValue={lessonForm.videoUrl}
                    onUploadComplete={(url) => setLessonForm({ ...lessonForm, videoUrl: url, videoProvider: 'DIRECT' })}
                    helperText="الحد الأقصى 250 ميجابايت. يُفضل صيغة MP4 بدقة 1080p أو 720p لسرعة البث"
                  />
                ) : (
                  <div>
                    <input
                      type="url"
                      value={lessonForm.videoUrl}
                      onChange={(e) => {
                        const url = e.target.value;
                        let provider = 'DIRECT';
                        if (url.includes('youtube.com') || url.includes('youtu.be')) provider = 'YOUTUBE';
                        else if (url.includes('vimeo.com')) provider = 'VIMEO';
                        else if (url.includes('.m3u8')) provider = 'HLS';
                        setLessonForm({ ...lessonForm, videoUrl: url, videoProvider: provider });
                      }}
                      placeholder="الصق رابط الفيديو المباشر (مثال: https://... أو رابط يوتيوب)"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[11px] text-zinc-500 mt-1 block">
                      يدعم روابط الفيديو المباشرة (MP4, HLS/m3u8, Cloudflare Stream, Bunny, YouTube, Vimeo)
                    </span>
                  </div>
                )}

                {/* Instant Video Test Preview if videoUrl is set */}
                {lessonForm.videoUrl && (
                  <div className="p-3 rounded-2xl bg-black/60 border border-zinc-700 space-y-2">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5" />
                      معاينة تجريبية فورية للفيديو قبل الحفظ:
                    </span>
                    <video
                      src={lessonForm.videoUrl}
                      controls
                      className="w-full max-h-48 rounded-xl bg-black border border-zinc-800"
                    />
                  </div>
                )}
              </div>

              {/* Lesson Description */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">وصف أو محاور الدرس (اختياري)</label>
                <textarea
                  rows={2}
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  placeholder="ملاحظات توضيحية تظهر للطالب أسفل المشغل..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* PDF Resource */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">ملخص الدرس أو سلايدات PDF (اختياري)</label>
                <input
                  type="text"
                  value={lessonForm.pdfUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, pdfUrl: e.target.value })}
                  placeholder="رابط ملف الـ PDF المرفق بالدرس"
                  className="w-full px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-700">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSavingLesson || !lessonForm.title.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-950/40 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingLesson ? 'جاري الحفظ...' : editingLesson ? 'حفظ التعديلات' : 'نشر الدرس الآن'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. Quick Video Preview Player Modal */}
      {/* ======================================================== */}
      {previewingVideoUrl && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
          style={{ zIndex: 999999 }}
          onClick={() => setPreviewingVideoUrl(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-700 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-black text-white flex items-center gap-2 truncate">
                <PlayCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{previewingVideoUrl.title}</span>
              </h3>
              <button
                type="button"
                onClick={() => setPreviewingVideoUrl(null)}
                className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-800">
              <video
                src={previewingVideoUrl.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. Delete Confirmation Modal */}
      {/* ======================================================== */}
      {deletingItem && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          style={{ zIndex: 999999 }}
          onClick={() => !isDeleting && setDeletingItem(null)}
        >
          <div
            className="relative w-full max-w-md bg-zinc-900 border border-rose-900/60 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
              <div className="w-10 h-10 rounded-2xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">تأكيد الحذف ⚠️</h3>
                <span className="text-[11px] text-rose-400 font-semibold">
                  {deletingItem.type === 'SECTION' ? 'حذف الوحدة وجميع دروسها' : 'حذف الدرس نهائياً'}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف <strong className="text-white">"{deletingItem.title}"</strong>؟ لا يمكن التراجع عن هذا الإجراء.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingItem(null)}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'جاري الحذف...' : 'نعم، احذف نهائياً'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
