import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result: any = {
    time: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: !!process.env.VERCEL,
      HAS_DB_URL: !!process.env.DATABASE_URL,
      DB_URL_PREFIX: process.env.DATABASE_URL ? process.env.DATABASE_URL.slice(0, 15) : 'none',
      HAS_JWT_SECRET: !!process.env.JWT_SECRET,
    },
    dbCheck: 'pending'
  };

  try {
    const userCount = await prisma.user.count();
    result.dbCheck = 'connected';
    result.userCount = userCount;

    const users = await prisma.user.findMany({
      select: { username: true, role: true, email: true }
    });
    result.users = users;
  } catch (err: any) {
    result.dbCheck = 'failed';
    result.error = err.message;
    result.stack = err.stack;
  }

  return NextResponse.json(result);
}
