'use client';

import React, { useRef, useState } from 'react';
import { Upload, Check, AlertCircle, Loader2, Image as ImageIcon, FileText, X } from 'lucide-react';

interface FileUploadInputProps {
  label: string;
  folder?: string;
  accept?: string;
  currentValue?: string;
  onUploadComplete: (url: string) => void;
  helperText?: string;
}

export default function FileUploadInput({
  label,
  folder = 'general',
  accept = 'image/*',
  currentValue = '',
  onUploadComplete,
  helperText = 'الحد الأقصى 15 ميجابايت (JPG, PNG, WEBP, PDF)',
}: FileUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentValue);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess(false);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'فشل رفع الملف');
      } else {
        setPreviewUrl(data.url);
        setSuccess(true);
        onUploadComplete(data.url);
      }
    } catch (err) {
      setError('حدث خطأ أثناء رفع الملف');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    setPreviewUrl('');
    setSuccess(false);
    onUploadComplete('');
  };

  const isImage = previewUrl && (previewUrl.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(previewUrl));

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-zinc-300 block">{label}</label>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative rounded-2xl border border-zinc-700/80 bg-zinc-950 p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {isImage ? (
              <img
                src={previewUrl}
                alt="معاينة الملف"
                className="w-12 h-12 rounded-xl object-cover border border-zinc-800 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">تم الرفع بنجاح</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                ملف جاهز ومحفوظ
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors"
            >
              تغيير
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 transition-colors"
              title="إزالة الملف"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 text-center select-none ${
            uploading
              ? 'border-amber-500/50 bg-amber-950/10'
              : 'border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900/50 bg-zinc-950/40'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
              <span className="text-xs font-bold text-amber-300">جاري رفع الملف وحفظه...</span>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-amber-400">
                <Upload className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  اضغط لاختيار ملف من الجهاز أو التقاط صورة / لقطة شاشة
                </span>
                <span className="text-[11px] text-zinc-500 mt-0.5 block">{helperText}</span>
              </div>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-[11px] text-rose-400 font-bold flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
