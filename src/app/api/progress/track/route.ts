import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { generateCertificateNumber } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { lessonId, watchedSeconds, totalSeconds, watchedPercent, isCompleted } = await req.json();

    if (!lessonId) {
      return NextResponse.json({ error: 'معرف الدرس مطلوب' }, { status: 400 });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          include: {
            course: {
              include: {
                sections: { include: { lessons: true } },
                instructor: { select: { officialFullName: true } }
              }
            }
          }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'الدرس غير موجود' }, { status: 404 });
    }

    const course = lesson.section.course;

    // Upsert LessonProgress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lesson.id,
        }
      },
      create: {
        userId: user.id,
        lessonId: lesson.id,
        watchedSeconds: watchedSeconds || 0,
        totalSeconds: totalSeconds || 0,
        watchedPercent: watchedPercent || 0,
        isCompleted: Boolean(isCompleted || (watchedPercent >= course.completionThresholdPercent)),
        completedAt: (isCompleted || watchedPercent >= course.completionThresholdPercent) ? new Date() : null,
      },
      update: {
        watchedSeconds: Math.max(watchedSeconds || 0),
        totalSeconds: totalSeconds || 0,
        watchedPercent: Math.max(watchedPercent || 0),
        isCompleted: Boolean(isCompleted || (watchedPercent >= course.completionThresholdPercent)),
        completedAt: (isCompleted || watchedPercent >= course.completionThresholdPercent) ? new Date() : undefined,
        lastWatchedAt: new Date(),
      }
    });

    // Calculate total course progress
    const allLessonIds = course.sections.flatMap((s) => s.lessons.map((l) => l.id));
    const allProgresses = await prisma.lessonProgress.findMany({
      where: {
        userId: user.id,
        lessonId: { in: allLessonIds },
        isCompleted: true,
      }
    });

    const completedLessonsCount = allProgresses.length;
    const totalLessonsCount = allLessonIds.length;
    const coursePercent = totalLessonsCount > 0 ? (completedLessonsCount / totalLessonsCount) * 100 : 0;
    const isCourseFinished = coursePercent >= 100;

    // Update Enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: user.id, courseId: course.id }
    });

    if (enrollment) {
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          progressPercent: coursePercent,
          isCompleted: isCourseFinished,
          completedAt: isCourseFinished ? (enrollment.completedAt || new Date()) : null,
        }
      });
    }

    // Auto issue certificate if 100% finished and certificateEnabled
    if (isCourseFinished && course.certificateEnabled) {
      const existingCert = await prisma.certificate.findFirst({
        where: { userId: user.id, courseId: course.id }
      });

      if (!existingCert) {
        const certNumber = generateCertificateNumber();
        await prisma.certificate.create({
          data: {
            certificateNumber: certNumber,
            userId: user.id,
            courseId: course.id,
            studentOfficialName: user.officialFullName,
            title: course.title,
            instructorName: course.instructor.officialFullName,
            grade: 'امتياز (100%)',
            totalHours: course.durationHours || 20,
            verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/${certNumber}`,
            isValid: true,
          }
        });

        // Add Notification
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: 'مبروك! تم إصدار شهادتك الرسمية ',
            message: `تهانينا لإتمام كورس ${course.title} بنجاح. يمكنك استعراض وتحميل شهادتك الآن برمز QR.`,
            link: `/verify/${certNumber}`,
            type: 'CERTIFICATE',
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      lessonProgress: progress,
      courseProgressPercent: coursePercent,
      isCourseFinished,
    });
  } catch (error: any) {
    console.error('Progress tracking error:', error);
    return NextResponse.json({ error: 'فشل حفظ التقدم' }, { status: 500 });
  }
}