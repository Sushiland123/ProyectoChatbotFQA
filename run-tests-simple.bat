@echo off
setlocal enabledelayedexpansion

echo =============================================
echo     EJECUTANDO PRUEBAS AUTOMATICAS
echo =============================================

echo.
echo Verificando que los servicios esten ejecutandose...

REM Verificar curl
where curl >nul 2>&1
if errorlevel 1 (
    echo ERROR: curl no esta instalado
    echo Instala curl desde: https://curl.se/download.html
    pause
    exit /b 1
)

REM Test servicios
echo Verificando API Gateway...
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo ERROR: API Gateway no responde
    pause
    exit /b 1
) else (
    echo SUCCESS: API Gateway OK
)

echo Verificando Auth Service...
curl -s http://localhost:3001 >nul 2>&1
if errorlevel 1 (
    echo ERROR: Auth Service no responde
    pause
    exit /b 1
) else (
    echo SUCCESS: Auth Service OK
)

echo Verificando FAQ Service...
curl -s http://localhost:3002 >nul 2>&1
if errorlevel 1 (
    echo ERROR: FAQ Service no responde  
    pause
    exit /b 1
) else (
    echo SUCCESS: FAQ Service OK
)

echo Verificando Chatbot Service...
curl -s http://localhost:3003 >nul 2>&1
if errorlevel 1 (
    echo ERROR: Chatbot Service no responde
    pause
    exit /b 1
) else (
    echo SUCCESS: Chatbot Service OK
)

echo.
echo Iniciando pruebas de endpoints...

REM Test 1: Registro
echo Test 1: Registro de usuario...
curl -s -X POST "http://localhost:3000/auth/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"123456\",\"rol\":\"USUARIO\"}" > test1.txt

findstr "id" test1.txt >nul
if errorlevel 1 (
    echo ERROR: Registro fallo
    type test1.txt
) else (
    echo SUCCESS: Usuario registrado
)

REM Test 2: Login
echo Test 2: Login de usuario...
curl -s -X POST "http://localhost:3000/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"123456\"}" > test2.txt

findstr "token" test2.txt >nul
if errorlevel 1 (
    echo ERROR: Login fallo
    type test2.txt
) else (
    echo SUCCESS: Login exitoso
)

REM Test 3: Chatbot publico
echo Test 3: Chatbot publico...
curl -s -X POST "http://localhost:3000/chatbot/message" ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"Hola\",\"sessionId\":\"test\"}" > test3.txt

findstr "message" test3.txt >nul
if errorlevel 1 (
    echo ERROR: Chatbot fallo
    type test3.txt
) else (
    echo SUCCESS: Chatbot funciona
)

REM Test 4: FAQs publico
echo Test 4: FAQs publico...
curl -s "http://localhost:3000/faq" > test4.txt

findstr "[" test4.txt >nul
if not errorlevel 1 (
    echo SUCCESS: FAQs obtenidas
) else (
    findstr "id" test4.txt >nul
    if not errorlevel 1 (
        echo SUCCESS: FAQs obtenidas
    ) else (
        echo ERROR: FAQs fallo
        type test4.txt
    )
)

REM Test 5: JWT invalido
echo Test 5: JWT invalido...
curl -s -H "Authorization: Bearer fake_token" "http://localhost:3000/auth/profile" > test5.txt

findstr "401\|Unauthorized\|invalid\|inv.*lido" test5.txt >nul
if errorlevel 1 (
    echo ERROR: JWT invalido no rechazado
    type test5.txt
) else (
    echo SUCCESS: JWT invalido rechazado correctamente
)

REM Test 6: Sin JWT
echo Test 6: Endpoint sin JWT...
curl -s "http://localhost:3000/chatbot/analytics" > test6.txt

findstr "401\|Unauthorized" test6.txt >nul
if errorlevel 1 (
    echo ERROR: Endpoint sin JWT no rechazado
    type test6.txt
) else (
    echo SUCCESS: Endpoint sin JWT rechazado
)

REM Test 7: Microservicio directo
echo Test 7: Microservicio directo...
curl -s "http://localhost:3003/analytics" > test7.txt

findstr "userId.*anonymous\|userId" test7.txt >nul
if errorlevel 1 (
    echo ERROR: Microservicio no responde bien
    type test7.txt
) else (
    echo SUCCESS: Microservicio sin JWT funciona correctamente
)

REM Limpieza
del test*.txt >nul 2>&1

echo.
echo =============================================
echo            RESUMEN DE PRUEBAS  
echo =============================================
echo.
echo Pruebas completadas. Revisa los resultados arriba.
echo.
echo Endpoints principales:
echo   API Gateway: http://localhost:3000
echo   Chatbot: POST http://localhost:3000/chatbot/message
echo   Login: POST http://localhost:3000/auth/login
echo.
echo Para pruebas manuales detalladas:
echo   Importa postman-collection.json en Postman
echo.
pause
