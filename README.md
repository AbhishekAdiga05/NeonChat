# NeonChat

> AI-powered chat application with multi-model support, real-time streaming, and persistent conversation history.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-black?style=flat-square&logo=typescript)](https://typescriptlang.org/)

---

## Features

- **Multi-Model AI** — Switch between 100+ AI models via OpenRouter, including free models
- **Real-time Streaming** — Token-by-token response streaming using Server-Sent Events (SSE)
- **Persistent Chats** — All conversations saved to PostgreSQL with full history
- **Model Selection** — Choose specific AI models per chat or use auto-selection
- **Web Search** — Optional web search integration for enhanced responses
- **GitHub OAuth** — Secure authentication with existing GitHub accounts

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Chat UI     │  │  Model       │  │  Sidebar      │  │
│  │  Components  │  │  Selector    │  │  Navigation  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────────────────────────���────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     Next.js API                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  /api/chat   │  │  /api/ai/    │  │  /api/auth   │  │
│  │  (streaming) │  │  get-models  │  │  (OAuth)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    External APIs                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  OpenRouter  │  │  Better-Auth │  │  PostgreSQL  │  │
│  │  (AI Models) │  │  (OAuth)     │  │  (Database)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Data Model

```
User
├── sessions (auth sessions)
├── accounts (OAuth providers)
└── chats
    └── messages (conversation history)
```

### Database Tables

| Table | Description |
|-------|-------------|
| `User` | Authenticated users with email, name, avatar |
| `Session` | Active user sessions with expiry |
| `Account` | OAuth provider accounts (GitHub) |
| `Verification` | Email verification tokens |
| `Chat` | Chat threads with title and model selection |
| `Message` | Individual messages (user/assistant) with content |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Stream AI responses with SSE |
| `/api/ai/get-models` | GET | Fetch available OpenRouter models |
| `/api/auth/[...all]` | * | Better-Auth OAuth handlers |

### Chat Streaming Flow

1. Client sends messages + model selection to `/api/chat`
2. Server authenticates user via session
3. Messages converted to OpenRouter format (last 20 kept for context)
4. AI response streamed back via SSE
5. Messages auto-saved to database on completion

---

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/AbhishekAdiga05/NeonChat.git
cd NeonChat
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/neonchat"

# OpenRouter (https://openrouter.ai/keys)
OPENROUTER_API_KEY="sk-or-v1-..."

# Auth (generate: openssl rand -base64 32)
BETTER_AUTH_SECRET="your-32-char-secret"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub OAuth (https://github.com/settings/applications)
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"
```

### 3. Initialize Database

```bash
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

---

## Project Structure

```
app/
├── (auth)/                    # Auth pages
│   └── sign-in/              # Sign-in page
├── (root)/                    # Main app pages
│   ├── chat/[chatId]/        # Individual chat view
│   └── page.jsx             # Home/chat list
├── api/                      # API routes
│   ├── auth/[...all]/        # Better-Auth handlers
│   ├── chat/                # Chat streaming endpoint
│   └── ai/get-models/        # Model listing
├── modules/                  # Feature modules
│   ├── authentication/       # Auth actions & components
│   └── chat/                # Chat components & hooks
│       ├── actions/         # Server actions (CRUD)
│       ├── components/      # UI components
│       ├── hooks/           # Client hooks
│       └── store/           # Zustand store
└── globals.css              # Tailwind styles

components/ui/               # Shadcn-style primitives
lib/
├── auth.js                  # Better-Auth server config
├── auth-client.js           # Better-Auth client config
├── db.js                    # Prisma client
├── ai-models.js             # Model definitions
└── prompt.js               # System prompts

prisma/
├── schema.prisma           # Database schema
└── migrations/             # Migration history
```

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `ai` | Streaming responses & message handling |
| `@openrouter/ai-sdk-provider` | OpenRouter integration |
| `better-auth` | Authentication & OAuth |
| `@prisma/client` | Database ORM |
| `zustand` | Client state management |
| `shadcn-ui` | UI component library |
| `tailwindcss` | Styling |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |

---

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

### Netlify

Set build command: `npx prisma generate && next build`  
Set output directory: `.next`

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `OPENROUTER_API_KEY` | Yes | OpenRouter API key |
| `BETTER_AUTH_SECRET` | Yes | Random string for session encryption |
| `BETTER_AUTH_URL` | Yes | App URL (https://yourdomain.com) |
| `GITHUB_CLIENT_ID` | Yes | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth App client secret |

---

## License

[MIT](./LICENSE)