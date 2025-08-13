FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY common/package*.json ./common/
COPY products/package*.json ./products/

COPY tsconfig.base.json ./

RUN npm install

COPY common ./common
COPY products ./products

RUN cd products && npm run build

EXPOSE 3002

CMD ["node", "products/dist/server.js"]
