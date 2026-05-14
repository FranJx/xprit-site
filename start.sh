#!/bin/bash
set -e

echo "🔧 Starting XpriT Robotics Site..."

echo "📦 Running database migration..."
node scripts/migrate.js

echo "🚀 Starting Next.js server..."
exec next start

