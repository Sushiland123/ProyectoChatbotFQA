#!/bin/bash

echo "=============================================" 
echo "    🧪 EJECUTANDO PRUEBAS AUTOMATICAS"
echo "=============================================" 

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que los servicios estén corriendo
log_info "Verificando que los servicios estén ejecutándose..."

services=("3000" "3001" "3002" "3003")
service_names=("API Gateway" "Auth Service" "FAQ Service" "Chatbot Service")

for i in "${!services[@]}"; do
    port=${services[$i]}
    name=${service_names[$i]}
    
    if curl -s http://localhost:$port > /dev/null 2>&1; then
        log_success "$name (Puerto $port) - ✅ ACTIVO"
    else
        log_error "$name (Puerto $port) - ❌ NO RESPONDE"
        echo "Por favor, inicia los servicios con: npm run start:dev"
        exit 1
    fi
done

echo ""
log_info "🧪 Iniciando pruebas de endpoints..."

# Variables para tokens
JWT_TOKEN=""
ADMIN_TOKEN=""

# Test 1: Registro de usuario
log_info "Test 1: Registrando usuario normal..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Usuario Test",
    "email": "test@test.com",
    "password": "123456",
    "rol": "USUARIO"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "id"; then
    log_success "✅ Usuario registrado correctamente"
else
    log_error "❌ Error registrando usuario: $REGISTER_RESPONSE"
fi

# Test 2: Registro de admin
log_info "Test 2: Registrando usuario admin..."
ADMIN_REGISTER=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Admin Test", 
    "email": "admin@test.com",
    "password": "admin123",
    "rol": "ADMIN"
  }')

if echo "$ADMIN_REGISTER" | grep -q "id"; then
    log_success "✅ Admin registrado correctamente"
else
    log_error "❌ Error registrando admin: $ADMIN_REGISTER"
fi

# Test 3: Login usuario
log_info "Test 3: Login de usuario..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "123456"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    JWT_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    log_success "✅ Login exitoso - Token obtenido"
else
    log_error "❌ Error en login: $LOGIN_RESPONSE"
fi

# Test 4: Login admin
log_info "Test 4: Login de admin..."
ADMIN_LOGIN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }')

if echo "$ADMIN_LOGIN" | grep -q "token"; then
    ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    log_success "✅ Login admin exitoso - Token obtenido"
else
    log_error "❌ Error en login admin: $ADMIN_LOGIN"
fi

