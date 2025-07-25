# 🧪 Plan de Pruebas - ProyectoChatbotFQA

## 📋 **Tests Manuales (Postman/Thunder Client)**

### **1. Pruebas de Autenticación**

#### **1.1 Registro de Usuario**
```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "nombre": "Usuario Test",
  "email": "test@example.com", 
  "password": "123456",
  "rol": "USUARIO"
}
```

**Resultado esperado:** ✅ Usuario creado exitosamente

#### **1.2 Login de Usuario**
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}
```

**Resultado esperado:** ✅ Token JWT devuelto

#### **1.3 Obtener Perfil (con JWT)**
```http
GET http://localhost:3000/auth/profile
Authorization: Bearer {TOKEN_AQUI}
```

**Resultado esperado:** ✅ Datos del usuario

---

### **2. Pruebas del Chatbot (Público)**

#### **2.1 Mensaje al Chatbot (Sin autenticación)**
```http
POST http://localhost:3000/chatbot/message
Content-Type: application/json

{
  "message": "Hola, ¿cómo estás?",
  "sessionId": "test-session-123"
}
```

**Resultado esperado:** ✅ Respuesta del chatbot (Dialogflow o IA)

#### **2.2 Chatbot con Query GET (Compatibilidad)**
```http
GET http://localhost:3000/chatbot/message?q=¿Cuáles son sus horarios?&session=test-123
```

**Resultado esperado:** ✅ Respuesta del chatbot

---

### **3. Pruebas de Analytics (Con JWT)**

#### **3.1 Obtener Analytics (Usuario autenticado)**
```http
GET http://localhost:3000/chatbot/analytics
Authorization: Bearer {TOKEN_AQUI}
```

**Resultado esperado:** ✅ Estadísticas de interacciones

---

### **4. Pruebas de FAQ**

#### **4.1 Obtener FAQs (Público)**
```http
GET http://localhost:3000/faq
```

**Resultado esperado:** ✅ Lista de FAQs

#### **4.2 Crear FAQ (Con JWT)**
```http
POST http://localhost:3000/faq
Authorization: Bearer {TOKEN_AQUI}
Content-Type: application/json

{
  "pregunta": "¿Cuál es el horario de atención?",
  "respuesta": "Lunes a viernes de 8:00 AM a 6:00 PM",
  "grupoId": 1
}
```

**Resultado esperado:** ✅ FAQ creada

---

### **5. Pruebas de Tickets (Con JWT + Admin)**

#### **5.1 Crear Ticket**
```http
POST http://localhost:3000/chatbot/ticket
Authorization: Bearer {TOKEN_AQUI}
Content-Type: application/json

{
  "asunto": "Problema con mi cuenta",
  "dui": "01234567-8"
}
```

**Resultado esperado:** ✅ Ticket creado

#### **5.2 Ver Tickets (Solo ADMIN)**
```http
GET http://localhost:3000/chatbot/tickets
Authorization: Bearer {TOKEN_ADMIN_AQUI}
```

**Resultado esperado:** ✅ Lista de tickets (solo si es ADMIN)

---

## 🔍 **Tests de Casos de Error**

### **6.1 JWT Inválido**
```http
GET http://localhost:3000/auth/profile
Authorization: Bearer token_falso
```

**Resultado esperado:** ❌ 401 Unauthorized

### **6.2 Sin JWT en endpoint protegido**
```http
GET http://localhost:3000/chatbot/analytics
```

**Resultado esperado:** ❌ 401 Unauthorized

### **6.3 Usuario sin permisos de admin**
```http
GET http://localhost:3000/chatbot/tickets
Authorization: Bearer {TOKEN_USUARIO_NORMAL}
```

**Resultado esperado:** ❌ Error de permisos

---

## ⚙️ **Tests de Arquitectura**

### **7.1 Verificar que JWT solo se valida en API Gateway**
- ✅ Auth Service debe generar tokens
- ✅ API Gateway debe validar tokens  
- ✅ Chatbot Service NO debe tener validación JWT
- ✅ Headers internos (x-user-id, x-user-role) deben funcionar

### **7.2 Verificar comunicación entre microservicios**
- ✅ API Gateway → Auth Service
- ✅ API Gateway → FAQ Service
- ✅ API Gateway → Chatbot Service
- ✅ Chatbot Service debe recibir contexto via headers

---

## 📊 **Checklist de Funcionalidades**

- [ ] Registro de usuarios
- [ ] Login con JWT
- [ ] Validación de tokens en API Gateway
- [ ] Chat público (sin auth)
- [ ] Analytics con autenticación
- [ ] CRUD de FAQs
- [ ] Sistema de tickets
- [ ] Roles (ADMIN vs USUARIO)
- [ ] Headers internos funcionando
- [ ] Base de datos PostgreSQL conectada
- [ ] Dialogflow/OpenAI respondiendo
- [ ] Emails funcionando (tickets)
- [ ] WhatsApp integration (si está configurado)

---

## 🚀 **Comandos Útiles para Testing**

```bash
# Verificar que todos los servicios estén corriendo
curl http://localhost:3000/auth/profile
curl http://localhost:3001/auth/profile  
curl http://localhost:3002/faq
curl http://localhost:3003/analytics

# Ver logs de Docker
docker-compose logs -f postgres

# Verificar base de datos
# (Conectar a PostgreSQL en localhost:5433)
```
