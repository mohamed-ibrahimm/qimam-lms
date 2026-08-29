import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ user: null }, { 
      status: 401,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
  }

  let userWithData: any = null;
  try {
    userWithData = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        fatherName: true,
        lastName: true,
        officialFullName: true,
        username: true,
        phone: true,
        avatarUrl: true,
        bio: true,
        enrollments: {
          where: { status: 'ACTIVE' },
          include: {
            course: { select: { id: true, title: true, slug: true, thumbnail: true } },
            diploma: { select: { id: true, title: true, slug: true, thumbnail: true } },
          }
        },
        certificates: {
          where: { isValid: true },
          select: { id: true, certificateNumber: true, title: true, grade: true, issuedAt: true }
        }
      }
    });
  } catch (_) {}

  return NextResponse.json(
    { user: userWithData || currentUser },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}