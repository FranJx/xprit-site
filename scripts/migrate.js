#!/usr/bin/env node

/**
 * Migration script that runs on Railway startup
 * Syncs Prisma schema with PostgreSQL database
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting database migration...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);

try {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not set');
    console.log('ℹ️  Continuing without database migration');
    process.exit(0);
  }

  console.log('📍 DATABASE_URL:', process.env.DATABASE_URL.substring(0, 30) + '...');

  // Check if schema.prisma exists
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ prisma/schema.prisma not found at:', schemaPath);
    process.exit(0);
  }

  console.log('✅ Schema file found');
  console.log('📦 Running: npx prisma db push --skip-generate --skip-seed');
  
  // Run prisma db push to sync schema
  const output = execSync('npx prisma db push --skip-generate --skip-seed 2>&1', {
    cwd: process.cwd(),
    encoding: 'utf-8',
  });

  console.log('Prisma output:', output);
  console.log('✅ Database migration completed successfully');
  process.exit(0);
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.error('Error details:', error);
  // Don't exit with error - let the app start anyway
  // The error handling in APIs will catch DB connection errors
  process.exit(0);
}
