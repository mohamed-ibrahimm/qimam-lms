import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.platformSetting.findMany();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    const rawWhatsapp = map['WHATSAPP_NUMBER'] || map['CONTACT_WHATSAPP'] || map['CONTACT_PHONE'] || '';
    const safeWhatsapp = (rawWhatsapp && !rawWhatsapp.includes('1001234567')) ? rawWhatsapp : '01555791568';
    return NextResponse.json({
      platformName: (map['PLATFORM_NAME'] || 'أكاديمية م / محمد إبراهيم').replace(/سنجر/g, '').trim() || 'أكاديمية م / محمد إبراهيم',
      platformTagline: map['PLATFORM_TAGLINE'] || 'بوابتك الاحترافية لاحتراف البرمجة والذكاء الاصطناعي والتصميم',
      watermarkEnabled: map['WATERMARK_ENABLED'] !== 'false',
      whatsappNumber: safeWhatsapp,
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
      platformName: 'أكاديمية م / محمد إبراهيم',
      platformTagline: 'بوابتك الاحترافية لاحتراف البرمجة والذكاء الاصطناعي والتصميم',
      watermarkEnabled: true,
      whatsappNumber: '+201001234567',
      contactEmail: '',
      facebookUrl: '',
      telegramUrl: '',
      youtubeUrl: '',
      linkedinUrl: '',
    });
  }
}