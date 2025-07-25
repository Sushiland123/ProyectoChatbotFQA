@echo off
echo 🩺 DIAGNÓSTICO DE DEPLOY RAILWAY
echo =================================
echo.

echo 🔍 1. Verificando Railway CLI...
where railway >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI no encontrado
    echo 💡 Solución: npm install -g @railway/cli
    pause
    exit /b 1
) else (
    echo ✅ Railway CLI encontrado
)

echo.
echo 🔍 2. Verificando login...
railway whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ No estás logueado en Railway
    echo 💡 Solución: railway login
    pause
    exit /b 1
) else (
    echo ✅ Logueado en Railway
)

echo.
echo 🔍 3. Verificando estado de servicios...
cd chatbot-service

echo.
echo 📊 Variables configuradas en chatbot-service:
railway variables | findstr /i "GOOGLE\|OPENAI\|TWILIO\|EMAIL"

echo.
echo 📊 Estado del servicio:
railway status

echo.
echo 📝 Últimos logs (errores):
railway logs --tail 20 | findstr /i "error\|failed\|exception\|❌"

echo.
echo 🔍 4. Verificando archivo de configuración...
if exist "railway.toml" (
    echo ✅ railway.toml existe
    type railway.toml
) else (
    echo ❌ railway.toml no encontrado
)

echo.
echo 🔍 5. Verificando Dockerfile...
if exist "Dockerfile" (
    echo ✅ Dockerfile existe
    echo Comando de inicio:
    findstr /i "CMD" Dockerfile
) else (
    echo ❌ Dockerfile no encontrado
)

echo.
echo 🔍 6. Verificando package.json...
if exist "package.json" (
    echo ✅ package.json existe
    echo Scripts disponibles:
    findstr /A /i "start" package.json
) else (
    echo ❌ package.json no encontrado
)

cd ..

echo.
echo =================================
echo 🎯 POSIBLES SOLUCIONES:
echo.
echo 1. Si hay errores de variables: Verificar en Railway dashboard
echo 2. Si hay errores de Prisma: Usar start:railway:safe
echo 3. Si hay errores de build: Verificar dependencias
echo 4. Si hay errores de conexión: Verificar DATABASE_URL
echo.
echo 🌐 Railway Dashboard: https://railway.app/dashboard
echo.
pause
