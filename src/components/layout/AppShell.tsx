'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingSupportIcon from '@/components/FloatingSupportIcon';

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
        {children}
      </div>
    );
  }

  const isAdmin = pathname.startsWith('/admin');

  // Shell with Header at the top across all pages (Public, Admin, Instructor, Student)
  return (
    <div className="min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-black relative">
      <Header
        initialPlatformName={initialPlatformName}
        initialPlatformTagline={initialPlatformTagline}
        initialUser={initialUser}
      />
      <main className={`flex-1 w-full ${isAdmin ? 'pt-20 sm:pt-24' : 'pt-20 sm:pt-24 md:pt-28 pb-12'}`}>
        {children}
      </main>
      {!isAdmin && <Footer initialSettings={initialSettings} />}
      <FloatingSupportIcon />
    </div>
  );
}
