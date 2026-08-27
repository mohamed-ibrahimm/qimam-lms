import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.platformSetting.findMany();
    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    return NextResponse.json({ settings: settingsMap });
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

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'PLATFORM_SETTINGS_UPDATED',
        entity: 'PLATFORM_SETTINGS',
        detailsJson: JSON.stringify({ keysUpdated: Object.keys(settingsData) }),
      }
    });

    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'فشل حفظ الإعدادات' }, { status: 500 });
  }
}