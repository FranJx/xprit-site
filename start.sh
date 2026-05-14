#!/bin/bash
set -e

echo "🔧 Starting XpriT Robotics on Railway..."

# Database migration
echo "📦 Running database migration..."
node scripts/migrate.js

echo "🚀 Starting XTH Backend..."
cd xprit-robotics-hub/backend
npm start &
XTH_PID=$!
echo "✅ XTH Backend started (PID: $XTH_PID)"

cd ../..

# Dar tiempo al backend para iniciarse
sleep 3

echo "🚀 Starting Next.js server..."
exec next start

