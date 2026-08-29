'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopProgressBar from '@/components/layout/TopProgressBar';

interface AppShellProps {
  children: React.ReactNode;
  initialPlatformName?: string;
  initialPlatformTagline?: string;
  initialSettings?: Record<string, string>;
  initialUser?: any;
}

export default function AppShell({
  children,
  initialPlatformName,
  initialPlatformTagline,
  initialSettings,
  initialUser,
}: AppShellProps) {
  const pathname = usePathname();

  // Focused learning classroom: NO marketing header, NO footer, full height
  const isClassroom = pathname.startsWith('/learn');

  if (isClassroom) {
    return (
      <div className="w-full min-h-screen flex flex-col antialiased">
        <TopProgressBar />
        {children}
      </div>
    );
  }

  const isAdmin = pathname.startsWith('/admin');

  // Shell with Header at the top across all pages (Public, Admin, Instructor, Student)
  return (
    <div className="min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-black relative">
      <TopProgressBar />
      <Header
        initialPlatformName={initialPlatformName}
        initialPlatformTagline={initialPlatformTagline}
        initialUser={initialUser}
      />
      <main className={`flex-1 w-full ${isAdmin ? 'pt-16 sm:pt-20 md:pt-24' : 'pt-14 sm:pt-20 md:pt-24 pb-8'}`}>
        <div key={pathname} className="animate-page-enter">
          {children}
        </div>
      </main>
      {!isAdmin && <Footer initialSettings={initialSettings} />}
    </div>
  );
}
