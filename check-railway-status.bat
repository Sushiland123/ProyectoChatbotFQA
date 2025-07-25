@echo off
echo 🔍 Verificando configuración de Railway...
echo.

echo 📋 Verificando CHATBOT SERVICE...
cd chatbot-service

echo 🔍 Variables configuradas:
railway variables

echo.
echo 📊 Estado del servicio:
railway status

echo.
echo 📝 Logs recientes:
railway logs --tail 50

echo.
echo ⚡ ¿Redeploy del servicio?
set /p REDEPLOY="¿Hacer redeploy? (y/n): "
if /i "%REDEPLOY%"=="y" (
    echo 🚀 Iniciando redeploy...
    railway up --detach
    echo ✅ Redeploy iniciado. Verifica el estado en el dashboard.
)

cd ..
echo.
echo 🌐 Dashboard: https://railway.app/dashboard
pause
