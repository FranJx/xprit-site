#!/bin/bash
set -e

echo "🔧 Starting application with database migration..."

# Run migration
echo "📦 Running database migration..."
node scripts/migrate.js

# Start the app
echo "🚀 Starting Next.js server..."
exec next start
