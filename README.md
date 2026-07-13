# Next.js + Prisma + SQLite

Starter with Next.js (App Router), Prisma, and SQLite to spin up a modern TypeScript fullstack quickly.

## Stack

- Next.js App Router
- Prisma 7 with `@prisma/adapter-libsql` and `@libsql/client@0.8.1`
- SQLite local by default
- TypeScript and pnpm

## Requirements

- `DATABASE_URL` environment variable pointing to your SQLite DB. Example: `file:./prisma/dev.db`

## Getting started

1. Create env file: `cp .env.example .env` (or set `DATABASE_URL` manually)
2. Install deps: `pnpm install`
3. Generate Prisma client: `pnpm prisma:generate`
4. Apply initial migration: `pnpm prisma:migrate`
5. Seed sample data: `pnpm db:seed`
6. Run dev server: `pnpm dev` (http://localhost:3000)

## Useful scripts

- `pnpm dev`: development server
- `pnpm build` / `pnpm start`: production build and server
- `pnpm prisma:generate`: generate Prisma client
- `pnpm prisma:migrate`: run `prisma migrate dev`
- `pnpm prisma:studio`: open Prisma Studio
- `pnpm db:seed`: run `prisma/seed.ts`

## Reset local DB

If you want to start fresh:

```sh
rm -rf prisma/migrations prisma/dev.db
pnpm prisma:migrate dev --name init
pnpm db:seed
```

## Quick structure

- `app/`: routes and components (App Router)
- `lib/prisma.ts`: Prisma client init with libsql adapter
- `prisma/schema.prisma`: data model
- `prisma/seed.ts`: sample data for dev

For more console shortcuts see `commands.md`.
# shopping
# shopping
