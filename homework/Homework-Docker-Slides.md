# 📊 Docker Homework Presentation Slides

**Student Name:** Lorn David  
**Student ID:** DIT2024139  
**Class:** PG-A  
**Subject:** Docker Three Containers & Cloud Deployment  

---

## Slide 1: Title Slide
* **Title:** Docker Homework Presentation: Three Containers & Cloud Hosting
* **Subtitle:** PostgreSQL DB • Node.js Backend • Vue 3 Frontend • Free VPS & Nginx Proxy Manager
* **Author:** Lorn David (DIT2024139), Class PG-A

---

## Slide 2: Homework Overview & Requirements
* **Requirement 1: 3 Docker Containers**
  * `1.1 Database`: PostgreSQL 16 Alpine (`5432:5432`)
  * `1.2 Backend API`: Node.js Express REST API (`4000:4000`)
  * `1.3 Frontend UI`: Vue 3 Single Page Application + Nginx (`80:80`)
* **Requirement 2: Cloud VPS & Nginx Proxy Manager**
  * Cloud VPS: Ubuntu 24.04 LTS (IP: `147.93.111.196`)
  * Domain: `lorndavid.online` / `khmerapi.lorndavid.online` / `khmer.lorndavid.online`
  * Nginx Proxy Manager: Port 81 Web GUI + SSL
  * All 3 containers pushed to Docker Hub (`lorndavid`)

> 📷 **[ Screenshot Box ]**: Architecture Diagram / VS Code Dockerfiles

---

## Slide 3: 1.1 Database Container (PostgreSQL 16)
* **Image:** `lorndavid/khmerapi-database:latest`
* **Port:** `5432:5432`
* **Features:** Stores 25 provinces, 210 districts, 1,661 communes, 14,528 villages with persistent volume.

```bash
docker pull lorndavid/khmerapi-database:latest

docker network create khmerapi-net 2>/dev/null || true

docker run -d \
  --name khmerapi-database \
  --network khmerapi-net \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgrespassword \
  -e POSTGRES_DB=khmerapi \
  -p 5432:5432 \
  lorndavid/khmerapi-database:latest
```

> 📷 **[ Screenshot Box ]**: Database Container Running / Database Logs

---

## Slide 4: 1.2 Backend REST API Container (Node.js Express)
* **Image:** `lorndavid/khmerapi-backend:latest`
* **Port:** `4000:4000`
* **Features:** Express REST API with Prisma ORM connecting to PostgreSQL database.

```bash
docker pull lorndavid/khmerapi-backend:latest

docker run -d \
  --name khmerapi-backend \
  --network khmerapi-net \
  -p 4000:4000 \
  -e DATABASE_URL=postgresql://postgres:postgrespassword@khmerapi-database:5432/khmerapi?schema=public \
  lorndavid/khmerapi-backend:latest
```

> 📷 **[ Screenshot Box ]**: Backend API Response (`http://localhost:4000/health`)

---

## Slide 5: 1.3 Frontend Web UI Container (Vue 3 + Nginx)
* **Image:** `lorndavid/khmerapi-frontend:latest`
* **Port:** `80:80`
* **Features:** Vue 3 Interactive UI served by Nginx with reverse proxy to `/v1/`.

```bash
docker pull lorndavid/khmerapi-frontend:latest

docker run -d \
  --name khmerapi-frontend \
  --network khmerapi-net \
  -p 80:80 \
  lorndavid/khmerapi-frontend:latest
```

> 📷 **[ Screenshot Box ]**: Frontend Website in Browser (`http://localhost`)

---

## Slide 6: Verification: Exactly 3 Containers Running
* **Command:**
```bash
docker ps
```
* **Output:** All 3 containers (`khmerapi-database`, `khmerapi-backend`, `khmerapi-frontend`) running and healthy.

> 📷 **[ Screenshot Box ]**: Terminal output of `docker ps` showing all 3 containers UP

---

## Slide 7: Requirement 2: Free Domain & Cloud VPS Setup
* **Cloud VPS:** Ubuntu 24.04 LTS (Dedicated IP: `147.93.111.196`)
* **Custom Domain:** `lorndavid.online`
* **Subdomains:**
  * Frontend UI: `khmer.lorndavid.online`
  * REST API Gateway: `khmerapi.lorndavid.online`
* **DNS Configuration:** A-Record pointing domain to VPS IP address
* **Security:** HTTPS with SSL encryption

> 📷 **[ Screenshot Box ]**: VPS Dashboard / DNS A-Record Configuration

---

## Slide 8: Running Nginx Proxy Manager on Docker
* **Image:** `jc21/nginx-proxy-manager:latest`
* **Admin Dashboard:** `http://147.93.111.196:81`
* **Features:** Easy Web GUI for managing reverse proxy hosts and SSL certificates.

```bash
docker run -d \
  --name nginx-proxy-manager \
  --restart always \
  -p 80:80 \
  -p 81:81 \
  -p 443:443 \
  -v npm_data:/data \
  -v npm_letsencrypt:/etc/letsencrypt \
  jc21/nginx-proxy-manager:latest
```

> 📷 **[ Screenshot Box ]**: Nginx Proxy Manager Admin Dashboard (Port 81)

---

## Slide 9: Live Production Results
* 🌐 **Live Website UI:** [https://khmer.lorndavid.online](https://khmer.lorndavid.online)
* 📡 **Live REST API:** [https://khmerapi.lorndavid.online/v1/provinces](https://khmerapi.lorndavid.online/v1/provinces)

> 📷 **[ Screenshot Box ]**: Live Browser Window with HTTPS SSL Padlock

---

## Slide 10: Conclusion & Summary
* ✅ **1.1 Database Container** (PostgreSQL 16) Created & Pushed to Docker Hub
* ✅ **1.2 Backend API Container** (Node.js Express) Created & Pushed to Docker Hub
* ✅ **1.3 Frontend UI Container** (Vue 3 + Nginx) Created & Pushed to Docker Hub
* ✅ **2.1 Free Domain & Cloud VPS** Configured
* ✅ **2.2 Nginx Proxy Manager** & Live HTTPS Web App Operational

<div align="center">
  <h1 style="color:#22c55e;">THANK YOU</h1>
</div>
