@echo off
echo =============================================
echo     EJECUTANDO PRUEBAS AUTOMATICAS
echo =============================================

echo.
echo [INFO] Verificando que los servicios esten ejecutandose...

REM Verificar servicios
curl --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] curl no esta instalado. Instalando...
    echo Por favor instala curl desde: https://curl.se/download.html
    pause
    exit /b 1
)

curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] API Gateway (Puerto 3000) NO RESPONDE
    echo Por favor, inicia los servicios con: npm run start:dev
    pause
    exit /b 1
) else (
    echo [SUCCESS] API Gateway (Puerto 3000) ACTIVO
)

curl -s http://localhost:3001 >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Auth Service (Puerto 3001) NO RESPONDE
    pause
    exit /b 1
) else (
    echo [SUCCESS] Auth Service (Puerto 3001) ACTIVO
)

curl -s http://localhost:3002 >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] FAQ Service (Puerto 3002) NO RESPONDE
    pause
    exit /b 1
) else (
    echo [SUCCESS] FAQ Service (Puerto 3002) ACTIVO
)

curl -s http://localhost:3003 >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Chatbot Service (Puerto 3003) NO RESPONDE
    pause
    exit /b 1
) else (
    echo [SUCCESS] Chatbot Service (Puerto 3003) ACTIVO
)

echo.
echo [INFO] Iniciando pruebas de endpoints...

REM Test 1: Registro de usuario
echo [INFO] Test 1: Registrando usuario normal...
curl -s -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d "{\"nombre\": \"Usuario Test\", \"email\": \"test@test.com\", \"password\": \"123456\", \"rol\": \"USUARIO\"}" > temp_response.txt
findstr /C:"id" temp_response.txt >nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Usuario registrado correctamente
) else (
    echo [ERROR] Error registrando usuario
    type temp_response.txt
)

REM Test 2: Registro de admin
echo [INFO] Test 2: Registrando usuario admin...
curl -s -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d "{\"nombre\": \"Admin Test\", \"email\": \"admin@test.com\", \"password\": \"admin123\", \"rol\": \"ADMIN\"}" > temp_response.txt
findstr /C:"id" temp_response.txt >nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Admin registrado correctamente
) else (
    echo [ERROR] Error registrando admin
    type temp_response.txt
)

REM Test 3: Login usuario
echo [INFO] Test 3: Login de usuario...
curl -s -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"email\": \"test@test.com\", \"password\": \"123456\"}" > temp_login.txt
findstr /C:"token" temp_login.txt >nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Login exitoso, Token obtenido
) else (
    echo [ERROR] Error en login
    type temp_login.txt
)

REM Test 4: Chatbot publico
echo [INFO] Test 4: Mensaje al chatbot (publico)...
curl -s -X POST http://localhost:3000/chatbot/message -H "Content-Type: application/json" -d "{\"message\": \"Hola como estas\", \"sessionId\": \"test-session\"}" > temp_chatbot.txt
findstr /C:"message" temp_chatbot.txt >nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Chatbot respondio correctamente
) else (
    echo [ERROR] Error en chatbot
    type temp_chatbot.txt
)

REM Test 5: FAQs publico
echo [INFO] Test 5: Obteniendo FAQs (publico)...
curl -s http://localhost:3000/faq > temp_faq.txt
findstr /C:"[" temp_faq.txt >nul
if %errorlevel% equ 0 (
    echo [SUCCESS] FAQs obtenidas correctamente
) else (
    findstr /C:"id" temp_faq.txt >nul
    if %errorlevel% equ 0 (
        echo [SUCCESS] FAQs obtenidas correctamente
    ) else (
        echo [ERROR] Error obteniendo FAQs
        type temp_faq.txt
    )
)

REM Test 6: JWT invalido
echo [INFO] Test 6: Probando JWT invalido...
curl -s -H "Authorization: Bearer token_falso" http://localhost:3000/auth/profile > temp_invalid.txt
findstr /C:"401" temp_invalid.txt >nul
if %errorlevel% equ 0 (
    echo [SUCCESS] JWT invalido rechazado correctamente
) else (
    findstr /C:"Unauthorized" temp_invalid.txt >nul
    if %errorlevel% equ 0 (
        echo [SUCCESS] JWT invalido rechazado correctamente
    ) else (
        echo [ERROR] JWT invalido no fue rechazado
        type temp_invalid.txt
    )
)

REM Test 7: Sin JWT
echo [INFO] Test 7: Probando endpoint protegido sin JWT...
curl -s http://localhost:3000/chatbot/analytics > temp_noauth.txt
findstr /C:"401" temp_noauth.txt >nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Endpoint protegido sin JWT rechazado correctamente
) else (
    findstr /C:"Unauthorized" temp_noauth.txt >nul
    if %errorlevel% equ 0 (
        echo [SUCCESS] Endpoint protegido sin JWT rechazado correctamente
    ) else (
        echo [ERROR] Endpoint protegido sin JWT no fue rechazado
        type temp_noauth.txt
    )
)

REM Test 8: Verificar microservicio sin JWT
echo [INFO] Test 8: Verificando arquitectura sin JWT en microservicios...
curl -s http://localhost:3003/analytics > temp_direct.txt 2>nul
findstr /C:"userId" temp_direct.txt >nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Microservicio funciona sin validacion JWT
) else (
    findstr /C:"anonymous" temp_direct.txt >nul
    if %errorlevel% equ 0 (
        echo [SUCCESS] Microservicio funciona sin validacion JWT
    ) else (
        echo [ERROR] Microservicio no responde correctamente
        type temp_direct.txt
    )
)

REM Limpieza
del temp_*.txt 2>nul

echo.
echo =============================================
echo            RESUMEN DE PRUEBAS
echo =============================================
echo.
echo Tests completados, verificar output arriba
echo.
echo Endpoints principales:
echo   API Gateway: http://localhost:3000
echo   Chatbot: POST http://localhost:3000/chatbot/message
echo   Login: POST http://localhost:3000/auth/login
echo.
echo Archivos de prueba creados:
echo   TESTING.md (Manual de pruebas)
echo   postman-collection.json (Coleccion Postman)
echo.
echo Para pruebas manuales, importa postman-collection.json en Postman/Thunder Client
echo.
pause
