# Usa Node 18 oficial con soporte para TypeScript
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Instala las dependencias
RUN npm install

# Compila TypeScript
RUN npm run build


# Comando para iniciar la app
CMD ["npm", "run", "start"]
