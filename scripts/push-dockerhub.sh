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
echo "1️⃣ Building Backend Image..."
docker build -t "$USERNAME/khmerapi-backend:latest" -t "$USERNAME/khmerapi-backend:1.0.0" -f Dockerfile.backend .

echo ""
echo "2️⃣ Building Frontend Image..."
docker build -t "$USERNAME/khmerapi-frontend:latest" -t "$USERNAME/khmerapi-frontend:1.0.0" -f frontend/Dockerfile frontend

echo ""
echo "3️⃣ Pushing Backend Image to Docker Hub..."
docker push "$USERNAME/khmerapi-backend:latest"
docker push "$USERNAME/khmerapi-backend:1.0.0"

echo ""
echo "4️⃣ Pushing Frontend Image to Docker Hub..."
docker push "$USERNAME/khmerapi-frontend:latest"
docker push "$USERNAME/khmerapi-frontend:1.0.0"

echo ""
echo "=========================================================="
echo "✅ Successfully pushed to Docker Hub!"
echo "   - $USERNAME/khmerapi-backend:latest"
echo "   - $USERNAME/khmerapi-frontend:latest"
echo "=========================================================="
echo ""
echo "👨‍🏫 Instructions for Your Teacher (Docker Desktop):"
echo "   1. Download docker-compose.hub.yml"
echo "   2. Run: docker compose -f docker-compose.hub.yml up -d"
echo "   3. Open browser: http://localhost"
echo "=========================================================="
