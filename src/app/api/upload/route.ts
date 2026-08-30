import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول لرفع الملفات' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'لم يتم استلام أي ملف' }, { status: 400 });
    }

    const isVideo = file.type.startsWith('video/');
    const MAX_SIZE = isVideo ? 1024 * 1024 * 1024 : 50 * 1024 * 1024; // 1 GB for videos, 50 MB for docs/images
    if (file.size > MAX_SIZE) {
      return NextResponse.json({
        error: isVideo
          ? 'حجم الفيديو يتجاوز الحد الأقصى المسموح (1024 ميجابايت / 1 جيجا)'
          : 'حجم الملف يتجاوز الحد الأقصى المسموح (50 ميجابايت)',
      }, { status: 400 });
    }

    // Validate mime type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-matroska',
      'video/ogg',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'نوع الملف غير مدعوم. الأنواع المدعومة: صور، مستندات PDF، وملفات فيديو MP4 / WebM / MOV',
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize folder name
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '');
    let extension = path.extname(file.name);
    if (!extension) {
      if (file.type.includes('mp4')) extension = '.mp4';
      else if (file.type.includes('webm')) extension = '.webm';
      else if (file.type.includes('pdf')) extension = '.pdf';
      else extension = '.png';
    }
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const fileName = `${Date.now()}-${randomSuffix}${extension}`;

    // Try saving to public/uploads
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeFolder);
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/${safeFolder}/${fileName}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName,
        size: file.size,
        type: file.type,
      });
    } catch (fsError) {
      // In serverless environments (like Vercel read-only filesystem), fallback to Base64 Data URL
      console.warn('Filesystem write failed, using data URI fallback:', fsError);
      const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        url: base64Data,
        fileName,
        size: file.size,
        type: file.type,
      });
    }
  } catch (error: any) {
    console.error('File upload route error:', error);
    return NextResponse.json({ error: 'فشل رفع الملف، يرجى المحاولة مرة أخرى' }, { status: 500 });
  }
}
