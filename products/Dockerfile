
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos archivos necesarios para cachear dependencias y configuración turbo
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./     

# Copiamos carpetas comunes y del servicio
COPY common ./common
COPY products ./products

RUN npm install && npm cache clean --force

RUN npx turbo run build --filter=products...

# Etapa runner
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
RUN npm ci --production && npm cache clean --force

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/products/dist ./dist

ENV NODE_OPTIONS="--max-old-space-size=512"

CMD ["node", "dist/server.js"]
