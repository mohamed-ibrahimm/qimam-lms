import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import ClassroomClient from './ClassroomClient';

interface Props {
  params: {
    courseSlug: string;
    lessonSlug: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function ClassroomPage({ params }: Props) {
  const user = await getCurrentUser();

  let course: any = null;
  try {
    course = await prisma.course.findUnique({
      where: { slug: params.courseSlug },
      include: {
        instructor: { select: { officialFullName: true } },
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
                },
                progresses: user ? { where: { userId: user.id } } : false,
              }
            }
          }
        },
        finalExam: {
          include: {
            questions: { orderBy: { orderIndex: 'asc' } }
          }
        },
      }
    });
  } catch (e) {
    console.error('Failed to fetch classroom course:', e);
  }

  if (!course) notFound();

  // Find target lesson
  let activeLesson = course.sections
    .flatMap((s) => s.lessons)
    .find((l) => l.slug === params.lessonSlug);

  if (!activeLesson) {
    activeLesson = course.sections[0]?.lessons[0];
    if (!activeLesson) notFound();
  }

  // Check enrollment
  let isEnrolled = false;
  if (user) {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
        status: 'ACTIVE',
      }
    });
    if (enrollment) isEnrolled = true;
  }

  // If not enrolled and not free preview, redirect to course sales page
  if (!isEnrolled && !activeLesson.isFreePreview) {
    redirect(`/courses/${course.slug}?require_enroll=true`);
  }

  // Fetch student's notes for this lesson
  const notes = user
    ? await prisma.studentNote.findMany({
        where: { userId: user.id, lessonId: activeLesson.id },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  // Check if student has already reviewed this course
  const existingReview = user
    ? await prisma.review.findFirst({
        where: { userId: user.id, courseId: course.id },
      })
    : null;

  // Check global or course forced review setting
  const forcedReviewSetting = await prisma.platformSetting.findUnique({
    where: { key: 'FORCE_REVIEW_SECOND_LESSON' },
  });
  const forceReviewEnabled = forcedReviewSetting ? forcedReviewSetting.value === 'true' : true;

  return (
    <ClassroomClient
      course={course as any}
      activeLesson={activeLesson as any}
      user={user}
      isEnrolled={isEnrolled}
      initialNotes={notes}
      initialHasReviewed={Boolean(existingReview)}
      forceReviewEnabled={forceReviewEnabled}
    />
  );
}