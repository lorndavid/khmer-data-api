# 🇰🇭 KhmerAPI — Project Overview & Windows Docker Desktop Installation Guide

---

## 📌 Part 1: What is KhmerAPI & What Does It Do?

**KhmerAPI** is an open-source, full-stack Cambodian Geographic, Demographic, and Administrative Data Platform. It provides developers, businesses, researchers, and government services with clean, standardized, and high-performance REST APIs for Cambodia's complete administrative hierarchy and demographic data.

### 🌟 Key Features & What the Website Does:

1. **Complete 4-Level Administrative Hierarchy:**
   * **25 Provinces & Capital** (រាជធានី-ខេត្ត)
   * **210 Districts / Municipalities** (ក្រុង-ស្រុក-ខណ្ឌ)
   * **1,661 Communes / Quarters** (ឃុំ-សង្កាត់)
   * **14,528 Villages** (ភូមិ)
   * Available in **both Khmer script** (អក្សរខ្មែរ) and **Latin script** with official National Institute of Statistics (NIS) postal/administrative codes.

2. **Demographics & Population Insights (2013 – 2023):**
   * Historical population records, yearly growth statistics, male vs. female population splits, and urban vs. rural breakdowns.

3. **Interactive API Explorer & Live Playground:**
   * Test API endpoints directly in your browser with real-time parameter filtering, pagination, search, and live response latency metrics.

4. **Interactive GIS Mapping (GeoJSON Boundaries):**
   * High-precision polygon geographic boundaries for all 25 Cambodian provinces for mapping tools like Leaflet, Mapbox, or Google Maps.

5. **Multi-Language Developer Documentation:**
   * Full documentation with interactive code snippets ready to copy in **JavaScript / Node.js, Python, cURL, and PHP**.

6. **Bilingual UI Support:**
   * Native toggle between **English** and **Khmer (ភាសាខ្មែរ)**.

---

## 🏗️ Part 2: System Architecture (3 Clean Containers)

The platform is designed with a modern 3-tier containerized architecture published on Docker Hub:

| # | Container Name | Docker Hub Image | Port | Description |
|---|---|---|---|---|
| 1 | **Database** | `lorndavid/khmerapi-database:latest` | `5432` | PostgreSQL 16 database storing all Cambodian geographic and demographic records. |
| 2 | **Backend API** | `lorndavid/khmerapi-backend:latest` | `4000` | Node.js Express REST API server with Prisma ORM and automated migrations. |
| 3 | **Frontend Web** | `lorndavid/khmerapi-frontend:latest` | `80` | Vue 3 Single Page App served by Nginx with reverse proxy to `/v1/`. |

---

## 💻 Part 3: Step-by-Step Guide to Run on Windows with Docker Desktop

You do **not** need to install Node.js, Python, or Git. You only need **Docker Desktop**!

---

### Step 1: Install Docker Desktop on Windows

1. **Enable Hardware Virtualization:**
   * Open **Task Manager** (`Ctrl + Shift + Esc`) → Click **Performance** tab → Click **CPU** → Verify that **Virtualization** is **Enabled**.
2. **Download Docker Desktop:**
   * Visit the official website: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   * Click **Download for Windows**.
3. **Run the Installer:**
   * Open `Docker Desktop Installer.exe`.
   * Ensure the checkbox **"Use WSL 2 instead of Hyper-V (recommended)"** is checked.
   * Follow the prompts and click **Close and restart** when prompted.
4. **Launch Docker Desktop:**
   * After your PC restarts, open **Docker Desktop** from your Start menu and accept the Terms agreement.
   * Wait until the bottom-left icon turns **green** (Engine running).

---

### Step 2: Get the Project Files

You have **two easy ways** to get the project files on your computer:

#### ⚡ Method 1: Using Git Clone & Git Pull (Fastest & Recommended)
If you have Git installed, open PowerShell or Command Prompt and run:

```bash
# 1. Clone the project from GitHub
git clone https://github.com/lorndavid/khmer-data-api.git
cd khmer-data-api

# If you already cloned it before, just pull the latest updates:
git pull

# 2. Run the 3 containers directly:
docker compose -f docker-compose.hub.yml up -d
```

---

#### 📁 Method 2: Without Git (Single `docker-compose.yml` File)
If you don't have Git installed:
1. Create a new folder on your computer (e.g. `C:\khmerapi`).
2. Inside that folder, create a file named **`docker-compose.yml`**.
3. Copy-paste this content and save:

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

---

### Step 3: Start the Application (1 Command)

1. Open **PowerShell** or **Command Prompt** (cmd) in that folder:
   *(Quick tip: In File Explorer, click the address bar, type `powershell` or `cmd`, and press Enter).*
2. Run this command:

```bash
docker compose up -d
```

3. Docker will automatically pull all 3 images from Docker Hub and start them:
```text
✔ Container khmerapi-database  Healthy
✔ Container khmerapi-backend   Started
✔ Container khmerapi-frontend  Started
```

*(On the very first run, the backend automatically initializes the database tables and populates all 25 provinces, 210 districts, 1,661 communes, and 14,528 villages).*

---

### Step 4: Open and Test in Your Web Browser

Open your favorite web browser (Chrome, Edge, Brave):

| What You Want to See | URL Link | What Appears |
|---|---|---|
| **Website Interface & Explorer** | [http://localhost](http://localhost) | Interactive Vue 3 UI with API explorer & search |
| **All 25 Provinces (JSON)** | [http://localhost/v1/provinces](http://localhost/v1/provinces) | Clean JSON response with province names and codes |
| **Villages Search API** | [http://localhost/v1/villages?limit=10](http://localhost/v1/villages?limit=10) | Paginated list of Cambodian villages |
| **System Health Check** | [http://localhost:4000/health](http://localhost:4000/health) | `{"status":"ok","timestamp":"..."}` |

---

### Step 5: How to Stop or Restart

To stop the containers whenever you want:
```bash
# Stop containers safely
docker compose down

# Start containers again later
docker compose up -d
```

---

## 🌐 Live Production Cloud Deployment

The exact same 3-container platform is also live on the public cloud:
* 🌐 **Live Website:** [https://khmerapi.lorndavid.online](https://khmerapi.lorndavid.online)
* 📡 **Live API Base URL:** [https://khmerapi.lorndavid.online/v1/provinces](https://khmerapi.lorndavid.online/v1/provinces)
* 🩺 **Live Health Check:** [https://khmerapi.lorndavid.online/health](https://khmerapi.lorndavid.online/health)
