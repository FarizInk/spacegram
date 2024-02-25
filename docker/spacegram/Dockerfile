FROM imbios/bun-node:latest-current-slim
WORKDIR /app

LABEL maintainer="Fariz <me@fariz.dev>"

COPY package.json bun.lockb tsconfig.json svelte.config.js vite.config.ts tailwind.config.js postcss.config.js .env /app/
COPY src /app/src
COPY prisma /app/prisma

RUN bun install
RUN bunx prisma generate
RUN bun run build

ENV NODE_ENV production

RUN chown -R bun /app/node_modules

USER bun