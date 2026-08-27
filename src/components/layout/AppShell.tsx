'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  // Focused learning classroom: NO marketing header, NO footer, full height
  const isClassroom = pathname.startsWith('/learn');

  // Admin control center: dedicated admin shell
  const isAdmin = pathname.startsWith('/admin');

  // Instructor studio: dedicated instructor shell
  const isInstructor = pathname.startsWith('/instructor');

  if (isClassroom || isAdmin || isInstructor) {
    return (
      <div className="w-full min-h-screen flex flex-col antialiased">
        {children}
      </div>
    );
  }

  // Public / Marketing / Student Dashboard shell
  return (
    <div className="min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-black relative">
      <Header />
      <main className="flex-1 w-full pt-20 sm:pt-24 md:pt-28 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
