import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await requireAuth(['ADMIN']);
    const templates = await prisma.certificateTemplate.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { certificates: true } }
      }
    });
    return NextResponse.json({ templates });
  } catch (e) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAuth(['ADMIN']);
    const { name, primaryColor, accentColor, orientation, fieldsConfig } = await req.json();

    const template = await prisma.certificateTemplate.create({
      data: {
        name: name || 'قالب مخصص جديد',
        primaryColor: primaryColor || '#7c3aed',
        accentColor: accentColor || '#fbbf24',
        orientation: orientation || 'LANDSCAPE',
        fieldsConfigJson: JSON.stringify(fieldsConfig || {}),
        isDefault: true,
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'CERTIFICATE_TEMPLATE_CREATED',
        entity: 'CERTIFICATE_TEMPLATE',
        entityId: template.id,
      }
    });

    return NextResponse.json({ success: true, template });
  } catch (e) {
    return NextResponse.json({ error: 'فشل حفظ قالب الشهادة' }, { status: 500 });
  }
}