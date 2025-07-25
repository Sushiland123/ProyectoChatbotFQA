# 📝 GUÍA PARA CREAR FAQs - SOLUCIONADO

## ✅ Problema Resuelto: 
El error de "Foreign key constraint violated" se debía a que no existían grupos FAQ en la base de datos.

## 🎯 Grupos FAQ Creados:
- **ID: 1** - Soporte Técnico
- **ID: 2** - Información General  
- **ID: 3** - Servicios
- **ID: 4** - Preguntas Frecuentes

## 📋 Cómo Crear una FAQ (POST Request):

### Endpoint:
```
POST http://localhost:3002/faq
```

### Headers:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <tu-jwt-token>"
}
```

### Body Example:
```json
{
  "pregunta": "¿Cuáles son los horarios de atención?",
  "respuesta": "Nuestros horarios de atención son de lunes a viernes de 8:00 AM a 6:00 PM",
  "multimedia": "https://example.com/horarios.jpg",
  "grupoId": 2
}
```

### ⚠️ Campos Requeridos:
- `pregunta` (string, máximo 255 caracteres)
- `respuesta` (string)
- `grupoId` (number, debe existir en la tabla GrupoFAQ)

### 🔧 Campos Opcionales:
- `multimedia` (string, URL)

## 🚀 Ejemplo de Request con curl:
```bash
curl -X POST http://localhost:3002/faq \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "pregunta": "¿Cómo puedo contactar soporte?",
    "respuesta": "Puedes contactarnos por email a soporte@empresa.com o llamando al 2222-2222",
    "grupoId": 1
  }'
```

## 📚 Endpoints Disponibles:
- `GET /grupo-faq` - Ver todos los grupos
- `POST /grupo-faq` - Crear nuevo grupo
- `GET /faq` - Ver todas las FAQs
- `POST /faq` - Crear nueva FAQ (requiere grupoId válido)
- `GET /faq/search?q=texto` - Buscar FAQs

¡Ahora ya puedes crear FAQs sin problemas! 🎉
