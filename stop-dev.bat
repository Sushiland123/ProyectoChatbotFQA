@echo off
echo ===========================================
echo   🛑 DETENIENDO PROYECTO CHATBOT FQA
echo ===========================================

echo.
echo 🔌 Deteniendo microservicios...

echo Terminando procesos de Node.js...
taskkill /f /im node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✅ Microservicios detenidos
) else (
    echo ⚠️  No se encontraron procesos de Node.js ejecutándose
)

echo.
echo 🐳 Deteniendo contenedores Docker...
docker-compose down
if %errorlevel% equ 0 (
    echo ✅ Base de datos PostgreSQL detenida
) else (
    echo ⚠️  Error deteniendo Docker o no estaba ejecutándose
)

echo.
echo ===========================================
echo   ✅ PROYECTO DETENIDO COMPLETAMENTE
echo ===========================================
echo.
pause
