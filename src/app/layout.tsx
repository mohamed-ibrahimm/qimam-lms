import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/layout/AppShell';
import { ThemeProvider } from '@/components/ThemeProvider';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-plex',
});

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
    <html lang="ar" dir="rtl" className={`${ibmPlexArabic.variable} dark`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${ibmPlexArabic.className} min-h-screen antialiased selection:bg-amber-500 selection:text-black relative`} suppressHydrationWarning>
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