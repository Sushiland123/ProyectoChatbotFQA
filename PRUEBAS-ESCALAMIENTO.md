# 🧪 Guía de Pruebas del Sistema de Escalamiento

## Configuración de Pruebas

### 1. Iniciar Servicios
```bash
# Terminal 1: API Gateway
cd api-gateway
npm run start:dev

# Terminal 2: Chatbot Service  
cd chatbot-service
npm run start:dev

# Terminal 3: Auth Service
cd auth-service  
npm run start:dev

# Terminal 4: FAQ Service
cd faq-service
npm run start:dev
```

### 2. URL de Pruebas
- **API Gateway**: `http://localhost:3000/chat/message`
- **Chatbot Direct**: `http://localhost:3003/chat/message`

## 🔍 Casos de Prueba

### Caso 1: Escalamiento Automático por Fallos de IA

**Paso 1:** Enviar mensaje que force fallo de IA
```json
POST http://localhost:3000/chat/message
{
  "message": "test fallback",
  "sessionId": "test-session-1"
}
```
**Respuesta esperada:** Respuesta de IA indicando que no puede ayudar + sugerencia de soporte

**Paso 2:** Repetir el mismo mensaje
```json
POST http://localhost:3000/chat/message
{
  "message": "test fallback", 
  "sessionId": "test-session-1"
}
```
**Respuesta esperada:** Ofrecimiento automático de escalamiento

**Paso 3:** Proporcionar datos de contacto
```json
POST http://localhost:3000/chat/message
{
  "message": "01234567-8 test@ejemplo.com",
  "sessionId": "test-session-1"
}
```
**Respuesta esperada:** Confirmación de ticket creado

### Caso 2: Escalamiento Manual

**Paso 1:** Enviar frase de escalamiento
```json
POST http://localhost:3000/chat/message
{
  "message": "no me ayudó",
  "sessionId": "test-session-2"
}
```
**Respuesta esperada:** Solicitud inmediata de datos de contacto

**Paso 2:** Proporcionar datos
```json
POST http://localhost:3000/chat/message
{
  "message": "01234567-8 manual@ejemplo.com",
  "sessionId": "test-session-2"
}
```
**Respuesta esperada:** Ticket creado

### Caso 3: Flujo Normal (Sin Escalamiento)

**Paso 1:** Consulta general
```json
POST http://localhost:3000/chat/message
{
  "message": "¿Cuáles son sus horarios?",
  "sessionId": "test-session-3"
}
```
**Respuesta esperada:** Respuesta de Dialogflow o IA exitosa

**Paso 2:** Otra consulta exitosa
```json
POST http://localhost:3000/chat/message
{
  "message": "¿Cómo puedo contactarlos?",
  "sessionId": "test-session-3"
}
```
**Respuesta esperada:** Respuesta normal sin escalamiento

## 📊 Verificar Resultados

### En la Base de Datos:
```sql
-- Ver interacciones recientes
SELECT * FROM "Interaccion" ORDER BY "createdAt" DESC LIMIT 10;

-- Ver tickets creados
SELECT * FROM "Ticket" ORDER BY "createdAt" DESC LIMIT 5;

-- Ver clientes creados
SELECT * FROM "Cliente" ORDER BY "createdAt" DESC LIMIT 5;
```

### En los Logs del Servidor:
- Buscar logs de "🤖 Usando IA como fallback"
- Buscar logs de "✅ Respuesta de Dialogflow"
- Verificar creación de tickets

## ⚠️ Datos de Prueba

### DUIs Válidos para Testing:
- `01234567-8`
- `98765432-1` 
- `11111111-1`

### Emails de Testing:
- `test@ejemplo.com`
- `prueba@test.com`
- `escalamiento@demo.com`

## 🔄 Reset de Sesiones

Para limpiar sesiones de prueba, reiniciar el chatbot-service o usar diferentes `sessionId`.

## 📝 Checklist de Pruebas

- [ ] Escalamiento automático tras 2 fallos
- [ ] Escalamiento manual con frases clave
- [ ] Creación correcta de tickets
- [ ] Registro de interacciones en DB
- [ ] Reset de contadores tras respuesta exitosa
- [ ] Validación de formato DUI + email
- [ ] Mensajes de confirmación amigables
