# 🔧 API GATEWAY FAQ SERVICE - PROBLEMA RESUELTO

## ✅ **Problema Identificado y Corregido:**
El API Gateway estaba enviando requests a URLs incorrectas:
- ❌ Antes: `http://faq-service.railway.internal:3002/faq` (Railway interno)
- ✅ Ahora: `http://localhost:3002/faq` (Desarrollo local)

## 🛠️ **Cambios Realizados:**

### 1. Corregido `api-gateway/src/clients/faq/faq.service.ts`:
- URLs base cambiadas a `localhost:3002`
- Rutas completas añadidas (`/faq`, `/grupo-faq`)

### 2. Variables de entorno ya configuradas en `.env`:
```properties
FAQ_SERVICE_URL="http://localhost:3002"
```

## 🚀 **Siguiente Paso - REINICIAR API GATEWAY:**

```bash
# En la terminal del API Gateway, presiona Ctrl+C y luego:
cd api-gateway
npm run start:dev
```

## 📝 **Test después del reinicio:**

### POST Request:
```
URL: http://localhost:3000/faq
Headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer <tu-token>"
}
Body: {
  "pregunta": "¿Cuáles son sus horarios?",
  "respuesta": "Atendemos de 8am a 6pm",
  "grupoId": 1
}
```

## 🎯 **URLs Corregidas:**
- `POST /faq` → `http://localhost:3002/faq` ✅
- `GET /faq` → `http://localhost:3002/faq` ✅
- `POST /grupo-faq` → `http://localhost:3002/grupo-faq` ✅
- `GET /grupo-faq` → `http://localhost:3002/grupo-faq` ✅

**¡Reinicia el API Gateway y prueba de nuevo!** 🎉
