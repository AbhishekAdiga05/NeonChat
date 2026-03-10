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

- [x] Implement user authentication (Better Auth + GitHub OAuth)
- [ ] Create chat UI components
- [ ] Set up real-time messaging

---

## 📅 Day 2 - March 6, 2026

### 🎯 Goals Achieved

- Authentication system setup with Better Auth
- Prisma 7 driver adapter migration
- Better Auth schema generation (User, Session, Account, Verification models)
- GitHub OAuth social provider configuration

---

### 🔐 Better Auth Integration

#### 1. **What is Better Auth?**

- A modern, framework-agnostic authentication library for TypeScript/JavaScript
- Supports social logins (GitHub, Google, etc.), email/password, and more
- Works with any database via adapters (Prisma, Drizzle, etc.)
- Installed: `better-auth@1.5.4`

#### 2. **Auth Configuration** (`lib/auth.js`)

```javascript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
});
```

**Key Concepts:**

- `prismaAdapter(db, { provider })` → Bridges Better Auth with Prisma ORM
- `socialProviders.github` → Enables "Login with GitHub" via OAuth
- Requires `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` env variables
- `BETTER_AUTH_URL` env variable needed for callbacks/redirects (e.g., `http://localhost:3000`)

---

### 🔄 Prisma 7 Driver Adapter Migration

#### 1. **The Problem**

Prisma 7 removed the built-in binary/library query engine. It now uses a **client engine** that requires a **driver adapter** for direct database connections.

**Error encountered:**

```
PrismaClientConstructorValidationError: Using engine type "client"
requires either "adapter" or "accelerateUrl" to be provided
```

#### 2. **The Solution — `@prisma/adapter-pg`**

```bash
npm install @prisma/adapter-pg pg
```

#### 3. **Updated Database Client** (`lib/db.js`)

```javascript
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db =
  globalThis.prisma ||
  new PrismaClient({
    adapter,
    log: ["query", "error", "warn", "info"],
  });
if (process.env.NODE_ENV === "development") globalThis.prisma = db;

export default db;
```

**Key Concepts:**

- `PrismaPg` → PostgreSQL driver adapter that connects Prisma to the `pg` (node-postgres) driver
- `connectionString` → Uses `DATABASE_URL` from `.env`
- The adapter is passed to `PrismaClient` constructor — replaces the old built-in engine
- Singleton pattern still applies for dev mode

#### 4. **Generator Change: `prisma-client` vs `prisma-client-js`**

| Generator          | Output                     | Import From           | Notes                                      |
| ------------------ | -------------------------- | --------------------- | ------------------------------------------ |
| `prisma-client`    | TypeScript files           | `../generated/prisma` | New Prisma 7 default, requires output path |
| `prisma-client-js` | JavaScript in node_modules | `@prisma/client`      | Classic generator, broader compatibility   |

**We use `prisma-client-js`** because Better Auth CLI (`npx auth@latest generate`) uses `jiti` (a CJS/ESM loader) that can't resolve the new TypeScript-only `prisma-client` output.

```prisma
generator client {
  provider = "prisma-client-js"   // ← Classic generator for compatibility
}
```

---

### 🗃️ Better Auth Schema Models

Running `npx auth@latest generate` auto-generated these 4 models:

#### 1. **User Model**

```prisma
model User {
  id            String    @id
  name          String
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}
```

**Concepts:**

- `String @id` → UUID-based primary key (not auto-increment like Test model)
- `@@unique([email])` → Ensures no duplicate emails at DB level
- `@@map("user")` → Maps model name `User` to table name `user` in PostgreSQL
- `sessions` & `accounts` → One-to-many relations

#### 2. **Session Model**

```prisma
model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId])
  @@map("session")
}
```

**Concepts:**

- Tracks active login sessions per user
- `token` → Unique session token for cookie-based auth
- `ipAddress`, `userAgent` → Optional security tracking fields
- `onDelete: Cascade` → Deleting a user deletes all their sessions
- `@@index([userId])` → DB index for fast session lookups by user

#### 3. **Account Model**

```prisma
model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User     @relation(...)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@map("account")
}
```

**Concepts:**

