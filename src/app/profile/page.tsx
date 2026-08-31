'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Award,
  Lock,
  Save,
  ShieldCheck,
  Mail,
  Phone,
  Camera,
  Upload,
  Trash2,
  Sparkles,
  GraduationCap,
  Crown,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon
} from 'lucide-react';

const PRESET_AVATARS = [
  { id: 'dev-male-1', label: 'مطور برمجيات', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' },
  { id: 'inst-male', label: 'محاضر تقني', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
  { id: 'student-male', label: 'طالب جامعي', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300' },
  { id: 'dev-female-1', label: 'مهندسة ذكاء اصطناعي', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
  { id: 'dev-female-2', label: 'مصممة واجهات', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300' },
  { id: 'senior-dev', label: 'مهندس أول', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300' },
];

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    fatherName: '',
    lastName: '',
    officialFullName: '',
    phone: '',
    bio: '',
    avatarUrl: '',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setFormData({
            firstName: data.user.firstName || '',
            fatherName: data.user.fatherName || '',
            lastName: data.user.lastName || '',
            officialFullName: data.user.officialFullName || '',
            phone: data.user.phone || '',
            bio: data.user.bio || '',
            avatarUrl: data.user.avatarUrl || '',
            currentPassword: '',
            newPassword: '',
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image File Compression & Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'يرجى اختيار ملف صورة صالح (JPEG أو PNG أو WebP)' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 360;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setFormData((prev) => ({ ...prev, avatarUrl: compressedDataUrl }));
          setMessage({ type: 'success', text: 'تمت معاينة الصورة بنجاح! اضغط "حفظ التعديلات" لحفظها.' });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url: string) => {
    setFormData((prev) => ({ ...prev, avatarUrl: url }));
    setMessage({ type: 'success', text: 'تم اختيار الصورة! اضغط "حفظ التعديلات" لتثبيتها.' });
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
    setMessage({ type: 'success', text: 'تمت إزالة الصورة الشخصية. اضغط "حفظ التعديلات" للتأكيد.' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'فشل التحديث' });
      } else {
        setUser(data.user);
        setMessage({ type: 'success', text: 'تم حفظ وتحديث بيانات الملف الشخصي والصورة بنجاح!' });
        setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
        router.refresh();
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال بالخادم' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400">جاري تحميل بيانات الملف الشخصي...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-sm text-rose-400">يرجى تسجيل الدخول لعرض الملف الشخصي</p>
        <a href="/login" className="px-6 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-bold inline-block">
          تسجيل الدخول
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <User className="w-7 h-7 text-primary-400" />
            الملف الشخصي وإعدادات الحساب
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            إدارة صورتك الشخصية، بياناتك المعتمدة للشهادات، وإعدادات الأمان
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-raised border border-border text-xs font-bold">
          {user.role === 'ADMIN' ? (
            <>
              <Crown className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300">مدير المنصة (Admin)</span>
            </>
          ) : user.role === 'INSTRUCTOR' ? (
            <>
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300">محاضر معتمد (Instructor)</span>
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">طالب (Student)</span>
            </>
          )}
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-2 shadow-lg animate-in fade-in ${
            message.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/80 border border-rose-800 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-zinc-400 hover:text-white">
            
          </button>
        </div>
      )}

      {/* Profile Photo Customization Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          {/* Avatar Preview with Glowing Ring */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-primary-600 via-purple-500 to-amber-400 shadow-2xl shadow-primary-900/40">
              <div className="w-full h-full rounded-full bg-surface-card overflow-hidden flex items-center justify-center relative">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-900 to-purple-950 flex items-center justify-center text-white text-3xl sm:text-4xl font-black">
                    {formData.firstName?.[0] || 'ق'}
                  </div>
                )}

                {/* Hover Upload Overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 cursor-pointer backdrop-blur-[2px]"
                >
                  <Camera className="w-5 h-5" />
                  <span>تغيير الصورة</span>
                </button>
              </div>
            </div>

            {/* Role Floating Badge */}
            <div className="absolute -bottom-1.5 right-1/2 translate-x-1/2 px-2.5 py-0.5 rounded-full bg-surface-raised border border-border text-[10px] font-bold text-white shadow-md flex items-center gap-1 shrink-0 whitespace-nowrap">
              {user.role === 'ADMIN' ? ' مدير' : user.role === 'INSTRUCTOR' ? ' معلم' : ' طالب'}
            </div>
          </div>

          {/* Avatar Controls & Options */}
          <div className="space-y-4 text-center sm:text-right flex-1">
            <div>
              <h2 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>الصورة الشخصية (Profile Picture)</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                اختر صورة شخصية تعبر عن هويتك في المنصة وتظهر في استوديو المعلم، الشات، ورأس الصفحة.
              </p>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-primary-900/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>رفع صورة من جهازك</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="px-3.5 py-2 rounded-xl bg-surface-raised hover:bg-surface-card border border-border text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <LinkIcon className="w-3.5 h-3.5 text-primary-400" />
                <span>رابط خارجي (URL)</span>
              </button>

              {formData.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="إزالة الصورة والعودة للحرف الافتراضي"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>إزالة</span>
                </button>
              )}
            </div>

            {/* Direct URL Input Bar */}
            {showUrlInput && (
              <div className="pt-2 animate-in fade-in">
                <div className="flex items-center gap-2 max-w-md">
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(false)}
                    className="px-3 py-2 rounded-xl bg-surface-card text-xs font-bold text-zinc-400 hover:text-white"
                  >
                    تم
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preset Avatars Gallery Picker */}
        <div className="pt-5 border-t border-border/70 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">أو اختر من النماذج الرمزية الجاهزة:</span>
            <span className="text-[10px] text-zinc-500">نقرة واحدة للاختيار</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {PRESET_AVATARS.map((preset) => {
              const isSelected = formData.avatarUrl === preset.url;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`p-2 rounded-2xl border transition-all flex flex-col items-center gap-1.5 text-center group ${
                    isSelected
                      ? 'bg-primary-950/70 border-primary-500 ring-2 ring-primary-500/40 shadow-lg'
                      : 'bg-surface-raised hover:bg-surface-card border-border hover:border-zinc-500'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-border group-hover:scale-105 transition-transform">
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] text-zinc-300 font-semibold truncate w-full">
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Profile Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Official Full Name for Certificates */}
        <div className="p-6 rounded-3xl bg-surface border border-primary-800/50 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-bold text-primary-300">
            <Award className="w-5 h-5 text-purple-400" />
            <span>الاسم الرسمي المعتمد للشهادات (Official Full Name)</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            هذا الاسم يتم طباعته وإدراجه آلياً على كافة الشهادات المعتمدة الصادرة لك من الأكاديمية مع رمز التحقق السريع (QR Code).
          </p>
          <input
            type="text"
            name="officialFullName"
            required
            value={formData.officialFullName}
            onChange={handleChange}
            placeholder="الاسم الرباعي الرسمي المعتمد"
            className="w-full px-4 py-3 rounded-2xl bg-surface-raised border border-primary-700/60 text-white font-bold text-sm focus:outline-none focus:border-primary-400 shadow-inner"
          />
        </div>

        {/* Basic Personal Details */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-5 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-primary-400" />
            <span>البيانات الأساسية ومعلومات التواصل</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">الاسم الأول</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">اسم الأب</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">اسم العائلة</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">اسم المستخدم (Username)</label>
              <input
                type="text"
                disabled
                value={user.username || ''}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised/40 border border-border text-zinc-500 text-xs cursor-not-allowed font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">البريد الإلكتروني</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised/40 border border-border text-zinc-500 text-xs cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">رقم الهاتف / الواتساب</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01012345678"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">النبذة التعريفية (Bio)</label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="اكتب نبذة مختصرة عن خبراتك أو اهتماماتك البرمجية والتقنية..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Change Password Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Lock className="w-4 h-4 text-primary-400" />
            <span>تغيير كلمة المرور (اختياري)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">كلمة المرور الحالية</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">كلمة المرور الجديدة</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary-600 via-purple-600 to-primary-500 hover:from-primary-500 hover:to-purple-400 text-white font-bold text-xs shadow-xl shadow-primary-900/40 transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات والصورة'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}