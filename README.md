# 🌌 NeonChat

<p align="center">
  <img src="./public/logo.svg" alt="NeonChat Logo" width="120" height="120" />
</p>

<h3 align="center">NeonChat</h3>

<p align="center">
  A state-of-the-art AI Chat interface built for speed, aesthetics, and intelligence.
</p>

<p align="center">
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
</p>

---

## 📖 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Getting Started](#️-getting-started)
- [🔑 Environment Variables](#-environment-variables)
- [🚀 Deployment](#-deployment)
- [📜 Scripts](#-scripts)
- [🔮 Roadmap](#-roadmap)

---

## ✨ Key Features

* 🧠 **Multi-Model Intelligence:** Switch between leading AI models seamlessly, powered by **Vercel AI SDK 6.x** via **OpenRouter**.
* ⚡ **Ultra-Fast Streaming:** Real-time, token-by-token text generation leveraging HTTP Server-Sent Events (SSE).
* 🔐 **Secure Authentication:** Robust user session management with **Better-Auth** and GitHub OAuth out of the box.
* 🗄️ **Persistent Context:** Auto-saving conversation trees mapped efficiently via **Prisma 7** into **PostgreSQL**.
* 🎨 **Premium Glassmorphism UI:** Advanced, highly responsive dark theme designed with micro-interactions.

---

## 🛠️ Tech Stack

### Frontend & Core
* **Framework:** Next.js 16 (App Router)
* **View Library:** React 19
* **State Management:** Zustand & TanStack React Query

### Backend & Database
* **Database Client:** Prisma ORM v7
* **Data Layer:** PostgreSQL (Compatible with Neon, Supabase, etc.)
* **Auth Layer:** Better-Auth

### AI Implementation
* **AI Orchestration:** Vercel AI SDK Core & React Hooks
* **API Providers:** OpenRouter Unified Endpoint

---

## 📁 Project Structure

```bash
├── app/                  # Next.js App Router
│   ├── (auth)/          # Authentication pages (Login, Setup)
│   ├── (root)/          # Main chat dashboards and layouts
│   ├── api/             # Secure Route Handlers for AI & Auth
│   └── modules/         # Modular feature components (Chat, AI Agent)
├── components/          
│   ├── ui/              # Base Shadcn-style primitives
│   └── ai-elements/     # Specialized AI UI responses
├── lib/                 # Singletons, DB instances, and helpers
├── prisma/              # Database Schemas & Migrations
└── hooks/               # Custom React hooks (Mobile views, etc.)
```

---

## ⚙️ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/AbhishekAdiga05/NeonChat.git
cd NeonChat
npm install
```

### 2. Configure Environment
Create a `.env` file in the root:

```env
# Database Access
DATABASE_URL="postgresql://user:pass@host:port/db"

# LLM Gateway
OPENROUTER_API_KEY="sk-or-v1-..."

# Auth Settings
BETTER_AUTH_SECRET="your-32-char-random-string"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub OAuth App
GITHUB_CLIENT_ID="your-id"
GITHUB_CLIENT_SECRET="your-secret"
```

### 3. Initialize Database
```bash
npx prisma db push
```

---

## 🚀 Deployment

### Vercel
Standard zero-config setup. Ensure all Environment Variables are added to the settings dashboard.

### Netlify
To trigger full Prisma generation before server compilation:
1. Set the **Build Command** to: `npx prisma generate && next build`
2. Set the **Publish Directory** to: `.next`

---

## 📜 Scripts

* `npm run dev` - Fire up the local development environment.
* `npm run build` - Compile optimized Next.js assets.
* `npm run lint` - Run automated ESLint checks.

---

## 🔮 Roadmap

- [ ] 🎙️ **Speech-to-Text Integration** (Whisper API) for hands-free queries.
- [ ] 🤖 **Custom AI Personas** allowing tailored responses based on custom system prompts.
- [ ] 📊 **Usage Analytics Dashboard** to track AI spending and token efficiency.

> [!TIP]
> Ensure your PostgreSQL instance has adequate pooling enabled (like Prisma Accelerate) if scaling for production loads.
