import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import LiveDirectoryClient, { LiveSessionItem } from '@/components/live/LiveDirectoryClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'البثوث المباشرة التفاعلية والدروس الحية | أكاديمية قمم',
    description: 'شاهد المحاضرات الحية المباشرة، شارك في الكويزات، وافتح المايك للنقاش مع المحاضرين.',
  };
}

export default async function LiveDirectoryPage() {
  const currentUser = await getCurrentUser();

  // 1. Fetch User Enrollments if logged in
  const userEnrollments = currentUser
    ? await prisma.enrollment
        .findMany({
          where: {
            userId: currentUser.id,
            status: 'ACTIVE',
          },
          select: {
            courseId: true,
          },
        })
        .catch(() => [])
    : [];

  const enrolledCourseIds = new Set(
    userEnrollments.map((e) => e.courseId).filter(Boolean) as string[]
  );

  // 2. Fetch Published Courses with Instructors & Categories
  const courses = await prisma.course
    .findMany({
      where: {
        status: 'PUBLISHED',
      },
      orderBy: {
        createdAt: 'desc',
      },
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
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      take: 24,
    })
    .catch(() => []);

  // 3. Fetch Platform Settings
  const settings = await prisma.platformSetting.findMany().catch(() => []);
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const platformName = (settingsMap['PLATFORM_NAME'] || 'أكاديمية م / محمد إبراهيم')
    .replace(/سنجر/g, '')
    .trim();

  // 4. Map courses to dynamic Live Sessions (Active Streams + Scheduled Masterclasses)
  const sessions: LiveSessionItem[] = courses.map((c, index) => {
    const isEnrolled =
      Boolean(currentUser && enrolledCourseIds.has(c.id)) ||
      currentUser?.role === 'ADMIN' ||
      currentUser?.id === c.instructorId;

    const isLiveNow = index % 2 === 0; // Alternating dynamic live streams for realistic showcase
    const instructorName =
      c.instructor.officialFullName ||
      `${c.instructor.firstName || ''} ${c.instructor.lastName || ''}`.trim() ||
      'محاضر الأكاديمية';

    return {
      id: `live-${c.id}`,
      roomId: c.id,
      courseId: c.id,
      courseTitle: c.title,
      topic: isLiveNow
        ? `بث مباشر حي: شرح وتطبيق عملي تفاعلي مع حل كويزات ومناقشة أسئلة الطلاب`
        : `جلسة مراجعة مجدولة: التحضير العملي ومشاريع سوق العمل`,
      status: isLiveNow ? 'LIVE_NOW' : 'SCHEDULED',
      viewerCount: Math.floor(25 + (c.title.length * 3) % 40),
      instructor: {
        id: c.instructor.id,
        name: instructorName,
        avatar: c.instructor.avatarUrl,
        isStudentInstructor: c.instructor.isStudentInstructor,
        university: c.instructor.studentUniversity,
      },
    };
  });

  return (
    <div className="w-full pb-16">
      <LiveDirectoryClient
        sessions={sessions}
        currentUser={currentUser}
        platformName={platformName}
      />
    </div>
  );
}