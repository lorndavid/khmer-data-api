# ========================================================
# KhmerAPI — Docker Hub Build & Push Script (PowerShell)
# Usage: .\scripts\push-dockerhub.ps1 -Username "lorndavid"
# ========================================================

param(
    [string]$Username = "lorndavid"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🐳 KhmerAPI Docker Hub Publisher (Windows PowerShell)" -ForegroundColor Cyan
Write-Host "Target Account: $Username" -ForegroundColor Yellow
Write-Host "=========================================================="

Write-Host "`n1️⃣ Building Backend Image..." -ForegroundColor Green
docker build -t "$Username/khmerapi-backend:latest" -t "$Username/khmerapi-backend:1.0.0" -f Dockerfile.backend .

Write-Host "`n2️⃣ Building Frontend Image..." -ForegroundColor Green
docker build -t "$Username/khmerapi-frontend:latest" -t "$Username/khmerapi-frontend:1.0.0" -f frontend/Dockerfile frontend

Write-Host "`n3️⃣ Pushing Backend Image to Docker Hub..." -ForegroundColor Green
docker push "$Username/khmerapi-backend:latest"
docker push "$Username/khmerapi-backend:1.0.0"

Write-Host "`n4️⃣ Pushing Frontend Image to Docker Hub..." -ForegroundColor Green
docker push "$Username/khmerapi-frontend:latest"
docker push "$Username/khmerapi-frontend:1.0.0"

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "✅ Successfully pushed to Docker Hub!" -ForegroundColor Green
Write-Host "   - $Username/khmerapi-backend:latest" -ForegroundColor White
Write-Host "   - $Username/khmerapi-frontend:latest" -ForegroundColor White
Write-Host "=========================================================="
Write-Host "`n👨‍🏫 Instructions for Your Teacher (Docker Desktop):" -ForegroundColor Yellow
Write-Host "   1. Download docker-compose.hub.yml"
Write-Host "   2. Run: docker compose -f docker-compose.hub.yml up -d"
Write-Host "   3. Open browser: http://localhost"
Write-Host "=========================================================="
