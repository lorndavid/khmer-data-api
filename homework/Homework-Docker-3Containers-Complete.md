# Homework Report: Docker Three Containers (DB + Backend + Frontend)

```
┌────────────────────────────────────────────────────────┐
│ Name:    Lorn David                                    │
│ ID:      DIT2024139                                    │
│ Class:   PG-A                                          │
└────────────────────────────────────────────────────────┘
```

---

## 1. Homework Objective & Overview

Build 3 independent Docker containers for the Backend system that connects to the Database and Frontend UI. This project consists of **3 Docker Images: Database, Backend API, and Frontend Web UI**. All 3 images are pushed to Docker Hub so they can be pulled and executed on any computer or Docker Desktop.

> 📷 **[ SCREENSHOT PLACEHOLDER 1 ]**: VS Code Project Structure & Dockerfiles

---

## 2. The 3 Docker Containers & Build Commands

### 2.1 Database Container: `lorndavid/khmerapi-database:latest`
Runs PostgreSQL 16 on Alpine Linux to store complete Cambodian geography and population datasets.

```bash
# Pull base image, tag, and push to Docker Hub
docker pull postgres:16-alpine
docker tag postgres:16-alpine lorndavid/khmerapi-database:latest
docker push lorndavid/khmerapi-database:latest

# Pull command for testing on other machines:
docker pull lorndavid/khmerapi-database:latest
```

> 📷 **[ SCREENSHOT PLACEHOLDER 2 ]**: Database Dockerfile / Build & Docker Images List

---

### 2.2 Backend REST API Container: `lorndavid/khmerapi-backend:latest`
Node.js Express REST API server built with Prisma ORM. Connects to database on port `4000`.

```bash
# Build image from Dockerfile.backend, tag, and push
docker build -t lorndavid/khmerapi-backend:latest -f Dockerfile.backend .
docker push lorndavid/khmerapi-backend:latest

# Pull command:
docker pull lorndavid/khmerapi-backend:latest
```

> 📷 **[ SCREENSHOT PLACEHOLDER 3 ]**: Backend Dockerfile & Build Output

---

### 2.3 Frontend Web Application Container: `lorndavid/khmerapi-frontend:latest`
Vue 3 interactive web application served via Nginx on port `80` with built-in API proxy.

```bash
# Build frontend image from frontend/Dockerfile, tag, and push
docker build -t lorndavid/khmerapi-frontend:latest -f frontend/Dockerfile frontend
docker push lorndavid/khmerapi-frontend:latest

# Pull command:
docker pull lorndavid/khmerapi-frontend:latest
```

> 📷 **[ SCREENSHOT PLACEHOLDER 4 ]**: Frontend Dockerfile & Build Output

---

## 3. All 3 Containers Published on Docker Hub

* **Docker Hub Profile:** [https://hub.docker.com/u/lorndavid](https://hub.docker.com/u/lorndavid)

| # | Container Name | Docker Hub Image | Tags | Status |
|---|---|---|---|---|
| 1 | Database | `lorndavid/khmerapi-database` | `latest`, `1.0.0` | Public |
| 2 | Backend API | `lorndavid/khmerapi-backend` | `latest`, `1.0.0` | Public |
| 3 | Frontend Web | `lorndavid/khmerapi-frontend` | `latest`, `1.0.0` | Public |

> 📷 **[ SCREENSHOT PLACEHOLDER 5 ]**: Docker Hub Repositories Page (showing all 3 containers)

---

## 4. How to Pull and Run on Any Computer / Docker Desktop

### Method A: Turnkey Execution with Docker Compose (Recommended)

```bash
# 1. Pull project and run all 3 containers
git clone https://github.com/lorndavid/khmer-data-api.git
cd khmer-data-api
docker compose -f docker-compose.hub.yml up -d

# 2. Check running status
docker ps
```

### Method B: Manual Execution via Docker Network & CLI (Like Classmate Model)

```bash
# 1. Pull all 3 images from Docker Hub
docker pull lorndavid/khmerapi-database:latest
docker pull lorndavid/khmerapi-backend:latest
docker pull lorndavid/khmerapi-frontend:latest

# 2. Create isolated Docker network
docker network create khmerapi-net

# 3. Start Database Container
docker run -d \
  --name khmerapi-database \
  --network khmerapi-net \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgrespassword \
  -e POSTGRES_DB=khmerapi \
  -p 5432:5432 \
  lorndavid/khmerapi-database:latest

# 4. Start Backend API Container
docker run -d \
  --name khmerapi-backend \
  --network khmerapi-net \
  -p 4000:4000 \
  -e DATABASE_URL=postgresql://postgres:postgrespassword@khmerapi-database:5432/khmerapi?schema=public \
  lorndavid/khmerapi-backend:latest

# 5. Start Frontend Container
docker run -d \
  --name khmerapi-frontend \
  --network khmerapi-net \
  -p 80:80 \
  lorndavid/khmerapi-frontend:latest
```

> 📷 **[ SCREENSHOT PLACEHOLDER 6 ]**: `docker ps` Output Showing All 3 Containers Running

---

## 5. Testing & Verification

* **Frontend Web UI:** [http://localhost](http://localhost)
* **REST API All Provinces:** [http://localhost/v1/provinces](http://localhost/v1/provinces)
* **Backend Health Check:** [http://localhost:4000/health](http://localhost:4000/health)
* **Live Cloud Domain:** [https://khmerapi.lorndavid.online](https://khmerapi.lorndavid.online)

> 📷 **[ SCREENSHOT PLACEHOLDER 7 ]**: Frontend Website Interface Running in Browser (`http://localhost`)

> 📷 **[ SCREENSHOT PLACEHOLDER 8 ]**: REST API JSON Response for `/v1/provinces`

---

<br/>

<div align="center">
  <h1 style="color:#228B22; font-size:32px;">THANK YOU</h1>
</div>
