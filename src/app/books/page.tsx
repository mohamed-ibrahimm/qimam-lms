import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import BooksCatalogClient from './BooksCatalogClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BooksPage() {
  const user = await getCurrentUser();

  const books = await prisma.digitalBook.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      instructor: {
        select: {
          id: true,
          officialFullName: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          isStudentInstructor: true,
          studentUniversity: true,
          studentFaculty: true,
          role: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Get user purchased book IDs if logged in
  let purchasedBookIds: string[] = [];
  if (user) {
    const purchases = await prisma.bookPurchase.findMany({
      where: { userId: user.id },
      select: { bookId: true }
    });
    purchasedBookIds = purchases.map((p) => p.bookId);
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20">
      <BooksCatalogClient
        initialBooks={books}
        purchasedBookIds={purchasedBookIds}
        currentUser={user ? {
          id: user.id,
          officialFullName: user.officialFullName,
          phone: user.phone,
          username: user.username,
        } : null}
      />
    </div>
  );
}
