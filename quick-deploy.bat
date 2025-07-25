@echo off
echo 🚀 DEPLOY RÁPIDO Y SEGURO - RAILWAY
echo ===================================
echo.

echo 🔍 Verificando requisitos...

REM Verificar Railway CLI
where railway >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI no encontrado
    echo 💿 Instalando Railway CLI...
    npm install -g @railway/cli
)

REM Verificar login
railway whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔑 Login requerido...
    railway login
)

echo.
echo 🤖 DEPLOYANDO CHATBOT SERVICE...
cd chatbot-service

echo 📊 Estado actual:
railway status

echo.
echo 🔍 Variables críticas:
railway variables | findstr /i "GOOGLE_PROJECT_ID\|DATABASE_URL\|NODE_ENV"

echo.
echo 🚀 Iniciando deploy...
railway up --detach

echo.
echo ⏱️ Esperando 30 segundos para que inicie...
timeout /t 30 /nobreak

echo.
echo 📝 Verificando logs de inicio:
railway logs --tail 10

echo.
echo 🔍 Estado final:
railway status

cd ..

echo.
echo ===================================
echo ✅ DEPLOY COMPLETADO
echo.
echo 📋 PRÓXIMOS PASOS:
echo 1. Verifica el estado en: https://railway.app/dashboard
echo 2. Si hay errores, ejecuta: .\diagnose-railway.bat
echo 3. Para logs en tiempo real: railway logs -f
echo.
echo 🌐 URLs de tu proyecto:
railway domain

pause
