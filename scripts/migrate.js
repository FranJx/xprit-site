#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔧 Database Migration Starting...');

if (!process.env.DATABASE_URL) {
  console.log('⏭️  DATABASE_URL not set, skipping migration');
  process.exit(0);
}

console.log('📦 Running Prisma schema push...');

try {
  execSync('npx prisma db push --skip-generate', {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  console.log('✅ Migration successful');
} catch (err) {
  console.warn('⚠️  Migration warning:', err.message);
  // Don't fail the build if migration has issues
  process.exit(0);
}
