#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔧 Database Migration Starting...');

if (!process.env.DATABASE_URL) {
  console.log('⏭️  DATABASE_URL not set, skipping migration');
  process.exit(0);
}

console.log('📦 Running Prisma migrations...');

try {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  console.log('✅ Migrations applied successfully');
} catch (err) {
  console.warn('⚠️  Migration warning:', err.message);
  // Don't fail the build if migration has issues
  process.exit(0);
}
