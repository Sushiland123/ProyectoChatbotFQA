@echo off
echo ===========================================
echo    INICIANDO PROYECTO CHATBOT FQA
echo ===========================================

echo.
echo Verificando dependencias...
echo.

REM Verificar dependencias solo si no existen
if not exist "api-gateway\node_modules" (
    echo [1/4] Instalando dependencias del API Gateway...
    cd api-gateway
    call npm install --silent
    if %errorlevel% neq 0 (
        echo ERROR: No se pudieron instalar las dependencias del API Gateway
        pause
        exit /b %errorlevel%
    )
    cd ..
) else (
    echo [1/4] API Gateway - dependencias OK
)

if not exist "auth-service\node_modules" (
    echo [2/4] Instalando dependencias del Auth Service...
    cd auth-service
    call npm install --silent
    if %errorlevel% neq 0 (
        echo ERROR: No se pudieron instalar las dependencias del Auth Service
        pause
        exit /b %errorlevel%
    )
    cd ..
) else (
    echo [2/4] Auth Service - dependencias OK
)

if not exist "faq-service\node_modules" (
    echo [3/4] Instalando dependencias del FAQ Service...
    cd faq-service
    call npm install --silent
    if %errorlevel% neq 0 (
        echo ERROR: No se pudieron instalar las dependencias del FAQ Service
        pause
        exit /b %errorlevel%
    )
    cd ..
) else (
    echo [3/4] FAQ Service - dependencias OK
)

if not exist "chatbot-service\node_modules" (
    echo [4/4] Instalando dependencias del Chatbot Service...
    cd chatbot-service
    call npm install --silent
    if %errorlevel% neq 0 (
        echo ERROR: No se pudieron instalar las dependencias del Chatbot Service
        pause
        exit /b %errorlevel%
    )
    cd ..
) else (
    echo [4/4] Chatbot Service - dependencias OK
)

echo.
echo EXITO: Dependencias verificadas correctamente
echo.

echo Iniciando base de datos PostgreSQL...
docker-compose up -d postgres
if %errorlevel% neq 0 (
    echo ERROR: No se pudo iniciar PostgreSQL. Tienes Docker instalado?
    pause
    exit /b %errorlevel%
)

echo.
echo Esperando que PostgreSQL este listo...
timeout /t 5 /nobreak > nul

echo.
echo Iniciando microservicios en paralelo...
echo.

start "Auth Service" cmd /k "cd auth-service && echo Auth Service iniciado && npm run start:dev"
timeout /t 3 /nobreak > nul

start "FAQ Service" cmd /k "cd faq-service && echo FAQ Service iniciado && npm run start:dev"
timeout /t 3 /nobreak > nul

start "Chatbot Service" cmd /k "cd chatbot-service && echo Chatbot Service iniciado && npm run start:dev"
timeout /t 3 /nobreak > nul

start "API Gateway" cmd /k "cd api-gateway && echo API Gateway iniciado && npm run start:dev"

echo.
echo ===========================================
echo    TODOS LOS SERVICIOS INICIADOS
echo ===========================================
echo.
echo Endpoints disponibles:
echo   - API Gateway: http://localhost:3000
echo   - Auth Service: http://localhost:3001
echo   - FAQ Service: http://localhost:3002
echo   - Chatbot Service: http://localhost:3003
echo.
echo Base de datos PostgreSQL: localhost:5433
echo.
echo Para detener todo:
echo   1. Cierra las ventanas de los servicios
echo   2. Ejecuta: docker-compose down
echo.
echo Prueba el API:
echo   POST http://localhost:3000/auth/login
echo   POST http://localhost:3000/chatbot/message
echo.
echo Para forzar reinstalacion: npm run install:all
echo.
pause
