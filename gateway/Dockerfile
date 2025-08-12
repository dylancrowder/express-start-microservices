# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json turbo.json tsconfig.base.json ./
COPY gateway/package*.json gateway/
COPY common/package*.json common/

RUN npm install && npm cache clean --force

COPY common ./common
COPY gateway ./gateway

RUN npx turbo run build --filter=gateway...

FROM node:20-alpine AS runner

WORKDIR /app

COPY gateway/package*.json ./

# Copiamos la carpeta common/dist con el código compilado común
COPY --from=builder /app/common/dist ./common/dist
# Copiamos el código compilado de gateway
COPY --from=builder /app/gateway/dist ./dist

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"

CMD ["node", "dist/server.js"]
