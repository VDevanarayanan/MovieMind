# MovieMind AI

MovieMind AI is a full-stack movie recommendation platform that helps users track watched films, rate favorites, and receive personalized AI-powered suggestions.

## Features

- User signup, login, and JWT-authenticated sessions
- Search TMDB movie catalog, trending and popular films
- Mark movies as watched and rate them
- Dynamic user dashboard with statistics
- AI recommendation engine powered by Gemini
- PostgreSQL + Prisma backend
- React + TypeScript + Vite frontend
- Docker-ready deployment

## Project Structure

- `backend/` - Express API with Prisma and AI recommendation logic
- `frontend/` - Vite React app with Tailwind CSS

## Getting Started

1. Copy environment files:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Start Postgres locally or use Docker:

```bash
docker-compose up -d
```

3. Install dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

4. Run Prisma migrations and seed data:

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

5. Start the application:

```bash
cd backend && npm run dev
cd ../frontend && npm run dev
```

## Docker

```bash
docker-compose up --build
```

## Environment Variables

See `.env.example` and each package's `.env.example` for required values.
# MovieMind
