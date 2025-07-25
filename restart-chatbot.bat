@echo off
echo Reiniciando chatbot-service para aplicar fix de SSL...

echo.
echo === Deteniendo chatbot-service ===
taskkill /f /im node.exe /fi "WINDOWTITLE eq Chatbot Service*" 2>nul

timeout /t 2 /nobreak > nul

echo.
echo === Iniciando chatbot-service ===
start "Chatbot Service" cmd /c "cd /d %~dp0chatbot-service && npm run start:dev"

echo.
echo === Chatbot-service reiniciado ===
echo Ahora puedes probar de nuevo el cambio de estado del ticket!
echo.
pause
