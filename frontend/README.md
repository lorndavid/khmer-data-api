# 🇰🇭 KhmerAPI — Developer Platform Frontend

**KhmerAPI Developer Portal and Documentation Frontend** built with Vue 3, TypeScript, Vite, Tailwind CSS, Pinia, and Lucide icons.

> **Design Philosophy**: Minimal, White-First, JetBrains Mono Code, Khmer & English Typography, Fast, Accessible, Vercel & Stripe-grade developer usability.

---

## 🛠️ Technology Stack

- **Framework**: Vue 3 (Composition API, `<script setup>`)
- **Language**: TypeScript with strict typing
- **Styling**: Tailwind CSS (White-first palette `#FFFFFF` / `#FAFAFA` / `#09090B`)
- **State Management**: Pinia
- **Router**: Vue Router 4 (Dynamic title, auth guards, smooth scroll)
- **HTTP Client**: Axios with JWT Bearer token & refresh interceptor
- **Icons**: Lucide Vue Next
- **Code & Syntax**: JetBrains Mono & Prism.js syntax highlighter
- **Typography**: Inter (UI), Kantumruy Pro / Khmer OS Battambang (Khmer text), JetBrains Mono (Code)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration:
```env
VITE_API_BASE_URL=/api/v1
VITE_APP_TITLE=KhmerAPI
VITE_DOCS_URL=/docs
```

### 3. Development Server
Start the local Vite dev server with proxy to backend (`http://localhost:4000`):
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 4. Production Build
Compile and bundle the production assets:
```bash
npm run build
npm run preview
```

---

## 🧭 Application Routes

| Path | View / Component | Description |
| :--- | :--- | :--- |
| `/` | [`HomeView.vue`](file:///d:/Developer%20Project/frontend/src/views/HomeView.vue) | Landing page with live status pill, code playground, and feature highlights |
| `/apis` | [`ApisView.vue`](file:///d:/Developer%20Project/frontend/src/views/ApisView.vue) | API Catalog with endpoint counts, methods, and status tags |
| `/docs` | [`DocsView.vue`](file:///d:/Developer%20Project/frontend/src/views/DocsView.vue) | 3-column documentation portal with interactive request/response tabs |
| `/explorer` | [`ExplorerView.vue`](file:///d:/Developer%20Project/frontend/src/views/ExplorerView.vue) | Interactive API Explorer to test live requests with custom parameters & headers |
| `/status` | [`StatusView.vue`](file:///d:/Developer%20Project/frontend/src/views/StatusView.vue) | Real-time system health, database & Redis probes, latency, and 90-day uptime |
| `/login` | [`LoginView.vue`](file:///d:/Developer%20Project/frontend/src/views/LoginView.vue) | Developer sign-in |
| `/register` | [`RegisterView.vue`](file:///d:/Developer%20Project/frontend/src/views/RegisterView.vue) | Developer registration & instant API key provisioning |
| `/dashboard` | [`DashboardView.vue`](file:///d:/Developer%20Project/frontend/src/views/DashboardView.vue) | Developer portal: Overview, API Keys, Usage & Telemetry, Account |

---

## ⌨️ Universal Keyboard Shortcuts

- **`⌘K` / `Ctrl+K` / `/`**: Opens the universal Command Palette to search across documentation, APIs, and live Cambodia public data.
- **`ESC`**: Closes the search modal or key creation modal.

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/                  # Axios API services (provinces, search, auth, api-keys, status)
│   ├── components/
│   │   ├── common/           # Reusable UI (CodeBlock, JsonViewer, StatusBadge, MethodBadge, Skeleton)
│   │   ├── docs/             # Documentation components (DocsSidebar, DocsToc, EndpointDoc)
│   │   ├── explorer/         # ApiExplorer interactive playground
│   │   └── layout/           # Navbar, Footer, SearchModal Command Palette
│   ├── router/               # Vue Router with navigation guards and SEO meta titles
│   ├── stores/               # Pinia stores (auth, search, status)
│   ├── types/                # TypeScript interfaces (API, Location, User, Auth)
│   ├── views/                # Route views (Home, Apis, Docs, Explorer, Status, Dashboard, Login, Register)
│   ├── App.vue               # Root application shell
│   ├── main.ts               # App bootstrapping
│   └── style.css             # Tailwind base & custom syntax highlighter styling
├── index.html                # HTML5 entry with meta, OpenGraph, and Google Fonts
├── vite.config.ts            # Vite config with backend proxy and @ alias
├── tailwind.config.js        # Minimalist white-first color palette
├── tsconfig.json             # TypeScript project config
└── package.json
```
