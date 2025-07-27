# Usa Node LTS con soporte para TypeScript
FROM node:18

# Establece directorio de trabajo
WORKDIR /app

# Copia archivos necesarios
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Compila TypeScript
RUN npm run build

# Exponer puerto solo en gateway
# AUTH y PRODUCTS no necesitan EXPOSE

# Comando para ejecutar
CMD ["npm", "run", "start"]
