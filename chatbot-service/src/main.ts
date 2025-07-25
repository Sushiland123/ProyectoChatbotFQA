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
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
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

  await app.listen(process.env.PORT ?? 3003);
  
  console.log('🚀 Chatbot Service corriendo en http://localhost:3003');
  console.log('📊 Analytics disponible en http://localhost:3003/analytics');
  console.log('🤖 Chat disponible en http://localhost:3003/chat/message');
  console.log('📚 Documentación Swagger disponible en http://localhost:3003/api/docs');
}

bootstrap();
