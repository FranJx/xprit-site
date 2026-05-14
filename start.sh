#!/bin/bash
set -e

echo "🔧 Starting XpriT Robotics on Railway..."

# Exportar variables de ambiente
export XTH_BACKEND_URL=${XTH_BACKEND_URL:-http://localhost:5000}

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

