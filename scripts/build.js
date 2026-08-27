const { execSync } = require('child_process');

console.log('🚀 [Build Step 1/3] Preparing Database & Generating Prisma Client...');
try {
  execSync('node scripts/prepare-db.js', { stdio: 'inherit' });
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (e) {
  console.warn('Prisma generate notice:', e.message);
}

const dbUrl = process.env.DATABASE_URL || '';
const isRealDb = dbUrl && !dbUrl.includes('localhost') && !dbUrl.includes('dummy');

if (isRealDb) {
  console.log('📦 [Build Step 2/3] Applying database migrations to PostgreSQL...');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Database migrations applied successfully.');

    try {
      console.log('🌱 Initializing database with seed courses and admin...');
      execSync('node prisma/seed.js', { stdio: 'inherit' });
      console.log('✅ Initial platform seed completed.');
    } catch (seedErr) {
      console.warn('Seed notice (skipping or data exists):', seedErr.message);
    }
  } catch (err) {
    console.warn('⚠️ Migration deploy notice:', err.message);
  }
} else {
  console.log('ℹ️ [Build Step 2/3] Skipping migrations (DATABASE_URL is not set or local).');
}

console.log('⚡ [Build Step 3/3] Building Next.js application...');
execSync('npx next build', { stdio: 'inherit' });