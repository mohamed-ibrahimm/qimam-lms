import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.platformSetting.findMany();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    return NextResponse.json({
      platformName: map['PLATFORM_NAME'] || 'أكاديمية قِمَم',
      platformTagline: map['PLATFORM_TAGLINE'] || 'المنصة الرائدة لعلوم البرمجة والتقنية',
      watermarkEnabled: map['WATERMARK_ENABLED'] !== 'false',
      whatsappNumber: map['WHATSAPP_NUMBER'] || '',
      contactEmail: map['CONTACT_EMAIL'] || '',
      facebookUrl: map['FACEBOOK_URL'] || '',
      telegramUrl: map['TELEGRAM_URL'] || '',
      youtubeUrl: map['YOUTUBE_URL'] || '',
      linkedinUrl: map['LINKEDIN_URL'] || '',
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      }
    });
  } catch (e) {
    return NextResponse.json({
      platformName: 'أكاديمية قِمَم',
      platformTagline: 'المنصة الرائدة لعلوم البرمجة والتقنية',
      watermarkEnabled: true,
      whatsappNumber: '',
      contactEmail: '',
      facebookUrl: '',
      telegramUrl: '',
      youtubeUrl: '',
      linkedinUrl: '',
    });
  }
}