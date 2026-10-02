# 🇰🇭 KhmerAPI — Teacher Evaluation & Setup Guide

**Project:** KhmerAPI — Open Cambodia Geographic & Population API Platform  
**Student:** David Lorn (`lorndavid`)  
**Docker Hub Repositories (All 3 Containers):**
1. 🗄️ **Database:** [`lorndavid/khmerapi-database:latest`](https://hub.docker.com/r/lorndavid/khmerapi-database) (PostgreSQL 16)
2. ⚙️ **Backend:** [`lorndavid/khmerapi-backend:latest`](https://hub.docker.com/r/lorndavid/khmerapi-backend) (Node.js Express REST API)
3. 🌐 **Frontend:** [`lorndavid/khmerapi-frontend:latest`](https://hub.docker.com/r/lorndavid/khmerapi-frontend) (Vue 3 + Nginx Reverse Proxy)

---

## 📋 Prerequisites
* **Docker Desktop** installed and running on Windows, macOS, or Linux.
* *No Node.js, Git, or PostgreSQL installation required.*

---

## 🚀 Quick Start (Run on Docker Desktop in 2 Steps)

### Step 1: Download or Create `docker-compose.yml`
Save the following configuration as `docker-compose.yml` in any empty folder:

```yaml
name: khmerapi

services:
  # Container 1: Database (PostgreSQL 16)
  database:
    image: lorndavid/khmerapi-database:latest
    container_name: khmerapi-database
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgrespassword
      POSTGRES_DB: khmerapi
    ports:
      - "5432:5432"
    volumes:
      - khmerapi_db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d khmerapi"]
      interval: 5s
      timeout: 5s
      retries: 5

  # Container 2: Backend REST API Gateway
  backend:
    image: lorndavid/khmerapi-backend:latest
    container_name: khmerapi-backend
    restart: unless-stopped
    ports:
      - "4000:4000"
    environment:
      NODE_ENV: production
      PORT: 4000
      HOST: 0.0.0.0
      DATABASE_URL: postgresql://postgres:postgrespassword@database:5432/khmerapi?schema=public
      REDIS_ENABLED: "false"
      CORS_ORIGINS: "*"
    depends_on:
      database:
        condition: service_healthy

  # Container 3: Frontend Web Application + Nginx Reverse Proxy
  frontend:
    image: lorndavid/khmerapi-frontend:latest
    container_name: khmerapi-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  khmerapi_db_data:
```

---

### Step 2: Pull and Start All 3 Containers
Open your terminal in that folder and run:

```bash
docker compose up -d
```

Docker Desktop will automatically pull all 3 images from Docker Hub and start them:
```text
✔ Container khmerapi-database  Healthy
✔ Container khmerapi-backend   Started
✔ Container khmerapi-frontend  Started
```

*(Note: On first startup, the backend automatically initializes the database tables and imports all 25 provinces, 210 districts, 1,661 communes, and 14,528 villages).*

---

## 🔍 How to Test & Verify

Once started, test the application directly in your browser:

| Component | URL | Expected Result |
|---|---|---|
| **Web Application** | [http://localhost](http://localhost) | Interactive Vue 3 Documentation & Explorer UI |
| **REST API Endpoint** | [http://localhost/v1/provinces](http://localhost/v1/provinces) | JSON list of 25 Cambodian provinces |
| **Direct Backend Port** | [http://localhost:4000/v1/villages?limit=5](http://localhost:4000/v1/villages?limit=5) | JSON response containing Cambodian village records |
| **Backend Health Check** | [http://localhost:4000/health](http://localhost:4000/health) | `{"status":"ok", "timestamp":"..."}` |

---

## 🛑 How to Stop Containers

When you are done testing, run:

```bash
# Stop containers
docker compose down

# Or stop and remove the stored database volume
docker compose down -v
```

---

## ☁️ Live Cloud Deployment (Homework Bonus)
This exact 3-container setup is also deployed on a live Cloud VPS with **Nginx Proxy Manager** and SSL domain:
* **Live Web App:** [https://khmerapi.lorndavid.online](https://khmerapi.lorndavid.online)
* **Live API Base URL:** [https://khmerapi.lorndavid.online/v1/provinces](https://khmerapi.lorndavid.online/v1/provinces)
