import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/layout/AppShell';
import { ThemeProvider } from '@/components/ThemeProvider';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  let title = 'أكاديمية م / محمد إبراهيم';
  let description = 'بوابتك الاحترافية لاحتراف البرمجة والذكاء الاصطناعي والتصميم ومشاريع الإنتاج الحقيقية.';
  try {
    const settings = await prisma.platformSetting.findMany();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    if (map['PLATFORM_NAME']) title = map['PLATFORM_NAME'].replace(/سنجر/g, '').trim() || title;
    if (map['PLATFORM_TAGLINE']) description = map['PLATFORM_TAGLINE'];
  } catch (e) {}

  return {
    title: `${title} | ${description}`,
    description,
    keywords: ['كورسات برمجة', 'دبلومات معتمدة', 'Next.js', 'TypeScript', 'ذكاء اصطناعي', title, 'تعليم عن بعد'],
    icons: {
      icon: '/icon.svg',
      shortcut: '/icon.svg',
      apple: '/icon.svg',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let platformName = 'أكاديمية م / محمد إبراهيم';
  let platformTagline = 'بوابتك الاحترافية لاحتراف البرمجة والذكاء الاصطناعي والتصميم';
  let settingsMap: Record<string, string> = {};
  let user: any = null;

  try {
    const settings = await prisma.platformSetting.findMany();
    settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    if (settingsMap['PLATFORM_NAME']) platformName = settingsMap['PLATFORM_NAME'].replace(/سنجر/g, '').trim() || platformName;
    if (settingsMap['PLATFORM_TAGLINE']) platformTagline = settingsMap['PLATFORM_TAGLINE'];
  } catch (e) {}

  try {
    user = await getCurrentUser();
  } catch (e) {}

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen antialiased selection:bg-amber-500 selection:text-black relative" suppressHydrationWarning>
        <ThemeProvider>
          <AppShell
            initialUser={user}
            initialPlatformName={platformName}
            initialPlatformTagline={platformTagline}
            initialSettings={settingsMap}
          >
            {children}
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}