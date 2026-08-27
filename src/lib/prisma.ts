import { PrismaClient } from '@prisma/client';

const rawDb = (process.env.DATABASE_URL || '').trim();
const isDbValid = rawDb.startsWith('postgresql://') || rawDb.startsWith('postgres://') || rawDb.startsWith('file:');

if (!isDbValid) {
  const resolvedUrl = (
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.STORAGE_URL ||
    process.env.STORAGE_PRISMA_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.NEON_URL ||
    process.env.SUPABASE_DATABASE_URL ||
    ''
  ).trim();

  if (resolvedUrl) {
    process.env.DATABASE_URL = resolvedUrl;
  }
}

if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL =
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.STORAGE_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    '';
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;