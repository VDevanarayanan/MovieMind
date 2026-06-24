# MovieMind Backend

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env` from `.env.example` and provide values.

3. Run Prisma migration:

```bash
npx prisma migrate dev --name init
```

4. Seed sample user:

```bash
npx prisma db seed
```

5. Start the backend:

```bash
npm run dev
```
# MovieMind
