#!/bin/bash

echo "==========================================="
echo "   🚀 INICIANDO PROYECTO CHATBOT FQA"
echo "==========================================="
echo

echo "📦 Instalando dependencias..."
echo

echo "[1/4] Instalando dependencias del API Gateway..."
cd api-gateway
npm install --silent
if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias del API Gateway"
    exit 1
fi
cd ..

echo "[2/4] Instalando dependencias del Auth Service..."
cd auth-service
npm install --silent
if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias del Auth Service"
    exit 1
fi
cd ..

echo "[3/4] Instalando dependencias del FAQ Service..."
cd faq-service
npm install --silent
if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias del FAQ Service"
    exit 1
fi
cd ..

echo "[4/4] Instalando dependencias del Chatbot Service..."
cd chatbot-service
npm install --silent
if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias del Chatbot Service"
    exit 1
fi
cd ..

echo
echo "✅ Dependencias instaladas correctamente"
echo

echo "🐳 Iniciando base de datos PostgreSQL..."
docker-compose up -d postgres
if [ $? -ne 0 ]; then
    echo "❌ Error iniciando PostgreSQL. ¿Tienes Docker instalado?"
    exit 1
fi

echo
echo "⏳ Esperando que PostgreSQL esté listo..."
sleep 5

echo
echo "🚀 Iniciando microservicios en paralelo..."
echo

# Función para ejecutar servicios en paralelo
run_service() {
    local service_name=$1
    local service_dir=$2
    local port=$3
    
    echo "Iniciando $service_name en puerto $port..."
    (cd $service_dir && npm run start:dev) &
    sleep 2
}

# Iniciar servicios
run_service "Auth Service" "auth-service" "3001"
run_service "FAQ Service" "faq-service" "3002" 
run_service "Chatbot Service" "chatbot-service" "3003"
run_service "API Gateway" "api-gateway" "3000"

echo
echo "==========================================="
echo "   ✅ TODOS LOS SERVICIOS INICIADOS"
echo "==========================================="
echo
echo "📡 Endpoints disponibles:"
echo "  • API Gateway: http://localhost:3000"
echo "  • Auth Service: http://localhost:3001"
echo "  • FAQ Service: http://localhost:3002"
echo "  • Chatbot Service: http://localhost:3003"
echo
echo "🐳 Base de datos PostgreSQL: localhost:5433"
echo
echo "💡 Para detener todo:"
echo "  1. Presiona Ctrl+C"
echo "  2. Ejecuta: docker-compose down"
echo

# Mantener el script corriendo
wait
