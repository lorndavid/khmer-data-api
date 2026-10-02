# HOMEWORK REPORT: DOCKER THREE-TIER ARCHITECTURE & CLOUD DEPLOYMENT

```
┌────────────────────────────────────────────────────────┐
│ Name:    Lorn David                                    │
│ ID:      DIT2024139                                    │
│ Class:   PG-A                                          │
│ Subject: Docker Three Containers & Cloud Deployment    │
└────────────────────────────────────────────────────────┘
```

---

## 1. How to Download and Install Docker

### 1.1 On Windows
* **System Prerequisites:**
  * Enable **WSL 2** (Windows Subsystem for Linux) and **Hardware Virtualization** in BIOS / Windows Features.
* **Step-by-Step Installation:**
  1. Visit the official Docker website: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
  2. Click the button **Download for Windows** to download `Docker Desktop Installer.exe`.
  3. Run the installer and ensure **"Use WSL 2 instead of Hyper-V (recommended)"** is selected.
  4. Wait for the installation to finish, then click **Close and restart** your computer.
  5. After rebooting, launch **Docker Desktop** and accept the terms of service.
  6. Open PowerShell or Command Prompt (cmd) and verify installation:

```bash
> docker --version
Docker version 29.7.2, build a7dcaa6

> docker compose version
Docker Compose version v2.32.4
```

---

### 1.2 On Linux (Ubuntu / Debian VPS)
On Linux, Docker Engine is installed via Command Line (Terminal) using the official APT repository:

1. **Remove old or conflicting packages (if any):**
   ```bash
   sudo apt remove docker docker-engine docker.io containerd runc
   ```

2. **Update package lists and install prerequisite utilities:**
   ```bash
   sudo apt update
   sudo apt install -y ca-certificates curl gnupg lsb-release
   ```

3. **Add Docker's official GPG key:**
   ```bash
   sudo install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   sudo chmod a+r /etc/apt/keyrings/docker.gpg
   ```

4. **Set up the official stable repository:**
   ```bash
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

5. **Install Docker Engine, CLI, and Docker Compose plugin:**
   ```bash
   sudo apt update
   sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

6. **Allow regular non-root user to run Docker commands:**
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

7. **Verify Docker installation:**
   ```bash
   docker --version
   # Output: Docker version 27.5.1, build 9f9e405
   ```

---

## 2. Create Docker Account, Pull, Tag, and Push Images (All 3 Containers)

