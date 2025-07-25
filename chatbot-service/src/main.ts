import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración global de validación
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configuración de CORS
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [
        'https://api-gateway-production-149b.up.railway.app',
        'http://api-gateway.railway.internal:3000',
        'http://localhost:3000',
        'http://localhost:3001'
      ]
    : ['http://localhost:3000', 'http://localhost:3001'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Chatbot Service API')
    .setDescription(`
      🤖 **API del Servicio de Chatbot Inteligente**
      
      Esta API proporciona un sistema completo de chatbot con las siguientes capacidades:
      
      ## 🎆 **Funcionalidades Principales**
      - **Chat Inteligente**: Respuestas mediante Dialogflow e IA
      - **Fallback Automático**: Dialogflow → OpenAI cuando no entiende
      - **Escalamiento**: Creación automática de tickets de soporte
      - **Analytics**: Métricas en tiempo real de conversaciones
      
      ## 🔄 **Flujo de Conversación**
      1. Usuario envía mensaje
      2. Sistema intenta con Dialogflow
      3. Si no entiende, usa OpenAI como fallback
      4. Si el usuario se frustra, ofrece escalamiento
      5. Crea ticket automáticamente con DUI + correo
      
      ## 📊 **Endpoints Disponibles**
      - **POST /chat/message**: Envío de mensajes
      - **GET /chat**: Compatibilidad legacy
      - **GET /analytics**: Métricas y estadísticas
      
      ## 🔑 **Autenticación**
      - No requiere JWT para uso interno
      - Soporta headers x-user-id para contexto
    `)
    .setVersion('1.0.0')
    .addTag('Chat', 'Endpoints principales del chatbot')
    .addTag('Analytics', 'Métricas y estadísticas')
    .addServer('http://localhost:3003', 'Servidor de desarrollo')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Chatbot API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2563eb; }
      .swagger-ui .scheme-container { background: #f8fafc; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      tryItOutEnabled: true,
    },
  });

  const port = process.env.PORT || 3003;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Chatbot Service corriendo en puerto ${port}`);
  console.log(`📊 Analytics disponible en puerto ${port}/analytics`);
  console.log(`🤖 Chat disponible en puerto ${port}/chat/message`);
  console.log(`📚 Documentación Swagger disponible en puerto ${port}/api/docs`);
  
  // Logs para debugging en Railway
  console.log('✅ Variables de entorno cargadas:');
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`- DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Configurada' : '❌ Faltante'}`);
  console.log(`- OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✅ Configurada' : '❌ Faltante'}`);
  console.log(`- TWILIO_ACCOUNT_SID: ${process.env.TWILIO_ACCOUNT_SID ? '✅ Configurada' : '❌ Faltante'}`);
  console.log(`- GOOGLE_PROJECT_ID: ${process.env.GOOGLE_PROJECT_ID ? '✅ Configurada' : '❌ Faltante'}`);
}

bootstrap().catch(error => {
  console.error('❌ Error al iniciar Chatbot Service:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});