# Test 5: Perfil con JWT
log_info "Test 5: Obteniendo perfil con JWT..."
if [ ! -z "$JWT_TOKEN" ]; then
    PROFILE_RESPONSE=$(curl -s -H "Authorization: Bearer $JWT_TOKEN" http://localhost:3000/auth/profile)
    if echo "$PROFILE_RESPONSE" | grep -q "email"; then
        log_success "✅ Perfil obtenido correctamente"
    else
        log_error "❌ Error obteniendo perfil: $PROFILE_RESPONSE"
    fi
else
    log_error "❌ No hay token para probar perfil"
fi

# Test 6: Chatbot público
log_info "Test 6: Mensaje al chatbot (público)..."
CHATBOT_RESPONSE=$(curl -s -X POST http://localhost:3000/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hola, ¿cómo estás?",
    "sessionId": "test-session"
  }')

if echo "$CHATBOT_RESPONSE" | grep -q "message"; then
    log_success "✅ Chatbot respondió correctamente"
else
    log_error "❌ Error en chatbot: $CHATBOT_RESPONSE"
fi

# Test 7: Analytics con JWT
log_info "Test 7: Analytics con autenticación..."
if [ ! -z "$JWT_TOKEN" ]; then
    ANALYTICS_RESPONSE=$(curl -s -H "Authorization: Bearer $JWT_TOKEN" http://localhost:3000/chatbot/analytics)
    if echo "$ANALYTICS_RESPONSE" | grep -q "userId"; then
        log_success "✅ Analytics obtenido correctamente"
    else
        log_error "❌ Error obteniendo analytics: $ANALYTICS_RESPONSE"
    fi
else
    log_error "❌ No hay token para probar analytics"
fi

# Test 8: FAQs público
log_info "Test 8: Obteniendo FAQs (público)..."
FAQ_RESPONSE=$(curl -s http://localhost:3000/faq)
if echo "$FAQ_RESPONSE" | grep -q "\[" || echo "$FAQ_RESPONSE" | grep -q "id"; then
    log_success "✅ FAQs obtenidas correctamente"
else
    log_error "❌ Error obteniendo FAQs: $FAQ_RESPONSE"
fi

# Test 9: Crear FAQ con JWT
log_info "Test 9: Creando FAQ con autenticación..."
if [ ! -z "$JWT_TOKEN" ]; then
    FAQ_CREATE=$(curl -s -X POST http://localhost:3000/faq \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "pregunta": "¿Cuál es el horario de atención?",
        "respuesta": "Lunes a viernes de 8:00 AM a 6:00 PM",
        "grupoId": 1
      }')
    
    if echo "$FAQ_CREATE" | grep -q "id" || echo "$FAQ_CREATE" | grep -q "pregunta"; then
        log_success "✅ FAQ creada correctamente"
    else
        log_error "❌ Error creando FAQ: $FAQ_CREATE"
    fi
else
    log_error "❌ No hay token para crear FAQ"
fi

# Test 10: Test de JWT inválido
log_info "Test 10: Probando JWT inválido..."
INVALID_JWT=$(curl -s -H "Authorization: Bearer token_falso" http://localhost:3000/auth/profile)
if echo "$INVALID_JWT" | grep -q "401" || echo "$INVALID_JWT" | grep -q "Unauthorized" || echo "$INVALID_JWT" | grep -q "inválido"; then
    log_success "✅ JWT inválido rechazado correctamente"
else
    log_error "❌ JWT inválido no fue rechazado: $INVALID_JWT"
fi

# Test 11: Test sin JWT
log_info "Test 11: Probando endpoint protegido sin JWT..."
NO_JWT=$(curl -s http://localhost:3000/chatbot/analytics)
if echo "$NO_JWT" | grep -q "401" || echo "$NO_JWT" | grep -q "Unauthorized" || echo "$NO_JWT" | grep -q "Token no proporcionado"; then
    log_success "✅ Endpoint protegido sin JWT rechazado correctamente"
else
    log_error "❌ Endpoint protegido sin JWT no fue rechazado: $NO_JWT"
fi

# Test 12: Tickets como admin
log_info "Test 12: Obteniendo tickets como admin..."
if [ ! -z "$ADMIN_TOKEN" ]; then
    TICKETS_RESPONSE=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:3000/chatbot/tickets)
    if echo "$TICKETS_RESPONSE" | grep -q "\[" || echo "$TICKETS_RESPONSE" | grep -q "id"; then
        log_success "✅ Tickets obtenidos como admin"
    else
        log_error "❌ Error obteniendo tickets como admin: $TICKETS_RESPONSE"
    fi
else
    log_error "❌ No hay token admin para probar tickets"
fi

# Test 13: Verificar que microservicios no validen JWT
log_info "Test 13: Verificando arquitectura sin JWT en microservicios..."
DIRECT_CHATBOT=$(curl -s http://localhost:3003/analytics 2>/dev/null)
if echo "$DIRECT_CHATBOT" | grep -q "userId" || echo "$DIRECT_CHATBOT" | grep -q "anonymous"; then
    log_success "✅ Microservicio funciona sin validación JWT"
else
    log_error "❌ Microservicio no responde correctamente: $DIRECT_CHATBOT"
fi

echo ""
echo "=============================================" 
echo "           RESUMEN DE PRUEBAS"
echo "=============================================" 

echo "✅ Tests completados - Verificar output arriba"
echo ""
echo "🔗 Endpoints principales:"
echo "  - API Gateway: http://localhost:3000"
echo "  - Chatbot: POST http://localhost:3000/chatbot/message"
echo "  - Login: POST http://localhost:3000/auth/login"
echo ""
echo "📁 Archivos de prueba creados:"
echo "  - TESTING.md (Manual de pruebas)"
echo "  - postman-collection.json (Colección Postman)"
echo ""
echo "💡 Para pruebas manuales, importa postman-collection.json en Postman/Thunder Client"
echo ""
