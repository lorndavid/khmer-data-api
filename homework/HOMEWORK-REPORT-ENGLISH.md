# Home Work: Docker Three Containers & Cloud Deployment

```
┌────────────────────────────────────────────────────────┐
│ Name:    Lorn David                                    │
│ ID:      DIT2024139                                    │
│ Class:   PG-A                                          │
└────────────────────────────────────────────────────────┘
```

---

## 1. How to Download and Install Docker

### 1.1 On Windows
* **Prerequisites:** Enable WSL 2 (Windows Subsystem for Linux) and Hardware Virtualization in BIOS / Task Manager.
* **Installation Steps:**
  1. Visit the official website: [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
  2. Click **Download for Windows** (`Docker Desktop Installer.exe`).
  3. Run the installer and choose **"Use WSL 2 instead of Hyper-V (recommended)"**.
  4. Wait for install to complete, then click **Close and restart** your computer.
  5. Open Docker Desktop and verify in terminal:

```bash
> docker --version
Docker version 29.7.2, build a7dcaa6

> docker compose version
Docker Compose version v2.32.4
```

### 1.2 On Linux (Ubuntu / Debian VPS)
Install Docker Engine and Docker Compose via Terminal with APT repository:

```bash
# 1. Update and install required tools
sudo apt update && sudo apt install -y ca-certificates curl gnupg lsb-release

# 2. Add Docker Official GPG Key & Repository
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 3. Install Docker Engine and Compose Plugin
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 4. Enable non-root user and check version
sudo usermod -aG docker $USER && newgrp docker
docker --version
```

---

## 2. Create Docker Hub Account, Pull & Push Images (3 Containers)

* **2.1 Create Docker Hub Account:** Sign up at [hub.docker.com](https://hub.docker.com) (Username: **`lorndavid`**).
* **2.2 Terminal Login:** Run `docker login` and authenticate.

```bash
> docker login
Username: lorndavid
Password: ********
Login Succeeded
```

* **2.3 Tag and Push All 3 Containers to Docker Hub:**

```bash
# 1. Database Image (PostgreSQL 16)
docker pull postgres:16-alpine
docker tag postgres:16-alpine lorndavid/khmerapi-database:latest
docker push lorndavid/khmerapi-database:latest

# 2. Backend REST API Image (Node.js Express)
docker build -t lorndavid/khmerapi-backend:latest -f Dockerfile.backend .
docker push lorndavid/khmerapi-backend:latest

# 3. Frontend Web Image (Vue 3 + Nginx)
docker build -t lorndavid/khmerapi-frontend:latest -f frontend/Dockerfile frontend
docker push lorndavid/khmerapi-frontend:latest
```

* **Verified Repositories on Docker Hub:** [https://hub.docker.com/u/lorndavid](https://hub.docker.com/u/lorndavid)

![Docker Hub Screenshot](dockerhub-screenshot.png)

---

## 3. The 3 Containers Setup for Docker Desktop (Teacher Run)

Save this single `docker-compose.yml` to run the complete system locally:

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

  # 2. Backend Container (Node.js Express API)
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

  # 3. Frontend Container (Vue 3 + Nginx Reverse Proxy)
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

### Steps to Run:
```bash
docker compose up -d
```

### Local Browser Testing:
* 🌐 **Frontend UI:** [http://localhost](http://localhost)
* 📡 **REST API:** [http://localhost/v1/provinces](http://localhost/v1/provinces)
* 🩺 **Backend Health:** [http://localhost:4000/health](http://localhost:4000/health)

---

## 4. Cloud Hosting on Free VPS & Free Domain (3 Containers)

* **Cloud VPS:** Ubuntu 24.04 LTS Server (`147.93.111.196`)
* **Architecture:** Running the 3 containers (`database`, `backend`, `frontend`) directly in production with Docker.
* **Custom Domain & SSL:** Configured DNS A-Records to point directly to the VPS with automatic HTTPS encryption.

### Clickable Live Domain Links:
* 🌐 **Live Web Application:** [https://khmerapi.lorndavid.online](https://khmerapi.lorndavid.online) (or [https://khmer.lorndavid.online](https://khmer.lorndavid.online))
* 📡 **Live REST API Endpoint:** [https://khmerapi.lorndavid.online/v1/provinces](https://khmerapi.lorndavid.online/v1/provinces)
* 🩺 **Live API Health Status:** [https://khmerapi.lorndavid.online/health](https://khmerapi.lorndavid.online/health)

---

<br/>

<div align="center">
  <h1 style="color:#228B22; font-size:32px;">THANK YOU</h1>
</div>
