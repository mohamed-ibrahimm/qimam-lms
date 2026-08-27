import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasDbUrl = Boolean(process.env.DATABASE_URL);
  const hasDirectUrl = Boolean(process.env.DIRECT_URL);
  const hasJwtSecret = Boolean(process.env.JWT_SECRET);

  let dbConnected = false;
  let errorMsg = null;
  let userCount = 0;
  let courseCount = 0;

  try {
    userCount = await prisma.user.count();
    courseCount = await prisma.course.count();
    dbConnected = true;
  } catch (err: any) {
    dbConnected = false;
    errorMsg = err?.message || String(err);
  }

  return NextResponse.json({
    status: dbConnected ? 'ok' : 'database_error',
    database: {
      connected: dbConnected,
      hasDatabaseUrlEnv: hasDbUrl,
      hasDirectUrlEnv: hasDirectUrl,
      hasJwtSecretEnv: hasJwtSecret,
      userCount,
      courseCount,
      error: errorMsg,
    },
    timestamp: new Date().toISOString(),
  });
}