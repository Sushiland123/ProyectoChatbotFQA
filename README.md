# ProyectoChatbotFQA - Arquitectura Refactorizada

## 🏗️ **Nueva Arquitectura de Microservicios**

### **Flujo de Autenticación Centralizado**

```
Cliente → API Gateway (Puerto 3000) → Microservicios
```

### **Servicios:**

#### **1. API Gateway** (Puerto 3000)
- **Responsabilidad:** Punto de entrada único y validación JWT
- **Endpoints:**
  - `POST /auth/login` → Auth Service
  - `POST /auth/register` → Auth Service  
  - `GET /auth/profile` → Auth Service (con JWT)
  - `GET /faq` → FAQ Service
  - `POST /faq` → FAQ Service (con JWT)
  - `POST /chatbot/message` → Chatbot Service (público)
  - `GET /chatbot/analytics` → Chatbot Service (con JWT)
  - `POST /chatbot/ticket` → Chatbot Service (con JWT)
  - `GET /chatbot/tickets` → Chatbot Service (con JWT, ADMIN)

#### **2. Auth Service** (Puerto 3001)
- **Responsabilidad:** Gestión de usuarios y generación de JWT
- **Funciones:** Login, registro, gestión de usuarios
- **Base de datos:** Usuarios, clientes, tickets, interacciones

#### **3. FAQ Service** (Puerto 3002)
- **Responsabilidad:** Gestión de preguntas frecuentes
- **Funciones:** CRUD de FAQs y grupos de FAQs
- **Base de datos:** FAQs, grupos de FAQs

#### **4. Chatbot Service** (Puerto 3003)
- **Responsabilidad:** Lógica del chatbot e IA
- **Funciones:** Chat, analytics, tickets, integración con Dialogflow/OpenAI
- **Sin JWT:** Recibe contexto de usuario via headers internos

## 🔐 **Seguridad**

### **JWT Management:**
- **Generación:** Solo Auth Service
- **Validación:** Solo API Gateway
- **Clave:** `JWT_SECRET="mi_sushi"` (solo en Auth Service y API Gateway)

### **Headers Internos:**
```typescript
// API Gateway → Microservicios
headers: {
  'x-user-id': req.user.id,
  'x-user-role': req.user.rol
}
```

## 🚀 **Instalación y Ejecución SIMPLIFICADA**

### **Opción 1: Un Solo Comando (Recomendado)**

```bash
# En Windows
npm run start:dev

# En Linux/Mac  
npm run start:dev:linux
```

**¿Qué hace este comando?**
1. 📦 Instala todas las dependencias de todos los microservicios
2. 🐳 Inicia PostgreSQL en Docker
3. 🚀 Ejecuta todos los microservicios en paralelo
4. 📊 Muestra el estado de todos los servicios

### **Opción 2: Paso a Paso (Manual)**

### **1. Instalar dependencias en cada servicio:**
```bash
# API Gateway
cd api-gateway
npm install

# Auth Service
cd ../auth-service
npm install

# FAQ Service
cd ../faq-service
npm install

# Chatbot Service
cd ../chatbot-service
npm install
```

### **2. Configurar variables de entorno:**

**API Gateway (.env):**
```env
JWT_SECRET="mi_sushi"
```

**Auth Service (.env):**
```env
DATABASE_URL="postgresql://postgres:SUSER@localhost:5433/DBChatBot?schema=public"
JWT_SECRET="mi_sushi"
```

**FAQ Service (.env):**
```env
DATABASE_URL="postgresql://postgres:SUSER@localhost:5433/DBChatBot?schema=public"
```

**Chatbot Service (.env):**
```env
DATABASE_URL="postgresql://postgres:SUSER@localhost:5433/DBChatBot?schema=public"
OPENAI_API_KEY=tu_openai_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email
EMAIL_PASS=tu_password
TWILIO_ACCOUNT_SID=tu_twilio_sid
TWILIO_AUTH_TOKEN=tu_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### **3. Ejecutar servicios:**
```bash
# Opción A: Script automático (Recomendado)
npm run start:dev

# Opción B: Manual
# Terminal 1 - Auth Service
cd auth-service
npm run start:dev

# Terminal 2 - FAQ Service  
cd faq-service
npm run start:dev

# Terminal 3 - Chatbot Service
cd chatbot-service
npm run start:dev

# Terminal 4 - API Gateway (último)
cd api-gateway
npm run start:dev
```

### **4. Para detener todo:**
```bash
# Windows
stop-dev.bat

# O manualmente
docker-compose down
# + Cerrar terminales
```

## 📡 **Endpoints de la API**

### **Autenticación (via API Gateway):**
```http
POST /auth/login
POST /auth/register
GET /auth/profile (JWT requerido)
```

### **FAQs (via API Gateway):**
```http
GET /faq
POST /faq (JWT requerido)
PATCH /faq/:id (JWT requerido)
DELETE /faq/:id (JWT requerido)
```

### **Chatbot (via API Gateway):**
```http
POST /chatbot/message (público)
GET /chatbot/analytics (JWT requerido)
POST /chatbot/ticket (JWT requerido)
GET /chatbot/tickets (JWT requerido, ADMIN)
PATCH /chatbot/tickets/:id/estado (JWT requerido, ADMIN)
```

## 🛠️ **Cambios Implementados**

### ✅ **Eliminado:**
- Carpeta `auth/` del chatbot-service
- Dependencia `@nestjs/jwt` del chatbot-service
- Validación JWT duplicada en microservicios

### ✅ **Agregado:**
- Controlador de chatbot en API Gateway
- Headers internos para contexto de usuario
- Centralización de JWT en API Gateway
- Endpoints de tickets en API Gateway

### ✅ **Beneficios:**
- **Seguridad centralizada:** Solo el Gateway maneja JWT
- **Mantenimiento simplificado:** Un solo punto de autenticación
- **Escalabilidad:** Fácil agregar nuevos microservicios
- **Separación de responsabilidades:** Cada servicio tiene un propósito claro

## 🐛 **Problema Original Resuelto**

**Antes:**
```
Auth Service: JWT_SECRET="mi_sushi"
Chatbot Service: JWT_SECRET=undefined → fallback a "secreto"
❌ Tokens rechazados por claves diferentes
```

**Después:**
```
API Gateway: JWT_SECRET="mi_sushi" (valida tokens)
Chatbot Service: Sin JWT (recibe contexto via headers)
✅ Autenticación centralizada y funcionando
```
