# 🪵 Shaadwood Furniture — E-Commerce & Admin Platform

> **Full-Stack Luxury Furniture Store & Admin Dashboard** featuring WooCommerce-style variable products, attribute swatches, media library asset management, and modular NestJS REST architecture.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Key Highlights |
| :--- | :--- | :--- |
| **Backend API** | **NestJS 10 + TypeScript** | Modular Clean Architecture, Swagger OpenAPI, JWT Auth, Multer File Uploads |
| **Database & ORM** | **PostgreSQL 16 + Prisma ORM 5** | Relational schemas for variable products, attributes, swatches, categories, and media |
| **Frontend Admin** | **Next.js 14 (App Router) + React 18** | Tailwind CSS, Radix UI Primitives, TanStack React Query v5, Sonner Toasts |
| **Containers** | **Docker & Docker Compose** | Isolated PostgreSQL 16 Alpine + pgAdmin 4 Web GUI |
| **Package Manager** | **pnpm Workspaces** | Fast, disk-efficient dependency resolution across root and frontend |

---

## 📋 Prerequisites

Before running the project, make sure you have the following installed on your machine:

- **Node.js**: `v18.x` or `v20.x` (LTS recommended) — [Download](https://nodejs.org/)
- **pnpm**: `v8.x` or `v9.x` — Install globally via:
  ```bash
  npm install -g pnpm
  ```
- **Docker & Docker Desktop**: For running PostgreSQL and pgAdmin — [Download Docker](https://www.docker.com/products/docker-desktop/)
  *(Alternatively, you can connect to any existing PostgreSQL instance by setting `DATABASE_URL` in `.env`)*

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

From the project root, install all workspace packages:

```bash
pnpm install
```

---

### Step 2: Configure Environment Variables

Create your local `.env` file from the provided template:

**On Linux / macOS / Git Bash:**
```bash
cp .env.example .env
```

**On Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**On Windows (Command Prompt):**
```cmd
copy .env.example .env
```

> **Note:** The default `.env` is already configured to work seamlessly with the included Docker PostgreSQL container:
> ```env
> PORT=3000
> API_PREFIX=api/v1
> CORS_ORIGIN=http://localhost:3000,http://localhost:3001
> DATABASE_URL="postgresql://shaadwood_user:shaadwood_password@localhost:5432/shaadwood_db?schema=public"
> JWT_SECRET="replace_with_a_secure_random_key"
> JWT_EXPIRES_IN="7d"
> UPLOAD_DIR="./uploads"
> MAX_FILE_SIZE_MB=5
> ```

---

### Step 3: Start the PostgreSQL Database

Launch the PostgreSQL and pgAdmin containers in the background:

```bash
pnpm docker:up
```
*(Or manually: `docker compose up -d`)*

Verify the container is healthy:
```bash
docker ps
```

---

### Step 4: Initialize and Seed the Database

Generate the Prisma Client, push schema tables to PostgreSQL, and seed initial luxury furniture products, wood finish swatches, categories, and media assets:

```bash
pnpm db:setup
```

*(This runs: `pnpm prisma:generate && pnpm prisma:push && pnpm prisma:seed`)*

---

### Step 5: Start the Backend API (NestJS)

Run the NestJS server in hot-reload development mode:

```bash
pnpm dev:backend
```
*(Or: `pnpm start:dev`)*

- **Backend API**: `http://localhost:3000/api/v1`
- **Swagger Interactive API Documentation**: `http://localhost:3000/api/docs`

---

### Step 6: Start the Frontend Admin Dashboard (Next.js)

In a separate terminal window, launch the Next.js admin frontend:

```bash
pnpm dev:frontend
```
*(Or: `pnpm --dir frontend dev`)*

- **Admin Dashboard**: `http://localhost:3001`
- **Admin Login Portal**: `http://localhost:3001/login`

---

## 🔑 Default Credentials

### 1. Admin Dashboard Portal (`http://localhost:3001/login`)
| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@shaadwood.com` | `Admin@123456` |
| **Customer (Demo)** | `customer@shaadwood.com` | `Customer@123456` |

> 💡 *The login page includes a **"Quick Fill Demo Credentials"** button for instant one-click access.*

### 2. pgAdmin 4 Web GUI (`http://localhost:5050`)
| Property | Value |
| :--- | :--- |
| **Email** | `admin@shaadwood.com` |
| **Password** | `admin` |
| **Database Host** | `postgres` *(inside Docker)* or `localhost` *(from host)* |
| **Port** | `5432` |
| **Database** | `shaadwood_db` |
| **Username** | `shaadwood_user` |
| **Password** | `shaadwood_password` |

---

## 🌐 Application Sitemap & Key URLs

| Service / Page | URL | Purpose |
| :--- | :--- | :--- |
| **Admin Overview** | `http://localhost:3001/` | KPI metrics, stock alerts, sales analytics |
| **Products List** | `http://localhost:3001/products` | Tabular & mobile card views, media counts, filters |
| **Product Detail & Variations** | `http://localhost:3001/products/:id` | Specs, variable attributes matrix, image gallery |
| **Add New Product** | `http://localhost:3001/products/new` | Multi-step creation with Media Library integration |
| **Attributes & Swatches** | `http://localhost:3001/attributes` | Wood finishes, fabrics, joinery types, color swatches |
| **Product Categories** | `http://localhost:3001/categories` | Hierarchical furniture category tree management |
| **Media Library** | `http://localhost:3001/media` | Upload, inspect, edit alt text, copy CDN/local URLs |
| **Customer Users** | `http://localhost:3001/users` | User accounts, shipping addresses, roles |
| **Blog Articles** | `http://localhost:3001/blog` | Editorial and care guide CMS |
| **Swagger OpenAPI Docs** | `http://localhost:3000/api/docs` | Interactive REST endpoint explorer and tester |
| **Prisma Studio** | `http://localhost:5555` | Visual database browser (`pnpm prisma:studio`) |

---

## 📂 Project Structure

```
shaadwood/
├── docker-compose.yml       # PostgreSQL 16 & pgAdmin 4 configuration
├── package.json             # Root scripts & backend dependencies
├── pnpm-workspace.yaml      # Monorepo workspace configuration
├── .env.example             # Environment variables template
├── prisma/
│   ├── schema.prisma        # Database schema (Products, Variants, Media, etc.)
│   └── seed.ts              # Database seeder with realistic furniture catalog
├── src/                     # NestJS Backend API
│   ├── main.ts              # App entry point, validation pipes, Swagger setup
│   ├── app.module.ts        # Root NestJS module
│   ├── common/              # Decorators, filters, interceptors
│   ├── config/              # Configuration module
│   ├── database/            # PrismaService database abstraction
│   └── modules/
│       ├── auth/            # JWT authentication, guards, strategies
│       ├── products/        # Products & WooCommerce-like variations CRUD
│       ├── attributes/      # Global attributes & term values (swatches)
│       ├── categories/      # Furniture categories hierarchy
│       ├── upload/          # Media upload, disk storage, catalog stats
│       ├── users/           # User management & addresses
│       └── blog/            # Blog posts & categories
├── frontend/                # Next.js 14 Admin Application
│   ├── package.json         # Frontend dependencies & Next.js scripts
│   ├── tailwind.config.js   # Custom warm wood palette & styling tokens
│   └── src/
│       ├── app/             # App Router pages ((admin), login, etc.)
│       │   ├── (admin)/     # Protected admin dashboard layout
│       │   │   ├── page.tsx          # Dashboard overview
│       │   │   ├── products/         # Product list, [id] details, new
│       │   │   ├── attributes/       # Attribute & swatch manager
│       │   │   ├── categories/       # Category manager
│       │   │   ├── media/            # Media library & upload view
│       │   │   └── ...
│       │   └── login/       # Administrative login portal
│       ├── components/      # UI components (Header, Sidebar, MediaPicker, etc.)
│       ├── lib/             # API client with auto-recovery, utils
│       └── types/           # TypeScript domain definitions
└── uploads/                 # Storage folder for uploaded images
```

---

## 🛠️ Handy CLI Scripts Cheatsheet

| Command | Action |
| :--- | :--- |
| `pnpm dev:backend` | Start NestJS backend with live watch on port `3000` |
| `pnpm dev:frontend` | Start Next.js admin frontend on port `3001` |
| `pnpm docker:up` | Launch PostgreSQL & pgAdmin in Docker containers |
| `pnpm docker:down` | Stop Docker containers |
| `pnpm db:setup` | Generate Prisma client, push schema, and seed data |
| `pnpm prisma:generate` | Re-generate Prisma TypeScript client |
| `pnpm prisma:push` | Sync Prisma schema changes directly to PostgreSQL |
| `pnpm prisma:migrate` | Create a new formal Prisma SQL migration |
| `pnpm prisma:seed` | Re-run database seeder script |
| `pnpm prisma:studio` | Launch visual browser for PostgreSQL tables on `5555` |
| `pnpm build` | Compile NestJS backend to `dist/` |
| `pnpm build:frontend` | Compile Next.js production build |

---

## 💡 Troubleshooting & FAQ

<details>
<summary><b>Q: I get "User account is disabled or does not exist" on upload or API calls.</b></summary>

**Cause**: When the database is re-seeded, user UUIDs are regenerated. If your browser still holds an older cached JWT token in `localStorage`, the user ID in the token won't match the new database.

**Fix**: The API client includes self-healing auto-recovery that automatically clears invalid tokens and fetches a fresh token. Alternatively, click **Sign Out** in the top header or visit `http://localhost:3001/login` and log in again.
</details>

<details>
<summary><b>Q: Database connection error (ECONNREFUSED 127.0.0.1:5432).</b></summary>

**Cause**: PostgreSQL is not currently running.

**Fix**: Run `pnpm docker:up` (or `docker compose up -d`) and ensure Docker Desktop is running. Verify with `docker ps`.
</details>

<details>
<summary><b>Q: Port already in use (EADDRINUSE 3000 / 3001 / 5432).</b></summary>

**Fix**: Ensure no previous instances of NestJS, Next.js, or local PostgreSQL are occupying those ports. You can inspect or terminate lingering processes via Task Manager or PowerShell:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```
</details>
