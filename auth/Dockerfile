FROM node:20-alpine AS builder

WORKDIR /app

# Copiar tsconfig.base.json primero para evitar errores
COPY tsconfig.base.json ./

COPY package*.json ./
COPY common/package*.json ./common/
COPY auth/package*.json ./auth/

RUN npm install

COPY common ./common
COPY auth ./auth

RUN cd auth && npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
COPY common/package*.json ./common/
COPY auth/package*.json ./auth/

RUN npm install --omit=dev

COPY --from=builder /app/common/dist ./common/dist
COPY --from=builder /app/auth/dist ./auth/dist

CMD ["node", "auth/dist/server.js"]
