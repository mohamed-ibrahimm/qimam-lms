import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/layout/AppShell';
import { ThemeProvider } from '@/components/ThemeProvider';

import { prisma } from '@/lib/prisma';

export async function generateMetadata(): Promise<Metadata> {
  let title = 'أكاديمية المهندس محمد إبراهيم';
  let description = 'بوابتك الاحترافية لاحتراف البرمجة والذكاء الاصطناعي والتصميم ومشاريع الإنتاج الحقيقية.';
  try {
    const settings = await prisma.platformSetting.findMany();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    if (map['PLATFORM_NAME']) title = map['PLATFORM_NAME'];
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.addEventListener('error', function(e) {
                  if (e.filename && (e.filename.includes('chrome-extension:') || e.filename.includes('moz-extension:'))) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased selection:bg-amber-500 selection:text-black relative">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}