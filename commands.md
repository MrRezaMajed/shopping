# Quick commands

# adjust DATABASE_URL if needed

```sh
cp .env.example .env
```

## Start the project

```sh
pnpm install
pnpm prisma:generate
pnpm prisma:migrate    # apply initial migration
pnpm db:seed           # seed sample data
pnpm dev               # http://localhost:3000
```

## Prisma

```sh
pnpm prisma:studio     # DB UI
pnpm prisma:generate   # regenerate client if schema changes
pnpm prisma:migrate    # create/apply dev migrations
```

## Clean local env (useful to start from scratch)

```sh
rm -rf node_modules .next
rm -rf prisma/migrations prisma/dev.db
```
