#!/bin/sh
set -e

echo "=========================================="
echo "🇰🇭 Starting KhmerAPI All-In-One Container"
echo "=========================================="

# 1. Setup and Initialize PostgreSQL
PGDATA="/var/lib/postgresql/data"
mkdir -p "$PGDATA" /run/postgresql
chown -R postgres:postgres "$PGDATA" /run/postgresql

if [ ! -f "$PGDATA/PG_VERSION" ]; then
    echo "📦 Initializing PostgreSQL cluster..."
    su-exec postgres initdb -D "$PGDATA" --auth-local=trust --auth-host=trust
    echo "local all all trust" > "$PGDATA/pg_hba.conf"
    echo "host all all 127.0.0.1/32 trust" >> "$PGDATA/pg_hba.conf"
    echo "host all all ::1/128 trust" >> "$PGDATA/pg_hba.conf"
fi

echo "🚀 Starting PostgreSQL..."
su-exec postgres pg_ctl -D "$PGDATA" -o "-c listen_addresses='localhost'" -w start

# Configure Database and user password
echo "🔧 Configuring PostgreSQL Database..."
su-exec postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgrespassword';" 2>/dev/null || true
su-exec postgres psql -c "CREATE DATABASE khmerapi OWNER postgres;" 2>/dev/null || true

# Wait for PostgreSQL
until su-exec postgres pg_isready -h localhost -p 5432 -U postgres -d khmerapi; do
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 1
done

echo "✅ PostgreSQL is active and healthy."

# 2. Run Prisma Schema Setup and Data Import
echo "📊 Running Prisma Database Push..."
export DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/khmerapi?schema=public"
export NODE_ENV="production"
export PORT="4000"
export HOST="0.0.0.0"
export REDIS_ENABLED="false"
export JWT_SECRET="super_secret_jwt_key_khmerapi_platform_default"
export JWT_REFRESH_SECRET="super_secret_refresh_jwt_key_khmerapi_platform_default"
export CORS_ORIGINS="*"

cd /app
npx prisma db push --skip-generate || true

echo "📥 Verifying & Importing Cambodia 2025 Geographic & Demographic Data..."
node dist/scripts/import-cambodia-2025.js || true

# 3. Start Backend Express API in Background
echo "🚀 Starting KhmerAPI REST Backend on port 4000..."
node dist/server.js &
BACKEND_PID=$!

# Wait for backend to respond
until wget --no-verbose --tries=1 --spider http://127.0.0.1:4000/health 2>/dev/null; do
    echo "⏳ Waiting for REST API gateway on port 4000..."
    sleep 1
done
echo "✅ KhmerAPI REST Backend is LIVE!"

# 4. Start Nginx to Serve Frontend and Proxy APIs
echo "🌐 Starting Nginx Web Server on port 80..."
nginx

echo "=========================================================="
echo "🎉 KhmerAPI Container is ready!"
echo "👉 Frontend Website: http://localhost:80 (or your port)"
echo "👉 REST API Gateway: http://localhost:4000/api/v1"
echo "👉 OpenAPI / Swagger: http://localhost:80/docs"
echo "=========================================================="

# Trap termination signals
trap "echo 'Stopping services...'; kill -TERM $BACKEND_PID 2>/dev/null; nginx -s quit; su-exec postgres pg_ctl -D $PGDATA stop; exit 0" SIGINT SIGTERM

# Keep container alive by waiting for backend
wait $BACKEND_PID
