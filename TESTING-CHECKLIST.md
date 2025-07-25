# ✅ Checklist de Pruebas Rápidas

## 🚀 **Antes de empezar:**
- [ ] Todos los servicios están ejecutándose (`npm run start:dev`)
- [ ] PostgreSQL está corriendo en Docker
- [ ] No hay errores en las consolas de los servicios

## 🧪 **Pruebas Automatizadas:**

### **Ejecutar todas las pruebas:**
```bash
npm test
```

### **Resultados esperados:**
- [ ] ✅ Usuario registrado correctamente
- [ ] ✅ Admin registrado correctamente  
- [ ] ✅ Login exitoso - Token obtenido
- [ ] ✅ Login admin exitoso - Token obtenido
- [ ] ✅ Perfil obtenido correctamente
- [ ] ✅ Chatbot respondió correctamente
- [ ] ✅ Analytics obtenido correctamente
- [ ] ✅ FAQs obtenidas correctamente
- [ ] ✅ JWT inválido rechazado correctamente
- [ ] ✅ Endpoint protegido sin JWT rechazado correctamente
- [ ] ✅ Microservicio funciona sin validación JWT

## 🔗 **Pruebas Manuales Básicas:**

### **1. Chatbot Público (Sin autenticación):**
```bash
curl -X POST http://localhost:3000/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola", "sessionId": "test"}'
```
**Esperado:** Respuesta del chatbot

### **2. Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "123456"}'
```
**Esperado:** Token JWT

### **3. Perfil con JWT:**
```bash
curl -H "Authorization: Bearer TU_TOKEN_AQUI" \
  http://localhost:3000/auth/profile
```
**Esperado:** Datos del usuario

## 🏗️ **Verificación de Arquitectura:**

### **JWT solo en API Gateway:**
- [ ] Auth Service genera tokens ✅
- [ ] API Gateway valida tokens ✅  
- [ ] Chatbot Service NO valida JWT ✅
- [ ] Headers internos funcionan ✅

### **Comunicación entre servicios:**
- [ ] API Gateway → Auth Service ✅
- [ ] API Gateway → FAQ Service ✅
- [ ] API Gateway → Chatbot Service ✅
- [ ] Headers `x-user-id` y `x-user-role` ✅

## 🎯 **Pruebas de Roles:**

### **Usuario Normal:**
- [ ] Puede hacer login ✅
- [ ] Puede usar chatbot ✅
- [ ] Puede ver analytics ✅
- [ ] NO puede ver tickets de todos ❌

### **Usuario Admin:**
- [ ] Puede hacer login ✅
- [ ] Puede ver todos los tickets ✅
- [ ] Puede cambiar estado de tickets ✅

## 🚨 **Pruebas de Error:**

- [ ] JWT inválido → 401 Unauthorized ✅
- [ ] Sin JWT en endpoint protegido → 401 ✅
- [ ] Usuario normal accediendo a tickets → Error ✅
- [ ] Email duplicado en registro → Error ✅

## 📊 **Base de Datos:**

### **Verificar datos:**
```sql
-- Conectar a PostgreSQL (localhost:5433)
SELECT * FROM "Usuario";
SELECT * FROM "Cliente"; 
SELECT * FROM "Ticket";
SELECT * FROM "Interaccion";
```

## 🎉 **Si todo está ✅:**

Tu arquitectura refactorizada funciona perfectamente:
- ✅ JWT centralizado en API Gateway
- ✅ Microservicios sin duplicación de auth
- ✅ Headers internos funcionando
- ✅ Todos los endpoints operativos
- ✅ Roles y permisos correctos

## 🔧 **Si algo falla:**

1. **Verificar logs** en las ventanas de cada servicio
2. **Revisar variables de entorno** (.env files)
3. **Confirmar que PostgreSQL** esté corriendo
4. **Reiniciar servicios** si es necesario
5. **Verificar puertos** (3000, 3001, 3002, 3003)

## 📝 **Notas:**

- Los tests automáticos crean usuarios de prueba
- Puedes ejecutar `npm test` múltiples veces
- Para tests manuales detallados, usa `postman-collection.json`
- Para tests de desarrollo, usa `TESTING.md`
