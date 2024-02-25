FROM imbios/bun-node:18-slim AS base
LABEL maintainer="Fariz <me@fariz.dev>"

WORKDIR /app

COPY package.json bun.lockb tsconfig.json svelte.config.js vite.config.ts tailwind.config.js postcss.config.js .env /app/
COPY src /app/src
COPY prisma /app/prisma

RUN bun install
RUN bunx prisma generate
RUN bun run build

ENV NODE_ENV production