#!/bin/bash
# ========================================================
# KhmerAPI — Docker Hub Build & Push Script
# Usage: bash scripts/push-dockerhub.sh <your-dockerhub-username>
# ========================================================

set -e

USERNAME="${1:-lorndavid}"

echo "=========================================================="
echo "🐳 KhmerAPI Docker Hub Publisher"
echo "Target Account: $USERNAME"
echo "=========================================================="

echo ""
echo "1️⃣ Tagging Database Image (PostgreSQL 16)..."
docker pull postgres:16-alpine
docker tag postgres:16-alpine "$USERNAME/khmerapi-database:latest"
docker tag postgres:16-alpine "$USERNAME/khmerapi-database:1.0.0"

echo ""
echo "2️⃣ Building Backend Image..."
docker build -t "$USERNAME/khmerapi-backend:latest" -t "$USERNAME/khmerapi-backend:1.0.0" -f Dockerfile.backend .

echo ""
echo "3️⃣ Building Frontend Image..."
docker build -t "$USERNAME/khmerapi-frontend:latest" -t "$USERNAME/khmerapi-frontend:1.0.0" -f frontend/Dockerfile frontend

echo ""
echo "4️⃣ Pushing Database Image to Docker Hub..."
docker push "$USERNAME/khmerapi-database:latest"
docker push "$USERNAME/khmerapi-database:1.0.0"

echo ""
echo "5️⃣ Pushing Backend Image to Docker Hub..."
docker push "$USERNAME/khmerapi-backend:latest"
docker push "$USERNAME/khmerapi-backend:1.0.0"

echo ""
echo "6️⃣ Pushing Frontend Image to Docker Hub..."
docker push "$USERNAME/khmerapi-frontend:latest"
docker push "$USERNAME/khmerapi-frontend:1.0.0"

echo ""
echo "=========================================================="
echo "✅ Successfully pushed all 3 containers to Docker Hub!"
echo "   1. $USERNAME/khmerapi-database:latest"
echo "   2. $USERNAME/khmerapi-backend:latest"
echo "   3. $USERNAME/khmerapi-frontend:latest"
echo "=========================================================="
echo ""
echo "👨‍🏫 Instructions for Your Teacher (Docker Desktop):"
echo "   1. Download docker-compose.hub.yml"
echo "   2. Run: docker compose -f docker-compose.hub.yml up -d"
echo "   3. Open browser: http://localhost"
echo "=========================================================="
