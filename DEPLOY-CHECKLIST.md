# 🚀 CHECKLIST DE DEPLOY PARA RAILWAY

## ✅ **Pre-requisitos**

### 1. **Credenciales de Google/Dialogflow**
- [ ] Tienes un proyecto en Google Cloud Console
- [ ] Has habilitado la API de Dialogflow
- [ ] Has creado una Service Account Key (JSON)
- [ ] Tienes el `project_id`, `private_key`, `client_email`, etc.

### 2. **Credenciales de Servicios Externos**
- [ ] OpenAI API Key
- [ ] Twilio Account SID, Auth Token, WhatsApp Number
- [ ] Configuración de Email (Gmail, SMTP)

### 3. **Railway CLI**
- [ ] `npm install -g @railway/cli`
- [ ] `railway login`

## 🔧 **Pasos de Deploy**

### **Paso 1: Deploy de Base de Datos**
```bash
railway add postgresql
```

### **Paso 2: Deploy de Servicios**
```bash
# Ejecutar el script automatizado
.\deploy-railway.bat

# O manualmente:
cd auth-service && railway init --name chatbot-auth && railway up
cd ../faq-service && railway init --name chatbot-faq && railway up  
cd ../chatbot-service && railway init --name chatbot-bot && railway up
cd ../api-gateway && railway init --name chatbot-gateway && railway up
```

### **Paso 3: Configurar Variables de Entorno**
```bash
# Ejecutar script de configuración
.\setup-railway-vars.bat
```

**IMPORTANTE**: La `GOOGLE_PRIVATE_KEY` debe configurarse manualmente en el dashboard debido a caracteres especiales.

### **Paso 4: Configurar URLs Internas**
En el dashboard de Railway, actualizar:
- AUTH_SERVICE_URL
- FAQ_SERVICE_URL  
- API_GATEWAY_URL

### **Paso 5: Verificar Deploy**
- [ ] Todos los servicios están corriendo (verde en dashboard)
- [ ] No hay errores en los logs
- [ ] Health checks pasan
- [ ] Base de datos conectada

## 🔍 **Testing Post-Deploy**

### **Endpoints a Probar:**
1. **API Gateway**: `https://your-gateway.railway.app/health`
2. **Auth Service**: `https://your-auth.railway.app/health`
3. **FAQ Service**: `https://your-faq.railway.app/health`
4. **Chatbot Service**: `https://your-chatbot.railway.app/health`

### **Funcionalidad del Chatbot:**
1. **POST** a `/chat/message` con:
```json
{
  "message": "Hola",
  "userId": "test123"
}
```

2. **Verificar respuesta de Dialogflow**
3. **Probar fallback a OpenAI** (enviar mensaje que Dialogflow no entienda)
4. **Probar creación de tickets**

## 🚨 **Problemas Comunes**

### **Error: "GOOGLE_PROJECT_ID not found"**
- Verificar que todas las variables de Google estén configuradas
- Revisar logs del servicio chatbot-bot

### **Error: "Prisma migrate deploy failed"**
- Usar `start:railway:safe` en lugar de `start:railway`
- Ejecutar migraciones manualmente desde Railway console

### **Error: "Service unreachable"**
- Verificar URLs internas en variables de entorno
- Confirmar que todos los servicios estén desplegados

### **Error: "WhatsApp webhook fails"**
- Configurar webhook en Twilio Console
- URL: `https://your-chatbot.railway.app/whatsapp/webhook`

## 📋 **Variables de Entorno Requeridas**

### **Chatbot Service:**
```env
NODE_ENV=production
DATABASE_URL=(auto-generada por Railway)
OPENAI_API_KEY=
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=
GOOGLE_PROJECT_ID=
GOOGLE_PRIVATE_KEY_ID=
GOOGLE_PRIVATE_KEY=
GOOGLE_CLIENT_EMAIL=
GOOGLE_CLIENT_ID=
```

### **Auth/FAQ/Gateway Services:**
```env
NODE_ENV=production
DATABASE_URL=(auto-generada por Railway)
JWT_SECRET=mi_sushi
```

## 🔗 **Enlaces Útiles**
- [Railway Dashboard](https://railway.app/dashboard)
- [Google Cloud Console](https://console.cloud.google.com)
- [Twilio Console](https://console.twilio.com)
- [OpenAI API Keys](https://platform.openai.com/api-keys)
