import { PrismaClient } from '@prisma/client';

function getDatabaseUrl(): string {
  const direct = (process.env.DATABASE_URL || '').trim();
  if (
    direct &&
    (direct.startsWith('postgresql://') ||
      direct.startsWith('postgres://') ||
      direct.startsWith('prisma+postgres://') ||
      direct.startsWith('file:'))
  ) {
    return direct;
  }

  const candidates = [
    process.env.STORAGE_PRISMA_DATABASE_URL,
    process.env.STORAGE_POSTGRES_URL,
    process.env.STORAGE_DATABASE_URL,
    process.env.STORAGE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.STORAGE_URL_NON_POOLING,
    process.env.NEON_DATABASE_URL,
    process.env.NEON_URL,
    process.env.SUPABASE_DATABASE_URL,
  ];

  for (const c of candidates) {
    if (c && typeof c === 'string' && c.trim()) {
      return c.trim();
    }
  }

  for (const [key, val] of Object.entries(process.env)) {
    if (
      typeof val === 'string' &&
      (val.startsWith('postgresql://') ||
        val.startsWith('postgres://') ||
        val.startsWith('prisma+postgres://'))
    ) {
      return val.trim();
    }
  }

  return direct || 'file:./dev.db';
}

const activeUrl = getDatabaseUrl();
process.env.DATABASE_URL = activeUrl;
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = process.env.POSTGRES_URL_NON_POOLING || process.env.STORAGE_URL_NON_POOLING || activeUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources:
      activeUrl.startsWith('postgresql://') ||
      activeUrl.startsWith('postgres://') ||
      activeUrl.startsWith('prisma+postgres://')
        ? { db: { url: activeUrl } }
        : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;