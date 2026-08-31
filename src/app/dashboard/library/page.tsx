import React from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import LibraryClient from './LibraryClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentLibraryPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login?callbackUrl=/dashboard/library');
  }

  // Get user purchased books
  const purchases = await prisma.bookPurchase.findMany({
    where: { userId: user.id },
    include: {
      book: {
        include: {
          instructor: {
            select: {
              id: true,
              officialFullName: true,
              firstName: true,
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const books = purchases.map((p) => ({
    ...p.book,
    purchasedAt: p.createdAt.toISOString(),
  }));

  // Also include free books as readily available
  const freeBooks = await prisma.digitalBook.findMany({
    where: {
      isFree: true,
      status: 'PUBLISHED',
      id: { notIn: books.map((b) => b.id) }
    },
    include: {
      instructor: {
        select: {
          id: true,
          officialFullName: true,
          firstName: true,
        }
      }
    }
  });

  return (
    <div className="w-full pb-20">
      <LibraryClient
        purchasedBooks={books}
        freeBooks={freeBooks}
        currentUser={{
          id: user.id,
          officialFullName: user.officialFullName,
          phone: user.phone,
          username: user.username,
        }}
      />
    </div>
  );
}
