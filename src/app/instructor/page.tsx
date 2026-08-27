import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import InstructorClient from './InstructorClient';

export const dynamic = 'force-dynamic';

export default async function InstructorStudioPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    redirect('/login?error=unauthorized_instructor');
  }

  let courses: any[] = [];
  try {
    courses = await prisma.course.findMany({
      where: user.role === 'ADMIN' ? {} : { instructorId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        instructor: { select: { officialFullName: true } },
        _count: { select: { sections: true, enrollments: true } },
        sections: {
          include: {
            lessons: {
              include: { quiz: { include: { attempts: true } } }
            }
          }
        }
      }
    });
  } catch (e) {
    console.error('Failed to fetch instructor courses:', e);
  }

  const totalStudents = courses.reduce((acc, c) => acc + c._count.enrollments, 0);

  return (
    <InstructorClient
      user={user}
      initialCourses={courses as any}
      totalStudents={totalStudents}
    />
  );
}