- Links users to OAuth providers (GitHub, Google, etc.)
- `providerId` → Which provider (e.g., `"github"`)
- `accountId` → User's ID on that provider
- `accessToken/refreshToken` → OAuth tokens for API access
- `password` → Used for email/password auth (nullable for OAuth-only users)
- One user can have multiple accounts (GitHub + Google, etc.)

#### 4. **Verification Model**

```prisma
model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verification")
}
```

**Concepts:**

- Stores email verification tokens, password reset tokens, etc.
- `identifier` → What's being verified (e.g., email address)
- `value` → The verification token/code
- `expiresAt` → Tokens expire for security
- Indexed by `identifier` for fast lookups

---

### 📦 New Dependencies Added

| Package              | Version | Purpose                                     |
| -------------------- | ------- | ------------------------------------------- |
| `better-auth`        | 1.5.4   | Authentication library                      |
| `@prisma/adapter-pg` | 7.4.2   | PostgreSQL driver adapter for Prisma 7      |
| `pg`                 | 8.20.0  | Node.js PostgreSQL client (used by adapter) |

---

### 🌍 Environment Variables Needed

```env
# Database (already set from Day 1)
DATABASE_URL="postgresql://postgres:postgres@localhost:5431/postgres"

# Better Auth
BETTER_AUTH_URL="http://localhost:3000"

# GitHub OAuth (create at https://github.com/settings/developers)
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
```

---

### ✅ Commands Used Today

```bash
# Install Better Auth
npm install better-auth

# Install Prisma 7 driver adapter + pg driver
npm install @prisma/adapter-pg pg

# Generate Prisma Client (with classic generator)
npx prisma generate

# Generate Better Auth schema models into prisma/schema.prisma
npx auth@latest generate --output prisma/schema.prisma --yes
```

---

### 🐛 Issues Encountered & Fixed

#### Issue 1: `Cannot find module '.prisma/client/default'`

- **Cause:** Prisma client wasn't generated yet
- **Fix:** Run `npx prisma generate`

#### Issue 2: `An output path is required for the prisma-client generator`

- **Cause:** Prisma 7's new `prisma-client` generator requires an explicit `output` path
- **Fix:** Switched to `prisma-client-js` generator for backward compatibility

#### Issue 3: `Using engine type "client" requires either "adapter" or "accelerateUrl"`

- **Cause:** Prisma 7 doesn't ship a built-in query engine anymore
- **Fix:** Installed `@prisma/adapter-pg` + `pg` and passed adapter to `PrismaClient`

#### Issue 4: Better Auth CLI couldn't resolve `../generated/prisma`

- **Cause:** `jiti` loader used by `npx auth@latest` can't handle TypeScript-only Prisma output
- **Fix:** Used `prisma-client-js` generator which outputs to `node_modules/@prisma/client`

---

### 💡 Key Learnings

1. **Prisma 7 Breaking Change** — No more built-in query engine; must use driver adapters (`@prisma/adapter-pg`, `@prisma/adapter-mysql`, etc.)
2. **Driver Adapters** — Bridge between Prisma and the actual database driver (`pg`, `mysql2`, etc.), giving you more control over the connection
3. **`prisma-client-js` vs `prisma-client`** — Use `prisma-client-js` when tools like Better Auth CLI need CJS-compatible imports from `@prisma/client`
4. **Better Auth Schema Generation** — `npx auth@latest generate` introspects your auth config and auto-creates the required Prisma models
5. **OAuth Flow** — User → GitHub login → GitHub redirects back with code → Better Auth exchanges code for tokens → Creates Session + Account records
6. **`@@map("tableName")`** — Keeps Prisma model names PascalCase while using lowercase table names in PostgreSQL (convention)
7. **`@@index` vs `@@unique`** — Index speeds up queries; unique index also enforces no duplicates

---

### 🔜 Next Steps (Day 3)

- [ ] Run migration to apply auth schema (`npx prisma migrate dev`)
- [ ] Set up GitHub OAuth app (get client ID & secret)
- [ ] Create auth API route handler (`app/api/auth/[...all]/route.js`)
- [ ] Create auth client for frontend (`lib/auth-client.js`)
- [ ] Build login/signup UI components
- [ ] Set up real-time messaging

---
