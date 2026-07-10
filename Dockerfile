FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm config set fetch-timeout 600000
RUN  pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]