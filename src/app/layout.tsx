import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { prisma } from '@/lib/prisma';

export async function generateMetadata(): Promise<Metadata> {
  let title = 'أكاديمية قِمَم';
  let description = 'المنصة التعليمية الرائدة لبيع الكورسات والدبلومات البرمجية والتقنية.';
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
      <body className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased selection:bg-amber-500 selection:text-black relative">
        <Header />
        <main className="flex-1 w-full pt-20 md:pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}