@echo off
echo Reiniciando FAQ Service para aplicar JWT_SECRET...

echo.
echo === Deteniendo FAQ Service ===
taskkill /f /im node.exe /fi "WINDOWTITLE eq FAQ Service*" 2>nul

timeout /t 2 /nobreak > nul

echo.
echo === Iniciando FAQ Service ===
start "FAQ Service" cmd /c "cd /d %~dp0faq-service && npm run start:dev"

echo.
echo === FAQ Service reiniciado ===
echo Ahora los tokens JWT deberían funcionar correctamente!
echo.
echo Endpoints disponibles:
echo GET/POST http://localhost:3000/faq
echo GET/POST http://localhost:3002/faq (directo)
echo.
pause
