FROM node:20-alpine

WORKDIR /app

# Copiamos package.json
COPY package*.json ./
COPY common/package*.json ./common/
COPY gateway/package*.json ./gateway/

# También copiamos tsconfig base
COPY tsconfig.base.json ./ 

RUN npm install

# Copiamos el resto del código
COPY common ./common
COPY gateway ./gateway

# Build usando el tsconfig base
RUN cd gateway && npm run build

EXPOSE 4000
CMD ["node", "gateway/dist/server.js"]
