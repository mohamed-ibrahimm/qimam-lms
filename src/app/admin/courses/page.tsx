import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminCoursesClient from './AdminCoursesClient';

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      instructor: { select: { officialFullName: true } },
      category: true,
      _count: { select: { sections: true, enrollments: true } },
    }
  });

  return <AdminCoursesClient initialCourses={courses as any} />;
}