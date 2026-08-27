const fs = require('fs');
const path = require('path');

// Load environment variables from .env if present
try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        if (!process.env[key]) process.env[key] = value.trim();
      }
    });
  }
} catch (e) {
  // ignore
}

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

const dbUrl = process.env.DATABASE_URL || '';
const isPostgres = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://') || Boolean(process.env.VERCEL);

if (isPostgres) {
  schema = schema.replace(/datasource db\s*\{[\s\S]*?\}/, `datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}`);
  console.log('📦 [Database Setup] Configured Prisma for PostgreSQL (Supabase / Production).');
} else {
  schema = schema.replace(/datasource db\s*\{[\s\S]*?\}/, `datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}`);
  console.log('💻 [Database Setup] Configured Prisma for SQLite (Local Development).');
}

fs.writeFileSync(schemaPath, schema, 'utf8');
