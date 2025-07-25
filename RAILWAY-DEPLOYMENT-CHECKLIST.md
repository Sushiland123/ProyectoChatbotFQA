# 🚀 Checklist de Deployment en Railway - Chatbot Service

## ✅ Cambios Realizados

1. **Dependencias Actualizadas**
   - Downgrade de NestJS v11 → v10 para compatibilidad
   - Actualización de Prisma a v5.22.0
   - Resolución de conflictos de versiones

2. **Configuración de Build**
   - `railway.json` configurado para Nixpacks
   - `nixpacks.toml` especifica Node.js 18
   - Health check con timeout de 300 segundos

3. **Health Check Mejorado**
   - Responde inmediatamente durante inicio
   - No requiere DB durante primeros 30 segundos
   - Verificaciones progresivas

4. **Simplificaciones**
   - Main.ts sin Swagger (más rápido)
   - CORS habilitado globalmente
   - Logs mínimos para debugging

## 📋 Pasos en Railway

### 1. **Verificar Configuración del Servicio**
- [ ] En Settings → Builder: Debe estar en "Nixpacks" (NO Dockerfile)
- [ ] Root Directory: `/chatbot-service` (si tienes monorepo)
- [ ] Watch Paths: `chatbot-service/**` (si aplica)

### 2. **Variables de Entorno Requeridas**
```env
# OBLIGATORIAS
DATABASE_URL=postgresql://[usuario]:[password]@[host]:[puerto]/[database]?schema=public
OPENAI_API_KEY=sk-...

# OPCIONALES pero recomendadas
NODE_ENV=production
PORT=3003

# Para email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password

# Para WhatsApp (opcional)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Para Dialogflow (opcional)
GOOGLE_PROJECT_ID=tu-proyecto-id
```

### 3. **Comandos de Build/Start**
Railway debería detectar automáticamente del `railway.json`:
- Build: `npm install && npx prisma generate && npm run build`
- Start: `node dist/main`

Si necesitas sobrescribir:
- Build Command: `npm ci && npx prisma generate && npm run build`
- Start Command: `node dist/main`

### 4. **Verificar Logs**
Después del deploy, verifica:
```bash
railway logs --service=chatbot-service
```

Deberías ver:
```
🚀 Chatbot Service corriendo en puerto 3003
🔍 Health check disponible en: http://0.0.0.0:3003/health
```

### 5. **Probar Health Check**
Una vez deployado:
```bash
curl https://[tu-servicio].railway.app/health
```

Debería responder:
```json
{
  "status": "ok",
  "service": "chatbot-service",
  "timestamp": "...",
  "uptime": ...,
  "environment": "production"
}
```

## 🚨 Troubleshooting

### Si falla el build:
1. Verifica que no esté usando Dockerfile
2. Intenta con Build Command manual: `npm install --legacy-peer-deps && npx prisma generate && npm run build`

### Si falla el health check:
1. Aumenta el timeout en Railway Settings
2. Verifica que DATABASE_URL esté correcta
3. Usa Start Command: `npx prisma migrate deploy || true && node dist/main`

### Si hay errores de Prisma:
1. Asegúrate que el schema sea compatible
2. Considera ejecutar migraciones manualmente
3. Verifica permisos de DB

### Comando de emergencia (último recurso):
```bash
# Como Start Command en Railway:
npm install && npx prisma generate && npx @nestjs/cli build && node dist/main || node dist/main.js
```

## 📊 Monitoreo Post-Deploy

1. **Verificar Logs en Tiempo Real**
   ```bash
   railway logs -f
   ```

2. **Verificar Métricas**
   - CPU usage < 80%
   - Memory usage < 512MB
   - Response time < 1s

3. **Probar Endpoints**
   - GET `/health` - Status del servicio
   - POST `/chat/message` - Funcionalidad del chatbot
   - GET `/analytics` - Métricas (requiere auth)

## 🎯 Resultado Esperado

El servicio debería:
- ✅ Pasar el health check en < 60 segundos
- ✅ Responder en el endpoint `/health`
- ✅ Aceptar mensajes en `/chat/message`
- ✅ Mostrar logs sin errores críticos
