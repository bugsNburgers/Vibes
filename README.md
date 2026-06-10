# Vibes

The personal, personality-driven counterpart to Suprateeky Yawagal's main portfolio. Hardcoded dark mode, brutalist-inspired UI design system, database-driven list of anime, live-updating top tracks via Spotify, and a community pet gallery.

## Repository Structure

This repository is set up as a monorepo containing both the frontend and backend applications:

```
bugsNburgers/Vibes (repo root)
├── package.json      ← Monorepo & Frontend scripts
├── next.config.ts    ← Next.js configuration
├── src/              ← Frontend application source (Next.js 14 App Router)
└── vibes-backend/    ← Backend application source
    ├── package.json  ← Backend scripts
    ├── Dockerfile    ← Production Docker deployment configuration
    └── src/          ← Backend server source (Express + TypeScript + Drizzle)
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Vanilla CSS Modules (Brutalist aesthetic inspired by devloggs)
- **Animations**: Framer Motion
- **Language**: TypeScript

### Backend & Infrastructure
- **Server**: Express + TypeScript
- **Database**: Neon (Serverless Postgres) with Drizzle ORM
- **Caches/Rate Limiting**: Upstash Redis
- **Media Hosting**: Cloudinary (pet uploads)
- **API integrations**: Spotify Web API (Top Tracks), Jikan (MyAnimeList / Anime Search)

## Running Locally

### 1. Prerequisites
- Node.js (v20+)
- Postgres / Neon DB
- Upstash Redis
- Spotify Developer Client ID, Client Secret, and Refresh Token
- Cloudinary Account Cloud Name, API Key, and Secret

### 2. Configure Environment Variables

Create `.env` in the root of the repository (for frontend) and inside the `vibes-backend` folder (for backend) using the respective `.env.example` templates.

### 3. Install Dependencies
Run from the repository root:
```bash
# Install root & frontend dependencies
npm install --legacy-peer-deps

# Install backend dependencies
cd vibes-backend
npm install
cd ..
```

### 4. Running the Project
You can run both frontend and backend commands directly from the root of the repository using our configured monorepo scripts:

```bash
# Start Next.js frontend in development mode (port 3000)
npm run dev

# Start Express backend in watch/development mode (port 8080)
npm run dev:backend
```

### 5. Backend Database Scripts
```bash
# Push schema changes to Neon Database
npm run db:push

# Seed initial pets data to DB
npm run seed:pets
```
