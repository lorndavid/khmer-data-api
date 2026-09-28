#!/bin/sh
set -e

echo "🚀 Checking database connection and schema..."
npx prisma db push --skip-generate || true

echo "📥 Verifying & importing geographic and demographic data..."
node dist/scripts/import-cambodia-2025.js || true

echo "🌐 Starting KhmerAPI REST Backend on port $PORT..."
exec node dist/server.js
