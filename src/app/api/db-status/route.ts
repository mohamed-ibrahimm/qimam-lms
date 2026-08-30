import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envKeys = Object.keys(process.env).filter(k => 
    k.includes('DATABASE') || k.includes('POSTGRES') || k.includes('STORAGE') || k.includes('PRISMA') || k.includes('URL') || k.includes('JWT')
  );

  const hasDbUrl = Boolean(process.env.DATABASE_URL);
  const hasDirectUrl = Boolean(process.env.DIRECT_URL);
  const hasJwtSecret = Boolean(process.env.JWT_SECRET);

  let dbConnected = false;
  let errorMsg = null;
  let userCount = 0;
  let courseCount = 0;
  let diplomaCount = 0;
  let bookCount = 0;

  try {
    userCount = await prisma.user.count();
    courseCount = await prisma.course.count();
    diplomaCount = await prisma.diploma.count();
    bookCount = await prisma.digitalBook.count();
    dbConnected = true;
  } catch (err: any) {
    dbConnected = false;
    errorMsg = err?.message || String(err);
  }

  return NextResponse.json({
    status: dbConnected ? 'ok' : 'database_error',
    database: {
      connected: dbConnected,
      detectedEnvKeys: envKeys,
      hasDatabaseUrlEnv: hasDbUrl,
      hasDirectUrlEnv: hasDirectUrl,
      hasJwtSecretEnv: hasJwtSecret,
      userCount,
      courseCount,
      diplomaCount,
      bookCount,
      error: errorMsg,
    },
    timestamp: new Date().toISOString(),
  });
}