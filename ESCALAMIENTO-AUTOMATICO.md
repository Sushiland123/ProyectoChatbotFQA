# Sistema de Escalamiento Automático del Chatbot

## 🎯 Funcionamiento

El chatbot ahora incluye un sistema inteligente de escalamiento automático que funciona en tres niveles:

### 1. **Dialogflow (Primer Nivel)**
- Intenta responder usando intenciones predefinidas
- Si no encuentra una intención válida, pasa al siguiente nivel

### 2. **IA/OpenAI (Segundo Nivel)**
- Se activa cuando Dialogflow no puede responder
- Usa GPT-3.5-turbo para generar respuestas contextuales
- Detecta automáticamente cuando no puede ayudar

### 3. **Escalamiento a Soporte (Tercer Nivel)**
- Se activa automáticamente después de 2 fallos consecutivos de IA
- También se puede activar manualmente con frases clave

## 🔄 Flujo de Escalamiento

```
Usuario envía mensaje
       ↓
  Dialogflow intenta responder
       ↓
  ¿Respuesta válida?
       ↓ No
  IA intenta responder
       ↓
  ¿IA puede ayudar?
       ↓ No (2 veces)
  Ofrecer escalamiento automático
       ↓
  Usuario proporciona DUI + email
       ↓
  Crear ticket de soporte
```

## 📝 Frases que Activan Escalamiento Manual

- "no entiendo"
- "sigo sin entender" 
- "no me ayudó"
- "no me sirve"
- "quiero hablar con alguien"

## 🧪 Testing del Escalamiento

Para probar el escalamiento automático:

1. **Forzar fallo de IA**: Envía "test fallback" o "prueba fallo"
2. **Repetir 2 veces**: Esto activará el escalamiento automático
3. **Proporcionar datos**: Formato: `01234567-8 correo@ejemplo.com`

## 📊 Seguimiento de Sesiones

El sistema rastrrea:
- Número de intentos fallidos por sesión
- Última respuesta fallida
- Estado de escalamiento

## 🎫 Creación de Tickets

Cuando se escala:
- Se crea automáticamente un ticket con contexto
- Se registra la interacción como escalada
- Se envía confirmación al usuario
- Se limpia la sesión

## 🔧 Configuración

### Variables de Entorno Requeridas:
- `OPENAI_API_KEY`: Para el servicio de IA
- `DATABASE_URL`: Para almacenar interacciones y tickets

### Límites Configurables:
- Intentos antes de escalamiento: **2 fallos**
- Timeout de sesión: **Hasta limpiar manualmente**

## 📈 Métricas

El sistema registra:
- Origen de cada respuesta (DIALOGFLOW/IA)
- Escalamientos realizados
- Tickets creados automáticamente
