# 🚂 Guía de Despliegue en Railway - Chatbot Service

## 🔧 Problema del Health Check

El error que estás viendo indica que Railway no puede verificar que tu servicio está funcionando correctamente. Esto puede deberse a varias razones:

### 1. **Tiempo de inicio insuficiente**
El servicio puede tardar más de lo esperado en iniciar debido a:
- Instalación de dependencias
- Generación de Prisma Client
- Conexión a la base de datos
- Migraciones pendientes

### 2. **Falta de variables de entorno**
Asegúrate de tener estas variables configuradas en Railway:

```env
# REQUERIDAS
DATABASE_URL=postgresql://usuario:password@host:puerto/database?schema=public
OPENAI_API_KEY=tu_openai_key

# OPCIONALES (pero recomendadas)
NODE_ENV=production
PORT=3003

# Para email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email
EMAIL_PASS=tu_password

# Para WhatsApp (opcional)
TWILIO_ACCOUNT_SID=tu_sid
TWILIO_AUTH_TOKEN=tu_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Para Dialogflow (opcional)
GOOGLE_PROJECT_ID=tu_proyecto
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
```

## 🚀 Soluciones Implementadas

### 1. **Health Check Mejorado**
He creado un endpoint `/health` más robusto que verifica:
- Estado del servicio
- Conexión a la base de datos
- Disponibilidad de dependencias

### 2. **Archivo railway.json**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 120,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 3. **Dockerfile Optimizado**
Incluye:
- Build en dos etapas para reducir tamaño
- Health check interno
- Manejo de errores mejorado

### 4. **Script de inicio robusto**
`start-railway.sh` que:
- Verifica variables de entorno
- Espera a que la DB esté lista
- Maneja errores gracefully

## 📝 Pasos para Desplegar

### Opción 1: Usando railway.json (Recomendado)

1. **Commit los cambios**:
```bash
git add .
git commit -m "fix: mejorar health check para Railway"
git push
```

2. **En Railway**:
- Ve a tu proyecto
- Settings → Deploy → Restart

### Opción 2: Comando personalizado

En Railway, cambia el start command a:
```bash
npm run start:railway:safe
```

### Opción 3: Sin migraciones automáticas

Si las migraciones causan problemas, usa:
```bash
npm run prisma:generate && npm run build && npm run start:prod
```

## 🔍 Debugging

### Ver logs en Railway:
```bash
railway logs -n 100
```

### Verificar variables:
```bash
railway variables
```

### Test local con variables de Railway:
```bash
railway run npm start
```

## ⚡ Optimizaciones Adicionales

### 1. **Cache de dependencias**
Agrega a `railway.json`:
```json
{
  "build": {
    "cacheDirectories": ["node_modules", ".npm"]
  }
}
```

### 2. **Reducir tiempo de build**
Usa solo dependencias de producción:
```bash
npm ci --production
```

### 3. **Health check más rápido**
El nuevo endpoint responde inmediatamente sin esperar todas las verificaciones si el servicio está "vivo".

## 🆘 Si sigue fallando

1. **Aumenta el timeout** en railway.json a 180 o 240 segundos
2. **Simplifica el start command** temporalmente:
   ```bash
   node dist/main
   ```
3. **Verifica que el puerto esté correcto**:
   Railway asigna automáticamente la variable `PORT`

4. **Revisa los logs detallados** para ver exactamente dónde falla

## 💡 Comando de emergencia

Si todo lo demás falla, usa este comando minimalista:
```bash
npm install --production && npx prisma generate && npm run build && node dist/main
```

Esto saltará las migraciones y verificaciones, iniciando el servicio lo más rápido posible.
