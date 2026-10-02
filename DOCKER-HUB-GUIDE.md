# 🇰🇭 KhmerAPI - Clean 3-Container Docker Setup & Hub Guide

This guide explains how to **clean up old containers**, **build clean new images**, and **run exactly the 3 containers** (`khmerapi-frontend`, `khmerapi-backend`, `khmerapi-database`).

---

## 🧹 Step 1: Clean Up & Delete Old Containers/Images

Run these commands in your terminal to completely remove all old or leftover containers, volumes, and dangling images:

```bash
# 1. Stop and remove all current compose containers, networks, and volumes
docker compose down -v --remove-orphans

# 2. Force remove any leftover old containers if they exist
docker rm -f khmerapi-postgres khmerapi-redis khmerapi-db developerproject-api developerproject-frontend 2>/dev/null || true

# 3. Remove old project images
docker rmi -f developerproject-api developerproject-frontend khmerapi-backend khmerapi-frontend 2>/dev/null || true
```

---

## 🚀 Step 2: Build & Start the Fresh 3 Containers

Run:

```bash
docker compose up -d --build
```

### ✨ Output will show cleanly:
```text
 ✔ Network khmerapi_default        Created
 ✔ Image khmerapi-backend:latest   Built
 ✔ Image khmerapi-frontend:latest  Built
 ✔ Container khmerapi-database     Started
 ✔ Container khmerapi-backend      Started
 ✔ Container khmerapi-frontend     Started
```

---

## 🌐 Exactly 3 Containers Running:

| # | Container Name | Image Name | Exposed Port | Purpose |
|---|---|---|---|---|
| 1 | **`khmerapi-frontend`** | `khmerapi-frontend:latest` | `http://localhost:80` | Vue 3 UI + Nginx Gateway |
| 2 | **`khmerapi-backend`** | `khmerapi-backend:latest` | `http://localhost:4000` | Node.js Express REST API |
| 3 | **`khmerapi-database`** | `postgres:16-alpine` | `localhost:5432` | PostgreSQL 16 with Cambodia Data |

---

## 🌍 Access Your Services

* **Frontend Web Application**: [http://localhost](http://localhost) (or [http://localhost:80](http://localhost:80))
* **REST API Gateway**: [http://localhost:4000/api/v1/provinces](http://localhost:4000/api/v1/provinces) (or via [http://localhost/api/v1/provinces](http://localhost/api/v1/provinces))
* **Swagger / OpenAPI Documentation**: [http://localhost/docs](http://localhost/docs)
* **Population Demographics**: [http://localhost/demographics](http://localhost/demographics)

---

## 🐳 Step 3: Push to Docker Hub

You can push using the automated script or manual commands:

### Option A: Using the Automated Script
In Linux/macOS/Git Bash:
```bash
# 1. Login to Docker Hub
docker login

# 2. Build and push both images automatically
bash scripts/push-dockerhub.sh <your-dockerhub-username>
```

In Windows PowerShell:
```powershell
docker login
.\scripts\push-dockerhub.ps1 -Username "<your-dockerhub-username>"
```

### Option B: Manual Tag & Push
```bash
docker login

# Build & Tag images
docker build -t <your-dockerhub-username>/khmerapi-backend:latest -f Dockerfile.backend .
docker build -t <your-dockerhub-username>/khmerapi-frontend:latest -f frontend/Dockerfile frontend

# Push to Docker Hub
docker push <your-dockerhub-username>/khmerapi-backend:latest
docker push <your-dockerhub-username>/khmerapi-frontend:latest
```

---

## 👨‍🏫 Step 4: How Your Teacher Runs Your Project on Docker Desktop

Your teacher does **NOT** need to install Node.js, clone the full repo, or build anything. They only need Docker Desktop and the single `docker-compose.hub.yml` file!

### Instructions for Teacher:
1. Download or copy [`docker-compose.hub.yml`](docker-compose.hub.yml).
2. Open a terminal in the folder containing `docker-compose.hub.yml` and run:
   ```bash
   docker compose -f docker-compose.hub.yml up -d
   ```
3. Docker Desktop will automatically pull:
   * `postgres:16-alpine`
   * `<your-dockerhub-username>/khmerapi-backend:latest`
   * `<your-dockerhub-username>/khmerapi-frontend:latest`
4. The database automatically initializes and imports all 25 provinces, 210 districts, 1,661 communes, and 14,528 villages!
5. Open browser on Docker Desktop:
   * **Web App UI**: [http://localhost](http://localhost)
   * **REST API**: [http://localhost:4000/v1/provinces](http://localhost:4000/v1/provinces) (or [http://localhost/v1/provinces](http://localhost/v1/provinces))
   * **Health Check**: [http://localhost:4000/health](http://localhost:4000/health)
   * **API Docs**: [http://localhost/docs](http://localhost/docs)

To stop the containers:
```bash
docker compose -f docker-compose.hub.yml down
```

