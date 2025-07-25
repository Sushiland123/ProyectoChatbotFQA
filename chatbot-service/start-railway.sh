#!/bin/bash
echo "🚀 Iniciando despliegue en Railway para Chatbot Service..."

# Función para verificar variables de entorno
check_env_vars() {
    echo "🔍 Verificando variables de entorno requeridas..."
    
    required_vars=(
        "DATABASE_URL"
        "OPENAI_API_KEY"
    )
    
    optional_vars=(
        "EMAIL_HOST"
        "EMAIL_PORT"
        "EMAIL_USER"
        "EMAIL_PASS"
        "TWILIO_ACCOUNT_SID"
        "TWILIO_AUTH_TOKEN"
        "TWILIO_WHATSAPP_NUMBER"
        "GOOGLE_PROJECT_ID"
        "GOOGLE_APPLICATION_CREDENTIALS"
    )
    
    missing_required=()
    missing_optional=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_required+=("$var")
        else
            echo "✅ $var está configurada"
        fi
    done
    
    for var in "${optional_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_optional+=("$var")
        else
            echo "✅ $var está configurada"
        fi
    done
    
    if [ ${#missing_required[@]} -ne 0 ]; then
        echo "❌ ERROR: Las siguientes variables REQUERIDAS faltan:"
        printf '   - %s\n' "${missing_required[@]}"
        exit 1
    fi
    
    if [ ${#missing_optional[@]} -ne 0 ]; then
        echo "⚠️  ADVERTENCIA: Las siguientes variables opcionales faltan:"
        printf '   - %s\n' "${missing_optional[@]}"
        echo "   El servicio funcionará pero sin algunas características"
    fi
}

# Función para esperar a que la DB esté lista
wait_for_db() {
    echo "⏳ Esperando conexión con la base de datos..."
    for i in {1..30}; do
        if npx prisma db execute --stdin <<< "SELECT 1;" &>/dev/null; then
            echo "✅ Base de datos conectada"
            return 0
        fi
        echo "   Intento $i/30..."
        sleep 2
    done
    echo "❌ No se pudo conectar a la base de datos"
    return 1
}

# Verificar variables
check_env_vars

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci --production

# Generar Prisma Client
echo "🔧 Generando Prisma Client..."
npx prisma generate

# Esperar DB y migrar si es necesario
if wait_for_db; then
    echo "🗄️ Ejecutando migraciones de base de datos..."
    npx prisma migrate deploy || {
        echo "⚠️  No se pudieron ejecutar las migraciones, continuando..."
    }
else
    echo "⚠️  Continuando sin verificar la base de datos..."
fi

# Construir aplicación
echo "🏗️ Construyendo aplicación..."
npm run build

# Iniciar aplicación
echo "🚀 Iniciando Chatbot Service..."
exec node dist/main
