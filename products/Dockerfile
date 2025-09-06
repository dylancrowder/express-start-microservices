FROM node:20-alpine AS builder

WORKDIR /app

# Copiar tsconfig.base.json primero para evitar errores
COPY tsconfig.base.json ./

COPY package*.json ./
COPY common/package*.json ./common/
COPY products/package*.json ./products/

RUN npm install

COPY common ./common
COPY products ./products

RUN cd products && npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
COPY common/package*.json ./common/
COPY products/package*.json ./products/

RUN npm install --omit=dev

COPY --from=builder /app/common/dist ./common/dist
COPY --from=builder /app/products/dist ./products/dist

CMD ["node", "products/dist/server.js"]
