FROM node:20-alpine AS builder

WORKDIR /app

# Copiar tsconfig.base.json primero para evitar errores
COPY tsconfig.base.json ./

COPY package*.json ./
COPY common/package*.json ./common/
COPY gateway/package*.json ./gateway/

RUN npm install

COPY common ./common
COPY gateway ./gateway

RUN cd gateway && npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
COPY common/package*.json ./common/
COPY gateway/package*.json ./gateway/

RUN npm install --omit=dev

COPY --from=builder /app/common/dist ./common/dist
COPY --from=builder /app/gateway/dist ./gateway/dist

CMD ["node", "gateway/dist/server.js"]
