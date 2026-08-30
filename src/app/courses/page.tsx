import React from 'react';
import { prisma } from '@/lib/prisma';
import CoursesCatalogClient from './CoursesCatalogClient';

interface Props {
  searchParams: {
    q?: string;
    category?: string;
    level?: string;
    sort?: string;
    type?: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function CoursesPage({ searchParams }: Props) {
  const q = searchParams.q || '';
  const categorySlug = searchParams.category || '';
  const courseType = (searchParams.type as any) || 'all';

  let courses: any[] = [];
  let categories: any[] = [];

  try {
    const res = await Promise.all([
      prisma.course.findMany({
        where: {
          status: 'PUBLISHED',
        },
        orderBy: { createdAt: 'desc' },
        include: {
          instructor: {
            select: {
              officialFullName: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              isStudentInstructor: true,
              studentUniversity: true,
              studentFaculty: true,
              role: true,
            },
          },
          category: { select: { id: true, name: true, slug: true } },
          sections: { select: { id: true, _count: { select: { lessons: true } } } },
          _count: { select: { sections: true, enrollments: true } },
        },
      }),
      prisma.category.findMany({
        orderBy: { orderIndex: 'asc' },
        select: { id: true, name: true, slug: true },
      }),
    ]);
    courses = res[0];
    categories = res[1];
  } catch (e) {
    console.error('Failed to fetch courses catalog data:', e);
  }

  return (
    <CoursesCatalogClient
      initialCourses={courses}
      categories={categories}
      initialCategory={categorySlug}
      initialQuery={q}
      initialType={courseType}
    />
  );
}