#!/bin/bash

# ===========================================
#     DEPLOY AUTOMÁTICO A RAILWAY
# ===========================================

echo "🚀 Iniciando deploy a Railway..."

# Verificar Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI no encontrado. Instalando..."
    npm install -g @railway/cli
fi

# Login (si no está logueado)
echo "🔑 Verificando login..."
railway login

# Crear proyecto principal si no existe
echo "📁 Configurando proyecto principal..."
railway init --name chatbot-fqa

# Agregar PostgreSQL
echo "🐘 Agregando PostgreSQL..."
railway add postgresql

# Deploy Auth Service
echo "🔐 Deploying Auth Service..."
cd auth-service
railway init --name chatbot-auth
railway variable set JWT_SECRET="mi_sushi"
railway up
cd ..

# Deploy FAQ Service  
echo "❓ Deploying FAQ Service..."
cd faq-service
railway init --name chatbot-faq
railway up
cd ..

# Deploy Chatbot Service
echo "🤖 Deploying Chatbot Service..."
cd chatbot-service
railway init --name chatbot-bot
echo "⚠️  Configura manualmente las variables de Twilio y OpenAI en el dashboard"
railway up
cd ..

# Deploy API Gateway
echo "🌐 Deploying API Gateway..."
cd api-gateway
railway init --name chatbot-gateway
railway variable set JWT_SECRET="mi_sushi"
railway up
cd ..

echo "✅ Deploy completado!"
echo "📊 Ve al dashboard: https://railway.app/dashboard"
echo "🔧 Configura las variables faltantes en cada servicio"
echo "📱 URL principal: Ver en Railway dashboard"