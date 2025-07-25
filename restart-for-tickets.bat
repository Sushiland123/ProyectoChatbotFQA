@echo off
echo Reiniciando servicios para aplicar cambios de tickets...

echo.
echo === Deteniendo servicios ===
taskkill /f /im node.exe 2>nul

echo.
echo === Iniciando API Gateway ===
start "API Gateway" cmd /c "cd /d %~dp0api-gateway && npm run start:dev"

timeout /t 3 /nobreak > nul

echo.
echo === Iniciando Chatbot Service ===
start "Chatbot Service" cmd /c "cd /d %~dp0chatbot-service && npm run start:dev"

echo.
echo === Servicios iniciados ===
echo API Gateway: http://localhost:3000
echo Chatbot Service: http://localhost:3003
echo.
echo Ahora puedes probar los endpoints de tickets!
pause
