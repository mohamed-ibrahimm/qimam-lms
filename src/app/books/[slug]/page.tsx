import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import BookDetailClient from './BookDetailClient';

interface Props {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BookDetailPage({ params }: Props) {
  const user = await getCurrentUser();

  const book = await prisma.digitalBook.findUnique({
    where: { slug: params.slug },
    include: {
      instructor: {
        select: {
          id: true,
          officialFullName: true,
          firstName: true,
          avatarUrl: true,
          bio: true,
          isStudentInstructor: true,
        }
      },
      reviews: {
        where: { isApproved: true },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              officialFullName: true,
              avatarUrl: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      }
    }
  });

  if (!book || book.status !== 'PUBLISHED') {
    notFound();
  }

  // Increment views count
  try {
    await prisma.digitalBook.update({
      where: { id: book.id },
      data: { viewsCount: { increment: 1 } }
    });
  } catch (e) {}

  // Check if current user has purchased the book
  let isPurchased = false;
  if (user) {
    if (user.role === 'ADMIN' || user.id === book.instructorId) {
      isPurchased = true;
    } else {
      const purchase = await prisma.bookPurchase.findUnique({
        where: {
          userId_bookId: {
            userId: user.id,
            bookId: book.id,
          }
        }
      });
      isPurchased = !!purchase;
    }
  }

  // Related books
  const relatedBooks = await prisma.digitalBook.findMany({
    where: {
      id: { not: book.id },
      status: 'PUBLISHED',
      OR: [
        { category: book.category },
        { academicSubject: book.academicSubject }
      ]
    },
    take: 3
  });

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20">
      <BookDetailClient
        book={book}
        isPurchased={isPurchased}
        relatedBooks={relatedBooks}
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
