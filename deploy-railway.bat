@echo off
echo ===========================================
echo     DEPLOY AUTOMATICO A RAILWAY
echo ===========================================

echo.
echo 🚀 Iniciando deploy a Railway...

REM Verificar Railway CLI
where railway >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI no encontrado. Instalando...
    npm install -g @railway/cli
    if %errorlevel% neq 0 (
        echo ERROR: No se pudo instalar Railway CLI
        pause
        exit /b %errorlevel%
    )
)

echo 🔑 Verificando login...
railway login
if %errorlevel% neq 0 (
    echo ERROR: Login fallido
    pause
    exit /b %errorlevel%
)

echo 📁 Configurando proyecto principal...
railway init --name chatbot-fqa

echo 🐘 Agregando PostgreSQL...
railway add postgresql

echo.
echo 🔐 Deploying Auth Service...
cd auth-service
railway init --name chatbot-auth
railway variable set JWT_SECRET="mi_sushi"
railway up
if %errorlevel% neq 0 (
    echo ERROR: Auth Service deploy falló
    cd ..
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo ❓ Deploying FAQ Service...
cd faq-service
railway init --name chatbot-faq
railway up
if %errorlevel% neq 0 (
    echo ERROR: FAQ Service deploy falló
    cd ..
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo 🤖 Deploying Chatbot Service...
cd chatbot-service
railway init --name chatbot-bot
echo ⚠️  Configura manualmente las variables de Twilio y OpenAI en el dashboard
railway up
if %errorlevel% neq 0 (
    echo ERROR: Chatbot Service deploy falló
    cd ..
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo 🌐 Deploying API Gateway...
cd api-gateway
railway init --name chatbot-gateway
railway variable set JWT_SECRET="mi_sushi"
railway up
if %errorlevel% neq 0 (
    echo ERROR: API Gateway deploy falló
    cd ..
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo ===========================================
echo         DEPLOY COMPLETADO! ✅
echo ===========================================
echo.
echo 📊 Ve al dashboard: https://railway.app/dashboard
echo 🔧 Configura las variables faltantes en cada servicio:
echo    - OPENAI_API_KEY en chatbot-bot
echo    - EMAIL_* variables en chatbot-bot  
echo    - TWILIO_* variables en chatbot-bot
echo.
echo 📱 URL principal: Ver en Railway dashboard
echo 🔗 URLs de servicios: Se generan automaticamente
echo.
echo 📋 PROXIMOS PASOS:
echo 1. Configura variables de entorno faltantes
echo 2. Ejecuta migraciones de BD
echo 3. Configura webhook de Twilio
echo 4. Prueba WhatsApp
echo.
pause