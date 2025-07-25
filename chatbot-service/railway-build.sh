#!/bin/bash
echo "🚀 Iniciando build para Railway (sin Docker)..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Generar Prisma Client
echo "🔧 Generando Prisma Client..."
npx prisma generate

# Build de la aplicación
echo "🏗️ Construyendo aplicación..."
npm run build

echo "✅ Build completado exitosamente!"
