import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import BooksCatalogClient from './BooksCatalogClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BooksPage() {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch (e) {}

  let books: any[] = [];
  try {
    books = await prisma.digitalBook.findMany({
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
  } catch (err) {
    console.error('Failed to fetch books from database:', err);
    books = [];
  }

  // Get user purchased book IDs if logged in
  let purchasedBookIds: string[] = [];
  if (user) {
    try {
      const purchases = await prisma.bookPurchase.findMany({
        where: { userId: user.id },
        select: { bookId: true }
      });
      purchasedBookIds = purchases.map((p) => p.bookId);
    } catch (e) {
      purchasedBookIds = [];
    }
  }

  return (
    <div className="min-h-screen pt-4 sm:pt-6 pb-16">
      <BooksCatalogClient
        initialBooks={books || []}
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
