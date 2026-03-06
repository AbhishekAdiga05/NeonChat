# 📘 T3-Chat Daily Development Log

> A daily log to track important concepts and implementations for revision.

---

## 📅 Day 1 - March 4, 2026

### 🎯 Goals Achieved

- Project initialization and setup
- Database configuration with Docker & Prisma
- UI component library integration (shadcn/ui)

---

### 🔧 Project Setup

#### 1. **Next.js 16 with App Router**

- Using the latest Next.js 16.1.6 with App Router architecture
- File-based routing inside `/app` directory
- Server Components by default

```
app/
├── layout.js    → Root layout (wraps all pages)
├── page.js      → Home page component
└── globals.css  → Global styles
```

#### 2. **Google Fonts Integration**

```javascript
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
```

- **Concept:** `next/font` automatically optimizes fonts (self-hosting, zero layout shift)
- CSS variables (`--font-geist-sans`) are used for flexible styling

---

### 🐳 Docker + PostgreSQL Setup

#### 1. **Docker Compose Configuration**

```yaml
name: "t3-chat"
services:
  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: "postgres"
      POSTGRES_PASSWORD: "postgres"
      POSTGRES_DB: "postgres"
    ports:
      - "5431:5432" # Host:Container mapping
    restart: always
```

**Key Concepts:**

- `ports: "5431:5432"` → Access PostgreSQL on localhost:5431 (avoids conflict if 5432 is busy)
- `restart: always` → Container auto-restarts on failure
- Environment variables set the default database credentials

#### 2. **Dev Script Enhancement**

```json
"dev": "docker compose up -d && next dev"
```

- `-d` flag runs Docker in detached (background) mode
- Automatically starts DB before Next.js dev server

---

### 🔮 Prisma ORM Setup

#### 1. **Schema Configuration** (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client"
}

datasource db {
  provider = "postgresql"
}

model Test {
  id   Int    @id @default(autoincrement())
  name String
}
```

**Key Concepts:**

- `@id` → Marks primary key
- `@default(autoincrement())` → Auto-incrementing integer
- `SERIAL` in PostgreSQL = auto-incrementing integer

#### 2. **Database Client Singleton** (`lib/db.js`)

```javascript
import { PrismaClient } from "@prisma/client";

const db =
  globalThis.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn", "info"],
  });

if (process.env.NODE_ENV === "development") globalThis.prisma = db;

export default db;
```

**Why Singleton Pattern?**

- Next.js hot reloads in dev → creates new PrismaClient instances
- `globalThis.prisma` persists across reloads preventing "Too many connections" error
- Only needed in development mode

#### 3. **Migration Created**

```sql
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);
```

- Prisma migration transforms schema into raw SQL
- Located at: `prisma/migrations/20260304114547_init/`

---

### 🎨 shadcn/ui Integration

#### Components Installed:

| Component        | Purpose                            |
| ---------------- | ---------------------------------- |
| `button`         | Styled buttons with variants       |
| `tooltip`        | Hover tooltips                     |
| `sonner`         | Toast notifications                |
| `dialog`         | Modal dialogs                      |
| `form`           | Form handling with react-hook-form |
| `input`          | Styled input fields                |
| `card`           | Card containers                    |
| `sidebar`        | Navigation sidebar                 |
| `dropdown-menu`  | Dropdown menus                     |
| ... and 40+ more |

#### Global Providers Setup (`layout.js`)

```javascript
<TooltipProvider>{children}</TooltipProvider>
<Toaster />
```

- `TooltipProvider` → Required wrapper for all tooltips
- `Toaster` → Renders toast notifications anywhere in app

---

### 📦 Key Dependencies Installed

| Package           | Version | Purpose                |
| ----------------- | ------- | ---------------------- |
| `next`            | 16.1.6  | React framework        |
| `react`           | 19.2.3  | UI library             |
| `prisma`          | 7.4.2   | Database ORM           |
| `@prisma/client`  | 7.4.2   | Prisma JS client       |
| `tailwindcss`     | 4.x     | Utility CSS framework  |
| `radix-ui`        | 1.4.3   | Headless UI primitives |
| `react-hook-form` | 7.71.2  | Form handling          |
| `zod`             | 4.3.6   | Schema validation      |
| `sonner`          | 2.0.7   | Toast notifications    |
| `lucide-react`    | 0.577.0 | Icon library           |

---

### 📂 Project Structure Created

```
t3-chat/
├── app/                    # Next.js App Router
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   └── globals.css        # Global styles
├── components/ui/         # shadcn/ui components (40+)
├── hooks/                 # Custom React hooks
│   └── use-mobile.js      # Mobile detection hook
├── lib/                   # Utility functions
│   ├── db.js             # Prisma client singleton
│   └── utils.js          # Helper utilities (cn function)
├── prisma/               # Database schema & migrations
│   ├── schema.prisma     # Database models
│   └── migrations/       # Database migrations
├── docker-compose.yml    # Docker configuration
└── package.json          # Dependencies & scripts
```

---

### ✅ Commands Used Today

```bash
# Initialize project
npx create-next-app@latest t3-chat

# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma with PostgreSQL
npx prisma init --datasource-provider postgresql

# Create and run migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Install shadcn/ui
npx shadcn@latest init

# Add shadcn components
npx shadcn@latest add button tooltip sonner dialog form input card ...

# Start development server (with Docker)
npm run dev
```

---

### 💡 Key Learnings

1. **Prisma Singleton Pattern** - Essential for Next.js dev mode to prevent connection exhaustion
2. **Docker Compose** - Simplifies local database setup, portable across machines
3. **shadcn/ui** - Not a component library, but a collection of copy-paste components you own
4. **Port Mapping** - `5431:5432` allows using non-default port to avoid conflicts
5. **Next.js Font Optimization** - `next/font` handles font loading automatically

---

### 🔜 Next Steps (Day 2)

- [ ] Design database schema for chat application
- [ ] Implement user authentication
- [ ] Create chat UI components
- [ ] Set up real-time messaging

---
