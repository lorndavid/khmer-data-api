# ==============================================================
# 🇰🇭 KhmerAPI - Optimized Ultra-Slim All-In-One Docker Image
# Packages: Frontend (Vue 3/Nginx) + Backend (Node.js) + PostgreSQL
# ==============================================================

# 1. Build Vue 3 Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 2. Build Backend TypeScript & Scripts
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY package*.json tsconfig.json ./
COPY prisma ./prisma/
RUN npm ci
COPY src ./src/
COPY scripts ./scripts/
RUN npx prisma generate
RUN npm run build && \
    npx tsc scripts/import-cambodia-2025.ts --outDir dist --target ES2022 --module NodeNext --moduleResolution NodeNext --esModuleInterop --skipLibCheck --rootDir .

# 3. Final Production Unified Image (Optimized & Slimmed)
FROM node:20-alpine

# Install minimal PostgreSQL 16, Nginx, su-exec, openssl, and curl/wget
RUN apk update && apk add --no-cache \
    postgresql16 \
    nginx \
    su-exec \
    openssl \
    wget \
    curl \
    bash && \
    rm -rf /var/cache/apk/* /usr/share/man /usr/share/doc /tmp/*

WORKDIR /app

# Install ONLY production dependencies & generate minimal Prisma Client
COPY package*.json tsconfig.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev && \
    npx prisma generate && \
    npm cache clean --force && \
    rm -rf /root/.npm /root/.cache /tmp/*

# Copy built backend code, compiled scripts, and datasets
COPY --from=backend-builder /app/dist ./dist
COPY *.csv ./

# Copy compiled frontend to Nginx web root
COPY --from=frontend-builder /frontend/dist /usr/share/nginx/html

# Setup Nginx configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

# Setup Entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh && \
    sed -i 's/\r$//' /docker-entrypoint.sh

# Environment variables
ENV NODE_ENV=production \
    PORT=4000 \
    HOST=0.0.0.0 \
    DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/khmerapi?schema=public" \
    REDIS_ENABLED="false" \
    CORS_ORIGINS="*"

# Expose Web (80), REST API (4000), PostgreSQL (5432)
EXPOSE 80 4000 5432

HEALTHCHECK --interval=20s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:4000/health || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
