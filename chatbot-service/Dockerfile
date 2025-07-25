FROM node:18-alpine

WORKDIR /app

# Copiar archivos de package y configuración
COPY package.json package-lock.json .npmrc ./

# Instalar dependencias
RUN npm ci --legacy-peer-deps

# Copiar código fuente
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Construir la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 3003

# Comando para iniciar la aplicación
CMD ["node", "dist/main.js"]
