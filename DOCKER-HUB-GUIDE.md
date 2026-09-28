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

## 🐳 Step 3: Tag & Push to Docker Hub (For Your Team)

Replace `<your-dockerhub-username>` with your actual Docker Hub username:

```bash
# 1. Login to Docker Hub
docker login

# 2. Tag Frontend & Backend images
docker tag khmerapi-frontend:latest <your-dockerhub-username>/khmerapi-frontend:latest
docker tag khmerapi-backend:latest <your-dockerhub-username>/khmerapi-backend:latest

# 3. Push to Docker Hub
docker push <your-dockerhub-username>/khmerapi-frontend:latest
docker push <your-dockerhub-username>/khmerapi-backend:latest
```

### 👥 How Your Teammates Run the 3 Containers:
Your teammates simply clone the project or download `docker-compose.yml` and run:
```bash
docker compose up -d
```
All 3 containers will start automatically with fully migrated schemas and preloaded Cambodian 2025 data!
