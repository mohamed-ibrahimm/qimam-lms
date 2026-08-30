import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CurriculumClient from './CurriculumClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: { id: string };
}

export default async function CourseCurriculumPage({ params }: Props) {
  const user = await getCurrentUser();

  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    redirect('/login?callbackUrl=/instructor');
  }

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      instructor: {
        select: { id: true, officialFullName: true, email: true }
      },
      finalExam: {
        include: {
          questions: { orderBy: { orderIndex: 'asc' } }
        }
      },
      sections: {
        orderBy: { orderIndex: 'asc' },
        include: {
          lessons: {
            orderBy: { orderIndex: 'asc' },
            include: {
              summary: true,
              quiz: {
                include: {
                  questions: { orderBy: { orderIndex: 'asc' } }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!course) {
    notFound();
  }

  // Instructors can only manage their own courses
  if (user.role === 'INSTRUCTOR' && course.instructorId !== user.id) {
    redirect('/instructor');
  }

  return (
    <CurriculumClient
      user={user}
      course={course}
      initialSections={course.sections}
    />
  );
}
