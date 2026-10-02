#!/bin/bash
# ========================================================
# KhmerAPI Production Environment Setup for David (Lorn David)
# Domains: https://khmer.lorndavid.online & https://khmerapi.lorndavid.online
# ========================================================

TARGET_ENV=".env"
if [ -d "/opt/khmer-api" ]; then
  TARGET_ENV="/opt/khmer-api/.env"
fi

cat << 'EOF' > "$TARGET_ENV"
# ========================================================
# KhmerAPI Production Configuration
# Developer & Owner: David (Lorn David)
# Web: https://khmer.lorndavid.online
# API: https://khmerapi.lorndavid.online
# ========================================================

# App & Network
NODE_ENV=production
PORT=4000
HOST=0.0.0.0
API_BASE_URL=https://khmerapi.lorndavid.online

# Frontend Build Setting (Points web app to live API)
VITE_API_BASE_URL=https://khmerapi.lorndavid.online/api/v1

# Database Configuration (PostgreSQL 16 in Docker)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=DavidSecurePostgres2026!
POSTGRES_DB=khmerapi
DATABASE_URL=postgresql://postgres:DavidSecurePostgres2026!@database:5432/khmerapi?schema=public

# Security & JWT Tokens
JWT_SECRET=david_khmerapi_jwt_secret_prod_secure_key_2026_alpha
JWT_REFRESH_SECRET=david_khmerapi_refresh_jwt_prod_secure_key_2026_beta
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_ANONYMOUS=60
RATE_LIMIT_DEVELOPER=300
RATE_LIMIT_ADMIN=1000
RATE_LIMIT_WINDOW_SECONDS=60

# CORS Allowed Origins
CORS_ORIGINS=https://khmer.lorndavid.online,https://khmerapi.lorndavid.online,*

# Cache & Performance
REDIS_ENABLED=false
LOG_LEVEL=info
EOF

echo "✅ Generated $TARGET_ENV successfully for David!"
