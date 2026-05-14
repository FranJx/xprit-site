#!/usr/bin/env node

import { execSync } from 'child_process'

export async function runMigration() {
  console.log('🔧 Database Migration Starting...')

  if (!process.env.DATABASE_URL) {
    console.log('⏭️  DATABASE_URL not set, skipping migration')
    return
  }

  console.log('📦 Running Prisma migrations...')

  try {
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      cwd: process.cwd(),
    })
    console.log('✅ Migrations applied successfully')
  } catch (err) {
    console.warn('⚠️  Migration warning:', err.message)
    // Don't fail the build if migration has issues
  }
}

// Si se ejecuta directamente desde CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration()
}
