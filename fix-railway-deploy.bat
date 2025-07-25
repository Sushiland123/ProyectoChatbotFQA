@echo off
echo 🚂 Preparando archivos para deploy en Railway...

REM FAQ Service
echo 📁 Actualizando FAQ Service...
cd faq-service
git add package.json railway.toml .env.example src/main.ts
echo ✅ FAQ Service actualizado

REM Chatbot Service  
echo 📁 Actualizando Chatbot Service...
cd ..\chatbot-service
git add package.json railway.toml .env.example src/main.ts
echo ✅ Chatbot Service actualizado

REM Volver al root
cd ..

echo 📝 Haciendo commit de cambios...
git add .
git commit -m "🚂 Fix Railway deployment: Update FAQ and Chatbot services - Fixed package.json scripts to use start:prod instead of .bat files - Added railway.toml configuration for both services - Updated main.ts to use dynamic ports (Railway compatible) - Added Prisma support in deployment scripts - Created .env.example files for Railway setup - Added engines specification for Node.js 18+ Resolves: Permission denied error on Railway Linux servers"

echo 🚀 Pushing changes to repository...
git push

echo.
echo ✅ ¡Cambios enviados!
echo.
echo 📋 Próximos pasos:
echo 1. Ve a Railway Dashboard
echo 2. Configura las variables de entorno usando los .env.example
echo 3. Haz deploy de FAQ Service
echo 4. Haz deploy de Chatbot Service
echo 5. Actualiza las URLs en tu API Gateway
echo.
echo 🔗 URLs de referencia:
echo FAQ Service: https://your-faq-service.railway.app/api/docs
echo Chatbot Service: https://your-chatbot-service.railway.app/api/docs

pause
