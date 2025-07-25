FROM node:18-alpine

WORKDIR /app

# Copiar archivos de package y instalar dependencias
COPY package.json package-lock.json ./
COPY .npmrc ./
RUN rm -f package-lock.json && npm install --legacy-peer-deps

# Copiar código fuente
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Construir la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 3002

# Comando para iniciar la aplicación
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
