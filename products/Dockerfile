# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json turbo.json tsconfig.base.json ./
COPY products/package*.json products/
COPY common/package*.json common/

RUN npm install && npm cache clean --force

COPY common ./common
COPY products ./products

RUN npx turbo run build --filter=products...

FROM node:20-alpine AS runner

WORKDIR /app

COPY products/package*.json ./

# Copiamos la carpeta common/dist con el código compilado común
COPY --from=builder /app/common/dist ./common/dist
# Copiamos el código compilado de products
COPY --from=builder /app/products/dist ./dist

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"

CMD ["node", "dist/server.js"]
