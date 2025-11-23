#!/usr/bin/env node

/**
 * Migration script that runs on Railway startup
 * Syncs Prisma schema with PostgreSQL database
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting database migration...');
console.log('Environment:', process.env.NODE_ENV || 'development');

try {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL not set, skipping migration');
    process.exit(0);
  }

  console.log('📦 Running Prisma db push...');
  
  // Run prisma db push to sync schema
  execSync('npx prisma db push --skip-generate --skip-seed', {
    stdio: 'inherit',
    cwd: process.cwd(),
  });

  console.log('✅ Database migration completed successfully');
  process.exit(0);
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  // Don't exit with error - let the app start anyway
  // The error handling in APIs will catch DB connection errors
  process.exit(0);
}