### 2.1 Create Docker Hub Account
1. Visit [https://hub.docker.com](https://hub.docker.com) and click **Sign Up**.
2. Fill in account credentials: Username (`lorndavid`), Email address, and secure Password.
3. Check your email inbox and click the verification link to confirm and activate your Docker Hub account.

### 2.2 Login to Docker Hub via Terminal
```bash
> docker login
Username: lorndavid
Password: ********
Login Succeeded
```

### 2.3 Build, Tag, and Push All 3 Containers to Docker Hub
To satisfy the homework requirement of 3 distinct containers, all 3 images were tagged and published under the personal account **`lorndavid`**:

```bash
# --- 1. Database Image (PostgreSQL 16) ---
docker pull postgres:16-alpine
docker tag postgres:16-alpine lorndavid/khmerapi-database:latest
docker tag postgres:16-alpine lorndavid/khmerapi-database:1.0.0
docker push lorndavid/khmerapi-database:latest
docker push lorndavid/khmerapi-database:1.0.0

# --- 2. Backend REST API Image (Node.js Express) ---
docker build -t lorndavid/khmerapi-backend:latest -t lorndavid/khmerapi-backend:1.0.0 -f Dockerfile.backend .
docker push lorndavid/khmerapi-backend:latest
docker push lorndavid/khmerapi-backend:1.0.0

# --- 3. Frontend Web Application Image (Vue 3 + Nginx) ---
docker build -t lorndavid/khmerapi-frontend:latest -t lorndavid/khmerapi-frontend:1.0.0 -f frontend/Dockerfile frontend
docker push lorndavid/khmerapi-frontend:latest
docker push lorndavid/khmerapi-frontend:1.0.0
```

### Verification on Docker Hub:
Navigating to [https://hub.docker.com/u/lorndavid](https://hub.docker.com/u/lorndavid) confirms all 3 active public repositories:

| Container | Repository / Image Name | Tags Available | Status |
|---|---|---|---|
| **1. Database** | `lorndavid/khmerapi-database` | `latest`, `1.0.0` | Active on Docker Hub |
| **2. Backend API** | `lorndavid/khmerapi-backend` | `latest`, `1.0.0` | Active on Docker Hub |
| **3. Frontend Web** | `lorndavid/khmerapi-frontend` | `latest`, `1.0.0` | Active on Docker Hub |

---

## 3. The 3 Docker Containers Architecture & Docker Desktop Setup

* **1.1 Database Container (`khmerapi-database`):**  
  Runs PostgreSQL 16 on Alpine Linux. Listens on internal port 5432. Automatically maps persistent storage volume `khmerapi_db_data` and includes `pg_isready` health checks.
* **1.2 Backend Container (`khmerapi-backend`):**  
  Node.js Express REST API server built with Prisma ORM. On startup, it synchronizes database schemas and imports complete Cambodian geographic data (25 provinces, 210 districts, 1,661 communes, 14,528 villages) automatically.
* **1.3 Frontend Container (`khmerapi-frontend`):**  
  Vue 3 single-page application served via an internal Nginx web server on port 80. Nginx proxies all `/v1/` requests directly to the backend container, eliminating cross-origin (CORS) issues.

### Complete Turnkey `docker-compose.yml` Configuration:

```yaml
name: khmerapi

services:
  # 1. Database Container (PostgreSQL 16)
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

  # 2. Backend REST API Container
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

  # 3. Frontend Web Application Container
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

### How to Run and Test on Docker Desktop:

```bash
# 1. Start all 3 containers with a single command
docker compose up -d

# 2. Verify all 3 containers are healthy and running
docker ps

# 3. Test in Browser:
# Frontend Web App:  http://localhost
# REST API Endpoint: http://localhost/v1/provinces
# Health Status:     http://localhost:4000/health

# 4. Stop containers when finished:
docker compose down
```

---

## 4. Production Deployment on Free VPS & Free Domain with Nginx Proxy Manager

In addition to local Docker Desktop execution, the project is deployed to a live Cloud VPS environment with automated HTTPS SSL and reverse proxy management:

* **Cloud VPS Server:** Ubuntu 24.04 LTS (Hostinger Cloud VPS), Public IPv4: `147.93.111.196`.
* **Custom Domain:** Configured DNS A-Record for `khmerapi.lorndavid.online` pointing to the VPS IP.
* **Nginx Proxy Manager Container:** Deployed official `jc21/nginx-proxy-manager:latest` on ports 80, 81 (Admin Web UI), and 443 (HTTPS).
* **SSL & Security:** Automated Let's Encrypt SSL certificate with HTTP-to-HTTPS forced redirection, HSTS, and HTTP/2 support.
* **Proxy Routing:** Forwarding `https://khmerapi.lorndavid.online` directly to container `khmerapi-frontend:80`.

### Live Cloud Production URLs:
* 🌐 **Live Web Application:** [https://khmerapi.lorndavid.online](https://khmerapi.lorndavid.online)
* 📡 **Live API Base URL:** [https://khmerapi.lorndavid.online/v1/provinces](https://khmerapi.lorndavid.online/v1/provinces)
* 🩺 **Live API Health Check:** [https://khmerapi.lorndavid.online/health](https://khmerapi.lorndavid.online/health)
* 🔐 **Nginx Proxy Manager Admin:** [http://147.93.111.196:81](http://147.93.111.196:81)

---

## 5. Summary of Completed Objectives

* ✅ **1.1 Database Container** created, configured, and published to Docker Hub (`lorndavid/khmerapi-database:latest`).
* ✅ **1.2 Backend REST API Container** created, configured, and published to Docker Hub (`lorndavid/khmerapi-backend:latest`).
* ✅ **1.3 Frontend Web Application Container** created, configured, and published to Docker Hub (`lorndavid/khmerapi-frontend:latest`).
* ✅ **2.1 Free Domain & Cloud VPS** configured with DNS A-Records.
* ✅ **2.2 Live Web Application** hosted with Docker and Nginx Proxy Manager with Let's Encrypt SSL.
* ✅ Turnkey evaluation supported for teacher on Docker Desktop via `docker compose up -d`.

<br/>

<div align="center">
  <h1 style="color:#228B22; font-size:32px;">THANK YOU</h1>
</div>
