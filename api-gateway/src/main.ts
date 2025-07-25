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
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Gateway - Sistema Chatbot')
    .setDescription(`
      🌐 **Gateway Principal del Sistema de Chatbot**
      
      Este es el punto de entrada principal para todo el sistema de microservicios.
      
      ## 🚀 **Microservicios Integrados**
      - **Auth Service**: Autenticación y autorización de usuarios
      - **Chatbot Service**: Motor de conversación inteligente
      - **FAQ Service**: Gestión de preguntas frecuentes
      
      ## 🔑 **Autenticación**
      - **JWT Tokens**: Para autenticación de usuarios
      - **Rate Limiting**: Protección contra abuso
      - **CORS**: Configurado para frontend
      
      ## 📌 **Rutas Principales**
      - **/auth/**: Autenticación y registro
      - **/chat/**: Interacción con chatbot
      - **/faq/**: Gestión de FAQ
      - **/analytics/**: Métricas del sistema
    `)
    .setVersion('1.0.0')
    .addTag('Auth', 'Autenticación y autorización')
    .addTag('Chat', 'Chatbot y conversaciones')
    .addTag('FAQ', 'Preguntas frecuentes')
    .addTag('Analytics', 'Métricas y estadísticas')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtenido del endpoint /auth/login',
      },
      'access-token',
    )
    .addServer('http://localhost:3000', 'API Gateway (desarrollo)')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'API Gateway Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #059669; }
      .swagger-ui .scheme-container { background: #ecfdf5; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      tryItOutEnabled: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  
  console.log('🌐 API Gateway corriendo en http://localhost:3000');
  console.log('📚 Documentación Swagger disponible en http://localhost:3000/api/docs');
  console.log('🔑 Auth: http://localhost:3000/auth/*');
  console.log('🤖 Chat: http://localhost:3000/chat/*');
  console.log('❓ FAQ: http://localhost:3000/faq/*');
}

bootstrap();
