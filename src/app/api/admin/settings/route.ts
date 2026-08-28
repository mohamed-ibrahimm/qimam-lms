import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await prisma.platformSetting.findMany();
    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    return NextResponse.json(
      { settings: settingsMap },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (e) {
    return NextResponse.json({ error: 'فشل جلب الإعدادات' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAuth(['ADMIN']);
    const settingsData: Record<string, string> = await req.json();

    for (const [key, value] of Object.entries(settingsData)) {
      await prisma.platformSetting.upsert({
        where: { key },
        create: { key, value: String(value) },
        update: { value: String(value), updatedAt: new Date() }
      });
    }

    try {
      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: 'PLATFORM_SETTINGS_UPDATED',
          entity: 'PLATFORM_SETTINGS',
          detailsJson: JSON.stringify({ keysUpdated: Object.keys(settingsData) }),
        }
      });
    } catch (e) {}

    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath('/instructor');
      revalidatePath('/courses');
    } catch (e) {}

    return NextResponse.json(
      { success: true },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (e: any) {
    console.error('Settings save error:', e);
    return NextResponse.json({ error: e?.message || 'فشل حفظ الإعدادات' }, { status: 500 });
  }
}