import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminCoursesClient from './AdminCoursesClient';

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
  let courses: any[] = [];
  try {
    courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        instructor: { select: { officialFullName: true } },
        category: true,
        _count: { select: { sections: true, enrollments: true } },
      }
    });
  } catch (e) {
    console.error('Failed to fetch admin courses:', e);
  }

  return <AdminCoursesClient initialCourses={courses as any} />;
}