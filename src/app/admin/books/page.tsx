import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminBooksClient from './AdminBooksClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminBooksPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login?callbackUrl=/admin/books&error=unauthorized_admin');
  }

  const books = await prisma.digitalBook.findMany({
    include: {
      instructor: {
        select: {
          id: true,
          officialFullName: true,
          firstName: true,
          email: true,
          avatarUrl: true,
        }
      },
      purchases: {
        select: { id: true, amountPaid: true, createdAt: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return <AdminBooksClient initialBooks={books} />;
}
