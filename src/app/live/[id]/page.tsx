import React from 'react';
import { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LiveRoomClient from '@/components/live/LiveRoomClient';

export const metadata: Metadata = {
  title: 'غرفة البث المباشر التفاعلي | أكاديمية م / محمد إبراهيم',
  description: 'بث مباشر تفاعلي عالي الدقة مع مشاركة الشاشة وكويزات حية',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LiveSessionPage({ params }: PageProps) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(`/login?redirect=/live/${id}`);
  }

  const isInstructor = currentUser.role === 'INSTRUCTOR' || currentUser.role === 'ADMIN';

  const sessionData = {
    id,
    title: 'جلسة البث المباشر والمراجعة التفاعلية الشاملة',
    description: 'شرح حي وتطبيقي مع مشاركة الشاشة وحل كويزات ومسابقات تفاعلية لحظية.',
    instructorName: isInstructor ? currentUser.officialFullName : 'م / محمد إبراهيم',
    isInstructor,
    currentUser: {
      id: currentUser.id,
      name: currentUser.officialFullName,
      phone: currentUser.phone || undefined,
      email: currentUser.email,
    },
  };

  return <LiveRoomClient sessionId={id} initialSession={sessionData} />;
}