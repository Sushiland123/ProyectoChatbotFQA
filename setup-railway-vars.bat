@echo off
echo 🔧 Configurando variables de entorno para Railway...
echo.

echo 📋 Configurando CHATBOT SERVICE...
cd chatbot-service

echo ⚙️ Variables básicas...
railway variable set NODE_ENV=production
railway variable set PORT=3003

echo 🤖 Variables de OpenAI...
set /p OPENAI_KEY="Ingresa tu OPENAI_API_KEY: "
railway variable set OPENAI_API_KEY=%OPENAI_KEY%

echo 📧 Variables de Email...
set /p EMAIL_HOST="Email host (ej: smtp.gmail.com): "
set /p EMAIL_PORT="Email port (ej: 587): "
set /p EMAIL_USER="Email user: "
set /p EMAIL_PASS="Email password: "
railway variable set EMAIL_HOST=%EMAIL_HOST%
railway variable set EMAIL_PORT=%EMAIL_PORT%
railway variable set EMAIL_USER=%EMAIL_USER%
railway variable set EMAIL_PASS=%EMAIL_PASS%

echo 📱 Variables de Twilio...
set /p TWILIO_SID="Twilio Account SID: "
set /p TWILIO_TOKEN="Twilio Auth Token: "
set /p TWILIO_NUMBER="Twilio WhatsApp Number: "
railway variable set TWILIO_ACCOUNT_SID=%TWILIO_SID%
railway variable set TWILIO_AUTH_TOKEN=%TWILIO_TOKEN%
railway variable set TWILIO_WHATSAPP_NUMBER=%TWILIO_NUMBER%

echo 🔑 Variables de Google/Dialogflow...
set /p GOOGLE_PROJECT="Google Project ID: "
set /p GOOGLE_KEY_ID="Google Private Key ID: "
set /p GOOGLE_EMAIL="Google Client Email: "
set /p GOOGLE_CLIENT_ID="Google Client ID: "
railway variable set GOOGLE_PROJECT_ID=%GOOGLE_PROJECT%
railway variable set GOOGLE_PRIVATE_KEY_ID=%GOOGLE_KEY_ID%
railway variable set GOOGLE_CLIENT_EMAIL=%GOOGLE_EMAIL%
railway variable set GOOGLE_CLIENT_ID=%GOOGLE_CLIENT_ID%

echo.
echo ⚠️ IMPORTANTE: La GOOGLE_PRIVATE_KEY debe configurarse manualmente
echo en el dashboard de Railway debido a los caracteres especiales.
echo.
echo 🌐 Abre: https://railway.app/dashboard
echo Busca tu proyecto chatbot-bot
echo Agrega GOOGLE_PRIVATE_KEY con el contenido completo del private key
echo.

cd ..
echo ✅ Configuración completada!
pause
